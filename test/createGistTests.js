
var chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect

const config = require("../config.json");
const GistClient = require("../_gistClient");
const gistClient = new GistClient();

describe("POST gist tests", function () {

    context("Validation for invalid input", function () {
        gistClient.assignToken(config.AuthToken)

        it("Files section cannot be empty", async function () {
            var result = await gistClient.createGist(
                `{
                    "description": "Test",
                    "public": true,
                    "files": {} 
                }`)
            expect(result.statusCode, "Unexpected status code").to.equal(422)
            expect(result.body.message, "Unexpected error message").to.equal("Validation Failed")
            expect(result.body.errors[0].code, "Unexpected error code").to.equal("missing_field")
        });

        it("File content cannot be empty", async function () {
            var result = await gistClient.createGist(
                `{
                    "description": "Test",
                    "public": true,
                    "files": {
                        "test.txt": {
                            "content": ""
                        }
                    }
                }`)
            expect(result.statusCode, "Unexpected status code").to.equal(422)
            expect(result.body.message, "Unexpected error message").to.equal("Validation Failed")
            expect(result.body.errors[0].code, "Unexpected error code").to.equal("missing_field")
        });

        it("Non boolean 'Public' flag is not allowed", async function () {
            var result = await gistClient.createGist(
                `{
                    "description": "Test",
                    "public": "test",
                    "files": {
                        "test.txt": {
                            "content": ""
                        }
                    }
                }`)
            expect(result.statusCode, "Unexpected status code").to.equal(422)
            expect(result.body.message, "Unexpected error message").to.contain("Invalid request")
        });
    });

    context("Create gists", function () {

        context("POST public gist and verify created gist data", function () {
            gistClient.assignToken(config.AuthToken)
            var gistId = 0
            var _description = "Public gist"
            var _fileName = "test.txt"
            var _content = "class HelloWorld\\n   def initialize(name)\\n"
            var jsonBody = `
            {
                "description": "` + _description + `",
                "public": true,
                "files": {
                    "` + _fileName + `": {
                        "content": "` + _content + `"
                    }
                }
            }`

            it("Should create public gist", async function () {
                var gist = await gistClient.createGist(jsonBody)
                expect(gist.statusCode, "Unexpected status code").to.equal(201)
                gistId = gist.body.id
            });

            it("Get gist by id and validate response", async function () {
                var result = await gistClient.getById(gistId)
                expect(result.statusCode, "Unexpected error code").to.equal(200)
                expect(result.body.id, "Unexpected gist id").to.equal(gistId);
                expect(result.body.description, "Unexpected description").to.equal(_description);
                expect(result.body.public, "Public expected to be true").to.be.true;
                expect(Object.keys(result.body.files)[0], "Unexpected file name").to.equal(_fileName);
                expect(result.body.url, "Unexpected url").to.be.equal(config.URL + '/gists/' + gistId);

                var actualContent = result.body.files[_fileName].content.replace(/\n/g, "\\n");
                expect(actualContent, "Unexpected file content").to.deep.equal(_content);

            });

            it("Postcondition: Clean up created gist", async function () {
                await gistClient.deleteGist(gistId);
            });
        });
    });
});