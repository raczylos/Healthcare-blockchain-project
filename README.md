# Healthcare-blockchain-project
Electronic healthcare record (EHR) project to store sensitive patient medical data in Hyperledger Fabric (HLF) blockchain with CSRF protection and Unit tests for smart contract functions.

# Functionality
- grant a doctor access for a limited time period chosen by the patient
- view patient data (if access granted)
- create patient data (if access granted)
- create patients/doctors by admin
- edit users

# Installation
- Clone repo
- Follow prerequisites: **https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html**
- Intall script in fabric-samples directory:  
  **curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh**
- Type: **./install-fabric.sh -f 2.2.2 -c 1.4.9 docker binary** - to create docker images and binary https://hyperledger-fabric.readthedocs.io/en/latest/install.html
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
 
 # Demo screens
 Grant access to doctor  
![image](https://github.com/raczylos/Healthcare-blockchain-project/assets/82103059/1b659639-c6fe-4cf4-9c3d-0e9eac1b783a)
![image](https://github.com/raczylos/Healthcare-blockchain-project/assets/82103059/a3078130-ef30-4052-9719-aac86917f85a)


Add patient medical data  
![image](https://github.com/raczylos/Healthcare-blockchain-project/assets/82103059/34f1b602-ee8a-4c30-aca8-5678f4304ba7)
![image](https://github.com/raczylos/Healthcare-blockchain-project/assets/82103059/9fac7338-ef10-45de-b476-38c2a81d3c8e)
