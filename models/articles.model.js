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

exports.fetchArticle = async (sortby = "date", order = "DESC") => {
  const validSortBys = {
    date: "created_at",
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

  let query = `
  SELECT articles.article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, 
  COUNT(comments.article_id) AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id 
  GROUP BY articles.title, articles.article_id
  ORDER BY ${validSortBys[sortby]} ${order};`;

  const { rows } = await db.query(query);

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
