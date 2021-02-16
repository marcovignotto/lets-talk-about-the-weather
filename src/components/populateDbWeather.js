const axios = require("axios");
const config = require("config");
var CronJob = require("cron").CronJob;

const dbCleaning = require("../../config/dbDelete");

// URLs
const URL_GET_WEATHER_USERS = config.get("localApi.urlGetWeatherUsers");
const URL_POST_LOCATION = config.get("localApi.urlPostLocation");
const OPEN_WEATHER_URL = config.get("openWeartherAPI.apiUrl");
const OPEN_WEATHER_KEY = config.get("openWeartherAPI.apiKey");

// Arrays
// let allWeatherUsersDB = [];

// get al the users from mongo
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

// const getWeather = async (firstName, location, language, unitLocation) => {
//   const API_URL = config.get("openWeartherAPI.apiUrl");
//   const API_KEY = config.get("openWeartherAPI.apiKey");
//   const LOCATION_CODE = location;
//   const LANG = language;
//   const UNITS = unitLocation;
//   const FULL_API_URL = `${API_URL}?q=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}&lang=${LANG}`;

//   const URL_POST = config.get("localApi.urlGet");

//   try {
//     const res = await axios.get(FULL_API_URL);

//     // DESTRUCTURING
//     const {
//       // name, user name
//       // language = res.data
//       name,
//       weather,
//       weatherMain = weather[0].main,
//       weatherIcon = weather[0].icon,
//       weatherDesc = weather[0].description,
//       main = { temperature: temp },
//       wind = { speed },
//     } = res.data;

//     // OBJ TO SEND
//     const objLocation = {
//       firstName,
//       language,
//       location: name,
//       unit: unitLocation,
//       mainWeather: weather[0].main,
//       icon: weather[0].icon,
//       description: weather[0].description,
//       temperature: main.temp,
//       wind: wind.speed,
//     };

//     // SEND
//     const options = {
//       method: "post",
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Content-Type": "application/json",
//         Authorization: config.get("authLocalApi.Bearer"),
//       },
//       url: URL_POST,
//       data: objLocation,
//       transformResponse: [
//         (data) => {
//           // transform the response
//           return data;
//         },
//       ],
//     };

//     axios(options);
//   } catch (e) {
//     console.error(e);
//   }
// };

// POSTs on Mongo user location
const locationOnMongo = async (firstName, location, units, language) => {
  // Open Weather API CALL
  const URL = `${OPEN_WEATHER_URL}${location}&units=${units}&appid=${OPEN_WEATHER_KEY}&lang=${language}`;
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

    // // PARSE results
    const parsedRes = JSON.parse(res.data);

    const {
      getLocation = parsedRes.name,
      getMain = parsedRes.weather[0].main,
      getIcon = parsedRes.weather[0].icon,
      getMainDesc = parsedRes.weather[0].description,
      getTemp = parsedRes.main.temp,
      getWind = parsedRes.wind.speed,
    } = parsedRes;

    // // CREATEOBJ
    const objLocation = {
      firstName: firstName,
      language: language,
      description: getMainDesc,
      icon: getIcon,
      location: getLocation,
      mainWeather: getMain,
      temperature: getTemp,
      wind: getWind,
    };

    // send to mongo db
    try {
      const options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: config.get("authLocalApi.Bearer"),
        },
        data: objLocation,
        url: URL_POST_LOCATION,
        transformResponse: [
          (data) => {
            // transform the response
            return data;
          },
        ],
      };

      const resMongo = await axios(options);
      return JSON.parse(resMongo.data);
    } catch (err) {
      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

// populate

const populateDbWeather = () => {
  dbCleaning().then((res) => {
    if (res.result.ok >= 1) {
      allWeatherUsers().then((res) => {
        console.log("DB Populated");
        res.map((x) =>
          locationOnMongo(x.firstName, x.location, x.language, x.unit)
        );
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
