// must support req.acceptsEncodings()

const express = require("express");

const app = express();

app.use(require("../../middleware"));

app.get('/test', (req, res) => {
    console.log(req.acceptsEncodings('gzip'));
    console.log(req.acceptsEncodings('gzip', 'deflate'));
    console.log(req.acceptsEncodings('gzip', 'deflate', 'br'));
    console.log(req.acceptsEncodings('gzip', 'deflate', 'br', 'deflate'));
    console.log(req.acceptsEncodings('deflate', 'br', 'deflate', 'gzip'));
    res.send('test');
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    await fetch('http://localhost:13333/test').then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Encoding': 'gzip'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Encoding': 'gzip, deflate'
        }
    }).then(res => res.text());
    await fetch('http://localhost:13333/test', {
        headers: {
            'Accept-Encoding': 'deflate, br'
        }
    }).then(res => res.text());
    process.exit(0);
});