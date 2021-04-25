const front = require("../front");
const Book = require('../book');
const p = require('path');
const PassThrough = require('stream').PassThrough;

module.exports = class Loader {
    constructor(window){
        this.state = {
            window,
            book: null,
        };
    }

    load = async (request, callback) => {
        console.log(request);
        const path = request.url.slice(8).split('/');


        const stream = new PassThrough();

        callback({
            data: stream
        });

        switch (path.shift()) {
            case 'app':
                return front(stream);
            case 'book':

            case 'action':
                stream.push(null);
                return performAction(path[0], this.state);
            default:
                throw new Error(`cannot understand ${request.url}`);

        }
    }
}