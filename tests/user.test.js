global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
	name: "Alexander",
	email: "alexander@gmail.com",
	password: "query1234",
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(userOne).save();
});

test("Register a new user", async () => {
	await request(app)
		.post("/register")
		.send({
			name: "John Doe",
			email: "johndoe@gmail.com",
			password: "unique123",
		})
		.expect(201);
});

test("Login the registered user", async () => {
	const { email, password } = userOne;
	await request(app).post("/login").send({ email, password }).expect(200);
});

test("Login the unexisted user", async () => {
	const { email } = userOne;
	await request(app)
		.post("/login")
		.send({ email, password: "iwdnindindwindw" })
		.expect(400);
});
