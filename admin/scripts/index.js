// VAR
var token = "";
let arrAllUsers = [];

const OWCtrL = (function () {
  const URLs = {
    OPEN_WEATHER_GET:
      "https://api.openweathermap.org/data/2.5/weather?q=",
  };
  const keys = {
    apiKey: "169986ea94b386da8e6d479f3e6971d",
  };
  return {
    openWCallApi: function (location, units, language) {

      const URL = `${URLs.OPEN_WEATHER_GET}${location}&units=${units}&appid=${keys}&lang=${language}`,

      

      return keys;
    },
  };
})();

const ServerCtrl = (function () {
  const URLs = {
    URL_POST: "http://localhost:5000/api/auth",
    URL_POST_USER: "http://127.0.0.1:5000/api/weatherusers/",
    URL_GET: "http://127.0.0.1:5000/api/weatherusers",
    URL_DELETE: "http://127.0.0.1:5000/api/weatherusers/",
    URL_PUT: "http://127.0.0.1:5000/api/weatherusers/",
    OPEN_WEATHER_GET:
      "api.openweathermap.org/data/2.5/weather?q=berlin&units=metric&appid=169986ea94b386da8e6d479f3e6971d0&lang=en",
  };

  return {
    getUrls: function () {
      return URLs;
    },

    callApi: async function (method, email, password, url) {
      try {
        const options = {
          method: method,
          data: {
            email: email,
            password: password,
          },
          url: url,
          transformResponse: [
            (data) => {
              // transform the response
              return data;
            },
          ],
        };

        const res = await axios(options);
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    callApiAuth: async function (method, token, url, obj = {}, id = "") {
      if (method === "delete" || method === "put") url = `${url}/${id}`;

      try {
        const options = {
          method: method,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: obj,
          url: url,
          transformResponse: [
            (data) => {
              // transform the response
              return data;
            },
          ],
        };

        const res = await axios(options);

        if (res.status >= 200 && res.status <= 399) {
          sessionStorage.setItem("isAuthenticated", true);
          sessionStorage.setItem("UserToken", token);
        }
        return res;
      } catch (err) {
        console.error(err);
      }
    },
  };
})();

const ItemCtrl = (function () {
  return {
    getInputUser: function (e) {
      // function that loops through the input nodes in the closest row
      let weatherUserObj = {};
      let inputClassesArr = [];

      // get all nodes
      let allNodes = e.target
        .closest(UICtrl.getSelectorsClasses().row)
        .querySelectorAll("input");

      // collect all the classes  OK
      allNodes.forEach((x) => inputClassesArr.push([x.getAttribute("id")]));

      // flat array
      inputClassesArr = inputClassesArr.flat();

      // loop througt the nodes and create obj
      allNodes.forEach((x, i) => {
        if (x.getAttribute("id") === inputClassesArr[i])
          weatherUserObj[inputClassesArr[i]] = x.value;
      });
      return weatherUserObj;
    },
    sendLogin: async function (e) {
      e.preventDefault();
      const URLs = ServerCtrl.getUrls();

      // post to get token
      await ServerCtrl.callApi(
        "post",
        App.selectors().emailInput.value,
        App.selectors().emailPassword.value,
        URLs.URL_POST
      )
        // get auth with token
        .then((res) => {
          return ServerCtrl.callApiAuth(
            "get",
            JSON.parse(res).token,
            URLs.URL_GET
          );
        })
        // populate users
        .then((res) => UICtrl.listUsers(res.data));
    },
    // sendLoginOldWorking: async function (e) {
    //   e.preventDefault();
    //   console.log();
    //   const email = App.selectors().emailInput.value;
    //   const password = App.selectors().emailPassword.value;

    //   try {
    //     const optionsPostAuth = {
    //       method: "post",
    //       data: {
    //         email: email,
    //         password: password,
    //       },
    //       url: App.urls().URL_POST,
    //       transformResponse: [
    //         (data) => {
    //           // transform the response
    //           return data;
    //         },
    //       ],
    //     };

    //     const res = await axios(optionsPostAuth);
    //     const { token } = JSON.parse(res.data);

    //     sessionStorage.setItem("UserToken", token);

    //     const optionsPostLocations = {
    //       method: "get",
    //       headers: {
    //         "Access-Control-Allow-Origin": "*",
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       url: App.urls().URL_GET,
    //       transformResponse: [
    //         (data) => {
    //           // transform the response
    //           return data;
    //         },
    //       ],
    //     };

    //     resLocations = await axios(optionsPostLocations);
    //     console.log(resLocations);
    //     if (resLocations.status >= 200 && resLocations.status <= 399)
    //       sessionStorage.setItem("isAuthenticated", true);

    //     listUsers(token);
    //     // return JSON.parse(res.data);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // },
    getToken: function () {
      return sessionStorage.getItem("UserToken");
    },
    getArrUsers: function () {
      return sessionStorage.getItem("arrUsers");
    },
    addUserRow: function () {
      // grid item below last one
      let lastElement = UICtrl.getSelectors().locationList.lastElementChild;
      // create new row
      let newRow = UICtrl.row();

      // append new row after edited row
      lastElement.after(newRow);

      // mandatory
      UICtrl.iconsEditInit("save");
    },
    saveWeatherUser: async function (e) {
      ItemCtrl.getInputUser(e);

      let weatherUserObj = ItemCtrl.getInputUser(e);

      const res = await ServerCtrl.callApiAuth(
        "post",
        ItemCtrl.getToken(),
        App.urls().URL_POST_USER,
        weatherUserObj
      );

      if (res.status >= 200 && res.status <= 399) {
        // get id just created and add to the object
        weatherUserObj["_id"] = JSON.parse(res.data)._id;

        // get array from session Storage
        let arrUsers = JSON.parse(ItemCtrl.getArrUsers());

        // push in array
        arrUsers.push(weatherUserObj);

        // update array in session Storage

        sessionStorage.setItem("arrUsers", JSON.stringify(arrUsers));

        // destru weatherObj
        const { _id, firstName, location, language, unit } = weatherUserObj;

        // DOM
        let currRow = e.target.closest(UICtrl.getSelectorsClasses().row);

        let lastElement = UICtrl.getSelectors().locationList.lastElementChild;
        console.log(lastElement.previousElementSibling);

        setTimeout(() => {
          currRow.style.opacity = "0";
        }, 500);

        setTimeout(() => {
          currRow.remove();
        }, 1000);

        // Create new row with no I doesn't automatically append

        let newRow = UICtrl.gridItem(
          firstName,
          location,
          language,
          unit,
          _id,
          "no"
        );

        // opacity to new row
        newRow.style.opacity = "0";

        // append new row after edited row
        lastElement.after(newRow);

        setTimeout(() => {
          // opacity to new row
          newRow.style.opacity = "1";
        }, 1500);
      }
    },
  };
})();

const UICtrl = (function () {
  const UISelectorsClasses = {
    // login
    formLogin: ".form__login",
    btnLogin: ".btn-login",
    emailInput: ".email",
    emailPassword: ".password",

    // ADD user
    btnAddUser: ".btn-add-user",

    // listing
    locationList: ".locations__list",

    // icons
    iconEdit: ".edit__icon",
    iconDelete: ".delete__icon",
    iconUpdateWeaUser: ".btn__update__weather__user",
    iconUndoWeaUser: ".btn__undo__weather__user",

    // Rows and Grids
    gridItem: ".grid__item",
    row: ".row",

    // grid classes
    firstName: ".first__name",
    location: ".location",
    language: ".language",
    unit: ".unit",

    // grid edit
    gridItemEdit: ".grid__item__edit",

    //menu
    menu: ".menu",
  };

  const UISelectors = {
    // login
    formLogin: document.querySelector(UISelectorsClasses.formLogin),
    btnLogin: document.querySelector(UISelectorsClasses.btnLogin),
    emailInput: document.querySelector(UISelectorsClasses.emailInput),
    emailPassword: document.querySelector(UISelectorsClasses.emailPassword),

    // ADD user
    btnAddUser: document.querySelector(UISelectorsClasses.btnAddUser),
    // forms
    // listing
    locationList: document.querySelector(UISelectorsClasses.locationList),

    // icons
    menu: document.querySelector(UISelectorsClasses.menu),
  };

  // public
  return {
    gridItem: function (
      firstName,
      location,
      language,
      unit,
      id,
      append = "yes"
    ) {
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

      if (append === "yes") {
        return this.getSelectors().locationList.appendChild(row);
      }
      return row;
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
      firstNameCol.setAttribute("id", "firstName");
      firstNameCol.setAttribute("value", firstName);

      const locationCol = document.createElement("input");
      locationCol.className = "col-4 edit__input location";
      locationCol.setAttribute("type", "text");
      locationCol.setAttribute("id", "location");
      locationCol.setAttribute("value", location);

      const languageCol = document.createElement("input");
      languageCol.className = "col-1 edit__input language";
      languageCol.setAttribute("type", "text");
      languageCol.setAttribute("id", "language");
      languageCol.setAttribute("value", language);

      const unitCol = document.createElement("input");
      unitCol.className = "col-2 edit__input unit";
      unitCol.setAttribute("type", "text");
      unitCol.setAttribute("id", "unit");
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

    getSelectors: function () {
      return UISelectors;
    },
    getSelectorsClasses: function () {
      return UISelectorsClasses;
    },

    submitEdit: function (e) {
      // get the closest row (the one to edit)
      let closestRow = e.target.closest(UICtrl.getSelectorsClasses().row);

      // get id to edit
      let id = e.target.parentElement.parentElement.getAttribute("data-id");

      // filter id to edit
      let getAllUsers = JSON.parse(sessionStorage.getItem("arrUsers"));

      const { _id, firstName, location, language, unit } = getAllUsers.find(
        (x) => x._id === id
      );

      // create new row
      let newRow = UICtrl.row(_id, firstName, location, language, unit);

      // append new row after edited row
      closestRow.after(newRow);

      UICtrl.iconsEditInit("update");
    },

    submitDelete: async function (e) {
      e.preventDefault();

      let id = e.target.parentElement.parentElement.getAttribute("data-id");

      let userName = e.target.parentElement.parentElement.parentElement.querySelector(
        ".first__name"
      ).textContent;

      let gridItem = e.target.parentElement.closest(
        UICtrl.getSelectorsClasses().gridItem
      );

      const res = await ServerCtrl.callApiAuth(
        "delete",
        ItemCtrl.getToken(),
        App.urls().URL_DELETE,
        {},
        id
      );

      if (res.status >= 200 && res.status <= 399) {
        // get array from session Storage
        let arrUsers = JSON.parse(ItemCtrl.getArrUsers()).slice();
        // splice Item
        JSON.parse(ItemCtrl.getArrUsers()).filter((x, i) => {
          if (x._id === id) {
            console.log("del from arr", i);
            arrUsers.splice(i, 1);
          }
        });

        // update array in session Storage
        sessionStorage.setItem("arrUsers", JSON.stringify(arrUsers));

        // DOM
        gridItem;
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
    },

    updateWeatherUser: async function (e) {
      e.preventDefault();

      // get values for uptate
      let id = e.target.parentElement.parentElement.getAttribute("data-id");
      // let firstName = e.target.parentElement.parentElement.parentElement.querySelector(
      //   ".first__name"
      // ).value;

      // let allNodes = e.target.parentElement.parentElement.parentElement.querySelectorAll(
      //   "input"
      // );

      // let weatherUserObj = {};
      // weatherUserObj["_id"] = id;

      // let inputClassesArr = [];

      // // collect all the classes  OK
      // allNodes.forEach((x) => inputClassesArr.push([x.getAttribute("id")]));

      // // flat array
      // inputClassesArr = inputClassesArr.flat();

      // // loop througt the nodes and create obj
      // allNodes.forEach((x, i) => {
      //   if (x.getAttribute("id") === inputClassesArr[i])
      //     weatherUserObj[inputClassesArr[i]] = x.value;
      // });

      // send evetnt to funciton that returns an obj

      let weatherUserObj = ItemCtrl.getInputUser(e);

      weatherUserObj["_id"] = id;

      const res = await ServerCtrl.callApiAuth(
        "put",
        ItemCtrl.getToken(),
        App.urls().URL_PUT,
        weatherUserObj,
        weatherUserObj._id
      );

      if (res.status >= 200 && res.status <= 399) {
        // get array from session Storage
        let arrUsers = JSON.parse(ItemCtrl.getArrUsers()).slice();

        // splice Item
        JSON.parse(ItemCtrl.getArrUsers()).filter((x, i) => {
          if (x._id === id) {
            arrUsers.splice(i, 1, weatherUserObj);
          }
        });

        // update array in session Storage
        sessionStorage.setItem("arrUsers", JSON.stringify(arrUsers));

        let currRow = e.target.closest(
          UICtrl.getSelectorsClasses().gridItemEdit
        );

        let prevRow =
          e.target.parentElement.parentElement.parentElement
            .previousElementSibling;

        // to disable is is to save
        setTimeout(() => {
          prevRow.querySelector(
            UICtrl.getSelectorsClasses().firstName
          ).innerHTML = weatherUserObj.firstName;
          prevRow.querySelector(
            UICtrl.getSelectorsClasses().location
          ).innerHTML = weatherUserObj.location;
          prevRow.querySelector(
            UICtrl.getSelectorsClasses().language
          ).innerHTML = weatherUserObj.language;
          prevRow.querySelector(UICtrl.getSelectorsClasses().unit).innerHTML =
            weatherUserObj.unit;
        }, 500);

        setTimeout(() => {
          currRow.style.opacity = "0";
        }, 1000);

        setTimeout(() => {
          currRow.remove();
        }, 1500);
      }
    },

    listUsers: function (usersArr) {
      UICtrl.showMenu();
      App.selectors().formLogin.remove();
      sessionStorage.setItem("arrUsers", usersArr);

      JSON.parse(usersArr).map((x) =>
        this.gridItem(x.firstName, x.location, x.language, x.unit, x._id)
      );

      this.iconsInit();
    },

    iconsInit: function () {
      document
        .querySelectorAll(this.getSelectorsClasses().iconEdit)
        .forEach((x) => x.addEventListener("click", this.submitEdit));
      document
        .querySelectorAll(this.getSelectorsClasses().iconDelete)
        .forEach((x) => x.addEventListener("click", this.submitDelete));
    },

    iconsEditInit: function (type) {
      document
        .querySelector(UICtrl.getSelectorsClasses().iconUpdateWeaUser)
        .addEventListener("click", function (e) {
          type === "update"
            ? UICtrl.updateWeatherUser(e)
            : ItemCtrl.saveWeatherUser(e);
        });
      document
        .querySelector(UICtrl.getSelectorsClasses().iconUndoWeaUser)
        .addEventListener("click", undoEditWeatherUser);
    },
    showMenu: function () {
      App.selectors().menu.classList.remove("hide");
    },
  };
})();

const App = (function (ItemCtrl, UICtrl, ServerCtrl, OWCtrL) {
  console.log(OWCtrL.openWCallApi());

  // Event listeners init
  const URLs = ServerCtrl.getUrls();
  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function () {
    UISelectors.btnLogin.addEventListener("click", function (e) {
      ItemCtrl.sendLogin(e);
    });

    UISelectors.btnAddUser.addEventListener("click", ItemCtrl.addUserRow);
  };

  const checkSessionOnStart = function () {
    if (sessionStorage.getItem("isAuthenticated")) {
      // hide login
      App.selectors().formLogin.classList.add("hide");
      UICtrl.showMenu();
      // get array of users from session Storage
      UICtrl.listUsers(sessionStorage.getItem("arrUsers"));
    }
    if (!sessionStorage.getItem("isAuthenticated")) {
      document;
      App.selectors().formLogin.classList.remove("hide");
    }
  };

  return {
    init: function () {
      checkSessionOnStart();
      loadEventListeners();
    },
    selectors: () => UISelectors,
    urls: () => URLs,
  };
})(ItemCtrl, UICtrl, ServerCtrl, OWCtrL);

App.init();

// Check Token for listUsers()

// END LIST USERS

//
// FIRST REFACTORING WORKING
//
// NOW DISABLED
//

// const XXXXXXXinputs = {
//   userToUpdate: {
//     _id: "",
//     firstName: "",
//     location: "",
//     language: "",
//     unit: "",
//   },
//   id: function (e) {
//     return e.target.parentElement.parentElement.getAttribute("data-id");
//   },
//   gridItem: function (e) {
//     return e.target.parentElement.closest(".grid__item");
//   },
//   menuRow: function (e) {
//     return e.target.parentElement.parentElement.querySelector(".menu");
//   },
//   userToEdit: function (id = "") {
//     let userToEdit = arrAllUsers.find((x) => x._id === id);
//     return userToEdit;
//   },

//   row: function (
//     _id = "",
//     firstName = "",
//     location = "",
//     language = "",
//     unit = ""
//   ) {
//     const row = document.createElement("div");
//     row.className = `row grid__item__edit pb-1`;

//     const firstNameCol = document.createElement("input");
//     firstNameCol.className = "col-3 edit__input first__name";
//     firstNameCol.setAttribute("type", "text");
//     firstNameCol.setAttribute("value", firstName);

//     const locationCol = document.createElement("input");
//     locationCol.className = "col-4 edit__input location";
//     locationCol.setAttribute("type", "text");
//     locationCol.setAttribute("value", location);

//     const languageCol = document.createElement("input");
//     languageCol.className = "col-1 edit__input language";
//     languageCol.setAttribute("type", "text");
//     languageCol.setAttribute("value", language);

//     const unitCol = document.createElement("input");
//     unitCol.className = "col-2 edit__input unit";
//     unitCol.setAttribute("type", "text");
//     unitCol.setAttribute("value", unit);

//     const editIcon = document.createElement("div");
//     editIcon.className = "col-1 save__icon";
//     editIcon.dataset.id = _id;
//     editIcon.innerHTML = `<button class="btn__update__weather__user"><i class="fas fa-save"></i></button>`;

//     const deleteIcon = document.createElement("div");
//     deleteIcon.className = "col-1 undo__icon";
//     deleteIcon.dataset.id = _id;
//     deleteIcon.innerHTML = `<button class="btn__undo__weather__user"><i class="fas fa-times"></i></button>`;

//     row.innerHTML +=
//       firstNameCol.outerHTML +
//       locationCol.outerHTML +
//       languageCol.outerHTML +
//       unitCol.outerHTML +
//       editIcon.outerHTML +
//       deleteIcon.outerHTML;

//     // this.userToUpdate(firstNameCol.value, location, language, unit);

//     // const sendDataForUpd = () => {
//     //   // console.log(firstNameCol.value, location, language, unit);
//     //   let objToUpd = {
//     //     firstName,
//     //     location,
//     //     language,
//     //     unit,
//     //   };
//     //   this.userToUpdate(objToUpd);
//     // };
//     const sendDataForUpd = (a) => {
//       console.log("update data");
//       this.userToUpdate.id = _id;
//       this.userToUpdate.firstName = a;
//       this.userToUpdate.location = locationCol.value;
//       this.userToUpdate.language = languageCol.value;
//       this.userToUpdate.unit = unitCol.value;
//     };
//     sendDataForUpd(firstNameCol.value);
//     console.log(this.userToUpdate);
//     // sendDataForUpd();
//     // console.log("firstNameCol.value", firstNameCol.value);
//     return { row };
//   },

//   // userToUpdate: function (objToUpd) {
//   //   // console.log(objToUpd);
//   //   // let userToUpdate = {};
//   //   // if (objToUpd === undefined) return userToUpdate;
//   //   const { firstName, location, language, unit } = objToUpd;
//   //   userToUpdate = {
//   //     firstName,
//   //     location,
//   //     language,
//   //     unit,
//   //   };
//   //   console.log(userToUpdate);
//   //   return userToUpdate;
//   // },
// };

// EDIT & DELETE

const addNewUserInputs1 = (e) => {
  inputs.menuRow(e).after(inputs.row().row);

  // iconsNewUserInit();
};

const undoEditWeatherUser = (e) => {
  console.log("undo");
  e.preventDefault();
  e.target.parentElement.closest(".grid__item__edit").remove();
};
