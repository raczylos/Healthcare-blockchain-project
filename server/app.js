require('dotenv').config()

const register = require('./register')
const patient = require('./patient')
const database = require('./database')
const user1 = require('./user');
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

app.get('/', (req, res) => {
    console.log("get")
    console.log(req.body)
    res.send('Hello World!')

    
})

app.post('/register-user', authMiddleware, async (req, res) => {
    console.log("registerUser")
    console.log(req.body)
    

    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let role = req.body.role
    let username = req.body.userId
    let password = req.body.password
    let hashedPassword = await user1.encryptPassword(password)
    let age = req.body.age
    let gender = req.body.gender
    let address = req.body.address
    let specialization = req.body.specialization

    let user = await user1.getUserById(username)
    if(user){
        return res.sendStatus(401) // user already exists (i am not sure if it is good status)
    }

    if(role === 'doctor'){
        register.registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address, specialization)
    } else {
        register.registerUser(firstName, lastName, role, username, hashedPassword, age, gender, address)
    }
    

    res.json(req.body)
})

app.post('/login', async (req, res) => {
    console.log("login")
    console.log(req.body)
    
    let username = req.body.username
    let password = req.body.password
    let user = await user1.getUserById(username)
    
    if(!user){
        return res.sendStatus(401) // user doesn't exist
    }
    const userRole = await user1.getUserRole(username)
    
    if(userRole === 'admin'){
        
        // const adminPassword = await user1.getAdminEnrollmentSecret()
        const adminPassword = 'adminpw'
        if(adminPassword !== password){
            console.log('incorrect password')
            return res.sendStatus(401)
        }
    } else {
        const hashedPassword = await user1.getUserHashedPassword(username)
        const isPasswordMatch = await user1.comparePasswords(password, hashedPassword);
        if(!isPasswordMatch){
            console.log('incorrect password')
            return res.sendStatus(401)
        }
        
    }
    
    

    let userJson = {username: username}

    let accessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    let refreshToken = jwt.sign(userJson, process.env.REFRESH_TOKEN_SECRET)
    res.json({accessToken, refreshToken, userJson})
})

app.post('/refresh-access-token', (req, res) => {
    const {refreshToken} = req.body
    // if(!refreshTokens.includes(refreshToken)){
    //     return res.sendStatus(403)
    // }
    console.log("wazneeeeeeeeeeeeeeeeeeeeeeeeeee")
    console.log(refreshToken)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if(err){
            console.log("error in refresh access token")
            return res.sendStatus(403)
        }
        console.log("no error in refresh access token")
        const userJson = {
            username: data.username
        }
        let newAccessToken = jwt.sign(userJson, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        res.json({accessToken: newAccessToken})
    })
})

app.post('/get-access-token', (req, res, next) => {
    const {accessToken} = req.body
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if(err){
            return res.sendStatus(403)  // unauthorized
        }
        req.user = data
        next()
    })
    

})

app.post('/get-refresh-token', (req, res, next) => {
    const {refreshToken} = req.body
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if(err){
            return res.sendStatus(403)  // unauthorized
        }
        req.user = data
        next()
    })
    

})

app.get('/get-user-role/:userId', async (req, res) => {
    const userId = req.params.userId
    
    
    let userRole = await user1.getUserRole(userId)
    
    res.json({userRole: userRole})

})

app.get('/get-patient-list', async (req, res) => {
    const patientList = await user1.getPatientList()
    let patientListInfo = []

    patientList.forEach((patient, index, array) => {
        console.log(patient);
        let patientId = patient.id
        let firstName = patient.attrs.find(attr => attr.name === "firstName")
        let lastName = patient.attrs.find(attr => attr.name === "lastName")
        let age = patient.attrs.find(attr => attr.name === "age")
        let gender = patient.attrs.find(attr => attr.name === "gender")
        let address = patient.attrs.find(attr => attr.name === "address")
        

        let patientInfo = {
            patientId: patientId,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            gender: gender.value,
            address: address.value,

        }
        patientListInfo.push(patientInfo)
    });

    

    res.json(patientListInfo)
})

app.get('/get-doctor-list', async (req, res) => {
    const doctorList = await user1.getDoctorList()
    let doctorListInfo = []

    doctorList.forEach((doctor, index, array) => {
        console.log(patient);
        let doctorId = doctor.id
        let firstName = doctor.attrs.find(attr => attr.name === "firstName")
        let lastName = doctor.attrs.find(attr => attr.name === "lastName")
        let age = doctor.attrs.find(attr => attr.name === "age")
        let gender = doctor.attrs.find(attr => attr.name === "gender")
        let address = doctor.attrs.find(attr => attr.name === "address")
        let specialization = doctor.attrs.find(attr => attr.name === "specialization")

        let doctorInfo = {
            doctorId: doctorId,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            gender: gender.value,
            address: address.value,
            specialization: specialization.value

        }
        doctorListInfo.push(doctorInfo)
    });

    

    res.json(doctorListInfo)
})

app.delete('/logout', (req, res) => {
    const {refreshToken} = req.body
    // refreshToken = refreshTokens.filter(token => token !== refreshToken)
    res.sendStatus(204)

})

let port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


