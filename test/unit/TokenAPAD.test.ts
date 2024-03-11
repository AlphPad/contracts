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
  function mint(state: ContractState<ApadTokenTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: sender, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return ApadToken.tests.mint({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      inputAssets: inputAssets,
      testArgs: {
        to: sender
      }
    });
  }

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

      var stateRes = await mint(fixture.selfState, fixture.dependencies)
      var state = getContractState<ApadTokenTypes.Fields>(stateRes.contracts, fixture.contractId)

      expect((await getMaxSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      expect((await getTotalSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      await expectAssertionError(mint(state, stateRes.contracts), fixture.address, Number(ApadToken.consts.ErrorCodes.TokensAlreadyMinted));

      var stateRes = await burn(state, 1000n, stateRes.contracts);
      var state = getContractState<ApadTokenTypes.Fields>(stateRes.contracts, fixture.contractId)
      burned += 1000n;


      expect((await getMaxSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      expect((await getTotalSupply(state, stateRes.contracts)).returns).toBe(totalSupply - burned);
      await expectAssertionError(mint(state, stateRes.contracts), fixture.address, Number(ApadToken.consts.ErrorCodes.TokensAlreadyMinted));

      var stateRes = await burn(state, 1000000n, stateRes.contracts);
      var state = getContractState<ApadTokenTypes.Fields>(stateRes.contracts, fixture.contractId)
      burned += 1000000n;


      expect((await getMaxSupply(state, stateRes.contracts)).returns).toBe(totalSupply);
      expect((await getTotalSupply(state, stateRes.contracts)).returns).toBe(totalSupply - burned);
      await expectAssertionError(mint(state, stateRes.contracts), fixture.address, Number(ApadToken.consts.ErrorCodes.TokensAlreadyMinted));
    });
  })
})
