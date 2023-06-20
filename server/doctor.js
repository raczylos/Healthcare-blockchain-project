const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client'); // add manually
const fs = require('fs');
const path = require('path');
const { crypto } = require('crypto')
const user = require('./user')


exports.getUserListByRole = async function (role) {

    const ccpPath = path.resolve(__dirname, '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const caURL = ccp.certificateAuthorities['ca.org1.example.com']

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin'); 

    const ca = new FabricCAServices(caURL);
    const identityService = ca.newIdentityService();
    const identities = await identityService.getAll(adminUser);

    const userList = identities.result.identities;
        // console.log(userList.find(user => user.id === 'patient1'))
        // console.log(userList.find(user => user.id === 'doctor1'))

    let userListByRole = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === role))
    
   
    return userListByRole

}



exports.getDoctorList = async function () {

    let userList = await user.getUserList()

    let doctorList = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))
    
   
    return doctorList
}   

// exports.getDoctor = async function (doctorId) {


// }