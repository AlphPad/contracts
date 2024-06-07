import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPH_TOKEN_ID, binToHex, contractIdFromAddress, DUST_AMOUNT, stringToHex, ZERO_ADDRESS } from '@alephium/web3'
import { ApadToken, BurnALPH, DummyToken, RewardDistributor, SaleBuyerAccount, SaleFlatPriceAlph, SaleFlatPriceAlphV2, SaleManager, SaleManagerV2, Staking, StakingAccount, TokenPair } from '../artifacts/ts'

const deployStaking: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const rewardDistributor = deployer.getDeployContractResult('RewardDistributor');

  const buyerTemplateAccount = deployer.getDeployContractResult('SaleBuyerAccount');

  let tokenPair = deployer.getDeployContractResult('TokenPair');
  let tokenPairAddress = tokenPair.contractInstance.address;

  const flatpriceSaleAlphTemplate = await deployer.deployContract(SaleFlatPriceAlphV2, {
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
      whitelistBuyerMaxBid: 0n,
      whitelistSaleEnd: 0n,
      whitelistSaleStart: 0n,
      cliffEnd: 0n,
      publicSaleMaxBid: 0n,
      sellerClaimed: 0n,
      upfrontRelease: 0n,
      vestingEnd: 0n
    }
  })

  const saleManager = await deployer.deployContract(SaleManagerV2, {
    initialFields: {
      pair: binToHex(contractIdFromAddress(tokenPairAddress)),
      alphTokenId: ALPH_TOKEN_ID,
      usdtTokenId: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      listingFeeAmount: 100n * (10n ** 6n),
      rewardDistributor: rewardDistributor.contractInstance.contractId,
      accountTemplateId: buyerTemplateAccount.contractInstance.contractId,
      saleFlatPriceAlphTemplateId: flatpriceSaleAlphTemplate.contractInstance.contractId,
      saleCounter: 0n,
      owner: deployer.account.address,
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
