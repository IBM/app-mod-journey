# Application Modernization Journey

This will be an opinionated set of scenarios for modernizing a customer's java application estate using Transformation Advisor. 
It will be an interactive tree of options for each stage in the app mod journey backed by descriptions, docs and videos. 
It will cover the full end-end from collection to deployment as micro-services. 
It will allow customers and sellers to see build a full path with their ideal options and show the art-of-the-practical

## Pre-requisites
- npm (I have version 6.14.18 but other versions should work fineß)

## Building the code
 - Clone the repo
 - Run `npm i` (needed first time only, or after package updates)
 - Run this command to build the code
`npm run build`
 - The 'build' directory will be created 
 - You can run the code locally by hitting 'build/index.html' from your browser

## Developing the code
 - You can setup a a full npm + node server environment to dynamically test your updates
 - However, the build is so fast it is pretty much as quick to manually trigger and the build and then refresh your browser page, no server needed

## Updating the tree
 - The tree is built dynamically from a json file => 'src/examples/ta-generate.json'
 - Each node in the tree is defined in json with attributes describing it and also it's position in the tree
 - The 'childPointers' array indicates what nodes this node will point to
 - A node never defines who points to it, if you want to move a node then you need to change what nodes point to it!
 - 'docs' & 'videos' attributes define a URL to follow when they are clicked. If these are not dfined they will appear in the UI as grey, un-clickable text
 - 'description' attribute is what you will see when you mouse over a node
 
## Hosted site
 - The git-pages for this repo hosts the site and can be found here: https://ibm.github.io/app-mod-journey

## How to update the hosted site
 - Because the code runs statically  in the browser and does not need a server, we can host the whole interactive site in the git-pages
 - This is how you update the hosted site
     - Build the code: `npm run build`
     - Copy the contents of the 'build' directory into 'docs/tree'
     - Look in git and some of the files in 'docs/tree' will be changed
     - Commit these, push the branch and merge into main
     - About 5 minutes after the merge to main you should see the update

