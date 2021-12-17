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
