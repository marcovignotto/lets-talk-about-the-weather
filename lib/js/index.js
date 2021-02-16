const ServerCtrl = (function () {
  const URLs = {
    urlGet: "http://127.0.0.1:5000/api/locations",
  };

  const KEYs = {
    apiKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxYTc5YWY2OTY1YzAxZTM2ZDBlNmEyIn0sImlhdCI6MTYxMzA1MDUyMX0.cw9IeNIUk-gOumMgRTCQkKXZKQ8USyh6pDVBZQdkgik",
  };

  return {
    getLocations: async function () {
      try {
        const URL_GET = URLs.urlGet;
        const options = {
          method: "get",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${KEYs.apiKey}`,
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
        return JSON.parse(res.data);
      } catch (e) {
        console.error(e);
      }
    },
  };
})();

// let col3 = "";

const UICtrl = (function () {
  const time = {
    today: new Date(),
  };

  const clock = (target) => {
    setInterval(() => {
      let t = new Date();
      target.innerHTML =
        (t.getHours() < 10 ? "0" + t.getHours() : "" + t.getHours()) +
        ":" +
        (t.getMinutes() < 10 ? "0" + t.getMinutes() : "" + t.getMinutes()) +
        ":" +
        (t.getSeconds() < 10 ? "0" + t.getSeconds() : "" + t.getSeconds());
    }, 1000);
  };

  const observer = new MutationObserver(function (mutations) {
    if (mutations.length > 1) {
      // get main weather and set div
      const mainWeatherLocation = document
        .querySelector(".row-one-two")
        .querySelector(".block__weather__location");

      const mainTimeDiv = document.createElement("div");
      mainTimeDiv.className = "main__time";

      mainWeatherLocation.after(mainTimeDiv);
      // clock on main
      clock(mainTimeDiv);
    }
  });

  const UISelectors = {
    elementContainer: document.querySelector(".container__weather__blocks"),
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },
    getObserver: function () {
      return observer;
    },
  };
})();

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

  let arrNew = [];

  const chopArray = (arr, size) => {
    let firstArr = [];
    for (let i = 0; i < size - 1; i = i + size - 1) {
      firstArr.push(arr.slice(i, i + size - 1));
    }
    let oldArr = arr.splice(size - 1, arr.length);

    return [...firstArr, oldArr];
  };

  const makeWeatherBlock = function (
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
    const elementContainer = UICtrl.getSelectors().elementContainer;

    const blockWeather = document.createElement("div");
    blockWeather.className = `block__weather ${cssCol} ${cssRow}`;

    const userFirstName = document.createElement("h4");
    userFirstName.className = "block__weather__first__name";
    userFirstName.innerHTML = `${firstName}`;

    const location = document.createElement("h4");
    location.className = "block__weather__location";
    location.innerHTML = `${userLocation}`;

    const icon = document.createElement("img");
    icon.className = "block__weather__icon";
    icon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

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
      userFirstName.outerHTML +
      location.outerHTML +
      icon.outerHTML +
      mainDesc.outerHTML +
      temp.outerHTML +
      wind.outerHTML;

    return { html: blockWeather, position: position };
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
          chopArray(res, 5).map(async (y, i) => {
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

                const block = makeWeatherBlock(
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
            } else if (i > 0) {
              // create row
              const rowWeather = document.createElement("div");
              rowWeather.className = `row pv-1`;
              y.map((x, index) => {
                const get = makeWeatherBlock(
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
          });
        });
    },
  };
})();

const App = (function (ServerCtrl, UICtrl, ItemCtrl) {
  const loadAll = function () {
    // load server for weather blocks
    ItemCtrl.arrAllUsers();

    // init observer for clock insert
    // configuration of the observer:
    var config = { attributes: true, childList: true, characterData: true };
    // pass in the target node, as well as the observer options
    UICtrl.getObserver().observe(
      UICtrl.getSelectors().elementContainer,
      config
    );
  };
  return {
    init: function () {
      loadAll();
    },
  };
})(ServerCtrl, UICtrl, ItemCtrl);

App.init();
