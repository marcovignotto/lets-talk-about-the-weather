const axios = require("axios");

const config = require("config");
const OPEN_WEATHER_GET = config.get("openWeartherAPI.apiUrl");

const OPEN_WEATHER_API_KEY = process.env.OW_API_KEY;

const openWeatherCall = async function (location, unit, language) {
  const URL = `${OPEN_WEATHER_GET}${location}&units=${unit}&appid=${OPEN_WEATHER_API_KEY}&lang=${language}`;
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

  return location, unit, language;
};

module.exports = openWeatherCall;
