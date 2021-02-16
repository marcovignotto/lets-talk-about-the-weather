const ServerCtrl = (function () {
  return {
    getLocations: async function () {
      try {
        const URL_GET = "http://127.0.0.1:5000/api/locations";
        const options = {
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxYTc5YWY2OTY1YzAxZTM2ZDBlNmEyIn0sImlhdCI6MTYxMzA1MDUyMX0.cw9IeNIUk-gOumMgRTCQkKXZKQ8USyh6pDVBZQdkgik",
          },
          url: URL_GET,
          transformResponse: [
            (data) => {
              // transform the response
              return data;
            },
          ],
        };

        const res = await axios(options);
        console.log(res);
        return JSON.parse(res.data);
      } catch (e) {
        console.error(e);
      }
    },
  };
})();

let col3 = "";

const UICtrl = (function () {
  const UISelectors = {
    elementContainer: document.querySelector(".container__weather__blocks"),
  };
  return {
    getSelectors: function () {
      return UISelectors;
    },

    makeWeatherBlock: function (
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
    ) {
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
    },
  };
})();

// integrate
let arrNew = [];
let firstArr = [];

// integrate

const ItemCtrl = (function () {
  const locations = {
    mainLocation: {
      description: "Klarer Himmel",
      firstName: "DCI",
      icon: "01d",
      language: "de",
      location: "Berlin",
      mainWeather: "Clear",
      temperature: "0.22",
      wind: "4.63",
    },
  };

  const chopArray = (arr, size) => {
    for (let i = 0; i < size - 1; i = i + size - 1) {
      firstArr.push(arr.slice(i, i + size - 1));
    }
    let oldArr = arr.splice(size - 1, arr.length);

    return [...firstArr, oldArr];
  };

  return {
    arrAllUsers: function () {
      ServerCtrl.getLocations()
        .then((res, rej) => {
          if (!res) {
            console.log("not resolved");
          } else {
            console.log("resolved");
            arrNew = res;
            return res;
          }
        })
        .then((res) => {
          //
          // DO I NEED TRY CATCH???
          //
          //  const mapAll = async () => {
          // console.log("map all");
          chopArray(res, 5).map(async (y, i) => {
            // try {
            if (i === 0) {
              // insert main location
              y.splice(1, 0, locations.mainLocation);

              // create row
              const rowWeather = document.createElement("div");
              rowWeather.className = `row row-double`;

              let arrHtml = [];
              y.map(async (x, index) => {
                let col3 = "col-3";
                let col6 = "col-6";

                const row = () => {
                  if (index === 1) return "row-one-two";
                  if (index >= 3) return "row-two";

                  return "row-one";
                };

                let row1 = "row-one";
                let row2 = "row-two";
                let row12 = "row-one-two";

                // const block = await makeWeatherBlock(
                const block = UICtrl.makeWeatherBlock(
                  x.firstName,
                  x.location,
                  x.language,
                  x.icon,
                  x.description,
                  x.temperature,
                  x.wind,
                  // x.unit,
                  index === 1 ? col6 : col3,
                  row(),
                  x.position
                );
                //   .then((res) => {
                //   return res;
                // });

                // PUSH RES TO NEW ARR
                arrHtml.push(block);

                // once over
                if (arrHtml.length === y.length) {
                  // sort it
                  arrHtml.sort((a, b) => a.position - b.position);
                  // map it
                  arrHtml.map((x, i) => {
                    let block = x.html;
                    rowWeather.innerHTML += block.outerHTML;
                    UICtrl.getSelectors().elementContainer.appendChild(
                      rowWeather
                    );
                  });
                }
              });
              // } else if (i > 0 && y.length >= 4) {
            } else if (i > 0) {
              // create row
              const rowWeather = document.createElement("div");
              rowWeather.className = `row pv-1`;
              y.map((x, index) => {
                const get = UICtrl.makeWeatherBlock(
                  x.firstName,
                  x.location,
                  x.language,
                  x.icon,
                  x.description,
                  x.temperature,
                  x.wind,
                  "col-3",
                  "",
                  x.position
                );
                rowWeather.appendChild(get.html);
                elementContainer.appendChild(rowWeather);
              });
            }
            // } catch (error) {
            // console.log(error);
            // }
          });
          // };
        });
    },
    makeWeatherBlock: function (
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
    ) {
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

      // TO CHANGE

      // const elementContainer = document.querySelector(
      //   ".container__weather__blocks"
      // );
      const elementContainer = UICtrl.getSelectors().elementContainer;

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
    },
  };
})();

const App = (function (ServerCtrl, UICtrl, ItemCtrl) {
  const loadAll = function () {
    // load server for weather blocks
    ItemCtrl.arrAllUsers();
  };
  return {
    init: function () {
      loadAll();
    },
  };
})(ServerCtrl, UICtrl, ItemCtrl);

App.init();
