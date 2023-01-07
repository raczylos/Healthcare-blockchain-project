/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// const FabCar = require('./lib/fabcar');
const AdminContract = require('./lib/adminContract');
const MedicalContract = require('./lib/medicalContract');

// module.exports.FabCar = FabCar;
// module.exports.AdminContract = AdminContract;
module.exports.AdminContract = MedicalContract;
// module.exports.contracts = [ FabCar];
module.exports.contracts = [ MedicalContract];
