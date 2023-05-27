/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client'); // add manually
const fs = require('fs');
const path = require('path');
const { crypto } = require('crypto')

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..','fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        let doctorId = "doctor1"
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(doctorId);
        if (!identity) {
            console.log(`An identity for the user ${doctorId} does not exist in the wallet`);
            console.log('Run the registerDoctor.js application before retrying');
            return;
        }
        
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: doctorId, discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        // const contract = network.getContract('fabcar');
        const contract = network.getContract('adminContract');

       

        let users = gateway.identityContext.user
        
        //przyda sie
        const caURL = ccp.certificateAuthorities['ca.org1.example.com']
        const ca = new FabricCAServices(caURL);
        
        const adminIdentity = await wallet.get('admin');
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin'); //getUserContext(identity, 'doctor1') ale to nie dziala bo doctor1 nie ma permisji

        const identityService = ca.newIdentityService();
        const userList = await identityService.getAll(adminUser);

        const identities = userList.result.identities;
        // console.log(identities.find(user => user.id === 'patient1'))
        // console.log(identities.find(user => user.id === 'doctor1'))
        
        let patientList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "patient"))
        let doctorList = identities.filter(user => user.attrs.find(attr => attr.name === "role" && attr.value === "doctor"))

        // console.log("patient LIST")
        // console.log(patientList)
        
        // console.log(identities[4])
        // console.log(identities[5])


        
        
        


        // let result2 = await contract.evaluateTransaction('lala'); //not working dont know why
        // console.log(JSON.parse(result2))
      

        // const users1 = await network.getChannel().getEndorsers()
        // console.log("STOP")
        // console.log(users1)


        //CRYPTO !!!

        const identityPatient = await wallet.get("patient1");
        const identityDoctor = await wallet.get("doctor1");

        let patient1Identity = await wallet.get('patient1');
        let provider1 = wallet.getProviderRegistry().getProvider(patient1Identity.type)

        let doctor1Identity = await wallet.get('doctor1');
        let provider2 = wallet.getProviderRegistry().getProvider(doctor1Identity.type)


        let patientUser = await provider1.getUserContext(identityPatient, 'patient1')

        let doctorUser = await provider2.getUserContext(identityDoctor, 'doctor1')
        // console.log(patientUser.getSigningIdentity())
        // console.log(patientUser.getSigningIdentity()._publicKey._key.pubKeyHex) // public key in hex form

        let patientPublicKeyHex = patientUser.getSigningIdentity()._publicKey._key.pubKeyHex // public key in hex form

        const publicKeyBytes = Buffer.from(patientPublicKeyHex, 'hex')

        const patientPublicKey = publicKeyBytes.toString('base64') 

        // console.log(patientPublicKey) 

        const patientPrivateKey = identityPatient.credentials.privateKey
        const doctorPrivateKey = identityDoctor.credentials.privateKey
        
        // console.log(patientUser.getIdentity()._publicKey._key.pubKeyHex)

        // console.log(patientPrivateKey)

        let patientPublicKeyHexAlternative = patientUser.getIdentity()._publicKey._key.pubKeyHex // inny sposob odczytu public key

        let doctorPublicKeyHexAlternative = doctorUser.getIdentity()._publicKey._key.pubKeyHex

        console.log("public key patient", patientPublicKeyHexAlternative) // chyba najlepszy sposob
        console.log("patientPrivateKey", patientPrivateKey)

        console.log("public key doctor", doctorPublicKeyHexAlternative) // chyba najlepszy sposob
        console.log("doctorPrivateKey", doctorPrivateKey)


        console.log(patient1Identity.credentials.certificate)

        // const publicKeyBytes1 = Buffer.from(patientPublicKey, 'base64')
        // const patientPublicKey1 = publicKeyBytes1.toString('hex') 
        

        // console.log(patientPublicKey1 === patientPublicKeyHex ? true : false) 
        // console.log(patientPublicKeyHex)
        // console.log(patientPublicKey1)


        let patientData = {
            "diagnosis": "cancer",
            "age": 18
        }

        // console.log(identities[5])
        // const encrypted = crypto.privateEncrypt(privateKey, Buffer.from(JSON.stringify(patientData)))

        // console.log(encrypted)

        // await contract.submitTransaction("writePatientData", "patient1", patientData);

        
        // let result = await contract.evaluateTransaction('readPatientData', "patient1");
        // result = result.toString('utf-8') // convert buffer to string
        // console.log(JSON.parse(result))
        // console.log(userList.result)
        // console.log('Transaction has been submitted');
        // Disconnect from the gateway.


        await gateway.disconnect();
        // return
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
