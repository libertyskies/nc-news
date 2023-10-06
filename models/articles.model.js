const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchArticleById = async (id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }

  await checkValueExists("articles", "article_id", id);

  const query = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.body, articles.votes, article_img_url, 
COUNT(comments.article_id) AS comment_count 
FROM articles
LEFT JOIN comments USING(article_id)
WHERE articles.article_id = $1
GROUP BY articles.title, articles.article_id;`;

  const { rows } = await db.query(query, [id]);

  return rows;
};

exports.fetchArticle = async (sortby = "date", order = "DESC", topic) => {
  const validSortBys = {
    date: "created_at",
    created_at: "created_at",
    title: "title",
    author: "author",
    votes: "votes",
    id: "article_id",
    img: "article_img_url",
    article_img_url: "article_img_url",
    topic: "topic",
  };

  if (!(sortby in validSortBys)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort by query",
    });
  }

  order = order.toUpperCase();

  if (order !== "ASC" && order !== "DESC") {
    return Promise.reject({
      status: 400,
      msg: "Invalid order by query",
    });
  }

  let query = `SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments USING(article_id)`;

  const values = [];

  if (topic !== undefined) {
    await checkValueExists("articles", "topic", topic);
    query += `WHERE topic = $1 `;
    values.push(topic);
  }

  query += `
  GROUP BY articles.title, articles.article_id
  ORDER BY ${validSortBys[sortby]} ${order};`;

  const { rows } = await db.query(query, values);

  return rows;
};

exports.updateArticle = async (inc_votes, id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }
  await checkValueExists("articles", "article_id", id);

  const dbOutput = await db.query(
    `SELECT votes FROM articles 
     WHERE article_id = $1;`,
    [id]
  );

  const currentVotes = Number(dbOutput.rows[0].votes);

  const newVotes = currentVotes + inc_votes;

  const { rows } = await db.query(
    `UPDATE articles
     SET votes = $1
     WHERE article_id = $2 
     RETURNING *;`,
    [newVotes, id]
  );

  return rows;
};

exports.createArticle = async (article) => {
  if (!article.author || !article.title || !article.body || !article.topic) {
    console.log("in here");
    return Promise.reject({
      status: 400,
      msg: "Insufficient data",
    });
  }
  await checkValueExists("users", "username", article.author);

  await checkValueExists("topics", "slug", article.topic);

  const values = [article.author, article.title, article.body, article.topic];
  let query = `INSERT INTO articles (author, title, body, topic`;

  if (article.article_img_url) {
    query += `, article_img_url) VALUES ($1, $2, $3, $4, $5`;
    values.push(article.article_img_url);
  } else {
    query += `) VALUES ($1, $2, $3, $4`;
  }

  query += `) RETURNING *;`;

  const dbOutput = await db.query(query, values);

  const newArticleId = dbOutput.rows[0].article_id;

  const returningQuery = `SELECT articles.article_id, articles.author, title, topic, articles.body, articles.created_at, articles.votes, article_img_url,
  COUNT(comments.article_id) AS comment_count 
  FROM articles
   FULL JOIN comments USING(article_id)
   WHERE articles.article_id = $1
   GROUP BY articles.title, articles.article_id;`;

  const { rows } = await db.query(returningQuery, [newArticleId]);

  return rows;
};
