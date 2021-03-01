const ItemCtrl = (function () {
  userActions = {
    isEditing: false,
    isError: false,
  };

  langArray = [
    { code: "af", language: "Afrikaans" },
    { code: "al", language: "Albanian" },
    { code: "ar", language: "Arabic" },
    { code: "az", language: "Azerbaijani" },
    { code: "bg", language: "Bulgarian" },
    { code: "ca", language: "Catalan" },
    { code: "cz", language: "Czech" },
    { code: "da", language: "Danish" },
    { code: "de", language: "German" },
    { code: "el", language: "Greek" },
    { code: "en", language: "English" },
    { code: "eu", language: "Basque" },
    { code: "fa", language: "Persian (Farsi)" },
    { code: "fi", language: "Finnish" },
    { code: "fr", language: "French" },
    { code: "gl", language: "Galician" },
    { code: "he", language: "Hebrew" },
    { code: "hi", language: "Hindi" },
    { code: "hr", language: "Croatian" },
    { code: "hu", language: "Hungarian" },
    { code: "id", language: "Indonesian" },
    { code: "it", language: "Italian" },
    { code: "ja", language: "Japanese" },
    { code: "kr", language: "Korean" },
    { code: "la", language: "Latvian" },
    { code: "lt", language: "Lithuanian" },
    { code: "mk", language: "Macedonian" },
    { code: "no", language: "Norwegian" },
    { code: "nl", language: "Dutch" },
    { code: "pl", language: "Polish" },
    { code: "pt", language: "Portuguese" },
    { code: "pt_br", language: "Português Brasil" },
    { code: "ro", language: "Romanian" },
    { code: "ru", language: "Russian" },
    { code: "sv", language: "Swedish" },
    { code: "sk", language: "Slovak" },
    { code: "sl", language: "Slovenian" },
    { code: "sp", language: "Spanish" },
    { code: "sr", language: "Serbian" },
    { code: "th", language: "Thai" },
    { code: "tr", language: "Turkish" },
    { code: "ua", language: "Ukrainian" },
    { code: "vi", language: "Vietnamese" },
    { code: "zh_cn", language: "Chinese Simplified" },
    { code: "zh_tw", language: "Chinese Traditional" },
    { code: "zu", language: "Zulu" },
  ];

  const setInputError = function (e, target) {
    // set user error tot true
    userActions.isError = true;

    // get elements and create error
    e.target.parentElement
      .closest(".grid__item__edit")
      .querySelector(target)
      .classList.add("input-text-error");

    const row = document.createElement("div");
    row.className = `row-1 error__row`;

    const divError = document.createElement("div");
    divError.innerHTML = "It must be at least 3 characters";

    row.innerHTML += divError.outerHTML;

    e.target.parentElement.closest(".grid__item__edit").after(row);
  };
  const removeInputError = function (e, target) {
    e.target.parentElement
      .closest(".grid__item__edit")
      .querySelector(target)
      .classList.remove("input-text-error");

    // if error is false skip
    if (!userActions.isError) return;

    document.querySelector(".error__row").remove();

    userActions.isError = false;
  };
  unitArray = ["standard", "metric", "imperial"];
  return {
    getLangArray: function () {
      return langArray;
    },
    getUnitArray: function () {
      return unitArray;
    },

    getInputUser: function (e) {
      // function that loops through the input nodes in the closest row
      let weatherUserObj = {};
      let inputClassesArr = [];

      // get all nodes for inputs
      let allNodes = e.target
        .closest(UICtrl.getSelectorsClasses().row)
        .querySelectorAll("input");

      // get all nodes for selects
      let allNodesSelect = e.target
        .closest(UICtrl.getSelectorsClasses().row)
        .querySelectorAll("select");

      allNodes = [...allNodes, ...allNodesSelect];

      // collect all the classes  OK
      allNodes.forEach((x) => inputClassesArr.push([x.getAttribute("id")]));

      // flat array
      inputClassesArr = inputClassesArr.flat();

      // loop througt the nodes and create obj
      allNodes.forEach((x, i) => {
        if (x.getAttribute("id") === inputClassesArr[i]) {
          weatherUserObj[inputClassesArr[i]] = x.value;
        }
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

    getToken: function () {
      return sessionStorage.getItem("UserToken");
    },
    getArrUsers: function () {
      return sessionStorage.getItem("arrUsers");
    },
    addUserRow: function () {
      if (userActions.isEditing) return;
      // grid item below last one
      let lastElement;

      if (UICtrl.getSelectors().locationList.lastElementChild === null) {
        lastElement = UICtrl.getSelectors().locationList;
      } else {
        lastElement = UICtrl.getSelectors().locationList.lastElementChild;
      }

      // create new row
      let newRow = UICtrl.row();

      // append new row after edited row
      lastElement.after(newRow);

      // mandatory
      UICtrl.iconsEditInit("save");
      UICtrl.checkboxMainLocationInit();

      // isEditing
      ItemCtrl.setIsEditingTrue();
    },
    saveWeatherUser: async function (e) {
      ItemCtrl.getInputUser(e);

      let weatherUserObj = ItemCtrl.getInputUser(e);

      // check inputs length
      if (weatherUserObj.firstName.length < 3) {
        setInputError(e, ".first__name");

        return;
      } else if (weatherUserObj.firstName.length > 2) {
        removeInputError(e, ".first__name");
      }

      if (weatherUserObj.location.length < 3) {
        setInputError(e, ".location");

        return;
      } else if (weatherUserObj.location.length > 2) {
        removeInputError(e, ".location");
      }

      if (
        weatherUserObj.mainLocation === true ||
        weatherUserObj.mainLocation === "true"
      ) {
        // User code created by the route
        // weatherUserObj["userCode"] = 3;

        ItemCtrl.setAlertMain(
          "The new user will change the Main Location! Are you sure?"
        );
      }

      const res = await ServerCtrl.callApiAuth(
        "post",
        ItemCtrl.getToken(),
        App.urls().URL_POST_USER,
        weatherUserObj
      );

      if (res.status >= 200 && res.status <= 399) {
        //
        // just for local storage
        //
        // get id just created and add to the object
        weatherUserObj["_id"] = JSON.parse(res.data)._id;

        // add user code threw back from axios
        weatherUserObj["userCode"] = JSON.parse(res.data).userCode;

        // get array from session Storage
        let arrUsers = JSON.parse(ItemCtrl.getArrUsers());

        // push in array
        arrUsers.push(weatherUserObj);

        // update array in session Storage

        sessionStorage.setItem("arrUsers", JSON.stringify(arrUsers));

        // destru weatherObj
        const {
          _id,
          firstName,
          location,
          language,
          unit,
          userCode,
          mainLocation,
        } = weatherUserObj;

        // DOM
        let currRow = e.target.closest(UICtrl.getSelectorsClasses().row);

        let lastElement;

        if (UICtrl.getSelectors().locationList.lastElementChild === null) {
          lastElement = UICtrl.getSelectors().locationList;
        } else {
          lastElement = UICtrl.getSelectors().locationList.lastElementChild;
        }

        setTimeout(() => {
          currRow.style.opacity = "0";
        }, 500);

        setTimeout(() => {
          currRow.remove();
        }, 1000);

        // Create new row with "no" I doesn't automatically append

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

        // if new user is main reinit list
        if (mainLocation == true || mainLocation == "true") {
          // re init list user session storage
          ItemCtrl.reInitListUser();
        }

        // isEditing false
        this.setIsEditingFalse();

        // create user location sending the just created data to the function
        this.createUserLocation(
          firstName,
          location,
          unit,
          language,
          userCode,
          mainLocation
        );

        UICtrl.iconsInit();
      }
    },
    createUserLocation: async function (
      firstName,
      location,
      unit,
      language,
      userCode,
      mainLocation
    ) {
      // CREATEOBJ
      const objLocation = {
        firstName,
        language,
        unit,
        location,
        userCode,
        mainLocation,
      };

      // POST ON MONGO
      // the route will call Open Weather

      const resLocation = await ServerCtrl.callApiAuth(
        "post",
        ItemCtrl.getToken(),
        App.urls().URL_POST_LOCATION,
        objLocation,
        ""
      );

      return resLocation;
    },
    updateUserLocation: async function (
      firstName,
      location,
      unit,
      language,
      mainLocation,
      userCode,
      _id
    ) {
      // CREATEOBJ
      const objLocation = {
        firstName,
        language,
        unit,
        location,
        userCode,
        mainLocation,
      };

      // get all location to find userCode
      const resAllLocation = await ServerCtrl.callApiAuth(
        "get",
        ItemCtrl.getToken(),
        App.urls().URL_GET_LOCATION
      );

      // find userCode for _id
      const idForMongo = await JSON.parse(resAllLocation.data).find(
        (x) => x.userCode === userCode
      );

      // POST ON MONGO
      // the route will call Open Weather

      const resLocation = await ServerCtrl.callApiAuth(
        "put",
        ItemCtrl.getToken(),
        App.urls().URL_PUT_LOCATION,
        objLocation,
        idForMongo._id
      );

      return resLocation;
    },
    deleteUserLocation: async function (userCode) {
      // get all location to find userCode
      const resAllLocation = await ServerCtrl.callApiAuth(
        "get",
        ItemCtrl.getToken(),
        App.urls().URL_GET_LOCATION
      );

      // find userCode for _id
      const idForMongo = await JSON.parse(resAllLocation.data).find(
        (x) => x.userCode === userCode
      );

      // DELETE ON MONGO

      const resLocation = await ServerCtrl.callApiAuth(
        "delete",
        ItemCtrl.getToken(),
        App.urls().URL_DELETE_LOCATION,
        "",
        idForMongo._id
      );

      return resLocation;
    },
    reInitListUser: async function () {
      UICtrl.getSelectors().locationList.innerHTML = "";

      const res = await ServerCtrl.callApiAuth(
        "get",
        ItemCtrl.getToken(),
        App.urls().URL_GET
      );

      // order array from main
      let orderArr = JSON.parse(res.data).sort(
        (a, b) => b.mainLocation - a.mainLocation
      );

      // convert to string before sending
      UICtrl.listUsers(JSON.stringify(orderArr));
    },
    undoEditWeatherUser: function (e) {
      e.preventDefault();
      this.setIsEditingFalse();
      e.target.closest(UICtrl.getSelectorsClasses().gridItemEdit).remove();
    },
    getIsEditing: function () {
      return userActions.isEditing;
    },

    setIsEditingTrue: function () {
      userActions.isEditing = true;
      UICtrl.getSelectors().btnAddUser.disabled = true;
    },
    setIsEditingFalse: function () {
      userActions.isEditing = false;
      UICtrl.getSelectors().btnAddUser.disabled = false;
    },

    setAlert: async function (
      msg,
      classStyle,
      target,
      yesCallback,
      noCallback
    ) {
      // isediting
      ItemCtrl.setIsEditingTrue();

      // light row to delete
      target.classList.add("row__deleting");

      // create msg

      const divMessage = document.createElement("div");

      let message = `<div class='row delete__row ${classStyle}'>
      <div class="msg col-6 t-center-y">${msg}</div>
      <div class='col-2'><button class="btn-alert-yes">Yes</button></div>
      <div class='col-2'><button class="btn-alert-no" >No</button></div>
      </div>
      `;

      var doc = new DOMParser().parseFromString(message, "text/html");

      // spread operator to extract all the html elements
      divMessage.appendChild(...doc.body.children);

      target.after(divMessage);
      document
        .querySelector(".btn-alert-no")
        .addEventListener("click", function () {
          yesCallback();
        });
      document
        .querySelector(".btn-alert-yes")
        .addEventListener("click", function () {
          noCallback();
        });
    },
    setAlertMain: async function (msg) {
      return confirm(msg);
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
    URL_GET_LOCATION: "http://127.0.0.1:5000/api/locations/",
    URL_POST_LOCATION: "http://127.0.0.1:5000/api/locations/",
    URL_PUT_LOCATION: "http://127.0.0.1:5000/api/locations/",
    URL_DELETE_LOCATION: "http://127.0.0.1:5000/api/locations/",
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
    mainLocation: ".main__location",

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

    // modal
    btnAbout: document.querySelector("#modalOpen"),
    btnResetUserFav: document.querySelector(".reset-user-fav"),
  };

  // public
  return {
    gridItem: function (
      firstName,
      location,
      language,
      unit,
      id,
      mainLocation,
      append = "yes"
    ) {
      // uppercase first char
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      location = location.charAt(0).toUpperCase() + location.slice(1);

      // find language complete
      let langComplete = "";

      ItemCtrl.getLangArray().map((x) => {
        if (x.code === language) langComplete = x.language;
      });

      const row = document.createElement("div");
      row.className = `row grid__item ph-1 t-center-y`;

      const firstNameCol = document.createElement("div");
      firstNameCol.className = "col-3 first__name";

      firstNameCol.innerHTML = firstName;

      const locationCol = document.createElement("div");
      locationCol.className = "col-3 location";

      locationCol.innerHTML = location;

      const languageCol = document.createElement("div");
      languageCol.className = "col-2 language";

      languageCol.innerHTML = langComplete;

      const unitCol = document.createElement("div");
      unitCol.className = "col-1 unit";
      unitCol.innerHTML = unit;

      const editIcon = document.createElement("div");
      editIcon.className = "col-1 edit__icon pl-2";
      editIcon.dataset.id = id;
      editIcon.innerHTML = `<button class="btn__edit"><i class="far fa-1x fa-edit"></i></button>`;

      const deleteIcon = document.createElement("div");
      deleteIcon.className = "col-1 delete__icon";
      deleteIcon.dataset.id = id;
      deleteIcon.innerHTML = `<button class="btn__delete"><i class="far fa-trash-alt"></i></button>`;

      const mainLocationCheck = document.createElement("div");
      mainLocationCheck.className = "col-1 main__location";

      if (mainLocation == true || mainLocation == "true") {
        UICtrl.setMainLocationStyle(row);
        setTimeout(() => {
          document.querySelector(".btn__delete").remove();
        }, 10);
      }

      row.innerHTML +=
        firstNameCol.outerHTML +
        locationCol.outerHTML +
        languageCol.outerHTML +
        unitCol.outerHTML +
        editIcon.outerHTML +
        deleteIcon.outerHTML +
        mainLocationCheck.outerHTML;

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
      unit = "",
      mainLocation
    ) {
      const row = document.createElement("div");
      row.className = `row grid__item__edit pv-1 ph-1 t-center-y`;

      const firstNameCol = document.createElement("input");
      firstNameCol.className = "col-3 edit__input first__name input-text-large";
      firstNameCol.setAttribute("type", "text");
      firstNameCol.setAttribute("id", "firstName");
      firstNameCol.setAttribute("value", firstName);

      const locationCol = document.createElement("input");
      locationCol.className = "col-3 edit__input location input-text-large";
      locationCol.setAttribute("type", "text");
      locationCol.setAttribute("id", "location");
      locationCol.setAttribute("value", location);

      const languageCol = document.createElement("select");
      languageCol.className = "col-1 edit__input language input-text-small";
      languageCol.setAttribute("type", "text");
      languageCol.setAttribute("id", "language");
      languageCol.setAttribute("value", language);

      // populate selector
      ItemCtrl.getLangArray().forEach((element, index) => {
        let option_elem = document.createElement("option");

        if (language === null || language === "") {
          // if is empty set value
          option_elem.value = element.code;
        } else if (element.code === language) {
          // when corresponds set everything to language
          option_elem.setAttribute("selected", "selected");
          option_elem.value = element.code;
        }

        // // Add index to option_elem
        option_elem.value = element.code;

        // Add element HTML
        option_elem.textContent = element.language;

        // Append option_elem to select_elem
        languageCol.appendChild(option_elem);
      });

      const unitCol = document.createElement("select");
      unitCol.className = "col-2 edit__input unit input-text-med";
      unitCol.setAttribute("type", "text");
      unitCol.setAttribute("id", "unit");
      unitCol.setAttribute("value", unit);

      // populate selector
      ItemCtrl.getUnitArray().forEach((element, index) => {
        let option_elem = document.createElement("option");

        if (unit === null || unit === "") {
          // if is empty set value
          option_elem.value = element;
        } else if (element === unit) {
          // when corresponds set everything to unit
          option_elem.setAttribute("selected", "selected");
          option_elem.value = unit;
        }
        option_elem.value = element;

        option_elem.textContent = element;

        // Append option_elem to select_elem
        unitCol.appendChild(option_elem);
      });

      const editIcon = document.createElement("div");
      editIcon.className = "col-1 save__icon pl-1";
      editIcon.dataset.id = _id;
      editIcon.innerHTML = `<button class="btn__update__weather__user"><i class="fas fa-save"></i></button>`;

      const deleteIcon = document.createElement("div");
      deleteIcon.className = "col-1 undo__icon pr-1";
      deleteIcon.dataset.id = _id;
      deleteIcon.innerHTML = `<button class="btn__undo__weather__user"><i class="fas fa-times"></i></button>`;

      const mainLocationCheck = document.createElement("input");
      mainLocationCheck.className = "col-1 main__location";
      mainLocationCheck.setAttribute("type", "checkbox");
      mainLocationCheck.setAttribute("id", "mainLocation");
      mainLocationCheck.setAttribute("value", false);

      if (mainLocation == true || mainLocation == "true") {
        mainLocationCheck.setAttribute("value", true);
        mainLocationCheck.setAttribute("checked", true);
        setTimeout(() => {
          document.querySelector("#mainLocation").style.opacity = 0;
        }, 1);
      }

      row.innerHTML +=
        firstNameCol.outerHTML +
        locationCol.outerHTML +
        languageCol.outerHTML +
        unitCol.outerHTML +
        editIcon.outerHTML +
        deleteIcon.outerHTML +
        mainLocationCheck.outerHTML;

      return row;
    },

    setMainLocationStyle: function (target) {
      target.classList.add("main__location___row");
    },

    getSelectors: function () {
      return UISelectors;
    },

    getSelectorsClasses: function () {
      return UISelectorsClasses;
    },

    submitEdit: function (e) {
      if (ItemCtrl.getIsEditing()) return;
      // get the closest row (the one to edit)
      let closestRow = e.target.closest(UICtrl.getSelectorsClasses().row);

      // get id to edit
      let id = e.target.parentElement.parentElement.getAttribute("data-id");

      // filter id to edit
      let getAllUsers = JSON.parse(sessionStorage.getItem("arrUsers"));

      const {
        _id,
        firstName,
        location,
        language,
        unit,
        mainLocation,
      } = getAllUsers.find((x) => x._id === id);

      // create new row
      let newRow = UICtrl.row(
        _id,
        firstName,
        location,
        language,
        unit,
        mainLocation
      );

      // append new row after edited row
      closestRow.after(newRow);

      UICtrl.iconsEditInit("update");
      UICtrl.checkboxMainLocationInit();

      // isEditing
      ItemCtrl.setIsEditingTrue();
    },

    submitDelete: async function (e) {
      e.preventDefault();

      if (ItemCtrl.getIsEditing()) return;

      let gridItem = e.target.parentElement.closest(
        UICtrl.getSelectorsClasses().gridItem
      );
      let userName = e.target.parentElement.parentElement.parentElement.querySelector(
        UICtrl.getSelectorsClasses().firstName
      ).textContent;
      let userLocation = e.target.parentElement.parentElement.parentElement.querySelector(
        UICtrl.getSelectorsClasses().location
      ).textContent;

      ItemCtrl.setAlert(
        `Are you sure to delete ${userName} from ${userLocation}?`,
        "classeDelete",
        gridItem,
        async function () {
          gridItem.classList.remove("row__deleting");

          // remove delete confirm msg
          e.target
            .closest(UICtrl.getSelectorsClasses().locationList)
            .querySelector(".delete__row")
            .remove();
          // set is false
          ItemCtrl.setIsEditingFalse();
        },
        async function () {
          let id = e.target.parentElement.parentElement.getAttribute("data-id");

          // find user code
          let userCodeToDelete = await JSON.parse(ItemCtrl.getArrUsers()).find(
            (x) => x._id === id
          ).userCode;

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
                arrUsers.splice(i, 1);
              }
            });

            // update array in session Storage
            sessionStorage.setItem("arrUsers", JSON.stringify(arrUsers));

            //
            // DOM
            //
            // remove deleteing msg
            gridItem.classList.remove("row__deleting");

            // remove delete confirm msg
            e.target
              .closest(UICtrl.getSelectorsClasses().locationList)
              .querySelector(".delete__row")
              .remove();

            // gridItem;
            gridItem.style.transition = "all 1s";
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
            }, 1100);

            // set is false
            ItemCtrl.setIsEditingFalse();

            // send delete mongoDb
            ItemCtrl.deleteUserLocation(userCodeToDelete);
          }
        }
      );
    },

    updateWeatherUser: async function (e) {
      e.preventDefault();

      // get values for uptate
      let id = e.target.parentElement.parentElement.getAttribute("data-id");

      let weatherUserObj = ItemCtrl.getInputUser(e);

      if (
        weatherUserObj.mainLocation === true ||
        weatherUserObj.mainLocation === "true"
      ) {
        ItemCtrl.setAlertMain(
          "Your update will change the Main Location! Are you sure?"
        );
      }

      weatherUserObj["_id"] = id;

      const res = await ServerCtrl.callApiAuth(
        "put",
        ItemCtrl.getToken(),
        App.urls().URL_PUT,
        weatherUserObj,
        weatherUserObj._id
      );

      // destructoring
      const {
        firstName,
        location,
        unit,
        language,
        mainLocation,
        _id,
      } = weatherUserObj;

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

        // find language complete
        let langComplete = "";

        ItemCtrl.getLangArray().map((x) => {
          if (x.code === language) langComplete = x.language;
        });

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
          ).innerHTML = langComplete;
          prevRow.querySelector(UICtrl.getSelectorsClasses().unit).innerHTML =
            weatherUserObj.unit;
        }, 500);

        setTimeout(() => {
          currRow.style.opacity = "0";
        }, 1000);

        setTimeout(() => {
          currRow.remove();

          if (
            weatherUserObj.mainLocation == true ||
            weatherUserObj.mainLocation == "true"
          ) {
            UICtrl.setMainLocationStyle(prevRow);
          }
        }, 1500);
      }

      if (mainLocation == true || mainLocation == "true") {
        // re init list user session storage
        ItemCtrl.reInitListUser();
      }

      // isEditing
      ItemCtrl.setIsEditingFalse();

      ItemCtrl.updateUserLocation(
        firstName,
        location,
        unit,
        language,
        mainLocation,
        (userCode = JSON.parse(res.data).userCode),
        _id
      );
    },

    listUsers: function (usersArr) {
      // order from main down
      let orderArr = JSON.parse(usersArr).sort(
        (a, b) => b.mainLocation - a.mainLocation
      );

      UICtrl.showMenu();
      App.selectors().formLogin.remove();
      sessionStorage.setItem("arrUsers", usersArr);

      orderArr.map((x) =>
        this.gridItem(
          x.firstName,
          x.location,
          x.language,
          x.unit,
          x._id,
          x.mainLocation
        )
      );

      this.iconsInit();
      this.checkboxMainLocationInit();
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
        .addEventListener("click", function (e) {
          ItemCtrl.undoEditWeatherUser(e);
        });
    },

    checkboxMainLocationInit: function () {
      document
        .querySelectorAll(UICtrl.getSelectorsClasses().mainLocation)
        .forEach((x) =>
          x.addEventListener("click", function (e) {
            if (
              this.getAttribute("value") == "null" ||
              this.getAttribute("value") == null
            ) {
              this.setAttribute("value", "true");
            }
            // else {
            //   this.setAttribute("value", "false");
            // }
            if (
              this.getAttribute("value") == "true" ||
              this.getAttribute("value") == true
            ) {
              this.setAttribute("value", "false");
              this.removeAttribute("checked");
            } else if (
              this.getAttribute("value") == "false" ||
              this.getAttribute("value") == false
            ) {
              this.setAttribute("value", "true");
            }
          })
        );
    },

    showMenu: function () {
      App.selectors().menu.classList.remove("hide");
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

const App = (function (ItemCtrl, UICtrl, ServerCtrl) {
  // Event listeners init
  const URLs = ServerCtrl.getUrls();
  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function () {
    UISelectors.btnLogin.addEventListener("click", function (e) {
      ItemCtrl.sendLogin(e);
    });

    UISelectors.btnAddUser.addEventListener("click", ItemCtrl.addUserRow);
    UISelectors.btnAbout.addEventListener("click", function (e) {
      e.preventDefault();
      UICtrl.openModal("aboutModal");
    });
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
    selectors: () => UISelectors,
    urls: () => URLs,
    init: function () {
      checkSessionOnStart();
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl, ServerCtrl);

App.init();
