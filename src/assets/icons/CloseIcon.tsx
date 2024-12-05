import React from 'react';
import type { SVGProps } from 'react';

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg className="fill-current h-4 w-4 cursor-pointer" role="button" viewBox="0 0 20 20">
			<path d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0
   c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183
   l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15
   C14.817,13.62,14.817,14.38,14.348,14.849z" />
		</svg>
	);
}