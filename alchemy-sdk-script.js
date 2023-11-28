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

// Optional Config object, but defaults to demo api-key and eth-mainnet.
// mainnet
// const settings = {
//   apiKey: "gWKyERYIsi2_LRoi6KnQskxwk9IKxvIv", // Replace with your Alchemy API Key.
//   network: Network.ETH_MAINNET, // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
// };
// mumbai
const settings = {
  apiKey: "bymgtqV-vK2N2VE71SP3a14_qD0PqDC4", // Replace with your Alchemy API Key.
  network: Network.MATIC_MUMBAI, // Replace with your network. - MATIC_MAINNET , MATIC_MUMBAI
};

const alchemy = new Alchemy(settings);

// Get all the image urls for all the NFTs an address owns.  
// async function main() {  
//     for await (const nft of alchemy.nft.getNftsForOwnerIterator('0xa45D808eAFDe8B8E6B6B078fd246e28AD13030E8')) {  
//       console.log(nft.media);  
//     }  
//   }
  
//   main();

// // Print owner's wallet address:
const ownerAddr = "0xC92D6D2839aa75D81760e1c31a3567fDC2CaAC23"; // 0x78f887a92602bb58cc7a8bba3fb83a11393568fc 0xC851e72Efad2B332b2449be4cE5FC4406836211E 0x2fE5300C009A254Ba33157ED158396eD08063BF9 0xa361472BA65770773Fbb761320FE3B3779CA4EFb (my nfts)
console.log("fetching NFTs for address:", ownerAddr);
console.log("...");


const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);

console.log("number of NFTs found:", nftsForOwner.totalCount);
console.log("...");
console.log(nftsForOwner);
for (const nft of nftsForOwner.ownedNfts) {
    console.log("===");
    console.log("contract address:", nft.contract.address);
    console.log("token ID:", nft.tokenId);
    console.log("row metadata:", nft.rawMetadata);
    console.log("row metadata-properties:", nft.rawMetadata?.properties?.files[0].uri);
    console.log("tokenUri:", nft.tokenUri);
    console.log("media:", nft.media);
    // console.log('======contract info========')
    const main2 = async (address) => {
        console.log(address);
        // define the address whose contract metadata you want to fetch
        // const address = nft.contract.address;
    
        //Call the method to fetch metadata
        const response = await alchemy.nft.getContractMetadata(address)
    
        //Logging the response to the console
        console.log('CINFO=====', response, 'end CINFO=====')
    }
    
    // main2(nft.contract.address);
    // console.log('======end contract info========')
    
    // wallet_id = ?,  
    // contract = ?,
    // token_id = ?,     
    // raw_metadata = ?,
    // token_uri = ?,
    // media = ?,
    // date_inserted = now()
var q  = "INSERT INTO nftmark.nfts SET ?";
var v = {'wallet_id': ownerAddr, 'contract': nft.contract.address, 'token_id': nft.tokenId, 'raw_metadata': JSON.stringify(nft.rawMetadata), 'token_uri': JSON.stringify(nft.tokenUri), 'media': JSON.stringify(nft.media)};

// INSERT INTO DB
connection.query(q, v, function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
// END INSERT
  }

// async function main() {
// for await (const nft of alchemy.nft.getNftsForOwnerIterator(ownerAddr)) {
//     console.log('ownedNft:', nft);
//   }
// }
// main();


console.log("===");


// console.log("fetching metadata for a contract NFT...");
// const response = await alchemy.nft.getNftMetadata(
//   "0x670fd103b1a08628e9557cd66b87ded841115190",
//   "11339"
// );


// // console.log('Response ----------------');
// console.log(response);

// // Print some commonly used fields:
// console.log("NFT name: ", response.title);
// console.log("token type: ", response.tokenType);
// console.log("tokenUri: ", response.tokenUri.gateway);
// console.log("image url: ", response.rawMetadata.image);
// console.log("time last updated: ", response.timeLastUpdated);
// console.log("===");


// alchemy.nft
//   .getOwnersForContract("0x675947a21d09168cef81a4ffb75c46753ed7862e")
//   .then(console.log);

  // Print total NFT collection returned in the response:
//   console.log('getNftsForContract');
// alchemy.nft
// .getNftsForContract("0x64730792235B075dD1c17e0a302f0096033B35dd")
// .then((r)=> {
//     var res = r;
//     // console.log(res.nfts[0].contract);
//     // console.log(res.nfts[0].tokenUri);
//     console.log(res);
// });







connection.end();