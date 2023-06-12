const axios = require("axios");

const handler = async (event, context) => {
  if (event.httpMethod === "GET") {
    if (event.headers["x-token"] !== process.env.BOB_PUBLIC_KEY)
      return {
        statusCode: 403,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Not authorized",
        }),
      };

    try {
      const { data } = await axios.get("https://api.hibob.com/v1/people", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.BOB_API_KEY,
        },
      });

      const employees = data.employees.map((employee) => ({
        name: employee.displayName,
        avatar: employee.avatarUrl,
        email: employee.email,
      }));

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          employees,
        }),
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          message: "Internal Server Error",
          error,
        }),
      };
    }
  } else {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Method not allowed",
      }),
    };
  }
};

module.exports = { handler };
