import express from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware";

import { tasks } from "./tasks.routes";

let ID_SEQUENCE = 2;

let users = [
    {
        id: 1,
        username: "Mahmoud",
        password: "$2b$10$BjTpudW8wf7E4RKSXhNGNenmZl7embiTw2XWTkZ23UaYMsO8j2OBO",
        createdAt: "2024-10-12T08:08:00z"
    }
];

export const usersRouter = express.Router();

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = users.filter(user => user.username === username);

    if (!user[0])
        return res.status(401).json({
            "error": "wrong username or password"
        });

    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
        return res.status(401).json({ "error": "wrong username or password" });
    }

    const token = jwt.sign(
        { id: user[0].id, username: user[0].username },
        "SECRET",
    );

    return res.status(200).json({ token });
});

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    
    const existingUser = users.filter(user => user.username === username);
    
    if (existingUser[0]) {
        return res.status(400).json({ "error": "username already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(await bcrypt.hash("123456", 10));
    
    const newUser = {
        id: ID_SEQUENCE++,
        username,
        password: hashedPassword,
        createdAt: "2024-10-12T08:08:00z" // TODO
    };
    
    users.push(newUser);

    const token = jwt.sign(
        {
            id: newUser.id,
            username: newUser.username,
        },
        'SECRET',
    );

    return res.status(200).json({ token });
});

usersRouter.get('/:id/tasks', (req, res, next) => {
    const userTasks = tasks.filter(task => task.assignedTo.toString() === req.params.id);

    res.status(200).json(userTasks);
});




