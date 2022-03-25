const db = require("../models");

const Role = db.role;
const User = db.user;
const Task = db.task;

exports.taskAdd = (req, res) => {
    const task = new Task({
        task: req.body.task,
        isActive: req.body.isActive,
    });

    task.save((err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.userId) {
            User.find(
                {
                    _id: { $in: req.userId },
                },
                (err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    task.user = user.map((user) => user._id);
                    task.save((err) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({
                            message: "Task added successfully!",
                        });
                    });
                }
            );
        }
    });
};

exports.taskGetAll = (req, res) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        Task.find((err, tasks) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }

                            res.status(200).send(tasks);
                            return;
                        });
                    } else {
                        Task.find({
                            user: req.userId,
                        }).then((task) => {
                            if (!task) {
                                res.status(200).send("No Task");
                                return;
                            }
                            res.status(200).send(task);
                            return;
                        });
                    }
                }
            }
        );
    });
};

exports.taskGet = (req, res) => {
    Task.find({
        _id: req.params.id,
    })
        .then((task) => {
            res.status(200).send(task);
            return;
        })
        .catch((err) => {
            res.status(400).send(err);
            return;
        });
};

exports.taskUpdate = (req, res) => {
    const data = {
        task: req.body.task,
        isActive: req.body.isActive,
    };

    Task.findOneAndUpdate(
        {
            _id: req.body.taskId,
        },
        data
    )
        .then((task) => {
            res.status(200).send({ message: "Task Updated" });
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    return;
};

exports.taskDelete = (req, res) => {
    Task.deleteOne({
        _id: req.body.id,
    })
        .then((task) => {
            res.status(200).send('deleted successfully!');
        })
        .catch((err) => {
            res.status(400).send(err);
        });
    return;
};
