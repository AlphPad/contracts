import { ContractState, DUST_AMOUNT, HexString, ONE_ALPH, web3 } from '@alephium/web3'
import keccak256 from 'keccak256'
import {
  buildProject,
  createRewardDistributor,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  randomTokenId,
  createSaleManager,
  createTokenPair,
  createSaleBuyerTemplateAccount,
  createSaleFlatPrice
} from './fixtures'
import { expectAssertionError, randomContractId } from '@alephium/web3-test'
import { SaleBuyerAccountTypes, SaleFlatPriceTypes, SaleManager, SaleManagerTypes, StakingTypes } from '../../artifacts/ts'
import { checkEvent } from '../utils'

describe('Sale Manager Contract Testing', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let sender: string
  let saleToken: string
  let accountTemplateFixture: ContractFixture<SaleBuyerAccountTypes.Fields>
  let saleFlatTemplateFixture: ContractFixture<SaleFlatPriceTypes.Fields>
  let fixture: ContractFixture<SaleManagerTypes.Fields>
  let listingFee: bigint
  beforeEach(async () => {
    await buildProject()
    genesis = Date.now();
    sender = randomP2PKHAddress();
    saleToken = randomTokenId();
    accountTemplateFixture = createSaleBuyerTemplateAccount([]);
    saleFlatTemplateFixture = createSaleFlatPrice(randomContractId(), randomP2PKHAddress(), randomContractId(), 0n, 0n, 0n, 0n, 0n, randomTokenId(), 0n, randomTokenId(), 0n, 0n, 0n, 0n, 0n, "", accountTemplateFixture.states())
    let tokenPair = createTokenPair(saleFlatTemplateFixture.states())
    let rewardDistributor = createRewardDistributor(BigInt(genesis), 10n, 10n, randomContractId(), tokenPair.states())
    fixture = createSaleManager(tokenPair.contractId, rewardDistributor.contractId, rewardDistributor.states());
    listingFee = (await calculateListingFee(fixture.selfState, fixture.dependencies)).returns;
  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function calculateListingFee(state: ContractState<SaleManagerTypes.Fields>, existingContracts?: ContractState[]) {
    return SaleManager.tests.calculateListingFee({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
    });
  }

  function createSaleWithFlatPriceDefaultParams() {
    let validRoot = keccak256("validwlroot").toString('hex');
    return {
      amountAlph: listingFee,
      accountTemplateId: accountTemplateFixture.contractId,
      maxRaise: 30000n * (10n ** 18n),
      minRaise: 20000n * (10n ** 18n),
      merkleRoot: validRoot,
      saleStart: BigInt(genesis) + 86400000n,
      saleEnd: BigInt(genesis) + 86400000n * 2n,
      saleFlatPriceTemplateId: saleFlatTemplateFixture.contractId,
      saleTokenId: saleToken,
      saleTokenTotalAmount: 60_000_000n * 10n ** 18n,
      tokenPrice: 5n * (10n ** 14n),
      isWLSale: false,
      whitelistBuyerMaxBid: ONE_ALPH * 2n,
      whitelistSaleEnd: BigInt(genesis) + 86400000n * 2n,
      whitelistSaleStart: BigInt(genesis) + 86400000n
    }
  }

  function createSaleWithFlatPrice(saleSettings:
    {
      amountAlph: bigint;
      saleFlatPriceTemplateId: HexString;
      accountTemplateId: HexString;
      tokenPrice: bigint;
      saleStart: bigint;
      saleEnd: bigint;
      minRaise: bigint;
      maxRaise: bigint;
      saleTokenId: HexString;
      saleTokenTotalAmount: bigint;
      isWLSale: boolean;
      whitelistSaleStart: bigint;
      whitelistSaleEnd: bigint;
      whitelistBuyerMaxBid: bigint;
      merkleRoot: HexString;
    }, seller: string, state: ContractState<SaleManagerTypes.Fields>, existingContracts?: ContractState[]) {
    const inputAssets = [{
      address: seller, asset: {
        alphAmount: (DUST_AMOUNT * 100n) + ONE_ALPH + saleSettings.amountAlph, tokens: [{ id: saleSettings.saleTokenId, amount: saleSettings.saleTokenTotalAmount }]
      }
    }]
    return SaleManager.tests.createSaleFlatPrice({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      inputAssets: inputAssets,
      testArgs: saleSettings
    });
  }

  describe('Core Functionality Tests', () => {

    test('Calculates the correct listing fee', async () => {
      var result = await calculateListingFee(fixture.selfState, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(result.contracts, fixture.contractId)
      expect(result.returns / (10n ** 18n)).toBe(41n)
    });

    test('Deploys a sale with default parameters successfully', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      var result = await createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(result.contracts, fixture.contractId)
      expect(checkEvent(result, "CreateSaleFlatPrice")).toBe(true);
    });

    test('Deploys a WL sale with default parameters successfully', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      var result = await createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(result.contracts, fixture.contractId)
      expect(checkEvent(result, "CreateSaleFlatPrice")).toBe(true);
    });
  })

  describe('Contract Assertion Validations', () => {

    test('Fails to create sale with insufficient listing fee', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.amountAlph = listingFee - ONE_ALPH; // Set insufficient listing fee
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.ListingFeeMustBePaid));
    });

    test('Fails to create sale with token price exceeding max limit', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.tokenPrice = 10_000_000n * (10n ** 18n); // Exceeding max limit
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.PriceLargerThanMax));
    });

    test('Fails to create sale with token price below min limit', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.tokenPrice = 0n; // Below min limit
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.PriceSmallerThanMin));
    });

    test('Fails to create sale with past sale start date', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.saleStart = BigInt(genesis) - 100000n; // Past date
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.SaleStartMustBeInFuture));
    });

    test('Fails to create sale with sale end date before start date', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.saleEnd = saleSettings.saleStart - 10000n; // End date before start date
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.SaleEndMustBeAfterSaleStart));
    });

    test('Fails to create sale with max raise larger than allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.maxRaise = 11n * 1_000_000n * (10n ** 18n); // Larger than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.RaiseLargerThanMax));
    });

    test('Fails to create sale with min raise smaller than allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.minRaise = 10n * (10n ** 18n); // Smaller than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.RaiseSmallerThanMin));
    });

    test('Fails to create sale with sale amount larger than max allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.saleTokenTotalAmount = 2n * (10n ** 36n); // Larger than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.SaleAmountLargerThanMax));
    });

    test('Fails to create sale with sale amount smaller than min allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.saleTokenTotalAmount = 10n ** 5n; // Smaller than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.SaleAmountSmallerThanMin));
    });

    test('Fails to create WL sale with different start date than sale', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.whitelistSaleStart = saleSettings.saleStart + 10000n; // Different start date
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleStartMustBeSaleStart));
    });

    test('Fails to create WL sale with end date not within sale dates', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.whitelistSaleEnd = saleSettings.saleEnd + 10000n; // Outside of sale dates
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleEndMustBeWithinSaleDatesAndAfterWLSaleStart));
    });

    test('Fails to create WL sale with max bid larger than min raise', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.whitelistBuyerMaxBid = saleSettings.minRaise + 1n; // Larger than min raise
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleMaxBidLargerThanMinRaise));
    });

    test('Fails to create WL sale with max bid smaller than 1 ALPH', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.whitelistBuyerMaxBid = ONE_ALPH - 1n; // Smaller than 1 ALPH
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleMaxBidSmallerThan1Alph));
    });

    test('Fails to create WL sale with invalid merkle root size', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.merkleRoot = "2a"; // Invalid size
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleInvalidMerkleRootSize));
    });

    test('Fails to create WL sale with zero merkle root', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams();
      saleSettings.isWLSale = true;
      saleSettings.merkleRoot = "0000000000000000000000000000000000000000000000000000000000000000"; // Zero root
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManager.consts.ErrorCodes.WLSaleMerkleRootMustNotBeZeroes));
    });
  })
})
