import { ALPH_TOKEN_ID, ContractState, DUST_AMOUNT, ONE_ALPH, binToHex, prettifyNumber, prettifyTokenAmount, sleep, tokenIdFromAddress, web3 } from '@alephium/web3'
import {
  buildProject,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  randomTokenId,
  createSaleBuyerTemplateAccount,
  createRewardDistributor,
  createStaking,
  createDummyToken,
  createApadToken,
  createBurnAlph,
  createSaleFlatPriceV3
} from './fixtures'
import { expectAssertionError, randomContractAddress, randomContractId } from '@alephium/web3-test'
import { SaleFlatPriceAlphV3, SaleFlatPriceAlphV3Types } from '../../artifacts/ts'
import { checkEvent } from '../utils'

describe('Sale Flat Price Contract Testing', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let seller: string
  let buyer1: string
  let buyer2: string
  let buyer3: string
  let wlBuyers: { address: string, proof: string, data: string }[]
  let wlRoot: string
  let bidTokenId: string
  let saleTokenId: string
  let saleStartDelay: bigint = 86400000n;
  let fixtureRegularSale: ContractFixture<SaleFlatPriceAlphV3Types.Fields>
  let fixtureWLAndRegularSale: ContractFixture<SaleFlatPriceAlphV3Types.Fields>
  let fixtureVestedSale: ContractFixture<SaleFlatPriceAlphV3Types.Fields>

  beforeEach(async () => {
    await buildProject()
    let saleToken = createApadToken();
    bidTokenId = ALPH_TOKEN_ID
    let bidToken = createDummyToken("ALPH", "Alephium", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID)
    saleTokenId = saleToken.contractId
    seller = randomP2PKHAddress()
    buyer1 = randomP2PKHAddress()
    buyer2 = randomP2PKHAddress()
    buyer3 = randomP2PKHAddress()
    wlRoot = "61bea4caa8aa240d3958d39800ab57b35f5b696c9869e0aeca2d4a697a62c081";
    wlBuyers = [
      {
        address: "16VPvbF1ShQsj8TappJWtoW6gRM1AEQXYqwo5rQ7BiAy3",
        proof: "a4e00636d6bcd965c8f7a1a5bf2a862f8b372746da508577a5387aced27e1d04",
        data: "16VPvbF1ShQsj8TappJWtoW6gRM1AEQXYqwo5rQ7BiAy3;1000000000000000000;921985800000000000000"
      },
      {
        address: "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH",
        proof: "20129657a48a2baa20791afe2e099bba290298fa66e7569b818233e0a4b01e36",
        data: "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH;1000000000000000000;78014200000000000000"
      }
    ]
    genesis = Date.now()
    let rewardDistributor = createRewardDistributor(BigInt(genesis), 1000n, 10n, randomContractId(), bidToken.states());
    let burnAlph = createBurnAlph(rewardDistributor.states());
    let accountTemplate = createSaleBuyerTemplateAccount(burnAlph.states());
    fixtureRegularSale = createSaleFlatPriceV3(
      rewardDistributor.contractId,
      seller,
      accountTemplate.contractId,
      5n * (10n ** 14n),
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 3n),
      100n * (10n ** 18n),
      30000n * (10n ** 18n),
      saleTokenId,
      600000000n * (10n ** 18n),
      bidTokenId,
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 2n),
      50n * (10n ** 18n),
      0n,
      wlRoot,
      BigInt(genesis) + (86400000n * 3n),
      50000n * (10n ** 18n),
      0n,
      BigInt(genesis) + (86400000n * 3n),
      accountTemplate.states()
    );

    fixtureVestedSale = createSaleFlatPriceV3(
      rewardDistributor.contractId,
      seller,
      accountTemplate.contractId,
      4n * (10n ** 15n),
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 3n),
      100n * (10n ** 18n),
      30000n * (10n ** 18n),
      saleTokenId,
      7500000n * (10n ** 18n),
      bidTokenId,
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 2n),
      75n * (10n ** 18n),
      0n,
      wlRoot,
      BigInt(genesis) + (86400000n * 3n) + (86400000n * 91n),
      150n * (10n ** 18n),
      5000n,
      BigInt(genesis) + (86400000n * 3n) + (86400000n * 365n),
      accountTemplate.states()
    );

    fixtureWLAndRegularSale = createSaleFlatPriceV3(
      rewardDistributor.contractId,
      seller,
      accountTemplate.contractId,
      5n * (10n ** 14n),
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 3n),
      20000n * (10n ** 18n),
      30000n * (10n ** 18n),
      saleTokenId,
      600000000n * (10n ** 18n),
      bidTokenId,
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 2n),
      10000n * (10n ** 18n),
      0n,
      wlRoot,
      BigInt(genesis) + (86400000n * 3n),
      30000n * (10n ** 18n),
      0n,
      BigInt(genesis) + (86400000n * 3n),
      accountTemplate.states()
    );
  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function calculateTokensReceivedPerAlph(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, alphAmount: bigint, existingContracts: ContractState[]) {
    return SaleFlatPriceAlphV3.tests.calculateSaleTokensReceivedPerBidTokens({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: genesis,
      testArgs: {
        bidAmount: alphAmount,
        pricePerToken: state.fields.tokenPrice
      }
    });
  }



  function getBuyerAccount(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, buyer: string, existingContracts: ContractState[]) {
    return SaleFlatPriceAlphV3.tests.getSubContractId({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: genesis,
      testArgs: {
        account: buyer
      }
    });
  }


  async function calculateClaimableAmount(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, buyer: string, timestamp: bigint, existingContracts: ContractState[]) {
    var bAccount = await getBuyerAccount(state, buyer, existingContracts);
    return await SaleFlatPriceAlphV3.tests.calculateClaimableAmount({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        buyerAccount: bAccount.returns
      }
    });
  }

  function buy(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, buyer: string, amount: bigint, wlProof: string, wlData: string, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: buyer, asset: { alphAmount: (DUST_AMOUNT * 100n) + ONE_ALPH + amount } }]
    return SaleFlatPriceAlphV3.tests.buy({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        bidAmount: amount,
        wlMerkleProof: wlProof,
        wlMaxBid: BigInt(wlData.split(";")[2]),
        wlPrice: BigInt(wlData.split(";")[1]),
        stateRentAmount: 10n ** 17n
      },
      inputAssets: inputAssets,
    });
  }

  function claim(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, claimer: string, amount: bigint, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: claimer, asset: { alphAmount: (ONE_ALPH) } }]
    return SaleFlatPriceAlphV3.tests.claim({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        amount: amount
      },
      inputAssets: inputAssets,
    });
  }

  function claimRefund(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, claimer: string, amount: bigint, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: claimer, asset: { alphAmount: ONE_ALPH } }]
    return SaleFlatPriceAlphV3.tests.claimRefund({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        amount: amount
      },
      inputAssets: inputAssets,
    });
  }



  function updateMerkle(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, caller: string, newMerkle: string, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: ONE_ALPH } }]
    return SaleFlatPriceAlphV3.tests.setMerkleRoot({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        newMerkleRoot: newMerkle
      },
      inputAssets: inputAssets,
    });
  }


  function updateSaleDate(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, caller: string, newSaleStart: bigint, newSaleEnd: bigint, newWhitelistSaleStart: bigint, newWhitelistSaleEnd: bigint, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: ONE_ALPH } }]
    return SaleFlatPriceAlphV3.tests.setSaleDates({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        newSaleStart,
        newSaleEnd,
        newWhitelistSaleStart,
        newWhitelistSaleEnd
      },
      inputAssets: inputAssets,
    });
  }

  function accountExists(state: ContractState<SaleFlatPriceAlphV3Types.Fields>, address: string, existingContracts: ContractState[]) {
    return SaleFlatPriceAlphV3.tests.accountExists({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: genesis,
      testArgs: {
        account: address
      }
    });
  }


  describe('Regular Sale Functionality', () => {

    test('Buyer account should not exist before any transaction', async () => {
      var result = await accountExists(fixtureRegularSale.selfState, buyer1, fixtureRegularSale.dependencies);
      expect(result.returns).toBe(false);
    });

    test('Correctly calculates tokens received for various ALPH amounts on 18 decimal token', async () => {

      var result = await calculateTokensReceivedPerAlph(fixtureRegularSale.selfState, 10n * (10n ** 18n), fixtureRegularSale.dependencies)
      expect(result.returns).toBe(20000n * 10n ** 18n);
      result = await calculateTokensReceivedPerAlph(fixtureRegularSale.selfState, 50n * (10n ** 18n), fixtureRegularSale.dependencies)
      expect(result.returns).toBe(100000n * 10n ** 18n);
      result = await calculateTokensReceivedPerAlph(fixtureRegularSale.selfState, 100n * (10n ** 18n), fixtureRegularSale.dependencies)
      expect(result.returns).toBe(200000n * 10n ** 18n);
      result = await calculateTokensReceivedPerAlph(fixtureRegularSale.selfState, 25n * (10n ** 18n), fixtureRegularSale.dependencies)
      expect(result.returns).toBe(50000n * 10n ** 18n);
    });

    test('Correctly calculates tokens received for various ALPH amounts on 0 decimal token with decimal price', async () => {
      const saleToken = createDummyToken("a", "a", 0n, 777777n, []);
      const bidToken = createDummyToken("Alephium", "ALPH", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID);
      const saleTokenId = tokenIdFromAddress(saleToken.address);
      const burnAlph = createBurnAlph(bidToken.states());
      const sale = createSaleFlatPriceV3(
        randomContractId(),
        seller,
        randomContractId(),
        7n * (10n ** 16n),
        BigInt(genesis),
        BigInt(genesis) + (86400000n * 3n),
        1361108n * (10n ** 8n),
        2722216n * (10n ** 18n),
        binToHex(saleTokenId),
        38888n,
        ALPH_TOKEN_ID,
        0n,
        0n,
        0n,
        0n,
        "",
        BigInt(genesis) + (86400000n * 3n),
        50n * (10n ** 18n),
        0n,
        BigInt(genesis) + (86400000n * 3n),
        burnAlph.states())
      var result = await calculateTokensReceivedPerAlph(sale.selfState, 7n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(100n);
    });


    test('Correctly calculates tokens received for various ALPH amounts on 4 decimal token with decimal price', async () => {
      const saleToken = createDummyToken("a", "a", 4n, 10000000n * (10n ** 18n), []);
      const bidToken = createDummyToken("Alephium", "ALPH", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID);
      const saleTokenId = tokenIdFromAddress(saleToken.address);
      const burnAlph = createBurnAlph(bidToken.states());
      const sale = createSaleFlatPriceV3(
        randomContractId(),
        seller,
        randomContractId(),
        1n * (10n ** 15n),
        BigInt(genesis),
        BigInt(genesis) + (86400000n * 3n),
        5000n * (10n ** 18n),
        10000n * (10n ** 18n),
        binToHex(saleTokenId),
        100000000n * (10n ** 4n),
        ALPH_TOKEN_ID,
        0n,
        0n,
        0n,
        0n,
        "",
        BigInt(genesis) + (86400000n * 3n),
        50n * (10n ** 18n),
        0n,
        BigInt(genesis) + (86400000n * 3n),
        burnAlph.states())
      var result = await calculateTokensReceivedPerAlph(sale.selfState, 10n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(10000n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 50n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(50000n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 100n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(100000n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 25n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(25000n * 10n ** 4n);
    });

    test('Correctly calculates tokens received for various ALPH amounts on 4 decimal token with big price', async () => {
      const saleToken = createDummyToken("a", "a", 4n, 10000000n * (10n ** 18n), []);
      const bidToken = createDummyToken("Alephium", "ALPH", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID);
      const saleTokenId = tokenIdFromAddress(saleToken.address);
      const burnAlph = createBurnAlph(bidToken.states());
      const sale = createSaleFlatPriceV3(
        randomContractId(),
        seller,
        randomContractId(),
        5n * (10n ** 18n),
        BigInt(genesis),
        BigInt(genesis) + (86400000n * 3n),
        5000n * (10n ** 18n),
        10000n * (10n ** 18n),
        binToHex(saleTokenId),
        2000n * (10n ** 4n),
        ALPH_TOKEN_ID,
        0n,
        0n,
        0n,
        0n,
        "",
        BigInt(genesis) + (86400000n * 3n),
        50n * (10n ** 18n),
        0n,
        BigInt(genesis) + (86400000n * 3n),
        burnAlph.states())
      var result = await calculateTokensReceivedPerAlph(sale.selfState, 10n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(2n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 50n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(10n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 100n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(20n * 10n ** 4n);
      result = await calculateTokensReceivedPerAlph(sale.selfState, 25n * (10n ** 18n), sale.dependencies)
      expect(result.returns).toBe(5n * 10n ** 4n);
    });

    test('Prevents buying tokens with more than 18 decimals', async () => {
      const saleToken = createDummyToken("a", "a", 19n, 10000000n * (10n ** 18n), []);
      const bidToken = createDummyToken("Alephium", "ALPH", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID);
      const saleTokenId = tokenIdFromAddress(saleToken.address);
      const burnAlph = createBurnAlph(bidToken.states());
      const sale = createSaleFlatPriceV3(
        randomContractId(),
        seller,
        randomContractId(),
        1n * (10n ** 17n),
        BigInt(genesis),
        BigInt(genesis) + (86400000n * 3n),
        5000n * (10n ** 18n),
        10000n * (10n ** 18n),
        binToHex(saleTokenId),
        1000000n * (10n ** 18n),
        ALPH_TOKEN_ID,
        BigInt(genesis),
        BigInt(genesis) + (86400000n * 2n),
        50n * (10n ** 18n),
        0n,
        "",
        BigInt(genesis) + (86400000n * 3n),
        50n * (10n ** 18n),
        0n,
        BigInt(genesis) + (86400000n * 3n),
        burnAlph.states())

      await expectAssertionError(calculateTokensReceivedPerAlph(sale.selfState, 10n * (10n ** 18n), sale.dependencies), sale.address, Number(SaleFlatPriceAlphV3.consts.ErrorCodes.SaleTokenMoreThan18Decimal));
    });

    test('Prevents buying outside sale dates and allows during sale dates', async () => {
      await expectAssertionError(buy(fixtureRegularSale.selfState, wlBuyers[0].address, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1), fixtureRegularSale.dependencies), fixtureRegularSale.address, Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotLive));
      await expectAssertionError(buy(fixtureRegularSale.selfState, wlBuyers[0].address, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 3n), fixtureRegularSale.dependencies), fixtureRegularSale.address, Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotLive));
      var result = await buy(fixtureRegularSale.selfState, wlBuyers[0].address, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
    });

    test('Prevents claiming within sale period, allows after sale completion and target achievement', async () => {
      var accExistsResult = await accountExists(fixtureRegularSale.selfState, wlBuyers[0].address, fixtureRegularSale.dependencies);
      expect(accExistsResult.returns).toBe(false);

      var result = await buy(fixtureRegularSale.selfState, wlBuyers[0].address, 50n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId)
      await expectAssertionError(claim(state, wlBuyers[0].address, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 2n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotFinished));
      await expectAssertionError(claim(state, wlBuyers[0].address, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleClaimNotAvailable));

      var accExistsResult = await accountExists(state, wlBuyers[0].address, result.contracts);
      expect(accExistsResult.returns).toBe(true);

      result = await buy(state, wlBuyers[0].address, 50n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId)
      expect(checkEvent<null>(result, "Buy")).toBe(true);

      result = await claim(state, seller, 100n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimSeller")).toBe(true);
      expect(checkEvent<null>(result, "RewardAdded")).toBe(true);

      result = await claim(state, wlBuyers[0].address, 100n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimBuyer")).toBe(true);
    });

    test('Prevents claiming refund within sale period, allows after sale completion and target not achievement', async () => {
      var result = await buy(fixtureRegularSale.selfState, wlBuyers[0].address, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId)

      await expectAssertionError(claimRefund(state, wlBuyers[0].address, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 2n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotFinished));

      result = await buy(state, wlBuyers[0].address, 20n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId)
      expect(checkEvent<null>(result, "Buy", { account: wlBuyers[0].address, buyBidAmount: 20n * (10n ** 18n), buyTokenAmount: 20n * (10n ** 18n) })).toBe(true);

      result = await claimRefund(state, wlBuyers[0].address, 30n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimBuyerRefund", { account: wlBuyers[0].address, bidTokenAmount: 30n * (10n ** 18n) })).toBe(true);

      result = await claimRefund(state, seller, 600000000n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimSellerRefund", { account: seller, saleTokenAmount: BigInt(6e8) * (10n ** 18n) })).toBe(true);
    });
  })

  describe('Vested Sale Functionality', () => {
    test('Amounts should correctly calculate for vesting', async () => {
      var result = await buy(fixtureVestedSale.selfState, wlBuyers[0].address, 150n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId)

      result = await buy(state, wlBuyers[1].address, 75n * (10n ** 18n), wlBuyers[1].proof, wlBuyers[1].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      var vestedAmount = await calculateClaimableAmount(state, wlBuyers[0].address, BigInt(genesis + 1) + (86400000n * 4n), result.contracts);
      expect(vestedAmount.returns).toBe(75n * 10n ** 18n);

      var vestedAmount = await calculateClaimableAmount(state, wlBuyers[1].address, BigInt(genesis + 1) + (86400000n * 4n), result.contracts);
      expect(vestedAmount.returns).toBe(375n * 10n ** 17n);

      var vestedAmount = await calculateClaimableAmount(state, wlBuyers[0].address, BigInt(genesis - 1) + (86400000n * 940n), result.contracts);
      expect(vestedAmount.returns).toBe(150n * 10n ** 18n);
    });

    test('Amounts should correctly calculate for vesting after claims', async () => {
      var result = await buy(fixtureVestedSale.selfState, buyer1, 150n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId)

      result = await buy(state, buyer2, 75n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      result = await buy(state, buyer3, 50n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      result = await claim(state, seller, 275n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      var vestedAmount = await calculateClaimableAmount(state, buyer3, BigInt(genesis + 1) + (86400000n * 4n), result.contracts);
      expect(vestedAmount.returns).toBe(6250n * 10n ** 18n);

      await expectAssertionError(
        claim(state, buyer3, 6260n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 4n), result.contracts),
        fixtureVestedSale.address,
        Number(SaleFlatPriceAlphV3.consts.ErrorCodes.InvalidClaimAmount)
      );

      result = await claim(state, buyer3, 6250n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 4n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);


      var vestedAmount = await calculateClaimableAmount(state, buyer3, BigInt(genesis + 1) + (86400000n * 4n), result.contracts);
      expect(vestedAmount.returns).toBe(0n);

      await expectAssertionError(
        claim(state, buyer3, 1000n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 4n), result.contracts),
        fixtureVestedSale.address,
        Number(SaleFlatPriceAlphV3.consts.ErrorCodes.InvalidClaimAmount)
      );

      var vestedAmount = await calculateClaimableAmount(state, buyer3, BigInt(genesis + 1) + (86400000n * 94n), result.contracts);
      expect(vestedAmount.returns / 10n ** 18n).toBe(1558n);

      result = await claim(state, buyer3, 1558n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 94n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      await expectAssertionError(
        claim(state, buyer3, 1000n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 94n), result.contracts),
        fixtureVestedSale.address,
        Number(SaleFlatPriceAlphV3.consts.ErrorCodes.InvalidClaimAmount)
      );

      var vestedAmount = await calculateClaimableAmount(state, buyer3, BigInt(genesis + 1) + (86400000n * 185n), result.contracts);
      expect(vestedAmount.returns / 10n ** 18n).toBe(1558n);

      result = await claim(state, buyer3, 1558n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 185n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);

      var vestedAmount = await calculateClaimableAmount(state, buyer3, BigInt(genesis + 1) + (86400000n * 390n), result.contracts);
      expect(vestedAmount.returns / 10n ** 18n).toBe(3134n);

      result = await claim(state, buyer3, 3134n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 390n), result.contracts);
      state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureVestedSale.contractId);
    });
  })


  describe('Assertions Functionality', () => {
    test("Should fail if the sale is not live", async () => {
      await expectAssertionError(
        buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1), fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotLive)
      );
    });
    test("Should fail if the sale owner attempts to buy", async () => {
      await expectAssertionError(
        buy(fixtureRegularSale.selfState, seller, 10n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + saleStartDelay, fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.ErrorCodes.SaleOwnerCanNotBid)
      );
    });
    test("Claiming tokens should fail if the sale is not finished", async () => {
      await expectAssertionError(
        claim(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1), fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleNotFinished)
      );
    });
    test("Claiming tokens should fail if the sale conditions for claiming are not met", async () => {
      await expectAssertionError(
        claim(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1) + saleStartDelay * 3n, fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleClaimNotAvailable)
      );
    });
    test("Claiming refund should fail if the conditions for refund are not met", async () => {
      var result = await buy(fixtureRegularSale.selfState, wlBuyers[0].address, 101n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + saleStartDelay, fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureRegularSale.contractId)
      await expectAssertionError(
        claimRefund(state, buyer1, 101n * (10n ** 18n), BigInt(genesis + 1) + saleStartDelay * 4n, result.contracts),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleRefundNotAvailable)
      );
    });
    test("Setting Merkle Root should fail if the merkle root is not the correct size", async () => {
      await expectAssertionError(
        updateMerkle(fixtureWLAndRegularSale.selfState, seller, "", BigInt(genesis + 1), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.InvalidMerkleRoot)
      );
    });
    test("Setting Merkle Root should pass if the sale has not started", async () => {
      var result = await updateMerkle(fixtureWLAndRegularSale.selfState, seller, wlRoot, BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies);
      expect(checkEvent(result, "UpdateRoot")).toBe(true);
    });
    test("Setting Merkle Root should fail if the sale has already started", async () => {
      await expectAssertionError(
        updateMerkle(fixtureWLAndRegularSale.selfState, seller, wlRoot, BigInt(genesis + 86400001), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleCanNotBeEditedAtThisTime)
      );
    });
    test("Setting Merkle Root should fail if caller is not owner", async () => {
      await expectAssertionError(
        updateMerkle(fixtureWLAndRegularSale.selfState, buyer1, wlRoot, BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleUpdateUnauthorized)
      );
    });



    test("Setting Sale Dates should pass if the sale has not started", async () => {
      var result = await updateSaleDate(fixtureWLAndRegularSale.selfState, seller,
        BigInt(genesis + (86300000 + 1800000)),
        BigInt(genesis + (86300000 + 2 * 1800000)),
        BigInt(genesis + (86300000 + 1800000)),
        BigInt(genesis + (86300000 + 2 * 1800000)),
        BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies);
      expect(checkEvent(result, "SaleDatesUpdate")).toBe(true);
    });
    test("Setting Sale Dates should fail if the sale has already started", async () => {
      await expectAssertionError(
        updateSaleDate(fixtureWLAndRegularSale.selfState, seller,
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          0n,
          0n
          , BigInt(genesis + (86400001)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleCanNotBeEditedAtThisTime)
      );
    });
    test("Setting Sale Dates should fail if caller is not owner", async () => {
      await expectAssertionError(
        updateSaleDate(fixtureWLAndRegularSale.selfState, buyer1,
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          0n,
          0n
          , BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.SaleUpdateUnauthorized)
      );
    });
    test("Setting Sale Dates should fail if value is out of range", async () => {
      await expectAssertionError(
        updateSaleDate(fixtureWLAndRegularSale.selfState, seller,
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          BigInt(genesis + (86300000 + 1700000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.WLSaleStartMustBeWithinSaleDates)
      );
      await expectAssertionError(
        updateSaleDate(fixtureWLAndRegularSale.selfState, seller,
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1900000)),
          BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.WLSaleEndMustBeWithinSaleDatesAndAfterWLSaleStart)
      );
      await expectAssertionError(
        updateSaleDate(fixtureWLAndRegularSale.selfState, seller,
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 2 * 1800000)),
          BigInt(genesis + (86300000 + 1800000)),
          BigInt(genesis + (86300000 + 1700000)),
          BigInt(genesis + (86300000 - 1800000)), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlphV3.consts.SaleBaseErrorCodes.WLSaleEndMustBeWithinSaleDatesAndAfterWLSaleStart)
      );
    });
  })

  /*
    describe('Whitelist (WL) Sale Functionality', () => {
      test('Allows WL buyers to bid within the WL period', async () => {
        var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: wlBuyers[0].address, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
      });
  
      test('Allows WL buyers to Check Eligibility', async () => {
        const result = await SaleFlatPriceAlphV3.tests.checkIsWhitelisted({
          testArgs: {
            account: wlBuyers[0].address,
            wlMerkleProof: wlBuyers[0].proof,
            wlMaxBid: BigInt(wlBuyers[0].data.split(";")[2]),
            wlPrice: BigInt(wlBuyers[0].data.split(";")[1])
          },
          initialFields: fixtureWLAndRegularSale.selfState.fields,
          initialAsset: fixtureWLAndRegularSale.selfState.asset,
          address: fixtureWLAndRegularSale.address,
          existingContracts: fixtureWLAndRegularSale.dependencies,
          blockTimeStamp: Number(genesis),
        })
        expect(result.returns).toBe(true)
  
        const result2 = await SaleFlatPriceAlphV3.tests.checkIsWhitelisted({
          testArgs: {
            account: wlBuyers[0].address,
            wlMerkleProof: wlBuyers[1].proof,
            wlMaxBid: BigInt(wlBuyers[1].data.split(";")[2]),
            wlPrice: BigInt(wlBuyers[1].data.split(";")[1])
          },
          initialFields: fixtureWLAndRegularSale.selfState.fields,
          initialAsset: fixtureWLAndRegularSale.selfState.asset,
          address: fixtureWLAndRegularSale.address,
          existingContracts: fixtureWLAndRegularSale.dependencies,
          blockTimeStamp: Number(genesis),
        })
        expect(result2.returns).toBe(false)
      });
  
      test('Prevents WL buyers from bidding more than max', async () => {
        var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10000n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        await expectAssertionError(buy(state, wlBuyers[0].address, 10000n * (10n ** 18n), wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts), fixtureWLAndRegularSale.address, Number(SaleFlatPriceAlphV3.consts.ErrorCodes.BidMoreThanMax));
      });
  
      test('Prevents non-WL buyers from bidding during the WL period', async () => {
        await expectAssertionError(buy(fixtureWLAndRegularSale.selfState, buyer2, 10n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies), fixtureWLAndRegularSale.address, Number(SaleFlatPriceAlphV3.consts.ErrorCodes.BuyerNotWhitelisted));
      });
  
      test('Allows non-WL buyers to bid after the WL period concludes', async () => {
        var result = await buy(fixtureWLAndRegularSale.selfState, buyer2, 10n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 2n), fixtureWLAndRegularSale.dependencies);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: buyer2, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
      });
  
      test('Facilitates multiple WL buyers to bid in WL period, and non-WL buyers post WL period', async () => {
        var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: wlBuyers[0].address, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
  
        var result = await buy(state, wlBuyers[1].address, 20n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: wlBuyers[1].address, buyBidAmount: 20n * ONE_ALPH, buyTokenAmount: 40000n * ONE_ALPH })).toBe(true)
  
        var result = await buy(state, buyer1, 10n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: buyer1, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
  
        var result = await buy(state, buyer2, 20n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: buyer2, buyBidAmount: 20n * ONE_ALPH, buyTokenAmount: 40000n * ONE_ALPH })).toBe(true)
  
        var result = await buy(state, buyer3, 30n * ONE_ALPH, wlBuyers[0].proof, wlBuyers[0].data, BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
        var state = getContractState<SaleFlatPriceAlphV3Types.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
        expect(checkEvent(result, "Buy", { account: buyer3, buyBidAmount: 30n * ONE_ALPH, buyTokenAmount: 60000n * ONE_ALPH })).toBe(true)
      });

})
    */
})
