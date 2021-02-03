// IMPORTS
// import { gridItem } from "./gridItem.js";

// DOM
const btnLogin = document.querySelector(".btn-login");
const emailInput = document.querySelector(".email");
const emailPassword = document.querySelector(".password");
const locationList = document.querySelector(".locations__list");

// URLs
const URL_POST = "http://localhost:5000/api/auth";
const URL_GET = "http://127.0.0.1:5000/api/locations";

// CRID ITEM

const gridItem = (firstName, location, language, unit) => {
  const row = document.createElement("div");
  row.className = `row grid__item`;

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
  editIcon.innerHTML = "X";

  const deleteIcon = document.createElement("div");
  deleteIcon.className = "col-1 delete__icon";
  deleteIcon.innerHTML = "X";

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

// LIST LOCATIONS - NOT init
const listLocations = async (token) => {
  try {
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
    console.log(JSON.parse(resLocations.data));

    JSON.parse(resLocations.data).map((x) =>
      gridItem(x.firstName, x.location, x.language, x.unit)
    );
  } catch (err) {
    console.error(err);
  }
};

// END LIST LOCATIONS

// Check Token for listLocations()
if (sessionStorage.getItem("isAuthenticated")) {
  // get user token and pass it as argument
  listLocations(sessionStorage.getItem("UserToken"));
}

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

    listLocations(token);
    // return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};

// END SEND LOGIN

// BTNs
btnLogin.addEventListener("click", sendLogin);
