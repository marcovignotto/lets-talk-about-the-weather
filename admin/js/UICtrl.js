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
    locationListHeader: ".locations__list__header",
    listHeaderContainer: ".list__header__container",

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

    // footer
    footer: "footer",
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
    locationListHeader: document.querySelector(
      UISelectorsClasses.locationListHeader
    ),
    listHeaderContainer: document.querySelector(
      UISelectorsClasses.listHeaderContainer
    ),

    // icons
    menu: document.querySelector(UISelectorsClasses.menu),

    // modal
    btnAbout: document.querySelector("#modalOpen"),
    btnResetUserFav: document.querySelector(".reset-user-fav"),

    // footer
    footer: document.querySelector(UISelectorsClasses.footer),
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

      const { _id, firstName, location, language, unit, mainLocation } =
        getAllUsers.find((x) => x._id === id);

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
      let userName =
        e.target.parentElement.parentElement.parentElement.querySelector(
          UICtrl.getSelectorsClasses().firstName
        ).textContent;
      let userLocation =
        e.target.parentElement.parentElement.parentElement.querySelector(
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

      const allParams = { id, obj: weatherUserObj };

      if (
        weatherUserObj.mainLocation === true ||
        weatherUserObj.mainLocation === "true"
      ) {
        return ItemCtrl.setAlertMain({
          msgMain: "Your update will change the Main Location!",
          msgYes: "Yes! Go on!",
          msgNo: "No! Keep it!",
          msgDelete: "Updated successfully!",
          msgUndo: "Not updated!",
        }).then((res) => {
          // waits for promise is yes execs
          if (res) return updateAll(allParams);
        });
      }

      // all the updates
      async function updateAll(params) {
        let weatherUserObj = params.obj;

        weatherUserObj["_id"] = params.id;

        const res = await ServerCtrl.callApiAuth(
          "put",
          ItemCtrl.getToken(),
          App.urls().URL_PUT,
          weatherUserObj,
          weatherUserObj._id
        );

        // destructoring
        const { firstName, location, unit, language, mainLocation, _id } =
          weatherUserObj;

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
            weatherUserObj.firstName =
              firstName.charAt(0).toUpperCase() + firstName.slice(1);
            weatherUserObj.location =
              location.charAt(0).toUpperCase() + location.slice(1);

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
      }
      // if mainLocation is not true it execs
      updateAll(allParams);
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
      // show menu and list header
      App.selectors().menu.classList.remove("hide");
      App.selectors().listHeaderContainer.classList.remove("hide");
      // App.selectors().footer.classList.remove("hide");
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
