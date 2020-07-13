import Asteroid from './asteroid.js';

const astronomyIMG = document.querySelector('.image-container');
const titleElement = document.querySelector('.title');
const dateElement = document.querySelector('.date');
const postTextElement = document.querySelector('.post-text');

fetch('/astro')
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);
        fillInfo(data);
    });

fetch('/asteroid')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        findNearestAsteroid(data);
    });

function fillInfo(data) {
    titleElement.innerHTML = data.title;
    dateElement.innerHTML = data.date;

    if (data.media_type == 'image') {
        astronomyIMG.style.background = `url(${data.url}) no-repeat center center/cover`;
    } else if (data.media_type == 'video') {
        //createVideo(data.url);
    }

    postTextElement.innerHTML = data.explanation;
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
    // console.log(data.element_count);
    // console.log(Object.keys(data.near_earth_objects).length);

    // console.log(Object.keys(data.near_earth_objects));

    // console.log(
    //     data.near_earth_objects[Object.keys(data.near_earth_objects)[0]]
    // );

    let numDays = Object.keys(data.near_earth_objects).length;

    let distances = [];
    for (let i = 0; i < numDays; i++) {
        let dayData =
            data.near_earth_objects[Object.keys(data.near_earth_objects)[i]];
        for (let j = 0; j < dayData.length; j++) {
            let nearest =
                dayData[j].close_approach_data[0].miss_distance.kilometers;
            distances.push(nearest);
        }
    }
    console.log(distances);

    const min = Math.min.apply(null, distances);
    console.log(min);
}

let astero = new Asteroid('pop', 1214, 124);

console.log(astero.name);
