const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerUser(firstName, lastName, role, userId, hashedPassword, age, gender, address, phoneNumber, specialization = '') {
    try {
      // load the network configuration
      const ccpPath = path.resolve(
        __dirname,
        '..',
        'fabric-samples',
        'test-network',
        'organizations',
        'peerOrganizations',
        'org1.example.com',
        'connection-org1.json'
      );
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a new CA client for interacting with the CA.
      const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
      const ca = new FabricCAServices(caURL);

      // Create a new file system based wallet for managing identities.
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      // Check to see if we've already enrolled the user.
      const userIdentity = await wallet.get(userId);
      if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return;
      }

      // Check to see if we've already enrolled the admin user.
      const adminIdentity = await wallet.get('admin');
      if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        return;
      }

      // build a user object for authenticating with the CA
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');

      // Register the user, enroll the user, and import the new identity into the wallet.

      let attrs = [
        {
          name: 'role',
          value: role,
          ecert: true
        },
        {
          name: 'firstName',
          value: firstName,
          ecert: true
        },
        {
          name: 'lastName',
          value: lastName,
          ecert: true
        },
        {
          name: 'hashedPassword',
          value: hashedPassword,
          ecert: true
        },
        {
          name: 'age',
          value: age,
          ecert: true
        },
        {
          name: 'gender',
          value: gender,
          ecert: true
        },
        {
          name: 'address',
          value: address,
          ecert: true
        },
        {
          name: 'phoneNumber',
          value: phoneNumber,
          ecert: true
        }
      ];

      if (role === 'doctor') {
        let specializationAttr = {
          name: 'specialization',
          value: specialization,
          ecert: true
        };
        attrs.push(specializationAttr);
      }

      const secret = await ca.register(
        {
          affiliation: 'org1.department1',
          enrollmentID: userId,
          role: 'client',
          attrs: attrs
        },
        adminUser
      );
      const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes()
        },
        mspId: 'Org1MSP',
        type: 'X.509'
      };
      await wallet.put(userId, x509Identity);
      console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
      return 'success';
    } catch (error) {
      console.error(`Failed to register user ${userId}: ${error}`);
      process.exit(1);
    }
}
 
module.exports = registerUser;