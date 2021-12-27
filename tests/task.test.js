global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
	userOneID,
	userOne,
	userTwo,
	userTwoID,
	taskOne,
	taskTwo,
	taskThree,
	setupDatabase,
} = require("./db/db");

beforeEach(setupDatabase);

test("Store a new task", async () => {
	await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({
			description: "Doing some exercise",
		})
		.expect(201);
});

test("Fetch all task related to owner id", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	expect(response.body.length).toEqual(2);
});

test("Delete the first task of the second user failure", async () => {
	await request(app)
		.delete(`/tasks/${taskOne._id}`)
		.set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);
});
