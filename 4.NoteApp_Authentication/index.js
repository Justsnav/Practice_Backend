const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const notes = [];

const users = [{
    username: "Abhinav",
    password: "123123"
}];

// SIGNUP
app.post("/signup", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const userExist = users.find(
        user => user.username === username
    );

    if (userExist) {
        return res.status(403).json({
            message: "User with this username already exists"
        });
    }

    users.push({
        username,
        password
    });

    res.json({
        message: "You have signed up"
    });
});

// SIGNIN
app.post("/signin", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const userExist = users.find(
        user =>
            user.username === username &&
            user.password === password
    );

    if (!userExist) {
        return res.status(403).json({
            message: "Incorrect Credential"
        });
    }

    const token = jwt.sign(
        { username },
        "abhinav123"
    );

    res.json({
        token
    });
});

// CREATE NOTE
app.post("/notes", (req, res) => {

    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            "abhinav123"
        );

        const username = decoded.username;

        const note = req.body.note;

        notes.push({
            note,
            username
        });

        res.json({
            message: "Done!"
        });

    } catch (err) {

        res.status(403).json({
            message: "Invalid token"
        });
    }
});

// GET NOTES
app.get("/notes", (req, res) => {

    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "You are not logged in"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            "abhinav123"
        );

        const username = decoded.username;

        const userNotes = notes.filter(
            note => note.username === username
        );

        res.json({
            notes: userNotes
        });

    } catch (err) {

        res.status(403).json({
            message: "Invalid token"
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile("D:/Code/Bootcamp/backend/4.NoteApp_Authentication/frontend/index.html");
});

app.get("/signup", (req, res) => {
    res.sendFile("D:/Code/Bootcamp/backend/4.NoteApp_Authentication/frontend/signup.html");
});

app.get("/signin", (req, res) => {
    res.sendFile("D:/Code/Bootcamp/backend/4.NoteApp_Authentication/frontend/signin.html");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});