const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

// User Model
// const User = mongoose.model("User", {
// 	name: {
// 		type: String,
// 		required: true,
// 		trim: true,
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		trim: true,
// 		lowercase: true,
// 		validate(value) {
// 			if (!validator.isEmail(value)) {
// 				throw new Error("Email is invalid");
// 			}
// 		},
// 	},
// 	age: {
// 		type: Number,
// 		default: 0,
// 		validate(value) {
// 			if (value < 0) {
// 				throw new Error("Age must be greater than zero");
// 			}
// 		},
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 		minLength: 7,
// 		trim: true,
// 		validate(value) {
// 			if (value.toLowerCase().includes("password")) {
// 				throw new Error("Cannot use 'password' as password value");
// 			}
// 		},
// 	},
// });

// const saveUser = new User({
// 	name: "  Farisa  ",
// 	email: "FARISA@EMAIL.COM",
// 	password: "password123123",
// });

// saveUser
// 	.save()
// 	.then(() => {
// 		console.log(saveUser);
// 	})
// 	.catch((err) => console.log(err));

// const Task = mongoose.model("Task", {
// 	description: {
// 		type: String,
// 		trim: true,
// 		required: true,
// 	},
// 	completed: {
// 		type: Boolean,
// 		default: false,
// 	},
// });

// const saveTask = new Task({
// 	description: "Create ERD from table",
// 	// completed: true,
// });

// saveTask
// 	.save()
// 	.then((res) => console.log(res))
// 	.catch((err) => console.log(err));
