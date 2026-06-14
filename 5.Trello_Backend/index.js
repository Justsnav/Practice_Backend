//username,password
//organization
//boards
//issues

const express = require("express")
const jwt = require("jsonwebtoken")
const {authMiddleware} = require("./middleware")

let USERS_ID = 1;
let ORGANIZATION_ID = 1;
let BOARD_ID = 1;
let ISSUES_ID = 1;

const USERS = [];
const ORGANIZATION = [];
const BOARDS = [];
const ISSUES = [];

const app =  express();
app.use(express.json());
//Create 
app.post("/signup",(req,res)=>{
    const username = req.body.username;
    const password =  req.body.password;
    
    const userExists = USERS.find(u => u.username === username)
    if(userExists){
        res.status(411).json({
            message: "User already exist with this name"
        })
        return;
    }
    USERS.push({
        username,
        password,
        id: USERS_ID++
    })
    res.status(201).json({
        message:"User Create3d successfully"
    })
})

app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const userExists = USERS.find(u => u.username === username &&  u.password === password);
    if(!userExists){
        res.status(403).json({
            message:"Incorrect credential"
        })
        return;
    }
    //create the JWT for the user using jsonWebToken library
    const token = jwt.sign({
        userId: userExists.id
    },"supersecretPassword123")
    res.json({
        token
    })
})


//Authenticated route - So we are going to use Middleware
app.post("/organization",authMiddleware,(req,res)=>{
    const userId = req.userId;
    ORGANIZATION.push({
        id: ORGANIZATION_ID++,
        title: req.body.title,
        description : req.body.description,
        admin: userId,
        members: []
    })
    res.json({
        message:"Organization Created",
        id: ORGANIZATION_ID-1
    })
})

app.post("/add-member-to-organization",authMiddleware,(req,res)=>{
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUserUsername = req.body.memberUserUsername;
    const organization = ORGANIZATION.find(org => org.id === organizationId);
    if(!organization || organization.admin !== userId){
        res.status(411).json({
            messagge : "Either this organization dosenot exist or you ar not the adminof this organization"
        })
        return;
    }
    const memberUser = USERS.find(u => u.username === memerUserUsername);

    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }

    organization.members.push(memberUser.id);

    res.json({
        message: "New member added!"
    })
})

app.post("/board",(req,res)=>{
    
})

app.post("/issue",(req,res)=>{
    
})

//Read 
app.get("/organization", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = parseInt(req.query.organizationId); // "1"

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    console.log(organization);
    console.log(userId);
    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    res.json({
        organization: {
            ...organization,
            members: organization.members.map(memberId => {
                const user = USERS.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })
})
app.get("/boards/:organization",(req,res)=>{

})

app.get("/issue",(req,res)=>{

})

app.get("/memebers",(req,res)=>{

})

//UPDATDE
app.put("/issues",(req,res)=>{

})
//Delete
app.delete("/members", authMiddleware, (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memerUserUsername = req.body.memberUserUsername;

    const organization = ORGANIZATIONS.find(org => org.id === organizationId);

    if (!organization || organization.admin !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const memberUser = USERS.find(u => u.username === memerUserUsername);

    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }

    organization.members = organization.members.filter(user => user.id !== memberUser.id);

    res.json({
        message: "member deleted!"
    })
})

app.listen(3000);