import Asteroid from './object/asteroid.js';

const astronomyIMG = document.querySelector('.image-container');
const titleElement = document.querySelector('.title');
const dateElement = document.querySelector('.date');
const postTextElement = document.querySelector('.post-text');

const totalAsteroids = document.querySelector('#totalAsteroids');
const asteroidName = document.querySelector('#asteroidName');
const asteroidDistance = document.querySelector('#asteroidDistance');
const asteroidDiameter = document.querySelector('#asteroidDiameter');
const asteroidDate = document.querySelector('#asteroidDate');
const ctx = document.getElementById('myChart');

fetch('/astro')
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);
        fillAPOD(data);
    });

fetch('/asteroid')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        fillNEOWS(data);
        createChart(data);
    });

function fillAPOD(data) {
    titleElement.innerHTML = data.title;
    dateElement.innerHTML = data.date;

    if (data.media_type == 'image') {
        astronomyIMG.style.background = `url(${data.url}) no-repeat center center/cover`;
    } else if (data.media_type == 'video') {
        createVideo(data.url);
    }

    postTextElement.innerHTML = data.explanation;
}

function fillNEOWS(data) {
    totalAsteroids.innerHTML = data.element_count;
    asteroidName.innerHTML = findNearestAsteroid(data).name;
    asteroidDistance.innerHTML = `${findNearestAsteroid(
        data
    ).nearestDistance.toFixed(2)} km`;
    asteroidDiameter.innerHTML = `${findNearestAsteroid(data).diameter.toFixed(
        2
    )} km`;
    asteroidDate.innerHTML = findNearestAsteroid(data).closestAproachDate;
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

    console.log(dates);

    const week = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const sortedList = dates.sort((a, b) => {
        if (a > b) {
            return 1;
        } else {
            return -1;
        }
    });

    let daysOfWeek = [];

    console.log(sortedList);
    for (let i = 0; i < dates.length; i++) {
        let day = new Date(dates[i]).getDay();
        console.log(day);
    }

    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
            responsive: true,
        },
    });
}
