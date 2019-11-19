const chai = require('chai')
chai.use(require('chai-json'));
chai.use(require('chai-subset'));
const expect = chai.expect;
const GistClient = require("../_gistClient");
const gistClient = new GistClient();
const config = require("../config.json");


describe("Rate limit tests", function () {

    describe("Validate rate limits headers", function () {
        var currentLimit = 0
        it("Validate unauthorized user rate limit", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.getAllGistsOfUser()

            expect(result.statusCode).to.equal(200)
            expect(result.headers["x-ratelimit-limit"]).to.equal(config.UnauthenticatedRequestsRateLimit)
            currentLimit = result.headers["x-ratelimit-remaining"]
        });

        it("Remaining amount should decrease after last request", async function () {
            gistClient.unAssignToken()
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.headers["x-ratelimit-limit"]).to.equal(config.UnauthenticatedRequestsRateLimit)
            var expectedRemainingLimit = (currentLimit - 1).toString()
            expect(result.headers["x-ratelimit-remaining"]).to.equal(expectedRemainingLimit)
        });

        it("Validate authorized user rate limit", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.headers["x-ratelimit-limit"]).to.equal(config.AuthenticatedRequestsRateLimit)
            currentLimit = result.headers["x-ratelimit-remaining"]
        });

        it("Remaining amount should decrease after last request", async function () {
            gistClient.assignToken(config.AuthToken)
            var result = await gistClient.getAllGistsOfUser()
            expect(result.statusCode).to.equal(200)
            expect(result.headers["x-ratelimit-limit"]).to.equal(config.AuthenticatedRequestsRateLimit)
            var expectedRemainingLimit = (currentLimit - 1).toString()
            expect(result.headers["x-ratelimit-remaining"]).to.equal(expectedRemainingLimit)
        });

    });
});
