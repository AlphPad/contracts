import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPH_TOKEN_ID, binToHex, contractIdFromAddress, DUST_AMOUNT, ZERO_ADDRESS } from '@alephium/web3'
import { ApadToken, RewardDistributor, SaleBuyerAccount, SaleFlatPrice, SaleManager, Staking, StakingAccount, TokenPair } from '../artifacts/ts'

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

  const flatpriceSaleTemplate = await deployer.deployContract(SaleFlatPrice, {
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
      whitelistSaleStart: 0n
    }
  })

  let tokenPairAddress = network.settings.sale.tokenPair;
  if (tokenPairAddress == "") {
    const tokenPair = await deployer.deployContract(TokenPair, {
      initialFields: {
        token0Id: "0000000000000000000000000000000000000000000000000000000000000000",
        token1Id: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
        reserve0: 482963678389001475101237n,
        reserve1: 1158354144971n,
        blockTimeStampLast: 1711272923n,
        price0CumulativeLast: 106836841546536540153097986132n,
        price1CumulativeLast: 63385262986297632636674035629216529767188163926182582n
      }
    })
    tokenPairAddress = tokenPair.contractInstance.address;
  }

  const saleManager = await deployer.deployContract(SaleManager, {
    initialFields: {
      pair: binToHex(contractIdFromAddress(tokenPairAddress)),
      alphTokenId: ALPH_TOKEN_ID,
      usdtTokenId: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      listingFeeAmount: 100n * (10n**6n),
      rewardDistributor: rewardDistributor.contractInstance.contractId,
      owner: deployer.account.address,
      upgradeDelay: network.settings.upgradeDelay,
      newCode: "",
      newImmFieldsEncoded: "",
      newMutFieldsEncoded: "",
      newOwner: ZERO_ADDRESS,
      upgradeCommenced: 0n
    }
  })
}

export default deployStaking