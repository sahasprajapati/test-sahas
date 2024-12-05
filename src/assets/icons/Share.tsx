import React from 'react';
import type { SVGProps } from 'react';

export function Share(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M18.002 21.5q-1.04 0-1.771-.73q-.731-.728-.731-1.77q0-.2.035-.413q.034-.214.103-.402l-7.742-4.562q-.367.414-.854.645Q6.556 14.5 6 14.5q-1.042 0-1.77-.728q-.73-.729-.73-1.77t.73-1.771T6 9.5q.556 0 1.042.232q.487.231.854.645l7.742-4.562q-.069-.188-.103-.402Q15.5 5.2 15.5 5q0-1.042.729-1.77q.728-.73 1.769-.73t1.771.729t.731 1.769t-.73 1.771Q19.042 7.5 18 7.5q-.556 0-1.042-.232q-.487-.231-.854-.645l-7.742 4.562q.069.188.103.4q.035.213.035.411t-.035.415t-.103.404l7.742 4.562q.367-.414.854-.645q.486-.232 1.042-.232q1.042 0 1.77.729q.73.728.73 1.769t-.728 1.771t-1.77.731M18 6.5q.617 0 1.059-.441T19.5 5t-.441-1.059T18 3.5t-1.059.441T16.5 5t.441 1.059T18 6.5m-12 7q.617 0 1.059-.441T7.5 12t-.441-1.059T6 10.5t-1.059.441T4.5 12t.441 1.059T6 13.5m12 7q.617 0 1.059-.441T19.5 19t-.441-1.059T18 17.5t-1.059.441T16.5 19t.441 1.059T18 20.5m0-1.5"></path></svg>);
}