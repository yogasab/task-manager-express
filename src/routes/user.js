const express = require("express");
const User = require("../models/user");
const router = new express.Router();

router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		if (!users.length) {
			res.send({ message: "There are no current user yet" });
		}
		res.status(200).send(users);
	} catch (err) {
		res.status(500).send(err);
	}
});

router.get("/users/:id", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
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

router.delete("/users/:id", async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			res.status(404).send("User not found");
		}
		res.send({ message: "User deleted successfully" });
	} catch (err) {
		res.status(500).send(err);
	}
});

module.exports = router;
