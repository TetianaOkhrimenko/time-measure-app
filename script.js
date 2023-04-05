"use strict";

const STORAGE_KEY = "results";

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
let storageBox = document.querySelector(".storage-box");

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

//console.log(isWeekend("2023-04-01"));

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

//console.log(getBusinessDatesCount("2023-03-01", "2023-03-31"));

//Функція повертає кількість вихідних днів між двома датами
function getWeekendsDatesCount(startDate, endDate) {
  let count = 0;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  const curDate = new Date(startDate.getTime());
  while (curDate <= new Date(endDate)) {
    if (isWeekend(curDate)) count++;
    curDate.setDate(curDate.getDate() + 1);
  }

  return count;
}

//console.log(getWeekendsDatesCount("2023-03-01", "2023-03-31"));

//Функція рахує різницю між двома датами в мілісекундах.
let countDifferenseMiliseconds = function (start, end) {
  let startD = new Date(start);
  let endD = new Date(end);
  startD = startD.setHours(0, 0, 0, 0);
  endD = endD.setHours(24, 0, 0, 0);
  return endD - startD;
};
//console.log(countDifferenseMiliseconds("01 March 2023", "31 March 2023"));

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

//console.log(durationBetweenDates("01 March 2023", "31 March 2023", "hours"));

//Function transforms date to format YYYY-DD-MM
const formatDate = (date) => date.toISOString().substring(0, 10);
// formatDate(new Date()); // YYYY-DD-MM

//Function adds week or month to current day and return new date
function addDaystoDate(day) {
  let start = new Date(startDateInput.value);
  let end = new Date(endDateInput.value);
  let newDate = new Date(start.setDate(start.getDate() + day));
  endDateInput.value = formatDate(newDate);
  console.log(formatDate(newDate));

  //let dateAfterWeek = new Date(start.setDate(start.getDate() + day));
  //let year = dateAfterWeek.getFullYear();
  //let month = dateAfterWeek.getMonth() + 1;
  //let date = dateAfterWeek.getDate();
  //if (month < 10) {
  //  month = `0${month}`;
  //}
  //if (date < 10) {
  //  date = `0${date}`;
  //}
  //console.log(dateAfterWeek); // Sat Apr 08 2023 01:00:00 GMT+0100 (за літнім часом у Великій Британії)
  //console.log(startDateInput.value); //2023-04-01
  //endDateInput.value = `${year}-${month}-${date}`;
}

//

function getResults() {
  const results = getResultsFromLocalStorage();

  results.forEach((result, i) => {
    if (i < 10) {
      let storageItem = document.createElement("div");
      storageItem.classList.add("storage-item");
      storageItem.textContent = result;
      storageBox.prepend(storageItem);
    }
  });
}

//Function adds result to storageBox

function addResult(start, end, message) {
  let storageItem = document.createElement("div");
  storageItem.classList.add("storage-item");
  storageItem.textContent = `Dates: ${start}    ${end}     Result: ${message}`;
  let allStorageItems = document.querySelectorAll(".storage-item");
  storageBox.prepend(storageItem);
  if (allStorageItems.length >= 10) {
    storageBox.lastChild.remove();
  }

  storeResultInLocalStorage(storageItem.textContent);
}

//Storage's functions

function getResultsFromLocalStorage() {
  const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return results;
}

function storeResultInLocalStorage(result) {
  let results = getResultsFromLocalStorage();
  results.push(result);
  if (results.length > 10) {
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
    resultBox.textContent = "Enter a valid date or choose set of days";
    resultBox.style.color = "#f83b76";
  } else {
    resultBox.textContent = message;
    resultBox.style.color = "#06255d";
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
  console.log(newMonth);
  switch (selectTime.value) {
    case "week":
      addDaystoDate(7);
      break;
    case "month":
      if (newMonth === 2) {
        addDaystoDate(28);
        break;
      }
      if (
        newMonth === 4 ||
        newMonth === 6 ||
        newMonth === 9 ||
        newMonth === 11
      ) {
        addDaystoDate(30);
        break;
      }
      addDaystoDate(31);
      break;
  }

  /* if (selectTime.value === "week") {
    //console.log(start);
    //console.log(end);
    addDaystoDate(7);
  }

  if (selectTime.value === "month") {
    addDaystoDate(30);
  }*/
});
