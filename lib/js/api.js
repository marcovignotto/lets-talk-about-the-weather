const getLocations = async () => {
  try {
    const URL_GET = "http://127.0.0.1:5000/api/locations";
    const options = {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxYTc5YWY2OTY1YzAxZTM2ZDBlNmEyIn0sImlhdCI6MTYxMzA1MDUyMX0.cw9IeNIUk-gOumMgRTCQkKXZKQ8USyh6pDVBZQdkgik",
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
    console.log(res);
    return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};
