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
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
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
    changeOwner: {
      params: CallContractParams<{ changeOwner: Address }>;
      result: CallContractResult<null>;
    };
    migrate: {
      params: CallContractParams<{ changeCode: HexString }>;
      result: CallContractResult<null>;
    };
    migrateWithFields: {
      params: CallContractParams<{
        changeCode: HexString;
        changeImmFieldsEncoded: HexString;
        changeMutFieldsEncoded: HexString;
      }>;
      result: CallContractResult<null>;
    };
    changeOwnerApply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    migrateApply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    migrateWithFieldsApply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    resetUpgrade: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
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
    createSaleFlatPriceAlph: {
      params: CallContractParams<{
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
      }>;
      result: CallContractResult<null>;
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

  export interface SignExecuteMethodTable {
    changeOwner: {
      params: SignExecuteContractMethodParams<{ changeOwner: Address }>;
      result: SignExecuteScriptTxResult;
    };
    migrate: {
      params: SignExecuteContractMethodParams<{ changeCode: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    migrateWithFields: {
      params: SignExecuteContractMethodParams<{
        changeCode: HexString;
        changeImmFieldsEncoded: HexString;
        changeMutFieldsEncoded: HexString;
      }>;
      result: SignExecuteScriptTxResult;
    };
    changeOwnerApply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    migrateApply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    migrateWithFieldsApply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    resetUpgrade: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getUpgradeDelay: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getOwner: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewOwner: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getUpgradeCommenced: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewCode: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewImmFieldsEncoded: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewMutFieldsEncoded: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    createSaleFlatPriceAlph: {
      params: SignExecuteContractMethodParams<{
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
      }>;
      result: SignExecuteScriptTxResult;
    };
    calculateListingFee: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];
}

class Factory extends ContractFactory<
  SaleManagerV2Instance,
  SaleManagerV2Types.Fields
> {
  encodeFields(fields: SaleManagerV2Types.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      []
    );
  }

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
      return testMethod(this, "changeOwner", params, getContractByCodeHash);
    },
    migrate: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { changeCode: HexString }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrate", params, getContractByCodeHash);
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
      return testMethod(
        this,
        "migrateWithFields",
        params,
        getContractByCodeHash
      );
    },
    changeOwnerApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "changeOwnerApply",
        params,
        getContractByCodeHash
      );
    },
    migrateApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "migrateApply", params, getContractByCodeHash);
    },
    migrateWithFieldsApply: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "migrateWithFieldsApply",
        params,
        getContractByCodeHash
      );
    },
    resetUpgrade: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "resetUpgrade", params, getContractByCodeHash);
    },
    getUpgradeDelay: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getUpgradeDelay", params, getContractByCodeHash);
    },
    getOwner: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getOwner", params, getContractByCodeHash);
    },
    getNewOwner: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(this, "getNewOwner", params, getContractByCodeHash);
    },
    getUpgradeCommenced: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getUpgradeCommenced",
        params,
        getContractByCodeHash
      );
    },
    getNewCode: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(this, "getNewCode", params, getContractByCodeHash);
    },
    getNewImmFieldsEncoded: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(
        this,
        "getNewImmFieldsEncoded",
        params,
        getContractByCodeHash
      );
    },
    getNewMutFieldsEncoded: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<HexString>> => {
      return testMethod(
        this,
        "getNewMutFieldsEncoded",
        params,
        getContractByCodeHash
      );
    },
    resetFields: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "resetFields", params, getContractByCodeHash);
    },
    assertOnlyOwner: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertOnlyOwner", params, getContractByCodeHash);
    },
    assertUpgradeNotPending: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertUpgradeNotPending",
        params,
        getContractByCodeHash
      );
    },
    assertUpgradeDelayElapsed: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertUpgradeDelayElapsed",
        params,
        getContractByCodeHash
      );
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
      return testMethod(
        this,
        "createSaleFlatPriceAlph",
        params,
        getContractByCodeHash
      );
    },
    calculateListingFee: async (
      params: Omit<
        TestContractParamsWithoutMaps<SaleManagerV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "calculateListingFee",
        params,
        getContractByCodeHash
      );
    },
    assertPriceInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { tokenPrice: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertPriceInRange",
        params,
        getContractByCodeHash
      );
    },
    assertAlphAmountInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { alphAmount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertAlphAmountInRange",
        params,
        getContractByCodeHash
      );
    },
    assertSaleAmountInRange: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { saleAmount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertSaleAmountInRange",
        params,
        getContractByCodeHash
      );
    },
    assertSaleDates: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { saleStart: bigint; saleEnd: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "assertSaleDates", params, getContractByCodeHash);
    },
    assertListingFeePaid: async (
      params: TestContractParamsWithoutMaps<
        SaleManagerV2Types.Fields,
        { amountAlph: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertListingFeePaid",
        params,
        getContractByCodeHash
      );
    },
  };
}

// Use this object to test and deploy the contract
export const SaleManagerV2 = new Factory(
  Contract.fromJson(
    SaleManagerV2ContractJson,
    "",
    "c77019c37fac837d133a28ee517ff6f60eb31d2a79ab2fcaa43189a13c9d5bf7",
    []
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
    changeOwner: async (
      params: SaleManagerV2Types.CallMethodParams<"changeOwner">
    ): Promise<SaleManagerV2Types.CallMethodResult<"changeOwner">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "changeOwner",
        params,
        getContractByCodeHash
      );
    },
    migrate: async (
      params: SaleManagerV2Types.CallMethodParams<"migrate">
    ): Promise<SaleManagerV2Types.CallMethodResult<"migrate">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "migrate",
        params,
        getContractByCodeHash
      );
    },
    migrateWithFields: async (
      params: SaleManagerV2Types.CallMethodParams<"migrateWithFields">
    ): Promise<SaleManagerV2Types.CallMethodResult<"migrateWithFields">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "migrateWithFields",
        params,
        getContractByCodeHash
      );
    },
    changeOwnerApply: async (
      params?: SaleManagerV2Types.CallMethodParams<"changeOwnerApply">
    ): Promise<SaleManagerV2Types.CallMethodResult<"changeOwnerApply">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "changeOwnerApply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    migrateApply: async (
      params?: SaleManagerV2Types.CallMethodParams<"migrateApply">
    ): Promise<SaleManagerV2Types.CallMethodResult<"migrateApply">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "migrateApply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    migrateWithFieldsApply: async (
      params?: SaleManagerV2Types.CallMethodParams<"migrateWithFieldsApply">
    ): Promise<
      SaleManagerV2Types.CallMethodResult<"migrateWithFieldsApply">
    > => {
      return callMethod(
        SaleManagerV2,
        this,
        "migrateWithFieldsApply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    resetUpgrade: async (
      params?: SaleManagerV2Types.CallMethodParams<"resetUpgrade">
    ): Promise<SaleManagerV2Types.CallMethodResult<"resetUpgrade">> => {
      return callMethod(
        SaleManagerV2,
        this,
        "resetUpgrade",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
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
    createSaleFlatPriceAlph: async (
      params: SaleManagerV2Types.CallMethodParams<"createSaleFlatPriceAlph">
    ): Promise<
      SaleManagerV2Types.CallMethodResult<"createSaleFlatPriceAlph">
    > => {
      return callMethod(
        SaleManagerV2,
        this,
        "createSaleFlatPriceAlph",
        params,
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

  view = this.methods;

  transact = {
    changeOwner: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"changeOwner">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"changeOwner">> => {
      return signExecuteMethod(SaleManagerV2, this, "changeOwner", params);
    },
    migrate: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"migrate">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"migrate">> => {
      return signExecuteMethod(SaleManagerV2, this, "migrate", params);
    },
    migrateWithFields: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"migrateWithFields">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"migrateWithFields">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "migrateWithFields",
        params
      );
    },
    changeOwnerApply: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"changeOwnerApply">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"changeOwnerApply">
    > => {
      return signExecuteMethod(SaleManagerV2, this, "changeOwnerApply", params);
    },
    migrateApply: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"migrateApply">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"migrateApply">> => {
      return signExecuteMethod(SaleManagerV2, this, "migrateApply", params);
    },
    migrateWithFieldsApply: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"migrateWithFieldsApply">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"migrateWithFieldsApply">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "migrateWithFieldsApply",
        params
      );
    },
    resetUpgrade: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"resetUpgrade">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"resetUpgrade">> => {
      return signExecuteMethod(SaleManagerV2, this, "resetUpgrade", params);
    },
    getUpgradeDelay: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getUpgradeDelay">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"getUpgradeDelay">
    > => {
      return signExecuteMethod(SaleManagerV2, this, "getUpgradeDelay", params);
    },
    getOwner: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getOwner">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"getOwner">> => {
      return signExecuteMethod(SaleManagerV2, this, "getOwner", params);
    },
    getNewOwner: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getNewOwner">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"getNewOwner">> => {
      return signExecuteMethod(SaleManagerV2, this, "getNewOwner", params);
    },
    getUpgradeCommenced: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getUpgradeCommenced">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"getUpgradeCommenced">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "getUpgradeCommenced",
        params
      );
    },
    getNewCode: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getNewCode">
    ): Promise<SaleManagerV2Types.SignExecuteMethodResult<"getNewCode">> => {
      return signExecuteMethod(SaleManagerV2, this, "getNewCode", params);
    },
    getNewImmFieldsEncoded: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getNewImmFieldsEncoded">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"getNewImmFieldsEncoded">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "getNewImmFieldsEncoded",
        params
      );
    },
    getNewMutFieldsEncoded: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"getNewMutFieldsEncoded">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"getNewMutFieldsEncoded">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "getNewMutFieldsEncoded",
        params
      );
    },
    createSaleFlatPriceAlph: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"createSaleFlatPriceAlph">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"createSaleFlatPriceAlph">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "createSaleFlatPriceAlph",
        params
      );
    },
    calculateListingFee: async (
      params: SaleManagerV2Types.SignExecuteMethodParams<"calculateListingFee">
    ): Promise<
      SaleManagerV2Types.SignExecuteMethodResult<"calculateListingFee">
    > => {
      return signExecuteMethod(
        SaleManagerV2,
        this,
        "calculateListingFee",
        params
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
