// must support req.acceptsCharsets()

const express = require("express");

const app = express();

app.use(require("../../middleware"));

app.get('/test', (req, res) => {
    console.log(req.acceptsCharsets('utf-8'));
    console.log(req.acceptsCharsets('utf-8', 'utf-16'));
    console.log(req.acceptsCharsets('utf-8', 'utf-16', 'utf-32'));
    console.log(req.acceptsCharsets('utf-8', 'utf-16', 'utf-32', 'utf-16'));
    res.send('test');
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    await fetch('http://localhost:13333/test').then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Charset': 'utf-8'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Charset': 'utf-8, utf-16'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Charset': 'utf-32'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Charset': 'utf-16, utf-32, utf-16'
        }
    }).then(res => res.text());
    process.exit(0);
});