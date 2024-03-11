/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  ExecutableScript,
  ExecuteScriptParams,
  ExecuteScriptResult,
  Script,
  SignerProvider,
  HexString,
} from "@alephium/web3";
import { default as ApadTokenBurnTXScriptJson } from "../ApadTokenBurnTX.ral.json";
import { default as ApadTokenMintTXScriptJson } from "../ApadTokenMintTX.ral.json";
import { default as IUpgradableChangeOwnerApplyTXScriptJson } from "../lib/upgradable/IUpgradableChangeOwnerApplyTX.ral.json";
import { default as IUpgradableChangeOwnerTXScriptJson } from "../lib/upgradable/IUpgradableChangeOwnerTX.ral.json";
import { default as IUpgradableMigrateApplyTXScriptJson } from "../lib/upgradable/IUpgradableMigrateApplyTX.ral.json";
import { default as IUpgradableMigrateTXScriptJson } from "../lib/upgradable/IUpgradableMigrateTX.ral.json";
import { default as IUpgradableMigrateWithFieldsApplyTXScriptJson } from "../lib/upgradable/IUpgradableMigrateWithFieldsApplyTX.ral.json";
import { default as IUpgradableMigrateWithFieldsTXScriptJson } from "../lib/upgradable/IUpgradableMigrateWithFieldsTX.ral.json";
import { default as IUpgradableResetUpgradeTXScriptJson } from "../lib/upgradable/IUpgradableResetUpgradeTX.ral.json";
import { default as RewardDistributorAddRewardsTXScriptJson } from "../rewards/RewardDistributorAddRewardsTX.ral.json";
import { default as RewardDistributorHarvestTXScriptJson } from "../rewards/RewardDistributorHarvestTX.ral.json";
import { default as SaleFlatPriceBuyTXScriptJson } from "../launch_sale/SaleFlatPriceBuyTX.ral.json";
import { default as SaleFlatPriceClaimRefundTXScriptJson } from "../launch_sale/SaleFlatPriceClaimRefundTX.ral.json";
import { default as SaleFlatPriceClaimTXScriptJson } from "../launch_sale/SaleFlatPriceClaimTX.ral.json";
import { default as SaleFlatPriceSetMerkleRootTXScriptJson } from "../launch_sale/SaleFlatPriceSetMerkleRootTX.ral.json";
import { default as SaleManagerCreateSaleFlatPriceTXScriptJson } from "../launch_sale/SaleManagerCreateSaleFlatPriceTX.ral.json";
import { default as StakingClaimRewardsTXScriptJson } from "../rewards/StakingClaimRewardsTX.ral.json";
import { default as StakingClaimTXScriptJson } from "../rewards/StakingClaimTX.ral.json";
import { default as StakingDepositRewardsTXScriptJson } from "../rewards/StakingDepositRewardsTX.ral.json";
import { default as StakingStakeTXScriptJson } from "../rewards/StakingStakeTX.ral.json";
import { default as StakingUnstakeTXScriptJson } from "../rewards/StakingUnstakeTX.ral.json";

export const ApadTokenBurnTX = new ExecutableScript<{
  token: HexString;
  amount: bigint;
}>(Script.fromJson(ApadTokenBurnTXScriptJson, ""));

export const ApadTokenMintTX = new ExecutableScript<{ token: HexString }>(
  Script.fromJson(ApadTokenMintTXScriptJson, "")
);

export const IUpgradableChangeOwnerApplyTX = new ExecutableScript<{
  upgradable: HexString;
}>(Script.fromJson(IUpgradableChangeOwnerApplyTXScriptJson, ""));

export const IUpgradableChangeOwnerTX = new ExecutableScript<{
  upgradable: HexString;
  changeOwner: Address;
}>(Script.fromJson(IUpgradableChangeOwnerTXScriptJson, ""));

export const IUpgradableMigrateApplyTX = new ExecutableScript<{
  upgradable: HexString;
}>(Script.fromJson(IUpgradableMigrateApplyTXScriptJson, ""));

export const IUpgradableMigrateTX = new ExecutableScript<{
  upgradable: HexString;
  changeCode: HexString;
}>(Script.fromJson(IUpgradableMigrateTXScriptJson, ""));

export const IUpgradableMigrateWithFieldsApplyTX = new ExecutableScript<{
  upgradable: HexString;
}>(Script.fromJson(IUpgradableMigrateWithFieldsApplyTXScriptJson, ""));

export const IUpgradableMigrateWithFieldsTX = new ExecutableScript<{
  upgradable: HexString;
  changeCode: HexString;
  changeImmFieldsEncoded: HexString;
  changeMutFieldsEncoded: HexString;
}>(Script.fromJson(IUpgradableMigrateWithFieldsTXScriptJson, ""));

export const IUpgradableResetUpgradeTX = new ExecutableScript<{
  upgradable: HexString;
}>(Script.fromJson(IUpgradableResetUpgradeTXScriptJson, ""));

export const RewardDistributorAddRewardsTX = new ExecutableScript<{
  rd: HexString;
  amount: bigint;
}>(Script.fromJson(RewardDistributorAddRewardsTXScriptJson, ""));

export const RewardDistributorHarvestTX = new ExecutableScript<{
  rd: HexString;
}>(Script.fromJson(RewardDistributorHarvestTXScriptJson, ""));

export const SaleFlatPriceBuyTX = new ExecutableScript<{
  saleFlatPrice: HexString;
  amountAlph: bigint;
  merkleProof: HexString;
}>(Script.fromJson(SaleFlatPriceBuyTXScriptJson, ""));

export const SaleFlatPriceClaimRefundTX = new ExecutableScript<{
  saleFlatPrice: HexString;
  amount: bigint;
}>(Script.fromJson(SaleFlatPriceClaimRefundTXScriptJson, ""));

export const SaleFlatPriceClaimTX = new ExecutableScript<{
  saleFlatPrice: HexString;
  amount: bigint;
}>(Script.fromJson(SaleFlatPriceClaimTXScriptJson, ""));

export const SaleFlatPriceSetMerkleRootTX = new ExecutableScript<{
  saleFlatPrice: HexString;
  newMerkleRoot: HexString;
}>(Script.fromJson(SaleFlatPriceSetMerkleRootTXScriptJson, ""));

export const SaleManagerCreateSaleFlatPriceTX = new ExecutableScript<{
  saleManager: HexString;
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
}>(Script.fromJson(SaleManagerCreateSaleFlatPriceTXScriptJson, ""));

export const StakingClaimRewardsTX = new ExecutableScript<{
  staking: HexString;
}>(Script.fromJson(StakingClaimRewardsTXScriptJson, ""));

export const StakingClaimTX = new ExecutableScript<{ staking: HexString }>(
  Script.fromJson(StakingClaimTXScriptJson, "")
);

export const StakingDepositRewardsTX = new ExecutableScript<{
  staking: HexString;
  amount: bigint;
}>(Script.fromJson(StakingDepositRewardsTXScriptJson, ""));

export const StakingStakeTX = new ExecutableScript<{
  staking: HexString;
  amount: bigint;
  vestingPeriod: bigint;
}>(Script.fromJson(StakingStakeTXScriptJson, ""));

export const StakingUnstakeTX = new ExecutableScript<{
  staking: HexString;
  amount: bigint;
}>(Script.fromJson(StakingUnstakeTXScriptJson, ""));