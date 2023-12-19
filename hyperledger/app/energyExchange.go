package main

import (
    "github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type EnergyExchangeContract struct {
    contractapi.Contract
}

type User struct {
    UserType  string `json:"userType"`
    Priority  uint   `json:"priority"`
    Resources map[string]uint `json:"resources"`
}

func (s *EnergyExchangeContract) RegisterUser(ctx contractapi.TransactionContextInterface, userType string, priority uint) error {
    user := &User{
        UserType:  userType,
        Priority:  priority,
        Resources: make(map[string]uint),
    }

    return ctx.GetStub().PutState(ctx.GetStub().GetCreator(), user)
}

func (s *EnergyExchangeContract) SpecifyEnergyResource(ctx contractapi.TransactionContextInterface, timestamp string, amount uint) error {
    user, err := s.retrieveUser(ctx)
    if err != nil {
        return err
    }

    user.Resources[timestamp] = amount

    return ctx.GetStub().PutState(ctx.GetStub().GetCreator(), user)
}

func (s *EnergyExchangeContract) ReserveEnergyResource(ctx contractapi.TransactionContextInterface, userAddress string, timestamp string, amount uint) error {
    user, err := s.retrieveUser(ctx)
    if err != nil {
        return err
    }

    if userAddress != ctx.GetStub().GetCreator() {
        return fmt.Errorf("You can only reserve resources for yourself")
    }

    if user.Resources[timestamp] < amount {
        return fmt.Errorf("Insufficient energy resources")
    }

    user.Resources[timestamp] -= amount

    return ctx.GetStub().PutState(ctx.GetStub().GetCreator(), user)
}

func (s *EnergyExchangeContract) retrieveUser(ctx contractapi.TransactionContextInterface) (*User, error) {
    userBytes, err := ctx.GetStub().GetState(ctx.GetStub().GetCreator())
    if err != nil {
        return nil, err
    }

    if userBytes == nil {
        return nil, fmt.Errorf("User not registered")
    }

    var user User
    err = json.Unmarshal(userBytes, &user)
    if err != nil {
        return nil, err
    }

    return &user, nil
}
