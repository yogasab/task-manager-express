const express = require("express");
const User = require("../src/models/user");
const Task = require("../src/models/task");
require("../src/db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get("/users/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404);
		}
		res.status(200).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.patch("/users/:id", async (req, res) => {
	const id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdatesField = ["name", "email", "password", "age"];
	const isValidField = updates.every((update) =>
		allowedUpdatesField.includes(update)
	);
	if (!isValidField) {
		res.status(400).send({ error: "Invalid updates" });
	}
	// return res.send(updates);
	try {
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			res.status(404);
		}
		res.send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.post("/tasks", async (req, res) => {
	const task = new Task(req.body);
	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.status(200).send(tasks);
	} catch (err) {
		res.status(500).send(err);
	}
});

app.get("/tasks/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404);
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(err);
	}
});

app.patch("/tasks/:id", async (req, res) => {
	const id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdatesField = ["description", "completed"];
	const isValidField = updates.every((update) =>
		allowedUpdatesField.includes(update)
	);
	if (!isValidField) {
		res.status(400).send({ error: "Invalid updated field" });
	}
	try {
		const task = await Task.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!task) {
			res.status(404);
		}
		res.send(task).status(203);
	} catch (err) {
		res.send(err);
	}
});

app.listen(port, () => {
	console.log(`Listening to ${port}`);
});
