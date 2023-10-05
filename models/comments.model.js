const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = async (id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }
  await checkValueExists("articles", "article_id", id);

  const values = [id];
  const query = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  const { rows } = await db.query(query, values);
  return rows;
};

exports.createComment = async (comment, id) => {
  if (!comment.username || !comment.body) {
    return Promise.reject({
      status: 400,
      msg: "Insufficient data",
    });
  }

  await checkValueExists("articles", "article_id", id);
  await checkValueExists("users", "username", comment.username);

  const insertedValues = [comment.body, id, comment.username];

  const { rows } = await db.query(
    `
  INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
    insertedValues
  );
  return rows;
};

exports.removeComment = async (id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }

  await checkValueExists("comments", "comment_id", id);
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1;`,
    [id]
  );
  return rows;
};

exports.updateComment = async (inc_votes, id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }
  await checkValueExists("comments", "comment_id", id);

  const dbOutput = await db.query(
    `SELECT votes FROM comments WHERE comment_id = $1`,
    [id]
  );

  const currentVotes = Number(dbOutput.rows[0].votes);

  const newVotes = currentVotes + inc_votes;

  const { rows } = await db.query(
    `
  UPDATE comments
  SET votes = $1
  WHERE comment_id = $2
  RETURNING *;`,
    [newVotes, id]
  );
  return rows;
};
