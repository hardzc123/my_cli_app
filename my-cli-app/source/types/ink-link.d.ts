declare module 'ink-link' {
	import {FC, ReactNode} from 'react';
	import {TextProps} from 'ink';

	type LinkProps = {
		url: string;
		fallback?: boolean;
		children?: ReactNode;
	} & TextProps;

	const Link: FC<LinkProps>;
	export default Link;
}
