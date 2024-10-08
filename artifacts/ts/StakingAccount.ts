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
import { default as StakingAccountContractJson } from "../rewards/StakingAccount.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace StakingAccountTypes {
  export type Fields = {
    parentContractAddress: Address;
    accountHolder: Address;
    vestedStart: bigint;
    vestedTill: bigint;
    vestedTotalAmount: bigint;
    amountStaked: bigint;
    amountUnstaked: bigint;
    beginUnstakeAt: bigint;
    rewardPerToken: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    destroy: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    isSafeToDestroy: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<boolean>;
    };
    getParentContractAddress: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getAccountHolder: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    calcVestedClaimable: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    stake: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<null>;
    };
    unstake: {
      params: CallContractParams<{ amount: bigint }>;
      result: CallContractResult<null>;
    };
    withdraw: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    setRewardPerToken: {
      params: CallContractParams<{ newRewardPerToken: bigint }>;
      result: CallContractResult<null>;
    };
    getVestedTotalAmount: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getVestedTill: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getVestedStart: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getAmountStaked: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getAmountUnstaked: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getBeginUnstakeAt: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getRewardPerToken: {
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
    destroy: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    isSafeToDestroy: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getParentContractAddress: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getAccountHolder: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    calcVestedClaimable: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    stake: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    unstake: {
      params: SignExecuteContractMethodParams<{ amount: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    withdraw: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    setRewardPerToken: {
      params: SignExecuteContractMethodParams<{ newRewardPerToken: bigint }>;
      result: SignExecuteScriptTxResult;
    };
    getVestedTotalAmount: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getVestedTill: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getVestedStart: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getAmountStaked: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getAmountUnstaked: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getBeginUnstakeAt: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getRewardPerToken: {
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
  StakingAccountInstance,
  StakingAccountTypes.Fields
> {
  encodeFields(fields: StakingAccountTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      []
    );
  }

  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as StakingAccountTypes.Fields;
  }

  consts = {
    ErrorCodes: {
      InsufficientBalance: BigInt(111),
      AmountNotVested: BigInt(112),
      CanNotStakeToVestedAccounts: BigInt(113),
    },
    AccountBaseErrorCodes: {
      UnauthorizedAccess: BigInt(12101),
      UnsafeDestroy: BigInt(12102),
    },
  };

  at(address: string): StakingAccountInstance {
    return new StakingAccountInstance(address);
  }

  tests = {
    destroy: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "destroy", params, getContractByCodeHash);
    },
    isSafeToDestroy: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<boolean>> => {
      return testMethod(this, "isSafeToDestroy", params, getContractByCodeHash);
    },
    assertIsSafeToDestroy: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertIsSafeToDestroy",
        params,
        getContractByCodeHash
      );
    },
    assertIsParentTheCaller: async (
      params: TestContractParamsWithoutMaps<
        StakingAccountTypes.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "assertIsParentTheCaller",
        params,
        getContractByCodeHash
      );
    },
    getParentContractAddress: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(
        this,
        "getParentContractAddress",
        params,
        getContractByCodeHash
      );
    },
    getAccountHolder: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<Address>> => {
      return testMethod(
        this,
        "getAccountHolder",
        params,
        getContractByCodeHash
      );
    },
    calcVestedClaimable: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "calcVestedClaimable",
        params,
        getContractByCodeHash
      );
    },
    stake: async (
      params: TestContractParamsWithoutMaps<
        StakingAccountTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "stake", params, getContractByCodeHash);
    },
    unstake: async (
      params: TestContractParamsWithoutMaps<
        StakingAccountTypes.Fields,
        { amount: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "unstake", params, getContractByCodeHash);
    },
    withdraw: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(this, "withdraw", params, getContractByCodeHash);
    },
    setRewardPerToken: async (
      params: TestContractParamsWithoutMaps<
        StakingAccountTypes.Fields,
        { newRewardPerToken: bigint }
      >
    ): Promise<TestContractResultWithoutMaps<null>> => {
      return testMethod(
        this,
        "setRewardPerToken",
        params,
        getContractByCodeHash
      );
    },
    getVestedTotalAmount: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getVestedTotalAmount",
        params,
        getContractByCodeHash
      );
    },
    getVestedTill: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getVestedTill", params, getContractByCodeHash);
    },
    getVestedStart: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getVestedStart", params, getContractByCodeHash);
    },
    getAmountStaked: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(this, "getAmountStaked", params, getContractByCodeHash);
    },
    getAmountUnstaked: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getAmountUnstaked",
        params,
        getContractByCodeHash
      );
    },
    getBeginUnstakeAt: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getBeginUnstakeAt",
        params,
        getContractByCodeHash
      );
    },
    getRewardPerToken: async (
      params: Omit<
        TestContractParamsWithoutMaps<StakingAccountTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResultWithoutMaps<bigint>> => {
      return testMethod(
        this,
        "getRewardPerToken",
        params,
        getContractByCodeHash
      );
    },
  };
}

// Use this object to test and deploy the contract
export const StakingAccount = new Factory(
  Contract.fromJson(
    StakingAccountContractJson,
    "",
    "ce406d4e5e0bea3d9c89cc9fad8ff9140f3eafb69162d3ba97773c1a4df48a4f",
    []
  )
);

// Use this class to interact with the blockchain
export class StakingAccountInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<StakingAccountTypes.State> {
    return fetchContractState(StakingAccount, this);
  }

  methods = {
    destroy: async (
      params?: StakingAccountTypes.CallMethodParams<"destroy">
    ): Promise<StakingAccountTypes.CallMethodResult<"destroy">> => {
      return callMethod(
        StakingAccount,
        this,
        "destroy",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    isSafeToDestroy: async (
      params?: StakingAccountTypes.CallMethodParams<"isSafeToDestroy">
    ): Promise<StakingAccountTypes.CallMethodResult<"isSafeToDestroy">> => {
      return callMethod(
        StakingAccount,
        this,
        "isSafeToDestroy",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getParentContractAddress: async (
      params?: StakingAccountTypes.CallMethodParams<"getParentContractAddress">
    ): Promise<
      StakingAccountTypes.CallMethodResult<"getParentContractAddress">
    > => {
      return callMethod(
        StakingAccount,
        this,
        "getParentContractAddress",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAccountHolder: async (
      params?: StakingAccountTypes.CallMethodParams<"getAccountHolder">
    ): Promise<StakingAccountTypes.CallMethodResult<"getAccountHolder">> => {
      return callMethod(
        StakingAccount,
        this,
        "getAccountHolder",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    calcVestedClaimable: async (
      params?: StakingAccountTypes.CallMethodParams<"calcVestedClaimable">
    ): Promise<StakingAccountTypes.CallMethodResult<"calcVestedClaimable">> => {
      return callMethod(
        StakingAccount,
        this,
        "calcVestedClaimable",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    stake: async (
      params: StakingAccountTypes.CallMethodParams<"stake">
    ): Promise<StakingAccountTypes.CallMethodResult<"stake">> => {
      return callMethod(
        StakingAccount,
        this,
        "stake",
        params,
        getContractByCodeHash
      );
    },
    unstake: async (
      params: StakingAccountTypes.CallMethodParams<"unstake">
    ): Promise<StakingAccountTypes.CallMethodResult<"unstake">> => {
      return callMethod(
        StakingAccount,
        this,
        "unstake",
        params,
        getContractByCodeHash
      );
    },
    withdraw: async (
      params?: StakingAccountTypes.CallMethodParams<"withdraw">
    ): Promise<StakingAccountTypes.CallMethodResult<"withdraw">> => {
      return callMethod(
        StakingAccount,
        this,
        "withdraw",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    setRewardPerToken: async (
      params: StakingAccountTypes.CallMethodParams<"setRewardPerToken">
    ): Promise<StakingAccountTypes.CallMethodResult<"setRewardPerToken">> => {
      return callMethod(
        StakingAccount,
        this,
        "setRewardPerToken",
        params,
        getContractByCodeHash
      );
    },
    getVestedTotalAmount: async (
      params?: StakingAccountTypes.CallMethodParams<"getVestedTotalAmount">
    ): Promise<
      StakingAccountTypes.CallMethodResult<"getVestedTotalAmount">
    > => {
      return callMethod(
        StakingAccount,
        this,
        "getVestedTotalAmount",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getVestedTill: async (
      params?: StakingAccountTypes.CallMethodParams<"getVestedTill">
    ): Promise<StakingAccountTypes.CallMethodResult<"getVestedTill">> => {
      return callMethod(
        StakingAccount,
        this,
        "getVestedTill",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getVestedStart: async (
      params?: StakingAccountTypes.CallMethodParams<"getVestedStart">
    ): Promise<StakingAccountTypes.CallMethodResult<"getVestedStart">> => {
      return callMethod(
        StakingAccount,
        this,
        "getVestedStart",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAmountStaked: async (
      params?: StakingAccountTypes.CallMethodParams<"getAmountStaked">
    ): Promise<StakingAccountTypes.CallMethodResult<"getAmountStaked">> => {
      return callMethod(
        StakingAccount,
        this,
        "getAmountStaked",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getAmountUnstaked: async (
      params?: StakingAccountTypes.CallMethodParams<"getAmountUnstaked">
    ): Promise<StakingAccountTypes.CallMethodResult<"getAmountUnstaked">> => {
      return callMethod(
        StakingAccount,
        this,
        "getAmountUnstaked",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBeginUnstakeAt: async (
      params?: StakingAccountTypes.CallMethodParams<"getBeginUnstakeAt">
    ): Promise<StakingAccountTypes.CallMethodResult<"getBeginUnstakeAt">> => {
      return callMethod(
        StakingAccount,
        this,
        "getBeginUnstakeAt",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getRewardPerToken: async (
      params?: StakingAccountTypes.CallMethodParams<"getRewardPerToken">
    ): Promise<StakingAccountTypes.CallMethodResult<"getRewardPerToken">> => {
      return callMethod(
        StakingAccount,
        this,
        "getRewardPerToken",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  view = this.methods;

  transact = {
    destroy: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"destroy">
    ): Promise<StakingAccountTypes.SignExecuteMethodResult<"destroy">> => {
      return signExecuteMethod(StakingAccount, this, "destroy", params);
    },
    isSafeToDestroy: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"isSafeToDestroy">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"isSafeToDestroy">
    > => {
      return signExecuteMethod(StakingAccount, this, "isSafeToDestroy", params);
    },
    getParentContractAddress: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getParentContractAddress">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getParentContractAddress">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getParentContractAddress",
        params
      );
    },
    getAccountHolder: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getAccountHolder">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getAccountHolder">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getAccountHolder",
        params
      );
    },
    calcVestedClaimable: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"calcVestedClaimable">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"calcVestedClaimable">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "calcVestedClaimable",
        params
      );
    },
    stake: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"stake">
    ): Promise<StakingAccountTypes.SignExecuteMethodResult<"stake">> => {
      return signExecuteMethod(StakingAccount, this, "stake", params);
    },
    unstake: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"unstake">
    ): Promise<StakingAccountTypes.SignExecuteMethodResult<"unstake">> => {
      return signExecuteMethod(StakingAccount, this, "unstake", params);
    },
    withdraw: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"withdraw">
    ): Promise<StakingAccountTypes.SignExecuteMethodResult<"withdraw">> => {
      return signExecuteMethod(StakingAccount, this, "withdraw", params);
    },
    setRewardPerToken: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"setRewardPerToken">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"setRewardPerToken">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "setRewardPerToken",
        params
      );
    },
    getVestedTotalAmount: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getVestedTotalAmount">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getVestedTotalAmount">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getVestedTotalAmount",
        params
      );
    },
    getVestedTill: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getVestedTill">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getVestedTill">
    > => {
      return signExecuteMethod(StakingAccount, this, "getVestedTill", params);
    },
    getVestedStart: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getVestedStart">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getVestedStart">
    > => {
      return signExecuteMethod(StakingAccount, this, "getVestedStart", params);
    },
    getAmountStaked: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getAmountStaked">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getAmountStaked">
    > => {
      return signExecuteMethod(StakingAccount, this, "getAmountStaked", params);
    },
    getAmountUnstaked: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getAmountUnstaked">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getAmountUnstaked">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getAmountUnstaked",
        params
      );
    },
    getBeginUnstakeAt: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getBeginUnstakeAt">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getBeginUnstakeAt">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getBeginUnstakeAt",
        params
      );
    },
    getRewardPerToken: async (
      params: StakingAccountTypes.SignExecuteMethodParams<"getRewardPerToken">
    ): Promise<
      StakingAccountTypes.SignExecuteMethodResult<"getRewardPerToken">
    > => {
      return signExecuteMethod(
        StakingAccount,
        this,
        "getRewardPerToken",
        params
      );
    },
  };

  async multicall<Calls extends StakingAccountTypes.MultiCallParams>(
    calls: Calls
  ): Promise<StakingAccountTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      StakingAccount,
      this,
      calls,
      getContractByCodeHash
    )) as StakingAccountTypes.MultiCallResults<Calls>;
  }
}
