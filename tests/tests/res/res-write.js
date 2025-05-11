// must support res.sendFile() res-write

const express = require("express");

const app = express();

// app.use(require("../../middleware"));

app.get('/test', (req, res) => {
    res.write('test');
    res.end();
});

app.get('/test2', (req, res) => {
    for(let i = 0; i < 10; i++) {
        const ab = new Uint8Array([i]);
        res.write(ab);
    }
    res.end();
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    const response = await fetch('http://localhost:13333/test');
    console.log(await response.text());
    console.log(response.headers.get('content-type'));

    const response2 = await fetch('http://localhost:13333/test2');
    console.log(await response2.arrayBuffer());
    console.log(response2.headers.get('content-type'));
    process.exit(0);
});