const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneID = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneID,
	name: "Alexander",
	email: "alexander@gmail.com",
	password: "query1234",
	tokens: [
		{
			token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
		},
	],
};

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoID,
	name: "Jack",
	email: "jack@gmail.com",
	password: "query1234",
	tokens: [
		{
			token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET),
		},
	],
};

const taskOne = {
	_id: new mongoose.Types.ObjectId(),
	description: "First task",
	completed: false,
	owner: userOne._id,
};
const taskTwo = {
	_id: new mongoose.Types.ObjectId(),
	description: "Second task",
	completed: true,
	owner: userOne._id,
};
const taskThree = {
	_id: new mongoose.Types.ObjectId(),
	description: "Third task",
	completed: false,
	owner: userTwo._id,
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();
	await new User(userOne).save();
	await new User(userTwo).save();
	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOneID,
	userOne,
	userTwo,
	userTwoID,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase,
};
