/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const { crypto } = require('crypto')

class MedicalContract extends Contract {

    async initLedger10(ctx){
        await ctx.stub.putState("test10", "test value10")
        return "success"
    }
    
    // async writePatientData(ctx, key, value){
    //     let patientData = JSON.parse(value)
    //     await ctx.stub.putState(key, Buffer.from(JSON.stringify(patientData)))
    //     return Buffer.from(JSON.stringify(patientData))
    // }

    // async writePatientData(ctx, key, value, privateKey){
        
    //     let patientData = value
    //     let encryptedPatientData = crypto.privateEncrypt(privateKey, Buffer.from(patientData))
    //     await ctx.stub.putState(key, encryptedPatientData)
    //     return Buffer.from(JSON.stringify(patientData))
    // }

    // async readPatientData(ctx, key, publicKey){
    //     let encryptedPatientData = await ctx.stub.getState(key)

    //     let decryptedPatientData = crypto.publicDecrypt(publicKey, encryptedPatientData)

    //     let decryptedPatientDataJson = JSON.parse(decryptedPatientData.toString('utf-8'))
        
    //     return JSON.stringify(decryptedPatientDataJson)
    // }

    async writeData(ctx, patientId, data){
        let patientData = JSON.parse(data)
        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)))
        return Buffer.from(JSON.stringify(patientData))
    }

 
    async readData(ctx, patientId){
        let patientDataAsBuffer = await ctx.stub.getState(patientId)

        // if (!patientDataAsBuffer) {
        //     throw new Error(`No data found for patient with ID ${patientId}`);
        //   }

        const patientData = JSON.parse(patientDataAsBuffer.toString());
        return JSON.stringify(patientData)
    }
    
    async readHistoryData(ctx, patientId){ 
        let iterator = await ctx.stub.getHistoryForKey(patientId)
        let result = await this.getIteratorData(iterator)
        return JSON.stringify(result)
    }

    // async readAllPatients(ctx) {
    //     const startKey = '';
    //     const endKey = '';
    //     const allResults = [];
    //     for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
    //         const strValue = Buffer.from(value).toString('utf-8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push({ Key: key, Record: record });
    //     }
    //     console.info(allResults);
    //     return JSON.stringify(allResults);
    // }
        
    // async queryPatientsByDiagnosis(ctx, diagnosis){
    //     let query = {}
    //     query.selector = {"diagnosis": diagnosis}
    //     let iterator = await ctx.stub.getQueryResult(JSON.stringify(query))
    //     let result = await this.getIteratorData(iterator)
    //     return JSON.stringify(result)
    // }

    async getIteratorData(iterator){
        let resultArray = []

        while(true){
            let res = await iterator.next()
            let resJson = {}

            if(res.value && res.value.value.toString()){
                resJson.key = res.value.key
                resJson.value = JSON.parse(res.value.value.toString('utf-8')) 
                resultArray.push(resJson)
            }

            if(res.done){
                await iterator.close()
                return resultArray
            }

        }

    }

}

module.exports = MedicalContract;
