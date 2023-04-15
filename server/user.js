const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client'); 
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');


exports.getCaURL = async function () {
    const ccpPath = path.resolve(__dirname, '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    const caURL = ccp.certificateAuthorities['ca.org1.example.com']

    return caURL
}



exports.getUserList = async function () {
    // const ccpPath = path.resolve(__dirname, '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    // let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    // const caURL = ccp.certificateAuthorities['ca.org1.example.com']
    const caURL = await this.getCaURL()

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const adminIdentity = await wallet.get('admin');
    const doctorIdentity = await wallet.get('doctor1');
    
    if (!adminIdentity) {
        console.log(`Admin identity doesn't exists in the wallet `);
        console.log('Run enrollAdmin.js !!!');
        return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin'); //getUserContext(identity, 'doctor1') ale to nie dziala bo doctor1 nie ma permisji
    // const doctorUser= await provider.getUserContext(adminIdentity, 'doctor1')

    const caClient = new FabricCAServices(caURL);
    const identityService = caClient.newIdentityService();
    const identities = await identityService.getAll(adminUser);
    // const identities2 = await identityService.getAll(doctorUser);
    
    // console.log("test identities", identities2.result.identities)
    const userList = identities.result.identities;
    
    return userList
}

exports.getPatientList = async function () {
    const userList = await this.getUserList()

    if(!userList){
        return ;
    }
    const patientList = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "patient"))
    
    return patientList
}

exports.getDoctorList = async function () {
    const userList = await this.getUserList()

    if(!userList){
        return ;
    }
    const doctorList = userList.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))

    return doctorList
}

exports.getUserById = async function (userId) {
    const userList = await this.getUserList()
    
    if(!userList){
        return
    }

    let user = userList.find(user => user.id === userId)
    
    return user
}



exports.getUserRole = async function (userId) {

    const userList = await this.getUserList()
    if(!userList){
        return
    }

    const user = userList.find(user => user.id === userId)
    
    if(!user){
        return
    }
    let userRole
    
    if(user.attrs.find(attr => attr.name === "hf.Registrar.Roles" && (attr.value === "*" || attr.value === 'admin'))){  // if user is admin he has role * or admin
        
        userRole = 'admin'
    } else {
        userRole = user.attrs.find(attr => attr.name === "role")
        userRole = userRole.value
    }
    
    return userRole
}

exports.encryptPassword = async function (password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

exports.comparePasswords = async function (password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

exports.getUserAttrs = async function (userId) {
    const userList = await this.getUserList()

    if(!userList){
        return
    }

    const user = userList.find(user => user.id === userId)
    
    
    if(!user){
        return
    }
    if(!user.attrs){
        return
    }
    return user.attrs
}

exports.getUserHashedPassword = async function (userId) {
    try{
        const userAttrs = await this.getUserAttrs(userId)
        const hashedPassword = userAttrs.find(attr => attr.name === 'hashedPassword')
        
        return hashedPassword.value
        } catch (error) {
        console.error(`Failed to get user hashed password: ${error}`);
        return null;
        }

}



