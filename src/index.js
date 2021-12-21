const express = require("express");
const UserRouter = require("./routes/user");
const TaskRouter = require("./routes/task");
require("../src/db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
// 	if (req.method) {
// 		res
// 			.status(501)
// 			.send("The website is under maintenance, please try again later");
// 	}
// });

app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

app.listen(port, () => {
	console.log(`Listening to ${port}`);
});

// Relationship
// const Task = require("./models/task");
// const User = require("./models/user");
// const main = async () => {
// const task = await Task.findById("61bff7ce91f45b48af9441b3");
// await task.populate("owner");
// console.log(task.owner);
// const user = await User.findById("61bff79591f45b48af9441a8");
// await user.populate("tasks");
// console.log(user.tasks);
// };
// main();
