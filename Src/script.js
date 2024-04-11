// Get all necessary elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const windOutput = document.querySelector('.wind');
const humidityOutput = document.querySelector('.humidity');
const form = document.getElementById('locationInput'); // Corrected selection by ID
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

// Default city when the Loads
let cityInput = "Bangladesh";

// Add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Change from default city to the clicked one
        cityInput = e.target.innerHTML;
        /*Function that fetches and displays all the data from the Weather API (We will write it soon) */
        fetchWeatherData();
        // Fade out the app (simple animation)
        app.style.opacity = "0"; // Corrected setting style.opacity
    });
})

// Add submit event to the form
form.addEventListener('submit', (e) => {
    /* If the input field (search bar) is empty, throw an alert */
    if (search.value.length == 0) { // Corrected checking for input value
        alert('Please type in a city name');
    } else {
        /* Change from default city to the one written in the input field */
        cityInput = search.value;
        /* Function that fetches and displays all the data from the Weather API (We will write it soon) */
        fetchWeatherData();
        // Remove all text from the input field
        search.value = "";
        // Fade out the app (simple animation)
        app.style.opacity = "0"; // Corrected setting style.opacity
    }

    // Prevents the default behavior of the form
    e.preventDefault();
});

/* Function that returns a day of the week (Monday, Tuesday, Friday...) from a date (12 03 2021) We will use this function later */
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};


// Function that fetches and displays the data from the weather API
function fetchWeatherData() {
    /* Fetch the data and dynamically add the city name with template literals */
    fetch(`https://api.weatherapi.com/v1/current.json?key=e9e54cc156e445c3a92152834241004&q=${cityInput}`)
        /* Take the data (Which is in JSON format) and convert it to a regular JS object */
        .then(response => response.json())
        .then(data => {
            console.log(data);

            /* Let's start by adding the temperature and weather condition to the page */
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            const iconId = data.current.condition.icon.substr(
                "//cdn.weatherapi.com/weather/64x64/".length
            );
            icon.src = "../icons/" + iconId;
            changeFavicon(icon.src);


            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            let timeOfDay = "Day";
            const code = data.current.condition.code;
            if (!data.current.is_day) {
                timeOfDay = "night";
            }

            if (code == 1000) {
                app.style.backgroundImage = `
                url(../Images/${timeOfDay}/clear.jpg)`;

                btn.style.background = "#e5ba92";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            } else if (
                code == 1003 ||
                code == 1006 ||
                code == 1009 ||
                code == 1030 ||
                code == 1069 ||
                code == 1087 ||
                code == 1135 ||
                code == 1273 ||
                code == 1276 ||
                code == 1279 ||
                code == 1282
            ) {
                app.style.backgroundImage = `url(../Images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background = "#fa6d1b";
                if (timeOfDay == "night") {
                    btn.style.background = "#181e27";
                }
            } else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252
            ) {
                app.style.backgroundImage = `url(../Images/${timeOfDay}/rainy.jpg)`;
                btn.style.background = "#647d75";
                if (timeOfDay == "night") {
                    btn.style.background = "#325c80";
                }
            } else {
                app.style.backgroundImage = `url(../Images/${timeOfDay}/snowy.jpg)`;
                if (timeOfDay == "night") {
                    btn.style.background = "#1b1b1b";
                }
            }
            app.style.opacity = "1";
        })
        .catch(() => {
            alert('City not found, please try again');
            app.style.opacity = "1";
        });
}
fetchWeatherData();
app.style.opacity = "1";

function changeFavicon(url) {
    const favicon = document.getElementById('favicon');
    favicon.href = url;
}


