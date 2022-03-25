const { authJwt } = require("../middleware");
const controller = require("../controllers/task.controller");

const express = require("express");
const cors = require("cors");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/add-task", [authJwt.verifyToken], controller.taskAdd);

    app.get("/api/get-task-all", [authJwt.verifyToken], controller.taskGetAll);

    app.get("/api/get-task/:id", [authJwt.verifyToken], controller.taskGet);

    app.put("/api/update-task", [authJwt.verifyToken], controller.taskUpdate);

    app.delete(
        "/api/delete-task",
        [authJwt.verifyToken],
        controller.taskDelete
    );
};
