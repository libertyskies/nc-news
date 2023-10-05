const db = require("../db/connection");
const { checkValueExists } = require("../db/seeds/utils");

exports.fetchUsers = async () => {
  const { rows } = await db.query(
    `SELECT username, name, avatar_url FROM users;`
  );
  return rows;
};

exports.fetchUserByUsername = async (username) => {
  await checkValueExists("users", "username", username);

  const { rows } = await db.query(
    `SELECT username, name, avatar_url FROM users WHERE username = $1`,
    [username]
  );
  return rows;
};
