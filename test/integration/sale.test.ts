import { web3, Project, DUST_AMOUNT, ALPH_TOKEN_ID, ONE_ALPH, ContractInstance, addressFromContractId } from '@alephium/web3'
import { getSigner, transfer } from '@alephium/web3-test'
import { DeployContractExecutionResult, Deployments, deployToDevnet } from '@alephium/cli'
import { PrivateKeyWallet } from '@alephium/web3-wallet';
import { SaleFlatPriceAlph, SaleFlatPriceAlphBuyTX, SaleFlatPriceAlphClaimRefundTX, SaleFlatPriceAlphClaimTX, SaleManager, SaleManagerCreateSaleFlatPriceTX } from '../../artifacts/ts'
import configuration from '../../alephium.config'
import { add18Decimals, add18DecimalsToDecimal, balanceOf, deployedContractNotFound, getEventByTxId, sleep } from '../utils';


describe('Sale Contracts Tests', () => {
  let seller: PrivateKeyWallet;
  let seller2: PrivateKeyWallet;
  let seller3: PrivateKeyWallet;
  let buyer1: PrivateKeyWallet;
  let buyer2: PrivateKeyWallet;
  let buyer3: PrivateKeyWallet;
  let buyer4: PrivateKeyWallet;
  let buyer5: PrivateKeyWallet;
  let buyer6: PrivateKeyWallet;
  let buyer7: PrivateKeyWallet;
  let deployments: Deployments;
  let token: DeployContractExecutionResult<ContractInstance>;
  let saleManager: DeployContractExecutionResult<ContractInstance>;
  let accountTemplate: DeployContractExecutionResult<ContractInstance>;
  let saleTemplate: DeployContractExecutionResult<ContractInstance>;
  let tokenId: string;
  let tokenAddress: string;

  beforeAll(async () => {
    web3.setCurrentNodeProvider('http://127.0.0.1:22973', undefined, fetch)
    await Project.build()
    seller = await getSigner(100n * ONE_ALPH, 0)
    seller2 = await getSigner(100n * ONE_ALPH, 0)
    seller3 = await getSigner(100n * ONE_ALPH, 0)
    buyer1 = await getSigner(100n * ONE_ALPH, 0)
    buyer2 = await getSigner(100n * ONE_ALPH, 0)
    buyer3 = await getSigner(100n * ONE_ALPH, 0)
    buyer4 = await getSigner(100n * ONE_ALPH, 0)
    buyer5 = await getSigner(100n * ONE_ALPH, 0)
    buyer6 = await getSigner(100n * ONE_ALPH, 0)
    buyer7 = await getSigner(100n * ONE_ALPH, 0)
    deployments = await deployToDevnet()

    const testGroup = 0
    // Fetch APAD Information
    token = deployments.getDeployedContractResult(testGroup, 'ApadToken') || deployedContractNotFound("ApadToken");
    tokenId = token.contractInstance.contractId
    tokenAddress = token.contractInstance.address

    saleManager = deployments.getDeployedContractResult(testGroup, 'SaleManager') || deployedContractNotFound("SaleManager");
    saleTemplate = deployments.getDeployedContractResult(testGroup, 'SaleFlatPriceAlph') || deployedContractNotFound("SaleFlatPriceAlph");
    accountTemplate = deployments.getDeployedContractResult(testGroup, 'SaleBuyerAccount') || deployedContractNotFound("SaleBuyerAccount");
    // Transfer APAD for testing
    const genesisWallet = new PrivateKeyWallet({ privateKey: configuration.networks.devnet.privateKeys[0] })
    await transfer(genesisWallet, seller.address, tokenId, add18Decimals(BigInt(1e6)))
    await transfer(genesisWallet, seller2.address, tokenId, add18Decimals(BigInt(1e6)))
    await transfer(genesisWallet, seller3.address, tokenId, add18Decimals(BigInt(1e6)))
  }, 10000)

  it('Confirms successful sale max raise flow', async () => {
    const listingFee = (await SaleManager.at(saleManager.contractInstance.address).methods.calculateListingFee()).returns
    const res = await SaleManagerCreateSaleFlatPriceTX.execute(seller, {
      initialFields: {
        saleManager: saleManager.contractInstance.contractId,
        amountAlph: listingFee,
        tokenPrice: add18DecimalsToDecimal(0.0002),
        saleStart: BigInt(Date.now() + 10000),
        saleEnd: BigInt(Date.now() + 20000),
        minRaise: add18Decimals(100n),
        maxRaise: add18Decimals(200n),
        saleTokenId: tokenId,
        saleTokenTotalAmount: add18Decimals(BigInt(1e6)),
        isWLSale: false,
        whitelistSaleStart: 0n,
        whitelistSaleEnd: 0n,
        whitelistBuyerMaxBid: 0n,
        merkleRoot: ""
      },
      attoAlphAmount: listingFee + ONE_ALPH,
      tokens: [
        {
          amount: add18Decimals(BigInt(1e6)),
          id: tokenId
        }
      ]
    });
    await sleep(10000);
    const createEvent = await getEventByTxId(res.txId, SaleManager.contract.codeHash, 2);
    const flatPriceSaleContractId = createEvent.fields.contractId.toString();
    const flatPriceSaleInst = SaleFlatPriceAlph.at(addressFromContractId(flatPriceSaleContractId));
    
    await SaleFlatPriceAlphBuyTX.execute(buyer1, {
      initialFields: {
        amountAlph: add18Decimals(30n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(30n) + ONE_ALPH,
    })

    await SaleFlatPriceAlphBuyTX.execute(buyer1, {
      initialFields: {
        amountAlph: add18Decimals(30n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(30n),
    })

    await SaleFlatPriceAlphBuyTX.execute(buyer2, {
      initialFields: {
        amountAlph: add18Decimals(50n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(50n) + ONE_ALPH,
    })

    await SaleFlatPriceAlphBuyTX.execute(buyer3, {
      initialFields: {
        amountAlph: add18Decimals(90n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(90n) + ONE_ALPH,
    })

    await sleep(10000);

    await SaleFlatPriceAlphClaimTX.execute(buyer1, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(300000n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimTX.execute(buyer2, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(250000n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimTX.execute(buyer3, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(450000n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimTX.execute(seller, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(200n)
      },
      attoAlphAmount: DUST_AMOUNT
    })


    let apadBalance = await balanceOf(tokenId, seller.address);
    let alphBalance = await balanceOf(ALPH_TOKEN_ID, seller.address);
    expect(apadBalance).toBe(0n);
    expect(alphBalance).toBeGreaterThan(add18Decimals(200n));

    apadBalance = await balanceOf(tokenId, buyer1.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer1.address);
    expect(apadBalance).toBe(add18Decimals(300000n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(39n));

    apadBalance = await balanceOf(tokenId, buyer2.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer2.address);
    expect(apadBalance).toBe(add18Decimals(250000n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(49n));

    apadBalance = await balanceOf(tokenId, buyer3.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer3.address);
    expect(apadBalance).toBe(add18Decimals(450000n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(9n));
  }, 60000)

  it('Confirms successful sale min raise flow', async () => {
    const listingFee = (await SaleManager.at(saleManager.contractInstance.address).methods.calculateListingFee()).returns
    const res = await SaleManagerCreateSaleFlatPriceTX.execute(seller2, {
      initialFields: {
        saleManager: saleManager.contractInstance.contractId,
        amountAlph: listingFee,
        tokenPrice: add18DecimalsToDecimal(0.0002),
        saleStart: BigInt(Date.now() + 10000),
        saleEnd: BigInt(Date.now() + 20000),
        minRaise: add18Decimals(100n),
        maxRaise: add18Decimals(200n),
        saleTokenId: tokenId,
        saleTokenTotalAmount: add18Decimals(BigInt(1e6)),
        isWLSale: false,
        whitelistSaleStart: 0n,
        whitelistSaleEnd: 0n,
        whitelistBuyerMaxBid: 0n,
        merkleRoot: ""
      },
      attoAlphAmount: listingFee + ONE_ALPH,
      tokens: [
        {
          amount: add18Decimals(BigInt(1e6)),
          id: tokenId
        }
      ]
    });
    await sleep(10000);
    const createEvent = await getEventByTxId(res.txId, SaleManager.contract.codeHash, 2);
    const flatPriceSaleContractId = createEvent.fields.contractId.toString();
    const flatPriceSaleInst = SaleFlatPriceAlph.at(addressFromContractId(flatPriceSaleContractId));

    await SaleFlatPriceAlphBuyTX.execute(buyer4, {
      initialFields: {
        amountAlph: add18Decimals(50n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(50n) + ONE_ALPH,
    })

    await SaleFlatPriceAlphBuyTX.execute(buyer5, {
      initialFields: {
        amountAlph: add18Decimals(50n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(50n) + ONE_ALPH,
    })

    await sleep(10000);

    await SaleFlatPriceAlphClaimTX.execute(buyer4, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(250000n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimTX.execute(buyer5, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(250000n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    let tx = await SaleFlatPriceAlphClaimTX.execute(seller2, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(100n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    let apadBalance = await balanceOf(tokenId, seller2.address);
    let alphBalance = await balanceOf(ALPH_TOKEN_ID, seller2.address);
    expect(apadBalance).toBe(add18Decimals(BigInt(1e6) / 2n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(150n));

    apadBalance = await balanceOf(tokenId, buyer4.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer4.address);
    expect(apadBalance).toBe(add18Decimals(250000n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(49n));

    apadBalance = await balanceOf(tokenId, buyer5.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer5.address);
    expect(apadBalance).toBe(add18Decimals(250000n));
    expect(alphBalance).toBeGreaterThan(add18Decimals(49n));
  }, 60000)

  it('Confirms refund when sale min not reached', async () => {
    const listingFee = (await SaleManager.at(saleManager.contractInstance.address).methods.calculateListingFee()).returns
    const res = await SaleManagerCreateSaleFlatPriceTX.execute(seller3, {
      initialFields: {
        saleManager: saleManager.contractInstance.contractId,
        amountAlph: listingFee,
        tokenPrice: add18DecimalsToDecimal(0.0002),
        saleStart: BigInt(Date.now() + 10000),
        saleEnd: BigInt(Date.now() + 20000),
        minRaise: add18Decimals(100n),
        maxRaise: add18Decimals(200n),
        saleTokenId: tokenId,
        saleTokenTotalAmount: add18Decimals(BigInt(1e6)),
        isWLSale: false,
        whitelistSaleStart: 0n,
        whitelistSaleEnd: 0n,
        whitelistBuyerMaxBid: 0n,
        merkleRoot: ""
      },
      attoAlphAmount: listingFee + ONE_ALPH,
      tokens: [
        {
          amount: add18Decimals(BigInt(1e6)),
          id: tokenId
        }
      ]
    });
    await sleep(10000);
    const createEvent = await getEventByTxId(res.txId, SaleManager.contract.codeHash, 2);
    const flatPriceSaleContractId = createEvent.fields.contractId.toString();
    const flatPriceSaleInst = SaleFlatPriceAlph.at(addressFromContractId(flatPriceSaleContractId));
    await SaleFlatPriceAlphBuyTX.execute(buyer6, {
      initialFields: {
        amountAlph: add18Decimals(40n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(40n) + ONE_ALPH,
    })

    await SaleFlatPriceAlphBuyTX.execute(buyer7, {
      initialFields: {
        amountAlph: add18Decimals(40n),
        merkleProof: "",
        saleFlatPrice: flatPriceSaleContractId
      },
      attoAlphAmount: add18Decimals(40n) + ONE_ALPH,
    })

    await sleep(10000);

    await SaleFlatPriceAlphClaimRefundTX.execute(buyer6, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(40n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimRefundTX.execute(buyer7, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(40n)
      },
      attoAlphAmount: DUST_AMOUNT
    })

    await SaleFlatPriceAlphClaimRefundTX.execute(seller3, {
      initialFields: {
        saleFlatPrice: flatPriceSaleContractId,
        amount: add18Decimals(BigInt(1e6))
      },
      attoAlphAmount: DUST_AMOUNT
    })

    let apadBalance = await balanceOf(tokenId, seller3.address);
    let alphBalance = await balanceOf(ALPH_TOKEN_ID, seller3.address);
    expect(apadBalance).toBe(add18Decimals(BigInt(1e6)));
    expect(alphBalance).toBeLessThan(add18Decimals(90n));

    apadBalance = await balanceOf(tokenId, buyer6.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer6.address);
    expect(apadBalance).toBe(0n);
    expect(alphBalance).toBeGreaterThan(add18Decimals(99n));

    apadBalance = await balanceOf(tokenId, buyer7.address);
    alphBalance = await balanceOf(ALPH_TOKEN_ID, buyer7.address);
    expect(apadBalance).toBe(0n);
    expect(alphBalance).toBeGreaterThan(add18Decimals(99n));
  }, 60000)
})
