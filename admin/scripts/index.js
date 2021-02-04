// IMPORTS
// import { gridItem } from "./gridItem.js";

// VAR
var token = "";
let arrAllUsers = [];
// DOM

// login
const formLogin = document.querySelector(".form__login");
const btnLogin = document.querySelector(".btn-login");
// ADD user
const btnAddUser = document.querySelector(".btn-add-user");
// forms
const emailInput = document.querySelector(".email");
const emailPassword = document.querySelector(".password");
// listing
const locationList = document.querySelector(".locations__list");
// icons

// END DOM

// URLs
const URL_POST = "http://localhost:5000/api/auth";
const URL_GET = "http://127.0.0.1:5000/api/weatherusers";
const URL_DELETE = "http://127.0.0.1:5000/api/weatherusers/";
const URL_PUT = "http://127.0.0.1:5000/api/weatherusers/";

// GRID ITEM

const gridItem = (firstName, location, language, unit, id) => {
  const row = document.createElement("div");
  row.className = `row grid__item pb-1`;

  const firstNameCol = document.createElement("div");
  firstNameCol.className = "col-3 first__name";

  firstNameCol.innerHTML = firstName;

  const locationCol = document.createElement("div");
  locationCol.className = "col-4 location";

  locationCol.innerHTML = location;

  const languageCol = document.createElement("div");
  languageCol.className = "col-1 language";

  languageCol.innerHTML = language;

  const unitCol = document.createElement("div");
  unitCol.className = "col-2 unit";
  unitCol.innerHTML = unit;

  const editIcon = document.createElement("div");
  editIcon.className = "col-1 edit__icon";
  editIcon.dataset.id = id;
  editIcon.innerHTML = `<button class="btn__edit"><i class="far fa-1x fa-edit"></i></button>`;

  const deleteIcon = document.createElement("div");
  deleteIcon.className = "col-1 delete__icon";
  deleteIcon.dataset.id = id;
  deleteIcon.innerHTML = `<button class="btn__delete"><i class="far fa-trash-alt"></i></button>`;

  row.innerHTML +=
    firstNameCol.outerHTML +
    locationCol.outerHTML +
    languageCol.outerHTML +
    unitCol.outerHTML +
    editIcon.outerHTML +
    deleteIcon.outerHTML;

  locationList.appendChild(row);
};
// END GRID ITEM

// LIST USERS - NOT init
const listUsers = async (token) => {
  formLogin.remove();

  try {
    const optionsPostUsers = {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: URL_GET,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    resUsers = await axios(optionsPostUsers);
    arrAllUsers = JSON.parse(resUsers.data);

    arrAllUsers.map((x) =>
      gridItem(x.firstName, x.location, x.language, x.unit, x._id)
    );

    iconsInit();
  } catch (err) {
    console.error(err);
  }
};

// END LIST USERS

// Check Token for listUsers()
if (sessionStorage.getItem("isAuthenticated")) {
  // get user token and pass it as argument
  token = sessionStorage.getItem("UserToken");
  formLogin.classList.add("hide");
  listUsers(token);
}
if (!sessionStorage.getItem("isAuthenticated")) {
  formLogin.classList.remove("hide");
}

const inputs = {
  id: function (e) {
    return e.target.parentElement.parentElement.getAttribute("data-id");
  },
  gridItem: function (e) {
    return e.target.parentElement.closest(".grid__item");
  },
  menuRow: function (e) {
    return e.target.parentElement.parentElement.querySelector(".menu");
  },
  userToEdit: function (id = "") {
    let userToEdit = arrAllUsers.find((x) => x._id === id);
    return userToEdit;
  },

  row: function (
    _id = "",
    firstName = "",
    location = "",
    language = "",
    unit = ""
  ) {
    const row = document.createElement("div");
    row.className = `row grid__item__edit pb-1`;

    const firstNameCol = document.createElement("input");
    firstNameCol.className = "col-3 edit__input first__name";
    firstNameCol.setAttribute("type", "text");
    firstNameCol.setAttribute("value", firstName);

    const locationCol = document.createElement("input");
    locationCol.className = "col-4 edit__input location";
    locationCol.setAttribute("type", "text");
    locationCol.setAttribute("value", location);

    const languageCol = document.createElement("input");
    languageCol.className = "col-1 edit__input language";
    languageCol.setAttribute("type", "text");
    languageCol.setAttribute("value", language);

    const unitCol = document.createElement("input");
    unitCol.className = "col-2 edit__input unit";
    unitCol.setAttribute("type", "text");
    unitCol.setAttribute("value", unit);

    const editIcon = document.createElement("div");
    editIcon.className = "col-1 save__icon";
    editIcon.dataset.id = _id;
    editIcon.innerHTML = `<button class="btn__update__weather__user"><i class="fas fa-save"></i></button>`;

    const deleteIcon = document.createElement("div");
    deleteIcon.className = "col-1 undo__icon";
    deleteIcon.dataset.id = _id;
    deleteIcon.innerHTML = `<button class="btn__undo__weather__user"><i class="fas fa-times"></i></button>`;

    row.innerHTML +=
      firstNameCol.outerHTML +
      locationCol.outerHTML +
      languageCol.outerHTML +
      unitCol.outerHTML +
      editIcon.outerHTML +
      deleteIcon.outerHTML;

    return row;
  },
};

// EDIT & DELETE
const submitEdit = (e) => {
  const { _id, firstName, location, language, unit } = inputs.userToEdit(
    inputs.id(e)
  );

  inputs
    .gridItem(e)
    .after(inputs.row(_id, firstName, location, language, unit));

  iconsEditInit();
};

const addNewUserInputs = (e) => {
  inputs.menuRow(e).after(inputs.row());

  // iconsNewUserInit();
};

const submitDelete = async (e) => {
  e.preventDefault();
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  let userName = e.target.parentElement.parentElement.parentElement.querySelector(
    ".first__name"
  ).textContent;

  let gridItem = e.target.parentElement.closest(".grid__item");

  // try {
  //   const optionsDeleteWeatherUser = {
  //     method: "delete",
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     url: `${URL_DELETE}/${id}`,
  //     transformResponse: [
  //       (data) => {
  //         // transform the response
  //         return data;
  //       },
  //     ],
  //   };

  //   resDeleteWeatherUser = await axios(optionsDeleteWeatherUser);
  //   if (
  //     resDeleteWeatherUser.status >= 200 &&
  //     resDeleteWeatherUser.status <= 399
  //   ) {
  //     gridItem.style.transition = "all 2s";
  //     // remove class
  //     gridItem.classList.remove("row");

  //     // instead of removing filling it empty so it removes all the childs
  //     gridItem.style.opacity = "0";
  //     gridItem.innerHTML = `${userName} successfully removed`;
  //     gridItem.style.opacity = "1";

  //     setTimeout(() => {
  //       gridItem.style.opacity = "0";
  //     }, 1000);

  //     setTimeout(() => {
  //       gridItem.remove();
  //     }, 3000);
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
};

// END EDIT & DELETE

//

// SEND LOGIN
const sendLogin = async (e) => {
  e.preventDefault();

  try {
    const optionsPostAuth = {
      method: "post",

      data: {
        email: emailInput.value,
        password: emailPassword.value,
      },
      url: URL_POST,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(optionsPostAuth);

    const { token } = JSON.parse(res.data);

    sessionStorage.setItem("UserToken", token);

    const optionsPostLocations = {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: URL_GET,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    resLocations = await axios(optionsPostLocations);

    if (resLocations.status >= 200 && resLocations.status <= 399)
      sessionStorage.setItem("isAuthenticated", true);

    listUsers(token);
    // return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};

// END SEND LOGIN

// BTNs
btnLogin.addEventListener("click", sendLogin);

btnAddUser.addEventListener("click", function (e) {
  console.log(e.target.parentElement.parentElement.querySelector(".menu"));
  addNewUserInputs(e);
});
// ICONS
const iconsInit = () => {
  document.querySelectorAll(".edit__icon").forEach((x) =>
    x.addEventListener("click", function (e) {
      submitEdit(e);
    })
  );
  document
    .querySelectorAll(".delete__icon")
    .forEach((x) => x.addEventListener("click", submitDelete));
};

const iconsEditInit = (weatherUserObj) => {
  document
    .querySelector(".btn__update__weather__user")
    .addEventListener("click", function (e) {
      updateWeatherUser(e);
    });
  document
    .querySelector(".btn__undo__weather__user")
    .addEventListener("click", undoEditWeatherUser);
};

const undoEditWeatherUser = (e) => {
  console.log("undo");
  e.preventDefault();
  e.target.parentElement.closest(".grid__item__edit").remove();
};

const updateWeatherUser = async (e) => {
  e.preventDefault();
  // console.log(e.target);

  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  let firstName = e.target.parentElement.parentElement.parentElement.querySelector(
    ".first__name"
  ).value;

  let weatherUserObj = {};
  weatherUserObj["_id"] = id;

  let inputClassesArr = [];
  let inputClassesToDelete = [
    "col-1",
    "col-2",
    "col-3",
    "col-4",
    "edit__input",
  ];

  // collect all the classes  OK
  e.target.parentElement.parentElement.parentElement
    .querySelectorAll("input")
    .forEach((x) => inputClassesArr.push([...x.className.split(" ")]));

  const flatten = (arr) => [].concat.apply([], arr);

  // flat arrays and return unique array
  inputClassesArr = [...new Set(flatten(inputClassesArr))];

  // FILTER the two arrays

  inputClassesArr = inputClassesArr.filter(
    (value) => !inputClassesToDelete.includes(value)
  );

  // change first__name

  // OBJ TEST

  let allNodes = e.target.parentElement.parentElement.parentElement.querySelectorAll(
    "input"
  );

  // loop througt the nodes and create obj
  allNodes.forEach((x, i) => {
    if (x.classList.contains(inputClassesArr[i]))
      weatherUserObj[inputClassesArr[i]] = x.value;
  });

  // change from first__name to firstName
  weatherUserObj["firstName"] = "";
  weatherUserObj.firstName = weatherUserObj.first__name;
  delete weatherUserObj.first__name;

  // END OBJ TEST

  // // OBJ OK

  // e.target.parentElement.parentElement.parentElement
  //   .querySelectorAll("input")
  //   .forEach((x) => {
  //     if (x.classList.contains("first__name"))
  //       weatherUserObj["firstName"] = x.value;
  //     if (x.classList.contains("location"))
  //       weatherUserObj["location"] = x.value;
  //     if (x.classList.contains("language"))
  //       weatherUserObj["language"] = x.value;
  //     if (x.classList.contains("unit")) weatherUserObj["unit"] = x.value;
  //   });

  // // console.log(weatherUserObj);
  // // END OBJ OK

  // let weatherUserObj = {
  //   _id: id,
  //   firstName,
  //   location,
  //   language,
  //   unit,
  // };
  // console.log("updateWeatherUser", weatherUserObj);
  try {
    const optionUpdateWeatherUser = {
      method: "put",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: `${URL_PUT}/${weatherUserObj._id}`,
      data: weatherUserObj,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };
    resUpdateWeatherUser = await axios(optionUpdateWeatherUser);
    console.log(resUpdateWeatherUser);

    // if (
    //   resUpdateWeatherUser.status >= 200 &&
    //   resUpdateWeatherUser.status <= 399
    // ) {
    //   console.log("User updated");
    //   // gridItem.style.transition = "all 2s";
    //   // // remove class
    //   // gridItem.classList.remove("row");
    //   // // instead of removing filling it empty so it removes all the childs
    //   // gridItem.style.opacity = "0";
    //   // gridItem.innerHTML = `${userName} successfully removed`;
    //   // gridItem.style.opacity = "1";
    //   // setTimeout(() => {
    //   //   gridItem.style.opacity = "0";
    //   // }, 1000);
    //   // setTimeout(() => {
    //   //   gridItem.remove();
    //   // }, 3000);
    // }
  } catch (err) {
    console.error(err);
  }
};
