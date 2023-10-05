const db = require("../db/connection");
exports.fetchUsers = async () => {
  const { rows } = await db.query(
    `SELECT username, name, avatar_url FROM users;`
  );
  return rows;
};
