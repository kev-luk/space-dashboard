import Asteroid from './objects/Asteroid.js';
import Day from './objects/Day.js';

const astronomyIMG = document.querySelector('.image-container');
const titleElement = document.querySelector('.title');
const authorElement = document.querySelector('#author');
const dateElement = document.querySelector('#date');
const postTextElement = document.querySelector('.post-text');

const totalAsteroids = document.querySelector('#totalAsteroids');
const asteroidName = document.querySelector('#asteroidName');
const asteroidDistance = document.querySelector('#asteroidDistance');
const asteroidDiameter = document.querySelector('#asteroidDiameter');
const asteroidDate = document.querySelector('#asteroidDate');
const ctx = document.getElementById('myChart');
const searchBarElement = document.querySelector('.search-bar');
const searchBoxElement = new google.maps.places.SearchBox(searchBarElement);
const satelliteIMG = document.querySelector('.satellite-image');
const latitude = document.querySelector('#latitude');
const longitude = document.querySelector('#longitude');
const imageDate = document.querySelector('#image-date');

searchBoxElement.addListener('places_changed', (e) => {
    const location = searchBoxElement.getPlaces()[0];

    if (location == null) return;

    fetch('/earth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            latitude: location.geometry.location.lat(),
            longitude: location.geometry.location.lng(),
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            latitude.textContent = location.geometry.location.lat().toFixed(4);
            longitude.textContent = location.geometry.location.lng().toFixed(4);
            console.log(data.date);
            imageDate.textContent = `${data.date.substring(
                0,
                10
            )} ${data.date.substring(11, 19)}`;
            satelliteIMG.style.background = `url(${data.url}) no-repeat center center/cover`;
        });
});

fetch('/astro')
    .then((res) => res.json())
    .then((data) => {
        fillAPOD(data);
    })
    .catch((error) => {
        console.error('Error: ', error);
        errorMessage();
    });

fetch('/asteroid')
    .then((res) => res.json())
    .then((data) => {
        fillNEOWS(data);
        createChart(data);
    });

function errorMessage() {
    postTextElement.textContent =
        'Unable to retrieve data from NASA API. Please refresh the page or try again later.';
    postTextElement.style.fontWeight = '900';
    postTextElement.style.textDecorationLine = 'underline';
    postTextElement.style.textDecorationStyle = 'solid';
}

function fillAPOD(data) {
    titleElement.textContent = data.title;
    authorElement.textContent = data.copyright;
    dateElement.textContent = data.date;

    astronomyIMG.removeChild(document.querySelector('#apod-message'));

    if (data.media_type == 'image') {
        astronomyIMG.style.background = `url(${data.url}) no-repeat center center/cover`;
    } else if (data.media_type == 'video') {
        createVideo(data.url);
    }

    postTextElement.textContent = data.explanation;
}

function fillNEOWS(data) {
    totalAsteroids.textContent = data.element_count;
    asteroidName.textContent = findNearestAsteroid(data).name;
    asteroidDistance.textContent = `${findNearestAsteroid(
        data
    ).nearestDistance.toFixed(2)} km`;
    asteroidDiameter.textContent = `${findNearestAsteroid(
        data
    ).diameter.toFixed(2)} km`;
    asteroidDate.textContent = findNearestAsteroid(data).closestAproachDate;
}

function createVideo(data) {
    let video = document.createElement('iframe');
    astronomyIMG.appendChild(video);
    video.src = data;
    video.autoplay = false;
    video.width = '100%';
    video.height = '100%';
    video.style.borderRadius = '10px';
    video.style.outline = 'none';
    video.style.border = 'none';
}

function findNearestAsteroid(data) {
    let numDays = Object.keys(data.near_earth_objects).length;

    let asteroidList = [];

    for (let i = 0; i < numDays; i++) {
        let dayData =
            data.near_earth_objects[Object.keys(data.near_earth_objects)[i]];
        for (let j = 0; j < dayData.length; j++) {
            let name = dayData[j].name;
            let nearestDistance = parseFloat(
                dayData[j].close_approach_data[0].miss_distance.kilometers
            );
            let diameterMax =
                dayData[j].estimated_diameter.kilometers.estimated_diameter_max;
            let diameterMin =
                dayData[j].estimated_diameter.kilometers.estimated_diameter_min;
            let diameter = (diameterMax + diameterMin) / 2;
            let date =
                dayData[j].close_approach_data[0].close_approach_date_full;
            asteroidList.push(
                new Asteroid(name, nearestDistance, diameter, date)
            );
        }
    }

    const sortedList = asteroidList.sort((a, b) => {
        if (a.getNearestDistance() > b.getNearestDistance()) {
            return 1;
        } else {
            return -1;
        }
    });

    return sortedList[0];
}

function createChart(data) {
    let dates = Object.keys(data.near_earth_objects);

    let sortedDates = dates.sort((a, b) => {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    });

    const finalDates = sortedDates.map((day) => day.slice(5));

    const currWeek = [];
    for (let i = 0; i < dates.length; i++) {
        let numAsteroids = data.near_earth_objects[sortedDates[i]].length;
        let day = new Day(finalDates[i], numAsteroids);
        currWeek.push(day);
    }

    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                currWeek[0].getDate(),
                currWeek[1].getDate(),
                currWeek[2].getDate(),
                currWeek[3].getDate(),
                currWeek[4].getDate(),
                currWeek[5].getDate(),
                currWeek[6].getDate(),
                currWeek[7].getDate(),
            ],
            datasets: [
                {
                    label: '# of Asteroids',
                    data: [
                        currWeek[0].getNumAsteroids(),
                        currWeek[1].getNumAsteroids(),
                        currWeek[2].getNumAsteroids(),
                        currWeek[3].getNumAsteroids(),
                        currWeek[4].getNumAsteroids(),
                        currWeek[5].getNumAsteroids(),
                        currWeek[6].getNumAsteroids(),
                        currWeek[7].getNumAsteroids(),
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(227, 0, 247, 0.2)',
                        'rgba(153, 153, 153, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(227, 0, 247, 1)',
                        'rgba(153, 153, 153, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Daily Asteroid Count for Past 7 Days',
            },
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of Asteroids',
                        },
                    },
                ],
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Dates',
                        },
                    },
                ],
            },
        },
    });
}
