const db = require("./_utils/dbConnection");
const authorize = require("./_utils/authorize");

const handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);

      if (!authorize(db, body))
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

      db.connect();
      db.query(
        `SELECT token FROM vsg_pp_users WHERE email = '${body.email}' AND password = '${body.password}'`,
        (error, results) => {
          if (error) throw error;

          result.body = JSON.stringify({ token: results[0].token });
        }
      );
      db.end();

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
