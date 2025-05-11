// must support res.get()

const express = require("express");

const app = express();

app.use(require("../../middleware"));

app.get('/test', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(res.get('Content-Type').toLowerCase());
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    const response = await fetch('http://localhost:13333/test');
    console.log(await response.text());
    process.exit(0);
});