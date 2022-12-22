const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client'); // add manually
const fs = require('fs');
const path = require('path');
const { crypto } = require('crypto')
const user = require('./user');


// exports.getPatientList = async function () {

//     const ccpPath = path.resolve(__dirname, '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//     let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
//     const caURL = ccp.certificateAuthorities['ca.org1.example.com']

//     const walletPath = path.join(process.cwd(), 'wallet');
//     const wallet = await Wallets.newFileSystemWallet(walletPath);

//     const adminIdentity = await wallet.get('admin');
//     const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//     const adminUser = await provider.getUserContext(adminIdentity, 'admin'); //getUserContext(identity, 'doctor1') ale to nie dziala bo doctor1 nie ma permisji

//     const ca = new FabricCAServices(caURL);
//     const identityService = ca.newIdentityService();
//     const userList = await identityService.getAll(adminUser);

//     const identities = userList.result.identities;
//         // console.log(identities.find(user => user.id === 'patient1'))
//         // console.log(identities.find(user => user.id === 'doctor1'))

//     let patientList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "patient"))
//     // let doctorList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))
   
//     return patientList
// }   

exports.getPatientList = async function () {

    let userList = await user.getUserList()

    let patientList = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "patient"))
    // let doctorList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))
   
    return patientList
}   

