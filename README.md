# Application Modernization Journey

This is an opinionated set of scenarios for modernizing a customer's Java application estate using Application Modernization Accelerator. 
It is an interactive tree of options for each stage in the app mod journey backed by descriptions, docs, and videos. 
It covers the full end-to-end journey from collection to deployment as microservices. 
It allows customers and sellers to build a full path with their ideal options and see the art-of-the-practical.

## Pre-requisites
- Node.js (version 20 or higher recommended, e.g. Node 24)
- npm (version 10+)

## Developing the code
- Clone the repo
- Run `npm install` (needed first time only, or after package updates)
- Run `npm start` to launch the local development server at `http://localhost:3000` with hot module reloading

## Building the code
- Run `npm run build`
- The output of the build process is placed in the `docs/tree` directory
- You can preview the production build locally with `npm run preview`

## Running tests
- `npm test` — runs the Vitest unit and reducer test suites
- `npm run cypress` — opens Cypress for E2E and accessibility checks

## Adding docs
- All the docs referenced are located under `docs/details`
- Add the doc and then manually navigate to it. Example: https://ibm.github.io/app-mod-journey/details/mydoc.html
- You then update the tree to point to it
 
## Updating the tree
- The tree is built dynamically from a JSON file => `src/examples/ta-generate.json`
- Each node in the tree is defined in JSON with attributes describing it and its position in the tree
- The `childPointers` array indicates what nodes this node will point to
- A node never defines who points to it; if you want to move a node, update the parent node's `childPointers`
- `docs` & `videos` attributes define URLs to follow when clicked. If these are not defined, they appear in the UI as grey, unclickable text
- `description` attribute is what you will see when you mouse over a node
 
## Hosted site
- The GitHub Pages for this repo hosts the site and can be found here: https://ibm.github.io/app-mod-journey

## How to update the hosted site
- Because the code runs statically in the browser and does not need a server, we can host the whole interactive site in GitHub Pages
- A build and deploy workflow will be triggered after you merge your code to the `main` branch
    - Click the 'Actions' button in the repo, you should see a workflow started with your change
    - The workflow builds the application and deploys the contents to GitHub Pages
    - A few minutes after the workflow completes successfully, you should see the update from the GitHub Pages site
