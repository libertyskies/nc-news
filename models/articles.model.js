const db = require("../db/connection");

exports.fetchArticleById = async (id) => {
  if (/\D/.test(id)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid ID type",
    });
  }

  const allIds = await db.query(`SELECT DISTINCT article_id FROM articles;`);

  const existingIds = allIds.rows;
  const articleIdExists = existingIds.find((article) => {
    return article.article_id === Number(id);
  });
  if (!articleIdExists) {
    return Promise.reject({
      status: 404,
      msg: "ID not found",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      return rows;
    });
};
