import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ALPH_TOKEN_ID, binToHex, contractIdFromAddress, DUST_AMOUNT, SignerProvider, stringToHex, waitForTxConfirmation, ZERO_ADDRESS } from '@alephium/web3'
import { ApadToken, BurnALPH, DummyToken, RewardDistributor, SaleBuyerAccount, SaleFlatPriceAlph, SaleFlatPriceAlphV2, SaleFlatPriceAlphV3, SaleManager, SaleManagerV2, SaleManagerV3, SaleManagerV3x1, Staking, StakingAccount, TokenPair } from '../artifacts/ts'
import { PrivateKeyWallet } from '@alephium/web3-wallet'

const deployStaking: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const saleManagerV3 = deployer.getDeployContractResult('SaleManagerV3');
  var signer = new PrivateKeyWallet({ privateKey: network.privateKeys[0]});
  var res = await SaleManagerV3.at(saleManagerV3.contractInstance.address).transact.resetUpgrade({
    signer: signer
  })
  console.log(res);
  var confirmed = await waitForTxConfirmation(res.txId,1,100);
  var state = await SaleManagerV3.at(saleManagerV3.contractInstance.address).fetchState();
  console.log(state);
  var res = await SaleManagerV3.at(saleManagerV3.contractInstance.address).transact.migrate({
    args: {
      changeCode: SaleManagerV3x1.contract.bytecode
    },
    signer: signer
  })
  var confirmed = await waitForTxConfirmation(res.txId,1,100);
  console.log(res);
  var newState = await SaleManagerV3x1.at(saleManagerV3.contractInstance.address).fetchState();
  console.log(newState);
  res = await SaleManagerV3.at(saleManagerV3.contractInstance.address).transact.migrateApply({
    signer: signer
  })
  console.log(res);
  newState = await SaleManagerV3x1.at(saleManagerV3.contractInstance.address).fetchState();
  console.log(newState);
}

export default deployStaking
