const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");




exports.invokeDiagnosis = async function (patientId, medicalData, doctorId) {
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

		await contract.submitTransaction(
			"writePatientMedicalData",
			patientId,
			doctorId,
			JSON.stringify(medicalData),

		);

			

		await gateway.disconnect();
	} catch (error) {
		console.error(`Error in invokeDiagnosis: ${error}`);
		// process.exit(1);
	}

}