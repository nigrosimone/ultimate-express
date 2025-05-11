// must support compression middleware with files

const express = require("express");
const compression = require("compression");

const app = express();

app.use(require("../../middleware"));

app.use(compression({
    threshold: 1,
}));

app.use(express.static('tests/parts'));

app.get('/test', (req, res) => {
    res.sendFile('tests/parts/large-file.json', { root: "." });
});

app.get('/abc', (req, res) => {
    res.send('Hello World');
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    // sent with pipe
    let response = await fetch('http://localhost:13333/large-file.json', {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip',
        },
    });
    
    console.log(response.headers.get('content-encoding'), response.headers.get('content-encoding') === 'gzip');
    console.log(response.headers.get('transfer-encoding'));
    console.log(response.headers.get('Etag'));
    console.log(response.headers.get('content-type').toLowerCase());
    console.log(await response.json());

    // sent with pipe
    response = await fetch('http://localhost:13333/medium-file.json', {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip',
        },
    });
    
    console.log(response.headers.get('content-encoding'), response.headers.get('content-encoding') === 'gzip');
    console.log(response.headers.get('transfer-encoding'));
    console.log(response.headers.get('Etag'));
    console.log(response.headers.get('content-type').toLowerCase());
    console.log(await response.json());

    // sent with worker
    response = await fetch('http://localhost:13333/small-file.json', {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip',
        },
    });
    
    console.log(response.headers.get('content-encoding'), response.headers.get('content-encoding') === 'gzip');
    console.log(response.headers.get('transfer-encoding'));
    console.log(response.headers.get('Etag'));
    console.log(response.headers.get('content-type').toLowerCase());
    console.log(await response.json());

    // sent with res.sendFile
    response = await fetch('http://localhost:13333/test', {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'gzip',
        },
    });
    
    console.log(response.headers.get('content-encoding'), response.headers.get('content-encoding') === 'gzip');
    console.log(response.headers.get('transfer-encoding'));
    console.log(response.headers.get('Etag'));
    console.log(response.headers.get('content-type').toLowerCase());
    console.log(await response.json());

    process.exit(0);

});