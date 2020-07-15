if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const API_KEY = process.env.NASA_KEY;

const express = require('express');
const axios = require('axios');
const app = express();
const moment = require('moment');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/astro', (req, res) => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    axios({
        url: url,
        responseType: 'json',
    }).then((data) => res.json(data.data));
});

app.get('/asteroid', (req, res) => {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD')}&end_date=${moment().format(
        'YYYY-MM-DD'
    )}&api_key=${API_KEY}`;

    console.log(moment().subtract(7, 'days').format('YYYY-MM-DD'));
    console.log(moment().format('YYYY-MM-DD'));

    axios({
        url: url,
        responseType: 'json',
    }).then((data) => res.json(data.data));
});

app.listen(PORT, () => {
    console.log('Running server...');
});
