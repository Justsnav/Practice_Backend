const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

let requestCount = 0;

//Middleware to count all incoming requests
function middleware(req, res, next) {
    if(req.path.toLowerCase() === "/requestcount","/"){//skip counting for requestcount endpoint as middleware is automatically applicable to each and every path that has been called and used so to keep the requestcount more updated we have to skip this path
        return next();
    }
    requestCount++;
    next();
}

// Apply middleware BEFORE routes so it affects all routes
app.use(middleware);

// Home route → serves HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// http://localhost:3000/sum?a=5&b=3
// query parameter = sum?a=5&b=3
// app.get("/sum",(req,res)=>{
//    const a = parseInt(req.query.a) // string
//    const b = parseInt(req.query.b) // string
// req.query extracts values from URL and they are always strings
// to convert them into number we can use:
// const a = Number(req.query.a);
// OR parseInt(req.query.a)

// http://localhost:3000/sum/2/100
// This is path parameter

// POST → using body (JSON)
app.post("/sum", (req, res) => {
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);

    // both approaches are valid → depends on how data is sent

    const sum = a + b;

    res.json({
        ans: sum
    });

    // res.send(sum.toString())
});

app.post("/mul", (req, res) => {
    const a = parseInt(req.body.a);
    const b = parseInt(req.body.b);

    const mul = a * b;

    res.json({
        ans: mul
    });
});

// Health check endpoint
app.get("/status", (req, res) => {
    res.send("UP");
});

// Get total number of requests handled by server
app.get("/requestcount", (req, res) => {
    res.json({
        requestCount
    });
});

app.listen(3000, () => {
    console.log("Server is running on 3000");
});