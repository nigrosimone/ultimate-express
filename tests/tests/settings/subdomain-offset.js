// must support "subdomain offset"

const express = require("express");

const app = express();

app.use(require("../../middleware"));

const app2 = express();
app.set('subdomain offset', 0);
app2.set('subdomain offset', 1);

app.get('/abc', (req, res) => {
    res.send(req.subdomains.join('.'));
});

app2.get('/abc', (req, res) => {
    res.send(req.subdomains.join('.'));
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    let outputs = await Promise.all([
        fetch('http://localhost:13333/abc').then(res => res.text())
    ]);

    console.log(outputs.join(' '));

    app2.listen(13334, async () => {
        console.log('Server is running on port 13334');

        let outputs2 = await Promise.all([
            fetch('http://localhost:13334/abc').then(res => res.text())
        ]);

        console.log(outputs2.join(' '));
        process.exit(0);
    });

});