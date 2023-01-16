'use strict';

const { Contract } = require('fabric-contract-api');
const { crypto } = require('crypto')

class MedicalContract extends Contract {

    async initLedger(ctx){
        await ctx.stub.putState("test", "test value")
        return "success"
    }

    async writeData(ctx, patientId, data){
        let patientData = JSON.parse(data)
        await ctx.stub.putState(patientId, Buffer.from(JSON.stringify(patientData)))
        return Buffer.from(JSON.stringify(patientData))
    }

 
    async readData(ctx, patientId){
        let patientDataAsBuffer = await ctx.stub.getState(patientId)

        const patientData = JSON.parse(patientDataAsBuffer.toString());
        return JSON.stringify(patientData)
    }
    
    async readHistoryData(ctx, patientId){ 
        let iterator = await ctx.stub.getHistoryForKey(patientId)
        let result = await this.getIteratorData(iterator)
        return JSON.stringify(result)
    }

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
