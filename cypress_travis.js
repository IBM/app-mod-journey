/****************************************
 *
 * Licensed Materials -Property of IBM
 * © Copyright IBM Corp. 2019
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 ****************************************/

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 12000,
  loadMoreWaitTime: 0,
  getSelectionsWaitTime: 500,
  sortWaitTime: 1000,
  video: true,
  e2e: {
    experimentalRunAllSpecs: true,
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000'
  }
});