import { ContractState, DUST_AMOUNT, ZERO_ADDRESS, web3 } from '@alephium/web3'
import {
  buildProject,
  ContractFixture,
  getContractState,
  randomP2PKHAddress,
  createTestUpgradable
} from './fixtures'
import { expectAssertionError } from '@alephium/web3-test'
import { TestUpgradable, TestUpgradableTypes, TestUpgradableV2 } from '../../artifacts/ts'
import { checkEvent, encodeFields } from '../utils'

describe('Upgradable Contract Tests', () => {
  web3.setCurrentNodeProvider('http://127.0.0.1:22973')

  let genesis: number
  let sender: string
  let secondOwner: string
  let thirdOwner: string
  let fixture: ContractFixture<TestUpgradableTypes.Fields>
  let tokenId: string
  let upgradeDelay: number

  beforeEach(async () => {
    await buildProject();

    sender = randomP2PKHAddress();
    secondOwner = randomP2PKHAddress();
    thirdOwner = randomP2PKHAddress();

    upgradeDelay = Number(604800001n);
    genesis = Date.now();
    fixture = createTestUpgradable(sender);
  })

  // --------------------
  // SECTION: Helpers
  // --------------------
  function changeOwner(newOwner: string, caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.changeOwner({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets,
      testArgs: {
        changeOwner: newOwner
      }
    });
  }

  function changeOwnerApply(caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.changeOwnerApply({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets
    });
  }

  function migrate(newCode: string, caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.migrate({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets,
      testArgs: {
        changeCode: newCode
      }
    });
  }

  function migrateApply(caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.migrateApply({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets
    });
  }

  function migrateWithFields(newCode: string, immFields: string, mutFields: string, caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.migrateWithFields({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets,
      testArgs: {
        changeCode: newCode,
        changeImmFieldsEncoded: immFields,
        changeMutFieldsEncoded: mutFields
      }
    });
  }

  function migrateWithFieldsApply(caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.migrateWithFieldsApply({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets
    });
  }

  function resetUpgrade(caller: string, timestamp: number, state: ContractState<TestUpgradableTypes.Fields>, existingContracts: ContractState[]) {
    const inputAssets = [{ address: caller, asset: { alphAmount: DUST_AMOUNT * 100n } }]
    return TestUpgradable.tests.resetUpgrade({
      initialFields: state.fields,
      initialAsset: state.asset,
      address: state.address,
      existingContracts: existingContracts,
      blockTimeStamp: timestamp,
      inputAssets: inputAssets
    });
  }

  describe('Ownership Changes', () => {
    test('Successfully changes owner', async () => {
      var stateRes = await changeOwner(secondOwner, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      expect(checkEvent(stateRes, "ChangeOwnerCommence", { owner: sender, changeOwner: secondOwner })).toBe(true);

      stateRes = await changeOwnerApply(sender, genesis + upgradeDelay, state, stateRes.contracts);
      state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      expect(checkEvent(stateRes, "ChangeOwnerApply", { owner: sender, changeOwner: secondOwner })).toBe(true);

      stateRes = await changeOwner(thirdOwner, secondOwner, genesis + upgradeDelay, state, stateRes.contracts);
      state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      expect(checkEvent(stateRes, "ChangeOwnerCommence", { owner: secondOwner, changeOwner: thirdOwner })).toBe(true);

      stateRes = await changeOwnerApply(secondOwner, genesis + upgradeDelay * 2, state, stateRes.contracts);
      state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      expect(checkEvent(stateRes, "ChangeOwnerApply", { owner: secondOwner, changeOwner: thirdOwner })).toBe(true);
    });

    test('Fails to change owner if not called by current owner', async () => {
      await expectAssertionError(changeOwner(secondOwner, secondOwner, genesis, fixture.selfState, fixture.dependencies), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.Forbidden))
    });

    test('Fails to apply ownership before delay', async () => {
      var stateRes = await changeOwner(secondOwner, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      await expectAssertionError(changeOwnerApply(sender, genesis + 1000, state, stateRes.contracts), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.UpgradeDelayNotExpired))
    });

    test('Fails to apply ownership change without pending change', async () => {
      var stateRes = await migrate("", sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      await expectAssertionError(changeOwnerApply(sender, genesis + upgradeDelay, state, stateRes.contracts), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.ChangeOwnerNotPending))
    });
  });

  describe('Contract Migrations', () => {
    test('Successfully migrates contract', async () => {
      var stateRes = await migrate(TestUpgradableV2.contract.bytecode, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateCommence", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode })).toBe(true);

      var stateRes = await migrateApply(sender, genesis + upgradeDelay, state, stateRes.contracts);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateApply", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode })).toBe(true);
    });

    test('Successfully migrates contract with fields', async () => {

      var immFields = encodeFields([{
        name: "immValue",
        type: "U256",
        value: fixture.selfState.fields.immValue
      }, {
        name: "upgradeDelay",
        type: "U256",
        value: fixture.selfState.fields.upgradeDelay
      }]);

      var mutFields = encodeFields([{
        name: "mutValue",
        type: "U256",
        value: fixture.selfState.fields.mutValue
      }, {
        name: "owner",
        type: "Address",
        value: fixture.selfState.fields.owner
      }, {
        name: "newOwner",
        type: "Address",
        value: fixture.selfState.fields.newOwner
      }, {
        name: "upgradeCommenced",
        type: "U256",
        value: fixture.selfState.fields.upgradeCommenced
      }, {
        name: "newCode",
        type: "ByteVec",
        value: fixture.selfState.fields.newCode
      }, {
        name: "newImmFieldsEncoded",
        type: "ByteVec",
        value: fixture.selfState.fields.newImmFieldsEncoded
      }, {
        name: "newMutFieldsEncoded",
        type: "ByteVec",
        value: fixture.selfState.fields.newMutFieldsEncoded
      }]);

      var stateRes = await migrateWithFields(TestUpgradableV2.contract.bytecode, immFields, mutFields, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateWithFieldsCommence", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode, changeImmFieldsEncoded: immFields, changeMutFieldsEncoded: mutFields })).toBe(true);

      var stateRes = await migrateWithFieldsApply(sender, genesis + upgradeDelay, state, stateRes.contracts);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateWithFieldsApply", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode, changeImmFieldsEncoded: immFields, changeMutFieldsEncoded: mutFields })).toBe(true);
    });

    test('Fails migration if not called by owner', async () => {
      await expectAssertionError(migrate("", secondOwner, genesis, fixture.selfState, fixture.dependencies), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.Forbidden))
      await expectAssertionError(migrateWithFields("", "", "", secondOwner, genesis, fixture.selfState, fixture.dependencies), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.Forbidden))
    });

    test('Fails migration if upgrade already pending', async () => {
      var stateRes = await migrate(TestUpgradableV2.contract.bytecode, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateCommence", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode })).toBe(true);
      await expectAssertionError(migrate(TestUpgradableV2.contract.bytecode, sender, genesis, state, stateRes.contracts), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.UpgradePending));
    });

    test('Fails migration apply before delay', async () => {
      var stateRes = await migrate(TestUpgradableV2.contract.bytecode, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId)
      expect(checkEvent(stateRes, "MigrateCommence", { owner: sender, changeCode: TestUpgradableV2.contract.bytecode })).toBe(true);
      await expectAssertionError(migrateApply(sender, genesis + 1000, state, stateRes.contracts), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.UpgradeDelayNotExpired));
    });

    test('Fails migration apply without pending migration', async () => {
      var stateRes = await changeOwner(secondOwner, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      await expectAssertionError(migrateApply(sender, genesis + upgradeDelay, state, stateRes.contracts), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.MigrateNotPending));
    });
  });

  describe('Reset Upgrade Functionality', () => {
    test('Successfully resets ongoing upgrade', async () => {
      var stateRes = await changeOwner(secondOwner, sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      stateRes = await resetUpgrade(sender, genesis, fixture.selfState, fixture.dependencies);
      var state = getContractState<TestUpgradableTypes.Fields>(stateRes.contracts, fixture.contractId);
      expect(state.fields.newOwner).toBe(ZERO_ADDRESS);
      expect(state.fields.upgradeCommenced).toBe(0n);
    });

    test('Fails reset upgrade if not called by owner', async () => {
      await expectAssertionError(resetUpgrade(secondOwner, genesis, fixture.selfState, fixture.dependencies), fixture.address, Number(TestUpgradable.consts.UpgradeErrorCodes.Forbidden))
    });
  });
})
