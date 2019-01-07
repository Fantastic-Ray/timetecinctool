var database = firebase.database();

var reportID;
var isSendRequest = false;
let fulfillable = 0;
let reserved = 0;
let inbound = 0;
let receiving = 0;
var totalSales = [];
var countryList = ["MX", "JP"];
var currentCountryIndex = 0;
var requestStartDate = "";
var requestEndDate = "";
let singleCountryTable = [];
$(document).ready(function() {
  $("#sendButton").html(
    "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='handleAuthClick()'>Sign In</button>"
  );
});

//request All report =======================================================================================

function requestAllReport() {
  requestReports("CA");
}

//request US ===============================================================================================

function requestReports(country) {
  if (country) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("txtHint").innerHTML = this.responseText;
        isSendRequest = true;
        let requestReportID = this.responseText;
        console.log("request send ", country);
        console.log("requestReportID ", requestReportID);
        getReadyReportRequestListUS(requestReportID, country);
      }
    };

    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/RequestReportOrderNA.php?requestInfo=" +
        country +
        "/" +
        requestStartDate +
        "/" +
        requestEndDate,
      true
    );

    xmlhttp.send();
  } else {
    console.log("Done");
  }
}
function getReadyReportRequestListUS(requestReportID, country) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        console.log("report Done");
        firebase
          .database()
          .ref("Report/" + country + "SalesReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, country);
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("request got cancelled");
        firebase
          .database()
          .ref("Report/" + country + "SalesReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, country);
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled. Using the previous report at " +
              reportTime;
          });
      } else {
        console.log("start " + country + " Sleeping");
        sleep(10000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for " + country + " report";
          getReadyReportRequestListUS(requestReportID, country);
          console.log("end " + country + " Sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleOrderNA.php?requstInfo=" +
      requestReportID +
      "/" +
      country,
    true
  );
  xmlhttp.send();
}
function getReadyReport(reportID, country) {
  console.log("ReportID " + reportID);
  //requstData = reportID + "/" + country;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      getSingleCountrySales(this.responseText);
      currentCountryIndex++;
      if (countryList[currentCountryIndex]) {
        console.log("Report input " + countryList[currentCountryIndex]);
        requestReports(countryList[currentCountryIndex]);
      } else {
        sinlgeCountrySheetTable = convertToSpreadsheetTable(singleCountryTable);
        totalResultSheetTable = convertToSpreadsheetTable(totalSales);
        console.log("All report Done");
        return;
      }
    }
  };
  if (country == "JP") {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/GetReportSampleJPIMR.php?reportId=" +
        reportID,
      true
    );
  } else if (country == "MX") {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/GetReportSampleMXIMR.php?reportId=" +
        reportID,
      true
    );
  } else if (country == "EU") {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/GetReportSampleEUIMR.php?reportId=" +
        reportID,
      true
    );
  } else {
    xmlhttp.open(
      "GET",
      "MarketplaceWebService/Samples/GetReportSample.php?reportId=" + reportID,
      true
    );
  }
  xmlhttp.send();
}
//==========================================================================================================
function getSingleCountrySales(result) {
  let status;
  let channel;
  let lines = result.split("\n");
  let sku;
  let line;
  let quantity;

  for (let i = 1; i < lines.length; i++) {
    let usquantity = 0;
    let caquantity = 0;
    let mxquantity = 0;
    let ukquantity = 0;
    let esquantity = 0;
    let itquantity = 0;
    let frquantity = 0;
    let dequantity = 0;
    let jpquantity = 0;
    line = lines[i].split("\t");
    sku = line[0].split(".")[0];
    status = line[4];
    if (line[6].includes(".")) {
      channel = line[6].split(".")[1];
    } else {
      channel = "us";
    }

    sku = line[11].split(".")[0];
    quantity = parseInt(line[14]);
    if (status != "Cancelled") {
      switch (channel) {
        case "ca":
          caquantity = quantity;
          break;
        case "mx":
          mxquantity = quantity;
          break;
        case "uk":
          ukquantity = quantity;
          break;
        case "es":
          esquantity = quantity;
          break;
        case "it":
          itquantity = quantity;
          break;
        case "fr":
          frquantity = quantity;
          break;
        case "de":
          dequantity = quantity;
          break;
        case "jp":
          jpquantity = quantity;
          break;
        default:
          usquantity = quantity;
      }
      if (singleCountryTable[sku]) {
        singleCountryTable[sku] = {
          USQTY: singleCountryTable[sku].USQTY + usquantity,
          CAQTY: singleCountryTable[sku].CAQTY + caquantity,
          MXQTY: singleCountryTable[sku].MXQTY + mxquantity,
          UKQTY: singleCountryTable[sku].UKQTY + ukquantity,
          ESQTY: singleCountryTable[sku].ESQTY + esquantity,
          ITQTY: singleCountryTable[sku].ITQTY + itquantity,
          FRQTY: singleCountryTable[sku].FRQTY + frquantity,
          DEQTY: singleCountryTable[sku].DEQTY + dequantity,
          JPQTY: singleCountryTable[sku].JPQTY + jpquantity
        };
      } else {
        singleCountryTable[sku] = {
          USQTY: 0,
          CAQTY: 0,
          MXQTY: 0,
          UKQTY: 0,
          ESQTY: 0,
          ITQTY: 0,
          FRQTY: 0,
          DEQTY: 0,
          JPQTY: 0
        };
        totalSales[sku] = {
          TotalQTY: quantity
        };
      }
      //=================get single sku quantity==========================
      if (sku.includes("-")) {
        let temp = sku.split("-")[1];
        if (temp.includes("K")) {
          if (temp.match(/K([0-9]+)$/)) {
            let singleSKU = sku.slice(0, -2);
            kit = parseInt(temp.split("K")[1]);
            if (totalSales[singleSKU]) {
              totalSales[singleSKU] = {
                TotalQTY: totalSales[singleSKU].TotalQTY + quantity * kit
              };
            } else {
              totalSales[sku] = {
                TotalQTY: quantity
              };
            }
          }
        }
      }
    }
  }
  return singleCountryTable;
}

function getCurrentTime() {
  let today = new Date();
  return (
    today.getMonth() +
    1 +
    "/" +
    today.getDate() +
    "/" +
    today.getFullYear() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes()
  );
}
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
$(function() {
  $('input[name="daterange"]').daterangepicker(
    {
      opens: "left"
    },
    function(start, end, label) {
      requestStartDate = start.format("YYYY-MM-DD") + "T00:00:00-08";
      requestEndDate = end.format("YYYY-MM-DD");

      console.log(
        "A new date selection was made: " +
          start.format("YYYY-MM-DD") +
          " to " +
          end.format("YYYY-MM-DD")
      );
      let today = new Date();
      let formatedToday =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let nowTime = today.getHours() + ":" + today.getMinutes() + ":00";
      console.log(
        "end day is today",
        formatedToday == end.format("YYYY-MM-DD")
      );
      if (formatedToday == end.format("YYYY-MM-DD")) {
        requestEndDate = requestEndDate + "T" + nowTime + "-08";
      } else {
        requestEndDate = requestEndDate + "T" + "23:59:59-08";
      }
      console.log("requested start date ", requestStartDate);
      console.log("requested end date ", requestEndDate);
    }
  );
});
function convertToSpreadsheetTable(data) {
  let sheetTable = [];
  sheetTable.push([
    "SKU",
    "Total",
    "US QTY",
    "CA QTY",
    "MX QTY",
    "US QTY",
    "DE QTY",
    "ES QTY",
    "FR QTY",
    "IT QTY",
    "JP QTY"
  ]);
  for (var sku in data) {
    let sheetline = [];
    sheetline.push(sku);
    sheetline.push(
      data[sku].USQTY +
        data[sku].CAQTY +
        data[sku].MXQTY +
        data[sku].UKQTY +
        data[sku].DEQTY +
        data[sku].ESQTY +
        data[sku].FRQTY +
        data[sku].ITQTY +
        data[sku].JPQTY
    );
    sheetline.push(data[sku].USQTY);
    sheetline.push(data[sku].CAQTY);
    sheetline.push(data[sku].MXQTY);
    sheetline.push(data[sku].UKQTY);
    sheetline.push(data[sku].DEQTY);
    sheetline.push(data[sku].ESQTY);
    sheetline.push(data[sku].FRQTY);
    sheetline.push(data[sku].ITQTY);
    sheetline.push(data[sku].JPQTY);
    sheetTable.push(sheetline);
  }
  return sheetTable;
}
//==============================Google Spread Sheet ============================================================
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

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  var SCOPE = "https://www.googleapis.com/auth/spreadsheets";
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
      ],
      scope: SCOPE
    })
    .then(
      function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      },
      function(error) {}
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    $("#sendButton").html(
      "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='requestAllReport()'>Get Reports</button>"
    );
  } else {
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
function createNewSheet() {
  $("#sendButton").html(
    "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='createNewSheet()' disabled>Send</button>"
  );
  var spreadsheetBody = {
    // TODO: Add desired properties to the request body.
    properties: {
      title: "Timetec FBA Inventory Count " + getCurrentTime()
    }
  };

  var request = gapi.client.sheets.spreadsheets.create({}, spreadsheetBody);
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      console.log(response.result.spreadsheetId);

      creatNewTab(
        response.result.spreadsheetId,
        "Main",
        sinlgeCountrySheetTable
      );

      creatNewTab(
        response.result.spreadsheetId,
        "Total",
        totalResultSheetTable
      );
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
function creatNewTab(spreadSheetID, country, sheetValueTable) {
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
            title: country,
            gridProperties: {
              rowCount: 100,
              columnCount: 50,
              frozenRowCount: 1
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

      console.log("response.result sheetID" + newSheetID);
      appendValue(spreadSheetID, country, sheetValueTable, newSheetID);
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
function appendValue(spreadSheetID, country, sheetValueTable, newSheetID) {
  //let sheetValueTable = [];
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadSheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: country + "!A:Z", // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED", // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: "OVERWRITE" // TODO: Update placeholder value.
  };

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
      $("#sendButton").html(
        "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='createNewSheet()'>Send</button>"
      );

      document.getElementById("txtHint").innerHTML =
        "See it in the spreadsheet";
      document.getElementById("txtHint").href =
        "https://docs.google.com/spreadsheets/d/" + spreadSheetID;
      sendFormat(spreadSheetID, newSheetID);
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
}
