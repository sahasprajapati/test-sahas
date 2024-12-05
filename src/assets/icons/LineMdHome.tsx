import React from 'react';
import type { SVGProps } from 'react';

export function LineMdHome(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"><path strokeDasharray={15} strokeDashoffset={15} d="M4.5 21.5h15"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="15;0"></animate></path><path strokeDasharray={15} strokeDashoffset={15} d="M4.5 21.5V8M19.5 21.5V8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="15;0"></animate></path><path strokeDasharray={24} strokeDashoffset={24} d="M9.5 21.5V12.5H14.5V21.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="24;0"></animate></path><path strokeDasharray={30} strokeDashoffset={30} strokeWidth={2} d="M2 10L12 2L22 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.4s" values="30;0"></animate></path></g></svg>);
}