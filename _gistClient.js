const request = require('request-promise-native')

//======================================
//Use following to enable detailed logs:
//request.debug = true;
//======================================

const config = require('./config.json');
const API_URL = config.URL
const GistUserName = config.GistUserName

let GistClient = function () {

    this.assignToken = function (token) {
        this.token = token
        return this
    }

    this.unAssignToken = function () {
        this.token = null
        return this
    }

    this._prepareOptions = function (methodName, resourse) {

        const authHeader = this.token ? { 'Authorization': 'Bearer ' + this.token } : {}
        var userAgent = { 'User-Agent': 'NodeJsTest' }

        var options = {
            method: methodName,
            url: API_URL + resourse,
            headers: Object.assign(authHeader, userAgent),
            simple: false,
            resolveWithFullResponse: true,
            body: {},
            json: true // Automatically stringifies the body to JSON
        }

        return options
    }

    this.getById = function (gistId) {

        var options = this._prepareOptions('GET', `/gists/${gistId}`)
        var result = request(options).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error)
        })
        return result
    }

    this.getAll = function () {

        var options = this._prepareOptions('GET', `/gists`)

        var result = request(options).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error)
        })
        return result
    }
    this.getAllGistsOfUser = function () {

        var options = this._prepareOptions('GET', `/users/` + GistUserName + `/gists`)

        var result = request(options).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error)
        })
        return result
    }

    this.createGist = function (body) {

        var options = this._prepareOptions('POST', `/gists`)
        options.body = JSON.parse(body)

        var result = request(options).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error)
        })

        return result
    }

    this.deleteGist = function (gistId) {

        var options = this._prepareOptions('DELETE', `/gists/${gistId}`)

        var result = request(options).then(function (response) {

            return response
        }).catch(function (error) {
            console.log(error)
        })
        return result
    }

    this.updateGist = function (gistId, body) {
        var options = this._prepareOptions('PATCH', `/gists/${gistId}`)
        options.body = JSON.parse(body)

        var result = request(options).then(function (response) {
            return response
        }).catch(function (error) {
            console.log(error)
        })
        return result
    }
}

module.exports = GistClient
