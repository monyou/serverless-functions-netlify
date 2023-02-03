const authorize = (db, body) => {
  if (!body?.email || !body?.password) return false;

  let result = false;

  db.connect();
  db.query(``, (error, results) => {
    if (error) throw error;

    result = !!results.length;
  });
  db.end();

  return result;
};

module.exports = authorize;
