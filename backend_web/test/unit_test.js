let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index.js");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Hiring :P API', () => {

    /**
     * Test the GET route on companies
     */
    describe("GET /companies", () => {
        it("It should GET all the companies", (done) => {
            let companyId = Math.floor(Math.random() * Math.floor(1000));
            chai.request(server)
                .get("/companies")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('Array');
                    response.body[companyId].should.be.a('object'); // making sure that it's an actual object
                    response.body[companyId].should.have.property('id'); // making sure we have an id for each element
                    done();
                });
        });
    });


    /**
     * Test the GET (by id) on companies
     */
    describe("GET /companies/:id", () => {
        it("It should GET a company by ID", (done) => {
            let companyId = Math.floor(Math.random() * Math.floor(1000));
            console.log("We are just trying to get the company detail of a random id :" + companyId);
            chai.request(server)
                .get("/companies/" + companyId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('id');
                    response.body.should.have.property('source_id');
                    response.body.should.have.property('name');
                    done();
                });
        });



    });
    /**
     * Test the GET (by id) matching companies
     */
    describe("GET /matches/:id", () => {
        it("It should GET the matching companies for a company by ID", (done) => {
            let companyId = 3880;
            console.log("We are just trying to fetch matches for comapny :" + companyId);
            chai.request(server)
                .get("/matches/" + companyId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('Array');
                    response.body[0].should.have.property('id');
                    response.body[0].should.have.property('source_id');
                    response.body[0].should.have.property('name');
                    done();
                });
        });



    });
});
