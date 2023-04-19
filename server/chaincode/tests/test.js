// const { expect } = require("chai");
// const { Gateway, Wallets } = require("fabric-network");
// const fs = require("fs");
// const path = require("path");
// const sinon = require("sinon");

// const chaincodeName = "medicalContract";
// const functionName = "writePatientMedicalData";

// describe("MedicalContract", () => {
// 	let gateway;
// 	let network;
// 	let contract;

// 	before(async () => {
// 		const ccpPath = path.resolve(__dirname, "..", "..", "fabric-samples", "test-network", "organizations", "peerOrganizations", "org1.example.com", "connection-org1.json");
// 		const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

// 		const walletPath = path.join(process.cwd(), "wallet");
// 		const wallet = await Wallets.newFileSystemWallet(walletPath);

// 		gateway = new Gateway();
// 		await gateway.connect(ccp, {
// 			wallet,
// 			identity: "doctor1",
// 			discovery: { enabled: true, asLocalhost: true },
// 		});

// 		network = await gateway.getNetwork("mychannel");
// 		contract = network.getContract(chaincodeName);
// 	});

// 	after(async () => {
// 		await gateway.disconnect();
// 	});

// 	describe(`#${functionName}`, () => {
// 		let ctxStub;

// 		beforeEach(() => {
// 			ctxStub = sinon.stub();

// 			const clientIdentityStub = sinon.stub();
// 			clientIdentityStub.getAttributeValue = sinon.stub();
// 			clientIdentityStub.getAttributeValue.withArgs("role").returns("doctor");
// 			clientIdentityStub.getID = sinon.stub();
// 			clientIdentityStub.getID.returns("id::doctor1");

// 			ctxStub.clientIdentity = clientIdentityStub;

// 			// const getStateStub = sinon.stub().resolves(Buffer.from(JSON.stringify([{ clientId: "patient1" }])));
// 			// const putStateStub = sinon.stub().resolves();
// 			// ctxStub.stub = { getState: getStateStub, putState: putStateStub };
// 			const putStateStub = sinon.stub().resolves();
// 			ctxStub.stub = { getState: sinon.stub(), putState: putStateStub };
// 		});

// 		it("should write medical data when doctor has access to the patient", async () => {
// 			const patientId = "patient1";
// 			const doctorId = "doctor1";
// 			const medicalData = { testResults: ["test11", "test22"] };

// 			const result = await contract.submitTransaction(functionName, patientId, doctorId, JSON.stringify(medicalData));

// 			bufferJson = JSON.parse(result).data
// 			decodedJson = JSON.parse(Buffer.from(bufferJson).toString())

// 			console.log("decodedJson", decodedJson);

// 			console.log("medicalData", medicalData)

// 			expect(decodedJson).to.deep.equal(medicalData);
// 			// expect(JSON.stringify(decodedJson)).to.equal(JSON.stringify(medicalData));
// 		});

// 		it("should return an error message when doctor does not have access to the patient", async () => {
// 			const patientId = "patient2";
// 			const doctorId = "doctor2";
// 			const medicalData = { testResults: ["test1", "test2"] };

// 			const result = await contract.submitTransaction(functionName, patientId, doctorId, JSON.stringify(medicalData));

// 			expect(result.toString()).to.equal(JSON.stringify({ error: `doctor: ${doctorId} doesn't have access to patient ${patientId}` }));
// 		});
// 	});
// });

//// 2 TEST

// import { expect } from "chai";
// import { ChaincodeMockStub } from '@theledger/fabric-mock-stub';

// import { MyChaincode } from '../chaincode/lib/medicalContract';

// import { expect } from "chai";
// import { ChaincodeMockStub, Transform } from "@theledger/fabric-mock-stub";
// import medicalContract from "../chaincode/lib/medicalContract.js"

// const { expect } = require("chai");
// const { ChaincodeMockStub } = require("@theledger/fabric-mock-stub");
// const { MedicalContract } = require("../chaincode/lib/medicalContract.js");

// // shim.start(new MedicalContract());
// const chaincode = new MedicalContract();

// describe("Test writePatientMedicalData", () => {
// 	let stub;

// 	// beforeEach(() => {
// 	// 	stub = new ChaincodeMockStub("MyMockStub", chaincode);

// 	// });

// 	it("Should init without issues", async () => {

// 		const stub = new ChaincodeMockStub("MyMockStub", chaincode);

// 		console.log(stub)

// 		const response = await stub.mockInit("tx1", []);

// 		expect(response.status).to.eql(200)

// 	});

// 	it("Should write patient medical data", async () => {
// 		const stub = new ChaincodeMockStub("MyMockStub", chaincode);

// 		const patientId = "patient1";
// 		const doctorId = "doctor1";
// 		const medicalData = JSON.stringify({});
// 		console.log("a")
// 		// wykonaj mockInvoke na funkcji writePatientMedicalData
// 		const response = await stub.mockInvoke("tx1", ["writePatientMedicalData", patientId, doctorId, medicalData]);
// 		console.log("b")
// 		// sprawdź, czy status odpowiedzi jest równy 200
// 		expect(response.status).to.eql(200);
// 		console.log("c")
// 		const response2 = await stub.mockInvoke("tx1", ["readPatientMedicalData", patientId]);
// 		console.log("d")
// 		console.log(Transform.bufferToObject(response2.payload));
// 		expect(Transform.bufferToObject(response2.payload)).to.deep.eq({
// 			make: "prop1",
// 			model: "prop2",
// 			color: "prop3",
// 			owner: "owner",
// 			docType: "car",
// 		});

// 		// sprawdź, czy dane medyczne zostały zapisane poprawnie
// 		const storedData = await stub.getState(patientId);
// 		expect(storedData.toString()).to.eql(medicalData);
// 	});

// 	it("Should not write patient medical data if doctor does not have access", async () => {
// 		// utwórz argumenty dla funkcji
// 		const patientId = "patient1";
// 		const doctorId = "doctor2"; // inny lekarz niż w accessList
// 		const medicalData = JSON.stringify({
// 			// ... dane medyczne pacjenta
// 		});

// 		// dodaj pacjenta do accessList, ale z innym clientId niż aktualny lekarz
// 		await stub.putState(patientId, Buffer.from(JSON.stringify([{ clientId: "otherClientId" }])));

// 		// wykonaj mockInvoke na funkcji writePatientMedicalData
// 		const response = await stub.mockInvoke("tx1", ["writePatientMedicalData", patientId, doctorId, medicalData]);

// 		// sprawdź, czy status odpowiedzi jest równy 200
// 		expect(response.status).to.eql(200);

// 		// sprawdź, czy funkcja zwraca odpowiedni błąd
// 		expect(response.payload.toString()).to.include("doesn't have access to patient");
// 	});
// });

//yarn add @theledger/fabric-mock-stub --ignore-engines

const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const { expect } = require("chai");

const { ChaincodeStub, ClientIdentity, HistoryQueryIterator} = require("fabric-shim");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");

// const MedicalContract = require("../lib/medicalContract.js");
const MedicalContract = require("../lib/medicalContract.js");

const winston = require("winston");

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

const testContext = () => {
	const stub = sinon.createStubInstance(ChaincodeStub);
	const clientIdentity = sinon.createStubInstance(ClientIdentity);
	const logging = {
		getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
		setLevel: sinon.stub(),
	};
	return { stub, clientIdentity, logging };
};

describe("MedicalContract", () => {
	let contract;
	let ctx;

	beforeEach(() => {
		contract = new MedicalContract();
		ctx = testContext();

		ctx.stub.getState.withArgs("doctor1").resolves(Buffer.from(JSON.stringify([{ clientId: "patient1", accessExpirationDate: "2025-04-19T22:00:00.000Z" }])));
		ctx.stub.getState.withArgs("doctor2").resolves(Buffer.from(JSON.stringify([{ clientId: "patient2", accessExpirationDate: "2025-04-19T22:00:00.000Z" }])));

		ctx.stub.getState.withArgs("patient1").resolves(Buffer.from(JSON.stringify({ medicalData: "testValue for patient1" })));
		ctx.stub.getState.withArgs("patient2").resolves(Buffer.from(JSON.stringify({ medicalData: "testValue for patient2" })));

		// ctx.stub.getHistoryForKey.withArgs("patient1").returns({
		// 	next: () => {
		// 	  return {
		// 		value: {
		// 		  key: "patient1",
		// 		  value: Buffer.from(JSON.stringify({ medicalHistoryData: "testValue for patient1" }))
		// 		},
		// 		done: true
		// 	  };
		// 	}
		// });
		

		const testHistoryData = [
			{ key: 'patient1', value: Buffer.from(JSON.stringify({ medicalHistoryData: 'testValue for patient1' })) }
		];
		const iterator = new HistoryQueryIterator(testHistoryData);
		ctx.stub.getHistoryForKey.withArgs("patient1").resolves(iterator)

	});

	describe("readAccessList", () => {
		it("should return the access list for the specified doctor", async () => {
			const doctorId = "doctor2";
			const accessList = [{ clientId: "patient2", accessExpirationDate: "2025-04-19T22:00:00.000Z" }];
			ctx.clientIdentity.getID.returns("x509::////CN=doctor2");

			await contract.readAccessList(ctx, doctorId).should.eventually.deep.equal(JSON.stringify(accessList));

			// const result = await contract.readAccessList(ctx, doctorId);

			// expect(result).toEqual(JSON.stringify(accessList));
		});

		it("should return undefined for non-matching client ID", async () => {
			// const doctorId = "doctor2";
			// const accessList = [{ clientId: "patient2", accessExpirationDate: "2025-04-19T22:00:00.000Z" }];
			ctx.clientIdentity.getID.returns("x509::////CN=doctor2");

			// await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(accessList)));

			const result = await contract.readAccessList(ctx, "invalidDoctorId");

			expect(result).to.be.undefined;
		});
	});

	describe("writePatientMedicalData", () => {
		it("should write patient medical data if doctor has access", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			const medicalData = { weight: "80kg", height: "175cm" };

			ctx.stub.getState.withArgs(doctorId).resolves(Buffer.from(JSON.stringify([{ clientId: patientId, accessExpirationDate: "2025-04-19T22:00:00.000Z" }])));

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			await contract.writePatientMedicalData(ctx, patientId, doctorId, JSON.stringify(medicalData)).should.eventually.deep.equal(Buffer.from(JSON.stringify(medicalData)));
		});

		it("should return an error if doctor does not have access", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			const medicalData = { weight: "80kg", height: "175cm" };

			ctx.stub.getState.withArgs(doctorId).resolves(Buffer.from(JSON.stringify([{ clientId: "invalidPatientId", accessExpirationDate: "2025-04-19T22:00:00.000Z" }])));
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			await contract
				.writePatientMedicalData(ctx, patientId, doctorId, JSON.stringify(medicalData))
				.should.eventually.deep.equal({ error: `doctor: ${doctorId} doesn't have access to patient ${patientId}` });
		});

		it("should return an error if the user is not a doctor", async () => {
			const patientId = "patient1";
			const doctorId = "user1";
			const medicalData = { weight: "80kg", height: "175cm" };

			ctx.stub.getState.withArgs(doctorId).resolves(Buffer.from(JSON.stringify([{ clientId: "invalidPatientId", accessExpirationDate: "2025-04-19T22:00:00.000Z" }])));

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			await contract.writePatientMedicalData(ctx, patientId, doctorId, JSON.stringify(medicalData)).should.eventually.deep.equal(`user: ${doctorId}  isn't a doctor`);
		});
	});

	describe("readPatientMedicalData", () => {
		it("should read patient medical data if doctor has access", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			let iterator = await ctx.stub.getHistoryForKey(patientId);
			console.log("wazne")
			console.log(iterator)

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalData: "testValue for patient1" }));
		});

		it("should read patient medical data if called by the patient who own this data", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalData: "testValue for patient1" }));
		});

		it("should return an error if doctor does not have access to patient", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(`doctor: ${doctorId}  doesn't have access to patient: ${patientId}`);
		});

		it("should return an error if patient is not data owner", async () => {
			const patientId = "patient1";

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(`patient patient2 cannot see other patients records ${patientId}`);
		});
	});

	describe("readPatientHistoryData", () => {
		it("should read patient medical data if doctor has access", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";

			let iterator = await ctx.stub.getHistoryForKey(patientId);

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			

			await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalHIstoryData: "testValue for patient1" }));
		});
		it("should read patient medical data if called by the patient who own this data", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);
			await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalData: "testValue for patient1" }));
		});
		it("should return an error if doctor does not have access to patient", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);
			await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(`doctor: ${doctorId}  doesn't have access to patient: ${patientId}`);
		});
		it("should return an error if patient is not data owner", async () => {
			const patientId = "patient1";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);
			await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(`patient patient2 cannot see other patients records ${patientId}`);
		});
	});

	// describe("grantAccess", () => {
	// 	it("should add doctor to access list if patient grants access", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor2";
	// 		const accessExpirationDate = "2025-04-19T22:00:00.000Z";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);

	// 		let accessList = await ctx.stub.getState(doctorId);
	// 		accessList = JSON.parse(accessList.toString());
	// 		let newAccess = { clientId: patientId, accessExpirationDate: accessExpirationDate };
	// 		accessList.push(newAccess);

	// 		await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(accessList);
	// 	});

	// 	it("should return an error if patient is not the data owner", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor2";
	// 		const accessExpirationDate = "2025-04-19T22:00:00.000Z";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);

	// 		await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(`patient: ${patientId} cannot change other patients access`);
	// 	});

	// 	it("should return an error if access list for doctor is already present", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor1";
	// 		const accessExpirationDate = "2025-04-19T22:00:00.000Z";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=patient1`);

	// 		await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(`doctor: ${doctorId}  has already access to patient: ${patientId}`);
	// 	});
	// });

	describe("grantAccess", () => {
		it("should add doctor to access list if patient grants access", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			const accessExpirationDate = "2025-04-19T22:00:00.000Z";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);

			let accessList = await ctx.stub.getState(doctorId);
			accessList = JSON.parse(accessList.toString());
			let newAccess = { clientId: patientId, accessExpirationDate: accessExpirationDate };
			accessList.push(newAccess);

			await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(accessList);
		});

		it("should return an error if patient is not the data owner", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			const accessExpirationDate = "2025-04-19T22:00:00.000Z";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);

			await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(`patient: ${patientId} cannot change other patients access`);
		});

		it("should return an error if access list for doctor is already present", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			const accessExpirationDate = "2025-04-19T22:00:00.000Z";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient1`);

			await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(`doctor: ${doctorId}  has already access to patient: ${patientId}`);
		});

		it("should return an error if user role is not patient", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			const accessExpirationDate = "2025-04-19T22:00:00.000Z";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient1`);

			await contract.grantAccess(ctx, patientId, doctorId, accessExpirationDate).should.eventually.deep.equal(`only patients can grant access to doctors`);
		});
	});

	describe("revokeAccess", () => {
		it("should remove doctor from access list if doctor is in access list", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);

			let accessList = await ctx.stub.getState(doctorId);
			accessList = JSON.parse(accessList.toString());

			accessList = accessList.filter((item) => item.clientId !== patientId);

			await contract.revokeAccess(ctx, patientId, doctorId).should.eventually.deep.equal(accessList);
		});

		it("should return an error if patient is not the data owner", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);

			await contract.revokeAccess(ctx, patientId, doctorId).should.eventually.deep.equal(`patient: ${patientId} cannot change other patients access`);
		});

		it("should return an error if access list for doctor is already present", async () => {
			const patientId = "patient1";
			const doctorId = "doctor2";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient1`);

			await contract.revokeAccess(ctx, patientId, doctorId).should.eventually.deep.equal(`doctor: ${doctorId}  doesn't have access to patient: ${patientId} so it cannot be revoked`);
		});

		it("should return an error if user role is not patient", async () => {
			const patientId = "patient1";
			const doctorId = "doctor1";
			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient1`);

			await contract.revokeAccess(ctx, patientId, doctorId).should.eventually.deep.equal(`only patients can revoke access to doctors`);
		});
	});
});
