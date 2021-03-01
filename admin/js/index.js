const App = (function (ItemCtrl, UICtrl, ServerCtrl) {
  // Event listeners init
  const URLs = ServerCtrl.getUrls();
  const UISelectors = UICtrl.getSelectors();

  const loadEventListeners = function () {
    UISelectors.btnLogin.addEventListener("click", function (e) {
      ItemCtrl.sendLogin(e);
    });

    UISelectors.btnAddUser.addEventListener("click", ItemCtrl.addUserRow);

    console.log(document.getElementById("footer"));
    UISelectors.btnAbout.addEventListener("click", function (e) {
      e.preventDefault();
      UICtrl.openModal("aboutModal");
    });

    UISelectors.btnResetUserFav.addEventListener("click", function (e) {
      e.preventDefault();
      ItemCtrl.resetUserFav(e);
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
