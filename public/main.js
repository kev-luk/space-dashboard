const postTitle = document.querySelector('.post-title');
const astronomyIMG = document.querySelector('.astronomy-img');
const dateElement = document.querySelector('.date');

fetch('/space')
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        postTitle.innerHTML = data.title;
        astronomyIMG.src = data.hdurl;
        dateElement.innerHTML = data.date;
    });
