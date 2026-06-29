const express = require("express");
const {authMiddleware} = require("./middleware");
const jwt = require("jsonwebtoken");
const {todoModel, userModel} = require("./models");
const app = express()
app.use(express.json());


app.post("/signup",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    //const exisitingUser = USERS.find(u=>u.username === username);
    const exisitingUser = await userModel.findOne({
        username: username
    })
    if(exisitingUser){
        res.status(403).json({
            message:"User with this id already exists"
        })
        return
    }
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.json({
        id: newUser._id
    })
})

app.post("/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userModel.findOne({
        username: username,
        password: password
    })
    if(!userExists){
        return res.status(403).json({
            message:"Incorrect Credential"
        })
    }
    const token = jwt.sign({
        userId: userExists._id
    },"abhinav123");
    res.json({
        token
    })
})
app.post("/todo", authMiddleware, async(req, res) => {
    console.log(req.userId);
    console.log("Body:", req.body);
    console.log("UserId:", req.userId);

    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    const newTodo = await todoModel.create({ 
        title: title,
        description: description,
        status: false,
        userId,
    })

    res.json({
        message: "Todo Created Successfully",
        todo: newTodo
    });
});


app.delete("/todo/:todoId", authMiddleware, async(req, res) => {
    const userId = req.userId;
    const todoId = req.params.todoId;

    const todo = await todoModel.findOne({
        _id: todoId,
        userId
    });

    if (!todo) {
        return res.status(403).json({
            message: "Todo not found or does not belong to you"
        });
    }

    await todoModel.deleteOne({
        _id: todoId
    });

    res.json({
        message: "Todo deleted successfully"
    });
});

app.get("/todos", authMiddleware, async(req, res) => {
    const userId = req.userId;

    const todos = await todoModel.find({
        userId
    })

    res.json({
        todos
    });
});
app.listen(3000); 