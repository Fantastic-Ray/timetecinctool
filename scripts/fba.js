var shipmentID;
var sheetValueTable = [];
var totalSKU;
var productStartLine;
var USFBASheetID;
var CAFBASheetID;
var MXFBASheetID;
var EUFBASheetID;
var AUFBASheetID;
$(document).ready(function() {
  var config = firebase.database().ref("config");
  config.once("value").then(function(snapshot) {
    USFBASheetID = snapshot.val().USFBASheetID;
    CAFBASheetID = snapshot.val().CAFBASheetID;
    MXFBASheetID = snapshot.val().MXFBASheetID;
    EUFBASheetID = snapshot.val().EUFBASheetID;
    AUFBASheetID = snapshot.val().AUFBASheetID;
    document.getElementById(
      "usSheetIDInput"
    ).value = snapshot.val().USFBASheetID;
    document.getElementById(
      "caSheetIDInput"
    ).value = snapshot.val().CAFBASheetID;
    document.getElementById(
      "mxSheetIDInput"
    ).value = snapshot.val().MXFBASheetID;
    document.getElementById(
      "euSheetIDInput"
    ).value = snapshot.val().EUFBASheetID;
    document.getElementById(
      "auSheetIDInput"
    ).value = snapshot.val().AUFBASheetID;
  });
  document.getElementById("inputArea").innerHTML =
    "<button id='signin-button' class='btn btn-primary' style='border:none; background-color:white !important; color:rgb(250,114,104)' onclick='handleSignInClick()'>Log in Google Account</button>";
});
function getInfo() {
  $("#myTableBody").empty();
  $("#mycostTableBody").empty();
  $("#info").empty();
  $("#total").empty();
  document.getElementById("mainTable").style.visibility = "visible";
  document.getElementById("costTable").style.visibility = "visible";
  document.getElementById("costTableTitle").style.visibility = "visible";
  //document.getElementById("sendDataDiv").style.visibility = "visible";
  document.getElementById("sendDataDiv").innerHTML =
    "<button id='sendUSDataBtn' class='btn btn-primary' onclick='sendUSData()'>Send to US Sheet</button>" +
    "<button id='sendCADataBtn' class='btn btn-primary' style='margin-left: 10px;' onclick='sendCAData()'>Send to CA Sheet</button>" +
    "<button id='sendCADataBtn' class='btn btn-primary' style='margin-left: 10px;' onclick='sendMXData()'>Send to MX Sheet</button>" +
    "<button id='sendEUDataBtn' class='btn btn-primary' style='margin-left: 10px;' onclick='sendEUData()'>Send to EU Sheet</button>" +
    "<button id='sendAUDataBtn' class='btn btn-primary' style='margin-left: 10px;' onclick='sendAUData()'>Send to AU Sheet</button>" +
    "<button class='btn btn-sm btn-outline-secondary' data-toggle='modal' data-target='.bd-example-modal-md'>Setting</button>";
  var fileInput = document.getElementById("tsv");

  var tsvFile = fileInput.files[0];

  var fr = new FileReader();
  fr.onload = function() {
    var text = fr.result;

    //fr.onload = receivedText;

    var startSort = false;
    var sku;
    var singleSKU;
    var FNSKU;
    var kitNum;
    var shippedQTY;
    var unitQTY = 0;
    var id = "";
    var item;
    var lastSKU = "SKU";
    var nextSKU;
    var lines = text.split("\n");
    var dataTable = [];
    var totalUnitQTY;
    var card = "";
    var reviewCard = "";
    var singlePrice = 0;
    var singleWeight = 0;
    var Type = "";
    var totalPrice = 0;
    var costTable = [];
    var localInv = 0;
    sheetValueTable = [];
    shipmentID = lines[0].split("\t")[1];
    totalSKU = lines[4].split("\t")[1];

    console.log("shipmentID " + shipmentID);
    //=========Star decode file===========================================================
    for (var i = 0; i < lines.length - 1; i++) {
      if (lines[i].split("\t")[0] == "Merchant SKU") {
        productStartLine = i;
      }
    }
    for (var i = 0; i < lines.length - 1; i++) {
      //get baic info
      localInv = "";
      if (i < productStartLine) {
        $("#info").append(lines[i] + "<br>");
        var temp = [];
        for (var a = 0; a < lines[i].split("\t").length; a++) {
          temp.push(lines[i].split("\t")[a].replace(/(\r\n|\n|\r)/gm, ""));
        }
        //console.log("table pushed " + lines[i]);
        sheetValueTable.push(temp);
      } else if (i > productStartLine) {
        // deal with sorting
        var line = lines[i].split("\t"); //split tab
        //get sku

        sku = line[0].split(".")[0];
        //insert SKU
        var nextSKU = lines[i + 1]
          .split("\t")[0]
          .split(".")[0]
          .split("K")[0];
        //console.log("nextSKU" + nextSKU);
        //check Kit number and single sku
        if (sku.indexOf("K") > -1) {
          singleSKU = sku.split("K")[0];
          kitNum = sku.split("K")[1];
        } else {
          singleSKU = sku;
          kitNum = 1;
        }
        //get shipped qty
        shippedQTY = line[9];
        unitQTY += shippedQTY * kitNum;

        //check if is the same item or not
        if (singleSKU != nextSKU) {
          // dataTable[i][3] = singleSKU;
          item = singleSKU;
          if (localInvTable[singleSKU]) {
            id = localInvTable[singleSKU].ID;
            localInv = localInvTable[singleSKU].localInv;
          } else {
            id = "not Found";
            localInv = 0;
          }

          totalUnitQTY = unitQTY;
          unitQTY = 0;
        } else {
          item = "";
          id = "";
          totalUnitQTY = "";
        }
        FNSKU = line[3];
        if (sku.includes("AP")) {
          card = "Apple";
        } else {
          card = "";
        }

        Type = getType(singleSKU, dataBase);
        if (kitNum >= 2) {
          reviewCard = "Review";
          if (Type.includes("D4")) {
            reviewCard = "Review";
          }
        } else {
          reviewCard = "";
        }
        //console.log(Type);
        singlePrice = getPrice(singleSKU, dataBase);
        singleWeight = getWeight(singleSKU, dataBase);
        dataTable[i] = {
          SKU: sku,
          FNSKU: FNSKU,
          shipped: shippedQTY,
          Item: item,
          QTY: totalUnitQTY,
          ID: id
        };
        var sheetLine = [];

        if (costTable[Type] != null) {
          costTable[Type] = {
            singlePrice: singlePrice,
            singleWeight: singleWeight,
            typeTotalUnitQTY:
              costTable[Type].typeTotalUnitQTY + shippedQTY * kitNum
          };
        } else {
          costTable[Type] = {
            singlePrice: singlePrice,
            singleWeight: singleWeight,
            typeTotalUnitQTY: shippedQTY * kitNum
          };
        }
        var color = " style='color:black'";
        if (totalUnitQTY != "") {
          if (localInv - totalUnitQTY < 0) {
            color = " style='color:red'";
          } else {
            color = " style='color:black'";
          }
        }
        $("#myTableBody").append(
          "<tr" +
            color +
            "><td>" +
            sku +
            "</td><td>" +
            FNSKU +
            "</td><td>" +
            shippedQTY +
            "</td><td>" +
            item +
            "</td><td>" +
            totalUnitQTY +
            "</td><td>" +
            id +
            "</td><td>" +
            card +
            "</td><td>" +
            reviewCard +
            "</td><td>" +
            localInv +
            "</td></tr>"
        );

        sheetLine.push(sku);
        sheetLine.push(FNSKU);
        sheetLine.push(shippedQTY);
        sheetLine.push(item);
        sheetLine.push(totalUnitQTY);
        sheetLine.push(id);
        sheetLine.push(card);
        sheetLine.push(reviewCard);
        sheetLine.push(localInv);
        if (localInv - totalUnitQTY < 0) {
          sheetLine.push("Not Enough Inventory");
        }
        sheetValueTable.push(sheetLine);
      } else if (i == productStartLine) {
        sheetValueTable.push([
          "Merchant SKU",
          "FNSKU",
          "Shipped",
          "Item",
          "QTY",
          "ID",
          "Label",
          "Card",
          "Inventory"
        ]);
      }
    }
    console.log(dataTable);
    console.log(costTable);
    sheetValueTable.push([""]);
    sheetValueTable.push(["Cost Table"]);
    sheetValueTable.push([
      "Type",
      "Unit QTY",
      "Single Cost",
      "Single Weight",
      "Toal Cost",
      "Total Weight"
    ]);
    var totalCost = 0;
    var totalWeight = 0;
    for (var x in costTable) {
      var costTableLine = [];

      $("#mycostTableBody").append(
        "<tr><td>" +
          x +
          "</td><td>" +
          costTable[x].typeTotalUnitQTY +
          "</td><td>" +
          costTable[x].singlePrice +
          "</td><td>" +
          costTable[x].singleWeight +
          "</td><td>" +
          (costTable[x].typeTotalUnitQTY * costTable[x].singlePrice).toFixed(
            2
          ) +
          "</td><td>" +
          (costTable[x].typeTotalUnitQTY * costTable[x].singleWeight).toFixed(
            2
          ) +
          "</td><td>"
      );
      totalCost += costTable[x].typeTotalUnitQTY * costTable[x].singlePrice;
      totalWeight += costTable[x].typeTotalUnitQTY * costTable[x].singleWeight;
      costTableLine.push(x);
      costTableLine.push(costTable[x].typeTotalUnitQTY);
      costTableLine.push(costTable[x].singlePrice);
      costTableLine.push(costTable[x].singleWeight);
      costTableLine.push(
        (costTable[x].typeTotalUnitQTY * costTable[x].singlePrice).toFixed(2)
      );
      costTableLine.push(
        (costTable[x].typeTotalUnitQTY * costTable[x].singleWeight).toFixed(2)
      );
      sheetValueTable.push(costTableLine);
    }
    $("#total").append(
      "Total Cost: " +
        totalCost.toFixed(2) +
        "  Total Weight: " +
        totalWeight.toFixed(2)
    );
    //sheetValueTable.push(["Total Cost: ",totalCost.toFixed(2),"  Total Weight: ",totalWeight.toFixed(2)]);

    console.log("sheet Values table done " + sheetValueTable);
  };

  fr.readAsText(tsvFile);

  return false;
}

function getID(item) {
  //console.log("dataBase is [0] Key " + dataBase[item].ID);
  if (dataBase[item] != null) {
    return dataBase[item].ID;
  } else {
    return "Not Found";
  }
}
function getLocalInv(item) {
  if (dataBase[item] != null) {
    return dataBase[item].LocalInventory;
  } else {
    return "Not Found";
  }
}

function getType(item, dataBase) {
  //var ramDataOBJ = JSON.parse(ramData);

  //return dataBase[item].Type;
  if (dataBase[item] != null) {
    return dataBase[item].Type;
  } else {
    return "Not Found";
  }
}

function getPrice(item, dataBase) {
  //var ramDataOBJ = JSON.parse(ramData);
  //return dataBase[item].CostUSD;
  if (dataBase[item] != null) {
    return dataBase[item].CostUSD;
  } else {
    return "Not Found";
  }
}
function getWeight(item) {
  // var ramDataOBJ = JSON.parse(ramData);
  //return dataBase[item].WeightLB;
  if (dataBase[item] != null) {
    return dataBase[item].WeightLB;
  } else {
    return "Not Found";
  }
}
function uploadIDData() {
  var usID = document.getElementById("usSheetIDInput").value;
  var caID = document.getElementById("caSheetIDInput").value;
  var mxID = document.getElementById("mxSheetIDInput").value;
  var euID = document.getElementById("euSheetIDInput").value;
  var auID = document.getElementById("auSheetIDInput").value;
  console.log("us id" + usID);
  console.log("ca id" + caID);
  console.log("mx id" + mxID);
  if (usID) {
    USFBASheetID = usID;
    firebase
      .database()
      .ref("config")
      .update({
        USFBASheetID: usID
      });
  }
  if (caID) {
    CAFBASheetID = caID;

    firebase
      .database()
      .ref("config")
      .update({
        CAFBASheetID: caID
      });
  }
  if (mxID) {
    MXFBASheetID = mxID;
    firebase
      .database()
      .ref("config")
      .update({
        MXFBASheetID: mxID
      });
  }
  if (euID) {
    EUFBASheetID = euID;
    firebase
      .database()
      .ref("config")
      .update({
        EUFBASheetID: euID
      });
  }
  if (auID) {
    AUFBASheetID = auID;
    firebase
      .database()
      .ref("config")
      .update({
        AUFBASheetID: auID
      });
  }
  $("#sheetIDModal").modal("hide");
  return false;
}
var CLIENT_ID;
var API_KEY;
function handleClientLoad() {
  var config = firebase.database().ref("config");
  config.once("value").then(function(snapshot) {
    API_KEY = snapshot.val().GoogleAPIKey;
    CLIENT_ID = snapshot.val().GoogleClientIdTool;
    gapi.load("client:auth2", initClient);
  });
}

function initClient() {
  // TODO: Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/spreadsheets'
  var SCOPE = "https://www.googleapis.com/auth/spreadsheets";

  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
      ]
    })
    .then(function() {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}
var isloggedIn = false;
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    getLocalInv();
    getLocalServerInv();

    //document.getElementById("signin-button").style.display = "none";
    //document.getElementById("fileInputDiv").style.visibility = "visible";
    document.getElementById("inputArea").innerHTML =
      " <form onsubmit='return getInfo()'>" +
      "<div class='row'>" +
      "<div class='col-xs-12 col-md-8' id='fileInputDiv'> <br/>" +
      "<input type='file' id='tsv' name='tsv'/>" +
      "<button id='submitBtn' type='submit' style='border:none; background-color:white !important; color:rgb(250,114,104)' class='btn btn-primary'>Submit</button>" +
      "</div>" +
      "</div>" +
      "</form>";
  } else {
    console.log("logged out");
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/* Create new spreadsheet
 function makeApiCall() {
      var spreadsheetBody = {
        // TODO: Add desired properties to the request body.
        properties:{
          title:shipmentID,
        }
      };

      var request = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log("created sheet ID " + response.result.spreadsheetId);
        var sheetID = response.result.spreadsheetId;
        appendValue(sheetID);

      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }
*/
function sendUSData() {
  creatNewSheet(USFBASheetID);
}
function sendCAData() {
  creatNewSheet(CAFBASheetID);
}
function sendMXData() {
  creatNewSheet(MXFBASheetID);
}
function sendEUData() {
  creatNewSheet(EUFBASheetID);
}
function sendAUData() {
  creatNewSheet(AUFBASheetID);
}
function appendValue(spreadSheetID) {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadSheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: shipmentID + "!A:Z", // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED", // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: "OVERWRITE" // TODO: Update placeholder value.
  };
  console.log("table value is " + sheetValueTable);
  var valueRangeBody = {
    // TODO: Add desired properties to the request body.
    majorDimension: "ROWS",
    values: sheetValueTable
  };

  var request = gapi.client.sheets.spreadsheets.values.append(
    params,
    valueRangeBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      sendFormat(spreadSheetID);
      $("#sheetLink").empty();
      document.getElementById("sheetLink").href =
        "https://docs.google.com/spreadsheets/d/" +
        response.result.spreadsheetId;
      $("#sheetLink").append(
        "https://docs.google.com/spreadsheets/d/" +
          response.result.spreadsheetId
      );
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Error: " + reason.result.error.message);
    }
  );
}
var localInvTable = [];

function getLocalInv() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1r4vvca5PZtGQG53r8AkGrW34gAwsCo2r4KJTEbEDdBs",
      range: "Master!A3:E"
    })
    .then(
      function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            if (!localInvTable[row[3]]) {
              localInvTable[row[3]] = { ID: row[0], localInv: row[4] };
            } else {
              if (parseInt(localInvTable[row[3]].localInv) < parseInt(row[4])) {
                console.log(
                  "SKU: " +
                    row[3] +
                    localInvTable[row[3]].ID +
                    " " +
                    localInvTable[row[3]].localInv +
                    row[0] +
                    " " +
                    row[4]
                );
                localInvTable[row[3]] = { ID: row[0], localInv: row[4] };
              }
            }
          }
          console.log("localInvTable" + localInvTable["75TT13NU2R8-8G"]);
        } else {
          console.log("no data from PC 2018");
        }
      },
      function(response) {
        appendPre("Error: " + response.result.error.message);
      }
    );
}

function getLocalServerInv() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1A-u68BPi50FMdDQDN-S_ghqwXLzh2Lhp50F6jpLqo1M",
      range: "Master!A2:J"
    })
    .then(
      function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];

            // Print columns A and E, which correspond to indices 0 and 4.
            if (!localInvTable[row[3]]) {
              localInvTable[row[3]] = { ID: row[0], localInv: row[9] };
            } else {
              if (parseInt(localInvTable[row[3]].localInv) < parseInt(row[9])) {
                localInvTable[row[3]] = { ID: row[0], localInv: row[9] };
              }
            }
          }
          console.log("localSInvTable" + localInvTable["71TT16EUL2R8-8G"]);
        } else {
          console.log("no data from Server 2019");
        }
      },
      function(response) {
        appendPre("Error: " + response.result.error.message);
      }
    );
}
var newSheetID;

function creatNewSheet(spreadSheetID) {
  document.getElementById("loader").style.visibility = "visible";
  var params = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: spreadSheetID // TODO: Update placeholder value.
  };

  var batchUpdateSpreadsheetRequestBody = {
    // A list of updates to apply to the spreadsheet.
    // Requests will be applied in the order they are specified.
    // If any request is not valid, no requests will be applied.
    requests: [
      {
        addSheet: {
          properties: {
            title: shipmentID,
            gridProperties: {
              rowCount: 100,
              columnCount: 50,
              frozenRowCount: productStartLine
            },
            index: 0
          }
        }
      }
    ] // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
  };

  var request = gapi.client.sheets.spreadsheets.batchUpdate(
    params,
    batchUpdateSpreadsheetRequestBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      newSheetID = response.result.replies[0].addSheet.properties.sheetId;
      appendValue(spreadSheetID);
      console.log("response.result sheetID" + newSheetID);
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Error:" + reason.result.error.message);
    }
  );
}

function sendFormat(spreadSheetID) {
  var params = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: spreadSheetID // TODO: Update placeholder value.
  };
  console.log("totalSKU " + (totalSKU + 8));
  var batchUpdateSpreadsheetRequestBody = {
    // A list of updates to apply to the spreadsheet.
    // Requests will be applied in the order they are specified.
    // If any request is not valid, no requests will be applied.
    requests: [
      {
        updateBorders: {
          range: {
            sheetId: newSheetID,
            startRowIndex: productStartLine,
            endRowIndex: productStartLine + parseInt(totalSKU, 10) + 1,
            startColumnIndex: 0,
            endColumnIndex: 9
          },
          bottom: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          },
          top: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          },
          left: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          },
          right: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          },
          innerHorizontal: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          },
          innerVertical: {
            color: {
              blue: 0,
              green: 0,
              red: 0
            },
            style: "SOLID",
            width: 1
          }
        }
      },
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: newSheetID,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: 1
          }
        }
      },
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: newSheetID,
            dimension: "COLUMNS",
            startIndex: 2,
            endIndex: 30
          }
        }
      }
    ] // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
  };

  var request = gapi.client.sheets.spreadsheets.batchUpdate(
    params,
    batchUpdateSpreadsheetRequestBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      document.getElementById("loader").style.visibility = "hidden";
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Error: " + reason.result.error.message);
    }
  );
}

function appendPre(message) {
  document.getElementById("loader").style.visibility = "hidden";
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}
