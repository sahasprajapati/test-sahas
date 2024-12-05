// server/firebaseHandler.js (server-side file)
import { getDatabase, ref, query, orderByChild, limitToLast, onChildAdded, off, Query } from 'firebase/database';
import { firebaseApp, initializeFirebase } from './initializeFirebase';

export const UseRealtimeTask = async ({config, onNewTask}:any ) => {
    if (!firebaseApp) initializeFirebase();
    const database = getDatabase(firebaseApp);
    const firebaseRefs: Query[] = [];

    const isFeedDuplicated = (task: { id: any; }) => {
        return firebaseRefs.some((ref:any) => {
            return ref.key === task.id
        });
    };

    const newTasksCallback = (snapshot: { val: () => any; }) => {
        const task = snapshot.val();
        if (task && !isFeedDuplicated(task)) {
            onNewTask(task);
        }
    };
    
    config.deckSources.forEach((source: string) => {
        const formattedSource = source.replace(/\./g, "");
        const refUrl = `articles/${formattedSource}`;
        const dbRef = ref(database, refUrl);
        const orderedRef = query(dbRef, orderByChild("contentCreated"), limitToLast(1));
        onChildAdded(orderedRef, newTasksCallback);
        firebaseRefs.push(orderedRef);
    });

    return () => {
        firebaseRefs.forEach(dbRef => off(dbRef, "child_added", newTasksCallback));
    };
};
