// DOM
const btnLogin = document.querySelector(".btn-login");
const emailInput = document.querySelector(".email");
const emailPassword = document.querySelector(".password");

// URLs
const URL_POST = "http://localhost:5000/api/auth";
const URL_GET = "http://127.0.0.1:5000/api/locations";

// LIST LOCATIONS - NOT init
const listLocations = async (token) => {
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

    // return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};

// END SEND LOGIN

// BTNs
btnLogin.addEventListener("click", sendLogin);
