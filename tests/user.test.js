global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test("Register a new user", async () => {
	const response = await request(app)
		.post("/register")
		.send({
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "unique123",
		})
		.expect(201);

	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	expect(response.body).toMatchObject({
		user: {
			name: "John Doe",
			email: "johndoe@gmail.com",
		},
		token: user.tokens[0].token,
	});

	expect(user.password).not.toBe("unique123");
});

test("Login the registered user", async () => {
	const { email, password } = userOne;

	const response = await request(app)
		.post("/login")
		.send({ email, password })
		.expect(200);

	const user = await User.findById(response.body.user._id);

	expect(response.body.token).toBe(user.tokens[1].token);
});

test("Login the unexisted user", async () => {
	const { email } = userOne;
	await request(app)
		.post("/login")
		.send({ email, password: "iwdnindindwindw" })
		.expect(400);
});

test("Get the registered profile user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Get the profile with unauthorized user", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Delete the current user", async () => {
	const response = await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);

	const user = await User.findById(userOneID);
	expect(user).toBeNull();
});

test("Delete the current user with unauthorized user", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("User can upload profile picture", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/pas-foto.png")
		.expect(201);

	const user = await User.findById(userOneID);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Test user can updated data", async () => {
	const response = await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ name: "Updated" })
		.expect(200);

	const user = await User.findById(userOneID);
	expect(user.name).toBe(response.body.name);
});

test("Test user failure when updated unexisted fields", async () => {
	const response = await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ location: "Jakarta" })
		.expect(400);
});
