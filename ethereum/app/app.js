const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Load connection profile
        const ccpPath = path.resolve(__dirname, 'connection.json');
        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        const ccp = JSON.parse(ccpJSON);

        // Create a new file system wallet
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if the user is already enrolled and has a valid identity
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            return;
        }

        // Connect to the gateway
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'user1',
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network channel and contract
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('energysystem');

        // Perform transactions or queries here
        // Example: const result = await contract.submitTransaction('createNewTimeSlot');

        // Disconnect from the gateway
        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

main();
