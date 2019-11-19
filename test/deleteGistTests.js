
var chai = require('chai');
chai.use(require('chai-string'));
const GistClient = require("../_gistClient");
const gistClient = new GistClient();
const config = require("../config.json");
const expect = chai.expect

describe("DELETE gist tests", function () {
    context("Preconditions", function () {
        gistClient.assignToken(config.AuthToken)
        var _description = "Public gist"
        var _fileName = "test.txt"
        var _content = "class HelloWorld\\n   def initialize(name)\\n"
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

        it("Should create gist", async function () {
            var gist = await gistClient.createGist(jsonBody)
            expect(gist.statusCode, "Unexpected status code").to.equal(201)
            gistId = gist.body.id
        });
    });

    context("Validation for invalid input", function () {
        it("Gist id is required to remove gist", async function () {
            var result = await gistClient.deleteGist();
            expect(result.statusCode, "Unexpected status code").to.equal(404)
        });
    });

    context("Delete gist and verify it's not found", function () {
        it("Delete gist", async function () {
            var result = await gistClient.deleteGist(gistId);
            expect(result.statusCode, "Unexpected status code").to.equal(204)
            expect(result.body, "Body is not expected in response").to.be.undefined
        });

        it("Gist should not be found by id", async function () {
            var result = await gistClient.getById(gistId)
            expect(result.statusCode, "Unexpected status code").to.equal(404)
        });
    });
});