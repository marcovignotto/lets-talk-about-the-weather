const axios = require("axios");

const dbCleaning = require("../../config/dbDelete");

const updateGeneral = require("./updateGeneral");

const allUsers = require("../../data/users");

// @get request

const getWeather = async (firstName, location, language, units) => {
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "386d2fb975cfed105bf736e651309f91";
  const LOCATION_CODE = location;
  const LANG = language;
  const UNITS = units;
  const FULL_API_URL = `${API_URL}?q=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}&lang=${LANG}`;

  const URL_POST = "http://127.0.0.1:5000/api/locations";

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
      headers: { "Content-Type": "application/json" },
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
  updateGeneral().then((res) => {
    if (res.status >= 200 && res.status < 399) {
      dbCleaning().then((res) => {
        if (res.result.ok >= 1) {
          console.log("allUses");
          allUsers.map((x) =>
            getWeather(x.firstName, x.location, x.language, x.unit)
          );
        }
      });
    }
  });
};

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
