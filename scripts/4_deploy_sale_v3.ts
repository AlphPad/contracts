import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPH_TOKEN_ID, binToHex, contractIdFromAddress, DUST_AMOUNT, stringToHex, ZERO_ADDRESS } from '@alephium/web3'
import { ApadToken, BurnALPH, DummyToken, RewardDistributor, SaleBuyerAccount, SaleFlatPriceAlph, SaleFlatPriceAlphV2, SaleFlatPriceAlphV3, SaleManager, SaleManagerV2, SaleManagerV3, Staking, StakingAccount, TokenPair } from '../artifacts/ts'

const deployStaking: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const rewardDistributor = deployer.getDeployContractResult('RewardDistributor');

  const buyerTemplateAccount = await deployer.deployContract(SaleBuyerAccount, {
    initialFields: {
      accountHolder: ZERO_ADDRESS,
      amountBid: 0n,
      amountBuy: 0n,
      amountClaimed: 0n,
      amountClaimedRefund: 0n,
      parentContractAddress: ZERO_ADDRESS
    }
  })

  const flatpriceSaleAlphTemplate = await deployer.deployContract(SaleFlatPriceAlphV3, {
    initialFields: {
      accountTemplateId: buyerTemplateAccount.contractInstance.contractId,
      bidTokenId: ALPH_TOKEN_ID,
      maxRaise: 0n,
      merkleRoot: "",
      minRaise: 0n,
      rewardDistributor: rewardDistributor.contractInstance.contractId,
      saleEnd: 0n,
      saleOwner: ZERO_ADDRESS,
      saleStart: 0n,
      saleTokenId: ZERO_ADDRESS,
      saleTokenTotalAmount: 0n,
      tokenPrice: 0n,
      tokensSold: 0n,
      totalRaised: 0n,
      whitelistSaleEnd: 0n,
      whitelistSaleStart: 0n,
      cliffEnd: 0n,
      publicSaleMaxBid: 0n,
      sellerClaimed: 0n,
      upfrontRelease: 0n,
      vestingEnd: 0n
    }
  })

  const saleManager = await deployer.deployContract(SaleManagerV3, {
    initialFields: {
      alphTokenId: ALPH_TOKEN_ID,
      listingFeeAmount: 100n * (10n ** 6n),
      rewardDistributor: rewardDistributor.contractInstance.contractId,
      accountTemplateId: buyerTemplateAccount.contractInstance.contractId,
      saleFlatPriceAlphTemplateId: flatpriceSaleAlphTemplate.contractInstance.contractId,
      saleCounter: 0n,
      listingCounter: 1000000n,
      owner: deployer.account.address,
      listingsReviewer: deployer.account.address,
      upgradeDelay: 0n,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      upgradeCommenced: 0n
    }
  })
}

export default deployStaking
