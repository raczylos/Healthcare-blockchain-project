/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabCar = require('./lib/fabcar');
const AdminContract = require('./lib/adminContract');

module.exports.AdminContract = AdminContract;
module.exports.FabCar = FabCar;
module.exports.contracts = [ FabCar, AdminContract];
