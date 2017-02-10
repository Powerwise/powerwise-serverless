import { hello } from './hello'
import { expect } from 'chai';

describe('Lambda Function: hello', () => {

    let error;
    let response;

    before('call the function', (done) => {
        hello(null, null, (err, res) => {
            error = err;
            response = res;
            done();
        });
    });

    it ('Should not return an error', () => {
        expect(error).to.be.null;
    });

    it ('Should return an object', () => {
        expect(response).to.be.an('Object');
    });

    it ('Response should have a 200 status code', () => {
        expect(response.statusCode).to.equal(200);
    });

    it ('should return a cool message', () => {
        expect(response.body).to.be.a('String');
    });
})