var database = firebase.database();
var requestReportID;
var isSendRequest = false;
let fulfillable = 0;
let reserved = 0;
let inbound = 0;
let receiving = 0;
var totalInv = [];
let USFBATable = [];
let USSpreadTable = [];
let CAFBATable = [];
let CASpreadTable = [];
let MXFBATable = [];
let MXSpraedTable = [];
let EUFBATable = [];
let EUSpreadTable = [];
let JPFBATable = [];
let JPSpreadTable = [];
let totalFBATable = [];
let totalSpreadTable = [];
let singleSKUSpreadTable = [];
let finalTotalTable = [];
let finalTotalSpreadsheetTable = [];
let singleSKUTotalTable;
$(document).ready(function() {
  $("#sendButton").html(
    "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='handleAuthClick()'>Sign In</button>"
  );
});

//==============================request US ===============================================================================================

function requestUSReport() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append("\nJust sent US request.");

      isSendRequest = true;
      requestReportID = this.responseText;
      getReadyReportRequestListUS();
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportUSIMR.php",
    true
  );

  xmlhttp.send();
}
function getReadyReportRequestListUS() {
  let reportID;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        firebase
          .database()
          .ref("Report/USReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, "US");
        requestCAReport();
        document.getElementById("USCompleteSpan").innerHTML =
          "<h6>US Report Time: " +
          currentTime +
          " <span class='badge badge-success'>Complete</span></h6>";
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done");
        firebase
          .database()
          .ref("Report/USReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, "US");
            requestCAReport();
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled, using report at " + reportTime;
            document.getElementById("USCompleteSpan").innerHTML =
              "<h6>US Report Time: " +
              reportTime +
              " <span class='badge badge-success'>Complete</span></h6>";
          });
      } else {
        console.log("start to sleep");
        $("#sendButton").html(
          "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn' disabled>Requesting US Report</button>"
        );
        $("#sendButton").append(
          "<div id='loader' style='display: inline-block; margin-left: 5px;'></div>"
        );
        sleep(15000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for US report";
          getReadyReportRequestListUS();
          console.log("end USsleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleUSIMR.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
//=========================================================================request CA report==============================================================================================================================
function requestCAReport() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append("\nJust sent a request.");

      isSendRequest = true;
      requestReportID = this.responseText;
      getReadyReportRequestListCA();
      $("#sendButton").html(
        "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn' disabled>Requesting CA Report</button>"
      );
      $("#sendButton").append(
        "<div id='loader' style='display: inline-block; margin-left: 5px;'></div>"
      );
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportCAIMR.php",
    true
  );

  xmlhttp.send();
}

function getReadyReportRequestListCA() {
  let reportID;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        firebase
          .database()
          .ref("Report/CAReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, "CA");
        requestMXReport();
        document.getElementById("CACompleteSpan").innerHTML =
          "<h6>CA Report Time: " +
          currentTime +
          " <span class='badge badge-success'>Complete</span></h6>";
      } else if (this.responseText.includes("CANCELLED")) {
        firebase
          .database()
          .ref("Report/CAReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, "CA");
            requestMXReport();
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled, using report at " + reportTime;
            document.getElementById("CACompleteSpan").innerHTML =
              "<h6>CA Report Time: " +
              reportTime +
              " <span class='badge badge-success'>Complete</span></h6>";
          });
      } else {
        console.log("start to sleep");
        sleep(10000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for CA report";
          getReadyReportRequestListCA();
          console.log("end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleCAIMR.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
//================================================GET MEX======================================================================================
function requestMXReport() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append("\nJust sent a MX request.");
      isSendRequest = true;
      requestReportID = this.responseText;
      getReadyReportRequestListMX();
      $("#sendButton").html(
        "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn' disabled>Requesting MX Report</button>"
      );
      $("#sendButton").append(
        "<div id='loader' style='display: inline-block; margin-left: 5px;'></div>"
      );
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportMXIMR.php",
    true
  );

  xmlhttp.send();
}
function getReadyReportRequestListMX() {
  let reportID;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        firebase
          .database()
          .ref("Report/MXReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, "MX");
        requestEUReport();
        document.getElementById("MXCompleteSpan").innerHTML =
          "<h6>MX Report Time: " +
          currentTime +
          " <span class='badge badge-success'>Complete</span></h6>";
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done");
        firebase
          .database()
          .ref("Report/MXReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, "MX");
            requestEUReport();
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled, using report " +
              reportID +
              " at " +
              reportTime;
            document.getElementById("MXCompleteSpan").innerHTML =
              "<h6>MX Report Time: " +
              reportTime +
              " <span class='badge badge-success'>Complete</span></h6>";
          });
      } else {
        console.log("start to sleep");
        sleep(10000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for MX report";
          getReadyReportRequestListMX();
          console.log("end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleMXIMR.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
//=====================EU Request=========================================================================
function requestEUReport() {
  var marketID = "A13V1IB3VIYZZH";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append("\nJust sent a EU request.");
      isSendRequest = true;
      requestReportID = this.responseText;
      getReadyReportRequestListEU();
      $("#sendButton").html(
        "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn' disabled>Requesting EU Report</button>"
      );
      $("#sendButton").append(
        "<div id='loader' style='display: inline-block; margin-left: 5px;'></div>"
      );
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportEUIMR.php?marketID=" + marketID,
    true
  );

  xmlhttp.send();
}
function getReadyReportRequestListEU() {
  let reportID;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        firebase
          .database()
          .ref("Report/EUReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, "EU");
        requestJPReport();
        document.getElementById("EUCompleteSpan").innerHTML =
          "<h6>EU Report Time: " +
          currentTime +
          " <span class='badge badge-success'>Complete</span></h6>";
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done");
        firebase
          .database()
          .ref("Report/EUReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, "EU");
            requestJPReport();
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled, using report at " + reportTime;
            document.getElementById("EUCompleteSpan").innerHTML =
              "<h6>EU Report Time: " +
              reportTime +
              " <span class='badge badge-success'>Complete</span></h6>";
          });
      } else {
        console.log("start to sleep");
        sleep(15000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for EU report";
          getReadyReportRequestListEU();
          console.log("EU end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleEUIMR.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
//=====================JP Request=========================================================================
function requestJPReport() {
  var marketID = "A1VC38T7YXB528";
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      $("#txtHint").append("\nJust sent a JP request.");
      isSendRequest = true;
      requestReportID = this.responseText;
      getReadyReportRequestListJP();
      $("#sendButton").html(
        "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn' disabled>Requesting JP Report</button>"
      );
      $("#sendButton").append(
        "<div id='loader' style='display: inline-block; margin-left: 5px;'></div>"
      );
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportJPIMR.php?marketID=" + marketID,
    true
  );

  xmlhttp.send();
}
function getReadyReportRequestListJP() {
  let reportID;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        firebase
          .database()
          .ref("Report/JPReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, "JP");
        document.getElementById("JPCompleteSpan").innerHTML =
          "<h6>JP Report Time: " +
          currentTime +
          " <span class='badge badge-success'>Complete</span></h6>";
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done");
        firebase
          .database()
          .ref("Report/JPReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            let reportTime = snapshot.val().ReportDate;
            getReadyReport(reportID, "JP");
            document.getElementById("txtHint").innerHTML =
              "Report requested got cancelled, using report at " + reportTime;
            document.getElementById("JPCompleteSpan").innerHTML =
              "<h6>JP Report Time: " +
              reportTime +
              " <span class='badge badge-success'>Complete</span></h6>";
          });
      } else {
        console.log("start to sleep");
        sleep(15000).then(() => {
          document.getElementById("txtHint").innerHTML =
            "Waiting for JP report";
          getReadyReportRequestListJP();
          console.log("JP end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleJPIMR.php?requestID=" +
      requestReportID,
    true
  );
  xmlhttp.send();
}
//========================================Get Report================================================================
function getReadyReport(reportID, country) {
  console.log("ReportID " + reportID);
  //requstData = reportID + "/" + country;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("txtHint").innerHTML = this.responseText;
      //reportID = this.responseText;
      //console.log(this.responseText);
      totalFBATable = getAllCountriesInventory(this.responseText);
      singleSKUTotalTable = convertSinlgeSKU(totalFBATable);
      let singleCountryTable = getSingleCountryInventory(this.responseText);
      if (country == "US") {
        USFBATable = singleCountryTable;
        USSpreadTable = convertToSpreadsheetTable(singleCountryTable);
      }
      if (country == "CA") {
        CAFBATable = singleCountryTable;
        CASpreadTable = convertToSpreadsheetTable(singleCountryTable);
      }
      if (country == "MX") {
        MXFBATable = singleCountryTable;
        MXSpraedTable = convertToSpreadsheetTable(singleCountryTable);
      }
      if (country == "EU") {
        EUFBATable = singleCountryTable;
        EUSpreadTable = convertToSpreadsheetTable(singleCountryTable);
        //getFinalResult();
      }
      if (country == "JP") {
        JPFBATable = singleCountryTable;
        JPSpreadTable = convertToSpreadsheetTable(singleCountryTable);
        getFinalResult();
      }
      totalSpreadTable = convertToSpreadsheetTable(totalFBATable);
      singleSKUSpreadTable = convertToSpreadsheetTable(singleSKUTotalTable);
      console.log(country + "Table", singleCountryTable);
      //pushToTable(singleCountryTable, country);
      pushToTable(totalFBATable, "ALL");
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

//============Get one country's FBA info=====================================
function getSingleCountryInventory(result) {
  let sinlgeFulfillable = 0;
  let singleReserved = 0;
  let singleInbound = 0;
  let singleReceiving = 0;
  let singleUnsellable = 0;
  let singleTotal = 0;
  let lines = result.split("\n");
  let firstLine = lines[0].split("\t");
  let sku;
  let line;
  let singleCountryTable = [];
  console.log("lines[0].split()", lines[0].split("\t"));
  console.log("lines[0].split() length", lines[0].split("\t").length);
  let skuIndex = firstLine.indexOf("sku");
  console.log("skuIndex", skuIndex);
  let ffableIndex = firstLine.indexOf("afn-fulfillable-quantity");
  console.log("afn-fulfillable-quantity", ffableIndex);

  let reservedIndex = firstLine.indexOf("afn-reserved-quantity");
  let unsellIndex = firstLine.indexOf("afn-unsellable-quantity");
  let receivingIndex = firstLine.indexOf("afn-inbound-receiving-quantity");
  console.log("receivingIndex", receivingIndex);
  let inboundIndex = firstLine.indexOf("afn-inbound-shipped-quantity");
  let workingIndex = firstLine.indexOf("afn-inbound-working-quantity");
  let totalIndex = firstLine.indexOf("afn-total-quantity");
  for (let i = 1; i < lines.length; i++) {
    line = lines[i].split("\t");
    sku = line[skuIndex].split(".")[0].toUpperCase();

    sinlgeFulfillable = parseInt(line[ffableIndex]);
    singleUnsellable = parseInt(line[unsellIndex]);
    singleReserved = parseInt(line[reservedIndex]);
    singleInbound = parseInt(line[inboundIndex]);
    singleReceiving = parseInt(line[17]);
    singleTotal = parseInt(line[totalIndex]) - parseInt(line[workingIndex]);

    if (singleCountryTable[sku]) {
      singleCountryTable[sku] = {
        Fulfillable: singleCountryTable[sku].Fulfillable + sinlgeFulfillable,
        Unsellable: singleCountryTable[sku].Unsellable + singleUnsellable,
        Reserved: singleCountryTable[sku].Reserved + singleReserved,
        Inbound: singleCountryTable[sku].Inbound + singleInbound,
        Receiving: singleCountryTable[sku].Receiving + singleReceiving,
        Total: singleCountryTable[sku].Total + singleTotal
      };
    } else {
      singleCountryTable[sku] = {
        Fulfillable: sinlgeFulfillable,
        Unsellable: singleUnsellable,
        Reserved: singleReserved,
        Inbound: singleInbound,
        Receiving: singleReceiving,
        Total: singleTotal
      };
    }
  }
  return singleCountryTable;
}

//============Add up all country's FBA info=====================================
function getAllCountriesInventory(result) {
  fulfillable = 0;
  reserved = 0;
  inbound = 0;
  receiving = 0;
  let unsellable = 0;
  let total = 0;

  var lines = result.split("\n");
  let firstLine = lines[0].split("\t");
  var sku;
  var line;
  let skuIndex = firstLine.indexOf("sku");
  let asinIndex = firstLine.indexOf("asin");
  let ffableIndex = firstLine.indexOf("afn-fulfillable-quantity");
  let reservedIndex = firstLine.indexOf("afn-reserved-quantity");
  let unsellIndex = firstLine.indexOf("afn-unsellable-quantity");
  let receivingIndex = firstLine.indexOf("afn-inbound-receiving-quantity");
  let inboundIndex = firstLine.indexOf("afn-inbound-shipped-quantity");
  let workingIndex = firstLine.indexOf("afn-inbound-working-quantity");
  let totalIndex = firstLine.indexOf("afn-total-quantity");
  for (var i = 1; i < lines.length; i++) {
    line = lines[i].split("\t");
    sku = line[skuIndex].split(".")[0].toUpperCase();
    ASIN = line[asinIndex];
    fulfillable = parseInt(line[ffableIndex]);
    //console.log("fullfillable ", fulfillable);
    unsellable = parseInt(line[unsellIndex]);
    reserved = parseInt(line[reservedIndex]);
    inbound = parseInt(line[inboundIndex]);
    receiving = parseInt(line[17]);
    total = parseInt(line[totalIndex]) - parseInt(line[workingIndex]);

    if (totalInv[sku]) {
      totalInv[sku] = {
        Fulfillable: totalInv[sku].Fulfillable + fulfillable,
        Unsellable: totalInv[sku].Unsellable + unsellable,
        Reserved: totalInv[sku].Reserved + reserved,
        Inbound: totalInv[sku].Inbound + inbound,
        Receiving: totalInv[sku].Receiving + receiving,
        Total: totalInv[sku].total + total
      };
    } else {
      totalInv[sku] = {
        Fulfillable: fulfillable,
        Unsellable: unsellable,
        Reserved: reserved,
        Inbound: inbound,
        Receiving: receiving,
        Total: total
      };
    }
  }

  return totalInv;
}

//=======================gether all info and convert to usefull result=======================================
function getFinalResult() {
  let localInvTable = [];
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
            if (row[3] == undefined) {
              localInvTable["blank" + i] = {
                LocalInv: "",
                PartNumber: "",
                ID: ""
              };
            } else {
              var tempSKU = row[3].split("_")[0];
              if (localInvTable[tempSKU]) {
                localInvTable[tempSKU] = {
                  LocalInv:
                    parseInt(localInvTable[tempSKU].LocalInv) +
                    parseInt(row[4]),
                  PartNumber: row[2],
                  ID: localInvTable[tempSKU].ID
                };
              } else {
                localInvTable[tempSKU] = {
                  LocalInv: row[4],
                  PartNumber: row[2],
                  ID: row[0]
                };
              }
            }

            console.log("local PC table " + row[3]);
          }
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
                    localInvTable[row[3]] = {
                      LocalInv: row[9],
                      PartNumber: row[2],
                      ID: row[0]
                    };
                    console.log("row 3", row[3]);
                  }
                  for (var sku in singleSKUTotalTable) {
                    let totalUSFBA = 0;
                    let totalCAFBA = 0;
                    let totalMXFBA = 0;
                    let totalEUFBA = 0;
                    let totalJPFBA = 0;
                    if (USFBATable[sku]) {
                      totalUSFBA = USFBATable[sku].Total;
                    }
                    if (CAFBATable[sku]) {
                      totalCAFBA = CAFBATable[sku].Total;
                    }
                    if (MXFBATable[sku]) {
                      totalMXFBA = MXFBATable[sku].Total;
                    }
                    if (EUFBATable[sku]) {
                      totalEUFBA = EUFBATable[sku].Total;
                    }
                    if (JPFBATable[sku]) {
                      totalJPFBA = JPFBATable[sku].Total;
                    }
                    finalTotalTable[sku] = {
                      Local: localInvTable[sku],
                      USTotal: totalUSFBA,
                      CATotal: totalCAFBA,
                      MXTotal: totalMXFBA,
                      EUTotal: totalEUFBA,
                      JPTotal: totalJPFBA,
                      TotalFBA:
                        totalUSFBA +
                        totalCAFBA +
                        totalMXFBA +
                        totalEUFBA +
                        totalJPFBA
                    };
                  }
                  console.log("finalTotalTable " + finalTotalTable);
                  //use this function to build spreadsheet table

                  buildFinalTable(localInvTable, finalTotalTable);
                } else {
                  console.log("no data from Server 2018");
                }
              },
              function(response) {
                appendPre("Error: " + response.result.error.message);
              }
            );
        } else {
          console.log("no data from PC 2018");
        }
      },
      function(response) {
        appendPre("Error: " + response.result.error.message);
      }
    );
}
function convertSinlgeSKU(table) {
  let kit = 1;
  let singleSKUTable = [];
  for (var sku in table) {
    sku = sku.split("_")[0];
    if (sku.includes("-")) {
      let temp = sku.split("-")[1];
      if (temp.includes("K")) {
        if (temp.match(/K([0-9]+)$/)) {
          let singleSKU = sku.slice(0, -2);
          kit = parseInt(temp.split("K")[1]);
          if (singleSKUTable[singleSKU]) {
            singleSKUTable[singleSKU] = {
              Fulfillable:
                singleSKUTable[singleSKU].Fulfillable +
                table[sku].Fulfillable * kit,
              Unsellable:
                singleSKUTable[singleSKU].Unsellable +
                table[sku].Unsellable * kit,
              Reserved:
                singleSKUTable[singleSKU].Reserved + table[sku].Reserved * kit,
              Inbound:
                singleSKUTable[singleSKU].Inbound + table[sku].Inbound * kit,
              Receiving:
                singleSKUTable[singleSKU].Receiving + table[sku].Receiving * kit
            };
          } else {
            console.log("singleSKU ", singleSKU);
            console.log("SKU ", sku);
            singleSKUTable[singleSKU] = {
              Fulfillable: table[sku].Fulfillable * kit,
              Unsellable: table[sku].Unsellable * kit,
              Reserved: table[sku].Reserved * kit,
              Inbound: table[sku].Inbound * kit,
              Receiving: table[sku].Receiving * kit
            };
          }
        } else {
          //when K follow with not a number
          singleSKUTable[sku] = table[sku];
        }
      } else {
        // when there is no K
        singleSKUTable[sku] = table[sku];
      }
    } else {
      // when there is no -
      singleSKUTable[sku] = table[sku];
    }
  }
  return singleSKUTable;
}

//===========================Push to html table ========================================================================================
function pushToTable(invTable, country) {
  $("#my" + country + "Table").empty();
  $("#my" + country + "Table").append(
    "<thead><th>" +
      country +
      " SKU</th><th>FBA Fulfillable</th><th>FBA Inbound</th><th>FBA Reserved</th><th>FBA Receiving</th></thead><tbody id='my" +
      country +
      "TableBody'></tbody>"
  );
  for (var x in invTable) {
    $("#my" + country + "TableBody").append(
      "<tr><td>" +
        x +
        "</td><td>" +
        invTable[x].Fulfillable +
        "</td><td>" +
        invTable[x].Inbound +
        "</td><td>" +
        invTable[x].Reserved +
        "</td><td>" +
        invTable[x].Receiving +
        "</td></tr>"
    );
  }
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
//==============================================================

function convertToSpreadsheetTable(data) {
  let sheetTable = [];
  sheetTable.push([
    "SKU",
    "FBA Fulfillable",
    "FBA Unsellable",
    "FBA Inbound",
    "FBA Reserved",
    "FBA Receiving",
    "FBA Total"
  ]);
  for (var sku in data) {
    let sheetline = [];
    sheetline.push(sku);
    sheetline.push(data[sku].Fulfillable);
    sheetline.push(data[sku].Unsellable);
    sheetline.push(data[sku].Reserved);
    sheetline.push(data[sku].Inbound);
    sheetline.push(data[sku].Receiving);
    sheetline.push(
      data[sku].Fulfillable +
        data[sku].Unsellable +
        data[sku].Reserved +
        data[sku].Inbound +
        data[sku].Receiving
    );
    sheetTable.push(sheetline);
  }
  return sheetTable;
}
function buildFinalTable(localInvTable, data) {
  let sheetTable = [];
  sheetTable.push([
    "No.",
    "Timetec Part",
    "Local",
    "FBA Total",
    "Total",
    "FBA US",
    "FBA CA",
    "FBA MX",
    "FBA EU",
    "FBA JP"
  ]);
  for (var sku in localInvTable) {
    let sheetline = [];
    if (data[sku]) {
      if (localInvTable[sku]) {
        sheetline.push(localInvTable[sku].ID);
      } else {
        sheetline.push("");
      }
      sheetline.push(sku);
      if (localInvTable[sku]) {
        //sheetline.push(localInvTable[sku].PartNumber);
        sheetline.push(localInvTable[sku].LocalInv);
      } else {
        sheetline.push("");
        sheetline.push("");
      }
      if (data[sku]) {
        sheetline.push(data[sku].TotalFBA);
      } else {
        sheetline.push("");
      }

      if (localInvTable[sku]) {
        sheetline.push(
          parseInt(data[sku].TotalFBA) + parseInt(localInvTable[sku].LocalInv)
        );
      } else {
        sheetline.push(data[sku].TotalFBA);
      }

      sheetline.push(data[sku].USTotal);
      sheetline.push(data[sku].CATotal);
      sheetline.push(data[sku].MXTotal);
      sheetline.push(data[sku].EUTotal);
      sheetline.push(data[sku].JPTotal);

      sheetTable.push(sheetline);
    } else if (sku.includes("blank")) {
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetline.push("");
      sheetTable.push(sheetline);
    }
  }
  finalTotalSpreadsheetTable = sheetTable;
  $("#sendButton").html(
    "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='createNewSheet()'>Send</button>"
  );
}
//==========google apis===============================================================

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
      "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='sendBtn'  onclick='requestUSReport()'>Get Reports</button>"
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

      creatNewTab(response.result.spreadsheetId, "US", USSpreadTable);
      creatNewTab(response.result.spreadsheetId, "CA", CASpreadTable);
      creatNewTab(response.result.spreadsheetId, "MX", MXSpraedTable);
      creatNewTab(response.result.spreadsheetId, "EU", EUSpreadTable);
      creatNewTab(response.result.spreadsheetId, "JP", JPSpreadTable);
      creatNewTab(response.result.spreadsheetId, "Total", totalSpreadTable);
      creatNewTab(
        response.result.spreadsheetId,
        "FinalTotal",
        finalTotalSpreadsheetTable
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
function sendFormat(spreadSheetID, sheetId) {
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
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: 20
          }
        }
      }
    ] // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
  };
  var batchUpdateSpreadsheetRequestBodyFormat = {
    // A list of updates to apply to the spreadsheet.
    // Requests will be applied in the order they are specified.
    // If any request is not valid, no requests will be applied.
    requests: [
      {
        repeatCell: {
          range: {
            startRowIndex: 0,
            endRowIndex: 1,
            sheetId: sheetId,
            endColumnIndex: 20,
            startColumnIndex: 0
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                bold: true,
                fontSize: 12
              }
            }
          },
          fields: "userEnteredFormat(textFormat)"
        }
      }
    ] // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
  };
  var requestFormat = gapi.client.sheets.spreadsheets.batchUpdate(
    params,
    batchUpdateSpreadsheetRequestBodyFormat
  );

  requestFormat.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      var request = gapi.client.sheets.spreadsheets.batchUpdate(
        params,
        batchUpdateSpreadsheetRequestBody
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
      range: "Master!A3:E"
    })
    .then(
      function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            localInvTable[row[3]] = {
              LocalInv: row[4],
              PartNumber: row[2],
              ID: row[0]
            };
          }
        } else {
          console.log("no data from PC 2019");
        }
      },
      function(response) {
        appendPre("Error: " + response.result.error.message);
      }
    );
}
function appendFinalValue(spreadSheetID, sheetValueTable) {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadSheetID, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: "FinalTotal!A:Z", // TODO: Update placeholder value.

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
