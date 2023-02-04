const db = require("./_utils/dbConnection");
const authorize = require("./_utils/authorize");

const handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");

      if (!(await authorize(db, body)).catch())
        return {
          statusCode: 401,
          body: JSON.stringify({
            message: "Unauthorized",
          }),
        };

      const result = {
        statusCode: 200,
        message: "OK",
      };

      await new Promise((resolve, reject) => {
        db.query(
          `SELECT token FROM vsg_pp_user WHERE email like '${body.email}'`,
          (error, results) => {
            if (error) return reject(error);

            result.body = JSON.stringify({ token: results[0].token });
            resolve();
          }
        );
      }).catch();

      return result;
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
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
