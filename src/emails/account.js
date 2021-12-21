const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "185d0d4bb59a46",
		pass: "10eb4f61208f35",
	},
});

const mailOptions = {
	from: "yoga.baskoro.te18@mhsw.pnj.ac.id",
	to: "baskoroyoga40@gmail.com",
	subject: "Sending Email using Nodejs",
	text: "That was easy!",
};

const sendWelcomeEmail = (email, name) => {
	transporter.sendMail(
		{
			from: "yoga.baskoro.te18@mhsw.pnj.ac.id",
			to: email,
			subject: "Thanks for signup!",
			text: `Hello, ${name}. Tell me more that you can get along with the app`,
		},
		(err, info) => {
			if (err) {
				console.log(err);
			}
			console.log("Email sent");
		}
	);
};

const sendCancelationEmail = (email, name) => {
	transporter.sendMail(
		{
			from: "yoga.baskoro.te18@mhsw.pnj.ac.id",
			to: email,
			subject: "Subscription Canceled",
			text: `Hello, ${name}. We are sadly to informed you that subscription is canceled. You can keep receive monthly promo through this email. Thank, you.`,
		},
		(err, info) => {
			if (err) {
				console.log(err);
			}
			console.log("Email sent");
		}
	);
};

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail,
};
