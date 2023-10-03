const db = require("../db/connection");
const { checkIdExists } = require("../db/seeds/utils");

exports.fetchCommentsByArticleId = async (id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }
  await checkIdExists("articles", "article_id", id);

  const values = [id];
  const query = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`;
  const { rows } = await db.query(query, values);
  return rows;
};
