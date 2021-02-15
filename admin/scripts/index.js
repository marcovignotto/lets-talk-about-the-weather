// var token = "";
// let arrAllUsers = [];

const App = (function (ItemCtrl, UICtrl, ServerCtrl, OWCtrL) {
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
