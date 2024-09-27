import { ContractState, HexString, ONE_ALPH, stringToHex, web3 } from '@alephium/web3'
import keccak256 from 'keccak256'
import {
  buildProject,
  createRewardDistributor,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  randomTokenId,
  createSaleBuyerTemplateAccount,
  createBurnAlph,
  createSaleManagerV3,
  createSaleFlatPriceV3
} from './fixtures'
import { expectAssertionError, randomContractId } from '@alephium/web3-test'
import { SaleBuyerAccountTypes, SaleFlatPriceAlphV3Types, SaleManagerV3, SaleManagerV3Types, StakingTypes } from '../../artifacts/ts'
import { checkEvent } from '../utils'

describe('Sale Manager Contract Testing', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let sender: string
  let sender2: string
  let saleToken: string
  let accountTemplateFixture: ContractFixture<SaleBuyerAccountTypes.Fields>
  let saleFlatTemplateFixture: ContractFixture<SaleFlatPriceAlphV3Types.Fields>
  let fixture: ContractFixture<SaleManagerV3Types.Fields>
  let listingFee: bigint
  beforeEach(async () => {
    await buildProject()
    genesis = Date.now();
    sender = randomP2PKHAddress();
    sender2 = randomP2PKHAddress();
    saleToken = randomTokenId();
    let burnAlph = createBurnAlph([]);
    accountTemplateFixture = createSaleBuyerTemplateAccount(burnAlph.states());
    let rewardDistributor = createRewardDistributor(BigInt(genesis), 10n, 10n, randomContractId(), accountTemplateFixture.states())
    saleFlatTemplateFixture = createSaleFlatPriceV3(
      rewardDistributor.contractId,
      sender,
      accountTemplateFixture.contractId,
      5n * (10n ** 14n),
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 3n),
      20000n * (10n ** 18n),
      30000n * (10n ** 18n),
      randomTokenId(),
      600000000n * (10n ** 18n),
      randomTokenId(),
      BigInt(genesis) + 86400000n,
      BigInt(genesis) + (86400000n * 2n),
      10000n * (10n ** 18n),
      0n,
      "",
      BigInt(genesis) + (86400000n * 3n),
      30000n * (10n ** 18n),
      0n,
      BigInt(genesis) + (86400000n * 3n),
      rewardDistributor.states()
    );
    fixture = createSaleManagerV3(sender, rewardDistributor.contractId, saleFlatTemplateFixture.contractId, accountTemplateFixture.contractId, saleFlatTemplateFixture.states());
    listingFee = (await calculateListingFee(fixture.selfState, fixture.dependencies)).returns;

  })


  // --------------------
  // SECTION: Helpers
  // --------------------
  function calculateListingFee(state: ContractState<SaleManagerV3Types.Fields>, existingContracts?: ContractState[]) {
    return SaleManagerV3.tests.calculateListingFee({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: fixture.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis)
    });
  }

  function createSaleWithFlatPriceDefaultParams(listingIndex: bigint) {
    let validRoot = keccak256("validwlroot").toString('hex');
    return {
      listingRecordIndex: listingIndex,
      tokenPrice: 5n * (10n ** 14n),
      publicSaleMaxBid: 1000n * (10n ** 18n),
      upfrontRelease: 10000n,
      vestingEnd: BigInt(genesis) + 86400000n * 2n,
      cliffEnd: BigInt(genesis) + 86400000n * 2n,
      maxRaise: 30000n * (10n ** 18n),
      minRaise: 20000n * (10n ** 18n),
      merkleRoot: validRoot,
      saleStart: BigInt(genesis) + 86400000n,
      saleEnd: BigInt(genesis) + 86400000n * 2n,
      saleFlatPriceTemplateId: saleFlatTemplateFixture.contractId,
      saleTokenId: saleToken,
      saleTokenTotalAmount: 60_000_000n * 10n ** 18n,
      whitelistBuyerMaxBid: ONE_ALPH * 2n,
      whitelistSaleEnd: BigInt(genesis) + 86400000n * 2n
    }
  }

  function createSaleWithFlatPrice(saleSettings:
    {
      listingRecordIndex: bigint;
      tokenPrice: bigint;
      publicSaleMaxBid: bigint;
      upfrontRelease: bigint;
      vestingEnd: bigint;
      cliffEnd: bigint;
      saleStart: bigint;
      saleEnd: bigint;
      minRaise: bigint;
      maxRaise: bigint;
      saleTokenId: HexString;
      saleTokenTotalAmount: bigint;
      whitelistSaleEnd: bigint;
      merkleRoot: HexString;
    }, seller: string, state: ContractState<SaleManagerV3Types.Fields>, existingContracts?: ContractState[], maps?: any) {
    const inputAssets = [{
      address: seller, asset: {
        alphAmount: 2n * ONE_ALPH, tokens: [{ id: saleSettings.saleTokenId, amount: saleSettings.saleTokenTotalAmount }]
      }
    }]
    return SaleManagerV3.tests.createSaleFlatPriceAlph({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: Number(genesis),
      inputAssets: inputAssets,
      testArgs: saleSettings,
      initialMaps: maps
    });
  }

  function createDefaultListing() {
    return SaleManagerV3.tests.createListingRecord({
      initialFields: fixture.selfState.fields,
      initialAsset: fixture.selfState.asset,
      address: fixture.address,
      testArgs: { amountAlph: listingFee },
      inputAssets: [{
        address: sender, asset: {
          alphAmount: ONE_ALPH + listingFee
        }
      }],
      existingContracts: fixture.dependencies
    });
  }

  describe('Core Functionality Tests', () => {

    test('Calculates the correct listing fee', async () => {
      var result = await calculateListingFee(fixture.selfState, fixture.dependencies)
      var state = getContractState<StakingTypes.Fields>(result.contracts, fixture.contractId)
      expect(result.returns / (10n ** 18n)).toBe(41n)
    });

    test('Deploys a sale with default parameters successfully', async () => {
      var listing = await createDefaultListing();
      var state = getContractState<SaleManagerV3Types.Fields>(listing.contracts, fixture.contractId);
      var saleSettings = createSaleWithFlatPriceDefaultParams(1000001n);
      var result = await createSaleWithFlatPrice(saleSettings, sender, state, listing.contracts, listing.maps)
      expect(checkEvent(result, "CreateSaleFlatPriceAlph")).toBe(true);
    });
  })

  describe('Listing Tests', () => {
    test('Creates a listing record successfully', async () => {
      const result = await SaleManagerV3.tests.createListingRecord({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { amountAlph: listingFee },
        inputAssets: [{
          address: sender, asset: {
            alphAmount: ONE_ALPH + listingFee
          }
        }],
        existingContracts: fixture.dependencies
      });
      var state = getContractState<SaleManagerV3Types.Fields>(result.contracts, fixture.contractId);
      expect(state.fields.listingCounter).toBe(1000001n);
      expect(checkEvent(result, 'CreateListingRecord')).toBe(true);
      const listingIndex = state.fields.listingCounter;
      state = getContractState<SaleManagerV3Types.Fields>(result.contracts, fixture.contractId);
      var listing = await SaleManagerV3.tests.getListing({
        initialFields: state.fields,
        initialAsset: state.asset,
        address: state.address,
        testArgs: { listingRecordIndex: listingIndex },
        existingContracts: result.contracts,
        initialMaps: result.maps
      });
      expect(listing.returns.status).toBe(stringToHex("New"));
    });

    test('Fails to create a listing due to insufficient listing fee', async () => {
      var amountAlph = 1n * (10n ** 18n); // Insufficient fee
      await expectAssertionError(SaleManagerV3.tests.createListingRecord({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { amountAlph: amountAlph },
        inputAssets: [{
          address: sender, asset: {
            alphAmount: ONE_ALPH + amountAlph
          }
        }],
        existingContracts: fixture.dependencies
      }), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.ListingFeeMustBePaid));
    });

    test('Updates listing status successfully', async () => {
      const setup = await SaleManagerV3.tests.createListingRecord({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { amountAlph: listingFee },
        inputAssets: [{
          address: sender, asset: {
            alphAmount: ONE_ALPH + listingFee
          }
        }],
        existingContracts: fixture.dependencies
      });
      var state = getContractState<SaleManagerV3Types.Fields>(setup.contracts, fixture.contractId);
      var listingIndex = state.fields.listingCounter;
      const result = await SaleManagerV3.tests.updateListingStatus({
        initialFields: state.fields,
        initialAsset: state.asset,
        address: state.address,
        testArgs: { listingRecordIndex: listingIndex, newStatus: stringToHex("Active") },
        inputAssets: [{
          address: sender, asset: {
            alphAmount: ONE_ALPH
          }
        }],
        existingContracts: setup.contracts,
        initialMaps: setup.maps
      });
      state = getContractState<SaleManagerV3Types.Fields>(result.contracts, fixture.contractId);
      var listing = await SaleManagerV3.tests.getListing({
        initialFields: state.fields,
        initialAsset: state.asset,
        address: state.address,
        testArgs: { listingRecordIndex: listingIndex },
        existingContracts: result.contracts,
        initialMaps: result.maps
      });
      expect(listing.returns.status).toBe(stringToHex("Active"));
      expect(checkEvent(result, 'UpdateListingStatus')).toBe(true);
    });

    test('Fails to update listing status due to unauthorized user', async () => {
      var listingIndex = 1n;
      await expectAssertionError(SaleManagerV3.tests.updateListingStatus({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { listingRecordIndex: listingIndex, newStatus: stringToHex("Active") },
        inputAssets: [{
          address: sender2, asset: {
            alphAmount: ONE_ALPH
          }
        }],
      }), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.Unauthorized));
    });

    test('Changes the listing reviewer successfully', async () => {
      var newReviewer = randomP2PKHAddress();
      const result = await SaleManagerV3.tests.changeListingReviewer({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { newListingsReviewer: newReviewer },
        inputAssets: [{
          address: sender, asset: {
            alphAmount: ONE_ALPH
          }
        }],
      });
      var state = getContractState<SaleManagerV3Types.Fields>(result.contracts, fixture.contractId);
      expect(state.fields.listingsReviewer).toBe(newReviewer);
      expect(checkEvent(result, 'UpdateListingReviewer')).toBe(true);
    });

    test('Fails to change the listing reviewer due to unauthorized user', async () => {
      var newReviewer = randomP2PKHAddress();
      await expectAssertionError(SaleManagerV3.tests.changeListingReviewer({
        initialFields: fixture.selfState.fields,
        initialAsset: fixture.selfState.asset,
        address: fixture.address,
        testArgs: { newListingsReviewer: newReviewer },
        inputAssets: [{
          address: sender2, asset: {
            alphAmount: ONE_ALPH
          }
        }],
      }), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.Unauthorized));
    });

  })

  describe('Contract Assertion Validations', () => {

    test('Fails to create sale with token price exceeding max limit', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.tokenPrice = 1n + 1n * (10n ** 32n); // Exceeding max limit
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.PriceLargerThanMax));
    });

    test('Fails to create sale with token price below min limit', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.tokenPrice = 0n; // Below min limit
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.PriceSmallerThanMin));
    });

    test('Fails to create sale with past sale start date', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.saleStart = BigInt(genesis) - 100000n; // Past date
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.SaleStartMustBeInFuture));
    });

    test('Fails to create sale with sale end date before start date', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.saleEnd = saleSettings.saleStart - 10000n; // End date before start date
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.SaleEndMustBeAfterSaleStart));
    });

    test('Fails to create sale with max raise larger than allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.maxRaise = 11n * 1_000_000n * (10n ** 18n); // Larger than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.RaiseLargerThanMax));
    });

    test('Fails to create sale with min raise smaller than allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.minRaise = 10n * (10n ** 18n); // Smaller than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.RaiseSmallerThanMin));
    });

    test('Fails to create sale with sale amount larger than max allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.saleTokenTotalAmount = 2n * (10n ** 36n); // Larger than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.SaleAmountLargerThanMax));
    });

    test('Fails to create sale with sale amount smaller than min allowed', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.saleTokenTotalAmount = 0n; // Smaller than allowed
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.SaleAmountSmallerThanMin));
    });

    test('Fails to create WL sale with end date not within sale dates', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.whitelistSaleEnd = saleSettings.saleEnd + 10000n; // Outside of sale dates
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.WLSaleEndMustBeWithinSaleDatesAndAfterWLSaleStart));
    });

    test('Fails to create WL sale with invalid merkle root size', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.merkleRoot = "2a"; // Invalid size
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.WLSaleInvalidMerkleRootSize));
    });

    test('Fails to create WL sale with zero merkle root', async () => {
      var saleSettings = createSaleWithFlatPriceDefaultParams(100001n);
      saleSettings.merkleRoot = "0000000000000000000000000000000000000000000000000000000000000000"; // Zero root
      await expectAssertionError(createSaleWithFlatPrice(saleSettings, sender, fixture.selfState, fixture.dependencies), fixture.address, Number(SaleManagerV3.consts.ErrorCodes.WLSaleMerkleRootMustNotBeZeroes));
    });
  })
})
