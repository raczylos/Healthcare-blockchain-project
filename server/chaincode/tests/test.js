
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const { expect } = require("chai");

const { ChaincodeStub, ClientIdentity, HistoryQueryIterator} = require("fabric-shim");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");

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
				.should.eventually.deep.equal({ error: `doctor: ${doctorId} doesn't have access to patient ${patientId} or accessExpirationDate expired` });
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

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(`doctor: ${doctorId}  doesn't have access to patient: ${patientId} or accessExpirationDate expired`);
		});

		it("should return an error if patient is not data owner", async () => {
			const patientId = "patient1";

			ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
			ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);

			await contract.readPatientMedicalData(ctx, patientId).should.eventually.deep.equal(`patient patient2 cannot see other patients records ${patientId}`);
		});
	});

	// describe("readPatientHistoryData", () => {
	// 	it("should read patient medical data if doctor has access", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor1";

	// 		let iterator = await ctx.stub.getHistoryForKey(patientId);

	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);

			

	// 		await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalHIstoryData: "testValue for patient1" }));
	// 	});
	// 	it("should read patient medical data if called by the patient who own this data", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor1";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=${patientId}`);
	// 		await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(JSON.stringify({ medicalData: "testValue for patient1" }));
	// 	});
	// 	it("should return an error if doctor does not have access to patient", async () => {
	// 		const patientId = "patient1";
	// 		const doctorId = "doctor2";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("doctor");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=${doctorId}`);
	// 		await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(`doctor: ${doctorId}  doesn't have access to patient: ${patientId}`);
	// 	});
	// 	it("should return an error if patient is not data owner", async () => {
	// 		const patientId = "patient1";
	// 		ctx.clientIdentity.getAttributeValue.withArgs("role").returns("patient");
	// 		ctx.clientIdentity.getID.returns(`x509::////CN=patient2`);
	// 		await contract.readPatientHistoryData(ctx, patientId).should.eventually.deep.equal(`patient patient2 cannot see other patients records ${patientId}`);
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
