// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyExchange {
    address public owner;

    enum UserType { Individual, Group }
    
    struct User {
        UserType userType;
        uint priority;
        mapping(uint => uint) energyResources; // timestamp -> amount
        mapping(uint => uint) reservedResources; // timestamp -> amount
    }
    
    mapping(address => User) public users;

    event ResourceReserved(address indexed user, uint timestamp, uint amount);
    event EnergyTraded(address indexed fromUser, address indexed toUser, uint timestamp, uint amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function registerUser(UserType _userType, uint _priority) public {
        require(users[msg.sender].userType == UserType(0), "User already registered");
        users[msg.sender] = User({
            userType: _userType,
            priority: _priority
        });
    }

    function specifyEnergyResource(uint _timestamp, uint _amount) public {
        require(users[msg.sender].userType != UserType(0), "User not registered");
        users[msg.sender].energyResources[_timestamp] = _amount;
    }

    function reserveEnergyResource(address _user, uint _timestamp, uint _amount) public {
        require(users[_user].userType != UserType(0), "User not registered");
        require(users[_user].energyResources[_timestamp] >= _amount, "Insufficient energy resources");
        
        users[_user].energyResources[_timestamp] -= _amount;
        users[_user].reservedResources[_timestamp] += _amount;

        emit ResourceReserved(_user, _timestamp, _amount);
    }

    function tradeEnergy(address _fromUser, address _toUser, uint _timestamp, uint _amount) public {
        require(users[_fromUser].userType != UserType(0) && users[_toUser].userType != UserType(0), "Users not registered");
        require(users[_fromUser].reservedResources[_timestamp] >= _amount, "Insufficient reserved energy resources");
        
        users[_fromUser].reservedResources[_timestamp] -= _amount;
        users[_toUser].energyResources[_timestamp] += _amount;

        emit EnergyTraded(_fromUser, _toUser, _timestamp, _amount);
    }
}
