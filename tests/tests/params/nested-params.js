// must match nested params express behavior

const express = require("express");

const app = express();

app.use(require("../../middleware"));

const router = express.Router();
const router2 = express.Router();
const router3 = express.Router();

app.use("/:id1", router);
router.use("/test", router2);
router2.use("/:id3", router3);
router3.get("/:test/:test2", (req, res) => {
    res.send(`${req.params.id1}-test-${req.params.id3}-${req.params.test}-${req.params.test2}`); // undefined-test-undefined-test-asdf
});

app.listen(13333, async () => {
    console.log('Server is running on port 13333');

    let res = await fetch('http://localhost:13333/1/test/2/test/asdf');
    console.log(await res.text());

    process.exit(0);
})
