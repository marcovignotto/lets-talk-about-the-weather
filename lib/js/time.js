var today = new Date();

var timeToPage =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
console.log(timeToPage);

console.log(
  document.body.querySelector(".container__weather__blocks").childNodes.length
);
console.log(document.body.querySelector(".container").childNodes.length);

var target = document.body.querySelector(".container__weather__blocks");

// create an observer instance
var observer = new MutationObserver(function (mutations) {
  if (
    document.body.querySelector(".container__weather__blocks").childNodes
      .length > 7
  ) {
    console.log("start");
    var z = document.createElement("p");
    // console.log(
    //   document.body.querySelector(".container__weather__blocks").classList
    // );
    console.log(document.body.querySelector(".row-double"));
    document.body.querySelector(".row-double").appendChild(timeToPage);
    // console.log(
    //   document.body.querySelector(".container__weather__blocks").childNodes
    //     .length
    // );
  }
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(target, config);
