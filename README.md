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
Run this commands from root project directory:

```
npm install mocha
npm install mochawesome
```
### Install project dependencies
Run this command from root project directory:

```
npm install
```

## Edit config.json
Open `config.json` file in project root:
1. Replace **GistUserName** with valid github username
2. Replace **AuthToken** with token that haw gist (Create gists) right enabled
3. Replace **TokenWithoutCreateGistsRights** with token that DOES NOT have gist (Create gists) right enabled

You can generate tokens here https://github.com/settings/tokens

## Run tests
Run this command from root project directory:

```
npm test
```
Report will be available in project folder `test_results`
