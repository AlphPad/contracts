import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { DUST_AMOUNT } from '@alephium/web3'
import { ApadToken } from '../artifacts/ts'

const deployApad: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {

  const issueTokenAmount = network.settings.issueTokenAmount
  const result = await deployer.deployContract(ApadToken, {
    issueTokenAmount: issueTokenAmount,
    issueTokenTo: deployer.account.address,
    initialFields: {
      maxSupply: network.settings.issueTokenAmount,
      burned: 0n
    }
  })
}

export default deployApad
