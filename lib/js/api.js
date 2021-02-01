// API

// const { default: axios } = require("axios");

// @get request
const getLocations = async () => {
  // const API_URL = "http://127.0.0.1:5000/api/locations";
  // const API_KEY = "386d2fb975cfed105bf736e651309f91";
  // const LOCATION_CODE = location;
  // const LANG = language;
  // const UNITS = units;
  // const FULL_API_URL = `${API_URL}?q=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}&lang=${LANG}`;

  const URL_GET = "http://127.0.0.1:5000/api/locations";

  try {
    const options = {
      method: "get",
      headers: { "Content-Type": "application/json" },
      url: URL_GET,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);
    // console.log("from getLOc", JSON.parse(res.data));
    return JSON.parse(res.data);

    // return sendData;
  } catch (e) {
    console.error(e);
  }
};

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

/* start-test-block */
// const config = {
//   method: "get",
//   url: API_URL,
//   headers: { "User-Agent": "Console app" },
// };

// const fetchUsers = () => {
//   axios
//     .get("https://reqres.in/api/users")
//     .then((response) => {
//       const users = response.data.data;
//       console.log(`GET list users`, users);
//     })
//     .catch((error) => console.error(error));
// };

// fetchUsers();
/* end-test-block */
