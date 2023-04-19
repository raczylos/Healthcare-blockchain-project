const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

exports.readPatientHistoryData = async function (userId, patientId) {
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
		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		
		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);

	
		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		const userIdentity = await wallet.get(userId);
		if (!userIdentity) {
			console.log("readPatientHistoryData")
			console.log(
				`An identity for the user ${userId} does not exist in the wallet`
			);
			
			return;
		}


		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: userId,
			discovery: { enabled: true, asLocalhost: true },
		});

		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");
		;
		let readPatientHistoryData = await contract.evaluateTransaction(
			"readPatientHistoryData",
			patientId
		);
		
		await gateway.disconnect();
		
		const buffer = Buffer.from(readPatientHistoryData);
        const strData = buffer.toString();
		if(!strData){
			return ;
		}
		let readPatientHistoryDataJson = JSON.parse(strData);

		return readPatientHistoryDataJson;

	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
		// process.exit(1);
	}
};


exports.readPatientMedicalData = async function (userId, patientId) {
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
		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`Wallet path: ${walletPath}`);

		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		const userIdentity = await wallet.get(userId);
		if (!userIdentity) {
			console.log("readMedicalData")
			console.log(
				`An identity for the user ${userId} does not exist in the wallet`
			);
			
			return;
		}
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: userIdentity,
			discovery: { enabled: true, asLocalhost: true },
		});

		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");

		const patientData = await contract.evaluateTransaction(
			"readPatientMedicalData",
			patientId
		);
		const buffer = Buffer.from(patientData);
        const strData = buffer.toString();
		if(!strData){
			return ;
		}
		let patientDataJson = JSON.parse(strData);
		
		await gateway.disconnect();

		return patientDataJson;
		

	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientMedicalData: ${error}`);
		// process.exit(1);
	}
};
