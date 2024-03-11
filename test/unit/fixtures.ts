import {
  Address,
  addressFromContractId,
  ALPH_TOKEN_ID,
  Asset,
  binToHex,
  contractIdFromAddress,
  tokenIdFromAddress,
  ContractState,
  ONE_ALPH,
  Fields,
  groupOfAddress,
  number256ToBigint,
  Project,
  Token,
  ZERO_ADDRESS
} from '@alephium/web3'
import { expectAssertionError, randomContractId, testAddress, randomContractAddress } from '@alephium/web3-test'
import { randomBytes } from 'crypto'
import * as base58 from 'bs58'
import { ApadToken, ApadTokenTypes, RewardDistributor, RewardDistributorTypes, Staking, StakingTypes, StakingAccount, StakingAccountTypes, SaleFlatPrice, SaleBuyerAccount, TokenPair, SaleManager, TestUpgradable } from '../../artifacts/ts'


export class ContractFixture<F extends Fields> {
  selfState: ContractState<F>
  dependencies: ContractState[]
  address: string
  contractId: string

  states(): ContractState[] {
    return this.dependencies.concat([this.selfState])
  }

  constructor(selfState: ContractState<F>, dependencies: ContractState[], address: string) {
    this.selfState = selfState
    this.dependencies = dependencies
    this.address = address
    this.contractId = selfState.contractId
  }
}

export async function buildProject(): Promise<void> {
  if (typeof Project.currentProject === 'undefined') {
    await Project.build({ ignoreUnusedConstantsWarnings: true })
  }
}


export function getContractState<T extends Fields>(contracts: ContractState[], contractId: string): ContractState<T> {
  return contracts.find((c) => c.contractId === contractId)! as ContractState<T>
}

export function randomTokenId(): string {
  return binToHex(randomBytes(32))
}

export function randomP2PKHAddress(groupIndex = 0): string {
  const prefix = Buffer.from([0x00])
  const bytes = Buffer.concat([prefix, randomBytes(32)])
  const address = base58.encode(bytes)
  if (groupOfAddress(address) === groupIndex) {
    return address
  }
  return randomP2PKHAddress(groupIndex)
}

export function createRewardDistributor(
  genesis: bigint,
  epochDuration: bigint,
  totalEpochs: bigint,
  stakingContract: string,
  dependencies: ContractState[],
  contractId?: string,
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = RewardDistributor.stateForTest(
    {
      accumulatedRewards: 0n,
      epochDuration: epochDuration,
      genesisDate: genesis,
      totalEpochs: totalEpochs,
      totalRewards: "",
      rewardTokenId: ALPH_TOKEN_ID,
      currentHarvestDistributed: 0n,
      currentHarvestEpoch: 0n,
      currentHarvestTotal: 0n,
      stakingContract: stakingContract,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      owner: ZERO_ADDRESS,
      upgradeCommenced: 0n,
      upgradeDelay: 604800000n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}

export function createApadToken(
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = ApadToken.stateForTest(
    {
      minted: false,
      burned: 0n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: [{ id: binToHex(tokenIdFromAddress(address)), amount: 100_000_000n * 10n ** 18n }]
    },
    address
  )
  return new ContractFixture(contractState, [], address)
}

export function createTestUpgradable(
  owner: string,
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = TestUpgradable.stateForTest(
    {
      immValue: 1n,
      mutValue: 2n,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      owner: owner,
      upgradeCommenced: 0n,
      upgradeDelay: 604800000n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: [{ id: ALPH_TOKEN_ID, amount: 100_000_000n * 10n ** 18n }]
    },
    address
  )
  return new ContractFixture(contractState, [], address)
}

export function createTemplateStakingAccount(
  dependencies: ContractState[],
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = StakingAccount.stateForTest(
    {
      amountStaked: 0n,
      amountUnstaked: 0n,
      beginUnstakeAt: 0n,
      parentContractAddress: ZERO_ADDRESS,
      rewardPerToken: 0n,
      accountHolder: ZERO_ADDRESS,
      vestedStart: 0n,
      vestedTill: 0n,
      vestedTotalAmount: 0n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}

export function createStaking(
  apadTokenId: string,
  stakingAccountTemplateId: string,
  dependencies: ContractState[],
  initialStaked: bigint,
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = Staking.stateForTest(
    {
      stakingTokenId: apadTokenId,
      rewardsTokenId: ALPH_TOKEN_ID,
      amountStaked: initialStaked,
      rewardPerToken: 0n,
      accountTemplateId: stakingAccountTemplateId,
      unstakeLockTime: 259200000n,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      owner: ZERO_ADDRESS,
      upgradeCommenced: 0n,
      upgradeDelay: 604800000n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}


export function createSaleBuyerTemplateAccount(
  dependencies: ContractState[],
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = SaleBuyerAccount.stateForTest(
    {
      accountHolder: ZERO_ADDRESS,
      amountBid: 0n,
      amountBuy: 0n,
      amountClaimed: 0n,
      amountClaimedRefund: 0n,
      parentContractAddress: ZERO_ADDRESS
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}

export function createSaleFlatPrice(
  rewardDistributor: string,
  saleOwner: string,
  accountTemplateId: string,
  tokenPrice: bigint,
  saleStart: bigint,
  saleEnd: bigint,
  minRaise: bigint,
  maxRaise: bigint,
  saleTokenId: string,
  saleTokenTotalAmount: bigint,
  bidTokenId: string,
  whitelistSaleStart: bigint,
  whitelistSaleEnd: bigint,
  whitelistBuyerMaxBid: bigint,
  tokensSold: bigint,
  totalRaised: bigint,
  merkleRoot: string,
  dependencies: ContractState[],
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = SaleFlatPrice.stateForTest(
    {
      rewardDistributor: rewardDistributor,
      saleOwner: saleOwner,
      accountTemplateId: accountTemplateId,
      tokenPrice: tokenPrice,
      saleStart: saleStart,
      saleEnd: saleEnd,
      minRaise: minRaise,
      maxRaise: maxRaise,
      saleTokenId: saleTokenId,
      saleTokenTotalAmount: saleTokenTotalAmount,
      bidTokenId: bidTokenId,
      whitelistSaleStart: whitelistSaleStart,
      whitelistSaleEnd: whitelistSaleEnd,
      whitelistBuyerMaxBid: whitelistBuyerMaxBid,
      tokensSold: tokensSold,
      totalRaised: totalRaised,
      merkleRoot: merkleRoot,
    },
    {
      alphAmount: ONE_ALPH,
      tokens: [{ id: saleTokenId, amount: saleTokenTotalAmount }]
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}



export function createTokenPair(
  dependencies: ContractState[],
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = TokenPair.stateForTest(
    {
      token0Id: "0000000000000000000000000000000000000000000000000000000000000000",
      token1Id: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      reserve0: 482963678389001475101237n,
      reserve1: 1158354144971n,
      blockTimeStampLast: 1711272923n,
      price0CumulativeLast: 106836841546536540153097986132n,
      price1CumulativeLast: 63385262986297632636674035629216529767188163926182582n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}



export function createSaleManager(
  paidContractId: string,
  rewardDistributorContractId: string,
  dependencies: ContractState[],
  contractId?: string
) {
  const address = contractId ? addressFromContractId(contractId) : randomContractAddress()
  const contractState = SaleManager.stateForTest(
    {
      pair: paidContractId,
      alphTokenId: ALPH_TOKEN_ID,
      usdtTokenId: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      listingFeeAmount: 100n * (10n**6n),
      rewardDistributor: rewardDistributorContractId,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      owner: ZERO_ADDRESS,
      upgradeCommenced: 0n,
      upgradeDelay: 604800000n
    },
    {
      alphAmount: ONE_ALPH,
      tokens: []
    },
    address
  )
  return new ContractFixture(contractState, dependencies, address)
}