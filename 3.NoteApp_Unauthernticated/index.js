const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
let notes = [];
app.post("/notes", (req, res) => {
    const note = req.body.note;

    if (!note || note.trim() === "") {
        return res.status(400).json({ message: "Note cannot be empty" });
    }

    notes.push(note);

    res.json({ message: "Done!" });
});

app.get("/notes", (req, res) => {
    res.json({ notes });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});