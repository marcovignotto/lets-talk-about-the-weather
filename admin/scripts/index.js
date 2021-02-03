const btnLogin = document.querySelector(".btn-login");

const emailInput = document.querySelector(".email");

const emailPassword = document.querySelector(".password");

const sendData = async (e) => {
  e.preventDefault();

  const URL_POST = "http://localhost:5000/api/auth";
  const URL_GET = "http://127.0.0.1:5000/api/locations";

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

    sessionStorage.setItem("UserToken", JSON.stringify(token));

    const optionsPostLocation = {
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

    await axios(optionsPostLocation);

    // return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};

btnLogin.addEventListener("click", sendData);

window.addEventListener("load", function (ev) {
  // let url = "https://jsonplaceholder.typicode.com/posts";

  let token = JSON.parse(sessionStorage.getItem("MyUniqueUserToken"));

  let h = new Headers();
  //   h.append("Authorization", `Bearer ${token}`);

  // let req = new Request(url, {
  //   method: "GET",
  //   mode: "cors",
  //   headers: h,
  // });
  // fetch(req)
  //   .then((resp) => resp.json())
  //   .then((data) => {
  //     console.log(data[0]);
  //   })
  //   .catch((err) => {
  //     console.error(err.message);
  //   });
});
