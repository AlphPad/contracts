import { expectAssertionError, testAddress, testPrivateKey } from '@alephium/web3-test'
import { PrivateKeyWallet } from '@alephium/web3-wallet'
import { Contract, ContractEvent, ContractInstance, encodeContractField, encodeVmI256, node, NodeProvider, TestContractResult, Val, waitForTxConfirmation } from "@alephium/web3"
import {
  ALPH_TOKEN_ID,
  Address,
  DUST_AMOUNT,
  HexString,
  ONE_ALPH,
  SignerProvider,
  binToHex,
  groupOfAddress,
  hexToBinUnsafe,
  web3
} from '@alephium/web3'
import { randomBytes } from 'crypto'
import * as base58 from 'bs58'
import { DeployContractExecutionResult } from '@alephium/cli'
import * as blake from 'blakejs'

web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
export const defaultSigner = new PrivateKeyWallet({ privateKey: testPrivateKey })


export async function balanceOf(tokenId: string, address = testAddress): Promise<bigint> {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  if (tokenId === ALPH_TOKEN_ID) return BigInt(balances.balance)
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId)
  return balance === undefined ? 0n : BigInt(balance.amount)
}

export function add18Decimals(amount: bigint) {
  return amount * 10n ** 18n;
}


export function add18DecimalsToDecimal(amount: number) {
  return BigInt(amount * 10 ** 18);
}

function isConfirmed(txStatus: node.TxStatus): txStatus is node.Confirmed {
  return txStatus.type === 'Confirmed'
}

export function checkEvent<T>(result: TestContractResult<T>, eventName: string, fields?: object): Boolean {
  let event = result.events.find(x => x.name == eventName);
  if (event && fields) {
    return JSON.stringify(fields) == JSON.stringify(event.fields)
  }
  if (!event) return false;
  return true;
}

function _encodeField<T>(fieldName: string, encodeFunc: () => T): T {
  try {
    return encodeFunc()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid ${fieldName}, error: ${error.message}`)
    }
    throw error
  }
}

export function encodeFields(fields: { name: string; type: string; value: Val }[]): string {
  const prefix = binToHex(encodeVmI256(BigInt(fields.length)))
  const encoded = fields
    .map((field) => binToHex(_encodeField(field.name, () => encodeContractField(field.type, field.value))))
    .join('')
  return prefix + encoded
}

export function deployedContractNotFound(message): DeployContractExecutionResult<ContractInstance> {
  throw new Error(message);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getEventByTxId<T extends ContractEvent>(txId: string, codehash: string, eventIndex: number) {
  const result = await web3.getCurrentNodeProvider().events.getEventsTxIdTxid(txId)
  //return Contract.fromApiEvent(result.events[eventIndex], codehash, txId) as T
  return result.events[0];
}
