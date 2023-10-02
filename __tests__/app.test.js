const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("returns an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const expected = {
          description: "The man, the Mitch, the legend",
          slug: "mitch",
        };
        expect(typeof body).toBe("object");
        expect(body.topics[0]).toEqual(expected);
        expect(body.topics).toHaveLength(3);
      });
  });
  test("returns an array of topic objects with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const topics = body.topics;
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});
describe("ALL /invalidPath", () => {
  test("returns 404 status code", () => {
    return request(app).get("/invalidPath").expect(404);
  });
  test("returns a message of path not found", () => {
    return request(app)
      .get("/invalidPath")
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
