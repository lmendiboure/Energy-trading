document.addEventListener('DOMContentLoaded', async () => {
    // Connect to the local Ethereum node
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    // Set the default account to use for transactions
    const accounts = await window.web3.eth.getAccounts();
    window.web3.eth.defaultAccount = accounts[0];

    // Load your contract ABI and address
    const energySystemABI = /* Your EnergySystem contract ABI */;
    const energySystemAddress = /* Your EnergySystem contract address */;
    const energySystemContract = new window.web3.eth.Contract(energySystemABI, energySystemAddress);

    // Event output container
    const eventsList = document.getElementById('eventsList');

    // Function to display events in the UI
    function displayEvent(event) {
        const listItem = document.createElement('li');
        listItem.textContent = event.event;
        eventsList.appendChild(listItem);
    }

    // Function to register a prosumer
    window.registerProsumer = async () => {
        const identity = document.getElementById('identity').value;
        const priority = document.getElementById('priority').value;
        
        await energySystemContract.methods.registerProsumer(identity, priority).send();
        displayEvent({ event: 'ProsumerRegistered', identity, priority });
    };

    // Function to share energy
    window.shareEnergy = async () => {
        const shareTo = document.getElementById('shareTo').value;
        const quantity = document.getElementById('quantity').value;
        const timeSlot = document.getElementById('timeSlot').value;

        await energySystemContract.methods.shareEnergy(shareTo, quantity, timeSlot).send();
        displayEvent({ event: 'EnergyShared', shareTo, quantity, timeSlot });
    };

    // Function to request energy
    window.requestEnergy = async () => {
        const requestFrom = document.getElementById('requestFrom').value;
        const requestQuantity = document.getElementById('requestQuantity').value;
        const requestTimeSlot = document.getElementById('requestTimeSlot').value;

        await energySystemContract.methods.requestEnergy(requestFrom, requestQuantity, requestTimeSlot).send();
        displayEvent({ event: 'EnergyRequested', requestFrom, requestQuantity, requestTimeSlot });
    };

    // Function to cancel a request
    window.cancelRequest = async () => {
        const cancelRequestFrom = document.getElementById('cancelRequestFrom').value;
        const cancelRequestTimeSlot = document.getElementById('cancelRequestTimeSlot').value;

        await energySystemContract.methods.cancelRequest(cancelRequestFrom, cancelRequestTimeSlot).send();
        displayEvent({ event: 'RequestCanceled', cancelRequestFrom, cancelRequestTimeSlot });
    };

    // Function to create a new time slot
    window.createTimeSlot = async () => {
        await energySystemContract.methods.createNewTimeSlot().send();
        displayEvent({ event: 'TimeSlotCreated' });
    };

    // Function to handle requests
    window.handleRequests = async () => {
        const handleRequestsTimeSlot = document.getElementById('handleRequestsTimeSlot').value;

        await energySystemContract.methods.handleRequests(handleRequestsTimeSlot).send();
        displayEvent({ event: 'RequestsHandled', handleRequestsTimeSlot });
    };
});
