import { ContractState, DUST_AMOUNT, ONE_ALPH, web3 } from '@alephium/web3'
import {
  buildProject,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  createStaking,
  createTemplateStakingAccount,
  randomTokenId
} from './fixtures'
import { expectAssertionError } from '@alephium/web3-test'
import { Staking, StakingAccount, StakingAccountTypes, StakingTypes } from '../../artifacts/ts'
import { checkEvent } from '../utils';

describe('Staking Contract End-to-End Functionality Testing', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let sender: string
  let apadTokenId: string
  let stakingAccountFixture: ContractFixture<StakingAccountTypes.Fields>
  let fixture: ContractFixture<StakingTypes.Fields>
  beforeEach(async () => {
    await buildProject()
    genesis = Date.now()
    sender = randomP2PKHAddress()
    apadTokenId = randomTokenId()
    stakingAccountFixture = createTemplateStakingAccount([])
    fixture = createStaking(apadTokenId, stakingAccountFixture.contractId, stakingAccountFixture.states(), 0n)
  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function stake(state: ContractState<StakingTypes.Fields>, staker: string, vestingPeriod: bigint, amount: bigint, existingContracts?: ContractState[]) {
    const inputAssets = [{ address: staker, asset: { alphAmount: ONE_ALPH + DUST_AMOUNT * 100n, tokens: [{ id: apadTokenId, amount: amount }] } }]
    return Staking.tests.stake({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      testArgs: {
        amount: amount,
        vestingPeriod: vestingPeriod
      },
      inputAssets: inputAssets,
    });
  }

  function getSubContractId(state: ContractState<StakingTypes.Fields>, staker: string, existingContracts?: ContractState[]) {
    return Staking.tests.getSubContractId({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      testArgs: {
        account: staker
      }
    });
  }

  function getPendingRewards(state: ContractState<StakingTypes.Fields>, staker: string, existingContracts?: ContractState[]) {
    return Staking.tests.getPendingRewards({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      testArgs: {
        staker: staker
      }
    });
  }

  function calcVestedClaimable(state: ContractState<StakingAccountTypes.Fields>, timestamp: bigint, existingContracts?: ContractState[]) {
    return StakingAccount.tests.calcVestedClaimable({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp)
    });
  }

  function unstake(state: ContractState<StakingTypes.Fields>, staker: string, amount: bigint, timestamp: bigint, existingContracts?: ContractState[]) {
    const inputAssets = [{ address: staker, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return Staking.tests.unstake({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        amount: amount
      },
      inputAssets: inputAssets,
    });
  }

  function withdraw(state: ContractState<StakingTypes.Fields>, staker: string, timestamp: bigint, existingContracts?: ContractState[]) {
    const inputAssets = [{ address: staker, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return Staking.tests.withdraw({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      inputAssets: inputAssets,
    });
  }

  function depositRewards(state: ContractState<StakingTypes.Fields>, amount: bigint, existingContracts: ContractState[]) {
    return Staking.tests.depositRewards({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      testArgs: { amount: amount },
      inputAssets: [{ address: sender, asset: { alphAmount: DUST_AMOUNT * 100n + amount } }]
    });
  }

  function claimRewards(state: ContractState<StakingTypes.Fields>, staker: string, existingContracts: ContractState[]) {
    return Staking.tests.claimRewards({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      inputAssets: [{ address: staker, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    });
  }


  describe('Basic Staking Operations', () => {

    test('Executes a basic staking, unstaking, and withdrawal flow without errors', async () => {
      const stakeApadAmount = ONE_ALPH * 500n;

      const stakeRes = await stake(fixture.selfState, sender, 0n, stakeApadAmount, fixture.dependencies)
      expect(checkEvent(stakeRes, "Stake")).toBe(true);
      let state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)

      const unstakeRes = await unstake(state, sender, stakeApadAmount, BigInt(genesis), stakeRes.contracts)
      expect(checkEvent(unstakeRes, "Unstake")).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)

      const withdrawRes = await withdraw(state, sender, BigInt(genesis) + 259200001n, unstakeRes.contracts)
      expect(checkEvent(withdrawRes, "Withdraw")).toBe(true);
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)
    });

    test('Performs staking, unstaking, and withdrawal twice to validate multiple operations', async () => {
      const stakeApadAmount = ONE_ALPH * 500n;
      const unstakePeriod = 259200001n;

      let stakeRes = await stake(fixture.selfState, sender, 0n, stakeApadAmount, fixture.dependencies)
      let state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)
      stakeRes = await stake(state, sender, 0n, stakeApadAmount, stakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)

      let unstakeRes = await unstake(state, sender, stakeApadAmount, BigInt(genesis), stakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)
      let withdrawRes = await withdraw(state, sender, BigInt(genesis) + unstakePeriod, unstakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)

      unstakeRes = await unstake(state, sender, stakeApadAmount, BigInt(genesis) + unstakePeriod, withdrawRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)
      withdrawRes = await withdraw(state, sender, BigInt(genesis) + unstakePeriod * 2n, unstakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)
    });

    test('Ensures early withdrawal ahead of unstaking period fails, then completes the process correctly', async () => {
      const stakeApadAmount = ONE_ALPH * 500n;
      const unstakePeriod = 259200001n;

      let stakeRes = await stake(fixture.selfState, sender, 0n, stakeApadAmount, fixture.dependencies)
      let state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)
      stakeRes = await stake(state, sender, 0n, stakeApadAmount, stakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)

      let unstakeRes = await unstake(state, sender, stakeApadAmount, BigInt(genesis), stakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId)
      await expectAssertionError(withdraw(state, sender, BigInt(genesis) + (unstakePeriod - 100n), unstakeRes.contracts), state.address, Number(Staking.consts.ErrorCodes.UnstakeNotClaimable))
      let withdrawRes = await withdraw(state, sender, BigInt(genesis) + (unstakePeriod), unstakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)


      unstakeRes = await unstake(state, sender, stakeApadAmount, BigInt(genesis) + unstakePeriod, withdrawRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)
      await expectAssertionError(withdraw(state, sender, BigInt(genesis) + (unstakePeriod - 100n) * 2n, unstakeRes.contracts), state.address, Number(Staking.consts.ErrorCodes.UnstakeNotClaimable))
      withdrawRes = await withdraw(state, sender, BigInt(genesis) + (unstakePeriod) * 2n, unstakeRes.contracts)
      state = getContractState<StakingTypes.Fields>(withdrawRes.contracts, fixture.contractId)
    });
  });

  describe('Reward Distribution Functionality', () => {

    test('Distribute rewards and claim by a single staker', async () => {
      const stakeAmount = ONE_ALPH * 1000n;
      const rewardAmount = ONE_ALPH * 1000n;

      let stakeRes = await stake(fixture.selfState, sender, 0n, stakeAmount, fixture.dependencies);
      let state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      const pendingRewards = await getPendingRewards(state, sender, stakeRes.contracts);
      expect(pendingRewards.returns).toBe(rewardAmount);


      stakeRes = await claimRewards(state, sender, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: sender, amount: rewardAmount })).toBe(true);
    });

    test('Distribute rewards among multiple stakers and claim', async () => {
      const stakeAmount1 = ONE_ALPH * 2000n;
      const stakeAmount2 = ONE_ALPH * 5000n;
      const stakeAmount3 = ONE_ALPH * 3000n;
      const rewardAmount = ONE_ALPH * 5n;
      const staker1 = randomP2PKHAddress();
      const staker2 = randomP2PKHAddress();
      const staker3 = randomP2PKHAddress();

      // First staker stakes
      var stakeRes = await stake(fixture.selfState, staker1, 0n, stakeAmount1, fixture.dependencies);
      var state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Second staker stakes
      stakeRes = await stake(state, staker2, 0n, stakeAmount2, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Third staker stakes
      stakeRes = await stake(state, staker3, 0n, stakeAmount3, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Verify rewards for all stakers
      const pendingRewards1 = await getPendingRewards(state, staker1, stakeRes.contracts);
      const pendingRewards2 = await getPendingRewards(state, staker2, stakeRes.contracts);
      const pendingRewards3 = await getPendingRewards(state, staker3, stakeRes.contracts);

      // All stakers claim rewards
      stakeRes = await claimRewards(state, staker1, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward")).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      stakeRes = await claimRewards(state, staker2, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward")).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      stakeRes = await claimRewards(state, staker3, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward")).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      expect(pendingRewards1.returns).toBe((rewardAmount / 10n) * 2n);
      expect(pendingRewards2.returns).toBe((rewardAmount / 10n) * 5n);
      expect(pendingRewards3.returns).toBe((rewardAmount / 10n) * 3n);
    });

    test('Rewards distribution after staggered staking and unstaking', async () => {
      const stakeAmount1 = ONE_ALPH * 2000n;
      const stakeAmount2 = ONE_ALPH * 5000n;
      const stakeAmount3 = ONE_ALPH * 3000n;
      const rewardAmount = ONE_ALPH * 100n;
      const staker1 = randomP2PKHAddress();
      const staker2 = randomP2PKHAddress();
      const staker3 = randomP2PKHAddress();

      // First staker stakes
      var stakeRes = await stake(fixture.selfState, staker1, 0n, stakeAmount1, fixture.dependencies);
      var state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Second staker stakes
      stakeRes = await stake(state, staker2, 0n, stakeAmount2, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Third staker stakes
      stakeRes = await stake(state, staker3, 0n, stakeAmount3, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Rewards for staker3
      var pendingRewards = await getPendingRewards(state, staker3, stakeRes.contracts);
      expect(pendingRewards.returns).toBe(ONE_ALPH * 30n)
      stakeRes = await unstake(state, staker3, stakeAmount3, BigInt(genesis), stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker3, amount: ONE_ALPH * 30n })).toBe(true);
      expect(checkEvent(stakeRes, "Unstake", { account: staker3, amount: stakeAmount3 })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Rewards for staker2
      pendingRewards = await getPendingRewards(state, staker2, stakeRes.contracts);
      expect(pendingRewards.returns).toBe(192857142857142857142n)
      stakeRes = await unstake(state, staker2, stakeAmount2, BigInt(genesis), stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker2, amount: 192857142857142857142n })).toBe(true);
      expect(checkEvent(stakeRes, "Unstake", { account: staker2, amount: stakeAmount2 })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Rewards for staker1
      pendingRewards = await getPendingRewards(state, staker1, stakeRes.contracts);
      expect(pendingRewards.returns).toBe(277142857142857142857n)
      stakeRes = await unstake(state, staker1, stakeAmount1, BigInt(genesis), stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker1, amount: 277142857142857142857n })).toBe(true);
      expect(checkEvent(stakeRes, "Unstake", { account: staker1, amount: stakeAmount1 })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);
    });



    test('Rewards distribution after staggered multi staking and unstaking', async () => {
      const stakeAmount1 = ONE_ALPH * 5000n;
      const stakeAmount2 = ONE_ALPH * 5000n;
      const rewardAmount = ONE_ALPH * 100n;
      const staker1 = randomP2PKHAddress();
      const staker2 = randomP2PKHAddress();

      // First staker stakes
      var stakeRes = await stake(fixture.selfState, staker1, 0n, stakeAmount1, fixture.dependencies);
      expect(checkEvent(stakeRes, "Stake", { account: staker1, amount: stakeAmount1 })).toBe(true);
      var state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Second staker stakes
      stakeRes = await stake(state, staker2, 0n, stakeAmount2, stakeRes.contracts);
      expect(checkEvent(stakeRes, "Stake", { account: staker2, amount: stakeAmount2 })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Fist staker tripples stake
      stakeRes = await stake(state, staker1, 0n, stakeAmount1 * 2n, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);
      expect(checkEvent(stakeRes, "Stake", { account: staker1, amount: stakeAmount1 * 2n })).toBe(true);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker1, amount: 150n * ONE_ALPH })).toBe(true);

      // Distribute rewards
      stakeRes = await depositRewards(state, rewardAmount, stakeRes.contracts);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Rewards for staker2
      stakeRes = await claimRewards(state, staker2, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker2, amount: 75n * ONE_ALPH })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);

      // Rewards for staker1
      stakeRes = await claimRewards(state, staker1, stakeRes.contracts);
      expect(checkEvent(stakeRes, "ClaimReward", { account: staker1, amount: 75n * ONE_ALPH })).toBe(true);
      state = getContractState<StakingTypes.Fields>(stakeRes.contracts, fixture.contractId);
    });
  });

  describe('Vested Staking Operations', () => {

    test('Stakes tokens with a vesting schedule and verifies the release schedule at different intervals', async () => {
      const stakeApadAmount = ONE_ALPH * 15000000n;
      const teamVesting = 126227808000n; // 4 years

      var stateRes = await stake(fixture.selfState, sender, teamVesting, stakeApadAmount, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId)

      var accountContract = await getSubContractId(state, sender, stateRes.contracts);
      var stateStakingAccount = getContractState<StakingAccountTypes.Fields>(stateRes.contracts, accountContract.returns)

      var calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis), stateRes.contracts);
      expect(calcVested.returns).toBe(0n);

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 1n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 1n));

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 3n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 3n));

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 7n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 7n));

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 10n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 10n));

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 12n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 10n));
    });

    test('Stakes tokens with vesting, then unstakes and withdraws at correct intervals, validating the process', async () => {
      const stakeApadAmount = ONE_ALPH * 15000000n;
      const teamVesting = 126227808000n; // 4 years
      const unstakePeriod = 259200001n;

      var stateRes = await stake(fixture.selfState, sender, teamVesting, stakeApadAmount, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId)

      var accountContract = await getSubContractId(state, sender, stateRes.contracts);
      var stateStakingAccount = getContractState<StakingAccountTypes.Fields>(stateRes.contracts, accountContract.returns)

      var calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis), stateRes.contracts);
      expect(calcVested.returns).toBe(0n);

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 3n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 3n));

      await expectAssertionError(unstake(state, sender, calcVested.returns + 1n, BigInt(genesis) + ((teamVesting / 10n) * 3n), stateRes.contracts), stateStakingAccount.address, Number(StakingAccount.consts.ErrorCodes.AmountNotVested));
      stateRes = await unstake(state, sender, calcVested.returns, BigInt(genesis) + ((teamVesting / 10n) * 3n), stateRes.contracts);
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId);
      stateRes = await withdraw(state, sender, BigInt(genesis) + ((teamVesting / 10n) * 3n) + (unstakePeriod), stateRes.contracts)
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId)
      stateStakingAccount = getContractState<StakingAccountTypes.Fields>(stateRes.contracts, accountContract.returns);

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 7n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 4n));

      await expectAssertionError(unstake(state, sender, calcVested.returns + 1n, BigInt(genesis) + ((teamVesting / 10n) * 7n), stateRes.contracts), stateStakingAccount.address, Number(StakingAccount.consts.ErrorCodes.AmountNotVested));
      stateRes = await unstake(state, sender, calcVested.returns, BigInt(genesis) + ((teamVesting / 10n) * 7n), stateRes.contracts);
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId);
      stateRes = await withdraw(state, sender, BigInt(genesis) + ((teamVesting / 10n) * 7n) + (unstakePeriod), stateRes.contracts)
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId)
      stateStakingAccount = getContractState<StakingAccountTypes.Fields>(stateRes.contracts, accountContract.returns);

      calcVested = await calcVestedClaimable(stateStakingAccount, BigInt(genesis) + ((teamVesting / 10n) * 12n), stateRes.contracts);
      expect(calcVested.returns).toBe(((stakeApadAmount / 10n) * 3n));

      await expectAssertionError(unstake(state, sender, calcVested.returns + 1n, BigInt(genesis) + ((teamVesting / 10n) * 12n), stateRes.contracts), stateStakingAccount.address, Number(StakingAccount.consts.ErrorCodes.InsufficientBalance));
      stateRes = await unstake(state, sender, calcVested.returns, BigInt(genesis) + ((teamVesting / 10n) * 12n), stateRes.contracts);
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId);
      stateRes = await withdraw(state, sender, BigInt(genesis) + ((teamVesting / 10n) * 12n) + (unstakePeriod), stateRes.contracts)
      state = getContractState<StakingTypes.Fields>(stateRes.contracts, fixture.contractId)
      stateStakingAccount = getContractState<StakingAccountTypes.Fields>(stateRes.contracts, accountContract.returns);
      expect(stateStakingAccount).toBe(undefined)
    });
  });
});
