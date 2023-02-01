require('dotenv').config()

const register = require('./register')
const diagnosis = require('./invokeDiagnosis')
const queryDiagnosis = require('./queryDiagnosis')
const queryDoctorAccessList = require('./queryDoctorAccessList')
const invokeDoctorAccessList = require('./invokeDoctorAccessList')
// const patient = require('./patient')
const editUser = require('./editUser')
const userUtils = require('./user');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const { use } = require('express/lib/application');
const req = require('express/lib/request')
const app = express()

app.use(cors())
app.use(bodyParser.json())




app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const authMiddleware = (req, res, next) => {
    
    const token = req.headers['authorization']?.split(' ')[1]
    if(!token){
        return res.sendStatus(401) // unauthorized
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            return res.sendStatus(403)  // forbidden
        }
        req.user = data
        next()
    })
}


app.post('/register-user', authMiddleware, async (req, res) => {
    console.log("registerUser")
    console.log(req.body)
    

    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let role = req.body.role
    let username = req.body.userId
    let password = req.body.password
    let hashedPassword = await userUtils.encryptPassword(password)
    let age = (req.body.age).toString()
    let gender = req.body.gender
    let address = req.body.address
    let phoneNumber = req.body.phoneNumber
    let specialization = req.body.specialization

    let user = await userUtils.getUserById(username)
    if(user){
        return res.sendStatus(401) 
    }

    if(role === 'doctor'){
        register.registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, phoneNumber, specialization)
    } else {
        register.registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, phoneNumber)
    }
    

    res.json(req.body)
})

// app.get('/get-user/:userId', async (req, res) => {
//     const userId = req.params.userId
//     let user = await userUtils.getUserById(userId)
//     res.json(user)
// })

app.get('/get-user-attrs/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId
    let userAttrs = await userUtils.getUserAttrs(userId)

    res.json(userAttrs)
})

app.post('/login', async (req, res) => {
    console.log("login")
    console.log(req.body)
    
    let username = req.body.username
    let password = req.body.password
    let user = await userUtils.getUserById(username)
    
    if(!user){

        return res.sendStatus(404) // user doesn't exist
    }
    const userRole = await userUtils.getUserRole(username)
    
    if(userRole === 'admin'){
        
        // const adminPassword = await userUtils.getAdminEnrollmentSecret()
        const adminPassword = 'adminpw'
        if(adminPassword !== password){
            console.log('incorrect password')
            return res.sendStatus(404)
        }
    } else {
        const hashedPassword = await userUtils.getUserHashedPassword(username)
        const isPasswordMatch = await userUtils.comparePasswords(password, hashedPassword);
        if(!isPasswordMatch){
            console.log('incorrect password')
            return res.sendStatus(404)
        }
        
    }

    let userJson = {userId: username}

    let accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
    let refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET)
    res.json({accessToken, refreshToken})
})

app.post('/refresh-access-token', (req, res) => {
    const {refreshToken} = req.body
    // if(!refreshTokens.includes(refreshToken)){
    //     return res.sendStatus(403)
    // }
    console.log(refreshToken)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if(err){
            console.log("error in refresh access token")
            return res.sendStatus(403)
        }
        
        console.log("no error in refresh access token")
      
        const userJson = {
            userId: data.userId
        }
        let newAccessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
        res.json({accessToken: newAccessToken, refreshToken: refreshToken})
    })
})

app.post('/get-access-token', (req, res) => {
    const {accessToken} = req.body
    
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            return res.sendStatus(403)  // unauthorized
        }
        req.user = data
        res.json(accessToken)
    })
    

})



app.post('/get-refresh-token', (req, res) => {
    const {refreshToken} = req.body
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if(err){
            
            return res.sendStatus(403)  // unauthorized
        }
        req.user = data
        // next()
        res.json(refreshToken)
        
    })
    

})

app.put('/edit-user', authMiddleware, async (req, res) => {
   
    
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let role = req.body.role
    let userId = req.body.userId
    let password = req.body.password
    let hashedPassword = await userUtils.encryptPassword(password)
    let age = (req.body.age).toString()
    let gender = req.body.gender
    let address = req.body.address
    let phoneNumber = req.body.phoneNumber
    let specialization = req.body.specialization

    // let user = await userUtils.getUserById(username)
    // if(user){
    //     return res.sendStatus(401) 
    // }

    if(role === 'doctor'){
        editUser.updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber, specialization)
    } else {
        editUser.updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, phoneNumber, address)
    }
    
    
    res.json(req.body)

})

app.get('/get-user-role/:userId', authMiddleware, async (req, res) => {
    
    const userId = req.params.userId
    
    let userRole = await userUtils.getUserRole(userId)
    
    res.json({userRole: userRole})

})

app.get('/get-patient-list', authMiddleware,  async (req, res) => {
    const patientList = await userUtils.getPatientList()
    let patientListInfo = []
    if(!patientList){
        return res.sendStatus(404)
    }
    patientList.forEach((patient, index, array) => {
        // console.log(patient);
        let patientId = patient.id
        let firstName = patient.attrs.find(attr => attr.name === "firstName")
        let lastName = patient.attrs.find(attr => attr.name === "lastName")
        let age = patient.attrs.find(attr => attr.name === "age")
        let gender = patient.attrs.find(attr => attr.name === "gender")
        let address = patient.attrs.find(attr => attr.name === "address")
        let phoneNumber = patient.attrs.find(attr => attr.name === "phoneNumber")
        

        let patientInfo = {
            userId: patientId,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            gender: gender.value,
            address: address.value,
            phoneNumber: phoneNumber.value

        }
        patientListInfo.push(patientInfo)
    });

    

    res.json(patientListInfo)
})

app.get('/get-doctor-list', authMiddleware,  async (req, res) => {
    const doctorList = await userUtils.getDoctorList()
    let doctorListInfo = []

    doctorList.forEach((doctor, index, array) => {
        // console.log(doctor);
        let doctorId = doctor.id
        let firstName = doctor.attrs.find(attr => attr.name === "firstName")
        let lastName = doctor.attrs.find(attr => attr.name === "lastName")
        let age = doctor.attrs.find(attr => attr.name === "age")
        let gender = doctor.attrs.find(attr => attr.name === "gender")
        let address = doctor.attrs.find(attr => attr.name === "address")
        let phoneNumber = doctor.attrs.find(attr => attr.name === "phoneNumber")
        let specialization = doctor.attrs.find(attr => attr.name === "specialization")

        let doctorInfo = {
            userId: doctorId,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            gender: gender.value,
            address: address.value,
            phoneNumber: phoneNumber.value,
            specialization: specialization.value

        }
        doctorListInfo.push(doctorInfo)
    });

    

    res.json(doctorListInfo)
})

app.get('/get-user-details/:userId/:role', authMiddleware, async (req, res) => {
    const userId = req.params.userId
    const role = req.params.role
    let userAttrs = await userUtils.getUserAttrs(userId)
    
    if(!userAttrs){
        return res.sendStatus(404)
    }
    let userInfo = {
        userId: userId,
        firstName: userAttrs.find(attr => attr.name === "firstName").value,
        lastName: userAttrs.find(attr => attr.name === "lastName").value,
        age: userAttrs.find(attr => attr.name === "age").value,
        gender: userAttrs.find(attr => attr.name === "gender").value,
        address: userAttrs.find(attr => attr.name === "address").value,
        phoneNumber: userAttrs.find(attr => attr.name === "phoneNumber").value,
    }
    
    if(role === "doctor"){
        userInfo.specialization = userAttrs.find(attr => attr.name === "specialization").value
        // userInfo.push({specialization: userAttrs.find(attr => attr.name === "specialization").value})
    }

    

    res.json(userInfo)
})

app.post('/post-patient-medical-data', authMiddleware, async (req, res) => {
    
    const patientId = req.body.patientId
    const medicalData = req.body.medicalData
    const accessList = req.body.accessList
    const doctorId = req.body.doctorId

    if(!accessList){
        res.sendStatus(403)
        return
    }
    
    if(accessList.find(patient => patient !== patientId)){
        res.sendStatus(403)
        return
    }
    
    await diagnosis.invokeDiagnosis(patientId, medicalData, doctorId)
   
    res.json(medicalData)
})

app.get('/get-current-medical-data/:patientId/:currentUserId', authMiddleware, async (req, res) => {
    const patientId = req.params.patientId
    const currentUserId = req.params.currentUserId
    console.log("get-current-medical-data")
    console.log(patientId)
    const medicalData = await queryDiagnosis.readPatientMedicalData(currentUserId, patientId)
    
    res.json(medicalData)
})

app.get('/get-history-medical-data/:patientId/:currentUserId', authMiddleware, async (req, res) => {
    const patientId = req.params.patientId
    const currentUserId = req.params.currentUserId
    const medicalHistoryData = await queryDiagnosis.readPatientHistoryData(currentUserId, patientId)
    
    if(!medicalHistoryData){
        return
    }   
    medicalHistoryData.shift() // remove current medical data from history
    res.json(medicalHistoryData)
})

app.get('/get-doctor-access-list/:doctorId', authMiddleware, async (req, res) => {
    const doctorId = req.params.doctorId
    const doctorAccessList = await queryDoctorAccessList.getDoctorAccessList(doctorId)
    
    if(!doctorAccessList){ // if undefined doctor doesn't have any access
        let list = []
        res.json(list)
    } else {
        res.json(doctorAccessList)
    }
    
})


app.post('/grant-doctor-access', authMiddleware, async (req, res) => {

    const patientId = req.body.patientId
    const doctorId = req.body.doctorId

    let doctorAccessList = await invokeDoctorAccessList.postGrantAccess(patientId, doctorId)

    res.json(doctorAccessList)
})


app.post('/revoke-doctor-access', authMiddleware, async (req, res) => {

    const patientId = req.body.patientId
    const doctorId = req.body.doctorId
    
    let doctorAccessList =  await invokeDoctorAccessList.postRevokeAccess(patientId, doctorId)

    res.json(doctorAccessList)
})



// app.delete('/logout', (req, res) => {
//     const {refreshToken} = req.body
//     // refreshToken = refreshTokens.filter(token => token !== refreshToken)
//     res.sendStatus(204)

// })

let port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


