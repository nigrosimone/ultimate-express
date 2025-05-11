// must support json body parser

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(require("../../middleware"));

app.use(bodyParser.json());

app.post('/abc', (req, res) => {
    res.send(req.body);
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    const response = await fetch('http://localhost:13333/abc', {
        method: 'POST',
        body: JSON.stringify({
            abc: 123
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const text = await response.text();
    console.log(response.headers.get('content-type'));
    console.log(text);

    process.exit(0);

});