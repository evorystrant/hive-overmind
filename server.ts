'use strict';
import * as express from 'express'
import * as bodyParser from 'body-parser';
import JWT from './Authentication/JWT'

import user_module from './Routes/user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

JWT.setStrategy(app);
JWT.setLoginRoute(app);

app.get('/', function (req, res) {
    res.end("Server is Up!")
});

app.use('/API', user_module);

app.listen(6060, function () {
    //console.log('its alive!!!!')
    //app.on("Server Ready");
});

export default app;
