require("dotenv").config();

const userUtils = require("./user");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const crypto = require("crypto");

const cookieParser = require("cookie-parser");
// const csrfDSC = require("express-csrf-double-submit-cookie");

const userRoute = require("./routes/user");
const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");

const app = express();

app.set("trust proxy", 1);

app.use(
	session({
		secret: generateSecret(64),
		resave: false,
		saveUninitialized: false,
	})
);

// app.use(cookieParser());

app.use(cors());
app.use(bodyParser.json());

const { csrfSync } = require("csrf-sync");

const { csrfSynchronisedProtection } = csrfSync();



// const { doubleCsrf } = require("csrf-csrf");

function generateSecret(length) {
	let secret = crypto.randomBytes(length).toString("hex");

	return secret;
}

app.use(csrfSynchronisedProtection);

// const doubleCsrfUtilities = {
// 	getSecret: (req) => {
// 		if (!req.session.secret) {
// 			req.session.secret = generateSecret(32);
// 		}
// 		return req.session.secret;
// 	},
// 	cookieName: "psifi.x-csrf-token",
// };


// const { generateToken, doubleCsrfProtection } = doubleCsrf(doubleCsrfUtilities);

// app.use(doubleCsrfProtection);

app.use(function (req, res, next) {
	// res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-CSRF-Token");
	next();
});

app.use("/api/user", userRoute);
app.use("/api/patient", patientRoute);
app.use("/api/doctor", doctorRoute);

const authMiddleware = (req, res, next) => {
	const token = req.headers["authorization"]?.split(" ")[1];
	if (!token) {
		return res.sendStatus(401); // unauthorized
	}
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
		if (err) {
			return res.sendStatus(403); // forbidden
		}
		req.user = data;
		next();
	});
};

const isAdmin = async (req, res, next) => {
	const userRole = await userUtils.getUserRole(req.user.userId);
	if (userRole === "admin") {
		next();
	} else {
		res.status(403).send();
	}
};

// app.delete('/logout', (req, res) => {
//     const {refreshToken} = req.body
//     // refreshToken = refreshTokens.filter(token => token !== refreshToken)
//     res.sendStatus(204)

// })

let port = 3000;

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

module.exports = { authMiddleware, isAdmin };


