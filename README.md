# github-gists
Automated tests that cover the basics of authorization flow, CRUD operations and rate limits cases using GitHub Gists API

---
## Requirements

### Node

You will need Node.js installed on your machine.
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it

### Mocha and report packages
npm install -g mocha
npm install -g mochawesome

### Install project dependencies
npm install

## Config.json setup
Please select github user and generate 2 tokens https://github.com/settings/tokens

### AuthToken
Have gist (Create gists) right enabled

### TokenWithoutCreateGistsRights
Doesn't have gist (Create gists) right enabled 

## Run tests
npm test
Report will be available in project folder "test_results"