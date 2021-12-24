global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const request = require("supertest");
const app = require("../src/app");

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
