const getLocations = async () => {
  try {
    const URL_GET = "http://127.0.0.1:5000/api/locations";
    const options = {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxOTQwZTU4OGFjNmYyNmI0N2UzN2Q3In0sImlhdCI6MTYxMjI2ODg4OSwiZXhwIjoxNjEyNjI4ODg5fQ.e645a39in2Z5jl43sWaltfOfFc4p98oYpYeDgegx6YQ",
      },
      url: URL_GET,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);

    return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};
