let col3 = "";

// const mainLocation = new User("Marco", "munich", "de", "metric", 1);
const mainLocation = {
  description: "Klarer Himmel",
  firstName: "DCI",
  icon: "01d",
  language: "de",
  location: "Berlin",
  mainWeather: "Clear",
  temperature: "0.22",
  wind: "4.63",
};

// DOM ELEMENTS
const elementContainer = document.querySelector(".container__weather__blocks");

// getLocations();

let arrNew = [];
let firstArr = [];

const chopArray = (arr, size) => {
  for (let i = 0; i < size - 1; i = i + size - 1) {
    firstArr.push(arr.slice(i, i + size - 1));
  }
  let oldArr = arr.splice(size - 1, arr.length);

  return [...firstArr, oldArr];
};

const arrAllUsers = getLocations()
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
        y.splice(1, 0, mainLocation);

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
              elementContainer.appendChild(rowWeather);
            });
          }
        });
        // } else if (i > 0 && y.length >= 4) {
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
      // } catch (error) {
      // console.log(error);
      // }
    });
    // };
  });
