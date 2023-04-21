const express = require('express')
const router = express.Router()


const {readPatientHistoryData, readPatientMedicalData} = require('../queryDiagnosis')
const {revokeAccess, grantAccess} = require('../invokeDoctorAccessList')
const { authMiddleware } = require('../routes')



// get-patient-list
router.get("/list", authMiddleware, async (req, res) => {
	const patientList = await userUtils.getPatientList();
	let patientListInfo = [];

	if (!patientList) {
		return res.sendStatus(404);
	}

	patientList.forEach((patient, index, array) => {
		// console.log(patient);
		let patientId = patient.id;
		let firstName = patient.attrs.find((attr) => attr.name === "firstName");
		let lastName = patient.attrs.find((attr) => attr.name === "lastName");
		let age = patient.attrs.find((attr) => attr.name === "age");
		let gender = patient.attrs.find((attr) => attr.name === "gender");
		let address = patient.attrs.find((attr) => attr.name === "address");
		let phoneNumber = patient.attrs.find((attr) => attr.name === "phoneNumber");

		let patientInfo = {
			userId: patientId,
			firstName: firstName.value,
			lastName: lastName.value,
			age: age.value,
			gender: gender.value,
			address: address.value,
			phoneNumber: phoneNumber.value,
		};
		patientListInfo.push(patientInfo);
	});

	res.json(patientListInfo);
});

//get-current-medical-data/:patientId/:currentUserId
router.get('/:patientId/medical-data', authMiddleware, async (req, res) => {
    const patientId = req.params.patientId
    const currentUserId = req.params.currentUserId
    console.log("get-current-medical-data")
    console.log(patientId)
    const medicalData = await readPatientMedicalData(currentUserId, patientId)
    
    res.json(medicalData)
})

// get-history-medical-data/:patientId/:currentUserId
router.get('/:patientId/history-medical-data/list', authMiddleware, async (req, res) => {
    const patientId = req.params.patientId
    const currentUserId = req.params.currentUserId
    const medicalHistoryData = await readPatientHistoryData(currentUserId, patientId)
    
    if(!medicalHistoryData){
        return
    }   
    medicalHistoryData.shift() // remove current medical data from history
    res.json(medicalHistoryData)
})

//grant-doctor-access
router.post('/:patientId/grant-access/:doctorId', authMiddleware, async (req, res) => {

    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    const accessExpirationDate = req.body.accessExpirationDate

    let doctorAccessList = await grantAccess(patientId, doctorId, accessExpirationDate)

    res.json(doctorAccessList)
})

//revoke-doctor-access
router.post('/:patientId/revoke-access/:doctorId', authMiddleware, async (req, res) => {

    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    
    let doctorAccessList =  await revokeAccess(patientId, doctorId)

    res.json(doctorAccessList)
})

module.exports = router;