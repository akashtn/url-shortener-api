const request = require("supertest");
const app = require("./app");
const redisClient = require("./redis");

describe("URL Shortener API", () => {
  it("POST /api/v1/url/shortenNewUrl --> Shortened URL", () => {
    return request(app)
      .post("/api/v1/url/shorten")
      .send({
        longUrl:
          "https://docs.google.com/spreadsheets/d/1dKW67Fu4qCOQjUm7jYxAKtrpCnqp9AoviWV2QQMEXuQ/edit#gid=1345013622",
      })
      .expect(201)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            longUrl:
              "https://docs.google.com/spreadsheets/d/1dKW67Fu4qCOQjUm7jYxAKtrpCnqp9AoviWV2QQMEXuQ/edit#gid=1345013622",
            shortUrl: expect.any(String),
          })
        );
      });
  });

  it("POST /api/v1/url/shortenExistingUrl --> Existing shortened URL", async () => {
    const shortUrl = await redisClient.get(
      "https://docs.google.com/spreadsheets/d/1dKW67Fu4qCOQjUm7jYxAKtrpCnqp9AoviWV2QQMEXuQ/edit#gid=1345013622"
    );
    return request(app)
      .post("/api/v1/url/shorten")
      .send({
        longUrl:
          "https://docs.google.com/spreadsheets/d/1dKW67Fu4qCOQjUm7jYxAKtrpCnqp9AoviWV2QQMEXuQ/edit#gid=1345013622",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            longUrl:
              "https://docs.google.com/spreadsheets/d/1dKW67Fu4qCOQjUm7jYxAKtrpCnqp9AoviWV2QQMEXuQ/edit#gid=1345013622",
            shortUrl,
          })
        );
      });
  });

  it("POST /api/v1/url/shortenInvalidUrl --> 400, Invalid Long URL", () => {
    return request(app)
      .post("/api/v1/url/shorten")
      .send({
        longUrl: "wigbiuwriuwriuvberibveibiuertbuebrieubiruebbq23534f",
      })
      .expect(400)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            msg: "Invalid long URL",
          })
        );
      });
  });

  it("GET /code --> Return Long URL corresponding to the Short URL", async () => {
    return (
      request(app)
        // Replace code with a valid code here
        .get("/79c7jeo7")
        .expect(302)
    );
  });

  it("GET /invalidCode --> 404, No URL found", async () => {
    const longUrl = await redisClient.get("dad5od8");
    return (
      request(app)
        // Making sure its an invalid code by making the code very lengthy
        .get("/dad5od8wegwwexvxhrnwewwegwegbxxsetrhebsdvsvsdbv")
        .expect(404)
        .expect("Content-Type", /json/)
        .then(async (response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              msg: "No URL found",
            })
          );
        })
    );
  });
});
