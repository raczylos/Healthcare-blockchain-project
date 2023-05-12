# Healthcare-blockchain-project
Electronic healthcare record (EHR) project to store sensitive patient medical data in Hyperledger Fabric (HLF) blockchain with CSRF protection and Unit tests for smart contract functions.

# Functionality
- grant access to doctor with time range
- view patient data (if access granted)
- create patient data (if access granted)
- create patients/doctors by admin
- edit users

# Instalation
- Clone repo
- Follow prerequisites: **https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html**
- Intall script in fabric-samples directory:  
  **curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh**
- Type: **./install-fabric.sh -f 2.2.2 -c 1.4.9 docker binary** - https://hyperledger-fabric.readthedocs.io/en/latest/install.html
- In directory **"server/scripts"** type:  
  **chmod +x startFabric.sh networkDown.sh** - to give executable rights  
  **./startFabric.sh** - to start network  
  **./networkDown.sh** - to stop network  
- In directory "server" type:  
  **npm install**
  **node enrollAdmin.js** - to create admin  

  | Username | password |
  | --- | --- |
  | admin | adminpw |  

  **node registerDefaultUsers.js** - to create 2 patients and 2 doctors  

  | Username | password |
  | --- | --- |
  | patient1 | password |
  | patient2 | password |
  | doctor1 | password |
  | doctor2 | password |
  
  **node main.js** to start backend server
 - In directory "frontend" type:  
   **npm install**  
   **npm start** - to start frontend server  
