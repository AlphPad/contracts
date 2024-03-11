import { web3, Project, ALPH_TOKEN_ID, ONE_ALPH, ContractInstance, DUST_AMOUNT } from '@alephium/web3'
import { transfer } from '@alephium/web3-test'
import { DeployContractExecutionResult, Deployments, deployToDevnet } from '@alephium/cli'
import { PrivateKeyWallet } from '@alephium/web3-wallet';
import { Staking, StakingStakeTX, StakingUnstakeTX, StakingInstance, StakingClaimTX, RewardDistributorAddRewardsTX, RewardDistributorInstance, RewardDistributor, RewardDistributorHarvestTX, StakingClaimRewardsTX } from '../../artifacts/ts'
import configuration from '../../alephium.config'
import { add18Decimals, balanceOf, deployedContractNotFound, sleep } from '../utils';
import { getSigner } from '@alephium/web3-test'


describe('Staking Contracts Tests', () => {
  let signer: PrivateKeyWallet;
  let deployments: Deployments;
  let token: DeployContractExecutionResult<ContractInstance>;
  let tokenId: string;
  let tokenAddress: string;
  let testAddress: string;
  let rd: DeployContractExecutionResult<ContractInstance>;
  let rdInstance: RewardDistributorInstance;
  let staking: DeployContractExecutionResult<ContractInstance>;
  let stakingContract: StakingInstance;

  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    await Project.build()
    signer = await getSigner(100n * ONE_ALPH, 0)
    deployments = await deployToDevnet()

    testAddress = signer.address;
    const testGroup = 0
    // Fetch APAD Information
    token = deployments.getDeployedContractResult(testGroup, 'ApadToken') || deployedContractNotFound("ApadToken");
    tokenId = token.contractInstance.contractId
    tokenAddress = token.contractInstance.address

    rd = deployments.getDeployedContractResult(testGroup, 'RewardDistributor') || deployedContractNotFound("RewardDistributor");
    rdInstance = RewardDistributor.at(rd.contractInstance.address);
    staking = deployments.getDeployedContractResult(testGroup, 'Staking') || deployedContractNotFound("Staking");
    stakingContract = Staking.at(staking.contractInstance.address);
    // Transfer ALPH & APAD for testing
    const genesisWallet = new PrivateKeyWallet({ privateKey: configuration.networks.devnet.privateKeys[0] })
    await transfer(genesisWallet, testAddress, ALPH_TOKEN_ID, add18Decimals(1100n))
    await transfer(genesisWallet, testAddress, tokenId, add18Decimals(10n))
  }, 10000)

  it('Verifies the test address has a positive balance of ALPH and APAD tokens', async () => {
    const alphBalance = await balanceOf(ALPH_TOKEN_ID, testAddress);
    expect(alphBalance).toBeGreaterThan(0n);
    const apadBalance = await balanceOf(tokenId, testAddress);
    expect(apadBalance).toBeGreaterThan(0n);
  }, 20000)

  it('Confirms Staking is deployed with staking token APAD and reward token ALPH', async () => {
    const t = (await stakingContract.methods.getStakingTokenId()).returns;
    expect(t).toBe(tokenId);
    const r = (await stakingContract.methods.getRewardsTokenId()).returns;
    expect(r).toBe(ALPH_TOKEN_ID);
  }, 20000)

  it('Confirms staking account does not exist', async () => {
    const res1 = (await stakingContract.methods.accountExists({ args: { account: testAddress } })).returns
    expect(res1).toBe(false);
  }, 20000)

  it('Confirms staking work and transfers balances', async () => {
    let stakerExists = (await stakingContract.methods.accountExists({ args: { account: testAddress } })).returns
    expect(stakerExists).toBe(false)
    const apadBalance = await balanceOf(tokenId, testAddress);
    expect(apadBalance).toBeGreaterThan(0n);
    let tokenAmount = add18Decimals(10n);
    await StakingStakeTX.execute(signer, {
      initialFields: {
        staking: staking.contractInstance.contractId,
        amount: tokenAmount,
        vestingPeriod: 0n
      },
      attoAlphAmount: ONE_ALPH,
      tokens: [
        {
          amount: tokenAmount,
          id: tokenId
        }
      ]
    })
    stakerExists = (await stakingContract.methods.accountExists({ args: { account: testAddress } })).returns
    expect(stakerExists).toBe(true)
    const apadBalanceAfter = await balanceOf(tokenId, testAddress);
    expect(apadBalance).toBe(apadBalanceAfter + tokenAmount);
  }, 20000)

  it('Confirms reward distributor add reward, harvest and claim work', async () => {
    await RewardDistributorAddRewardsTX.execute(signer, {
      initialFields: {
        rd: rd.contractInstance.contractId,
        amount: 1000n * ONE_ALPH
      },
      attoAlphAmount: 1000n * ONE_ALPH
    });
    const rdTotalRewardsAfter = (await rdInstance.methods.getTotalPendingRewards()).returns;
    expect(rdTotalRewardsAfter).toBe(add18Decimals(1000n));


    const stakerRewards = (await stakingContract.methods.getRewardPerToken()).returns
    expect(stakerRewards).toBe(0n);
    await sleep(10000);
    await RewardDistributorHarvestTX.execute(signer, {
      initialFields: {
        rd: rd.contractInstance.contractId
      },
      attoAlphAmount: DUST_AMOUNT
    });
    const stakerRewardsAfter = (await stakingContract.methods.getRewardPerToken()).returns
    expect(stakerRewardsAfter).toBeGreaterThan(0n);

    const alphBalance = await balanceOf(ALPH_TOKEN_ID, testAddress);
    const apadClaimable = (await stakingContract.methods.getPendingRewards({ args: { staker: testAddress } })).returns;
    expect(apadClaimable).toBeGreaterThan(0n);
    await StakingClaimRewardsTX.execute(signer, {
      initialFields: {
        staking: staking.contractInstance.contractId,
      },
      attoAlphAmount: DUST_AMOUNT,
    })
    const alphBalanceAfter = await balanceOf(ALPH_TOKEN_ID, testAddress);
    const apadClaimableAfter = (await stakingContract.methods.getPendingRewards({ args: { staker: testAddress } })).returns;
    expect(apadClaimableAfter).toBe(0n);
    expect(alphBalanceAfter).toBeGreaterThan(alphBalance);
  }, 20000)

  it('Confirms unstake and withdraw work', async () => {
    let stakerExists = (await stakingContract.methods.accountExists({ args: { account: testAddress } })).returns
    expect(stakerExists).toBe(true)
    const apadBalance = await balanceOf(tokenId, testAddress);
    const alphBalance = await balanceOf(ALPH_TOKEN_ID, testAddress);
    expect(apadBalance).toBe(0n);
    let tokenAmount = add18Decimals(10n);
    await StakingUnstakeTX.execute(signer, {
      initialFields: {
        staking: staking.contractInstance.contractId,
        amount: tokenAmount
      },
      attoAlphAmount: DUST_AMOUNT
    })
    await StakingClaimTX.execute(signer, {
      initialFields: {
        staking: staking.contractInstance.contractId
      },
      attoAlphAmount: DUST_AMOUNT
    })
    const apadBalanceAfterUnstake = await balanceOf(tokenId, testAddress);
    const alphBalanceAfterDestroy = await balanceOf(ALPH_TOKEN_ID, testAddress);
    expect(apadBalance + tokenAmount).toBe(apadBalanceAfterUnstake);
    expect((alphBalance + ONE_ALPH) / 10n ** 18n).toBe(alphBalanceAfterDestroy / 10n ** 18n);
  }, 20000)
})
