"use strict";

const STORAGE_KEY = "results";
const MAX_STORAGE_ITEMS = 10;

let primaryContentBlock = document.querySelector(".primary_content");
let secondaryContentBlock = document.querySelector(".secondary_content");
let buttonStart = document.querySelector(".hero__btn");
let startDateInput = document.getElementById("start-date");
let endDateInput = document.getElementById("end-date");
let selectTime = document.getElementById("set-time");
let resultBox = document.querySelector(".result_box");
let selectDays = document.getElementById("set-of-days");
let radioButton = document.querySelectorAll(".radio_btn");
let countOption = document.querySelector(".count_option");
let lastResultsImage = document.querySelector(".last-results_icon");
let plusIcon = document.querySelector(".plus-icon");
let storageBox = document.querySelector(".storage-box ");
let storageData = document.querySelector(".storage-data ");
let condition = "hidden";

if (condition === "hidden") {
  displayHide();
} else {
  displayShow();
}

secondaryContentBlock.hidden = true;
endDateInput.classList.add("light");
//endDateInput.style.opacity = "0.7";

//Function that make radio buttons un-cheked

function uncheckRadioButton() {
  Array.from(radioButton).forEach((radio) => (radio.checked = false));
  resultBox.textContent = " ";
}

//Функція повертає true якщо день вихідний
const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 6 || day === 0;
};

//Функція повертає кількість робочих днів між двома датами
function getBusinessDatesCount(startDate, endDate) {
  let count = 0;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let curDate = new Date(startDate.getTime());
  while (curDate <= new Date(endDate)) {
    if (!isWeekend(curDate)) count++;
    curDate.setDate(curDate.getDate() + 1);
  }

  return count;
}

//Функція повертає кількість вихідних днів між двома датами
function getWeekendsDatesCount(startDate, endDate) {
  let count = 0;
  let start = new Date(startDate);
  let end = new Date(endDate);

  const curDate = new Date(start.getTime());
  while (curDate <= new Date(end)) {
    if (isWeekend(curDate)) count++;
    curDate.setDate(curDate.getDate() + 1);
  }

  return count;
}

//Функція рахує різницю між двома датами в мілісекундах.
let countDifferenseMiliseconds = function (start, end) {
  let startD = new Date(start);
  let endD = new Date(end);
  startD = startD.setHours(0, 0, 0, 0);
  endD = endD.setHours(24, 0, 0, 0);
  return endD - startD;
};

//Function count reasul in days or hours or seconds etc depending of what days - business, weekends.
function durationBetweenDates(start, end, type, typeOfDays) {
  let result; // seconds

  switch (typeOfDays) {
    case "business":
      result = getBusinessDatesCount(start, end) * 86400; // days
      break;
    case "weekends":
      result = getWeekendsDatesCount(start, end) * 86400; // days
      break;
    default: // seconds
      result = countDifferenseMiliseconds(start, end) / 1000;
      break;
  }

  // let result = countDifferenseMiliseconds(start, end) / 1000; // seconds

  // seconds
  switch (type) {
    case "days":
      result = result / (24 * 60 * 60);
      break;
    case "hours":
      result = result / (60 * 60);
      break;
    case "minutes":
      result = result / 60;
      break;
    default:
      break;
  }

  return Math.round(result);
}

//Function transforms date to format YYYY-DD-MM
const formatDate = (date) => date.toISOString().substring(0, 10);
// formatDate(new Date()); // YYYY-DD-MM

//Function adds a week to current date

function addWeek() {
  let start = new Date(startDateInput.value);
  //let end = new Date(endDateInput.value);
  let newDate = new Date(start.setDate(start.getDate() + 7));
  endDateInput.value = formatDate(newDate);
}

//Function adds a month to current date
function addMonth() {
  let start = new Date(startDateInput.value);
  // let end = new Date(endDateInput.value);
  let newDate = new Date(start.setMonth(start.getMonth() + 1));
  endDateInput.value = formatDate(newDate);
}

//Function adds week or month to current day and return new date
function addDaystoDate(day) {
  let start = new Date(startDateInput.value);
  let end = new Date(endDateInput.value);
  let newDate = new Date(start.setDate(start.getDate() + day));
  endDateInput.value = formatDate(newDate);
  console.log(formatDate(newDate));
}

//

function getResults() {
  const results = getResultsFromLocalStorage();

  results.forEach((result, i) => {
    let storageItem = document.createElement("div");
    storageItem.classList.add("storage-item");
    //storageItem.textContent = result;
    //storageItem.textContent = `Dates: ${result.start}    ${result.end}     Result: ${result.result}`;
    storageItem.innerHTML = `<div class='item'>${result.startdate}</div><div class='item'>${result.enddate} </div><div class='item'>${result.result}</div>`;
    storageBox.prepend(storageItem);
  });
}

//Function adds result to storageBox

function addResult(start, end, message) {
  let storageItem = document.createElement("div");
  storageItem.classList.add("storage-item");
  //storageItem.textContent = `Dates: ${start}    ${end}     Result: ${message}`;
  storageItem.innerHTML = `<div class='item'>${start}</div><div class='item'>${end} </div><div class='item'>${message}</div>`;
  let allStorageItems = document.querySelectorAll(".storage-item");
  storageBox.prepend(storageItem);

  if (allStorageItems.length >= MAX_STORAGE_ITEMS) {
    storageBox.lastChild.remove();
  }

  //storeResultInLocalStorage(storageItem.textContent);
  storeResultInLocalStorage(start, end, message);
}

//Fuction show or hide history of results on the page

function displayHide() {
  storageBox.style.display = "none";
  storageData.style.display = "none";
}

function displayShow() {
  storageBox.style.display = "block";
  storageData.style.display = "flex";
}

//Storage's functions

function getResultsFromLocalStorage() {
  const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return results;
}

function storeResultInLocalStorage(start, end, message) {
  let results = getResultsFromLocalStorage();
  results.push({ startdate: start, enddate: end, result: message });

  if (results.length > MAX_STORAGE_ITEMS) {
    results.shift();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

getResults();

//EVENTS

buttonStart.addEventListener("click", function (event) {
  event.preventDefault();
  primaryContentBlock.hidden = true;
  secondaryContentBlock.hidden = false;
});

startDateInput.addEventListener("change", (event) => {
  event.preventDefault();
  //let startDateValue = new Date(event.target.value);
  uncheckRadioButton();
  selectTime.value = "option-0";
  endDateInput.disabled = false;
  endDateInput.classList.remove("light");
  let minDate = formatDate(new Date(startDateInput.value));
  endDateInput.setAttribute("min", minDate);

  if (event.target.value > endDateInput.value) {
    endDateInput.setAttribute("min", minDate);
    endDateInput.value = "";
  }
  //endDateInput.style.opacity = "1";
});

endDateInput.addEventListener("change", (event) => {
  uncheckRadioButton();
  selectTime.value = "option-0";
});

//Додаємо обробник події на подію change на radion buttons - батьківський div. Обробник події -
//виводить результат у resultBox в залежності яка radio button is checked
countOption.addEventListener("change", function (event) {
  event.preventDefault();
  let target = event.target;
  let message;
  let typeOfDays;
  let firstDate = startDateInput.value;
  let secondtDate = endDateInput.value;
  let start = new Date(firstDate);
  let end = new Date(secondtDate);

  if (selectDays.value === "business") {
    typeOfDays = "business";
  }

  if (selectDays.value === "weekends") {
    typeOfDays = "weekends";
  }

  message = `${durationBetweenDates(start, end, target.id, typeOfDays)} ${
    target.id
  }`;

  if (
    selectDays.value === "option-0" ||
    !startDateInput.value ||
    !endDateInput.value
  ) {
    resultBox.textContent = "Enter valid dates and choose set of days";
    resultBox.classList.add("red");
  } else {
    resultBox.textContent = message;
    resultBox.classList.remove("red");
    addResult(firstDate, secondtDate, message);
  }
});

//Обробник події на подію change на селекті set of days. Обробник події -
//коли вибираємо селект set of days, то radio-buttons 'days', 'hours' .... стають un-checked
//і поле resultBox  стає пустиим.

selectDays.addEventListener("change", uncheckRadioButton);

// Added event on select Set of Time

selectTime.addEventListener("change", function (event) {
  event.preventDefault();
  uncheckRadioButton();
  let start = new Date(startDateInput.value);
  let newMonth = start.getMonth() + 1;

  switch (selectTime.value) {
    case "week":
      addWeek();

      break;
    case "month":
      addMonth();
      break;
  }
});

// Event click on plus icon and show the table of last 10 results

plusIcon.addEventListener("click", (event) => {
  event.preventDefault();

  if (condition === "hidden") {
    condition = "showen";
    console.log(condition);
    displayShow();
  } else {
    condition = "hidden";
    displayHide();
  }
});
