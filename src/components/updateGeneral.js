const axios = require("axios");
const config = require("config");

const URL_POST = config.get("localApi.urlPost");

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
