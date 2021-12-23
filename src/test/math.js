const calculateTip = (total, tipPercent = 0.2) => {
	const tip = total * tipPercent;
	return total + tip;
};

const fahrenheitToCelcius = (temp) => {
	return (temp - 32) / 1.8;
};

const celciusToFahrenheit = (temp) => {
	return (temp * 1.8) / 32;
};

module.exports = {
	calculateTip,
	fahrenheitToCelcius,
	celciusToFahrenheit,
};
