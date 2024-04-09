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
import { default as TestUpgradableV2ContractJson } from "../lib/dummy/TestUpgradableV2.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace TestUpgradableV2Types {
  export type Fields = {
    immValue: bigint;
    upgradeDelay: bigint;
    mutValue: bigint;
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
    getImmValue: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getMutValue: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getTotal: {
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
  TestUpgradableV2Instance,
  TestUpgradableV2Types.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as TestUpgradableV2Types.Fields;
  }

  eventIndex = {
    ChangeOwnerCommence: 0,
    ChangeOwnerApply: 1,
    MigrateCommence: 2,
    MigrateApply: 3,
    MigrateWithFieldsCommence: 4,
    MigrateWithFieldsApply: 5,
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
  };

  at(address: string): TestUpgradableV2Instance {
    return new TestUpgradableV2Instance(address);
  }

  tests = {
    changeOwner: async (
      params: TestContractParams<
        TestUpgradableV2Types.Fields,
        { changeOwner: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "changeOwner", params);
    },
    migrate: async (
      params: TestContractParams<
        TestUpgradableV2Types.Fields,
        { changeCode: HexString }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "migrate", params);
    },
    migrateWithFields: async (
      params: TestContractParams<
        TestUpgradableV2Types.Fields,
        {
          changeCode: HexString;
          changeImmFieldsEncoded: HexString;
          changeMutFieldsEncoded: HexString;
        }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "migrateWithFields", params);
    },
    changeOwnerApply: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "changeOwnerApply", params);
    },
    migrateApply: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "migrateApply", params);
    },
    migrateWithFieldsApply: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "migrateWithFieldsApply", params);
    },
    resetUpgrade: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "resetUpgrade", params);
    },
    getUpgradeDelay: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getUpgradeDelay", params);
    },
    getOwner: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getOwner", params);
    },
    getNewOwner: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<Address>> => {
      return testMethod(this, "getNewOwner", params);
    },
    getUpgradeCommenced: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getUpgradeCommenced", params);
    },
    getNewCode: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getNewCode", params);
    },
    getNewImmFieldsEncoded: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getNewImmFieldsEncoded", params);
    },
    getNewMutFieldsEncoded: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString>> => {
      return testMethod(this, "getNewMutFieldsEncoded", params);
    },
    resetFields: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "resetFields", params);
    },
    assertOnlyOwner: async (
      params: TestContractParams<
        TestUpgradableV2Types.Fields,
        { caller: Address }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertOnlyOwner", params);
    },
    assertUpgradeNotPending: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertUpgradeNotPending", params);
    },
    assertUpgradeDelayElapsed: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "assertUpgradeDelayElapsed", params);
    },
    getImmValue: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getImmValue", params);
    },
    getMutValue: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getMutValue", params);
    },
    getTotal: async (
      params: Omit<
        TestContractParams<TestUpgradableV2Types.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getTotal", params);
    },
    setMutValue: async (
      params: TestContractParams<
        TestUpgradableV2Types.Fields,
        { newMutValue: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "setMutValue", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TestUpgradableV2 = new Factory(
  Contract.fromJson(
    TestUpgradableV2ContractJson,
    "",
    "acb86f28101a38a11d92aaad09ec4e4af2367ef7b61c319b28075d321677b0d5"
  )
);

// Use this class to interact with the blockchain
export class TestUpgradableV2Instance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TestUpgradableV2Types.State> {
    return fetchContractState(TestUpgradableV2, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeChangeOwnerCommenceEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.ChangeOwnerCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "ChangeOwnerCommence",
      fromCount
    );
  }

  subscribeChangeOwnerApplyEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.ChangeOwnerApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "ChangeOwnerApply",
      fromCount
    );
  }

  subscribeMigrateCommenceEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.MigrateCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "MigrateCommence",
      fromCount
    );
  }

  subscribeMigrateApplyEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.MigrateApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "MigrateApply",
      fromCount
    );
  }

  subscribeMigrateWithFieldsCommenceEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.MigrateWithFieldsCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "MigrateWithFieldsCommence",
      fromCount
    );
  }

  subscribeMigrateWithFieldsApplyEvent(
    options: EventSubscribeOptions<TestUpgradableV2Types.MigrateWithFieldsApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      TestUpgradableV2.contract,
      this,
      options,
      "MigrateWithFieldsApply",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | TestUpgradableV2Types.ChangeOwnerCommenceEvent
      | TestUpgradableV2Types.ChangeOwnerApplyEvent
      | TestUpgradableV2Types.MigrateCommenceEvent
      | TestUpgradableV2Types.MigrateApplyEvent
      | TestUpgradableV2Types.MigrateWithFieldsCommenceEvent
      | TestUpgradableV2Types.MigrateWithFieldsApplyEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      TestUpgradableV2.contract,
      this,
      options,
      fromCount
    );
  }

  methods = {
    getUpgradeDelay: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getUpgradeDelay">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getUpgradeDelay">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getUpgradeDelay",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getOwner: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getOwner">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getOwner">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewOwner: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getNewOwner">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getNewOwner">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getNewOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getUpgradeCommenced: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getUpgradeCommenced">
    ): Promise<
      TestUpgradableV2Types.CallMethodResult<"getUpgradeCommenced">
    > => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getUpgradeCommenced",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewCode: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getNewCode">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getNewCode">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getNewCode",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewImmFieldsEncoded: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getNewImmFieldsEncoded">
    ): Promise<
      TestUpgradableV2Types.CallMethodResult<"getNewImmFieldsEncoded">
    > => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getNewImmFieldsEncoded",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewMutFieldsEncoded: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getNewMutFieldsEncoded">
    ): Promise<
      TestUpgradableV2Types.CallMethodResult<"getNewMutFieldsEncoded">
    > => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getNewMutFieldsEncoded",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getImmValue: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getImmValue">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getImmValue">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getImmValue",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getMutValue: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getMutValue">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getMutValue">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getMutValue",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getTotal: async (
      params?: TestUpgradableV2Types.CallMethodParams<"getTotal">
    ): Promise<TestUpgradableV2Types.CallMethodResult<"getTotal">> => {
      return callMethod(
        TestUpgradableV2,
        this,
        "getTotal",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends TestUpgradableV2Types.MultiCallParams>(
    calls: Calls
  ): Promise<TestUpgradableV2Types.MultiCallResults<Calls>> {
    return (await multicallMethods(
      TestUpgradableV2,
      this,
      calls,
      getContractByCodeHash
    )) as TestUpgradableV2Types.MultiCallResults<Calls>;
  }
}
