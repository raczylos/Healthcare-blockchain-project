const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function revokeAccess(patientId, doctorId) {
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
		let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		
		const doctorIdentity = await wallet.get(doctorId);
		if (!doctorIdentity) {
			console.log(
				`An identity for the doctor ${doctorId} does not exist in the wallet`
			);
			return;
		}

		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			console.log(
				`An identity for the patient ${patientId} does not exist in the wallet`
			);
			return;
		}

		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: patientId,
			discovery: { enabled: true, asLocalhost: true },
		});

		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");

		await contract.submitTransaction(
			"revokeAccess",
			patientId,
			doctorId,
		);

	
		await gateway.disconnect();
		
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
		// process.exit(1);
	}
};

async function grantAccess(patientId, doctorId, accessExpirationDate) {
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
		let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

		const walletPath = path.join(process.cwd(), "wallet");
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		
		const doctorIdentity = await wallet.get(doctorId);
		if (!doctorIdentity) {
			console.log(
				`An identity for the doctor ${doctorId} does not exist in the wallet`
			);
			return `An identity for the doctor ${doctorId} does not exist in the wallet`;
		}

		const patientIdentity = await wallet.get(patientId);
		if (!patientIdentity) {
			console.log(
				`An identity for the patient ${patientId} does not exist in the wallet`
			);
			return `An identity for the patient ${patientId} does not exist in the wallet`;
		}

		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: patientId,
			discovery: { enabled: true, asLocalhost: true },
		});

		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");

		
		await contract.submitTransaction(
			"grantAccess",
			patientId,
			doctorId,
			accessExpirationDate
		);
		
		
		console.log("Transaction has been submitted.");

		// Disconnect from the gateway.
		await gateway.disconnect();
		// return
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
		// process.exit(1);
	}
};

module.exports = {revokeAccess, grantAccess};