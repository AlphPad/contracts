/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
} from "@alephium/web3";
import { default as SaleManagerV2ContractJson } from "../launch_sale_v2/SaleManagerV2.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace SaleManagerV2Types {
  export type Fields = {
    rewardDistributor: HexString;
    pair: HexString;
    alphTokenId: HexString;
    usdtTokenId: HexString;
    listingFeeAmount: bigint;
    upgradeDelay: bigint;
    saleFlatPriceAlphTemplateId: HexString;
    accountTemplateId: HexString;
    saleCounter: bigint;
    owner: Address;
    newOwner: Address;
    upgradeCommenced: bigint;
    newCode: HexString;
    newImmFieldsEncoded: HexString;
    newMutFieldsEncoded: HexString;
  };

  export type State = ContractState<Fields>;

  export type ChangeOwnerCommenceEvent = ContractEvent<{
    owner: Address;
    changeOwner: Address;
  }>;
  export type ChangeOwnerApplyEvent = ContractEvent<{
    owner: Address;
    changeOwner: Address;
  }>;
  export type MigrateCommenceEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
  }>;
  export type MigrateApplyEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
  }>;
  export type MigrateWithFieldsCommenceEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
    changeImmFieldsEncoded: HexString;
    changeMutFieldsEncoded: HexString;
  }>;
  export type MigrateWithFieldsApplyEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
    changeImmFieldsEncoded: HexString;
    changeMutFieldsEncoded: HexString;
  }>;
  export type CreateSaleFlatPriceAlphEvent = ContractEvent<{
    account: Address;
    saleIndex: bigint;
    contractId: HexString;
  }>;

  export interface CallMethodTable {
    getUpgradeDelay: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getOwner: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getNewOwner: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getUpgradeCommenced: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getNewCode: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getNewImmFieldsEncoded: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getNewMutFieldsEncoded: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    calculateListingFee: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  SaleManagerV2Instance,
  SaleManagerV2Types.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as SaleManagerV2Types.Fields;
  }

  eventIndex = {
    ChangeOwnerCommence: 0,
    ChangeOwnerApply: 1,
    MigrateCommence: 2,
    MigrateApply: 3,
    MigrateWithFieldsCommence: 4,
    MigrateWithFieldsApply: 5,
    CreateSaleFlatPriceAlph: 6,
  };
  consts = {
    UpgradeErrorCodes: {
      Forbidden: BigInt(13000),
      UpgradePending: BigInt(13001),
      UpgradeNotPending: BigInt(13002),
      UpgradeDelayNotExpired: BigInt(13003),
      MigrateNotPending: BigInt(13004),
      MigrateWithFieldsNotPending: BigInt(13005),
      ChangeOwnerNotPending: BigInt(13006),
    },
    ErrorCodes: {
      ListingFeeMustBePaid: BigInt(501),
      PriceLargerThanMax: BigInt(502),
      PriceSmallerThanMin: BigInt(503),
      RaiseLargerThanMax: BigInt(504),
      RaiseSmallerThanMin: BigInt(505),
      SaleStartMustBeInFuture: BigInt(506),
      SaleEndMustBeAfterSaleStart: BigInt(507),
      SaleAmountSmallerThanMin: BigInt(508),
      SaleAmountLargerThanMax: BigInt(509),
      WLSaleStartMustBeSaleStart: BigInt(510),
      WLSaleEndMustBeWithinSaleDatesAndAfterWLSaleStart: BigInt(511),
      WLSaleMaxBidLargerThanMinRaise: BigInt(512),
      WLSaleMaxBidSmallerThan1Alph: BigInt(513),
      WLSaleInvalidMerkleRootSize: BigInt(514),
      WLSaleMerkleRootMustNotBeZeroes: BigInt(515),
      IncorrectPairSetup: BigInt(516),
      CliffEndOutOfRange: BigInt(517),
      UpfrontReleaseOutOfRange: BigInt(518),
      VestingEndOutOfRange: BigInt(519),
      PublicSaleMaxBidMinimum: BigInt(520),
    },
  };

  at(address: string): SaleManagerV2Instance {
    return new SaleManagerV2Instance(address);
  }

  tests = {
    changeOwner: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { changeOwner: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "changeOwner", params);
    },
    migrate: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { changeCode: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrate", params);
    },
    migrateWithFields: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        {
          changeCode: HexString;
          changeImmFieldsEncoded: HexString;
          changeMutFieldsEncoded: HexString;
        }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrateWithFields", params);
    },
    changeOwnerApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "changeOwnerApply", params);
    },
    migrateApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrateApply", params);
    },
    migrateWithFieldsApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrateWithFieldsApply", params);
    },
    resetUpgrade: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "resetUpgrade", params);
    },
    getUpgradeDelay: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getUpgradeDelay", params);
    },
    getOwner: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getOwner", params);
    },
    getNewOwner: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getNewOwner", params);
    },
    getUpgradeCommenced: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getUpgradeCommenced", params);
    },
    getNewCode: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getNewCode", params);
    },
    getNewImmFieldsEncoded: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getNewImmFieldsEncoded", params);
    },
    getNewMutFieldsEncoded: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getNewMutFieldsEncoded", params);
    },
    resetFields: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "resetFields", params);
    },
    assertOnlyOwner: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertOnlyOwner", params);
    },
    assertUpgradeNotPending: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertUpgradeNotPending", params);
    },
    assertUpgradeDelayElapsed: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertUpgradeDelayElapsed", params);
    },
    createSaleFlatPriceAlph: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        {
          amountAlph: bigint;
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
          isWLSale: boolean;
          whitelistSaleStart: bigint;
          whitelistSaleEnd: bigint;
          whitelistBuyerMaxBid: bigint;
          merkleRoot: HexString;
        }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "createSaleFlatPriceAlph", params);
    },
    calculateListingFee: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "calculateListingFee", params);
    },
    assertPriceInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { tokenPrice: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertPriceInRange", params);
    },
    assertAlphAmountInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { alphAmount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertAlphAmountInRange", params);
    },
    assertSaleAmountInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { saleAmount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertSaleAmountInRange", params);
    },
    assertSaleDates: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { saleStart: bigint; saleEnd: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertSaleDates", params);
    },
    assertListingFeePaid: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { amountAlph: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertListingFeePaid", params);
    },
  };
}

// Use this object to test and deploy the contract
export const SaleManagerV2 = new Factory(
  Contract.fromJson(
    SaleManagerV2ContractJson,
    "",
    "c77019c37fac837d133a28ee517ff6f60eb31d2a79ab2fcaa43189a13c9d5bf7"
  )
);

// Use this class to interact with the blockchain
export class SaleManagerV2Instance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<SaleManagerV2Types.State> {
    return fetchContractState(SaleManagerV2, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeChangeOwnerCommenceEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.ChangeOwnerCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "ChangeOwnerCommence",
      fromCount
    );
  }

  subscribeChangeOwnerApplyEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.ChangeOwnerApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "ChangeOwnerApply",
      fromCount
    );
  }

  subscribeMigrateCommenceEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.MigrateCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "MigrateCommence",
      fromCount
    );
  }

  subscribeMigrateApplyEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.MigrateApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "MigrateApply",
      fromCount
    );
  }

  subscribeMigrateWithFieldsCommenceEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.MigrateWithFieldsCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "MigrateWithFieldsCommence",
      fromCount
    );
  }

  subscribeMigrateWithFieldsApplyEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.MigrateWithFieldsApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "MigrateWithFieldsApply",
      fromCount
    );
  }

  subscribeCreateSaleFlatPriceAlphEvent(
    options: EventSubscribeOptions<SaleManagerV2Types.CreateSaleFlatPriceAlphEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleManagerV2.contract,
      this,
      options,
      "CreateSaleFlatPriceAlph",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | SaleManagerV2Types.ChangeOwnerCommenceEvent
      | SaleManagerV2Types.ChangeOwnerApplyEvent
      | SaleManagerV2Types.MigrateCommenceEvent
      | SaleManagerV2Types.MigrateApplyEvent
      | SaleManagerV2Types.MigrateWithFieldsCommenceEvent
      | SaleManagerV2Types.MigrateWithFieldsApplyEvent
      | SaleManagerV2Types.CreateSaleFlatPriceAlphEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      SaleManagerV2.contract,
      this,
      options,
      fromCount
    );
  }

  methods = {
    getUpgradeDelay: async (
      params?: SaleManagerV2Types.CallMethodParams<"getUpgradeDelay">
    ): Promise<SaleManagerV2Types.CallMethodResult<"getUpgradeDelay">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "getUpgradeDelay",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getOwner: async (
      params?: SaleManagerV2Types.CallMethodParams<"getOwner">
    ): Promise<SaleManagerV2Types.CallMethodResult<"getOwner">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "getOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewOwner: async (
      params?: SaleManagerV2Types.CallMethodParams<"getNewOwner">
    ): Promise<SaleManagerV2Types.CallMethodResult<"getNewOwner">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "getNewOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getUpgradeCommenced: async (
      params?: SaleManagerV2Types.CallMethodParams<"getUpgradeCommenced">
    ): Promise<SaleManagerV2Types.CallMethodResult<"getUpgradeCommenced">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "getUpgradeCommenced",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewCode: async (
      params?: SaleManagerV2Types.CallMethodParams<"getNewCode">
    ): Promise<SaleManagerV2Types.CallMethodResult<"getNewCode">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "getNewCode",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewImmFieldsEncoded: async (
      params?: SaleManagerV2Types.CallMethodParams<"getNewImmFieldsEncoded">
    ): Promise<
      SaleManagerV2Types.CallMethodResult<"getNewImmFieldsEncoded">
    > => {
      return callMethod(
        SaleManagerV2,
        this,
        "getNewImmFieldsEncoded",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewMutFieldsEncoded: async (
      params?: SaleManagerV2Types.CallMethodParams<"getNewMutFieldsEncoded">
    ): Promise<
      SaleManagerV2Types.CallMethodResult<"getNewMutFieldsEncoded">
    > => {
      return callMethod(
        SaleManagerV2,
        this,
        "getNewMutFieldsEncoded",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    calculateListingFee: async (
      params?: SaleManagerV2Types.CallMethodParams<"calculateListingFee">
    ): Promise<SaleManagerV2Types.CallMethodResult<"calculateListingFee">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "calculateListingFee",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends SaleManagerV2Types.MultiCallParams>(
    calls: Calls
  ): Promise<SaleManagerV2Types.MultiCallResults<Calls>> {
    return (await multicallMethods(
      SaleManagerV2,
      this,
      calls,
      getContractByCodeHash
    )) as SaleManagerV2Types.MultiCallResults<Calls>;
  }
}
