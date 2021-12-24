const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = new express.Router();

const uploads = multer({
	// dest: "images",
	limits: {
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("File must be jpg, jpeg, or png"));
		}
		cb(undefined, true);
	},
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

// Logout the users who send the request
router.post("/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			// Return the token that doesnt match with the one who sending request
			return token.token !== req.token;
		});
		await req.user.save();
		res.send();
	} catch (err) {
		res.status(500).send();
	}
});
// Logout to all users
router.post("/logout/all", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (err) {
		res.status(500).send();
	}
});

router.post("/register", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (err) {
		res.status(400).send(err);
	}
});

router.get("/users/me", auth, async (req, res) => {
	const { user } = req;
	res.send(user);
	// try {
	// 	const users = await User.find({});
	// 	if (!users.length) {
	// 		res.send({ message: "There are no current user yet" });
	// 	}
	// 	res.status(200).send(users);
	// } catch (err) {
	// 	res.status(500).send(err);
	// }
});

// router.get("/users/:id", async (req, res) => {
// 	const _id = req.params.id;
// 	try {
// 		const user = await User.findById(_id);
// 		if (!user) {
// 			return res.status(404);
// 		}
// 		res.status(200).send(user);
// 	} catch (err) {
// 		res.status(400).send(err);
// 	}
// });

// router.patch("/users/:id", async (req, res) => {
router.patch("/users/me", auth, async (req, res) => {
	// const id = req.params.id;
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
		// const user = await User.findById(req.user._id);
		const { user } = req;
		updates.forEach((update) => (user[update] = req.body[update]));
		await user.save();
		// const user = await User.findByIdAndUpdate(id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });
		if (!user) {
			res.status(404);
		}
		res.send(user);
	} catch (err) {
		res.status(400).send(err);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	// const id = req.params.id;
	try {
		// const user = await User.findByIdAndDelete(id);
		// if (!user) {
		// 	res.status(404).send("User not found");
		// }
		await req.user.remove();
		sendCancelationEmail(req.user.email, req.user.name);
		res.send({ message: "User deleted successfully" });
	} catch (err) {
		res.status(401).send();
	}
});

// Users Avatar
router.post(
	"/users/me/avatar",
	auth,
	uploads.single("avatar"),
	async (req, res) => {
		const bufferedImage = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		// req.user.avatar = req.file.buffer;
		req.user.avatar = bufferedImage;
		await req.user.save();
		res.status(201).send({ message: "File uploaded successfully" });
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

router.delete(
	"/users/me/avatar",
	auth,
	uploads.single("avatar"),
	async (req, res) => {
		req.user.avatar = undefined;
		await req.user.save();
		res.status(204).send({ message: "File deleted successfully" });
	}
);

router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error("User/Avatar not found, please try again later");
		}
		res.set("Content-Type", "image/png");
		res.send(user.avatar).status(200);
	} catch (error) {
		res.status(404).send({ error: "User/Avatar not found" });
	}
});

module.exports = router;
