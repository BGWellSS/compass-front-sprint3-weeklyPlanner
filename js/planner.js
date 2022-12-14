// ---------- Global variables
// - Date DOM
const dateDOM = document.getElementsByClassName("timer-date");
// - Timer DOM
const timerDOM = document.getElementsByClassName("timer-hour");
// - Card DOM
const cardTextDOM = document.getElementById("input-actText");
const cardWeekDayDOM = document.getElementById("input-actWeekDay");
const cardTimeDOM = document.getElementById("input-actTime");
const calendarTimerDOM = document.getElementById("calendar-side");
// - Card List
const cardsList = [];
// - Week Times List
const weekTimesList = [];
// - Curent Week Day
let currentWeekDay = 0;
// - Card ID
let cardId = 0;
// - Button DOM -> Add card Activity
const addActivityButton = document.getElementById("activity-add");
// - Button DOM -> Delete all cards
const deleteAllActivityButton = document.getElementById("act-removeAll");
// - Button DOM -> Save Local Storage
const saveLSDOM = document.getElementById("saver-localStorage");
// - Button DOM -> Delete Local Storage
const deleteLSDOM = document.getElementById("delete-localStorage");
// - Storage Card splitter
const lsCardSplitter = "__@__";
// - Storage Atributte splitter
const lsAtributeSplitter = "_§_";
// ---- Calendar Filters DOM
// - Monday Filter
const weekFilterMon = document.getElementsByClassName("calendar-mon");
// - Filter
const weekFilterTue = document.getElementsByClassName("calendar-tue");
// - Filter
const weekFilterWed = document.getElementsByClassName("calendar-wed");
// - Filter
const weekFilterThu = document.getElementsByClassName("calendar-thu");
// - Filter
const weekFilterFri = document.getElementsByClassName("calendar-fri");
// - Filter
const weekFilterSat = document.getElementsByClassName("calendar-sat");
// - Filter
const weekFilterSun = document.getElementsByClassName("calendar-sun");

// ---------- Functions
// - Time
function updateCurrentTime() {
  timerDOM[0].textContent = getCurrentTime();
}

// ---- Activity cards
// - Create card HTML
function createHTMLCard(card) {
  return `<div id="card-id${card.id}" class="cards card-w${card.weekDay}">
              <p class="card-text">${card.text}</p>
              <button type="button" class="button delete-card" onclick="deleteCard(${card.id})">
                Apagar
              </button>
            </div>`;
}
// - Create card time HTML
function createHTMLCardTime(card) {
  return `<div class="calendar-hour timer-w${card.weekDay}">
              <p class="timer-text">${card.time}</p>
            </div>`;
}
// - Add card to List
function addCardtoList(card) {
  cardsList.push(card);
}
// - Delete card from cardsList
function deleteCard(id) {
  for (let index = 0; index < cardsList.length; index++) {
    if (cardsList[index] && cardsList[index].id == id) {
      delete cardsList[index];
    }
  }
  loadWeekCalendar();
  loadPanel();
}
// - Delete card from cardsList
function deleteAllCards() {
  cardsList.length = 0;
  cardId = 0;
  loadWeekCalendar();
  loadPanel();
}
// - Sort List
function sortCardsList() {
  cardsList.sort(function (x, y) {
    let a = x.time,
      b = y.time;
    return a == b ? 0 : a > b ? 1 : -1;
  });
}
// - Clear Panels
function clearPanels() {
  for (let index = 1; index <= 7; index++) {
    document.getElementById(`weekDay${index}`).innerHTML = "";
  }
}
// - Verify conflicts
function verifyConflict(card) {
  let cont = 0;
  const tempDOM = document.getElementById(`card-id${card.id}`);
  for (let index = 0; index < cardsList.length; index++) {
    if (cardsList[index]) {
      if (
        card.time == cardsList[index].time &&
        card.weekDay == cardsList[index].weekDay
      ) {
        cont++;
        if (cont > 1) {
          card.isConflict = true;
          tempDOM.classList.add("conflict");
          addConflictTimer(card.weekDay, card.time);
        } else {
          card.isConflict = false;
          tempDOM.classList.remove("conflict");
          removeConflictTimer(card.weekDay, card.time);
        }
      }
    }
  }
}
// - Process check conflict
function checkConflict() {
  for (let index = 0; index < cardsList.length; index++) {
    if (cardsList[index]) {
      let card = cardsList[index];
      verifyConflict(card);
    }
  }
}
function addConflictTimer(weekDay, time) {
  const cardTimer = document.getElementsByClassName(`timer-w${weekDay}`);
  for (let index = 0; index < cardTimer.length; index++) {
    const cardTimerValue =
      cardTimer[index].getElementsByClassName(`timer-text`);
    if (cardTimerValue[0].innerHTML == time) {
      cardTimer[index].classList.add("conflict");
    }
  }
}
function removeConflictTimer(weekDay, time) {
  const cardTimer = document.getElementsByClassName(`timer-w${weekDay}`);
  for (let index = 0; index < cardTimer.length; index++) {
    const cardTimerValue =
      cardTimer[index].getElementsByClassName(`timer-text`);
    if (cardTimerValue[0].innerHTML == time) {
      cardTimer[index].classList.remove("conflict");
    }
  }
}
// - Update Panel cards
function loadPanel() {
  sortCardsList();
  let timeCheck = ["", "", "", "", "", "", ""];
  clearPanels();
  clearTimePanel();
  initializeWeekList();
  for (let index = 0; index < cardsList.length; index++) {
    if (cardsList[index]) {
      const weekPanelDOM = document.getElementById(
        `weekDay${cardsList[index].weekDay}`
      );
      weekPanelDOM.innerHTML += cardsList[index].cardHtml;
      if (timeCheck[cardsList[index].weekDay - 1] != cardsList[index].time) {
        weekTimesList[cardsList[index].weekDay - 1] +=
          cardsList[index].timeHtml;
        timeCheck[cardsList[index].weekDay - 1] = cardsList[index].time;
      }
    }
  }
  loadWeekCalendar();
  checkConflict();
  cardTextDOM.value = "";
  cardTextDOM.focus();
}
// - Process add button action
function processAddButton() {
  const cardActivity = createActivity(
    cardId,
    cardTextDOM.value,
    parseInt(cardWeekDayDOM.value),
    cardTimeDOM.value
  );
  cardId++;
  if (checkCardEmpty(cardActivity)) {
    cardTextDOM.classList.remove("activity-empty");
    cardTextDOM.focus();
    cardActivity.cardHtml = createHTMLCard(cardActivity);
    cardActivity.timeHtml = createHTMLCardTime(cardActivity);
    addCardtoList(cardActivity);
    loadPanel();
  } else {
    cardTextDOM.classList.add("activity-empty");
    cardTextDOM.focus();
  }
}
// - Save Local Storage
function saveToLocalStorage() {
  if (typeof Storage !== "undefined") {
    let storageValue = "";
    for (let index = 0; index < cardsList.length; index++) {
      if (cardsList[index]) {
        if (index !== 0) {
          storageValue += lsCardSplitter;
        }
        storageValue += `${cardsList[index].text}${lsAtributeSplitter}${cardsList[index].weekDay}${lsAtributeSplitter}${cardsList[index].time}`;
      }
    }
    localStorage.setItem("storageCards", storageValue);
  } else {
    console.log("Sorry, no LocalStorage suport");
  }
}
// - Delete Local Storage
function deleteLocalStorage() {
  localStorage.clear();
}
// - Checker Local Storage Content
function lsChecker(storageVarName) {
  const listStringToCheck = localStorage.getItem(storageVarName);
  if (listStringToCheck !== "" && listStringToCheck !== null) {
    const listToCheck = listStringToCheck.split(lsCardSplitter);
    for (let index = 0; index < listToCheck.length; index++) {
      const cardAtributes = listToCheck[index].split(lsAtributeSplitter);
      const cardLS = createActivity(
        cardId,
        cardAtributes[0],
        parseInt(cardAtributes[1]),
        cardAtributes[2]
      );
      cardId++;
      cardLS.cardHtml = createHTMLCard(cardLS);
      cardLS.timeHtml = createHTMLCardTime(cardLS);
      addCardtoList(cardLS);
    }
    loadPanel();
  }
}
// - Initialize Week Timers List
function initializeWeekList() {
  for (let index = 0; index < 7; index++) {
    weekTimesList[index] = "";
  }
}
// - Clear Time Panel
function clearTimePanel() {
  calendarTimerDOM.innerHTML =
    '<div class="calendar-hour calendar-title"><span>Horário</span></div>';
}
// - Load week calendar
function loadWeekCalendar() {
  clearTimePanel();
  calendarTimerDOM.innerHTML += weekTimesList[currentWeekDay];
}
function updateCurrentWeekDay(weekValue) {
  currentWeekDay = weekValue;
  loadWeekCalendar();
  checkConflict();
}
function monFilter() {
  updateCurrentWeekDay(0);
}
function tueFilter() {
  updateCurrentWeekDay(1);
}
function wedFilter() {
  updateCurrentWeekDay(2);
}
function thuFilter() {
  updateCurrentWeekDay(3);
}
function friFilter() {
  updateCurrentWeekDay(4);
}
function satFilter() {
  updateCurrentWeekDay(5);
}
function sunFilter() {
  updateCurrentWeekDay(6);
}

// ---------- Page Actions
// - Page timer
setInterval(updateCurrentTime, 1000);
dateDOM[0].textContent = getCurrentDay();
// - Local Storage Checker
lsChecker("storageCards");
// - Week Lists
initializeWeekList();
// - Button Save Local Storage
saveLSDOM.onclick = saveToLocalStorage;
// - Button Exclude Local Storage
deleteLSDOM.onclick = deleteLocalStorage;
// - Button add activity
addActivityButton.onclick = processAddButton;
// - Button delete all activities
deleteAllActivityButton.onclick = deleteAllCards;
// ---- Calendar Buttons
weekFilterMon[0].onclick = monFilter;
weekFilterTue[0].onclick = tueFilter;
weekFilterWed[0].onclick = wedFilter;
weekFilterThu[0].onclick = thuFilter;
weekFilterFri[0].onclick = friFilter;
weekFilterSat[0].onclick = satFilter;
weekFilterSun[0].onclick = sunFilter;
