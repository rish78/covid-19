const container = window.document.querySelector(".container");

let array = [];
const arr = [];
const yesterdayCasesArr = [];
const todayCasesArr = [];

//generating date
const formatDate = (x) => {
  let d = new Date();
  d.toString();
  var month = "" + (d.getMonth() + 1);
  var day = "" + (d.getDate() - 1 - x);
  var year = "" + d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

//sorting states
const sortedArr = (array) => {
  array.sort(function (a, b) {
    var first = a.Province.toUpperCase();
    var second = b.Province.toUpperCase();

    if (first < second) return -1;
    if (first > second) return 1;
    else return 1;
  });
};

//checking for time(assuming the data on the url updates at noon everyday)
let a;
var date = new Date();
var h = date.getHours();

if(h>=0 && h<=12)
  a=1;
else
  a=0;

//URLs of current day and prev day(needed to calculate daily cases)
const serverUrl_dayBefore =
  "https://api.covid19api.com/live/country/india/status/confirmed/date/" +
  formatDate(a+1);

const serverUrl_currentDay =
  "https://api.covid19api.com/live/country/india/status/confirmed/date/" +
  formatDate(a);

//fetching data of day before
function serverUrlGetter(url) {
  return fetch(url).then((data) => {
    return data.text();
  });
}
serverUrlGetter(serverUrl_dayBefore).then((result) => {
  tempArr = JSON.parse(result);
  sortedArr(tempArr);

  const filteredArr = tempArr.filter((ele, index) => index % 2 === 0);
  filteredArr.forEach((ele) => {
    arr.push(ele);
    yesterdayCasesArr.push(ele.Confirmed);
  });
});

fetch(serverUrl_currentDay)
  .then((data) => {
    return data.text();
  })
  .then((result) => {
    array = JSON.parse(result);
    sortedArr(array);

    array.forEach((ele, index) => {
      let yesterdayCases = arr[index].Confirmed;
      let todayCases = ele.Confirmed;
      todayCasesArr.push(todayCases);
      // console.log(arr[index].Confirmed);

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `<div class="state">State</div>
            <div class="state-content">${ele.Province}</div>
            <div class="cases">Total Cases</div>
            <div class="cases-content">${ele.Confirmed}</div>
            <div class="active">Active Cases</div>
            <div class="active-content">${ele.Active}</div>
            <div class="new">Daily Cases</div>
            <div class="new-content">${todayCases - yesterdayCases}</div>`;

      container.appendChild(card);
    });
  });

//search

const input = document.getElementById("search");
input.addEventListener("input", (e) => {
  const state = e.target.value.toLowerCase();
  const filtered = array.filter((value) => {
    return value.Province.toLowerCase().includes(state);
  });
  const str = filtered
    .map((filtered) => {
      let i;
      array.forEach((element, index) => {
        if (element.Province === filtered.Province) i = index;
      });
      return `<div class="card"><div class="state">State</div><div class="state-content">${filtered.Province}</div><div class="cases">Total Cases</div><div class="cases-content">${filtered.Confirmed}</div><div class="active">Active Cases</div><div class="active-content">${filtered.Active}</div><div class="new">Daily Cases</div><div class="new-content">${todayCasesArr[i] - yesterdayCasesArr[i]}</div></div>`;
    })
    .join("");
  var res = str.split("\n");
  container.innerHTML = "";
  res.forEach((ele) => {
    container.innerHTML += ele;
  });
});

//dark mode

const dark_but = document.querySelector(".dark");

dark_but.addEventListener("click", (e) => {
  document.body.classList.toggle("dark-mode");
  if (dark_but.innerHTML === "Dark") dark_but.innerHTML = "Light";
  else dark_but.innerHTML = "Dark";
});
