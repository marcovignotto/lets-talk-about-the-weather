//"berlin", "en", "metric"
// let arrLocations = [{ location: "berlin", language: "de", units: "metric" }];

// const mainLocation = () => makeWeatherBlock("berlin", "de", "metric");

// console.log(mainLocation());
let col3 = "";

USERS.map((x, i) =>
  makeWeatherBlock(x.location, x.language, x.unit, "col-3", "grid-row-1-1")
);

// grid-template-rows: 1fr 1fr; // prima riga
// grid - row: 1 / span 1;
// grid - row: 1 / span 1;
// grid - row: 1 / span 2; // big
// grid - row: 2 / span 2;
//     grid-row: 2 / span 2;

//
//

// makeWeatherBlock("berlin", "de", "metric");
// makeWeatherBlock("london", "en", "metric");
// makeWeatherBlock("paris", "fr", "metric");
// makeWeatherBlock("new York", "en", "imperial");
// makeWeatherBlock("bagdad", "ar", "metric");
// makeWeatherBlock("boston", "en", "imperial");
// makeWeatherBlock("saigon", "vi", "metric");
// makeWeatherBlock("prague", "cz", "metric");
// makeWeatherBlock("barcelona", "ca", "metric");
// makeWeatherBlock("tel aviv", "en", "metric");
// makeWeatherBlock("athens", "el", "metric");
// makeWeatherBlock("venice", "it", "metric");
// makeWeatherBlock("moscow", "ru", "metric");
// makeWeatherBlock("kiev", "ua", "metric");
// makeWeatherBlock("nairobi", "en", "metric");
// makeWeatherBlock("Addis Abeba", "en", "metric");
// makeWeatherBlock("Mogadishu", "ar", "metric");
