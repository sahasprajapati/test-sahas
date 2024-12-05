import { Service, checkUserRequest } from '../services/service';
import { CheckUserRequest, Page, PageState } from '../type/kanbanTypes';
import { getDefaultPageDecks, getPageDecks, getPages } from '../config/Configuration';
import { login } from '../config/authorization';
import { queryBuilder } from '../utils';
import { getTimeZone, isFeedDuplicated } from '../Task/TaskCardFunction';
import moment from 'moment';


export const loginUser = async ({ username, password }: any) => {
  const loginResult: any = await login({ userName: username, password: password });
  if (!loginResult.result.rows || loginResult.result.rows.length === 0) {
    throw new Error('Login failed or no user data returned.');
  }

  const userRow = loginResult.result.rows[0];
  const currentUser = userRow.user_id;
  const cms_id = userRow.cms_id;
  const pass = userRow.password;
  const userId = userRow.user_id;
  const userName = userRow.user_name;
  const twitterId = userRow.twitter_id || false;

  const UserData = {
    currentUser,
    userId,
    userName,
    twitterId,
    cms_id,
    pass,
  };

  return { loginResult, UserData };
};

export const fetchRootData = async (userData: any) => {
  const {
    currentUser,
    cmsId,
    pageIndex,
    cmsUser,
    userId,
    userName,

  } = userData.UserData;

  let options: checkUserRequest = {
    cmsId: cmsId,
    pageIndex: pageIndex,
    cmsUser: undefined,
    userId: userId,
    userName: userName,
    userMail: undefined
  }
  const response: any = await Service.checkUser(options)

  //  const resultDecks = await getDefaultPageDecks(response.data.result.rows);
  const resultPageData: any = await getPages(currentUser);

  const pageColumns: any[] = await Promise.all(resultPageData.map(async (item: any) => {
    const decks: any = await getPageDecks(response.data.result.rows, item.page_id);
    const columns = decks.map((deck: any) => ({
      Deck: deck,
      tasks: [],
      searchTasks: []
    }));
    return {
      page: item,
      columns,
      columnsLength: columns.length,
      page_index: item.index
    };
  }));

  const languagesOptions: any = await Service.getLanguages();
  const languages = languagesOptions.data.languages;

  return {
    resultPageData,
    pageColumns,
    languages,
  };
};



export const fetchTasksForColumn = async (column: any, page: any) => {
  const filterOptions = {
    urgency: column.deckName === "BreakingNews" || column.deckName === 'أخبار عاجلة' ? [1, 2] : [],
    languages: column.languages,
    keywords: column.keywords,
  };

  const query = await queryBuilder(filterOptions, column.deckSources, column.deckName === "BreakingNews" || column.deckName === 'أخبار عاجلة');
  const response: any = await Service.getFeeds({
    query,
    sort: [{ "contentCreated.keyword": { order: "desc" } }],
    size: 15,
    from: 0
  });

  const tasks = response.data.reduce((acc: any, feed: any) => {
    const feedSource = feed._source;
    const timeZone = getTimeZone(feedSource.contentCreated);
    const localDate = moment(new Date()).utcOffset(-timeZone);

    if (moment(feedSource.contentCreated).isBefore(localDate) && !isFeedDuplicated(acc, feedSource)) {
      acc.push(feed);
    }
    return acc;
  }, []);

  return {
    tasks_: tasks,
    query: query,
  };
};

export const getFeed = (length: any, mounted: any, query: any, tasks: any, searchIsActive: boolean, text: any): Promise<any> => {
  return new Promise((resolve, reject) => {

    Service.getFeeds({
      query: query,// this.esQuery,
      sort: [{ "contentCreated.keyword": { order: "desc" } }],
      size: 10,
      from: length - 1
    })
      .then((response: any) => {
        const feeds = response.data;
        let array = [...tasks]
        let isEquel = false
        feeds.forEach((feed: any) => {
          let feed_ = feed._source;
          let timeZone: any = feed_?.contentCreated
            ? getTimeZone(feed_?.contentCreated)
            : "";
          let localDate =
            timeZone > 0
              ? moment(new Date(), "YYYY-MM-DD HH:mm:ss").subtract(
                timeZone,
                "hours"
              )
              : moment(new Date(), "YYYY-MM-DD HH:mm:ss").add(
                Math.abs(timeZone),
                "hours"
              );
          if (moment(new Date(feed_?.contentCreated)) < localDate) {
            if (
              !isFeedDuplicated(array, feed_)
            ) {
              //
              if (searchIsActive) {
                if (array.filter((task: any) => task._source.title.toLowerCase().includes(text.toLowerCase())))
                  array.push(feed)
              }
              else
                array.push(feed)
            }
          }
        });

        // setNewTasks(feeds)
        // setTasks(feeds)

        resolve(array);

        // if (mounted) getRealtimeFeed(false);
      })
      .catch(err => {
        console.trace(err);
        reject(err);

      });
  });

}

export const Search = (tasks: any, text: any) => {
  const result = tasks.filter((task: any) =>
    task._source.title.toLowerCase().includes(text.toLowerCase())
  );
  return result
}

export const sizeof = (obj: any[]) => {
  const bytes = JSON.stringify(obj).length;
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}


export { isFeedDuplicated };
