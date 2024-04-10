import { ALPH_TOKEN_ID, ContractState, DUST_AMOUNT, ONE_ALPH, binToHex, prettifyNumber, prettifyTokenAmount, sleep, tokenIdFromAddress, web3 } from '@alephium/web3'
import {
  buildProject,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  randomTokenId,
  createSaleFlatPrice,
  createSaleBuyerTemplateAccount,
  createRewardDistributor,
  createStaking,
  createDummyToken,
  createApadToken,
  createBurnAlph
} from './fixtures'
import { expectAssertionError, randomContractAddress, randomContractId } from '@alephium/web3-test'
import { SaleFlatPriceAlph, SaleFlatPriceAlphTypes } from '../../artifacts/ts'
import { checkEvent } from '../utils'

describe('Sale Flat Price Contract Testing', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let seller: string
  let buyer1: string
  let buyer2: string
  let buyer3: string
  let wlBuyers: { address: string, proof: string }[]
  let wlRoot: string
  let bidTokenId: string
  let saleTokenId: string
  let saleStartDelay: bigint = 86400000n;
  let fixtureRegularSale: ContractFixture<SaleFlatPriceAlphTypes.Fields>
  let fixtureWLAndRegularSale: ContractFixture<SaleFlatPriceAlphTypes.Fields>

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
    wlRoot = "e6b1ce6419692f40f03b9070d311763f463c54a81bb85839783d30b28e2abfd6";
    wlBuyers = [
      {
        address: "16VPvbF1ShQsj8TappJWtoW6gRM1AEQXYqwo5rQ7BiAy3",
        proof: "5bf9416e80fbe25a8fcb4df38b0a7c0f96852bdbbb0ff505aaf8e06f9688bfa4"
      },
      {
        address: "1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH",
        proof: "37cd615f09ed6d3bcfde606c17eeaa6a8d89db32fb35f129f2a845a1a1d3f4fc"
      }
    ]
    genesis = Date.now()
    let rewardDistributor = createRewardDistributor(BigInt(genesis), 1000n, 10n, randomContractId(), bidToken.states());
    let burnAlph = createBurnAlph(rewardDistributor.states());
    let accountTemplate = createSaleBuyerTemplateAccount(burnAlph.states());
    fixtureRegularSale = createSaleFlatPrice(
      burnAlph.contractId,
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
      50n * (10n ** 18n),
      0n,
      0n,
      "",
      accountTemplate.states()
    );

    fixtureWLAndRegularSale = createSaleFlatPrice(
      burnAlph.contractId,
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
      0n,
      wlRoot,
      accountTemplate.states()
    );
  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function calculateTokensReceivedPerAlph(state: ContractState<SaleFlatPriceAlphTypes.Fields>, alphAmount: bigint, existingContracts: ContractState[]) {
    return SaleFlatPriceAlph.tests.calculateSaleTokensReceivedPerBidTokens({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: genesis,
      testArgs: {
        bidAmount: alphAmount
      }
    });
  }

  function buy(state: ContractState<SaleFlatPriceAlphTypes.Fields>, buyer: string, amount: bigint, wlProof: string, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: buyer, asset: { alphAmount: (DUST_AMOUNT * 100n) + ONE_ALPH + amount } }]
    return SaleFlatPriceAlph.tests.buy({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(timestamp),
      testArgs: {
        bidAmount: amount,
        wlMerkleProof: wlProof
      },
      inputAssets: inputAssets,
    });
  }

  function claim(state: ContractState<SaleFlatPriceAlphTypes.Fields>, claimer: string, amount: bigint, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: claimer, asset: { alphAmount: (DUST_AMOUNT * 150n) } }]
    return SaleFlatPriceAlph.tests.claim({
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

  function claimRefund(state: ContractState<SaleFlatPriceAlphTypes.Fields>, claimer: string, amount: bigint, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: claimer, asset: { alphAmount: (DUST_AMOUNT * 150n) } }]
    return SaleFlatPriceAlph.tests.claimRefund({
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



  function updateMerkle(state: ContractState<SaleFlatPriceAlphTypes.Fields>, caller: string, newMerkle: string, timestamp: bigint, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: (DUST_AMOUNT * 150n) } }]
    return SaleFlatPriceAlph.tests.setMerkleRoot({
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

  function accountExists(state: ContractState<SaleFlatPriceAlphTypes.Fields>, address: string, existingContracts: ContractState[]) {
    return SaleFlatPriceAlph.tests.accountExists({
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

    test('Correctly calculates tokens received for various ALPH amounts on 4 decimal token with decimal price', async () => {
      const saleToken = createDummyToken("a", "a", 4n, 10000000n * (10n ** 18n), []);
      const bidToken = createDummyToken("Alephium", "ALPH", 18n, 10000000n * (10n ** 18n), saleToken.states(), ALPH_TOKEN_ID);
      const saleTokenId = tokenIdFromAddress(saleToken.address);
      const burnAlph = createBurnAlph(bidToken.states());
      const sale = createSaleFlatPrice(
        burnAlph.contractId,
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
        0n,
        "",
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
      const sale = createSaleFlatPrice(
        burnAlph.contractId,
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
        0n,
        "",
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
      const sale = createSaleFlatPrice(
        burnAlph.contractId,
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
        0n,
        "",
        burnAlph.states())

      await expectAssertionError(calculateTokensReceivedPerAlph(sale.selfState, 10n * (10n ** 18n), sale.dependencies), sale.address, Number(SaleFlatPriceAlph.consts.ErrorCodes.SaleTokenMoreThan18Decimal));
    });

    test('Prevents buying outside sale dates and allows during sale dates', async () => {
      await expectAssertionError(buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1), fixtureRegularSale.dependencies), fixtureRegularSale.address, Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotLive));
      await expectAssertionError(buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 3n), fixtureRegularSale.dependencies), fixtureRegularSale.address, Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotLive));
      var result = await buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
    });

    test('Prevents claiming within sale period, allows after sale completion and target achievement', async () => {
      var accExistsResult = await accountExists(fixtureRegularSale.selfState, buyer1, fixtureRegularSale.dependencies);
      expect(accExistsResult.returns).toBe(false);

      var result = await buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)

      await expectAssertionError(claim(state, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 2n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotFinished));
      await expectAssertionError(claim(state, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleClaimNotAvailable));

      var accExistsResult = await accountExists(state, buyer1, result.contracts);
      expect(accExistsResult.returns).toBe(true);

      result = await buy(state, buyer1, 20000n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)
      expect(checkEvent<null>(result, "Buy")).toBe(true);

      result = await claim(state, buyer1, 40020000n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimBuyer")).toBe(true);

      result = await claim(state, seller, 20010n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimSeller")).toBe(true);
      expect(checkEvent<null>(result, "RewardAdded")).toBe(true);
    });

    test('Prevents claiming refund within sale period, allows after sale completion and target not achievement', async () => {
      var result = await buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 1n), fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)

      await expectAssertionError(claimRefund(state, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 2n), result.contracts), fixtureRegularSale.address, Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotFinished));

      result = await buy(state, buyer1, 20n * (10n ** 18n), "", BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)
      expect(checkEvent<null>(result, "Buy", { account: buyer1, buyBidAmount: 20n * (10n ** 18n), buyTokenAmount: 40000n * (10n ** 18n) })).toBe(true);

      result = await claimRefund(state, buyer1, 30n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimBuyerRefund", { account: buyer1, bidTokenAmount: 30n * (10n ** 18n) })).toBe(true);

      result = await claimRefund(state, seller, 600000000n * (10n ** 18n), BigInt(genesis + 1) + (86400000n * 3n), result.contracts);
      state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId);
      expect(checkEvent<null>(result, "ClaimSellerRefund", { account: seller, saleTokenAmount: BigInt(6e8) * (10n ** 18n) })).toBe(true);
    });
  })

  describe('Assertions Functionality', () => {
    test("Should fail if the sale is not live", async () => {
      await expectAssertionError(
        buy(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), "", BigInt(genesis + 1), fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotLive)
      );
    });
    test("Should fail if the sale owner attempts to buy", async () => {
      await expectAssertionError(
        buy(fixtureRegularSale.selfState, seller, 10n * (10n ** 18n), "", BigInt(genesis + 1) + saleStartDelay, fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.ErrorCodes.SaleOwnerCanNotBid)
      );
    });
    test("Should fail if the sale exceeds the total token amount", async () => {
      var result = await buy(fixtureRegularSale.selfState, buyer1, 200000n * (10n ** 18n), "", BigInt(genesis + 1) + saleStartDelay, fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)
      await expectAssertionError(
        buy(state, buyer1, 150000n * (10n ** 18n), "", BigInt(genesis + 1) + saleStartDelay, result.contracts),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.ErrorCodes.SaleTokenTotalExceeded)
      );
    });
    test("Claiming tokens should fail if the sale is not finished", async () => {
      await expectAssertionError(
        claim(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1), fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleNotFinished)
      );
    });
    test("Claiming tokens should fail if the sale conditions for claiming are not met", async () => {
      await expectAssertionError(
        claim(fixtureRegularSale.selfState, buyer1, 10n * (10n ** 18n), BigInt(genesis + 1) + saleStartDelay * 3n, fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleClaimNotAvailable)
      );
    });
    test("Claiming refund should fail if the conditions for refund are not met", async () => {
      var result = await buy(fixtureRegularSale.selfState, buyer1, 20000n * (10n ** 18n), "", BigInt(genesis + 1) + saleStartDelay, fixtureRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureRegularSale.contractId)
      await expectAssertionError(
        claimRefund(state, buyer1, 20000n * (10n ** 18n), BigInt(genesis + 1) + saleStartDelay * 4n, result.contracts),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleRefundNotAvailable)
      );
    });
    test("Setting Merkle Root should fail if the sale is not WL Sale", async () => {
      await expectAssertionError(
        updateMerkle(fixtureRegularSale.selfState, seller, wlRoot, BigInt(genesis + 1), fixtureRegularSale.dependencies),
        fixtureRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleIsNotWLSale)
      );
    });
    test("Setting Merkle Root should fail if the sale has already started", async () => {
      await expectAssertionError(
        updateMerkle(fixtureWLAndRegularSale.selfState, seller, wlRoot, BigInt(genesis + 1), fixtureWLAndRegularSale.dependencies),
        fixtureWLAndRegularSale.address,
        Number(SaleFlatPriceAlph.consts.SaleBaseErrorCodes.SaleAlreadyStarted)
      );
    });
  })

  describe('Whitelist (WL) Sale Functionality', () => {
    test('Allows WL buyers to bid within the WL period', async () => {
      var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10n * ONE_ALPH, wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: wlBuyers[0].address, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
    });

    test('Prevents WL buyers from bidding more than max', async () => {
      var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10000n * (10n ** 18n), wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      await expectAssertionError(buy(state, wlBuyers[0].address, 10000n * (10n ** 18n), wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 1n), result.contracts), fixtureWLAndRegularSale.address, Number(SaleFlatPriceAlph.consts.ErrorCodes.BidMoreThanMax));
    });

    test('Prevents non-WL buyers from bidding during the WL period', async () => {
      await expectAssertionError(buy(fixtureWLAndRegularSale.selfState, buyer2, 10n * ONE_ALPH, wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies), fixtureWLAndRegularSale.address, Number(SaleFlatPriceAlph.consts.ErrorCodes.BuyerNotWhitelisted));
    });

    test('Allows non-WL buyers to bid after the WL period concludes', async () => {
      var result = await buy(fixtureWLAndRegularSale.selfState, buyer2, 10n * ONE_ALPH, wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 2n), fixtureWLAndRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: buyer2, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)
    });

    test('Facilitates multiple WL buyers to bid in WL period, and non-WL buyers post WL period', async () => {
      var result = await buy(fixtureWLAndRegularSale.selfState, wlBuyers[0].address, 10n * ONE_ALPH, wlBuyers[0].proof, BigInt(genesis + 1) + (86400000n * 1n), fixtureWLAndRegularSale.dependencies);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: wlBuyers[0].address, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)

      var result = await buy(state, wlBuyers[1].address, 20n * ONE_ALPH, wlBuyers[1].proof, BigInt(genesis + 1) + (86400000n * 1n), result.contracts);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: wlBuyers[1].address, buyBidAmount: 20n * ONE_ALPH, buyTokenAmount: 40000n * ONE_ALPH })).toBe(true)

      var result = await buy(state, buyer1, 10n * ONE_ALPH, "", BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: buyer1, buyBidAmount: 10n * ONE_ALPH, buyTokenAmount: 20000n * ONE_ALPH })).toBe(true)

      var result = await buy(state, buyer2, 20n * ONE_ALPH, "", BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: buyer2, buyBidAmount: 20n * ONE_ALPH, buyTokenAmount: 40000n * ONE_ALPH })).toBe(true)

      var result = await buy(state, buyer3, 30n * ONE_ALPH, "", BigInt(genesis + 1) + (86400000n * 2n), result.contracts);
      var state = getContractState<SaleFlatPriceAlphTypes.Fields>(result.contracts, fixtureWLAndRegularSale.contractId)
      expect(checkEvent(result, "Buy", { account: buyer3, buyBidAmount: 30n * ONE_ALPH, buyTokenAmount: 60000n * ONE_ALPH })).toBe(true)
    });
  })
})
