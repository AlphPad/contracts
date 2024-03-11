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
} from "@alephium/web3";
import { default as SaleFlatPriceContractJson } from "../launch_sale/SaleFlatPrice.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace SaleFlatPriceTypes {
  export type Fields = {
    rewardDistributor: HexString;
    saleOwner: Address;
    accountTemplateId: HexString;
    tokenPrice: bigint;
    saleStart: bigint;
    saleEnd: bigint;
    minRaise: bigint;
    maxRaise: bigint;
    saleTokenId: HexString;
    saleTokenTotalAmount: bigint;
    bidTokenId: HexString;
    whitelistSaleStart: bigint;
    whitelistSaleEnd: bigint;
    whitelistBuyerMaxBid: bigint;
    tokensSold: bigint;
    totalRaised: bigint;
    merkleRoot: HexString;
  };

  export type State = ContractState<Fields>;

  export type AccountCreateEvent = ContractEvent<{
    account: HexString;
    contractId: HexString;
  }>;
  export type AccountDestroyEvent = ContractEvent<{
    account: HexString;
    contractId: HexString;
  }>;
  export type ClaimBuyerEvent = ContractEvent<{
    account: Address;
    saleTokenAmount: bigint;
  }>;
  export type ClaimBuyerRefundEvent = ContractEvent<{
    account: Address;
    bidTokenAmount: bigint;
  }>;
  export type ClaimSellerEvent = ContractEvent<{
    account: Address;
    bidTokenAmount: bigint;
  }>;
  export type ClaimSellerRefundEvent = ContractEvent<{
    account: Address;
    saleTokenAmount: bigint;
  }>;
  export type UpdateRootEvent = ContractEvent<{
    newMerkleRoot: HexString;
    updatedBy: Address;
  }>;
  export type BuyEvent = ContractEvent<{
    account: Address;
    buyAlphAmount: bigint;
    buyTokenAmount: bigint;
  }>;

  export interface CallMethodTable {
    accountExists: {
      params: CallContractParams<{ account: Address }>;
      result: CallContractResult<boolean>;
    };
    getSubContractId: {
      params: CallContractParams<{ account: Address }>;
      result: CallContractResult<HexString>;
    };
    isSaleLive: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    isSaleFinished: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    isSaleSuccess: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    isWhitelistSaleLive: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    isWhitelistSale: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    isCallerSaleOwner: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<boolean>;
    };
    getSaleOwner: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getSaleStart: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getSaleEnd: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMinRaise: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMaxRaise: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getSaleTokenId: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getBidTokenId: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    getWhitelistSaleStart: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getWhitelistSaleEnd: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTokensSold: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTotalRaised: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMerkleRoot: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    calculateTokensReceivedPerAlph: {
      params: CallContractParams<{ amountAlph: bigint }>;
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
  SaleFlatPriceInstance,
  SaleFlatPriceTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as SaleFlatPriceTypes.Fields;
  }

  eventIndex = {
    AccountCreate: 0,
    AccountDestroy: 1,
    ClaimBuyer: 2,
    ClaimBuyerRefund: 3,
    ClaimSeller: 4,
    ClaimSellerRefund: 5,
    UpdateRoot: 6,
    Buy: 7,
  };
  consts = {
    ErrorCodes: {
      PriceMoreThanMax: BigInt(601),
      PriceLessThanMin: BigInt(602),
      BidMoreThanMax: BigInt(603),
      BidLessThanMin: BigInt(604),
      InvalidClaimAmount: BigInt(605),
      SaleTokenTotalExceeded: BigInt(606),
      SaleOwnerCanNotBid: BigInt(607),
      BuyerNotWhitelisted: BigInt(608),
    },
    AccountErrorCodes: {
      AccountAlreadyExists: BigInt(12001),
      AccountDoesNotExists: BigInt(12002),
    },
    MerkleProofErrorCodes: {
      InvalidProofSize: BigInt(11001),
      InvalidDataHash: BigInt(11002),
    },
    SaleBaseErrorCodes: {
      SaleNotLive: BigInt(1001),
      SaleNotFinished: BigInt(1002),
      SaleClaimNotAvailable: BigInt(1003),
      SaleRefundNotAvailable: BigInt(1004),
      SaleAlreadyStarted: BigInt(1005),
      SaleUpdateUnauthorized: BigInt(1006),
      SaleIsNotWLSale: BigInt(1007),
    },
  };

  at(address: string): SaleFlatPriceInstance {
    return new SaleFlatPriceInstance(address);
  }

  tests = {
    claimBuyer: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { caller: Address; amount: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimBuyer", params);
    },
    claimBuyerRefund: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { caller: Address; amount: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimBuyerRefund", params);
    },
    claimSeller: async (
      params: TestContractParams<SaleFlatPriceTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimSeller", params);
    },
    claimSellerRefund: async (
      params: TestContractParams<SaleFlatPriceTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimSellerRefund", params);
    },
    createAccount: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        {
          account: Address;
          encodedImmFields: HexString;
          encodedMutFields: HexString;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "createAccount", params);
    },
    destroyAccount: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { account: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "destroyAccount", params);
    },
    assertAccountExists: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { account: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertAccountExists", params);
    },
    accountExists: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { account: Address }
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "accountExists", params);
    },
    getSubContractId: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { account: Address }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getSubContractId", params);
    },
    claim: async (
      params: TestContractParams<SaleFlatPriceTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claim", params);
    },
    claimRefund: async (
      params: TestContractParams<SaleFlatPriceTypes.Fields, { amount: bigint }>
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "claimRefund", params);
    },
    setMerkleRoot: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { newMerkleRoot: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMerkleRoot", params);
    },
    assertSaleLive: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertSaleLive", params);
    },
    assertSaleFinished: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertSaleFinished", params);
    },
    assertCanClaim: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertCanClaim", params);
    },
    assertCanClaimRefund: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertCanClaimRefund", params);
    },
    assertSaleNotStarted: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertSaleNotStarted", params);
    },
    isSaleLive: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isSaleLive", params);
    },
    isSaleFinished: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isSaleFinished", params);
    },
    isSaleSuccess: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isSaleSuccess", params);
    },
    isWhitelistSaleLive: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isWhitelistSaleLive", params);
    },
    isWhitelistSale: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isWhitelistSale", params);
    },
    isCallerSaleOwner: async (
      params: TestContractParams<SaleFlatPriceTypes.Fields, { caller: Address }>
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "isCallerSaleOwner", params);
    },
    getSaleOwner: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getSaleOwner", params);
    },
    getSaleStart: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getSaleStart", params);
    },
    getSaleEnd: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getSaleEnd", params);
    },
    getMinRaise: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMinRaise", params);
    },
    getMaxRaise: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMaxRaise", params);
    },
    getSaleTokenId: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getSaleTokenId", params);
    },
    getBidTokenId: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getBidTokenId", params);
    },
    getWhitelistSaleStart: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getWhitelistSaleStart", params);
    },
    getWhitelistSaleEnd: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getWhitelistSaleEnd", params);
    },
    getTokensSold: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getTokensSold", params);
    },
    getTotalRaised: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getTotalRaised", params);
    },
    getMerkleRoot: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getMerkleRoot", params);
    },
    updateRoot: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { newMerkleRoot: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "updateRoot", params);
    },
    verify: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { proof: HexString; data: HexString }
      >
    ): Promise<TestContractResult<boolean>> => {
      return testMethod(this, "verify", params);
    },
    hashPair: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { a: HexString; b: HexString }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "hashPair", params);
    },
    hash: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { dataToHash: HexString }
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "hash", params);
    },
    buy: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { amountAlph: bigint; wlMerkleProof: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "buy", params);
    },
    calculateTokensReceivedPerAlph: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { amountAlph: bigint }
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "calculateTokensReceivedPerAlph", params);
    },
    assertPriceInRange: async (
      params: Omit<
        TestContractParams<SaleFlatPriceTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertPriceInRange", params);
    },
    assertAlphAmountInRange: async (
      params: TestContractParams<
        SaleFlatPriceTypes.Fields,
        { alphAmount: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertAlphAmountInRange", params);
    },
  };
}

// Use this object to test and deploy the contract
export const SaleFlatPrice = new Factory(
  Contract.fromJson(
    SaleFlatPriceContractJson,
    "",
    "62a28f9f3ce63294c9cc9df44f190675cba6227e7f999584b331545866235c5e"
  )
);

// Use this class to interact with the blockchain
export class SaleFlatPriceInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<SaleFlatPriceTypes.State> {
    return fetchContractState(SaleFlatPrice, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeAccountCreateEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.AccountCreateEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "AccountCreate",
      fromCount
    );
  }

  subscribeAccountDestroyEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.AccountDestroyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "AccountDestroy",
      fromCount
    );
  }

  subscribeClaimBuyerEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.ClaimBuyerEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "ClaimBuyer",
      fromCount
    );
  }

  subscribeClaimBuyerRefundEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.ClaimBuyerRefundEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "ClaimBuyerRefund",
      fromCount
    );
  }

  subscribeClaimSellerEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.ClaimSellerEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "ClaimSeller",
      fromCount
    );
  }

  subscribeClaimSellerRefundEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.ClaimSellerRefundEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "ClaimSellerRefund",
      fromCount
    );
  }

  subscribeUpdateRootEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.UpdateRootEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "UpdateRoot",
      fromCount
    );
  }

  subscribeBuyEvent(
    options: EventSubscribeOptions<SaleFlatPriceTypes.BuyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      SaleFlatPrice.contract,
      this,
      options,
      "Buy",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | SaleFlatPriceTypes.AccountCreateEvent
      | SaleFlatPriceTypes.AccountDestroyEvent
      | SaleFlatPriceTypes.ClaimBuyerEvent
      | SaleFlatPriceTypes.ClaimBuyerRefundEvent
      | SaleFlatPriceTypes.ClaimSellerEvent
      | SaleFlatPriceTypes.ClaimSellerRefundEvent
      | SaleFlatPriceTypes.UpdateRootEvent
      | SaleFlatPriceTypes.BuyEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      SaleFlatPrice.contract,
      this,
      options,
      fromCount
    );
  }

  methods = {
    accountExists: async (
      params: SaleFlatPriceTypes.CallMethodParams<"accountExists">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"accountExists">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "accountExists",
        params,
        getContractByCodeHash
      );
    },
    getSubContractId: async (
      params: SaleFlatPriceTypes.CallMethodParams<"getSubContractId">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getSubContractId">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getSubContractId",
        params,
        getContractByCodeHash
      );
    },
    isSaleLive: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"isSaleLive">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isSaleLive">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isSaleLive",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isSaleFinished: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"isSaleFinished">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isSaleFinished">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isSaleFinished",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isSaleSuccess: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"isSaleSuccess">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isSaleSuccess">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isSaleSuccess",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isWhitelistSaleLive: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"isWhitelistSaleLive">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isWhitelistSaleLive">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isWhitelistSaleLive",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isWhitelistSale: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"isWhitelistSale">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isWhitelistSale">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isWhitelistSale",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isCallerSaleOwner: async (
      params: SaleFlatPriceTypes.CallMethodParams<"isCallerSaleOwner">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"isCallerSaleOwner">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "isCallerSaleOwner",
        params,
        getContractByCodeHash
      );
    },
    getSaleOwner: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getSaleOwner">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getSaleOwner">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getSaleOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getSaleStart: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getSaleStart">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getSaleStart">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getSaleStart",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getSaleEnd: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getSaleEnd">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getSaleEnd">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getSaleEnd",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMinRaise: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getMinRaise">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getMinRaise">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getMinRaise",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMaxRaise: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getMaxRaise">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getMaxRaise">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getMaxRaise",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getSaleTokenId: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getSaleTokenId">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getSaleTokenId">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getSaleTokenId",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBidTokenId: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getBidTokenId">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getBidTokenId">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getBidTokenId",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getWhitelistSaleStart: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getWhitelistSaleStart">
    ): Promise<
      SaleFlatPriceTypes.CallMethodResult<"getWhitelistSaleStart">
    > => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getWhitelistSaleStart",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getWhitelistSaleEnd: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getWhitelistSaleEnd">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getWhitelistSaleEnd">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getWhitelistSaleEnd",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTokensSold: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getTokensSold">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getTokensSold">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getTokensSold",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTotalRaised: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getTotalRaised">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getTotalRaised">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getTotalRaised",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMerkleRoot: async (
      params?: SaleFlatPriceTypes.CallMethodParams<"getMerkleRoot">
    ): Promise<SaleFlatPriceTypes.CallMethodResult<"getMerkleRoot">> => {
      return callMethod(
        SaleFlatPrice,
        this,
        "getMerkleRoot",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    calculateTokensReceivedPerAlph: async (
      params: SaleFlatPriceTypes.CallMethodParams<"calculateTokensReceivedPerAlph">
    ): Promise<
      SaleFlatPriceTypes.CallMethodResult<"calculateTokensReceivedPerAlph">
    > => {
      return callMethod(
        SaleFlatPrice,
        this,
        "calculateTokensReceivedPerAlph",
        params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends SaleFlatPriceTypes.MultiCallParams>(
    calls: Calls
  ): Promise<SaleFlatPriceTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      SaleFlatPrice,
      this,
      calls,
      getContractByCodeHash
    )) as SaleFlatPriceTypes.MultiCallResults<Calls>;
  }
}