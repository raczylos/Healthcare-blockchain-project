require('dotenv').config()


const userUtils = require('./user');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const userRoute = require('./routes/user')
const patientRoute = require('./routes/patient')
const doctorRoute = require('./routes/doctor')

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use("/user", userRoute);
app.use("/patient", patientRoute);
app.use("/doctor", doctorRoute);


// const authMiddleware = (req, res, next) => {
// 	const token = req.headers["authorization"]?.split(" ")[1];
// 	if (!token) {
// 		return res.sendStatus(401); // unauthorized
// 	}
// 	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
// 		if (err) {
// 			return res.sendStatus(403); // forbidden
// 		}
// 		req.user = data;
// 		next();
// 	});
// };

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


// const authAdminMiddleware = (req, res, next) => {
// 	const token = req.headers["authorization"]?.split(" ")[1];
// 	if (!token) {
// 		return res.sendStatus(401); // unauthorized
// 	}
// 	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, data) => {
// 		if (err) {
// 			return res.sendStatus(403); // forbidden
// 		}
// 		req.user = data;
// 		const userRole = await userUtils.getUserRole(req.user.userId);
// 		if (userRole !== "admin") {
// 			return res.sendStatus(401); // unauthorized
// 		}

// 		next();
// 	});
// };

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

let port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


module.exports = { authMiddleware, isAdmin };

// exports.authMiddleware = authMiddleware
// exports.isAdmin = isAdmin