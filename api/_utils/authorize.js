const authorize = (db, body) => {
  if (!body?.email || !body?.password) return false;

  let result = false;

  db.connect();
  db.query(
    `SELECT token FROM vsg_pp_user WHERE email like '${body.email}' AND password like '${body.password}'`,
    (error, results) => {
      if (error) throw error;

      result = !!results.length;
    }
  );
  db.end();

  return result;
};

module.exports = authorize;
