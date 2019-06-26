var requestReportID;
var reportID;
var isSendRequest = false;
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
      callback();
    }
  };
  if (document.getElementById("USRadio").checked) {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/RequestReportUS.php",
      true
    );
  } else {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/RequestReportCA.php",
      true
    );
  }
  xmlhttp.send();
}

function getReadyReportRequestList() {
  if (isloggedIn == false) {
    gapi.auth2.getAuthInstance().signIn();
  } else {
    //appendValue('1FlVjDCLZd9zzQ457WshMDTtzz_iMt-aEV0T9DGH-phY');

    getLocalInv();
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
        } else if (
          this.responseText.includes("None") &&
          isSendRequest == true
        ) {
          console.log("still not found");
          document.getElementById("getButton").firstChild.data = "Wait for 10s";
          $("#txtHint").append(
            "\nStill waiting for the report from Amazon. Please wait 10s then click again"
          );
          //getReadyReportRequestList();
        } else {
          reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
          console.log("reportID " + reportID);
          document.getElementById("getButton").firstChild.data = "Done";
          getReadyReport();
        }
      }
    };
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/GetReportRequestListSample.php?requestID=" +
        requestReportID,
      true
    );
    xmlhttp.send();
  }
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
      //document.getElementById("txtHint").innerHTML = this.responseText;
      //reportID = this.responseText;
      //console.log(this.responseText);
      var result = this.responseText;
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
  var asin;
  var line;
  var localinvQTY;
  var fbaInv;
  var salesUnits;
  var suggestUnits;
  var supplyDay;
  var plan = [];
  for (var i = 1; i < lines.length; i++) {
    line = lines[i].split("\t");

    sku = line[1];
    asin = line[2];
    salesUnits = Math.round(line[7] / 2);
    fbaInv = line[8];
    supplyDay = fbaInv;
    if (salesUnits - fbaInv > 0) {
      suggestUnits = Math.round((salesUnits - fbaInv) * 1.2);
    } else {
      suggestUnits = 0;
    }
    plan.push({
      SKU: sku,
      ASIN: asin,
      SalesUnits: salesUnits,
      FBAInv: fbaInv,
      suggestUnits: suggestUnits
    });
    //console.log("plabTable" + plan[sku].ASIN);
    //pushToTable(sku,plan[sku]);
  }
  plan.sort(function(a, b) {
    return b.suggestUnits - a.suggestUnits;
  });
  document.getElementById("sendButton").style.visibility = "visible";
  return plan;
}

function pushToTable(planTable) {
  for (var x in planTable) {
    var temp = planTable[x].SKU.split(".")[0].split("K")[0];
    $("#myTableBody").append(
      "<tr><td>" +
        planTable[x].SKU +
        "</td><td>" +
        planTable[x].ASIN +
        "</td><td>" +
        planTable[x].FBAInv +
        "</td><td>" +
        planTable[x].SalesUnits +
        "</td><td>" +
        localInvTable[temp] +
        "</td><td>" +
        planTable[x].suggestUnits +
        "</td><td>" +
        "<input type='text' id='" +
        x +
        "' size='4'>" +
        "</td></tr>"
    );
  }
  readyToSend = true;
  document.getElementById("sendButton").style.visibility = "visible";
}
var readyToSend = false;
function readyDataToSheet() {
  var readyToSheet = [];
  var checked = document.forms[0];
  var itemArray = [];
  readyToSheet.push([" "]);
  readyToSheet.push([" "]);
  var item;

  console.log("checked length" + checked.length);
  for (var i = 0; i < checked.length; i++) {
    itemArray = [];
    if (checked[i].value) {
      item = globalPlanTable[checked[i].id];
      console.log("id is " + checked[i].id);
      itemArray.push(item.SKU);
      itemArray.push(item.ASIN);
      itemArray.push(item.SalesUnits);
      itemArray.push(item.FBAInv);
      itemArray.push(checked[i].value);
      readyToSheet.push(itemArray);
    }
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
    appendValue("1FlVjDCLZd9zzQ457WshMDTtzz_iMt-aEV0T9DGH-phY");
  } else if (isSignedIn && readyToSend == false) {
    isloggedIn = true;
    console.log("isSignedIn and table is empty");
    document.getElementById("getButton").firstChild.data = "Get Plan";

    document.getElementById("radioDiv").style.visibility = "visible";
  }
}

function handleSignInClick(event) {
  if (isloggedIn == false) {
    gapi.auth2.getAuthInstance().signIn();
  } else {
    appendValue("1FlVjDCLZd9zzQ457WshMDTtzz_iMt-aEV0T9DGH-phY");
  }
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendValue(sheetID) {
  var sheetValueTable = readyDataToSheet();
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: "A:Z", // TODO: Update placeholder value.

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
      document.getElementById("txtHint").innerHTML =
        "Request Sent. See it in the spreadsheet";
      document.getElementById("txtHint").href =
        "https://docs.google.com/spreadsheets/d/1FlVjDCLZd9zzQ457WshMDTtzz_iMt-aEV0T9DGH-phY";
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
var localInvTable = [];
function getLocalInv() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1r4vvca5PZtGQG53r8AkGrW34gAwsCo2r4KJTEbEDdBs",
      range: "Master!D3:E"
    })
    .then(
      function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            localInvTable[row[0]] = row[1];
          }
        } else {
          console.log("no data from PC 2018");
        }
      },
      function(response) {
        appendPre("Error: " + response.result.error.message);
      }
    );
}
