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

transporter.sendMail(mailOptions, (err, info) => {
	if (err) {
		console.log(err);
	}
	console.log("Email sent: " + info);
});
