const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");
const  crypto  = require('crypto')

const dotenv = require('dotenv')
dotenv.config();

function encryptData(message) {
	const algorithm = 'aes-256-cbc';
	const key = Buffer.from(process.env.SYMMETRIC_KEY, 'hex');
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encrypted = cipher.update(message, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	let jsonData = {
		iv: iv.toString('hex'),
		encryptedData: encrypted
	}
	return jsonData
}



async function invokeDiagnosis(patientId, medicalData, doctorId) {
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
		let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);

		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			console.log(
				`An identity for the patient ${patientId} does not exist in the wallet`
			);
			return;
		}

		const doctorIdentity = await wallet.get(doctorId);

		if (!doctorIdentity) {
			console.log(
				`An identity for the doctor ${doctorId} does not exist in the wallet`
			);
			return;
		}

		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: doctorId,
			discovery: { enabled: true, asLocalhost: true },
		});


		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");

		const encryptedMedicalData = encryptData(JSON.stringify(medicalData));

	
		await contract.submitTransaction(
			"writePatientMedicalData",
			patientId,
			doctorId,
			JSON.stringify(encryptedMedicalData),

		);
		
	
		
		
			

		await gateway.disconnect();
	} catch (error) {
		console.error(`Error in invokeDiagnosis: ${error}`);
		// process.exit(1);
	}

}

module.exports = invokeDiagnosis;