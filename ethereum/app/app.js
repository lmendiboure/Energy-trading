// app.js
document.addEventListener('DOMContentLoaded', async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            initApp();
        } catch (error) {
            console.error(error);
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        initApp();
    } else {
        console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

async function initApp() {
    // Instantiate contract
    const contractAddress = 'YOUR_CONTRACT_ADDRESS';
    const abi = [ /* Contract ABI goes here */ ];
    const energyExchangeContract = new web3.eth.Contract(abi, contractAddress);

    // Get user details
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    const userType = await energyExchangeContract.methods.users(userAddress).call().then(user => user.userType);
    const userPriority = await energyExchangeContract.methods.users(userAddress).call().then(user => user.priority);

    // Display user details
    document.getElementById('userAddress').textContent = userAddress;
    document.getElementById('userType').textContent = userType;
    document.getElementById('userPriority').textContent = userPriority;
}

async function specifyEnergyResource() {
    // Get input values
    const timestamp = document.getElementById('timestamp').value;
    const amount = document.getElementById('amount').value;

    // Call contract function
    await energyExchangeContract.methods.specifyEnergyResource(timestamp, amount).send({ from: web3.eth.defaultAccount });
    console.log(`Energy resource specified for timestamp ${timestamp} with amount ${amount}`);
}

async function reserveEnergyResource() {
    // Get input values
    const reserveTimestamp = document.getElementById('reserveTimestamp').value;
    const reserveAmount = document.getElementById('reserveAmount').value;

    // Call contract function
    await energyExchangeContract.methods.reserveEnergyResource(userAddress, reserveTimestamp, reserveAmount).send({ from: web3.eth.defaultAccount });
    console.log(`Energy resource reserved for timestamp ${reserveTimestamp} with amount ${reserveAmount}`);
}

async function tradeEnergy() {
    // Get input values
    const tradeFromUser = document.getElementById('tradeFromUser').value;
    const tradeToUser = document.getElementById('tradeToUser').value;
    const tradeTimestamp = document.getElementById('tradeTimestamp').value;
    const tradeAmount = document.getElementById('tradeAmount').value;

    // Call contract function
    await energyExchangeContract.methods.tradeEnergy(tradeFromUser, tradeToUser, tradeTimestamp, tradeAmount).send({ from: web3.eth.defaultAccount });
    console.log(`Energy traded from ${tradeFromUser} to ${tradeToUser} for timestamp ${tradeTimestamp}
