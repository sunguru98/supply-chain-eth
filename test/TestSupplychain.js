// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require("SupplyChain");

function getEvent(result) {
  return result.logs[result.logs.length - 1].event;
}

contract("SupplyChain", function (accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  var sku = 1;
  var upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = "John Doe";
  const originFarmInformation = "Yarray Valley";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  var productID = sku + upc;
  const productNotes = "Best beans for Espresso";
  const productPrice = web3.toWei(1, "ether");
  var defaultItemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  // /Available Accounts
  // /==================
  // /(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
  // /(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
  // /(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
  // /(3) 0x460c31107dd048e34971e57da2f99f659add4f02
  // /(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
  // /(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
  // /(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
  // /(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
  // /(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
  // /(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  // 1st Test
  it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Harvested by calling function harvestItem()
    const result = await supplyChain.harvestItem(
      upc,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude,
      productNotes
    );

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(
      resultBufferOne[2],
      ownerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState,
      "Error: Invalid item State"
    );
    assert.equal(getEvent(result), "Harvested", "Invalid event emitted");
    assert.equal(
      resultBufferTwo[6],
      emptyAddress,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 2nd Test
  it("Testing smart contract function processItem() that allows a farmer to process coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Processed by calling function processtItem()
    await supplyChain.addFarmer(originFarmerID);
    const result = await supplyChain.processItem(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Processed", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 1,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      emptyAddress,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 3rd Test
  it("Testing smart contract function packItem() that allows a farmer to pack coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Processed by calling function packItem()
    const result = await supplyChain.packItem(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Packed", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 2,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      emptyAddress,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 4th Test
  it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as ForSale by calling function sellItem()
    const result = await supplyChain.sellItem(upc, productPrice, {
      from: originFarmerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "ForSale", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 3,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      emptyAddress,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 5th Test
  it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Sold by calling function buyItem()
    await supplyChain.addDistributor(distributorID);
    const result = await supplyChain.buyItem(upc, {
      from: distributorID,
      value: web3.toWei(1.5, "ether"),
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Sold", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      distributorID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 4,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 6th Test
  it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async () => {
    const supplyChain = await SupplyChain.deployed();
    // Mark an item as Shipped by calling function shipItem()
    const result = await supplyChain.shipItem(upc, {
      from: distributorID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Shipped", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      distributorID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 5,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      emptyAddress,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 7th Test
  it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
    const supplyChain = await SupplyChain.deployed();
    // Mark an item as Received by calling function receiveItem()
    await supplyChain.addRetailer(retailerID);
    const result = await supplyChain.receiveItem(upc, {
      from: retailerID,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Received", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      retailerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 6,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      emptyAddress,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 8th Test
  it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async () => {
    const supplyChain = await SupplyChain.deployed();
    // Mark an item as Sold by calling function buyItem()
    await supplyChain.addConsumer(consumerID);
    const result = await supplyChain.purchaseItem(upc, {
      from: consumerID,
      value: web3.toWei(1, "ether"),
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item product ID"
    );
    assert.equal(getEvent(result), "Purchased", "Invalid event emitted");
    assert.equal(
      resultBufferOne[2],
      consumerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      resultBufferTwo[5],
      defaultItemState + 7,
      "Error: Invalid item State"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Invalid or Missing distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      "Error: Invalid or Missing retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      consumerID,
      "Error: Invalid or Missing consumerID"
    );
  });

  // 9th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const [
      itemSKU1,
      itemUPC1,
      ownerID1,
      originFarmerID1,
      originFarmName1,
      originFarmInformation1,
      originFarmLatitude1,
      originFarmLongitude1,
    ] = await supplyChain.fetchItemBufferOne.call(upc);

    // Verify the result set:
    assert.equal(sku, itemSKU1);
    assert.equal(upc, itemUPC1);
    assert.equal(consumerID, ownerID1);
    assert.equal(originFarmerID, originFarmerID1);
    assert.equal(originFarmName, originFarmName1);
    assert.equal(originFarmInformation, originFarmInformation1);
    assert.equal(originFarmLatitude, originFarmLatitude1);
    assert.equal(originFarmLongitude, originFarmLongitude1);
  });

  // 10th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const [
      itemSKU1,
      itemUPC1,
      productID1,
      productNotes1,
      productPrice1,
      itemState1,
      distributorID1,
      retailerID1,
      consumerID1,
    ] = await supplyChain.fetchItemBufferTwo.call(upc);
    // Verify the result set:
    assert.equal(sku, itemSKU1);
    assert.equal(upc, itemUPC1);
    assert.equal(productID, productID1);
    assert.equal(productNotes, productNotes1);
    assert.equal(productPrice, productPrice1);
    assert.equal(itemState1, 7);
    assert.equal(distributorID, distributorID1);
    assert.equal(retailerID, retailerID1);
    assert.equal(consumerID, consumerID1);
  });
});
