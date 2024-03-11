import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPH_TOKEN_ID, DUST_AMOUNT, ONE_ALPH, ZERO_ADDRESS } from '@alephium/web3'
import { RewardDistributor, StakingStakeTX, Staking, StakingAccount } from '../artifacts/ts'

const deployStaking: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const token = deployer.getDeployContractResult('ApadToken');
  const tokenId = token.contractInstance.contractId;

  const stakingAccount = await deployer.deployContract(StakingAccount, {
    initialFields: {
      amountStaked: 0n,
      parentContractAddress: ZERO_ADDRESS,
      accountHolder: ZERO_ADDRESS,
      amountUnstaked: 0n,
      beginUnstakeAt: 0n,
      vestedStart: 0n,
      vestedTill: 0n,
      vestedTotalAmount: 0n,
      rewardPerToken: 0n
    }
  })

  const staking = await deployer.deployContract(Staking, {
    initialFields: {
      amountStaked: 0n,
      rewardPerToken: 0n,
      stakingTokenId: tokenId,
      rewardsTokenId: ALPH_TOKEN_ID,
      unstakeLockTime: network.settings.rewards.unstakeLockTime,
      accountTemplateId: stakingAccount.contractInstance.contractId,
      owner: deployer.account.address,
      upgradeDelay: network.settings.upgradeDelay,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      upgradeCommenced: 0n
    }
  })

  const rewardDistributor = await deployer.deployContract(RewardDistributor, {
    initialFields: {
      accumulatedRewards: 0n,
      currentHarvestDistributed: 0n,
      currentHarvestEpoch: 0n,
      currentHarvestTotal: 0n,
      epochDuration: network.settings.rewards.rdEpochDuration,
      genesisDate: BigInt(Date.now()),
      rewardTokenId: ALPH_TOKEN_ID,
      stakingContract: staking.contractInstance.contractId,
      totalEpochs: 10n,
      totalRewards: "",
      owner: deployer.account.address,
      upgradeDelay: network.settings.upgradeDelay,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      upgradeCommenced: 0n
    }
  })

  const stakeResult = await deployer.runScript(StakingStakeTX, {
    initialFields: {
      staking: staking.contractInstance.contractId,
      amount: network.settings.team.tokenAmount,
      vestingPeriod: network.settings.team.tokenVestingPeriod
    },
    attoAlphAmount: ONE_ALPH + DUST_AMOUNT,
    tokens: [{ id: tokenId, amount: network.settings.team.tokenAmount }]
  })
}

export default deployStaking
