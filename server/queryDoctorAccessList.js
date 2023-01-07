const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

exports.getDoctorAccessList = async function (doctorId) {
	try {
		console.log("getDoctorAccessList")
		console.log(doctorId)
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
		const identity = await wallet.get(doctorId);
		if (!identity) {
			console.log("getDoctorAccessList")
			console.log(
				`An identity for the user ${doctorId} does not exist in the wallet`
			);
			
			return;
		}

		// Create a new gateway for connecting to our peer node.
		const gateway = new Gateway();
		await gateway.connect(ccp, {
			wallet,
			identity: doctorId,
			discovery: { enabled: true, asLocalhost: true },
		});

		// Get the network (channel) our contract is deployed to.
		const network = await gateway.getNetwork("mychannel");

		// Get the contract from the network.
		// const contract = network.getContract('fabcar');
		// const contract = network.getContract("adminContract");
		const contract = network.getContract("medicalContract");
		
		const doctorAccessList = await contract.evaluateTransaction(
			"readData",
			doctorId
		);

		const buffer = Buffer.from(doctorAccessList);
		const strData = buffer.toString();
		const doctorAccessListJson = JSON.parse(strData);
		
		
		// Disconnect from the gateway.
		await gateway.disconnect();

		return doctorAccessListJson

	} catch (error) {
		console.error(`Failed to evaluate transaction in getDoctorAccessList: ${error}`);
		// process.exit(1);
	}
};
