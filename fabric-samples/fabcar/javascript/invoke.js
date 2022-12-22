/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        let patientId = "patient1"


        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);


        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(patientId);
        if (!identity) {
            console.log(`An identity for the patient ${patientId} does not exist in the wallet`);
            console.log('Run the registerPatient.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: patientId, discovery: { enabled: true, asLocalhost: true } });
        

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        // const contract = network.getContract('fabcar');
        const contract = network.getContract('adminContract');


        // let key1 = "patient1"
        // let patient1 = {
        //     "firstName": "Jan",
        //     "lastName": "Nowak",
        //     "diagnosis": "cancer",
        //     "age": 18
        // }

        // let key6 = "patient6"
        // let patient6 = {
        //     "firstName": "first name",
        //     "lastName": "last name",
        //     "diagnosis": "cancer",
        //     "age": 25
        // }

        // let key2 = "patient2"
        // let patient2 = {
        //     "firstName": "Paweł",
        //     "lastName": "Nowak",
        //     "diagnosis": "cancer",
        //     "age": 75
        // }

        // let key3 = "patient3"
        // let patient3 = {
        //     "firstName": "Paweł",
        //     "lastName": "Nowak",
        //     "diagnosis": "cancer",
        //     "age": 56
        // }

        // let key4 = "patient4"
        // let patient4 = {
        //     "firstName": "Paweł",
        //     "lastName": "Nowak",
        //     "diagnosis": "cancer2",
        //     "age": 12
        // }

        // let key5 = "patient5"
        // let patient5 = {
        //     "firstName": "Jan",
        //     "lastName": "Nowak",
        //     "diagnosis": "cancer2",
        //     "age": 18
        // }

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')



        // await contract.submitTransaction("writePatientData", key1, JSON.stringify(patient1));
        // await contract.submitTransaction("writePatientData", key1, JSON.stringify(patient6));
        // await contract.submitTransaction("writePatientData", key2, JSON.stringify(patient2));
        // await contract.submitTransaction("writePatientData", key3, JSON.stringify(patient3));
        // await contract.submitTransaction("writePatientData", key4, JSON.stringify(patient4));
        // await contract.submitTransaction("writePatientData", key5, JSON.stringify(patient5));

        // INIT BASIC PATIENT DATA BY ADMIN, then doctor can add medic data

        let patientData = {
            "firstName": "Jan",
            "lastName": "Nowak",
            "diagnosis": "cancer2",
            "age": 18
        }

        await contract.submitTransaction("writePatientData", patientId, JSON.stringify(patientData));

        console.log('Transaction has been submitted.');

        // Disconnect from the gateway.
        await gateway.disconnect();
        // return

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
