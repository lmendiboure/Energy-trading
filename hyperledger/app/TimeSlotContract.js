'use strict';

const { Contract } = require('fabric-contract-api');

class TimeSlotContract extends Contract {
    async createNewTimeSlot(ctx) {
        const timeSlot = {
            energyAvailable: 0,
            demandList: [],
            energyDemands: {}
        };

        const timeSlotKey = `TimeSlot_${new Date().toISOString()}`;
        await ctx.stub.putState(timeSlotKey, Buffer.from(JSON.stringify(timeSlot)));
        return timeSlotKey;
    }

    async updateDemands(ctx, timeSlotKey, prosumerIdentity, quantity) {
        const timeSlotBytes = await ctx.stub.getState(timeSlotKey);
        if (!timeSlotBytes || timeSlotBytes.length === 0) {
            throw new Error(`${timeSlotKey} does not exist`);
        }

        const timeSlot = JSON.parse(timeSlotBytes.toString());
        timeSlot.energyDemands[prosumerIdentity] = quantity;

        await ctx.stub.putState(timeSlotKey, Buffer.from(JSON.stringify(timeSlot)));
        return JSON.stringify(timeSlot);
    }

    async handleRequests(ctx, timeSlotKey) {
        const timeSlotBytes = await ctx.stub.getState(timeSlotKey);
        if (!timeSlotBytes || timeSlotBytes.length === 0) {
            throw new Error(`${timeSlotKey} does not exist`);
        }

        const timeSlot = JSON.parse(timeSlotBytes.toString());

        // Logique pour traiter les demandes en fonction des priorités

        await ctx.stub.putState(timeSlotKey, Buffer.from(JSON.stringify(timeSlot)));
        return JSON.stringify(timeSlot);
    }
}

module.exports = TimeSlotContract;
