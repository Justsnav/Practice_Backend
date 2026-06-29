//let CURRENT_USER_ID = 1;
//let CURRENT_TODO_ID = 1;

//const USERS = [];
//let TODOS = [];
const mongoose = require("mongoose");
mongoose.connect("write the address of the mongoose where i want to add the data")
//for all cluster creates a mongoose schema and model object

//Schema- It tells us how the schema looks for the data means how the data is going to look
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const TodoSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: Boolean,
    userId: mongoose.Types.ObjectId
})

//
const userModel = mongoose.model("users", UserSchema);
const todoModel = mongoose.model("todos", TodoSchema);

module.exports = {
    userModel: userModel,
    todoModel: todoModel
}
