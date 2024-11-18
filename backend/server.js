const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const jetitId = require('@jetit/id');
const cors = require('cors');
const path = require('path');

app.use(cors())
app.use(bodyParser.json());


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

let todos = [];

//display todos
app.get("/todo", (req,res)=>{
    res.status(200).json({message:"Todo retrieved successfully",data:todos});
    console.log(todos);
});

//display tasks
app.get('/todo/:todoId/tasks', (req,res)=>{
    const todoId = req.params.todoId;
    const findTodo = todos.find(t=>t.todoId === todoId);

    if(!findTodo){
        return res.status(404).send({message: "Todo not found"})
    }
    res.json({message:"Task retrieved successfully", tasks:findTodo.tasks});
});

//create new todo
app.post('/todo', (req, res)=>{
    const newTodo = {
        todoId: jetitId.generateID('HEX'),
        title: req.body.title,
        tasks:[]
        };
    console.log('TODO ID:',newTodo.todoId);
    console.log('TaskId:',newTodo.tasks);
    todos.push(newTodo);
    res.status(201).json({message: "Todo added successfully", data: newTodo});
    console.log(todos);
});

//create a new task inside a todo
app.post('/todo/:todoId/tasks', (req,res)=>{
    const todoId = req.params.todoId;
    const findTodo = todos.find(t=>t.todoId===todoId);

    if(!findTodo){
        return res.status(404).send({message:'Todo is not found'});
    }

    const newTask = {
        taskId: jetitId.generateID('HEX'),
        task: req.body.task,
        completed: req.body.completed || false
    }
    console.log('TaskId: ', newTask.taskId);
    console.log('task: ', newTask.task);
    
    findTodo.tasks.push(newTask);
    res.status(201).json({mesaage: "Task added successfully", data:newTask});
})

//edit a todo title with todoId
app.put("/todo/:todoId", (req,res)=>{
    const todoId = req.params.todoId;

    const findTodo = todos.find(t=>t.todoId===todoId);

    if(!findTodo){
        return res.status(404).send({message: "Todo not found"});
    }
    const newTitle = req.body.title;
    findTodo.title = newTitle;
    res.json({message:"Todo edited successfully" , data: findTodo});

})

//edit a task with todoid and taskid
app.put("/todo/:todoId/tasks/:taskId", (req,res)=>{
    const todoId = req.params.todoId;
    const taskId = req.params.taskId;
    
    const newTask = req.body.task;
    const status = req.body.completed;
    
    const findTodo = todos.find(t=>t.todoId===todoId);
    if(!findTodo){
        return res.status(404).send("Todo not found");
    }

    const findTask = findTodo.tasks.find(t => t.taskId===taskId);

    if(!findTask){
        return res.status(404).send('Task not found')
    }

    if (newTask !== undefined && newTask.trim() !== "") {
        findTask.task = newTask;
    }

    if (status !== undefined) {
        findTask.completed = status; 
    }


    res.json({message:"Todo list updated successfully!", data: findTask});
    console.log('Task after update:', findTask);
    const printTodo = JSON.stringify(findTodo);
    console.log('todo after task update: ', printTodo);
});

//delete an todo
app.delete('/todo/:todoId', (req,res)=>{
    const todoId = req.params.todoId;

    const todoIndex = todos.findIndex(t=>t.todoId===todoId);

    if(todoIndex===-1){
        return res.status(404).send({mesaage:"Todo not found"});
    }
    todos.splice(todoIndex,1);

    res.json({message:"Todo deleted successfully", data: todos});
})

app.delete('/todo/:todoId/tasks/:taskId', (req,res)=>{
    const todoId = req.params.todoId;
    const taskId = req.params.taskId;

    const findTodo = todos.find(u=>u.todoId===todoId);
    if(!findTodo){
        return res.status(404).send("Todo not found");
    }

    const taskIndex = findTodo.tasks.findIndex(t=>t.taskId===taskId);

    if(taskIndex === -1){
        return res.status(404).send("Task not found");
    }

    findTodo.tasks.splice(taskIndex,1);
    res.status(200).json({message:"Todo deleted successfully!", todo: findTodo});
});

app.listen(3000, () =>{
    console.log("Server running in server 3000");
});
