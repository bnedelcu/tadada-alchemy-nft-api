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
  // note: time restrction is done on the API level, preventing insert into this table
  var q  = "SELECT id, address, chain FROM nftmark.queue_nfts_by_address where completed_at IS NULL  ORDER BY created_at ASC";
  connection.query(q, function (error, results, fields) {
    if (error) throw error;
    // console.log(results);
  // update as completed
  async function pullAlchemy(results) {
  if(results[0]?.id) {
    console.log(results[0].address);
    console.log(results[0].chain);
    var nftsForOwner = '';
    // alchemy req
    if(results[0].chain == 'eth') {
      nftsForOwner = await alchemyEth.nft.getNftsForOwner(results[0].address);
    }
    else if(results[0].chain == 'eth_goerli') {
      nftsForOwner = await alchemyEthGoerli.nft.getNftsForOwner(results[0].address);
    }
    else if(results[0].chain == 'polygon') {
      nftsForOwner = await alchemyPolygon.nft.getNftsForOwner(results[0].address);
    }
    else if(results[0].chain == 'polygon_mumbai') {
      nftsForOwner = await alchemyPolygonMumbai.nft.getNftsForOwner(results[0].address);
    }
    
    if(nftsForOwner == '') { 
      console.log('RETURNED EARLY');
      return; 
    }

    console.log('count', nftsForOwner);
    if(nftsForOwner.totalCount > 0) {
      for (const nft of nftsForOwner.ownedNfts) {
        console.log('nft\n', nft);
        console.log('tokenType', nft.tokenType);
        console.log('tokenType', nft.image.pngUrl);

          var q  = "INSERT INTO nftmark.nfts SET ? ON DUPLICATE KEY update id=id";
        var v = {'wallet_id': results[0].address, 'chain': results[0].chain, 'contract': nft?.contract?.address, 'token_id': nft?.tokenId, 'token_type': nft?.tokenType, 'raw': JSON.stringify(nft), 'name': nft?.name, 'description': nft?.description, 'image': nft?.image?.pngUrl, 'attributes':JSON.stringify(nft?.raw?.metadata?.attributes)};
        
        // INSERT INTO DB
        connection.query(q, v, function (error, results, fields) {
          if (error) throw error;
          console.log(results); 
        });
        // END INSERT
        
      }
    }
    // end

    var q  = `UPDATE nftmark.queue_nfts_by_address SET completed_at=now() WHERE id=${results[0].id}`;
    connection.query(q, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
    });
  }
}
pullAlchemy(results);
  // end update    
  });




  await new Promise(resolve => setTimeout(resolve, 3000));
}
connection.end();



// FUNCTIONS

