const ServerCtrl = (function () {
  const URLs = {
    urlGet: "http://127.0.0.1:5000/api/locations",
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

const UICtrl = (function () {
  const time = {
    today: new Date(),
  };

  const dateClock = (target, timezone, language) => {
    setInterval(() => {
      let t = new Date();

      let intTime = new Date(t.getTime() + timezone * 1000);

      let getIntTime = new Intl.DateTimeFormat("it", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "GMT",
      }).format(intTime);

      let getTimezone = getIntTime.substring(
        getIntTime.indexOf(":") - 2,
        getIntTime.lastIndexOf(":") + 3
      );

      let getIntDay = new Intl.DateTimeFormat(`${language}`, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(intTime);

      const mainWeekDay = document.createElement("div");
      mainWeekDay.className = "main__week_day col-12";
      mainWeekDay.innerHTML = getIntDay;

      const mainTimeDiv = document.createElement("div");
      mainTimeDiv.className = "main__time col-12";
      mainTimeDiv.innerHTML = getTimezone;

      target.innerHTML = mainWeekDay.outerHTML + mainTimeDiv.outerHTML;
    }, 1000);
  };

  const observer = new MutationObserver(function (mutations) {
    if (mutations.length > 1) {
      // get main weather and set div
      const mainWeatherLocation = document
        .querySelector(".row-one-two")
        .querySelector(".block__weather__location");

      const mainDate = document.createElement("div");
      mainDate.className = "main__date row";

      mainWeatherLocation.after(mainDate);

      // get and set fav icons
      // setNodesfunc takes the node and the function
      ItemCtrl.setNodesFunction(
        ItemCtrl.createNode(UICtrl.getClasses().btnFavIcon),
        ItemCtrl.setUserFav
      );

      // clock on main
      const getTimezone = ItemCtrl.getMainLocation().timezone;
      const getLanguage = ItemCtrl.getMainLocation().language;

      dateClock(mainDate, getTimezone, getLanguage);
    }
  });

  const UISelectors = {
    elementContainer: document.querySelector(".container__weather__blocks"),
    btnAbout: document.querySelector("#modalOpen"),
    btnResetUserFav: document.querySelector(".reset-user-fav"),
  };
  const UIClasses = {
    btnFavIcon: ".btn-fav-icon",
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },
    getClasses: function () {
      return UIClasses;
    },
    getObserver: function () {
      return observer;
    },
    openModal: function (target) {
      var modal = document.getElementById(target);

      // When the user clicks on the button, open the modal
      modal.style.display = "block";

      // Close modal
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    },
  };
})();

const ItemCtrl = (function () {
  const locations = {
    mainLocation: 0,
  };

  const user = {
    fav: "",
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

  const chunkArray = (myArray, chunk_size) => {
    var results = [];

    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }

    return results;
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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
    position,
    userCode
  ) {
    // const elementContainer = UICtrl.getSelectors().elementContainer;
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    userLocation = userLocation.charAt(0).toUpperCase() + userLocation.slice(1);
    description = description.charAt(0).toUpperCase() + description.slice(1);

    const blockWeather = document.createElement("div");
    blockWeather.className = `block__weather ${cssCol} ${cssRow}`;

    const userFirstName = document.createElement("h4");
    userFirstName.className = "block__weather__first__name row-5";
    userFirstName.innerHTML = `<div class="col-1"></div><div class='col-3'>${firstName}</div><div class="col-1"> <button data-user-code=${userCode} class="btn-fav-icon"><i class="fas fa-home "></i></button> </div>`;

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
    temp.innerHTML = `<i class="fas fa-thermometer-half"></i> ${temperature} °`;

    const wind = document.createElement("h4");
    wind.className = "block__weather__wind";
    wind.innerHTML = `<i class="fas fa-wind"></i> ${windSpeed} km/h`;

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
    getUserFav: function () {
      return user;
    },
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
          // shuffle array
          shuffle(res);

          return res;
        })
        .then((res) => {
          // set main location
          if (ItemCtrl.getUserFav().fav === "") {
            // find index main
            let indexMain = res.findIndex((x) => x.mainLocation === true);
            // set main into obj
            locations.mainLocation = res[indexMain];
            // remove main from array
            res.splice(indexMain, 1);
          }

          if (ItemCtrl.getUserFav().fav !== "") {
            // get user fav
            let userFav = ItemCtrl.getUserFav().fav;

            // find index USER main
            let indexUserMain = res.findIndex(
              (x) => x.userCode === Number(userFav)
            );

            // find obj location
            let objFav = res.find((x) => x.userCode === Number(userFav));

            // set objFav as main location
            locations.mainLocation = objFav;

            // remove obj fav from other list by index
            res.splice(indexUserMain, 1);
          }

          return res;
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
                let col3 = "col-3 t-center-x";
                let col6 = "col-6 t-center-x";

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
                  x.position,
                  x.userCode
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
              // chunk y in arrays of 4 objs each
              // and map each
              // each size has a css style
              chunkArray(y, 4).map((y) => {
                if (y.length === 1) {
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
                      "col-6 t-center-x",
                      "",
                      x.position,
                      x.userCode
                    );

                    rowWeather.innerHTML += `<div class='col-3'></div>`;

                    rowWeather.appendChild(get.html);
                    UICtrl.getSelectors().elementContainer.appendChild(
                      rowWeather
                    );
                  });
                } else if (y.length === 2) {
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
                      "col-6 t-center-x",
                      "",
                      x.position,
                      x.userCode
                    );

                    rowWeather.appendChild(get.html);
                    UICtrl.getSelectors().elementContainer.appendChild(
                      rowWeather
                    );
                  });
                } else if (y.length === 3) {
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
                      "col-4 t-center-x",
                      "",
                      x.position,
                      x.userCode
                    );

                    rowWeather.appendChild(get.html);
                    UICtrl.getSelectors().elementContainer.appendChild(
                      rowWeather
                    );
                  });
                } else {
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
                      "col-3 t-center-x",
                      "",
                      x.position,
                      x.userCode
                    );
                    rowWeather.appendChild(get.html);
                    UICtrl.getSelectors().elementContainer.appendChild(
                      rowWeather
                    );
                  });
                }
              });
            }
          });
        });
    },
    createNode: function (target) {
      return document.querySelectorAll(target);
    },
    setNodesFunction: function (node, func) {
      node.forEach((x) => {
        x.addEventListener("click", func);
      });
    },
    setUserFav: function (e) {
      //get user code to set fav
      let userCode = e.target.parentElement.getAttribute("data-user-code");
      ItemCtrl.getUserFav().fav = userCode;
      localStorage.setItem("userFav", ItemCtrl.getUserFav().fav);
      location.reload();
    },
    resetUserFav: function (e) {
      localStorage.setItem("userFav", "");
      location.reload();
    },
    getMainLocation: function () {
      return locations.mainLocation;
    },
  };
})();

const App = (function (ServerCtrl, UICtrl, ItemCtrl) {
  // check user fav
  const checkUserFav = function () {
    let hasFav = localStorage.getItem("userFav");

    if (hasFav) {
      return (ItemCtrl.getUserFav().fav = hasFav);
    }
  };

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

  const addEventListeners = function () {
    UICtrl.getSelectors().btnAbout.addEventListener("click", function (e) {
      e.preventDefault();
      UICtrl.openModal("aboutModal");
    });
    UICtrl.getSelectors().btnResetUserFav.addEventListener(
      "click",
      function (e) {
        e.preventDefault();
        ItemCtrl.resetUserFav(e);
      }
    );
  };

  return {
    init: function () {
      loadAll();
      checkUserFav();
      addEventListeners();
    },
  };
})(ServerCtrl, UICtrl, ItemCtrl);

App.init();
