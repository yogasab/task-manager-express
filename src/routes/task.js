const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
	// const task = new Task(req.body);
	const { user, body } = req;
	const task = new Task({
		...body,
		owner: user._id,
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find({});
		if (!tasks.length) {
			res.send({ message: "There are no tasks yet" });
		}
		res.status(200).send(tasks);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/tasks/:id", async (req, res) => {
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

router.patch("/tasks/:id", async (req, res) => {
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
		const task = await Task.findById(id);
		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();
		// const task = await Task.findByIdAndUpdate(id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });
		if (!task) {
			res.status(404);
		}
		res.send(task).status(203);
	} catch (err) {
		res.send(err);
	}
});

router.delete("/tasks/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const task = await Task.findByIdAndDelete(id);
		if (!task) {
			res.status(404).send({ message: "Task not found" });
		}
		res.send({ message: "Task deleted successfully" });
	} catch (err) {
		res.send(err);
	}
});

module.exports = router;
