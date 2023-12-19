// app.js
async function initApp() {
    // Instantiate contract
    const gateway = new fabricGateway();
    await gateway.connect('connectionProfile.json', 'userWallet', 'channelName', 'contractName');

    // Get user details
    const userAddress = gateway.getCurrentUser();
    const userType = await gateway.getContract().evaluateTransaction('getUserType');
    const userPriority = await gateway.getContract().evaluateTransaction('getUserPriority');

    // Display user details
    document.getElementById('userAddress').textContent = userAddress;
    document.getElementById('userType').textContent = userType;
    document.getElementById('userPriority').textContent = userPriority;
}

async function specifyEnergyResource() {
    // Get input values
    const timestamp = document.getElementById('timestamp').value;
    const amount = document.getElementById('amount').value;

    // Submit transaction
    await gateway.getContract().submitTransaction('specifyEnergyResource', timestamp, amount);
    console.log(`Energy resource specified for timestamp ${timestamp} with amount ${amount}`);
}

async function reserveEnergyResource() {
    // Get input values
    const reserveTimestamp = document.getElementById('reserveTimestamp').value;
    const reserveAmount = document.getElementById('reserveAmount').value;

    // Submit transaction
    await gateway.getContract().submitTransaction('reserveEnergyResource', reserveTimestamp, reserveAmount);
    console.log(`Energy resource reserved for timestamp ${reserveTimestamp} with amount ${reserve
