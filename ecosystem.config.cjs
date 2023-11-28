module.exports = {
  apps : [
    {
    name   : "getContractMetadata",
    script : "getContractMetadataService.js",
    interpreter : "/root/.nvm/versions/node/v18.0.0/bin/node",
    max_memory_restart: "128M",
    autorestart: true,
    watch: true,
  },
    {
    name   : "nftsByContract",
    script : "nftsByContractService.js",
    interpreter : "/root/.nvm/versions/node/v18.0.0/bin/node",
    max_memory_restart: "128M",
    autorestart: true,
    watch: true,
  },  
    {
    name   : "nftsByAddress",
    script : "nftsByAddressService.js",
    interpreter : "/root/.nvm/versions/node/v18.0.0/bin/node",
    max_memory_restart: "128M",
    autorestart: true,
    watch: true,
  },   
    {
    name   : "dwdFileNft",
    script : "/var/www/process_images/dwdFileNft.mjs",
    interpreter : "/root/.nvm/versions/node/v18.0.0/bin/node",
    max_memory_restart: "1G",
    autorestart: true,
    watch: true,
  },    
    {
    name   : "dwdFileContract",
    script : "/var/www/process_images/dwdFileContract.mjs",
    interpreter : "/root/.nvm/versions/node/v18.0.0/bin/node",
    max_memory_restart: "1G",
    autorestart: true,
    watch: true,
  },     
  ]
}
