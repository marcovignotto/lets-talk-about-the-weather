// WEATHER
const makeWeatherBlock = (loc, lang, unit, cssCol = "col-3", cssRow = "") => {
  getWeather(loc, lang, unit).then((result) => {
    const res = result;
    // console.log(res);

    // get data
    let getLocation = res.name;
    let getMain = res.weather[0].main;
    let getMainDesc = res.weather[0].description;
    let getTemp = res.main.temp;
    let getWind = res.wind.speed;

    // get container
    const elementContainer = document.querySelector(
      ".container__weather__blocks"
    );
    elementContainer.classList.add("myrow");

    // create block container
    const blockWeather = document.createElement("div");
    blockWeather.className = `block__weather ${cssCol} ${cssRow}`;

    const location = document.createElement("h4");
    location.className = "block__weather__location";
    location.innerHTML = `${getLocation}`;

    const main = document.createElement("h4");
    main.className = "block__weather__main";
    main.innerHTML = `${getMain}`;

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
      main.outerHTML +
      mainDesc.outerHTML +
      temp.outerHTML +
      wind.outerHTML;

    elementContainer.appendChild(blockWeather);
  });
};
