import { Configuration } from '@alephium/cli'
import { Number256 } from '@alephium/web3'

// Settings are usually for configuring
export type Settings = {
  issueTokenAmount: Number256
  upgradeDelay: bigint,
  rewards: {
    unstakeLockTime: bigint,
    rdEpochDuration: bigint
  },
  team: {
    tokenAmount: bigint,
    tokenVestingPeriod: bigint
  },
  sale: {
    tokenPair: string
  },
  openaiAPIKey?: string
  ipfs?: {
    infura?: {
      projectId: string,
      projectSecret: string
    }
  }
}

const devnetSettings: Settings = {
  issueTokenAmount: 100_000_000n * 10n ** 18n,
  upgradeDelay: 259200n,
  rewards: {
    unstakeLockTime: 0n,
    rdEpochDuration: 5000n
  },
  team: {
    tokenAmount: 10n * 10n ** 18n,
    tokenVestingPeriod: 126230400000n
  },
  sale: {
    tokenPair: ""
  },
  openaiAPIKey: process.env.OPENAI_API_KEY || '',
  ipfs: {
    infura: {
      projectId: process.env.IPFS_INFURA_PROJECT_ID || '',
      projectSecret: process.env.IPFS_INFURA_PROJECT_SECRET || ''
    }
  }
}

const testnetSettings: Settings = {
  issueTokenAmount: 100_000_000n * 10n ** 18n,
  upgradeDelay: 86400000n, // 1 days
  rewards: {
    unstakeLockTime: 86400000n, // 1 day
    rdEpochDuration: 43200000n, // 12 hours
  },
  team: {
    tokenAmount: 15_000_000n * 10n ** 18n,
    tokenVestingPeriod: 126230400000n
  },
  sale: {
    tokenPair: ""
  },
  openaiAPIKey: process.env.OPENAI_API_KEY || '',
  ipfs: {
    infura: {
      projectId: process.env.IPFS_INFURA_PROJECT_ID || '',
      projectSecret: process.env.IPFS_INFURA_PROJECT_SECRET || ''
    }
  }
}



const mainnetSettings: Settings = {
  issueTokenAmount: 100_000_000n * 10n ** 18n,
  upgradeDelay: 604800000n, // 7 days
  rewards: {
    unstakeLockTime: 259200000n, // 3 days
    rdEpochDuration: 864000000n, // 10 days
  },
  team: {
    tokenAmount: 15_000_000n * 10n ** 18n,
    tokenVestingPeriod: 126230400000n
  },
  sale: {
    tokenPair: "2A5R8KZQ3rhKYrW7bAS4JTjY9FCFLJg6HjQpqSFZBqACX"
  },
  openaiAPIKey: process.env.OPENAI_API_KEY || '',
  ipfs: {
    infura: {
      projectId: process.env.IPFS_INFURA_PROJECT_ID || '',
      projectSecret: process.env.IPFS_INFURA_PROJECT_SECRET || ''
    }
  }
}

const configuration: Configuration<Settings> = {
  networks: {
    devnet: {
      nodeUrl: 'http://localhost:22973',
      // here we could configure which address groups to deploy the contract
      privateKeys: ['a642942e67258589cd2b1822c631506632db5a12aabcf413604e785300d762a5'],
      settings: devnetSettings
    },

    testnet: {
      nodeUrl: process.env.NODE_URL as string,
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: testnetSettings
    },

    mainnet: {
      nodeUrl: process.env.NODE_URL as string,
      privateKeys: process.env.PRIVATE_KEYS === undefined ? [] : process.env.PRIVATE_KEYS.split(','),
      settings: mainnetSettings
    }
  }
}

export default configuration