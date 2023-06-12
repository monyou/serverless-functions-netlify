const axios = require("axios");

const handler = async (event) => {
  console.log(event);
  if (event.httpMethod === "GET") {
    if (event.headers["x-token"] !== process.env.BOB_PUBLIC_KEY) {
      console.log(
        "Missing x-token header!",
        event.headers["x-token"],
        event.origin
      );
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Not authorized",
        }),
      };
    }

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

      console.log("Success!", event.origin);
      return {
        statusCode: 200,
        body: JSON.stringify({
          employees,
        }),
      };
    } catch (error) {
      console.log("App Error: ", error, event.origin);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
          error,
        }),
      };
    }
  } else {
    console.log("Wrong method used: ", event.httpMethod, event.origin);
    return {
      statusCode: 405,
      body: JSON.stringify({
        message: "Method not allowed",
      }),
    };
  }
};

module.exports = { handler };
