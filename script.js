"use strict";
let primaryContentBlock = document.querySelector(".primary_content");
let secondaryContentBlock = document.querySelector(".secondary_content");
let buttonStart = document.querySelector(".hero__btn");
let startDateInput = document.getElementById("start-date");
let endDateInput = document.getElementById("end-date");
let selectTime = document.getElementById("set-time");
let resultBox = document.querySelector(".result_box");
let selectDays = document.getElementById("set-of-days");
let radioButton = document.querySelectorAll(".radio_btn");

secondaryContentBlock.hidden = true;

buttonStart.addEventListener("click", function (event) {
  event.preventDefault();
  primaryContentBlock.hidden = true;
  secondaryContentBlock.hidden = false;
});

startDateInput.addEventListener("change", (event) => {
  let startDateValue = new Date(event.target.value);
  console.log(startDateValue);
  endDateInput.disabled = false;
});

/*document.querySelector(".form").addEventListener("change", function (event) {
  let x = 0;
  let y = 0;
  console.log(event.target);
  switch (event.target.id) {
    case "start-date":
      x = event.target.value;
      break;
    case "end-date":
      y = event.target.value;
      break;
  }
  console.log(x);
  console.log(y);
});*/

/*selectTime.addEventListener("change", function (event) {
  if (event.target.value === "week") {
    //startDateInput.value = `${new Date().getFullYear()}-0${new Date().getMonth()}-${new Date().getDate()}`;
    //endDateInput.value = startDateInput.value + 7;
  }
});*/

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
console.log(countDifferenseMiliseconds("01 March 2023", "31 March 2023"));

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

console.log(durationBetweenDates("01 March 2023", "31 March 2023", "hours"));

//Додаємо обробник події на подію change на radion buttons - батьківський div. Обробник події -
//виводить результат у resultBox в залежності яка radio button is checked
document
  .querySelector(".count_option")
  .addEventListener("change", function (event) {
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

    switch (target.id) {
      case "days":
        message = durationBetweenDates(start, end, "days", typeOfDays);
        console.log(selectDays.value);

        break;

      case "hours":
        message = durationBetweenDates(start, end, "hours", typeOfDays);
        break;

      case "minutes":
        message = durationBetweenDates(start, end, "minutes", typeOfDays);
        break;

      case "seconds":
        message = durationBetweenDates(start, end, "seconds", typeOfDays);
        break;
    }

    if (selectDays.value === "option-0") {
      resultBox.textContent = "Enter a valid date or choose set of days";
    } else {
      resultBox.textContent = message;
    }
    //resultBox.textContent = message;
  });

//Обробник події на подію change на селекті set of days. Обробник події -
//коли вибираємо селект set of days, то radio-buttons 'days', 'hours' .... стають un-checked
//і поле resultBox  стає пустиим.

selectDays.addEventListener("change", function (event) {
  event.preventDefault();
  Array.from(radioButton).forEach((radio) => (radio.checked = false));
  resultBox.textContent = " ";
});
