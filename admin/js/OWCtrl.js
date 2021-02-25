const OWCtrL = (function () {
  const URLs = {
    OPEN_WEATHER_GET: "https://api.openweathermap.org/data/2.5/weather?q=",
  };
  const keys = {
    apiKey: "169986ea94b386da8e6d479f3e6971d0",
  };
  return {
    openWCallApi: async function (location, units, language) {
      const URL = `${URLs.OPEN_WEATHER_GET}${location}&units=${units}&appid=${keys.apiKey}&lang=${language}`;
      try {
        const options = {
          method: "get",
          url: URL,
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

      return location, units, language;
    },
  };
})();
