// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Prosumer {
    address public owner;
    string public identity;
    uint public priority;
    int public energyBalance;

    event EnergyShared(address indexed prosumer, uint quantity);
    event EnergyRequested(address indexed prosumer, uint quantity);
    event RequestCanceled(address indexed prosumer, uint quantity);

    constructor(string memory _identity, uint _priority) {
        owner = msg.sender;
        identity = _identity;
        priority = _priority;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function shareEnergy(uint quantity) public onlyOwner {
        require(quantity > 0, "Invalid quantity");
        energyBalance += int(quantity);
        emit EnergyShared(msg.sender, quantity);
    }

    function requestEnergy(uint quantity) public {
        require(quantity > 0, "Invalid quantity");
        require(energyBalance >= int(quantity), "Not enough energy available");
        energyBalance -= int(quantity);
        emit EnergyRequested(msg.sender, quantity);
    }

    function cancelRequest() public {
        // Logique pour annuler une demande
        // Ici, nous supprimons simplement la demande, mais vous pouvez ajouter des règles spécifiques
        emit RequestCanceled(msg.sender, uint(energyBalance));
        energyBalance = 0;
    }
}
