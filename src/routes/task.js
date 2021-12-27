const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
	// const task = new Task(req.body);
	const task = new Task({
		...req.body,
		owner: req.user._id,
	});
	try {
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};

	if (req.query.completed) {
		match.completed = req.query.completed === "true";
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":");
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
	}

	try {
		// const tasks = await Task.find({ owner: req.user._id });
		// if (!tasks.length) {
		// 	res.send({ message: "There are no tasks yet" });
		// }
		// res.send(tasks);
		await req.user.populate({
			path: "tasks",
			match,
			options: {
				// limit: parseInt(req.query.limit),
				// sort,
				// skip: parseInt(req.query.skip),
			},
		});
		if (!req.user.tasks.length) {
			res.status(200).send({ message: "There are no task yet" });
		}
		res.send(req.user.tasks);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		// const task = await Task.findById(_id);
		const task = await Task.findOne({ _id, owner: req.user._id });
		if (!task) {
			return res.status(404).send({ error: "Task not found" });
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	const updates = Object.keys(req.body);
	const allowedUpdatesField = ["description", "completed"];
	const isValidField = updates.every((update) =>
		allowedUpdatesField.includes(update)
	);
	if (!isValidField) {
		res.status(400).send({ error: "Invalid updated field" });
	}
	try {
		// const task = await Task.findById(id);
		const task = await Task.findOne({
			_id,
			owner: req.user._id,
		});
		if (!task) {
			res.status(404).send({ error: "Task not found" });
		}
		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();
		// const task = await Task.findByIdAndUpdate(id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });
		res.send(task).status(203);
	} catch (err) {
		res.send(err);
	}
});

router.delete("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
		if (!task) {
			res.status(404).send({ error: "Task not found" });
		}
		res.send({ message: "Task deleted successfully" });
	} catch (err) {
		res.send();
	}
});

module.exports = router;
