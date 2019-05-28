/* global $, Skycons */

const skycons = new Skycons({'color': 'lightBlue'});
const dayCards = [...document.getElementsByClassName('card-body')];
const WEEKDAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const TODAY = new Date();

$(document).ready(function() {
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', function() {
    const location = document.getElementById('weather-input').value;
    getWeatherData(location);
  });

  const dayFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // format for the current date
  const timeFormat = { hour: '2-digit', minute: 'numeric' }; // format for the current time

  document.getElementById('current-date').textContent = new Intl.DateTimeFormat('en-US', dayFormat).format(TODAY);
  document.getElementById('current-time').textContent = new Intl.DateTimeFormat('en-US', timeFormat).format(TODAY);

  searchBtn.click(); // submit default location so some info gets populated
});

function getWeatherData(latLong) {
// Write a function to use the DarkSky api to gather weather data and update the screen.
// I had to proxy the api request because of CORS restrictions so yeah
document.getElementById('location').textContent = latLong;

  fetch(`/api/${latLong}?exclude=hourly,minutely,flags`)
    .then(response => response.json())
    .then(data => updatePage(data))
    .catch(err => console.log(err));
  // Optionally, if you would rather use a library as was discussed in the README, feel free to do so.
}

// Function that updates the page with the data from the DarkSky api
function updatePage(data) {
  document.getElementById('current-temp').innerHTML = roundTemp(data.currently.temperature);
  document.getElementById('current-weather').textContent = data.currently.summary;
  document.getElementById('current-summary').textContent = data.daily.summary;

  dayCards.forEach((card, index) => {
    const dayData = data.daily.data[index];
    const weekdayNum = new Date(dayData.time * 1000).getDay();

    skycons.set(card.querySelector('canvas'), dayData.icon);
    card.querySelector('.card-title').textContent = (index == 0) ? 'Today' : WEEKDAYS[weekdayNum];
    card.querySelector('.hi').innerHTML = roundTemp(dayData.temperatureHigh);
    card.querySelector('.lo').innerHTML = roundTemp(dayData.temperatureLow);
  });

  skycons.play();
}

// Function that returns a rounded temperature with a degree sign for display
function roundTemp(temp) {
  return Math.round(temp) + '&deg';
}
