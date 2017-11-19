import express from 'express';

const app = express();

app.use('/', express.static(__dirname + '/../dist'));


const server = app.listen(3000, () => {
    console.log('Hello Express listening on port 3000');
});