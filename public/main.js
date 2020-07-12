const astronomyIMG = document.querySelector('.image-container');
const titleElement = document.querySelector('.title');
const dateElement = document.querySelector('.date');
const postTextElement = document.querySelector('.post-text');

fetch('/astro')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        fillInfo(data);
    });

fetch('/asteroid')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });

function fillInfo(data) {
    titleElement.innerHTML = data.title;
    dateElement.innerHTML = data.date;
    astronomyIMG.style.background = `url(${data.hdurl}) no-repeat center center/cover`;
    postTextElement.innerHTML = data.explanation;
}
