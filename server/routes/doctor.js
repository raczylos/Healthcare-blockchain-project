const express = require('express')
const router = express.Router()
const userUtils = require('../user');
// const { authMiddleware } = require('../routes')
const invokeDiagnosis = require('../invokeDiagnosis')
const getDoctorAccessList = require('../queryDoctorAccessList')
const jwt = require('jsonwebtoken');

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

//get-doctor-list
router.get("/list", authMiddleware, async (req, res) => {
	const doctorList = await userUtils.getDoctorList();
	let doctorListInfo = [];

	doctorList.forEach((doctor, index, array) => {
		// console.log(doctor);
		let doctorId = doctor.id;
		let firstName = doctor.attrs.find((attr) => attr.name === "firstName");
		let lastName = doctor.attrs.find((attr) => attr.name === "lastName");
		let age = doctor.attrs.find((attr) => attr.name === "age");
		let gender = doctor.attrs.find((attr) => attr.name === "gender");
		let address = doctor.attrs.find((attr) => attr.name === "address");
		let phoneNumber = doctor.attrs.find((attr) => attr.name === "phoneNumber");
		let specialization = doctor.attrs.find((attr) => attr.name === "specialization");

		let doctorInfo = {
			userId: doctorId,
			firstName: firstName.value,
			lastName: lastName.value,
			age: age.value,
			gender: gender.value,
			address: address.value,
			phoneNumber: phoneNumber.value,
			specialization: specialization.value,
		};
		doctorListInfo.push(doctorInfo);
	});

	res.json(doctorListInfo);
});


router.post("/:doctorId/medical-data", authMiddleware, async (req, res) => {
	const patientId = req.body.patientId;
	const medicalData = req.body.medicalData;
	const accessList = req.body.accessList;
	const doctorId = req.params.doctorId;
	
	// if(!accessList){
	//     res.sendStatus(403)
	//     return
	// }

	// if(accessList.find(patient => patient !== patientId)){
	//     res.sendStatus(403)
	//     return
	// }

	await invokeDiagnosis(patientId, medicalData, doctorId);

	res.json(medicalData);
});

router.get('/:doctorId/access-list', authMiddleware, async (req, res) => {
    const doctorId = req.params.doctorId
    const doctorAccessList = await getDoctorAccessList(doctorId)
    console.log(doctorId)
	console.log(doctorAccessList)
    if(!doctorAccessList){ // if undefined doctor doesn't have any access
        let list = []
        res.json(list)
    } else {
        res.json(doctorAccessList)
    }
    
})

module.exports = router;