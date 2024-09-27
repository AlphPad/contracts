/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, ContractFactory } from "@alephium/web3";
import {
  ApadToken,
  BurnALPH,
  DummyToken,
  RewardDistributor,
  SaleBuyerAccount,
  SaleFlatPriceAlph,
  SaleFlatPriceAlphV2,
  SaleFlatPriceAlphV3,
  SaleManager,
  SaleManagerV2,
  SaleManagerV3,
  Staking,
  StakingAccount,
  TestUpgradable,
  TestUpgradableV2,
  TokenPair,
} from ".";

let contracts: ContractFactory<any>[] | undefined = undefined;
export function getContractByCodeHash(codeHash: string): Contract {
  if (contracts === undefined) {
    contracts = [
      ApadToken,
      BurnALPH,
      DummyToken,
      RewardDistributor,
      SaleBuyerAccount,
      SaleFlatPriceAlph,
      SaleFlatPriceAlphV2,
      SaleFlatPriceAlphV3,
      SaleManager,
      SaleManagerV2,
      SaleManagerV3,
      Staking,
      StakingAccount,
      TestUpgradable,
      TestUpgradableV2,
      TokenPair,
    ];
  }
  const c = contracts.find(
    (c) =>
      c.contract.codeHash === codeHash || c.contract.codeHashDebug === codeHash
  );
  if (c === undefined) {
    throw new Error("Unknown code with code hash: " + codeHash);
  }
  return c.contract;
}
