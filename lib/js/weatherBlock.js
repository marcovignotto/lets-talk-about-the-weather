// WEATHER
const makeWeatherBlock = (
  firstName,
  userLocation,
  language,
  iconCode,
  description,
  temperature,
  windSpeed,
  cssCol = "col-3",
  cssRow = "",
  position
) => {
  //
  // USELESS
  //

  // let resWeather = getWeather(firstName, loc, lang, unit)
  //   .then((resolve, reject) => {
  //     const res = resolve;

  //     // console.log(res);
  //     const {
  //       getLocation = res.name,
  //       getMain = res.weather[0].main,
  //       getIcon = res.weather[0].icon,
  //       getMainDesc = res.weather[0].description,
  //       getTemp = res.main.temp,
  //       getWind = res.wind.speed,
  //     } = res;
  //
  // USELESS END

  // console.log(
  //   firstName,
  //   loc,
  //   lang,
  //   unit,
  //   (cssCol = "col-3"),
  //   (cssRow = ""),
  //   position
  // );

  const elementContainer = document.querySelector(
    ".container__weather__blocks"
  );
  // elementContainer.classList.add("myrow");

  // create row
  // const rowWeather = document.createElement("div");
  // rowWeather.className = `${cssRow}`;

  // create block container
  const blockWeather = document.createElement("div");
  blockWeather.className = `block__weather ${cssCol} ${cssRow}`;

  const location = document.createElement("h4");
  location.className = "block__weather__location";
  location.innerHTML = `${userLocation}`;

  const icon = document.createElement("img");
  icon.className = "block__weather__icon";
  icon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // const main = document.createElement("h4");
  // main.className = "block__weather__main";
  // main.innerHTML = `${getMain} `;

  const mainDesc = document.createElement("h4");
  mainDesc.className = "block__weather__main";
  mainDesc.innerHTML = `${description}`;

  const temp = document.createElement("h4");
  temp.className = "block__weather__temp";
  temp.innerHTML = `${temperature}`;

  const wind = document.createElement("h4");
  wind.className = "block__weather__wind";
  wind.innerHTML = `${windSpeed}`;

  // merge all
  blockWeather.innerHTML +=
    location.outerHTML +
    icon.outerHTML +
    // main.outerHTML +
    mainDesc.outerHTML +
    temp.outerHTML +
    wind.outerHTML;

  // console.log(blockWeather);
  // return "blockWeather";
  // return elementContainer.appendChild(blockWeather);
  return { html: blockWeather, position: position };
  // })
  // .then((res) => {
  //   // console.log(res);
  //   // return console.log(res.innerHTML);
  //   return res;
  // });
  // return resWeather;
};
