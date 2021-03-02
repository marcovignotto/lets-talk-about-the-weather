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

        ItemCtrl.setAlertMain({
          msgMain: "Your update will change the Main Location!",
          msgYes: "Yes! Go on!",
          msgNo: "No! Keep it!",
          msgDelete: "Updated successfully!",
          msgUndo: "Not updated!",
        });
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
    setAlertMain: function (params) {
      var msgMain = params.hasOwnProperty("msgMain")
        ? params.msgMain
        : "Are you sure to modify this field?";
      var msgYes = params.hasOwnProperty("msgYes") ? params.msgYes : "Yes!";
      var msgNo = params.hasOwnProperty("msgNo") ? params.msgNo : "No!";

      return new Promise((resolve, reject) => {
        Swal.fire({
          title: "Sure?",
          text: msgMain,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: msgYes,
          cancelButtonText: msgNo,
        }).then((result) => {
          if (result.value) {
            resolve(result.value);
            Swal.fire(params.msgDelete, "Updated!", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            // reject(result.dismiss);
            Swal.fire("Cancelled", params.msgUndo, "error");
          }
        });
      });
    },
  };
})();
