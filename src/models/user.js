const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

// User Model
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error("Age must be greater than zero");
				}
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error("Cannot use 'password' as password value");
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

// For user
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, "loginToken");
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

// userSchema.methods.getPublicProfile = function () {
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();

	delete userObject.password;
	delete userObject.tokens;

	return userObject;
};

// For User
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) {
		return JSON.stringify({ message: "Invalid user" });
	}
	const isMatched = await bcrypt.compare(password, user.password);
	if (!isMatched) {
		return "Invalid login please check email/password";
	}
	return user;
};

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

userSchema.pre("remove", async function (next) {
	const user = this;
	await Task.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
