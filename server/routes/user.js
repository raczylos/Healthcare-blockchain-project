const express = require('express')
const router = express.Router()

const registerUser = require('../register')
const updateUserAttributes = require('../editUser')
const userUtils = require('../user');
const jwt = require('jsonwebtoken');

// const { authMiddleware, isAdmin } = require('../routes')

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

// const myRoute = (request, response) => {
// 	const csrfToken = generateToken(response, request);
	
// 	res.json({ csrfToken });
// };

router.post("/register", authMiddleware, isAdmin, async (req, res) => {
	
	console.log("registerUser");
	console.log(req.body);

	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let role = req.body.role;
	let username = req.body.userId;
	let password = req.body.password;
	let hashedPassword = await userUtils.encryptPassword(password);
	let age = req.body.age.toString();
	let gender = req.body.gender;
	let address = req.body.address;
	let phoneNumber = req.body.phoneNumber;
	let specialization = req.body.specialization;

	let user = await userUtils.getUserById(username);

	if (user) {
		return res.sendStatus(409);
	}

	if (role === "doctor") {
		await registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, phoneNumber, specialization);
	} else {
		await registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, phoneNumber);
	}

	res.json(req.body);
	
});

router.post("/login", async (req, res) => {
	console.log("login");
	console.log(req.body);



	let username = req.body.username;
	let password = req.body.password;
	let user = await userUtils.getUserById(username);

	if (!user) {
		return res.sendStatus(404); // user doesn't exist
	}
	const userRole = await userUtils.getUserRole(username);

	if (userRole === "admin") {
		// const adminPassword = await userUtils.getAdminEnrollmentSecret()
		const adminPassword = "adminpw";
		if (adminPassword !== password) {
			console.log("incorrect password");
			return res.sendStatus(404);
		}
	} else {
		const hashedPassword = await userUtils.getUserHashedPassword(username);
		const isPasswordMatch = await userUtils.comparePasswords(password, hashedPassword);
		if (!isPasswordMatch) {
			console.log("incorrect password");
			return res.sendStatus(404);
		}
	}

	let userJson = { userId: username };

	let accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
	let refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET);
	res.json({ accessToken, refreshToken });
});

///get-user-attrs/:userId
router.get("/:userId/attrs", authMiddleware, async (req, res) => {
	const userId = req.params.userId;
	let userAttrs = await userUtils.getUserAttrs(userId);

	res.json(userAttrs);
});

router.put("/:userId/edit", authMiddleware, async (req, res) => {
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let role = req.body.role;
	let userId = req.body.userId;
	let password = req.body.password;
	let hashedPassword = await userUtils.encryptPassword(password);
	let age = req.body.age.toString();
	let gender = req.body.gender;
	let address = req.body.address;
	let phoneNumber = req.body.phoneNumber;
	let specialization = req.body.specialization;

	// let user = await userUtils.getUserById(username)
	// if(user){
	//     return res.sendStatus(401)
	// }

	if (role === "doctor") {
		await updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber, specialization);
	} else {
		await updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber);
	}

	res.json(req.body);
});

router.get("/:userId/role", authMiddleware, async (req, res) => {
	const userId = req.params.userId;

	let userRole = await userUtils.getUserRole(userId);

	res.json({ userRole: userRole });
});

// get-user-details/:userId
router.get("/:userId/details", authMiddleware, async (req, res) => {
	const userId = req.params.userId;
	// const role = req.params.role;
	let userAttrs = await userUtils.getUserAttrs(userId);

	if (!userAttrs) {
		return res.sendStatus(404);
	}
	const role = userAttrs.find((attr) => attr.name === "role").value;

	let userInfo = {
		userId: userId,
		firstName: userAttrs.find((attr) => attr.name === "firstName").value,
		lastName: userAttrs.find((attr) => attr.name === "lastName").value,
		age: userAttrs.find((attr) => attr.name === "age").value,
		gender: userAttrs.find((attr) => attr.name === "gender").value,
		address: userAttrs.find((attr) => attr.name === "address").value,
		phoneNumber: userAttrs.find((attr) => attr.name === "phoneNumber").value,
	};

	if (role === "doctor") {
		userInfo.specialization = userAttrs.find((attr) => attr.name === "specialization").value;
		// userInfo.push({specialization: userAttrs.find(attr => attr.name === "specialization").value})
	}

	res.json(userInfo);
});

router.post("/refresh-access-token", (req, res) => {
	const { refreshToken } = req.body;
	// if(!refreshTokens.includes(refreshToken)){
	//     return res.sendStatus(403)
	// }
	console.log(refreshToken);
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
		if (err) {
			console.log("error in refresh access token");
			return res.sendStatus(403);
		}

		console.log("no error in refresh access token");

		const userJson = {
			userId: data.userId,
		};
		let newAccessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
		res.json({ accessToken: newAccessToken, refreshToken: refreshToken });
	});
});

router.post("/access-token", (req, res) => {
	const { accessToken } = req.body;

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
		if (err) {
			return res.sendStatus(403); // unauthorized
		}
		req.user = data;
		res.json(accessToken);
	});
});

router.post("/refresh-token", (req, res) => {
	const { refreshToken } = req.body;

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
		if (err) {
			return res.sendStatus(403); // unauthorized
		}
		req.user = data;
		// next()
		res.json(refreshToken);
	});
});

router.get("/csrf-token", (req, res) => {
	 const csrfToken = req.csrfToken()

	 res.json({csrfToken})
})

	
module.exports = router;