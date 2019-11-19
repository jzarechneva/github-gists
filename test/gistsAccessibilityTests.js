const chai = require('chai')
chai.use(require('chai-json'));
chai.use(require('chai-subset'));
const expect = chai.expect;
const GistClient = require("../_gistClient");
const gistClient = new GistClient();
const config = require("../config.json");

var publicGistId = 0
var privateGistId = 0

describe("Gists accessibility tests", function () {

    describe("Preconditions", function () {

        gistClient.assignToken(config.AuthToken)

        it("Should create public gist", async function () {

            var publicGist = await gistClient.createGist(
                `{
                    "description": "Public gist",
                    "public": true,
                    "files": {
                        "test.txt": {
                            "content": "test"
                        }
                    }
                }`)

            expect(publicGist.statusCode, "Unexpected status code").to.equal(201)
            publicGistId = publicGist.body.id
        });

        it("Should create private gist", async function () {
            var privateGist = await gistClient.createGist(
                `{
                    "description": "Private gist",
                    "public": false,
                    "files": {
                        "test2.txt": {
                            "content": "test2"
                        }
                    }
                }`)
            privateGistId = privateGist.body.id

        });

    });

    describe("Validate gists accessibility", function () {

        it("Unauthorized user can get public gist by id", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.getById(publicGistId)
            expect(result.statusCode).to.equal(200)
            expect(result.body.id).to.equal(publicGistId)
        });

        it("Unauthorized user can get private gist by id", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.getById(privateGistId)
            expect(result.statusCode).to.equal(200)
        });

        it("Unauthorized user should only see public gists of user in list of gists", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.body, "Private gist is visible, which is not expected").to.not.containSubset([{ id: privateGistId }])
            expect(result.body, "Public gist is not visible as expected").to.containSubset([{ id: publicGistId }])
        });

        it("Authorized user should successfully get both gists in list of all gists", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.body, "Private gist is not visible as expected").to.containSubset([{ id: privateGistId }])
            expect(result.body, "Public gist is not visible as expected").to.containSubset([{ id: publicGistId }])
        });

        it("Authorized by token wihtout 'create gists' rights user should get only public gist", async function () {
            gistClient.assignToken(config.TokenWithoutCreateGistsRights)
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.body, "Private gist is visible, which is not expected").to.not.containSubset([{ id: privateGistId }])
            expect(result.body, "Public gist is not visible as expected").to.containSubset([{ id: publicGistId }])
        });

    });

    describe("Validate gists forbidden operations for unauthorized users", function () {

        it("Unauthorized user cannot create gists", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.createGist(`{
                "description": "Private gist",
                "public": false,
                "files": {
                    "public.txt": {
                        "content": "public"
                    }
                }
            }`)
            expect(result.statusCode).to.equal(401)
            expect(result.body.message).to.equal("Requires authentication")
        });

        it("Unauthorized user cannot delete even public gists", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.deleteGist(publicGistId)
            expect(result.statusCode).to.equal(404)
        });

        it("Authorized user with token without create gists right - cannot create gists", async function () {
            gistClient.assignToken(config.TokenWithoutCreateGistsRights)
            var result = await gistClient.createGist(`{
                "description": "Private gist",
                "public": false,
                "files": {
                    "private.txt": {
                        "content": "private"
                    }
                }
            }`)
            expect(result.statusCode).to.equal(404)
            expect(result.body.message).to.equal("Not Found")
        });
    });

    describe("Postconditions", function () {

        it("Should remove public gist", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.deleteGist(publicGistId)
            expect(result.statusCode, "Unexpected status code").to.equal(204)
        });

        it("Should remove private gist", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.deleteGist(privateGistId)
            expect(result.statusCode, "Unexpected status code").to.equal(204)
        });
    });
});
