import { web3, Project, DUST_AMOUNT, ALPH_TOKEN_ID, ONE_ALPH, ContractInstance } from '@alephium/web3'
import { getSigner, transfer } from '@alephium/web3-test'
import { DeployContractExecutionResult, Deployments, deployToDevnet } from '@alephium/cli'
import { PrivateKeyWallet } from '@alephium/web3-wallet';
import { ApadToken, ApadTokenBurnTX } from '../../artifacts/ts'
import configuration from '../../alephium.config'
import { add18Decimals, balanceOf, deployedContractNotFound } from '../utils';


describe('APAD Token Tests', () => {
  let signer: PrivateKeyWallet;
  let deployments: Deployments;
  let token: DeployContractExecutionResult<ContractInstance>;
  let tokenId: string;
  let tokenAddress: string;
  let testAddress: string;

  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    await Project.build()
    signer = await getSigner(100n * ONE_ALPH, 0)
    deployments = await deployToDevnet()

    testAddress = signer.address
    const testGroup = 0
    // Fetch APAD Information
    token = deployments.getDeployedContractResult(testGroup, 'ApadToken') || deployedContractNotFound("ApadToken");
    tokenId = token.contractInstance.contractId
    tokenAddress = token.contractInstance.address
    // Transfer ALPH & APAD for testing
    const genesisWallet = new PrivateKeyWallet({ privateKey: configuration.networks.devnet.privateKeys[0] })
    await transfer(genesisWallet, testAddress, ALPH_TOKEN_ID, add18Decimals(10n))
    await transfer(genesisWallet, testAddress, tokenId, add18Decimals(10n))
  }, 10000)

  it('Verifies the test address has a positive balance of ALPH and APAD tokens', async () => {
    const alphBalance = await balanceOf(ALPH_TOKEN_ID, testAddress);
    expect(alphBalance).toBeGreaterThan(0n);
    const apadBalance = await balanceOf(tokenId, testAddress);
    expect(apadBalance).toBeGreaterThan(0n);
  }, 20000)

  it('Confirms burning APAD tokens reduces the total supply accordingly', async () => {
    const supply = (await ApadToken.at(tokenAddress).methods.getTotalSupply()).returns;
    const apadBalance = await balanceOf(tokenId, testAddress);
    await ApadTokenBurnTX.execute(signer, {
      initialFields: {
        token: token.contractInstance.contractId,
        amount: 10n * ONE_ALPH
      },
      attoAlphAmount: DUST_AMOUNT,
      tokens: [
        {
          amount: 10n * ONE_ALPH,
          id: tokenId
        }
      ]
    })
    const supplyAfterBurn = (await ApadToken.at(tokenAddress).methods.getTotalSupply()).returns;
    const apadBalanceAfterBurn = await balanceOf(tokenId, testAddress);
    expect(supply).toBe(supplyAfterBurn + 10n * ONE_ALPH);
    expect(apadBalance).toBe(apadBalanceAfterBurn + 10n * ONE_ALPH);
  }, 20000)
})
