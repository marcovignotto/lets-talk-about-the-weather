// API
// @get request
const getWeather = async (location, language, units) => {
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = "3c602fa14e57089c0c4c1c5ac6e59ed0";
  const LOCATION_CODE = location;
  const LANG = language;
  const UNITS = units;
  const FULL_API_URL = `${API_URL}?q=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}&lang=${LANG}`;
  try {
    const res = await axios.get(FULL_API_URL);

    return res.data;
  } catch (e) {
    console.error(e);
  }
};

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
