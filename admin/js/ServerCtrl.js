const ServerCtrl = (function () {
  let urlPrefix = "";

  const getHost = window.location.host;

  if (getHost === "localhost:5000") {
    urlPrefix = "http://localhost:5000/";
  } else {
    urlPrefix = "https://lets-talk-about-the-weather.herokuapp.com/";
  }

  const URLs = {
    URL_POST: urlPrefix + "api/auth",
    URL_POST_USER: urlPrefix + "api/weatherusers/",
    URL_GET: urlPrefix + "api/weatherusers",
    URL_DELETE: urlPrefix + "api/weatherusers/",
    URL_PUT: urlPrefix + "api/weatherusers/",
    URL_GET_LOCATION: urlPrefix + "api/locations/",
    URL_POST_LOCATION: urlPrefix + "api/locations/",
    URL_PUT_LOCATION: urlPrefix + "api/locations/",
    URL_DELETE_LOCATION: urlPrefix + "api/locations/",
  };

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
