if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const API_KEY = process.env.NASA_KEY;

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/space', (req, res) => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    axios({
        url: url,
        responseType: 'json',
    }).then((data) => res.json(data.data));
});

app.listen(PORT, () => {
    console.log('Successfully started server...');
});
