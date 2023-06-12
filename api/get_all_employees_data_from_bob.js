const handler = async (event, context) => {
  if (event.httpMethod === "GET") {
    console.log(event);
    if (event.headers["x-token"] !== process.env.BOB_PUBLIC_KEY)
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Not authorized",
        }),
      };

    try {
      const response = await fetch("https://api.hibob.com/v1/people", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.BOB_API_KEY,
        },
      });
      const data = await response.json();

      const employees = data.employees.map((employee) => ({
        name: employee.displayName,
        avatar: employee.avatarUrl,
        email: employee.email,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          employees,
        }),
      };
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
