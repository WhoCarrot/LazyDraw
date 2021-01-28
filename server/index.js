const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes');
const { server: { port } } = require('./config.json');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '..', 'public')));

for (const route of Object.values(routes)) {
    const { endpoint, router } = route;
    console.log(`Endpoint '${endpoint}' exposed.`);
    app.use(endpoint, router({app, server, io}));
}

server.listen(process.env.PORT || port, () => console.log(`Server listening at port ${port}`));
