// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeSlot {
    uint public energyAvailable;
    address[] public demandList;
    mapping(address => uint) public energyDemands;

    event DemandUpdated(address indexed prosumer, uint quantity);
    event RequestHandled(address indexed prosumer, uint quantity);

    function updateDemands(address prosumer, uint quantity) internal {
        require(quantity > 0, "Invalid quantity");
        energyDemands[prosumer] = quantity;
        emit DemandUpdated(prosumer, quantity);

        if (!isInDemandList(prosumer)) {
            demandList.push(prosumer);
        }
    }

    function handleRequests() public {
        while (energyAvailable > 0 && demandList.length > 0) {
            address prosumer = getHighestPriorityProsumer();
            if (prosumer != address(0)) {
                uint quantity = energyDemands[prosumer];
                if (quantity > 0) {
                    energyAvailable--;
                    energyDemands[prosumer]--;
                    emit RequestHandled(prosumer, quantity);
                } else {
                    removeFromDemandList(prosumer);
                }
            } else {
                break;
            }
        }
    }

    function getHighestPriorityProsumer() internal view returns (address) {
        address highestPriorityProsumer = address(0);
        uint highestPriority = 0;

        for (uint i = 0; i < demandList.length; i++) {
            address prosumer = demandList[i];
            uint priority = prosumers[prosumer].priority;

            if (priority > highestPriority && energyDemands[prosumer] > 0) {
                highestPriority = priority;
                highestPriorityProsumer = prosumer;
            }
        }

        return highestPriorityProsumer;
    }

    function isInDemandList(address prosumer) internal view returns (bool) {
        for (uint i = 0; i < demandList.length; i++) {
            if (demandList[i] == prosumer) {
                return true;
            }
        }
        return false;
    }

    function removeFromDemandList(address prosumer) internal {
        for (uint i = 0; i < demandList.length; i++) {
            if (demandList[i] == prosumer) {
                // Retirer l'élément de la liste
                if (i < demandList.length - 1) {
                    demandList[i] = demandList[demandList.length - 1];
                }
                demandList.pop();
                break;
            }
        }
    }
}
