'use strict';

const { Contract } = require('fabric-contract-api');
const ProsumerContract = require('./ProsumerContract');
const TimeSlotContract = require('./TimeSlotContract');

class EnergySystemContract extends Contract {
    constructor() {
        super('org.example.energysystem');
        this.prosumerContract = new ProsumerContract();
        this.timeSlotContract = new TimeSlotContract();
    }

    async instantiate(ctx) {
        console.log('Instantiate the energy system contract');
    }

    async createNewTimeSlot(ctx) {
        return await this.timeSlotContract.createNewTimeSlot(ctx);
    }

    async registerProsumer(ctx, identity, priority) {
        return await this.prosumerContract.registerProsumer(ctx, identity, priority);
    }

    async shareEnergy(ctx, prosumerIdentity, quantity) {
        return await this.prosumerContract.shareEnergy(ctx, prosumerIdentity, quantity);
    }

    async requestEnergy(ctx, prosumerIdentity, quantity) {
        return await this.prosumerContract.requestEnergy(ctx, prosumerIdentity, quantity);
    }

    async cancelRequest(ctx, prosumerIdentity) {
        return await this.prosumerContract.cancelRequest(ctx, prosumerIdentity);
    }

    async updateDemands(ctx, timeSlotKey, prosumerIdentity, quantity) {
        return await this.timeSlotContract.updateDemands(ctx, timeSlotKey, prosumerIdentity, quantity);
    }

    async handleRequests(ctx, timeSlotKey) {
        return await this.timeSlotContract.handleRequests(ctx, timeSlotKey);
    }
}

module.exports = EnergySystemContract;
