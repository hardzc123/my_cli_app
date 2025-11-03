#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

meow(
	`
	Usage
	  $ my-cli-app

	Examples
	  $ my-cli-app
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
