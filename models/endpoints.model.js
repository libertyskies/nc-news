const { readFile } = require("fs/promises");

exports.fetchEndpoints = (req, res, next) => {
  return readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
