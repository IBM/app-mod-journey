/****************************************
 *
 * Licensed Materials -Property of IBM
 * © Copyright IBM Corp. 2019
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 ****************************************/

import { defineConfig } from 'cypress';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  defaultCommandTimeout: 12000,
  loadMoreWaitTime: 0,
  getSelectionsWaitTime: 500,
  sortWaitTime: 1000,
  video: true,
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      const plugin = require(path.join(__dirname, 'cypress/plugins/index.js'));
      return plugin(on, config);
    },
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://127.0.0.1:3000'
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
});
