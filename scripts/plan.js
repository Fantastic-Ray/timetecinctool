var requestReportID;
var reportID;
var isSendRequest = false;
firebase
  .database()
  .ref("PausedSKUList/")
  .on("child_changed", function(childSnapshot, prevChildKey) {
    pushToTable(globalPlanTable);
  });
function requestAReport() {
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
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
      getReadyReportRequestList();
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportRestockAllMarkets.php?requestInfo=" +
      market,
    true
  );
  xmlhttp.send();
}

function getReadyReportRequestList() {
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  getPausedSKUList();
  getLocalInv();
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("txtHint").innerHTML = this.responseText;
      let currentTime = getCurrentTime();
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("reportID " + reportID);
        document.getElementById("getButton").firstChild.data = "Done";
        let currentTime = getCurrentTime();
        firebase
          .database()
          .ref("Report/" + market + "RSReport")
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        getReadyReport(reportID, market);
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done");
        firebase
          .database()
          .ref("Report/" + market + "RSReport")
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            getReadyReport(reportID, market);
          });
      } else {
        $("#getButtonDiv").html(
          "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='getButton' disabled>Please Wait</button>"
        );

        console.log("start to sleep");
        sleep(15000).then(() => {
          document.getElementById("txtHint").innerHTML = "Waiting for report";
          getReadyReportRequestList();
          console.log("end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListSampleRestockAllMarket.php?requestInfo=" +
      requestReportID +
      "/" +
      market,
    true
  );
  xmlhttp.send();
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
var globalPlanTable;

/*function getReadyReport(reportID, market) {
  console.log("ReportID " + reportID);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //document.getElementById("txtHint").innerHTML = this.responseText;
      //reportID = this.responseText;
      //console.log(this.responseText);
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
}*/
function getReadyReport(reportID, country) {
  console.log("ReportID " + reportID);
  //requstData = reportID + "/" + country;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = this.responseText;
      console.log("result", result);
      globalPlanTable = getUsefulData(result);
      pushToTable(globalPlanTable);
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

function getUsefulData(result) {
  pushToPausedTable();
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }

  $("#myTableBody").empty();
  var lines = result.split("\n");
  var sku;
  var asin;
  var line;

  var fbaInv;
  var salesUnits;
  var suggestUnits;
  var avgSale;
  var supplyDay;
  var skuIndex;
  var asinIndex;
  var salesUnitsIndex;
  var fbaInvIndex;
  var countryIndex;
  var plan = [];
  for (var index = 0; index < lines[0].length; index++) {
    line = lines[0].split("\t");
    if (line[index] == "SKU") {
      skuIndex = index;
    }
    if (line[index] == "ASIN") {
      asinIndex = index;
    }
    if (line[index] == "Sales last 30 days (units)") {
      salesUnitsIndex = index;
    }
    if (line[index] == "Total Inventory") {
      fbaInvIndex = index;
    }
    if (line[index] == "Country") {
      countryIndex = index;
    }
  }
  for (var i = 1; i < lines.length; i++) {
    var country = line[countryIndex];
    line = lines[i].split("\t");

    sku = line[skuIndex];
    if (market == "EU") {
      // asin = line[asinIndex] + " " + line[countryIndex];
      asin = line[asinIndex];
    } else {
      asin = line[asinIndex];
    }
    salesUnits = parseInt(line[salesUnitsIndex]);
    avgSale = Math.ceil(parseFloat(salesUnits / 30));
    //console.log("avgSale", avgSale);
    fbaInv = parseInt(line[fbaInvIndex]);
    /*if (fbaInv == 0) {
      supplyDay = 0;
    } else if (salesUnits == 0) {
      supplyDay = 9999;
    } else {
      supplyDay = Math.round(parseFloat(fbaInv / avgSale));
    }
    //console.log("supply day", parseFloat(fbaInv / avgSale));
    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    if (salesUnits - fbaInv > 0) {
      suggestUnits = Math.round((salesUnits - fbaInv) * 1.2);
    } else {
      suggestUnits = 0;
    }*/

    let RAM = sku.substring(0, 2);
    if (RAM == "75" || RAM == "76" || RAM == "78" || RAM == "30") {
      var found = false;
      for (var j = 0; j < plan.length; j++) {
        if (asin == plan[j].ASIN && country != plan[j].Country) {
          plan[j].SalesUnits = plan[j].SalesUnits + salesUnits;

          found = true;
          break;
        }
      }
      if (!found) {
        plan.push({
          SKU: sku,
          ASIN: asin,
          SalesUnits: salesUnits,
          FBAInv: fbaInv,
          SupplyDay: supplyDay,
          suggestUnits: suggestUnits,
          planAdded: false,
          Country: country
        });
      }
    }
    //console.log("plabTable" + plan[sku].ASIN);
    //pushToTable(sku,plan[sku]);
  }
  //calculate supply day suggest unit
  for (var j = 0; j < plan.length; j++) {
    if (plan[j].FBAInv == 0) {
      plan[j].SupplyDay = 0;
    } else if (plan.SalesUnits == 0) {
      plan[j].SupplyDay = 9999;
    } else {
      avgSale = Math.ceil(parseFloat(plan[j].SalesUnits / 30));
      plan[j].SupplyDay = Math.round(parseFloat(plan[j].FBAInv / avgSale));
    }
    //console.log("supply day", parseFloat(fbaInv / avgSale));

    if (plan[j].SalesUnits - plan[j].FBAInv > 0) {
      plan[j].suggestUnits = Math.round(
        (plan[j].SalesUnits - plan[j].FBAInv) * 1.2
      );
    } else {
      plan[j].suggestUnits = 0;
    }
  }
  plan.sort(function(a, b) {
    return b.suggestUnits - a.suggestUnits;
  });
  document.getElementById("sendButton").style.visibility = "visible";
  return plan;
}

function pushToTable(planTable) {
  $("#myTableBody").empty();
  $("#myOOSTableBody").empty();
  $("#myLSTableBody").empty();
  $("#myPlanTableBody").empty();
  var pausedSKUList;
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  firebase
    .database()
    .ref("PausedSKUList/" + market)
    .once("value")
    .then(function(snapshot) {
      if (snapshot.val()) {
        pausedSKUList = snapshot.val();
      } else {
        pausedSKUList = [];
      }
      for (var x in planTable) {
        var temp = planTable[x].SKU.split(".")[0]
          .split("_")[0]
          .split("K")[0];
        var kit;
        if (planTable[x].SKU.includes("K")) {
          //console.log("sku", planTable[x].SKU.split(".")[0]);
          kit = parseInt(planTable[x].SKU.split(".")[0].split("K")[1]);
        } else {
          kit = 1;
        }
        var localInvQTY;
        var suggestUnits = planTable[x].suggestUnits;
        if (localInvTable[temp]) {
          localInvQTY = localInvTable[temp];
        } else {
          localInvQTY = "Discontinued";
          suggestUnits = 0;
        }

        var tr;
        if (planTable[x].suggestUnits * kit - localInvTable[temp] > 0) {
          tr = "<tr style='color:red;'>";
        } else {
          tr = "<tr>";
        }
        if (!pausedSKUList[convertDot(planTable[x].SKU)]) {
          $("#myTableBody").append(
            tr +
              "<td>" +
              planTable[x].SKU +
              "</td><td>" +
              planTable[x].ASIN +
              "</td><td>" +
              planTable[x].FBAInv +
              "</td><td>" +
              planTable[x].SalesUnits +
              "</td><td>" +
              planTable[x].SupplyDay +
              "</td><td>" +
              localInvQTY +
              "</td><td>" +
              suggestUnits +
              "</td>" +
              addButtonSelector(planTable[x].planAdded, x, planTable[x].SKU) +
              "</tr>"
          );

          if (planTable[x].FBAInv == 0) {
            $("#myOOSTableBody").append(
              tr +
                "<td>" +
                planTable[x].SKU +
                "</td><td>" +
                planTable[x].ASIN +
                "</td><td>" +
                planTable[x].FBAInv +
                "</td><td>" +
                planTable[x].SalesUnits +
                "</td><td>" +
                planTable[x].SupplyDay +
                "</td><td>" +
                localInvQTY +
                "</td><td>" +
                suggestUnits +
                "</td>" +
                addButtonSelector(planTable[x].planAdded, x, planTable[x].SKU) +
                "</tr>"
            );
          }
          if (planTable[x].SupplyDay < 10) {
            $("#myLSTableBody").append(
              tr +
                "<td>" +
                planTable[x].SKU +
                "</td><td>" +
                planTable[x].ASIN +
                "</td><td>" +
                planTable[x].FBAInv +
                "</td><td>" +
                planTable[x].SalesUnits +
                "</td><td>" +
                planTable[x].SupplyDay +
                "</td><td>" +
                localInvQTY +
                "</td><td>" +
                suggestUnits +
                "</td>" +
                addButtonSelector(planTable[x].planAdded, x, planTable[x].SKU) +
                "</tr>"
            );
          }
          if (planTable[x].planAdded == true) {
            $("#myPlanTableBody").append(
              tr +
                "<td>" +
                globalPlanTable[x].SKU +
                "</td><td>" +
                globalPlanTable[x].ASIN +
                "</td><td>" +
                globalPlanTable[x].FBAInv +
                "</td><td>" +
                globalPlanTable[x].SalesUnits +
                "</td><td>" +
                globalPlanTable[x].SupplyDay +
                "</td><td>" +
                localInvQTY +
                "</td><td>" +
                suggestUnits +
                "</td><td>" +
                "<input type='text' id='" +
                x +
                "' size='4'>" +
                "</td><td><button type='button' class='btn btn-warning btn-sm' name=" +
                x +
                " value =" +
                globalPlanTable[x].SKU +
                " onclick='updatePlanStatus(this.name,this)'>Cancel</button></td></tr>"
            );
          }
        }
      }
      readyToSend = true;
      document.getElementById("sendButton").style.visibility = "visible";
    });
}
function addButtonSelector(status, x, sku) {
  if (status == false) {
    return (
      "<td><button type='button' class='btn btn-info btn-sm' name=" +
      x +
      " value =" +
      sku +
      " onclick='updatePlanStatus(this.name, this)'>Add</button></td>"
    );
  } else {
    return (
      "<td><button type='button' class='btn btn-warning btn-sm' name=" +
      x +
      " value =" +
      sku +
      " onclick='updatePlanStatus(this.name, this)'>Cancel</button></td>"
    );
  }
}
function updatePlanStatus(x, thisButton) {
  console.log("button this ", x);
  console.log("row number ", thisButton.parentNode.parentNode.rowIndex);
  console.log("table name", thisButton.parentNode.parentNode.parentNode.id);
  var tableID = thisButton.parentNode.parentNode.parentNode.id;
  console.log("added status ", globalPlanTable[x].planAdded);
  var temp = globalPlanTable[x].SKU.split(".")[0]
    .split("_")[0]
    .split("K")[0];
  var kit;
  if (globalPlanTable[x].SKU.includes("K")) {
    //console.log("sku", planTable[x].SKU.split(".")[0]);
    kit = parseInt(globalPlanTable[x].SKU.split(".")[0].split("K")[1]);
  } else {
    kit = 1;
  }
  var localInvQTY;
  var suggestUnits = globalPlanTable[x].suggestUnits;
  if (localInvTable[temp]) {
    localInvQTY = localInvTable[temp];
  } else {
    localInvQTY = "Discontinued";
    suggestUnits = 0;
  }

  var tr;
  if (globalPlanTable[x].suggestUnits * kit - localInvTable[temp] > 0) {
    tr = "<tr style='color:red;'>";
  } else {
    tr = "<tr>";
  }
  if (globalPlanTable[x].planAdded == false) {
    globalPlanTable[x].planAdded = true;
    pushToTable(globalPlanTable);
  } else {
    globalPlanTable[x].planAdded = false;
  }

  var tableList = ["myTable", "myOOSTable", "myLSTable", "myPlanTable"];
  for (var t = 0; t < tableList.length; t++) {
    var currentTable = document.getElementById(tableList[t]);
    var currentTableItemIndex;
    var currentValue;
    console.log(tableList[t], "current table rows", currentTable.rows.length);
    for (var i = 1; i < currentTable.rows.length; i++) {
      console.log("this button value", thisButton.value);
      console.log(
        "currentTable.value",
        currentTable.rows[i].cells[7].childNodes[0].value
      );
      if (tableList[t] == "myPlanTable") {
        currentValue = currentTable.rows[i].cells[8].childNodes[0].value;
      } else {
        currentValue = currentTable.rows[i].cells[7].childNodes[0].value;
      }
      if (thisButton.value == currentValue) {
        currentTableItemIndex = i;
        //console.log("currentTableItemIndex ", currentTableItemIndex);
        //console.log("current table ", tableList[t]);
        if (tableList[t] == "myPlanTable") {
          if (globalPlanTable[x].planAdded == false) {
            document
              .getElementById("myPlanTable")
              .deleteRow(currentTableItemIndex);
          }
        } else if (globalPlanTable[x].planAdded == true) {
          currentTable.rows[currentTableItemIndex].cells[7].innerHTML =
            "<button type='button' class='btn btn-warning btn-sm' name=" +
            x +
            " value =" +
            globalPlanTable[x].SKU +
            " onclick='updatePlanStatus(this.name, this)'>Cancel</button>";

          break;
        } else {
          currentTable.rows[currentTableItemIndex].cells[7].innerHTML =
            "<button type='button' class='btn btn-info btn-sm' name=" +
            x +
            " value =" +
            globalPlanTable[x].SKU +
            " onclick='updatePlanStatus(this.name, this)'>Add</button>";
          break;
        }
      }
    }
  }
}

var readyToSend = false;
function readyDataToSheet() {
  var readyToSheet = [];
  var checked = document.forms[0];
  console.log("checked", checked);
  var itemArray = [];
  var item;

  console.log("checked length" + checked.length);
  for (var i = 0; i < checked.length; i++) {
    itemArray = [];
    //if (checked[i].value) {
    item = globalPlanTable[checked[i].id];
    console.log("id is " + checked[i].id);
    itemArray.push(item.SKU);
    itemArray.push(item.ASIN);
    itemArray.push(item.SalesUnits);
    itemArray.push(item.FBAInv);
    itemArray.push(checked[i].value);
    readyToSheet.push(itemArray);
    //}
    i++;
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
  if (isSignedIn) {
    $("#getButtonDiv").html(
      "<button type='button' style='margin-bottom:10px' class='btn btn-primary btn-sm' id='getButton'  onclick='requestAReport()'>Get Report</button>"
    );
    document.getElementById("radioDiv").style.visibility = "visible";
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendValue() {
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  var sheetValueTable = readyDataToSheet();
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: "1NnNSvCqSJjOYADpgrZe3cdiaY28MkhUCv32etRW8sVc", // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values will be appended after the last row of the table.
    range: market + " Request!A2:E", // TODO: Update placeholder value.

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
        "https://docs.google.com/spreadsheets/d/1NnNSvCqSJjOYADpgrZe3cdiaY28MkhUCv32etRW8sVc/edit#gid=0";
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
var CAPausedSKUList;
var USPausedSKUList;
function getPausedSKUList() {
  firebase
    .database()
    .ref("PausedSKUList/")
    .once("value")
    .then(function(snapshot) {
      CAPausedSKUList = snapshot.val()["CA"];
      USPausedSKUList = snapshot.val()["US"];
      console.log("CAPausedSKUList", CAPausedSKUList);
    });
}
var order = true;
function sortTable(n, tableID) {
  if (order == true) {
    order = false;
  } else {
    order = true;
  }
  console.log("order  ", order);
  table = document.getElementById(tableID);
  //rows = table.rows;
  //var array = Array.from(rows);
  //console.log("rows", array);
  var result = mergeSort(globalPlanTable, n);
  //table.rows = result;
  globalPlanTable = result;
  pushToTable(result);
  console.log("result", result);
}
function mergeSort(array, n) {
  if (array.length == 1 || array.length == 0) {
    return array;
  }

  var mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);
  var resultLeft = mergeSort(left, n);
  var resultRight = mergeSort(right, n);
  return merge(resultLeft, resultRight, n);
}
function merge(resultLeft, resultRight, n) {
  // console.log("n", n);
  var leftValue;
  var rightValue;

  var result = [];

  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < resultLeft.length && rightIndex < resultRight.length) {
    switch (n) {
      case 0:
        leftValue = resultLeft[leftIndex].SKU;
        rightValue = resultRight[rightIndex].SKU;
        break;
      case 2:
        leftValue = parseInt(resultLeft[leftIndex].FBAInv);
        rightValue = parseInt(resultRight[rightIndex].FBAInv);
        break;
      case 3:
        leftValue = parseInt(resultLeft[leftIndex].SalesUnits);
        rightValue = parseInt(resultRight[rightIndex].SalesUnits);
        break;
      case 4:
        leftValue = parseInt(resultLeft[leftIndex].SupplyDay);
        rightValue = parseInt(resultRight[rightIndex].SupplyDay);
        break;
      case 6:
        leftValue = parseInt(resultLeft[leftIndex].suggestUnits);
        rightValue = parseInt(resultRight[rightIndex].suggestUnits);
        break;
    }
    if (order == true) {
      if (leftValue <= rightValue) {
        result.push(resultLeft[leftIndex]);

        leftIndex++;
      } else {
        //array[left].parentNode.replaceChild(helper[rightIndex], array[left]);
        result.push(resultRight[rightIndex]);

        rightIndex++;
      }
    } else {
      if (rightValue >= leftValue) {
        result.push(resultRight[rightIndex]);

        rightIndex++;
      } else {
        //array[left].parentNode.replaceChild(helper[rightIndex], array[left]);
        result.push(resultLeft[leftIndex]);

        leftIndex++;
      }
    }
  }

  return result
    .concat(resultLeft.slice(leftIndex))
    .concat(resultRight.slice(rightIndex));
}
function pushToPausedList() {
  var pausedSKU = document.getElementById("pausedSKUInput").value;
  var pausedReason = document.getElementById("pausedReasonInput").value;
  document.getElementById("pausedSKUInput").value = "";
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  if (pausedSKU != "") {
    firebase
      .database()
      .ref("PausedSKUList/" + market + "/" + convertDot(pausedSKU))
      .set(
        {
          Reason: pausedReason
        },
        function(error) {
          if (error) {
          } else {
            console.log("no error");
            pushToPausedTable();
          }
        }
      );
  } else {
    console.log("no input");
  }
}
function pushToPausedTable() {
  $("#myPausedTableBody").empty();
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  firebase
    .database()
    .ref("PausedSKUList/" + market)
    .once("value")
    .then(function(snapshot) {
      var pausedSKUList = snapshot.val();
      console.log("pausedSKUList", pausedSKUList);
      $("#myPausedTableBody").append(
        "<tr><td><input type='text' class='form-control' id='pausedSKUInput' placeholder='SKU'/></td>" +
          "<td><input type='text' class='form-control' id='pausedReasonInput' placeholder='Reason'/></td>" +
          "<td><button type='button' class='btn btn-warning btn-sm' id='addPausedSKUButton' onclick='pushToPausedList()'>Add</button>" +
          "</td></tr>"
      );
      for (var sku in pausedSKUList) {
        $("#myPausedTableBody").append(
          "<tr><td>" +
            convertAnd(sku) +
            "</td><td>" +
            pausedSKUList[sku].Reason +
            "</td><td><button type='button' name=" +
            sku +
            " class='btn btn-danger btn-sm' onClick='removePausedSKU(this.name)'>Remove</button></td></tr>"
        );
      }
    });
}
function removePausedSKU(sku) {
  let market;
  if (document.getElementById("USRadio").checked) {
    market = "US";
  } else if (document.getElementById("CARadio").checked) {
    market = "CA";
  } else if (document.getElementById("JPRadio").checked) {
    market = "JP";
  } else if (document.getElementById("EURadio").checked) {
    market = "EU";
  }
  firebase
    .database()
    .ref("PausedSKUList/" + market + "/" + sku)
    .remove()
    .then(function() {
      pushToPausedTable();
    });
}
function convertDot(sku) {
  return sku.replace(/\./g, "&");
}
function convertAnd(sku) {
  return sku.replace(/\&/g, ".");
}
