'use strict';

const { Contract } = require('fabric-contract-api');
const { crypto } = require('crypto')
const { X509Identity } = require('fabric-shim');

class MedicalContract extends Contract {
	async initLedger(ctx) {
		await ctx.stub.putState("test", "test value");
		return "success";
	}

	async writeData(ctx, patientId, data) {
		let patientData = JSON.parse(data);
		await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)));
		return Buffer.from(JSON.stringify(patientData));
	}

	async readData(ctx, patientId) {
		let patientDataAsBuffer = await ctx.stub.getState(patientId);

		const patientData = JSON.parse(patientDataAsBuffer.toString());
		return JSON.stringify(patientData);
	}

	async readHistoryData(ctx, patientId) {
		let iterator = await ctx.stub.getHistoryForKey(patientId);
		let result = await this.getIteratorData(iterator);
		return JSON.stringify(result);
	}

	async getIteratorData(iterator) {
		let resultArray = [];

		while (true) {
			let res = await iterator.next();
			let resJson = {};

			if (res.value && res.value.value.toString()) {
				resJson.key = res.value.key;
				resJson.value = JSON.parse(res.value.value.toString("utf-8"));
				resultArray.push(resJson);
			}

			if (res.done) {
				await iterator.close();
				return resultArray;
			}
		}
	}

	async grantAccess(ctx, patientId, doctorId, accessExpirationDate) {
		let role = ctx.clientIdentity.getAttributeValue("role").toString();
		let accessList = await ctx.stub.getState(doctorId);
		let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];
        

		if (role === "patient") {
            if(!clientId === patientId){
                return `patient: ${patientId} cannot change other patients access`;
            }

            if(!accessList || !accessList.length){
                accessList = []
            } else {
                accessList = JSON.parse(accessList.toString());
            }
			
			// if (!accessList.includes(clientId)) {
			if (!accessList.find(item => item.clientId === clientId)) {
				accessList.push({clientId, accessExpirationDate});
                
				await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(accessList)));
				return accessList;
			} else {
				
				return `doctor: ${doctorId}  has already access to patient: ${patientId}`;
			}
		}
	}

	async revokeAccess(ctx, patientId, doctorId) {
		let role = ctx.clientIdentity.getAttributeValue("role").toString();
		let accessList = await ctx.stub.getState(doctorId);
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];

		if(accessList.length !== 0){
			accessList = JSON.parse(accessList.toString());
		 }

		if (role === "patient") {
            if(!clientId === patientId){
                return `patient: ${patientId} cannot change other patients access`;
            }
			if (accessList.find(item => item.clientId === clientId)) {
                
				accessList = accessList.filter((item) => item.clientId !== clientId);
                if(!accessList || !accessList.length){
                    accessList = []
                }
				await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(accessList)));
				return accessList;
			} else {
				
				return `doctor: ${doctorId}  doesn't have access to patient: ${patientId} so it cannot be revoked`;
			}
		} else {
            return `user is not a patient`
        }
    
	}

	async writePatientMedicalData(ctx, patientId, doctorId, medicalData) {
        
        let patientData = JSON.parse(medicalData);
		let role = ctx.clientIdentity.getAttributeValue("role");
        role = role.toString()
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];
        let accessList = await ctx.stub.getState(clientId);
		
		if(accessList.length !== 0){
			accessList = JSON.parse(accessList.toString());
		}
        
		if (role === "doctor") {

			if (accessList.find(item => item.clientId === patientId)) {
				await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)));
				return Buffer.from(JSON.stringify(patientData));
                
			} else {
				// return `doctor: ${doctorId}  doesn't have access to patient: ${patientId}`;
				return JSON.parse(`{"error": "doctor: ${doctorId} doesn't have access to patient ${patientId}"}`);

			}
		} else {
			return `user: ${doctorId}  isn't a doctor`;
		}
	}

	async readPatientHistoryData(ctx, patientId) {
		let role = ctx.clientIdentity.getAttributeValue("role").toString();
		
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];

		let iterator = await ctx.stub.getHistoryForKey(patientId);
		let result = await this.getIteratorData(iterator);

   
		if (role === "doctor") {
			let accessList = await ctx.stub.getState(clientId);
			accessList = JSON.parse(accessList.toString());
			if (accessList.find(item => item.clientId === patientId)) {
				return JSON.stringify(result);
			} else {
				return `doctor: ${clientId}  doesn't have access to patient: ${patientId}`;
			}
		}
		if (role === "patient") {
			if (patientId === clientId) {
				return JSON.stringify(result);
			} else {
				return `patient ${clientId} cannot see other patients records ${patientId}`;
			}
		}

		return;
	}

	async readPatientMedicalData(ctx, patientId) {
		let role = ctx.clientIdentity.getAttributeValue("role").toString();
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];
		
		let patientDataAsBuffer = await ctx.stub.getState(patientId);

		if (role === "doctor") {
            let accessList = await ctx.stub.getState(clientId);
			accessList = JSON.parse(accessList.toString());
			if (accessList.find(item => item.clientId === patientId)) {

				if(patientDataAsBuffer.length !== 0){
					let patientData = JSON.parse(patientDataAsBuffer.toString());
					return JSON.stringify(patientData);

				} else {
					return ;
				}
				// return JSON.stringify(accessList);
			} else {

				return `doctor: ${clientId}  doesn't have access to patient: ${patientId}`;
			}
		}
		if (role === "patient") {
			if (patientId === clientId) {
				if(patientDataAsBuffer.length !== 0){
					let patientData = JSON.parse(patientDataAsBuffer.toString());
					return JSON.stringify(patientData);
				} else {
					return ;
				}
			} else {
				return `patient ${clientId} cannot see other patients records ${patientId}`;
			}
		}

		return;
	}

    async readAccessList(ctx, doctorId) {
        
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1];

		if(clientId === doctorId){
            let accessListAsBuffer = await ctx.stub.getState(doctorId);

            // if(!accessListAsBuffer || accessListAsBuffer.length === 0){
            //     accessListAsBuffer = []
            // }
        
            const accessList = JSON.parse(accessListAsBuffer.toString());

            return JSON.stringify(accessList);
        } 
        return;

	}

    async writeAccessList(ctx, doctorId, accessList) {
        let role = ctx.clientIdentity.getAttributeValue("role").toString();
        let clientId = ctx.clientIdentity.getID().split("::")[1].split("/")[4].split('=')[1]; //patient
        if(role === "patient"){
            let accessListJson = JSON.parse(accessList);
            await ctx.stub.putState(doctorId, Buffer.from(JSON.stringify(accessListJson)));
            return Buffer.from(JSON.stringify(accessListJson));
        }


	}

}

module.exports = MedicalContract;
