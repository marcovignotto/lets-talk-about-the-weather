const ServerCtrl = (function () {
  const devUrl = "http://localhost:5000";
  const prodUrl = "http://lets-talk-about-the-weather.herokuapp.com";

  const URLs = {
    URL_POST:
      process.env.NODE_ENV === "production" ? prodUrl : devUrl + "/api/auth",
    URL_POST_USER:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/weatherusers/",
    URL_GET:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/weatherusers",
    URL_DELETE:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/weatherusers/",
    URL_PUT:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/weatherusers/",
    URL_GET_LOCATION:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/locations/",
    URL_POST_LOCATION:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/locations/",
    URL_PUT_LOCATION:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/locations/",
    URL_DELETE_LOCATION:
      process.env.NODE_ENV === "production"
        ? prodUrl
        : devUrl + "/api/locations/",
  };

  // const URLsProd = {
  //   URL_POST: "http://localhost:5000/api/auth",
  //   URL_POST_USER: "http://127.0.0.1:5000/api/weatherusers/",
  //   URL_GET: "http://127.0.0.1:5000/api/weatherusers",
  //   URL_DELETE: "http://127.0.0.1:5000/api/weatherusers/",
  //   URL_PUT: "http://127.0.0.1:5000/api/weatherusers/",
  //   URL_GET_LOCATION: "http://127.0.0.1:5000/api/locations/",
  //   URL_POST_LOCATION: "http://127.0.0.1:5000/api/locations/",
  //   URL_PUT_LOCATION: "http://127.0.0.1:5000/api/locations/",
  //   URL_DELETE_LOCATION: "http://127.0.0.1:5000/api/locations/",
  // };

  // const ipAdress =
  //   process.env.NODE_ENV === "production"
  //     ? "http://255.255.255"
  //     : "http://localhost";

  return {
    getUrls: function () {
      return URLs;
    },

    callApi: async function (method, email, password, url) {
      try {
        const options = {
          method: method,
          data: {
            email: email,
            password: password,
          },
          url: url,
          transformResponse: [
            (data) => {
              // transform the response
              return data;
            },
          ],
        };

        const res = await axios(options);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    callApiAuth: async function (method, token, url, obj = {}, id = "") {
      if (method === "delete" || method === "put") url = `${url}/${id}`;

      try {
        const options = {
          method: method,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: obj,
          url: url,
          transformResponse: [
            (data) => {
              // transform the response
              return data;
            },
          ],
        };

        const res = await axios(options);

        if (res.status >= 200 && res.status <= 399) {
          sessionStorage.setItem("isAuthenticated", true);
          sessionStorage.setItem("UserToken", token);
        }
        return res;
      } catch (err) {
        console.error(err);
      }
    },
  };
})();
