const ItemCtrl = (function () {
  userActions = {
    isEditing: false,
  };
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
      // console.log(UICtrl.getSelectors().locationList.lastElementChild === null);

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

      // User code created by the route
      // weatherUserObj["userCode"] = 3;

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
      }
    },
    createUserLocation: async function (
      firstName,
      location,
      units,
      language,
      userCode,
      mainLocation
    ) {
      // OW API CALL
      const res = await OWCtrL.openWCallApi(location, units, language);

      // PARSE IT
      const parsedRes = JSON.parse(res);

      const {
        getLocation = parsedRes.name,
        getMain = parsedRes.weather[0].main,
        getIcon = parsedRes.weather[0].icon,
        getMainDesc = parsedRes.weather[0].description,
        getTemp = parsedRes.main.temp,
        getWind = parsedRes.wind.speed,
        getTimeZone = parsedRes.timezone,
      } = parsedRes;

      // CREATEOBJ
      const objLocation = {
        firstName: firstName,
        language: language,
        description: getMainDesc,
        icon: getIcon,
        location: getLocation,
        mainWeather: getMain,
        temperature: getTemp,
        userCode: userCode,
        wind: getWind,
        mainLocation,
        timezone: getTimeZone,
      };

      // POST ON MONGO

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
      console.log(userCode);

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

      console.log(idForMongo._id);

      // CREATEOBJ
      // const objLocation = {
      //   firstName,
      //   language,
      //   unit,
      //   location,
      //   userCode,
      //   mainLocation,
      // };

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
  };
})();
