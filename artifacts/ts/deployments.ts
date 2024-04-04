/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { RunScriptResult, DeployContractExecutionResult } from "@alephium/cli";
import { NetworkId } from "@alephium/web3";
import {
  ApadToken,
  ApadTokenInstance,
  StakingAccount,
  StakingAccountInstance,
  Staking,
  StakingInstance,
  RewardDistributor,
  RewardDistributorInstance,
  SaleBuyerAccount,
  SaleBuyerAccountInstance,
  SaleFlatPrice,
  SaleFlatPriceInstance,
  TokenPair,
  TokenPairInstance,
  SaleManager,
  SaleManagerInstance,
} from ".";
import { default as testnetDeployments } from "../.deployments.testnet.json";
import { default as devnetDeployments } from "../.deployments.devnet.json";

export type Deployments = {
  deployerAddress: string;
  contracts: {
    ApadToken: DeployContractExecutionResult<ApadTokenInstance>;
    StakingAccount: DeployContractExecutionResult<StakingAccountInstance>;
    Staking: DeployContractExecutionResult<StakingInstance>;
    RewardDistributor: DeployContractExecutionResult<RewardDistributorInstance>;
    SaleBuyerAccount: DeployContractExecutionResult<SaleBuyerAccountInstance>;
    SaleFlatPrice: DeployContractExecutionResult<SaleFlatPriceInstance>;
    TokenPair: DeployContractExecutionResult<TokenPairInstance>;
    SaleManager: DeployContractExecutionResult<SaleManagerInstance>;
  };
  scripts: {
    ApadTokenMintTX: RunScriptResult;
    StakingStakeTX: RunScriptResult;
  };
};

function toDeployments(json: any): Deployments {
  const contracts = {
    ApadToken: {
      ...json.contracts["ApadToken"],
      contractInstance: ApadToken.at(
        json.contracts["ApadToken"].contractInstance.address
      ),
    },
    StakingAccount: {
      ...json.contracts["StakingAccount"],
      contractInstance: StakingAccount.at(
        json.contracts["StakingAccount"].contractInstance.address
      ),
    },
    Staking: {
      ...json.contracts["Staking"],
      contractInstance: Staking.at(
        json.contracts["Staking"].contractInstance.address
      ),
    },
    RewardDistributor: {
      ...json.contracts["RewardDistributor"],
      contractInstance: RewardDistributor.at(
        json.contracts["RewardDistributor"].contractInstance.address
      ),
    },
    SaleBuyerAccount: {
      ...json.contracts["SaleBuyerAccount"],
      contractInstance: SaleBuyerAccount.at(
        json.contracts["SaleBuyerAccount"].contractInstance.address
      ),
    },
    SaleFlatPrice: {
      ...json.contracts["SaleFlatPrice"],
      contractInstance: SaleFlatPrice.at(
        json.contracts["SaleFlatPrice"].contractInstance.address
      ),
    },
    TokenPair: {
      ...json.contracts["TokenPair"],
      contractInstance: TokenPair.at(
        json.contracts["TokenPair"].contractInstance.address
      ),
    },
    SaleManager: {
      ...json.contracts["SaleManager"],
      contractInstance: SaleManager.at(
        json.contracts["SaleManager"].contractInstance.address
      ),
    },
  };
  return {
    ...json,
    contracts: contracts as Deployments["contracts"],
    scripts: {
      ApadTokenMintTX: json.scripts["ApadTokenMintTX"],
      StakingStakeTX: json.scripts["StakingStakeTX"],
    },
  };
}

export function loadDeployments(
  networkId: NetworkId,
  deployerAddress?: string
): Deployments {
  const deployments =
    networkId === "testnet"
      ? testnetDeployments
      : networkId === "devnet"
      ? devnetDeployments
      : undefined;
  if (deployments === undefined) {
    throw Error("The contract has not been deployed to the " + networkId);
  }
  const allDeployments = Array.isArray(deployments)
    ? deployments
    : [deployments];
  if (deployerAddress === undefined) {
    if (allDeployments.length > 1) {
      throw Error(
        "The contract has been deployed multiple times on " +
          networkId +
          ", please specify the deployer address"
      );
    } else {
      return toDeployments(allDeployments[0]);
    }
  }
  const result = allDeployments.find(
    (d) => d.deployerAddress === deployerAddress
  );
  if (result === undefined) {
    throw Error("The contract deployment result does not exist");
  }
  return toDeployments(result);
}
