const axios = require("axios");

const URL_POST = "http://127.0.0.1:5000/api/general/6017c8b6ee1e290f38a21a9f";

// const currentDate = new Date();
// const timestamp = currentDate.getTime();
// let now = new Date();
// currentDate.setHours(now.getHours() + 1),

// console.log(new Date(currentDate.setHours(now.getHours() + 1)));

const updateGeneral = async () => {
  try {
    const options = {
      method: "put",
      headers: { "Content-Type": "application/json" },
      url: URL_POST,
      //   data: objLocation,
      transformResponse: [
        (data) => {
          // transform the response
          return data;
        },
      ],
    };

    const res = await axios(options);
    return res;
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateGeneral;
