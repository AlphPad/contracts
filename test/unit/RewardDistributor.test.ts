import { ContractState, DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3'
import {
    buildProject,
    createRewardDistributor,
    ContractFixture,
    getContractState,
    randomP2PKHAddress,
    createStaking,
    randomTokenId
} from './fixtures'
import { expectAssertionError, randomContractAddress } from '@alephium/web3-test'
import { RewardDistributor, RewardDistributorTypes, StakingTypes } from '../../artifacts/ts'

describe('Reward Distributor Contract Testing', () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973')

    let genesis: number
    let epochDuration: bigint
    let totalEpochs: bigint
    let sender: string
    let fixture: ContractFixture<RewardDistributorTypes.Fields>
    let staking: ContractFixture<StakingTypes.Fields>

    beforeEach(async () => {
        await buildProject()

        sender = randomP2PKHAddress()
        genesis = Date.now()
        epochDuration = 864000000n
        totalEpochs = 10n
        staking = createStaking(randomTokenId(), randomContractAddress(), [], 60n * 10n ** 18n)
        fixture = createRewardDistributor(BigInt(genesis), epochDuration, totalEpochs, staking.contractId, staking.states())
    })


    // --------------------
    // SECTION: Helpers
    // --------------------
    function harvest(state: ContractState<RewardDistributorTypes.Fields>, timestamp: bigint) {
        const inputAssets = [{ address: sender, asset: { alphAmount: DUST_AMOUNT * 100n } }]
        return RewardDistributor.tests.harvest({
            initialFields: state.fields,
            initialAsset: state.asset,
            address: fixture.address,
            existingContracts: fixture.dependencies,
            blockTimeStamp: Number(timestamp),
            inputAssets: inputAssets
        });
    }

    function addReward(state: ContractState<RewardDistributorTypes.Fields>, amount: bigint) {
        const inputAssets = [{ address: sender, asset: { alphAmount: amount + (DUST_AMOUNT * 100n) } }]
        return RewardDistributor.tests.addRewards({
            initialFields: state.fields,
            initialAsset: state.asset,
            address: fixture.address,
            existingContracts: fixture.dependencies,
            blockTimeStamp: genesis,
            testArgs: { sender: sender, amount: amount },
            inputAssets: inputAssets
        });
    }

    function getTotalPendingRewards(state: ContractState<RewardDistributorTypes.Fields>) {
        return RewardDistributor.tests.getTotalPendingRewards({
            initialFields: state.fields,
            initialAsset: state.asset,
            address: fixture.address,
            existingContracts: fixture.dependencies,
            blockTimeStamp: genesis
        });
    }

    function getTotalRewards(state: ContractState<RewardDistributorTypes.Fields>) {
        return RewardDistributor.tests.getTotalRewards({
            initialFields: state.fields,
            initialAsset: state.asset,
            address: fixture.address,
            existingContracts: fixture.dependencies,
            blockTimeStamp: genesis
        });
    }

    function getCurrentEpoch(state: ContractState<RewardDistributorTypes.Fields>, timestamp: bigint) {
        return RewardDistributor.tests.getCurrentEpoch({
            initialFields: fixture.selfState.fields,
            initialAsset: fixture.selfState.asset,
            address: fixture.address,
            existingContracts: fixture.dependencies,
            blockTimeStamp: Number(timestamp)
        });
    }


    describe('Harvest Functionality Tests', () => {
        test('Harvest 2 Epochs After Adding Rewards With Multiple Harvests', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            let addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)
            let cummulativeRewards = 0n;
            for (var i = 1n; i <= 2; i++) {
                for (var j = 1n; j <= 5; j++) {
                    const harvestRes = await harvest(rewardDistState, BigInt(genesis) + (epochDuration * i) + (((epochDuration / 5n) * j) - 1n))
                    const harvestedEvent = harvestRes.events.find(x => x.name == "RewardHarvested");
                    let harvestedAmount = 0n;
                    if (harvestedEvent && (typeof harvestedEvent.fields.harvestedAmount === 'number' || typeof harvestedEvent.fields.harvestedAmount === 'bigint')) {
                        harvestedAmount = BigInt(harvestedEvent.fields.harvestedAmount);
                    }
                    cummulativeRewards += harvestedAmount;
                    rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
                    expect(rewardDistState.fields.currentHarvestEpoch).toEqual(i % totalEpochs);
                    expect(rewardDistState.fields.currentHarvestTotal).toBeGreaterThanOrEqual(ONE_ALPH * 100n);
                }
            }
            expect(rewardDistState.asset.alphAmount).toBeLessThan(ONE_ALPH * 802n);
            expect(cummulativeRewards).toBeGreaterThan(ONE_ALPH * 198n);
        });


        test('Harvest All Epochs After Adding Rewards And Adding Another Reward', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            let addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)
            let cummulativeRewards = 0n;
            for (var i = 1n; i <= 14; i++) {
                if (i == 5n) {
                    addRewardsRes = await addReward(rewardDistState, addAlphAmount)
                    rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)
                }
                const harvestRes = await harvest(rewardDistState, BigInt(genesis) + (epochDuration * i) + (epochDuration - 1n))
                const harvestedEvent = harvestRes.events.find(x => x.name == "RewardHarvested");
                let harvestedAmount = 0n;
                if (harvestedEvent && (typeof harvestedEvent.fields.harvestedAmount === 'number' || typeof harvestedEvent.fields.harvestedAmount === 'bigint')) {
                    harvestedAmount = BigInt(harvestedEvent.fields.harvestedAmount);
                }
                cummulativeRewards += harvestedAmount;
                rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
                expect(rewardDistState.fields.currentHarvestEpoch).toEqual(i % totalEpochs);
                expect(rewardDistState.fields.currentHarvestTotal).toBeGreaterThanOrEqual(ONE_ALPH * 100n);
                expect(rewardDistState.fields.currentHarvestDistributed).toBeGreaterThan(ONE_ALPH * 99n);
            }
            expect(rewardDistState.asset.alphAmount).toBeLessThan(ONE_ALPH * 2n);
            expect(cummulativeRewards).toBeGreaterThan(ONE_ALPH * 1999n);
        });

        test('Harvest All Epochs After Adding Rewards', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)
            for (var i = 1n; i <= totalEpochs; i++) {
                const harvestRes = await harvest(rewardDistState, BigInt(genesis) + (epochDuration * i) + (epochDuration - 1n))
                rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
                expect(rewardDistState.fields.currentHarvestEpoch).toEqual(i % totalEpochs);
                expect(rewardDistState.fields.currentHarvestTotal).toBeGreaterThanOrEqual(ONE_ALPH * 100n);
                expect(rewardDistState.fields.currentHarvestDistributed).toBeGreaterThan(ONE_ALPH * 99n);
            }
            expect(rewardDistState.asset.alphAmount).toBeLessThan(ONE_ALPH * 2n);
        });

        test('Harvest At Mid Second Epoch After Adding Rewards', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            const harvestRes = await harvest(rewardDistState, BigInt(genesis) + epochDuration + epochDuration / 2n)
            rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
            expect(rewardDistState.fields.currentHarvestEpoch).toEqual(1n);
            expect(rewardDistState.fields.currentHarvestTotal).toEqual(ONE_ALPH * 100n);
            expect(rewardDistState.fields.currentHarvestDistributed).toEqual(ONE_ALPH * 50n);
        });

        test('Harvest At 1/10 Second Epoch After Adding Rewards', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            const harvestRes = await harvest(rewardDistState, BigInt(genesis) + epochDuration + epochDuration / 10n)
            rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
            expect(rewardDistState.fields.currentHarvestEpoch).toEqual(1n);
            expect(rewardDistState.fields.currentHarvestTotal).toEqual(ONE_ALPH * 100n);
            expect(rewardDistState.fields.currentHarvestDistributed).toEqual(ONE_ALPH * 10n);
        });

        test('Harvest At 1/20 Second Epoch After Adding Rewards', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            const harvestRes = await harvest(rewardDistState, BigInt(genesis) + epochDuration + epochDuration / 20n)
            rewardDistState = getContractState<RewardDistributorTypes.Fields>(harvestRes.contracts, fixture.contractId)
            expect(rewardDistState.fields.currentHarvestEpoch).toEqual(1n);
            expect(rewardDistState.fields.currentHarvestTotal).toEqual(ONE_ALPH * 100n);
            expect(rewardDistState.fields.currentHarvestDistributed).toEqual(ONE_ALPH * 5n);
        });

        test('Harvest No Reward Should Fail', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            await expectAssertionError(harvest(rewardDistState, BigInt(genesis) + (epochDuration / 1000n)), fixture.address, Number(RewardDistributor.consts.ErrorCodes.HarvestValueTooSmall));
        });

        test('Harvest Very Small Reward Should Fail', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            let rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            await expectAssertionError(harvest(rewardDistState, BigInt(genesis) + epochDuration + (epochDuration / 1000n)), fixture.address, Number(RewardDistributor.consts.ErrorCodes.HarvestValueTooSmall));
        });

        test('Harvest Before Adding Rewards', async () => {
            await expectAssertionError(harvest(fixture.selfState, BigInt(genesis) + (epochDuration / 2n)), fixture.address, Number(RewardDistributor.consts.ErrorCodes.RewardsNotInitialized));
        });

    })

    describe('AddRewards Functionality Tests', () => {
        test('Verify Rewards Distribution and Totals After Single Addition', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;

            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            const rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            const getTotalPendingRes = await getTotalPendingRewards(rewardDistState)
            expect(getTotalPendingRes.returns).toEqual(addAlphAmount);

            const getTotalRewardRes = await getTotalRewards(rewardDistState)
            expect(getTotalRewardRes.returns.length).toEqual(640);
            for (let i = 0; i < totalEpochs; i++) {
                const start = i * 64;
                const part = getTotalRewardRes.returns.substring(start, start + 64);
                const converted = BigInt("0x" + part);
                expect(converted).toEqual(ONE_ALPH * 100n);
            }
        });

        test('Verify Rewards Distribution and Totals After Two Additions', async () => {
            const addAlphAmount = ONE_ALPH * 1000n;
            const addAlphAmountTwo = ONE_ALPH * 2000n;
            const addTotal = addAlphAmount + addAlphAmountTwo;

            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount);
            const rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)


            const addRewardsTwoRes = await addReward(rewardDistState, addAlphAmountTwo);
            const rewardDistStateTwo = getContractState<RewardDistributorTypes.Fields>(addRewardsTwoRes.contracts, fixture.contractId)

            const getTotalPendingRes = await getTotalPendingRewards(rewardDistStateTwo)
            expect(getTotalPendingRes.returns).toEqual(addTotal);


            const getTotalRewardRes = await getTotalRewards(rewardDistStateTwo)
            expect(getTotalRewardRes.returns.length).toEqual(640);
            for (let i = 0; i < totalEpochs; i++) {
                const start = i * 64;
                const part = getTotalRewardRes.returns.substring(start, start + 64);
                const converted = BigInt("0x" + part);
                expect(converted).toEqual(addTotal / 10n);
            }
        });

        test('Add Zero Rewards', async () => {
            const addAlphAmount = 0n;

            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount)
            const rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            const getTotalPendingRes = await getTotalPendingRewards(rewardDistState)
            expect(getTotalPendingRes.returns).toEqual(addAlphAmount);

            const getTotalRewardRes = await getTotalRewards(rewardDistState)
            expect(getTotalRewardRes.returns.length).toEqual(640);
            for (let i = 0; i < totalEpochs; i++) {
                const start = i * 64;
                const part = getTotalRewardRes.returns.substring(start, start + 64);
                const converted = BigInt("0x" + part);
                expect(converted).toEqual(0n);
            }
        });

        test('Add Rewards Exceeding Maximum Limit', async () => {
            const addAlphAmount = BigInt(2) ** BigInt(256) - (ONE_ALPH * 100n); // max256BitBigInt

            const addRewardsRes = await addReward(fixture.selfState, addAlphAmount);
            const rewardDistState = getContractState<RewardDistributorTypes.Fields>(addRewardsRes.contracts, fixture.contractId)

            await expect(addReward(rewardDistState, addAlphAmount)).rejects.toThrow("ArithmeticError");
        });
    })

    describe('GetCurrentEpoch Functionality Tests', () => {
        test('Current Epoch at Genesis Date', async () => {
            const currentEpoch = await getCurrentEpoch(fixture.selfState, BigInt(genesis));
            expect(currentEpoch.returns).toEqual(0n); // At genesis, the epoch should be 0
        });

        test('Current Epoch at End of First Epoch', async () => {
            const endOfFirstEpoch = BigInt(genesis) + epochDuration - 1n;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, endOfFirstEpoch);
            expect(currentEpoch.returns).toEqual(0n); // Should still be in the first epoch
        });

        test('Current Epoch at Start of Second Epoch', async () => {
            const startOfSecondEpoch = BigInt(genesis) + epochDuration;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, startOfSecondEpoch);
            expect(currentEpoch.returns).toEqual(1n); // Should be the second epoch
        });

        test('Current Epoch at Start of Second Epoch', async () => {
            const startOfSecondEpoch = BigInt(genesis) + epochDuration;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, startOfSecondEpoch);
            expect(currentEpoch.returns).toEqual(1n); // Should be the second epoch
        });

        test('Current Epoch Midway Through a Random Epoch', async () => {
            const randomEpoch = 5n;
            const randomMidwayEpoch = BigInt(genesis) + epochDuration * randomEpoch;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, randomMidwayEpoch);
            expect(currentEpoch.returns).toEqual(randomEpoch); // Should be the random epoch
        });

        test('Current Epoch After Final Epoch (Looping)', async () => {
            const afterFinalEpoch = BigInt(genesis) + epochDuration * totalEpochs;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, afterFinalEpoch);
            expect(currentEpoch.returns).toEqual(0n); // Should loop back to the first epoch
        });

        test('Current Epoch at End of Last Epoch', async () => {
            const endOfLastEpoch = BigInt(genesis) + epochDuration * totalEpochs - 1n;
            const currentEpoch = await getCurrentEpoch(fixture.selfState, endOfLastEpoch);
            expect(currentEpoch.returns).toEqual(totalEpochs - 1n); // Should be the last epoch
        });

        test('Current Epoch During Looping at a Random Epoch', async () => {
            const randomLoopingEpoch = 3n; // For instance, 3rd epoch in the next cycle
            const loopingTimestamp = BigInt(genesis) + epochDuration * (totalEpochs + randomLoopingEpoch);
            const currentEpoch = await getCurrentEpoch(fixture.selfState, loopingTimestamp);
            expect(currentEpoch.returns).toEqual(randomLoopingEpoch); // Should be the 3rd epoch in the looping
        });

        test('Current Epoch at Start of Looping Last Epoch', async () => {
            const loopCount = 2n; // Assuming the epochs have looped twice
            const startOfLoopingLastEpoch = BigInt(genesis) + epochDuration * (totalEpochs * loopCount - 1n);
            const currentEpoch = await getCurrentEpoch(fixture.selfState, startOfLoopingLastEpoch);
            expect(currentEpoch.returns).toEqual(totalEpochs - 1n); // Should be the start of the last epoch in the loop
        });
    })
})
