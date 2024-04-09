import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { DUST_AMOUNT } from '@alephium/web3'
import { ApadToken, ApadTokenMintTX } from '../artifacts/ts'

const deployApad: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  
  const issueTokenAmount = network.settings.issueTokenAmount
  const result = await deployer.deployContract(ApadToken, {
    issueTokenAmount: issueTokenAmount,
    initialFields: {
      minted: false,
      burned: 0n
    }
  })

  await deployer.runScript(ApadTokenMintTX, {
    initialFields: {
      token: result.contractInstance.contractId
    },
    attoAlphAmount: DUST_AMOUNT
  })
}

export default deployApad
