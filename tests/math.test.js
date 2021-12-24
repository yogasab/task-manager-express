const {
	calculateTip,
	fahrenheitToCelcius,
	celciusToFahrenheit,
	add,
} = require("../src/test/math");

test("Calculate total amount plus tip", () => {
	const total = calculateTip(10, 0.3);
	expect(total).toBe(13);
	// if (total !== 13) {
	// 	throw new Error("The result should be 13, got " + total);
	// }
});

test("Calculate total amount with default tip", () => {
	const total = calculateTip(10);
	expect(total).toBe(12);
});

test("Convert temperature from Fahrenheit to Celcius", () => {
	const value = fahrenheitToCelcius(32);
	expect(value).toBe(0);
});

test("Convert temperature from Celcius to Fahrenheit", () => {
	const value = celciusToFahrenheit(10);
	expect(value).toBe(0.5625);
});

test("Add two numbers using regular asynchronus", (done) => {
	add(2, 3).then((total) => {
		expect(total).toBe(5);
		done();
	});
});

test("Add two numbers using async/await", async () => {
	const total = await add(2, 3);
	expect(total).toBe(5);
});
