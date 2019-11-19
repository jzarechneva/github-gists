
var chai = require('chai');
const GistClient = require("../_gistClient");
const gistClient = new GistClient();
const config = require("../config.json");

const expect = chai.expect

describe("UPDATE gist tests", function () {
    const _description = "Public gist"
    const _fileName = "test.txt"
    const _content = "class HelloWorld\\n   def initialize(name)\\n"

    describe("Preconditions", function () {

        gistClient.assignToken(config.AuthToken)
        it("Should create gist", async function () {

            var jsonBody = `
            {
                "description": "` + _description + `",
                "public": false,
                "files": {
                    "` + _fileName + `": {
                        "content": "` + _content + `"
                    }
                }
            }`
            var gist = await gistClient.createGist(jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(201)
            gistId = gist.body.id
        });
    });

    context("Validation for invalid input", function () {
        gistClient.assignToken(config.AuthToken)

        it("New file content cannot be empty", async function () {
            var result = await gistClient.updateGist(gistId,
                `{
                    "description": "Test",
                    "public": true,
                    "files": {
                        "newfile.txt": {
                            "content": ""
                        }
                    }
                }`)
            expect(result.statusCode, "Unexpected status code").to.equal(422)
            expect(result.body.message, "Unexpected error message").to.equal("Validation Failed")
            expect(result.body.errors[0].code, "Unexpected error code").to.equal("missing_field")
        });

        it("Non-existing file cannot be removed", async function () {
            var result = await gistClient.updateGist(gistId,
                `{
                    "description": "Test",
                    "public": true,
                    "files": {
                        "nonexistingname.txt": null
                    }
                }`)
            expect(result.statusCode, "Unexpected status code").to.equal(422)
            expect(result.body.message, "Unexpected error message").to.equal("Validation Failed")
            expect(result.body.errors[0].code, "Unexpected error code").to.equal("missing_field")
        });
    });

    context("Update gist tests", function () {

        gistClient.assignToken(config.AuthToken)

        const _newDescription = "New Description"
        const _newFileName = "testPy.py"
        const _newContent = "test content"

        it("Update gist description and verify result", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "files": {
                    "` + _fileName + `": {
                        "content": "` + _content + `"
                    }
                }
            }`
            var gist = await gistClient.updateGist(gistId, jsonBody)

            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(gist.body.description, "Unexpected description").to.equal(_newDescription);
            expect(gist.body.public, "Public expected to be false").to.be.false;
            expect(Object.keys(gist.body.files)[0], "Unexpected file name").to.equal(_fileName);
            expect(gist.body.url, "Unexpected url").to.be.equal(config.URL + '/gists/' + gistId);
            var actualContent = gist.body.files[_fileName].content.replace(/\n/g, "\\n");
            expect(actualContent, "Unexpected file content").to.deep.equal(_content);
        });

        it("Update exisitng file content and verify result", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "files": {
                    "` + _fileName + `": {
                        "content": "` + _newContent + `"
                    }
                }
            }`
            var gist = await gistClient.updateGist(gistId, jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(gist.body.description, "Unexpected description").to.equal(_newDescription);
            expect(gist.body.public, "Public expected to be false").to.be.false;
            expect(Object.keys(gist.body.files)[0], "Unexpected file name").to.equal(_fileName);
            expect(gist.body.url, "Unexpected url").to.be.equal(config.URL + '/gists/' + gistId);
            var actualContent = gist.body.files[_fileName].content.replace(/\n/g, "\\n");
            expect(actualContent, "Unexpected file content").to.deep.equal(_newContent);
        });

        it("Update exisitng file name and verify result", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "files": {
                    "` + _fileName + `": {
                        "content": "` + _newContent + `",
                        "filename": "` + _newFileName + `"
                    }
                }
            }`
            var gist = await gistClient.updateGist(gistId, jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(gist.body.description, "Unexpected description").to.equal(_newDescription);
            expect(gist.body.public, "Public expected to be false").to.be.false;
            expect(Object.keys(gist.body.files)[0], "Unexpected file name").to.equal(_newFileName);
            expect(gist.body.url, "Unexpected url").to.be.equal(config.URL + '/gists/' + gistId);
            var actualContent = gist.body.files[_newFileName].content.replace(/\n/g, "\\n");
            expect(actualContent, "Unexpected file content").to.deep.equal(_newContent);
            //validate that file name indeed was updated and not additional file added
            expect(Object.keys(gist.body.files).length).to.be.equal(1)
        });

        it("Remove existing file and verify result", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "files": {
                    "` + _newFileName + `": null
                }
            }`

            var gist = await gistClient.updateGist(gistId, jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(Object.keys(gist.body.files).length).to.be.equal(0);
            expect(gist.body.history[0].change_status.deletions, "Deletion change not found").to.be.equal(1)

        });

        it("Verify that public parameter is ignored and stays untouched", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "public": false
            }`
            var gist = await gistClient.updateGist(gistId, jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(gist.body.description, "Unexpected description").to.equal(_newDescription);
            expect(gist.body.public, "Public expected to be false").to.be.false;
        });

        it("Verify that file name would be autogenerated if empty given", async function () {
            jsonBody = `
            {
                "description": "` + _newDescription + `",
                "files": {
                    "": {
                        "content": "test"
                    }
                }
            }`
            var gist = await gistClient.updateGist(gistId, jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(200)
            expect(gist.body.id, "Unexpected gist id").to.equal(gistId);
            expect(gist.body.description, "Unexpected description").to.equal(_newDescription);
            expect(Object.keys(gist.body.files)[0], "Unexpected file name").to.equal("gistfile1.txt");
        });
    });

    describe("Postconditions", function () {

        it("Should remove gist", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.deleteGist(gistId)
            expect(result.statusCode, "Unexpected status code").to.equal(204)
        });
    });
});