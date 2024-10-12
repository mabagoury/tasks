import express from "express";

let ID_SEQUENCE = 3;

export let tasks = [
        {
            id: 1,
            title: "some task",
            description: "This is my first task",
            createdAt: "2024-10-12T08:08:00z",
            updatedAt: "2024-10-12T08:08:00z",
            assignedTo: 1
        },
        {
            id: 2,
            title: "some other task",
            description: "This is my second task",
            createdAt: "2024-10-12T08:08:00z",
            updatedAt: "2024-10-12T08:08:00z",
            assignedTo: 2
        }
    ];

export const tasksRouter = express.Router();

tasksRouter.get('/', (req, res, next) => {
    res.status(200).json(tasks);
});

tasksRouter.get('/:id', (req, res, next) => {
    const task = tasks.filter(task => task.id.toString() === req.params.id);
    
    if (task[0].assignedTo !== (req.user as any).id)
        return res.status(403).json({
            "error": "NOT Authorized"
        });

    if (!task[0])
        return res.status(404).json({
            "error": "Task NOT Found"
        });

    res.status(200).json(task[0]);
});

tasksRouter.post('/', (req, res, next) => {
    const task = req.body;

    task.id = ID_SEQUENCE++;

    // TODO: set createdAt and updatedAt
    task.createdAt = "2024-10-12T08:08:00z";
    task.updatedAt = "2024-10-12T08:08:00z";
    
    task.assignedTo = (req.user! as any).id;

    tasks.push(task);

    res.status(201).json(task);
});

tasksRouter.put('/:id', (req, res, next) => {
    const task = tasks.filter(task => task.id.toString() === req.params.id);

    if (task[0].assignedTo !== (req.user as any).id)
        return res.status(403).json({
            "error": "NOT Authorized"
        });

    if (!task[0])
        return res.status(404).json({
            "error": "Task NOT Found"
        });
    
    const newTask = req.body;
    
    newTask.id = req.params.id;

    // TODO: set updatedAt
    newTask.updatedAt = "2024-10-12T08:08:00z";

    tasks = tasks.filter(task => task.id.toString() !== req.params.id)

    tasks.push(newTask);

    res.status(200).json(newTask);
});

tasksRouter.delete('/:id', (req, res, next) => {
    const task = tasks.filter(task => task.id.toString() === req.params.id);

    if (task[0].assignedTo !== (req.user as any).id)
        return res.status(403).json({
            "error": "NOT Authorized"
        });
    
    tasks = tasks.filter(task => task.id.toString() !== req.params.id);

    res.status(204).json();

    console.log(tasks);
});
