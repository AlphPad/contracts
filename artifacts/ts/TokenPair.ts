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
import { default as TokenPairContractJson } from "../external/dummy/TokenPair.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace TokenPairTypes {
  export type Fields = {
    token0Id: HexString;
    token1Id: HexString;
    reserve0: bigint;
    reserve1: bigint;
    blockTimeStampLast: bigint;
    price0CumulativeLast: bigint;
    price1CumulativeLast: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getPrice0CumulativeLast: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getPrice1CumulativeLast: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTokenPair: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[HexString, HexString]>;
    };
    getReserves: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<[bigint, bigint]>;
    };
    getBlockTimeStampLast: {
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
  TokenPairInstance,
  TokenPairTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as TokenPairTypes.Fields;
  }

  at(address: string): TokenPairInstance {
    return new TokenPairInstance(address);
  }

  tests = {
    getPrice0CumulativeLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getPrice0CumulativeLast", params);
    },
    getPrice1CumulativeLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getPrice1CumulativeLast", params);
    },
    getTokenPair: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<[HexString, HexString]>> => {
      return testMethod(this, "getTokenPair", params);
    },
    getReserves: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<[bigint, bigint]>> => {
      return testMethod(this, "getReserves", params);
    },
    getBlockTimeStampLast: async (
      params: Omit<TestContractParams<TokenPairTypes.Fields, never>, "testArgs">
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getBlockTimeStampLast", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TokenPair = new Factory(
  Contract.fromJson(
    TokenPairContractJson,
    "",
    "d663548c102e2428a76913803835cada6a2e98b7c5a1735577b0137fb75f6542"
  )
);

// Use this class to interact with the blockchain
export class TokenPairInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TokenPairTypes.State> {
    return fetchContractState(TokenPair, this);
  }

  methods = {
    getPrice0CumulativeLast: async (
      params?: TokenPairTypes.CallMethodParams<"getPrice0CumulativeLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getPrice0CumulativeLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getPrice0CumulativeLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getPrice1CumulativeLast: async (
      params?: TokenPairTypes.CallMethodParams<"getPrice1CumulativeLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getPrice1CumulativeLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getPrice1CumulativeLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTokenPair: async (
      params?: TokenPairTypes.CallMethodParams<"getTokenPair">
    ): Promise<TokenPairTypes.CallMethodResult<"getTokenPair">> => {
      return callMethod(
        TokenPair,
        this,
        "getTokenPair",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getReserves: async (
      params?: TokenPairTypes.CallMethodParams<"getReserves">
    ): Promise<TokenPairTypes.CallMethodResult<"getReserves">> => {
      return callMethod(
        TokenPair,
        this,
        "getReserves",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBlockTimeStampLast: async (
      params?: TokenPairTypes.CallMethodParams<"getBlockTimeStampLast">
    ): Promise<TokenPairTypes.CallMethodResult<"getBlockTimeStampLast">> => {
      return callMethod(
        TokenPair,
        this,
        "getBlockTimeStampLast",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends TokenPairTypes.MultiCallParams>(
    calls: Calls
  ): Promise<TokenPairTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      TokenPair,
      this,
      calls,
      getContractByCodeHash
    )) as TokenPairTypes.MultiCallResults<Calls>;
  }
}
