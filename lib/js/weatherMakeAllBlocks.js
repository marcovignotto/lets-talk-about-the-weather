let col3 = "";

const mainLocation = new User("Marco", "munich", "de", "metric", 1);

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

const arrAllUsers = getLocations().then((res, rej) => {
  if (!res) {
    console.log("no resolved");
  } else {
    console.log("resolved");
    arrNew = res;

    // console.log("newArr", arrNew);

    // SPLIT ARRAY

    // let newArr = [];
  }
});

const mapAll = async () => {
  console.log("map all");
  chopArray(arrNew, 5).map(async (y, i) => {
    console.log(y);
    try {
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

          // let row1 = "row-one";
          // let row2 = "row-two";
          // let row12 = "row-one-two";

          // const block = await makeWeatherBlock(
          //   x.firstName,
          //   x.location,
          //   x.language,
          //   x.unit,
          //   index === 1 ? col6 : col3,
          //   row(),
          //   x.position
          // ).then((res) => {
          //   return res;
          // });
          //
          // PUSH RES TO NEW ARR
          // arrHtml.push(block);

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
        // const rowWeather = document.createElement("div");
        // rowWeather.className = `row pv-1`;
        // y.map(async (x, index) => {
        //   const get = await makeWeatherBlock(
        //     x.location,
        //     x.language,
        //     x.unit,
        //     "col-3",
        //     "",
        //     x.position
        //   );
        //   rowWeather.appendChild(get.html);
        //   elementContainer.appendChild(rowWeather);
        // });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

mapAll();

// USERS.map((x, i) =>
//   makeWeatherBlock(x.location, x.language, x.unit, "col-3", "grid-row-1-1")
// );

// grid-template-rows: 1fr 1fr; // prima riga
// grid-row: 1 / span 1;;
// grid - row: 1 / span 1;
// grid - row: 1 / span 2; // big
// grid - row: 2 / span 2;
//     grid-row: 2 / span 2;

//
//

// makeWeatherBlock("berlin", "de", "metric");
// makeWeatherBlock("london", "en", "metric");
// makeWeatherBlock("paris", "fr", "metric");
// makeWeatherBlock("new York", "en", "imperial");
// makeWeatherBlock("bagdad", "ar", "metric");
// makeWeatherBlock("boston", "en", "imperial");
// makeWeatherBlock("saigon", "vi", "metric");
// makeWeatherBlock("prague", "cz", "metric");
// makeWeatherBlock("barcelona", "ca", "metric");
// makeWeatherBlock("tel aviv", "en", "metric");
// makeWeatherBlock("athens", "el", "metric");
// makeWeatherBlock("venice", "it", "metric");
// makeWeatherBlock("moscow", "ru", "metric");
// makeWeatherBlock("kiev", "ua", "metric");
// makeWeatherBlock("nairobi", "en", "metric");
// makeWeatherBlock("Addis Abeba", "en", "metric");
// makeWeatherBlock("Mogadishu", "ar", "metric");
// function chunkArrayInGroups(arr, size) {
//   var myArray = [];

//   for (var i = 0; i < arr.length; i += size) {
//     myArray.push(arr.slice(i, i + size));
//   }

//   return myArray;
// }
// console.log(chunkArrayInGroups(USERS, 4));

// export const sendVerificationEmail = async () =>
//   (dispatch) => {
//     try {
//       dispatch({ type: EMAIL_FETCHING, payload: true });
//       await Auth.sendEmailVerification();
//       dispatch({ type: EMAIL_FETCHING, payload: false }))
//     } catch (error) {
//       dispatch({ type: EMAIL_FETCHING, payload: false });
//       throw new Error(error);
//     }
//   };

//   export const sendVerificationEmail = async () =>
//   async (dispatch) => {
//     try {
//       dispatch({ type: EMAIL_FETCHING, payload: true });
//       await Auth.sendEmailVerification();
//       dispatch({ type: EMAIL_FETCHING, payload: false }))
//     } catch (error) {
//       dispatch({ type: EMAIL_FETCHING, payload: false });
//       throw new Error(error);
//     }
//   };
