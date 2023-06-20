const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client'); // add manually
const fs = require('fs');
const path = require('path');
const { crypto } = require('crypto')
const user = require('./user');




exports.getPatientList = async function () {

    let userList = await user.getUserList()

    let patientList = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "patient"))
    // let doctorList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))
   
    return patientList
}   

