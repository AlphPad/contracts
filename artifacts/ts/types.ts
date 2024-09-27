/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Address, HexString, Val, Struct } from "@alephium/web3";
import { default as allStructsJson } from "../structs.ral.json";
export const AllStructs = allStructsJson.map((json) => Struct.fromJson(json));
export interface ListingRecord extends Record<string, Val> {
  owner: Address;
  status: HexString;
  saleContractId: HexString;
}