const btnLogin = document.querySelector(".btn-login");

const emailInput = document.querySelector(".email");

const emailPassword = document.querySelector(".password");

const sendData = async (e) => {
  e.preventDefault();

  const URL_POST = "http://localhost:5000/api/auth";

  try {
    const options = {
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

    const res = await axios(options);

    //gives token to put into session storage and

    //   to use with bearer auth

    console.log(res.data);

    return JSON.parse(res.data);
  } catch (e) {
    console.error(e);
  }
};

btnLogin.addEventListener("click", sendData);

window.addEventListener("load", function (ev) {
  sessionStorage.setItem(
    "MyUniqueUserToken",
    JSON.stringify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAxYTc5YWY2OTY1YzAxZTM2ZDBlNmEyIn0sImlhdCI6MTYxMjM0NzkyNH0.sPxO1VNU3zJEQZFkCCluwomx9OXJMKgcG0ajTGBaH58"
    )
  );

  // let url = "https://jsonplaceholder.typicode.com/posts";

  let token = JSON.parse(sessionStorage.getItem("MyUniqueUserToken"));

  let h = new Headers();
  h.append("Authorization", `Bearer ${token}`);

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
