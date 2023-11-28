// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";
import mysql from "mysql";


var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'K#dK84fvUhHgb*XtS$8#4V2L3%NKk*w5GTdYn&R$',
  database : 'nftmark',
  charset: "utf8mb4_unicode_ci"
});
connection.connect();
const settingsEth = {
apiKey: "MALrZgF917YEJv872S2wu5pzhahIaIYv", // Replace with your Alchemy API Key.:
network: Network.MAINNET, // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
};

const settingsEthGoerli = {
apiKey: "tQCBki4D6LCzWPKVOtzZmFEQMHfdoF1i", // Replace with your Alchemy API Key.:
network: Network.ETH_GOERLI, // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
};

const settingsPolygon = {
apiKey: "bymgtqV-vK2N2VE71SP3a14_qD0PqDC4", // Replace with your Alchemy API Key.:
network: Network.MATIC_MAINNET // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
};

const settingsPolygonMumbai = {
apiKey: "gWKyERYIsi2_LRoi6KnQskxwk9IKxvIv", // Replace with your Alchemy API Key.:
network: Network.MATIC_MUMBAI, // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
};

const alchemyEth = new Alchemy(settingsEth);
const alchemyEthGoerli = new Alchemy(settingsEthGoerli);
const alchemyPolygon = new Alchemy(settingsPolygon);
const alchemyPolygonMumbai = new Alchemy(settingsPolygonMumbai);

while(true === true) {
console.log('->', Date.now());
var q  = "SELECT distinct n.contract, n.chain FROM nftmark.nfts as n LEFT JOIN nftmark.contracts as c using(contract) where c.contract is null";

connection.query(q, function (error, results, fields) {
  if (error) throw error;
  results.forEach((res) => {
    const contract = JSON.parse(JSON.stringify(res))
    
    // console.log(contract);

    const main2 = async (address) => {
      // console.log(address);
      // const response = await alchemy.nft.getContractMetadata(address)
      if(results[0].chain == 'eth') {
        const response = await alchemyEth.nft.getContractMetadata(address);
        return response;
      }
      else if(results[0].chain == 'eth_goerli') {
        const response = await alchemyEthGoerli.nft.getContractMetadata(address);
        return response;
      }
      else if(results[0].chain == 'polygon') {
        const response = await alchemyPolygon.nft.getContractMetadata(address);
        return response;
      }
      else if(results[0].chain == 'polygon_mumbai') {
        const response = await alchemyPolygonMumbai.nft.getContractMetadata(address);
        return response;
      }      
       

  } 

  main2(contract.contract).then((res)=>{
    console.log('res-----', res);
    const q  = "INSERT INTO nftmark.contracts SET ?";
    const v = {'contract': contract.contract,'chain':results[0].chain, 'raw': JSON.stringify(res), 'name':res.name, 'symbol':res.symbol, 'totalSupply':res.totalSupply, 'name':res.name, 'tokenType':res.tokenType, 'contractDeployer':res.contractDeployer, 'description':res.openSeaMetadata.description, 'image':res.openSeaMetadata.imageUrl, 'externalUrl':res.openSeaMetadata.externalUrl, 'twitterUsername':res.openSeaMetadata.twitterUsername, 'discordUrl':res.openSeaMetadata.discordUrl  };
    
    connection.query(q, v, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    });
  });



});
});


await new Promise(resolve => setTimeout(resolve, 3000));
}
connection.end();
// const response = await alchemy.nft.getContractMetadata('0x00207f659cea7fa98269c1d25bd35618b7cc3766')
// console.log('CINFO=====', response, 'end CINFO=====');


