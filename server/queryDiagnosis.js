const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const  crypto  = require('crypto')



function decryptData(encryptedData, iv) {
	const algorithm = 'aes-256-cbc';
	const key = Buffer.from(process.env.SYMMETRIC_KEY, 'hex');
	const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

	let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}

async function readPatientHistoryData(userId, patientId) {
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
		

	
		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		const userIdentity = await wallet.get(userId);
		if (!userIdentity) {
			
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
		let readPatientHistoryDataArray = await contract.evaluateTransaction(
			"readPatientHistoryData",
			patientId
		);
		

		
		const buffer = Buffer.from(readPatientHistoryDataArray);
		
        const strData = buffer.toString();
		if(!strData){
			return ;
		}
		let readPatientHistoryDataJson = JSON.parse(strData);
		
		let encryptedHistoryArray = []
		readPatientHistoryDataJson.forEach(patientData => {
			let encryptedData = patientData.encryptedData
			let iv = patientData.iv
			let decryptedData = decryptData(encryptedData, iv)
			encryptedHistoryArray.push(JSON.parse(decryptedData))
		});

		await gateway.disconnect();
		
		// return readPatientHistoryDataJson;
		return encryptedHistoryArray;

	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
		// process.exit(1);
	}
};


async function readPatientMedicalData(userId, patientId) {
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
		

		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			
			console.log(
				`An identity for the user ${patientId} does not exist in the wallet`
			);
			
			return;
		}

		const userIdentity = await wallet.get(userId);
		if (!userIdentity) {
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
	

		const strData = patientData.toString();
		let patientDataJson = JSON.parse(strData);
	
		let encryptedData = patientDataJson.encryptedData
		let iv = patientDataJson.iv
	
		let decryptedData = decryptData(encryptedData, iv)

	
		await gateway.disconnect();

		return JSON.parse(decryptedData);
		

	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientMedicalData: ${error}`);
		// process.exit(1);
	}
};

module.exports = {readPatientHistoryData, readPatientMedicalData};