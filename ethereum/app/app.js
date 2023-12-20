const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function registerProsumer() {
    try {
        const gateway = await connectToGateway();
        const contract = await gateway.getNetwork('mychannel').getContract('energysystem');

        // Perform registration transaction
        const result = await contract.submitTransaction('registerProsumer', 'prosumer1', 1);
        console.log(result.toString());

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function shareEnergy() {
    try {
        const gateway = await connectToGateway();
        const contract = await gateway.getNetwork('mychannel').getContract('energysystem');

        // Perform share energy transaction
        const result = await contract.submitTransaction('shareEnergy', 'prosumer1', 10);
        console.log(result.toString());

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function requestEnergy() {
    try {
        const gateway = await connectToGateway();
        const contract = await gateway.getNetwork('mychannel').getContract('energysystem');

        // Perform request energy transaction
        const result = await contract.submitTransaction('requestEnergy', 'prosumer1', 5);
        console.log(result.toString());

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function cancelRequest() {
    try {
        const gateway = await connectToGateway();
        const contract = await gateway.getNetwork('mychannel').getContract('energysystem');

        // Perform cancel request transaction
        const result = await contract.submitTransaction('cancelRequest', 'prosumer1');
        console.log(result.toString());

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function createNewTimeSlot() {
    try {
        const gateway = await connectToGateway();
        const contract = await gateway.getNetwork('mychannel').getContract('energysystem');

        // Perform create new time slot transaction
        const result = await contract.submitTransaction('createNewTimeSlot');
        console.log(result.toString());

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function connectToGateway() {
    const ccpPath = path.resolve(__dirname, 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('user1');
    if (!identity) {
        console.log('An identity for the user "user1" does not exist in the wallet');
        return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'user1',
        discovery: { enabled: true, asLocalhost: true },
    });

    return gateway;
}
