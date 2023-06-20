const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');

async function updateUserAttributes(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber, specialization = '') {
  try {
    
    const ccpPath = path.resolve(
        __dirname,
        "..",
        "fabric-samples",
        "test-network",
        "organizations",
        "peerOrganizations",
        "org1.example.com",
        "connection-org1.json"
    );
    
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
    
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    
    const fabricCA = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    
    
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);


    const identity = await wallet.get(userId);
    
    if (!identity) {
        console.log(`An identity for the user ${userId} doesn't exists in the wallet`);
        return;
    }

    let attrs = [{
        name: "role",
        value: role,
        ecert: true

    },{
        name: "firstName",
        value: firstName,
        ecert: true
    },{
        name: "lastName",
        value: lastName,
        ecert: true
    },{
        name: "hashedPassword",
        value: hashedPassword,
        ecert: true
    },{
        name: "age",
        value: age,
        ecert: true
    },{
        name: "gender",
        value: gender,
        ecert: true
    },{
        name: "address",
        value: address,
        ecert: true
    },{
        name: "phoneNumber",
        value: phoneNumber,
        ecert: true
    }

]

if(role === 'doctor'){
    let specializationAttr = {
        name: "specialization",
        value: specialization,
        ecert: true
    }
    attrs.push(specializationAttr)
}   
    const identityService = fabricCA.newIdentityService();

    const adminIdentity = await wallet.get('admin');
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let user = await identityService.getOne(userId, adminUser);

    user.result.attrs = attrs
   
    await identityService.update(userId, user.result, adminUser)

    
    console.log(`Successfully updated attributes for user ${userId}`);
  } catch (error) {
    console.error(`Error updating attributes for user ${userId}: ${error}`);
  }
}

module.exports = updateUserAttributes;