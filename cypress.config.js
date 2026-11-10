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

const require = createRequire(import.meta.url);

export default defineConfig({
  defaultCommandTimeout: 12000,
  loadMoreWaitTime: 0,
  getSelectionsWaitTime: 500,
  sortWaitTime: 1000,
  video: true,
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000'
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
  }
});
