// WEATHER
const makeWeatherBlock = (
  loc,
  lang,
  unit,
  cssCol = "col-3",
  cssRow = "",
  position
) => {
  let resWeather = getWeather(loc, lang, unit)
    .then((resolve, reject) => {
      const res = resolve;

      // get data
      let getLocation = res.name;
      let getMain = res.weather[0].main;
      let getIcon = res.weather[0].icon;
      let getMainDesc = res.weather[0].description;
      let getTemp = res.main.temp;
      let getWind = res.wind.speed;
      // http://openweathermap.org/img/wn/10d@2x.png
      // get container
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
      location.innerHTML = `${getLocation}`;

      const icon = document.createElement("img");
      icon.className = "block__weather__icon";
      icon.src = `http://openweathermap.org/img/wn/${getIcon}@2x.png`;

      // const main = document.createElement("h4");
      // main.className = "block__weather__main";
      // main.innerHTML = `${getMain} `;

      const mainDesc = document.createElement("h4");
      mainDesc.className = "block__weather__main";
      mainDesc.innerHTML = `${getMainDesc}`;

      const temp = document.createElement("h4");
      temp.className = "block__weather__temp";
      temp.innerHTML = `${getTemp}`;

      const wind = document.createElement("h4");
      wind.className = "block__weather__wind";
      wind.innerHTML = `${getWind}`;

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
    })
    .then((res) => {
      // console.log(res);
      // return console.log(res.innerHTML);
      return res;
    });
  return resWeather;
};
