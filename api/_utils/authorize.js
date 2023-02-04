const authorize = (db, body) => {
  return new Promise((resolve, reject) => {
    if (!body?.email || !body?.password) resolve(false);

    db.query(
      `SELECT id FROM vsg_pp_user WHERE email like '${body.email}' AND password like '${body.password}'`,
      (error, results) => {
        if (error) return reject(error);
        resolve(!!results.length);
      }
    );
  });
};

module.exports = authorize;
