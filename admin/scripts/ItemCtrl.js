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

        // create user location sending the just created data to the function
        this.createUserLocation(firstName, location, unit, language);
      }
    },
    createUserLocation: async function (firstName, location, units, language) {
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
        wind: getWind,
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
  };
})();