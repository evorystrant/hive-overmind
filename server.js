"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const JWT_1 = require("./Authentication/JWT");
const user_1 = require("./Routes/user");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
JWT_1.default.setStrategy(app);
JWT_1.default.setLoginRoute(app);
app.get("/", function (req, res) {
    res.end("Server is Up!");
});
app.use("/API", user_1.default);
app.listen(6060, function () {
});
exports.default = app;
//# sourceMappingURL=server.js.map