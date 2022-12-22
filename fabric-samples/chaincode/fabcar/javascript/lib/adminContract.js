/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


class AdminContract extends Contract {

    // async initLedger(ctx){
    //     await ctx.stub.putState("testt", "test valuee")
    //     return "success"
    // }
    

    // async writePatientData(ctx, patientId, data){
    //     let patientData = JSON.parse(data)
    //     await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)))
    //     return Buffer.from(JSON.stringify(patientData))
    // }

    // async lala(ctx){
    //     let test = "elo"
    //     return test
    // }
    // async readPatientData(ctx, patientId){
    //     let response = await ctx.stub.getState(patientId)
    //     response = response.toString('utf-8')                                       // convert buffer to string
    //     return JSON.stringify(response)
    // }

    // async readPatientHistoryData(ctx, patientId){ 
    //     let iterator = await ctx.stub.getHistoryForKey(patientId)
    //     let result = await this.getIteratorData(iterator)
    //     return JSON.stringify(result)
    // }

    // async queryPatientsByDiagnosis(ctx, diagnosis){
    //     let query = {}
    //     query.selector = {"diagnosis": diagnosis}
    //     let iterator = await ctx.stub.getQueryResult(JSON.stringify(query))
    //     let result = await this.getIteratorData(iterator)
    //     return JSON.stringify(result)
    // }

    // async getIteratorData(iterator){
    //     let resultArray = []

    //     while(true){
    //         let res = await iterator.next()
    //         let resJson = {}

    //         if(res.value && res.value.value.toString()){
    //             resJson.key = res.value.key
    //             resJson.value = JSON.parse(res.value.value.toString('utf-8')) 
    //             resultArray.push(resJson)
    //         }

    //         if(res.done){
    //             await iterator.close()
    //             return resultArray
    //         }

    //     }

    // }

}

module.exports = AdminContract;
