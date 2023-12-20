// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Prosumer.sol";
import "./TimeSlot.sol";

contract EnergySystem {
    mapping(address => Prosumer) public prosumers;
    mapping(uint => TimeSlot) public timeSlots;

    event ProsumerRegistered(address indexed prosumer, string identity, uint priority);
    event EnergyShared(address indexed prosumer, uint quantity);
    event EnergyRequested(address indexed prosumer, uint quantity);
    event RequestCanceled(address indexed prosumer, uint quantity);
    event TimeSlotCreated(uint indexed timeSlot);
    event RequestsHandled(uint indexed timeSlot);

    function registerProsumer(string memory identity, uint priority) public {
        Prosumer newProsumer = new Prosumer(identity, priority);
        prosumers[address(newProsumer)] = newProsumer;
        emit ProsumerRegistered(address(newProsumer), identity, priority);
    }

    function shareEnergy(address prosumer, uint quantity, uint timeSlot) public {
        require(quantity > 0, "Invalid quantity");
        require(timeSlots[timeSlot] != TimeSlot(0), "Invalid time slot");
        require(prosumers[prosumer] != Prosumer(0), "Invalid prosumer");

        prosumers[prosumer].shareEnergy(quantity);
        timeSlots[timeSlot].energyAvailable += quantity;
        emit EnergyShared(prosumer, quantity);
    }

    function requestEnergy(address prosumer, uint quantity, uint timeSlot) public {
        require(quantity > 0, "Invalid quantity");
        require(timeSlots[timeSlot] != TimeSlot(0), "Invalid time slot");
        require(prosumers[prosumer] != Prosumer(0), "Invalid prosumer");

        prosumers[prosumer].requestEnergy(quantity);
        timeSlots[timeSlot].updateDemands(prosumer, quantity);
        emit EnergyRequested(prosumer, quantity);
    }

    function cancelRequest(address prosumer, uint timeSlot) public {
        require(timeSlots[timeSlot] != TimeSlot(0), "Invalid time slot");
        require(prosumers[prosumer] != Prosumer(0), "Invalid prosumer");

        prosumers[prosumer].cancelRequest();
        emit RequestCanceled(prosumer, uint(prosumers[prosumer].energyBalance));
    }

    function createNewTimeSlot() public {
        uint timeSlot = timeSlots.length;
        timeSlots[timeSlot] = new TimeSlot();
        emit TimeSlotCreated(timeSlot);
    }

    function handleRequests(uint timeSlot) public {
        require(timeSlots[timeSlot] != TimeSlot(0), "Invalid time slot");

        timeSlots[timeSlot].handleRequests();
        emit RequestsHandled(timeSlot);
    }
}
