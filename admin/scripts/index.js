// IMPORTS
// import { gridItem } from "./gridItem.js";

// VAR
var token = "";

// DOM

// login
const formLogin = document.querySelector(".form__login");
const btnLogin = document.querySelector(".btn-login");
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
    console.log(JSON.parse(resUsers.data));

    JSON.parse(resUsers.data).map((x) =>
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

// EDIT & DELETE
const submitEdit = () => console.log("edit");

const submitDelete = async (e) => {
  e.preventDefault();
  let id = e.target.parentElement.parentElement.getAttribute("data-id");
  let userName = e.target.parentElement.parentElement.parentElement.querySelector(
    ".first__name"
  ).textContent;

  let gridItem = e.target.parentElement.closest(".grid__item");

  try {
    const optionsDeleteWeatherUser = {
      method: "delete",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      url: `${URL_DELETE}/${id}`,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    resDeleteWeatherUser = await axios(optionsDeleteWeatherUser);
    if (
      resDeleteWeatherUser.status >= 200 &&
      resDeleteWeatherUser.status <= 399
    ) {
      gridItem.style.transition = "all 2s";
      // remove class
      gridItem.classList.remove("row");

      // instead of removing filling it empty so it removes all the childs
      gridItem.style.opacity = "0";
      gridItem.innerHTML = `${userName} successfully removed`;
      gridItem.style.opacity = "1";

      setTimeout(() => {
        gridItem.style.opacity = "0";
      }, 1000);

      setTimeout(() => {
        gridItem.remove();
      }, 3000);
    }
  } catch (err) {
    console.error(err);
  }
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

// ICONS
const iconsInit = () => {
  // document.querySelectorAll(".edit__icon");
  //     const iconEdit = document.querySelector(".edit__icon");
  //     const iconDelete = document.querySelector(".delete__icon");
  document
    .querySelectorAll(".edit__icon")
    .forEach((x) => x.addEventListener("click", submitEdit));
  document
    .querySelectorAll(".delete__icon")
    .forEach((x) => x.addEventListener("click", submitDelete));
};
