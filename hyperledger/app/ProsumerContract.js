'use strict';

const { Contract } = require('fabric-contract-api');

class ProsumerContract extends Contract {
    async registerProsumer(ctx, identity, priority) {
        const prosumer = {
            identity,
            priority,
            energyBalance: 0
        };

        await ctx.stub.putState(identity, Buffer.from(JSON.stringify(prosumer)));
        return JSON.stringify(prosumer);
    }

    async shareEnergy(ctx, prosumerIdentity, quantity) {
        const prosumerBytes = await ctx.stub.getState(prosumerIdentity);
        if (!prosumerBytes || prosumerBytes.length === 0) {
            throw new Error(`${prosumerIdentity} does not exist`);
        }

        const prosumer = JSON.parse(prosumerBytes.toString());
        prosumer.energyBalance += quantity;

        await ctx.stub.putState(prosumerIdentity, Buffer.from(JSON.stringify(prosumer)));
        return JSON.stringify(prosumer);
    }

    async requestEnergy(ctx, prosumerIdentity, quantity) {
        const prosumerBytes = await ctx.stub.getState(prosumerIdentity);
        if (!prosumerBytes || prosumerBytes.length === 0) {
            throw new Error(`${prosumerIdentity} does not exist`);
        }

        const prosumer = JSON.parse(prosumerBytes.toString());
        if (prosumer.energyBalance < quantity) {
            throw new Error(`Not enough energy available for ${prosumerIdentity}`);
        }

        prosumer.energyBalance -= quantity;

        await ctx.stub.putState(prosumerIdentity, Buffer.from(JSON.stringify(prosumer)));
        return JSON.stringify(prosumer);
    }

    async cancelRequest(ctx, prosumerIdentity) {
        const prosumerBytes = await ctx.stub.getState(prosumerIdentity);
        if (!prosumerBytes || prosumerBytes.length === 0) {
            throw new Error(`${prosumerIdentity} does not exist`);
        }

        const prosumer = JSON.parse(prosumerBytes.toString());
        prosumer.energyBalance = 0;

        await ctx.stub.putState(prosumerIdentity, Buffer.from(JSON.stringify(prosumer)));
        return JSON.stringify(prosumer);
    }
}

module.exports = ProsumerContract;
