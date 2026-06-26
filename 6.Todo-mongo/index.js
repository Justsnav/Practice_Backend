const express = require("express");
const {authMiddleware} = require("./middleware");
const jwt = require("jsonwebtoken");
const app = express()
app.use(express.json());

let CURRENT_USER_ID = 1;
let CURRENT_TODO_ID = 1;

const USERS = [];
const TODOS = [];

app.post("/signup",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const exisitingUser = USERS.find(u=>u.username === username);
    if(exisitingUser){
        res.status(403).json({
            message:"User with this id already exists"
        })
        return
    }
    USERS.push({
        id:CURRENT_USER_ID++,
        username,
        password
    })
    res.json({
        id:CURRENT_USER_ID-1
    })
})

app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = USERS.find(u => u.username === username && u.password === password)
    if(!userExists){
        return res.status(403).json({
            message:"Incorrect Credential"
        })
    }
    const token = jwt.sign({
        userId: userExists.id
    },"abhinav123");
    res.json({
        token
    })
})
app.post("/todo",authMiddleware,(req,res)=>{
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;
    TODOS.push({
        id: CURRENT_TODO_ID++,
        title,
        description,
        status: false,
        userId: userId
    })
    res.json({
        message:"Todo is made"
    })
})
app.delete("delete",authMiddleware,(req,res)=>{
    const userId = req.userId;
    const todoId = parseInt(req.params.todoId);
    const doesUserOwnTodo = TODOS.filter(t=> t.userId === userId && t.id === todoId);
    if(doesUserOwnTodo){
        TODOS = TODOS.filter(t=> t.id === todoId);
        res.json({
            message:"This Todo is not your"
        })
    }
})
app.get("/todos",authMiddleware,(req,res)=>{
    const userId = parseInt(req.userId);
    const userTodos = TODOS.find(t => t.userId === userId);
    res.json({
        todos:userTodos
    })
})
app.listen(3000); 