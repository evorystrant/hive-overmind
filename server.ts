'use strict';
import * as express from 'express'
import { Medical } from "./Routes/medical_history"
import JWT from './Authentication/JWT'

import user_module from './Routes/user';

const app = express();

app.get('/', function (req, res) {
    res.end("Server is Up!\n")
});

app.use('/API', user_module);

JWT.setStrategy(app);
JWT.setLoginRoute(app);
new Medical(app);

app.listen(6060, function () {
    //console.log('its alive!!!!')
});
