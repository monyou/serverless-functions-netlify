const axios = require("axios");

const handler = async (event) => {
  if (event.httpMethod === "GET") {
    if (event.headers["x-token"] !== process.env.BOB_PUBLIC_KEY) {
      console.log("Missing x-token header", event);
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
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

      console.log("Success", event);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({
          employees,
        }),
      };
    } catch (error) {
      console.log("App Error: ", error, event);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({
          message: "Internal Server Error",
          error,
        }),
      };
    }
  } else {
    console.log("Wrong method used", event);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      },
    };
  }
};

module.exports = { handler };
