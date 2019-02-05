const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisement/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisement", () => {
  beforeEach((done) => {
    this.advertisement;
    sequelize.sync({force: true}).then((res) => {

      Advertisement.create({
         title: "JS Frameworks",
         description: "There is a lot of them"
      })
      .then((advertisement) => {
        this.advertisement = advertisement;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("GET /advertisement", () => {
    it("should return a status code 200 and all ads", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Advertisement");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("GET /advertisement/new", () => {
    it("should render a new advertisement form", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Advertisement");
        done();
      });
    });
  });

  describe("POST /advertisement/create", () => {
    const options = {
      url: `${base}create`,
      form: {
        title: "fabulous shoes",
        description: "Find your fabulous shoes here."
      }
    };
    it("should create a new ad and redirect", (done) => {
      request.post(options, (err, res, body) => {
          Advertisement.findOne({where: {title: "fabulous shoes"}})
          .then((advertisement) => {
            expect(res.statusCode).toBe(303);
            expect(advertisement.title).toBe("fabulous shoes");
            expect(advertisement.description).toBe("Find your fabulous shoes here.");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        }
      );
    });
  });

  describe("GET /advertisement/:id", () => {
    it("should render a view with the selected advertisement", (done) => {
      request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("POST /advertisement/:id/destroy", () => {
    it("should delete the ad with the associated ID", (done) => {
      Advertisement.all()
      .then((advertisement) => {
        const advertisementCountBeforeDelete = advertisement.length;
        expect(advertisementCountBeforeDelete).toBe(1);
        request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
          Advertisement.all()
          .then((advertisement) => {
            expect(err).toBeNull();
            expect(advertisement.length).toBe(advertisementCountBeforeDelete - 1);
            done();
          })
        });
      });
    });
  });

  describe("GET /advertisement/:id/edit", () => {
    it("should render a view with an edit ad form", (done) => {
      request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Advertisement");
        expect(body).toContain("JS Frameworks");
        done();
      });
    });
  });

  describe("POST /advertisement/:id/update", () => {
    it("should update the ad with the given values", (done) => {
       const options = {
          url: `${base}${this.advertisement.id}/update`,
          form: {
            title: "fabulous shoes",
            description: "Find your fabulous shoes here."
          }
        };
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Advertisement.findOne({
            where: { id: this.advertisement.id }
          })
          .then((advertisement) => {
            expect(advertisement.title).toBe("fabulous shoes");
            done();
          });
        });
    });
  });

});
