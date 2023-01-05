const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

// exports.queryDiagnosis = async function (patientId) {
// 	try {
// 		// load the network configuration
// 		const ccpPath = path.resolve(
// 			__dirname,
// 			"..",
// 			"fabric-samples",
// 			"test-network",
// 			"organizations",
// 			"peerOrganizations",
// 			"org1.example.com",
// 			"connection-org1.json"
// 		);
// 		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

// 		// Create a new file system based wallet for managing identities.
// 		const walletPath = path.join(process.cwd(), "wallet");
// 		const wallet = await Wallets.newFileSystemWallet(walletPath);
// 		console.log(`Wallet path: ${walletPath}`);

// 		// Check to see if we've already enrolled the user.
// 		const identity = await wallet.get(patientId);
// 		if (!identity) {
// 			console.log("queryDiagnosis")
// 			console.log(
// 				`An identity for the user ${patientId} does not exist in the wallet`
// 			);
// 			console.log("Run the registerUser.js application before retrying");
// 			return;
// 		}

// 		// Create a new gateway for connecting to our peer node.
// 		const gateway = new Gateway();
// 		await gateway.connect(ccp, {
// 			wallet,
// 			identity: patientId,
// 			discovery: { enabled: true, asLocalhost: true },
// 		});

// 		// Get the network (channel) our contract is deployed to.
// 		const network = await gateway.getNetwork("mychannel");

// 		// Get the contract from the network.
// 		// const contract = network.getContract('fabcar');
// 		const contract = network.getContract("adminContract");

// 		// Evaluate the specified transaction.

// 		// const result = await contract.evaluateTransaction('readData', "key1");
// 		let result = await contract.evaluateTransaction(
// 			"queryPatientsByDiagnosis",
// 			"cancer2"
// 		);
// 		// result = result.toString('utf-8') // convert buffer to string
// 		console.log(`Transaction has been evaluated, result is: ${result}`);
// 		let readPatientHistoryData = await contract.evaluateTransaction(
// 			"readPatientHistoryData",
// 			patientId
// 		);
// 		// result2 = result2.toString('utf-8') // convert buffer to string
// 		console.log(`patient history data: ${readPatientHistoryData}`);
// 		// Disconnect from the gateway.
// 		await gateway.disconnect();

// 	} catch (error) {
// 		console.error(`Failed to evaluate transaction: ${error}`);
// 		process.exit(1);
// 	}
// };

exports.readPatientHistoryData = async function (patientId) {
	try {
		// load the network configuration
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
		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		// Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);

		// Check to see if we've already enrolled the user.
		const identity = await wallet.get(patientId);
		if (!identity) {
			console.log("readPatientHistoryData")
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		// Create a new gateway for connecting to our peer node.
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: patientId,
			discovery: { enabled: true, asLocalhost: true },
		});

		// Get the network (channel) our contract is deployed to.
		const network = await gateway.getNetwork("mychannel");

		// Get the contract from the network.
		// const contract = network.getContract('fabcar');
		const contract = network.getContract("adminContract");

		
		let readPatientHistoryData = await contract.evaluateTransaction(
			"readPatientHistoryData",
			patientId
		);
		
		// console.log(`patient history data: ${readPatientHistoryData}`);
		// Disconnect from the gateway.
		await gateway.disconnect();

		//buffer to json
		const buffer = Buffer.from(readPatientHistoryData);
        const strData = buffer.toString();
		let readPatientHistoryDataJson = JSON.parse(strData);
		//

		return readPatientHistoryDataJson;
	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
		// process.exit(1);
	}
};

exports.readPatientMedicalData = async function (patientId) {
	try {
		// load the network configuration
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
		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		// Create a new file system based wallet for managing identities.
		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);

		// Check to see if we've already enrolled the user.
		const identity = await wallet.get(patientId);
		if (!identity) {
			console.log("readPatientMedicalData")
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		// Create a new gateway for connecting to our peer node.
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: patientId,
			discovery: { enabled: true, asLocalhost: true },
		});

		// Get the network (channel) our contract is deployed to.
		const network = await gateway.getNetwork("mychannel");

		// Get the contract from the network.
		// const contract = network.getContract('fabcar');
		const contract = network.getContract("adminContract");

		const patientData = await contract.evaluateTransaction(
			"readPatientData",
			patientId
		);

		
		
		const buffer = Buffer.from(patientData);
        const strData = buffer.toString();
		let patientDataJson = JSON.parse(strData);

		// console.log(`patient data: ${patientData}`);
		// Disconnect from the gateway.
		await gateway.disconnect();

		return patientDataJson;
	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientMedicalData: ${error}`);
		// process.exit(1);
	}
};
