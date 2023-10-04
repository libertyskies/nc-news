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
        expect(body.msg).toBe("article_id not found");
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
          expect(comment.article_id).toBe(1);
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
        expect(body.msg).toBe("article_id not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns a 201 status code when passed a new comment with the correct properties", () => {
    const newComment = {
      username: "rogersop",
      body: "The wonderful thing about Tiggers is that I'm the only one",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201);
  });
  test("returns a new comment object with correct properties when passed a valid new comment", () => {
    const newComment = {
      username: "rogersop",
      body: "The wonderful thing about Tiggers is that I'm the only one",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment[0].article_id).toBe(1);
        expect(comment[0].comment_id).toBe(19);
        expect(comment[0].body).toEqual(newComment.body);
        expect(comment[0].author).toEqual(newComment.username);
        expect(comment[0].votes).toBe(0);
        expect(typeof comment[0].created_at).toBe("string");
      });
  });
  test("returns a 400 status code and message when passed a comment object with no body property", () => {
    const testComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Insufficient data");
      });
  });
  test("returns a 400 status code and message when passed a comment object with no username property", () => {
    const testComment = {
      body: "The wonderful thing about Tiggers is that I'm the only one",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Insufficient data");
      });
  });
  test("returns a 404 status code when passed a comment object to a nonexisting article id property", () => {
    const testComment = {
      username: "rogersop",
      body: "The wonderful thing about Tiggers is that I'm the only one",
    };
    return request(app)
      .post("/api/articles/10000000/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
  test("returns a 404 status code when passed a comment object with a nonexisting username property", () => {
    const testComment = {
      username: "noSuchUsername",
      body: "The wonderful thing about Tiggers is that I'm the only one",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username not found");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("responds with 204 status code", () => {
    return request(app).delete("/api/comments/1").send().expect(204);
  });
  test("deletes the requested comment when passed to a valid id", () => {
    return request(app)
      .delete("/api/comments/1")
      .send()
      .then(() => {
        return connection.query("SELECT * FROM comments;");
      })
      .then((result) => {
        expect(result.rows).toHaveLength(17);
        expect(result.rows[0].comment_id).not.toBe(1);
      });
  });
  test("deletes the requested comment when passed to a different valid id", () => {
    return request(app)
      .delete("/api/comments/2")
      .send()
      .then(() => {
        return connection.query("SELECT * FROM comments;");
      })
      .then((result) => {
        expect(result.rows).toHaveLength(17);
        expect(result.rows[1].comment_id).not.toBe(2);
      });
  });
  test("returns 404 status code and message when passed a nonexistent comment id", () => {
    return request(app)
      .delete("/api/comments/9999")
      .send()
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });
  test("returns 400 status code and message when passed an invalid comment id", () => {
    return request(app).delete("/api/comments/invalidId").send();
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("returns a 200 status code when passed a valid object", () => {
    const testPatch = {
      inc_votes: 1,
    };
    return request(app).patch("/api/articles/2").send(testPatch).expect(200);
  });
  test("returns an updated property to the article when passed a valid object", () => {
    const testPatch = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].votes).toBe(110);
        expect(article[0]).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("returns an updated article when passed a valid object with a decrementing property", () => {
    const testPatch = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].votes).toBe(90);
        expect(article[0]).toMatchObject({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("returns an updated article when passed a valid object to an article with no votes", () => {
    const testPatch = {
      inc_votes: 22,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].votes).toBe(22);
        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 22,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("returns an updated article when passed a object with extra properties, including the correct property", () => {
    const testPatch = {
      inc_votes: 10,
      other_key: "otherValue",
    };
    return request(app)
      .patch("/api/articles/3")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].votes).toBe(10);
        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("returns a 404 status code when passed a valid object to a nonexistent article id", () => {
    const testPatch = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/40004")
      .send(testPatch)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article_id not found");
      });
  });
  test("returns a 400 status code and message when passed a valid object to an id too large for an integer", () => {
    const testPatch = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/400000000000000000")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Value out of accepted range");
      });
  });
  test("returns a 400 status code and message when passed a valid object to an invalid article id", () => {
    const testPatch = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/invalidId")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID type");
      });
  });
  test("returns a 400 status code and message when passed an object with an invalid value to a valid article id", () => {
    const testPatch = {
      inc_votes: "invalidValue",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value");
      });
  });
  test("returns a 400 status code and message when passed an object with an invalid key to a valid article id", () => {
    const testPatch = {
      invalid_key: 100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid value");
      });
  });
});
describe("GET /api/articles?topic", () => {
  test("returns 200 status code and an array filtered by the given topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
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
  test("returns a 404 status code when the query has a nonexistent topic", () => {
    return request(app)
      .get("/api/articles?topic=newtopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
  test("returns a 200 status code and an array of articles when passed a nonexistent query", () => {
    return request(app)
      .get("/api/articles?nonsense=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
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
});
