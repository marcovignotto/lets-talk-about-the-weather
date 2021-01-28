var today = new Date();

var timeToPage =
  today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

const mainTimeDiv = document.createElement("div");
mainTimeDiv.className = "main__time";
mainTimeDiv.innerHTML = timeToPage;

// const timeDiv = mainTimeDiv.appendChild(timeToPage);

console.log(mainTimeDiv);

var target = document.body.querySelector(".container__weather__blocks");

// create an observer instance
var observer = new MutationObserver(function (mutations) {
  //   console.log(mutations);
  if (mutations.length > 1) {
    console.log(document.querySelectorAll(".block__weather"));
    console.log(document.querySelectorAll(".block__weather").childNodes);
    console.log(document.querySelectorAll(".block__weather")[1]);

    document
      .querySelector(".container__weather__blocks")
      .insertBefore(
        mainTimeDiv,
        document.querySelectorAll(".block__weather")[1]
      );
    // console.log(document.body.querySelector(".col-6"));
    // console.log(document.body.querySelector(".col-6").firstChild);
    // document.body
    //   .querySelector(".col-6")
    //   .insertAfter(
    //     mainTimeDiv,
    //     document.querySelectorAll(".block__weather").firstChild
    //   );
    // document.body.querySelector(".row-double").appendChild(timeToPage);
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
