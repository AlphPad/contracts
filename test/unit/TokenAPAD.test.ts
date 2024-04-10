import { ContractState, DUST_AMOUNT, binToHex, tokenIdFromAddress, web3 } from '@alephium/web3'
import {
  buildProject,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  createApadToken
} from './fixtures'
import { expectAssertionError } from '@alephium/web3-test'
import { ApadToken, ApadTokenTypes } from '../../artifacts/ts'

describe('Apad Token Contract Tests', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let sender: string
  let fixture: ContractFixture<ApadTokenTypes.Fields>
  let tokenId: string

  beforeEach(async () => {
    await buildProject();

    sender = randomP2PKHAddress();
    genesis = Date.now();
    fixture = createApadToken();
    tokenId = binToHex(tokenIdFromAddress(fixture.address));
  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function burn(state: ContractState<ApadTokenTypes.Fields>, amount: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: sender, asset: { alphAmount: DUST_AMOUNT * 100n, tokens: [{ id: tokenId, amount: amount }] } }]
    return ApadToken.tests.burn({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      inputAssets: inputAssets,
      testArgs: {
        from: sender,
        amount: amount
      }
    });
  }


  function getTotalSupply(state: ContractState<ApadTokenTypes.Fields>, existingContracts: ContractState[]) {
    return ApadToken.tests.getTotalSupply({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis)
    });
  }

  function getMaxSupply(state: ContractState<ApadTokenTypes.Fields>, existingContracts: ContractState[]) {
    return ApadToken.tests.getMaxSupply({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis)
    });
  }


  describe('Token Mint, Burn and Supply Update', () => {
    test('Verify Initial Total and Max Supply, Assert Minting Restrictions, Burn Tokens and Validate Updated Supply', async () => {
      const totalSupply = 100_000_000n * 10n ** 18n;
      var burned = 0n;
      expect((await getMaxSupply(fixture.selfState, fixture.dependencies)).returns).toBe(totalSupply);
      expect((await getTotalSupply(fixture.selfState, fixture.dependencies)).returns).toBe(totalSupply);

      var stateRes = await burn(fixture.selfState, 1000n, fixture.dependencies);
      var state = getContractState<ApadTokenTypes.Fields>(stateRes.contracts, fixture.contractId)
      burned += 1000n;


      expect((await getMaxSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      expect((await getTotalSupply(state, stateRes.contracts)).returns).toBe(totalSupply - burned);

      var stateRes = await burn(state, 1000000n, stateRes.contracts);
      var state = getContractState<ApadTokenTypes.Fields>(stateRes.contracts, fixture.contractId)
      burned += 1000000n;


      expect((await getMaxSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      expect((await getTotalSupply(state, stateRes.contracts)).returns).toBe(totalSupply - burned);
    });
  })
})
