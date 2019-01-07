var requestReportID;
var reportID;
var isSendRequest = false;
var NonFBASheetID;
$(document).ready(function() {
  var config = firebase.database().ref("config");
  config.once("value").then(function(snapshot) {
    NonFBASheetID = snapshot.val().NonFBASheetID;

    document.getElementById(
      "NonFBASheetIDInput"
    ).value = snapshot.val().NonFBASheetID;
  });
});
function uploadIDData() {
  var SheetID = document.getElementById("NonFBASheetIDInput").value;
  NonFBASheetID = SheetID;
  if (SheetID) {
    firebase
      .database()
      .ref("config")
      .update({
        NonFBASheetID: SheetID
      });
  }

  $("#sheetIDModal").modal("hide");
  return false;
}
function requestAReport(callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append(
        "\nJust sent a request. Please wait 10s then click again"
      );
      document.getElementById("getButton").firstChild.data = "Wait for 10s";
      isSendRequest = true;
      requestReportID = this.responseText;
      console.log("requestID", requestReportID);
      callback();
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestUnshipped.php",
    true
  );

  xmlhttp.send();
}

function getReadyReportRequestList() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;

      if (this.responseText.includes("None") && isSendRequest == false) {
        console.log("reportID " + "None");
        requestAReport(function() {
          console.log("resquest Id " + requestReportID);
          console.log("is Requested" + isSendRequest);
        });
      } else if (this.responseText.includes("None") && isSendRequest == true) {
        console.log("still not found");
        document.getElementById("getButton").firstChild.data = "Wait for 10s";
        $("#txtHint").append(
          "\nStill waiting for the report from Amazon. Please wait 10s then click again"
        );
        //getReadyReportRequestList();
      } else {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("requestID " + reportID);
        console.log("reportID " + reportID);
        document.getElementById("getButton").firstChild.data = "Done";
        getReadyReport();
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListUnshipped.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}

function getReadyReportList() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      reportID = this.responseText.replace(/[^\d.]/g, "");
    }
  };
  console.log("requestReportID " + requestReportID);
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportListSample.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
var globalPlanTable;

function getReadyReport() {
  console.log("ReportID " + reportID);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = this.responseText;
      console.log("result", result);
      globalPlanTable = getUsefulData(result);
      pushToTable(globalPlanTable);
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportSample.php?reportId=" + reportID,
    true
  );
  xmlhttp.send();
}

function getUsefulData(result) {
  $("#myTableBody").empty();
  var lines = result.split("\n");
  var sku;
  var shipQTY;
  var line;
  var buyerName;
  var orderID;
  var orderList = [];
  var orderDate;
  for (var i = 1; i < lines.length; i++) {
    line = lines[i].split("\t");
    if (line.length > 1) {
      console.log("line: ", line);
      sku = line[10].split(".")[0];
      shipQTY = line[14];
      orderID = line[0];
      buyerName = line[8];
      orderDate = line[3];
      orderList.push({
        SKU: sku,
        shipQTY: shipQTY,
        buyerName: buyerName,
        orderID: orderID,
        orderDate: orderDate
      });
    }
  }
  orderList.sort(function(d1, d2) {
    return new Date(d2.orderDate) - new Date(d1.orderDate);
  });

  return orderList;
}

function pushToTable(planTable) {
  for (var x in planTable) {
    $("#myTableBody").append(
      "<tr><td>" +
        planTable[x].SKU +
        "</td><td>" +
        planTable[x].shipQTY +
        "</td><td>" +
        planTable[x].buyerName +
        "</td><td>" +
        planTable[x].orderID +
        "</td></tr>"
    );
  }
  readyToSend = true;
  document.getElementById("sendButton").style.visibility = "visible";
}
var readyToSend = false;
function readyDataToSheet() {
  readyToSheet = [];
  var today = new Date();
  var date =
    today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
  var readyToSheet = [];
  var itemArray = [];
  readyToSheet.push([" "]);
  readyToSheet.push([" "]);
  readyToSheet.push([date]);
  var item;

  for (var i = 0; i < globalPlanTable.length; i++) {
    itemArray = [];
    item = globalPlanTable[i];
    console.log("item: ", item);
    itemArray.push(item.SKU);
    itemArray.push("");
    itemArray.push("-" + item.shipQTY);
    itemArray.push("");
    itemArray.push("");
    itemArray.push("Amazon");
    itemArray.push(item.buyerName);
    itemArray.push(item.orderID);
    readyToSheet.push(itemArray);
  }
  if (readyToSheet.length <= 2) {
    document.getElementById("txtHint").innerHTML =
      "!!Please enter at least one quantity!!";
  }

  return readyToSheet;
}

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
  if (isSignedIn && readyToSend == true) {
    console.log("isSignedIn and table is not empty");
    isloggedIn = true;
    appendValue("1b5p6dNqSDOPJnyPArlL4qMUhiD6d7_09QUCoGx63iG8");
  } else if (isSignedIn && readyToSend == false) {
    isloggedIn = true;
    console.log("isSignedIn and table is empty");
    document.getElementById("getButton").firstChild.data = "Get Orders";
  }
}

function handleSignInClick(event) {
  if (isloggedIn == false) {
    gapi.auth2.getAuthInstance().signIn();
  } else {
    appendValue(NonFBASheetID);
  }
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendValue(sheetID) {
  var sheetValueTable = readyDataToSheet();
  var date = new Date();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: month + "/" + year + "!A:Z", // TODO: Update placeholder value.

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
      console.log(
        "response.result.updates",
        response.result.updates.updatedRange
      );
      appendFormula(
        sheetID,
        response.result.updates.updatedRange,
        response.result.updates.updatedRows
      );

      document.getElementById("txtHint").innerHTML =
        "Request Sent. See it in the spreadsheet";
      document.getElementById("txtHint").href =
        "https://docs.google.com/spreadsheets/d/" + NonFBASheetID;
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
function appendFormula(sheetID, range, updatedRows) {
  let formulaTable = [];
  formulaTable.push([]);
  let idList = ["", "", ""];
  let noteList = ["", "", ""];
  let unitQTYList = ["", "", ""];
  let inventoryList = ["", "", ""];
  let startPoint = range.split("A")[1].split(":")[0];
  //const endPoint = range.split("!")[1].split(":")[1];
  startPoint = parseInt(startPoint);
  startPoint += 3;
  for (let i = 0; i < updatedRows - 3; i++) {
    idList.push("=VLOOKUP(A" + startPoint + ",'SBT 2019'!$A:$C,3,FALSE)");

    noteList.push(
      "=B" +
        startPoint +
        "&" +
        '" * "' +
        "&IF(IFERROR(FIND(" +
        '"K"' +
        ",A" +
        startPoint +
        "),0)=0,-C" +
        startPoint +
        ",-C" +
        startPoint +
        "*VALUE(MID(A" +
        startPoint +
        ",FIND(" +
        '"K"' +
        ",A" +
        startPoint +
        ")+1,1)))"
    );
    unitQTYList.push(
      "=IF(IFERROR(FIND(" +
        '"K"' +
        ",A" +
        startPoint +
        "),0)=0,-C" +
        startPoint +
        ",-C" +
        startPoint +
        "*VALUE(MID(A" +
        startPoint +
        ",FIND(" +
        '"K"' +
        ",A" +
        startPoint +
        ")+1,1)))"
    );
    inventoryList.push(
      "=IFERROR(vlookup(B" +
        startPoint +
        ",IMPORTRANGE(" +
        '"1r4vvca5PZtGQG53r8AkGrW34gAwsCo2r4KJTEbEDdBs",' +
        '"' +
        "'Master'!A2:F200" +
        '"' +
        "),5,false),vlookup(B" +
        startPoint +
        ",IMPORTRANGE(" +
        '"1A-u68BPi50FMdDQDN-S_ghqwXLzh2Lhp50F6jpLqo1M",' +
        '"' +
        "'Master'!A1:J200" +
        '"' +
        "),10,false))"
    );
    startPoint++;
  }
  formulaTable.push(idList);
  formulaTable.push([]);
  formulaTable.push(noteList);
  formulaTable.push(unitQTYList);
  formulaTable.push([]);
  formulaTable.push([]);
  formulaTable.push([]);
  formulaTable.push(inventoryList);
  range = range.replace("H", "I");
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: range,

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED"
  };
  var valueRangeBody = {
    // TODO: Add desired properties to the request body.
    majorDimension: "COLUMNS",
    values: formulaTable
  };
  var request = gapi.client.sheets.spreadsheets.values.update(
    params,
    valueRangeBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
