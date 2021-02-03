const axios = require("axios");
const config = require("config");
var CronJob = require("cron").CronJob;

const dbCleaning = require("../../config/dbDelete");

const updateGeneral = require("./updateGeneral");

// URLs

const URL_GET_WEATHER_USERS = config.get("localApi.urlGetWeatherUsers");

// Arrays
let allWeatherUsersDB = [];

// const allUsers = require("../../data/users");
const allWeatherUsers = async () => {
  try {
    const options = {
      method: "get",
      headers: {
        // "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: config.get("authLocalApi.Bearer"),
      },
      url: URL_GET_WEATHER_USERS,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);
    return JSON.parse(res.data);
  } catch (err) {
    console.error(err);
  }
};

// @get request

const getWeather = async (firstName, location, language, units) => {
  const API_URL = config.get("openWeartherAPI.apiUrl");
  const API_KEY = config.get("openWeartherAPI.apiKey");
  const LOCATION_CODE = location;
  const LANG = language;
  const UNITS = units;
  const FULL_API_URL = `${API_URL}?q=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}&lang=${LANG}`;

  const URL_POST = config.get("localApi.urlGet");

  try {
    const res = await axios.get(FULL_API_URL);

    // DESTRUCTURING
    const {
      // name, user name
      // language = res.data
      name,
      weather,
      weatherMain = weather[0].main,
      weatherIcon = weather[0].icon,
      weatherDesc = weather[0].description,
      main = { temperature: temp },
      wind = { speed },
    } = res.data;

    // OBJ TO SEND
    const objLocation = {
      firstName,
      language,
      location: name,
      mainWeather: weather[0].main,
      icon: weather[0].icon,
      description: weather[0].description,
      temperature: main.temp,
      wind: wind.speed,
    };

    // SEND
    const options = {
      method: "post",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: config.get("authLocalApi.Bearer"),
      },
      url: URL_POST,
      data: objLocation,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    axios(options);
  } catch (e) {
    console.error(e);
  }
};

// populate

const populateDbWeather = () => {
  console.log("pop started");
  dbCleaning().then((res) => {
    if (res.result.ok >= 1) {
      allWeatherUsers().then((res) => {
        console.log("DB Populated");
        res.map((x) => getWeather(x.firstName, x.location, x.language, x.unit));
      });
    }
  });
  // dbCleaning().then((res) => {
  //   if (res.result.ok >= 1) {
  //     console.log("DB Populated");
  //     allWeatherUsersDB.map((x) =>
  //       getWeather(x.firstName, x.location, x.language, x.unit)
  //     );
  //   }
  // });
  // }
  // });
};

var job = new CronJob(
  "0 */30 * * * *",
  function () {
    populateDbWeather();
  },
  null,
  true,
  "Europe/Berlin"
);
job.start();

module.exports = populateDbWeather;

// console.log(res.data);
// console.log(name);
// console.log(weather[0].icon);
// console.log(main.temp);
// console.log(wind.speed);

// getLocation = res.name,
// getMain = res.weather[0].main,
// getIcon = res.weather[0].icon,
// getMainDesc = res.weather[0].description,
// getTemp = res.main.temp,
// getWind = res.wind.speed,

// getWeather();
