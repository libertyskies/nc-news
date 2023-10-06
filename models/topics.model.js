const db = require("../db/connection");

exports.fetchTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.createTopic = async (topic) => {
  if (!topic.slug || !topic.description) {
    return Promise.reject({
      status: 400,
      msg: "Insufficient data",
    });
  }

  const values = [topic.slug, topic.description];
  const query = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`;

  const { rows } = await db.query(query, values);
  return rows;
};
