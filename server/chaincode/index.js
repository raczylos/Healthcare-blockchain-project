'use strict';

// const shim = require('fabric-shim');
// import shim from 'fabric-shim';
// import { MedicalContract } from './lib/medicalContract';

// const MedicalContract = require('./lib/medicalContract');


// shim.start(new MedicalContract());

// import { MedicalContract } from './lib/medicalContract';

// export const contracts = [MedicalContract];

// import shim from 'fabric-shim';
// import { MedicalContract } from './lib/medicalContract';

// // shim.start(new MedicalContract());
// export const contracts = [MedicalContract];

const medicalContract = require('./lib/medicalContract');


module.exports.MedicalContract = medicalContract;
module.exports.contracts = [medicalContract];