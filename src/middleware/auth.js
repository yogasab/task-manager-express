const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
	try {
		// Get the token
		const token = req.header("Authorization").replace("Bearer ", "");
		// Decode the payload token and verify
		const decodedPayloadToken = jwt.verify(token, "loginToken");
		// Verify the the decoded token id and its token
		const user = await User.findOne({
			_id: decodedPayloadToken._id,
			"tokens.token": token,
		});
		req.token = token;
		req.user = user;
		if (!user) {
			throw new Error();
		}
	} catch (err) {
		res.status(401).send({ error: "Unauthorized" });
	}
	next();
};

module.exports = auth;
