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

describe("GET /api/articles/:article_id", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("returns with a single object", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
      });
  });
  test("returns an object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const { article } = body;
        article.forEach((obj) => {
          expect(obj.article_id).toBe(1);
          expect(obj.topic).toBe("mitch");
          expect(obj.author).toBe("butter_bridge");
          expect(obj.body).toBe("I find this existence challenging");
          expect(obj.created_at).toBe("2020-07-09T20:11:00.000Z");
          expect(obj.votes).toBe(100);
          expect(obj.title).toBe("Living in the shadow of a great man");
          expect(obj.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
      });
  });
  test("returns 404 status code when passed a nonexistent id", () => {
    return request(app).get("/api/articles/9999999").expect(404);
  });
  test("returns a message of id not found when passed a nonexistent id", () => {
    return request(app)
      .get("/api/articles/9999999")
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("returns 400 status code when passed an invalid id", () => {
    return request(app).get("/api/articles/invalidId").expect(400);
  });
  test("returns a message of invalid id type when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/invalidId")
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });
});
describe("GET /api", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  test("returns an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        const endpoints = body.endpoints;
        for (endpoint in endpoints) {
          expect(endpoint.includes("api")).toBe(true);
        }
      });
  });
  test("returns an object describing all the available endpoints with correct properties", () => {
    return request(app)
      .get("/api")
      .then(({ body }) => {
        const endpoints = body.endpoints;
        for (endpoint in endpoints) {
          expect(endpoints[endpoint].hasOwnProperty("description")).toBe(true);
          expect(endpoints[endpoint].hasOwnProperty("queries")).toBe(true);
          expect(endpoints[endpoint].hasOwnProperty("exampleResponse")).toBe(
            true
          );
        }
      });
  });
});

describe("GET /api/articles", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("returns an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
      });
  });
  test("returns an array of article objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
      });
  });
  test("returns an array of article objects sorted by date in descending order as default", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns a 400 status code and message when passed an invalid sortby query", () => {
    return request(app)
      .get("/api/articles?sortby=invalidQuery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort by query");
      });
  });
  test("returns a 400 status code and message when passed an invalid order by query", () => {
    return request(app)
      .get("/api/articles?order=invalidOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order by query");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("returns an array of comments for the article id with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((comment) => {
          expect(typeof comment).toBe("object");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
        });
      });
  });
  test("returns an array of comments sorted by date created", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("returns an empty array of comments when passed an existing article id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("returns 400 status code when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/invalidId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });
  test("returns 404 status code when passed a nonexistent valid id", () => {
    return request(app)
      .get("/api/articles/40000004/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
});
