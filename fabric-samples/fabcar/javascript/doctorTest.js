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

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

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

        const idService = ca.newIdentityService();
        const userList = await idService.getAll(adminUser);

        const identities = userList.result.identities;
        // console.log(identities[2])
        // console.log(identities[4])



        let result = await contract.evaluateTransaction('readPatientData', "patient1");
        result = result.toString('utf-8') // convert buffer to string
        console.log(JSON.parse(result))


        let result2 = await contract.evaluateTransaction('lala');
        console.log(JSON.parse(result2))
        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')

        // await contract.submitTransaction("writePatientData", key1, JSON.stringify(patient1));
        // await contract.submitTransaction("writePatientData", key1, JSON.stringify(patient6));
        // await contract.submitTransaction("writePatientData", key2, JSON.stringify(patient2));
        // await contract.submitTransaction("writePatientData", key3, JSON.stringify(patient3));
        // await contract.submitTransaction("writePatientData", key4, JSON.stringify(patient4));
        // await contract.submitTransaction("writePatientData", key5, JSON.stringify(patient5));



        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();
        // return

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
