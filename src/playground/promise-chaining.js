require("../db/mongoose");
const User = require("../models/user");
const Task = require("../models/task");

// Promise Chaining
// User.findByIdAndUpdate("61b9685df59886a596294210", { age: 21 })
// 	.then((user) => {
// 		console.log(user);
// 		return User.countDocuments({ age: 21 });
// 	})
// 	// Get the result fro the latest return (chaining)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// Task.findByIdAndDelete("61b81346eae650c7e2969eca")
// 	.then((task) => {
// 		console.log("Deleted Successfully");
// 		return Task.countDocuments({ completed: false });
// 	})
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// Async Await User
// const updateAndCountUser = async (id, age) => {
// 	const updatedUser = User.findByIdAndUpdate(id, { age });
// 	const count = User.countDocuments({ age });
// 	return count;
// };

// updateAndCountUser("61b980e50d8c7252a1f2a558", 21)
// 	.then((count) => {
// 		console.log(count);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// Async Await Task
const deleteAndCountTask = async (id) => {
	const removedTask = await Task.findByIdAndRemove(id);
	const count = await Task.countDocuments({ completed: false });
	return count;
};

deleteAndCountTask("61b844d4bd4a23edd906323c")
	.then((count) => {
		console.log(count);
	})
	.catch((err) => {
		console.log(err);
	});
