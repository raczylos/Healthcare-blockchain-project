require("dotenv").config();

const userUtils = require("./user");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");
// const csrfDSC = require("express-csrf-double-submit-cookie");

const userRoute = require("./routes/user");
const patientRoute = require("./routes/patient");
const doctorRoute = require("./routes/doctor");

// const csrfProtection = csrfDSC();

const app = express();

app.use(cookieParser());

app.use(cors());
app.use(bodyParser.json());

// app.use(csrfProtection);

// const csurf = require("csurf");
// const csrfProtection = csurf({ cookie: true, ignoreMethods: ["GET", "HEAD", "OPTIONS"] });

const { doubleCsrf } = require("csrf-csrf");

// const doubleCsrfUtilities = doubleCsrf({
// 	getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
// });

const doubleCsrfUtilities = {
	getSecret: () => "Secret",
};

const { generateToken, doubleCsrfProtection } = doubleCsrf(doubleCsrfUtilities);

// app.use((req, res, next) => {
// 	const csrf = generateToken(res, req);
// 	// const csrf = req.csrfToken();
// 	console.log(csrf);
// 	res.cookie("XSRF-TOKEN", csrf, { httpOnly: false, secure: false });
// 	res.json({ csrfToken });
// 	next();
// });

// app.use(csrfProtection);

// const myRoute = (request, response) => {
// 	const csrfToken = generateToken(response, request);
// 	// You could also pass the token into the context of a HTML response.
// 	res.json({ csrfToken });
// };

// app.use(doubleCsrfProtection);

// app.use(doubleCsrfProtection, (req, res, next) => {
// 	const csrfToken = req.csrfToken();
// 	// const csrfToken = generateToken(res, req);
// 	console.log(csrfToken);
// 	res.cookie("XSRF-TOKEN", csrfToken);
// 	next();
// });

app.use(doubleCsrfProtection);

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

// exports.authMiddleware = authMiddleware
// exports.isAdmin = isAdmin
