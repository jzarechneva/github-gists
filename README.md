# github-gists
Automated tests that cover the basics of authorization flow, CRUD operations and rate limits cases using GitHub Gists API

---
## Requirements

### npm

You will need npm installed on your machine.
- #### Installation on Windows or Mac

 	Just go on [official npm website](https://www.npmjs.com/get-npm) and download the installer.
	Also, be sure to have `git` available in your PATH, `npm` might need it
    
- #### Installation on Linux
	
	```
    sudo apt-get install npm
    ```
	

### Install mocha and report packages
```
npm install mocha
npm install mochawesome
```
### Install project dependencies
```
npm install
```

## Edit config.json
Please check `config.json` file in project root:
1. You need to replace **GistUserName** with valid github username
2. You need to replace **AuthToken** with token that have gist (Create gists) right enabled
3. You need to replace **TokenWithoutCreateGistsRights** with token that DOES NOT have gist (Create gists) right enabled

You can generate tokens here https://github.com/settings/tokens

## Run tests
```
npm test
```
Report will be available in project folder `test_results`
