const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

readPatientHistoryData = async function () {
	try {
        patientId = "patient1"
		
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


		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: patientId,
			discovery: { enabled: true, asLocalhost: true },
		});

		const network = await gateway.getNetwork("mychannel");

		const contract = network.getContract("medicalContract");

		let readPatientHistoryData = await contract.evaluateTransaction(
			"test",
			patientId
		);
		
		await gateway.disconnect();
		
		const buffer = Buffer.from(readPatientHistoryData);
        console.log("buffer", buffer)
        const strData = buffer.toString();
		if(!strData){
			return ;
		}
        console.log("strData", strData)
		let readPatientHistoryDataJson = JSON.parse(strData);
        console.log("readPatientHistoryDataJson", readPatientHistoryDataJson)

		return readPatientHistoryDataJson;

	} catch (error) {
		console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
		// process.exit(1);
	}
};

readPatientHistoryData()