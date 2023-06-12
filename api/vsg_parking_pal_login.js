const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");

      const result = await new Promise((resolve) => {
        db.query(
          `SELECT id, token FROM vsg_pp_user WHERE email like '${body.email}' AND password like '${body.password}'`,
          (error, results) => {
            if (error) return resolve(error);

            let response = {
              id: "query",
            };

            if (results.length) {
              response = {
                ...response,
                statusCode: 200,
                body: JSON.stringify({
                  id: results[0].id,
                  token: results[0].token,
                }),
              };
            } else {
              response = {
                ...response,
                statusCode: 400,
                body: JSON.stringify({
                  message: "No user found with the given credentials",
                }),
              };
            }

            resolve(response);
          }
        );
      });

      if (!result.id) throw result;

      return result;
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
          error,
        }),
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed",
      }),
    };
  }
};

module.exports = { handler };
