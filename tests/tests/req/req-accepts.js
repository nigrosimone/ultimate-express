// must support req.accepts()

const express = require("express");

const app = express();

app.use(require("../../middleware"));

app.get('/test', (req, res) => {
    console.log(req.accepts('html'));
    console.log(req.accepts('json'));
    console.log(req.accepts('text'));
    console.log(req.accepts('*/*'));
    console.log(req.accepts('application/json'));
    console.log(req.accepts('text/html'));
    console.log(req.accepts(['json', 'text']));
    console.log(req.accepts(['json', 'html']));
    console.log(req.accepts(['html', 'json']));
    res.send('test');
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    await fetch('http://localhost:13333/test').then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept': 'text/html'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept': 'text/plain'
        }
    }).then(res => res.text());

    process.exit(0);
});