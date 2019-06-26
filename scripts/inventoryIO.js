var infoTable = [];
var pcData = [];
var svData = [];
var totalNPNumer = 0;
var totalSVNumber = 0;
var processedNP = 0;
var processedSV = 0;
//var pcSheetID = "1r4vvca5PZtGQG53r8AkGrW34gAwsCo2r4KJTEbEDdBs";
var pcSheetID = "1jSSA_Ad2XCceylBtnU_A-dd-WeCWfOYG1FRUPQ8GhP4"; //this is the test id
var svSheetID = "1A-u68BPi50FMdDQDN-S_ghqwXLzh2Lhp50F6jpLqo1M";
var aphabetArray = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T"
];
function getIOsheetValue() {
  document.getElementById("sendButton").style.visibility = "hidden";
  pcData = [];
  svData = [];
  document.getElementById("loader").style.visibility = "visible";
  infoTable = [];
  var params = {
    spreadsheetId: "1biM6KF4C0PNlORq4riqACAAZZck3CUgra9qbNG9f6O0",
    range: "Main!A2:D",
    valueRenderOption: "UNFORMATTED_VALUE", // TODO: Update placeholder value.

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING",
    majorDimension: "COLUMNS"
  };
  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(
    function(response) {
      var hasError = false;
      // TODO: Change code below to process the `response` object:
      console.log(response.result);

      var IDLines = response.result.values[0];
      var QTYLines = response.result.values[1];
      var customerLines = response.result.values[2];
      var orderLines = response.result.values[3];
      //check if all data number match
      console.log(IDLines);
      console.log(QTYLines);
      console.log(customerLines);
      console.log(orderLines);
      if (!IDLines) {
        document.getElementById("txtHint").innerHTML =
          "Missing ID please check";
        hasError = true;
      }
      if (!QTYLines) {
        document.getElementById("txtHint").innerHTML =
          "Missing QTY please check";
        hasError = true;
      }
      if (!customerLines) {
        document.getElementById("txtHint").innerHTML =
          "Missing customer please check";
        hasError = true;
      }
      if (!orderLines) {
        document.getElementById("txtHint").innerHTML =
          "Missing order ID please check";
        hasError = true;
      }
      if (hasError) {
        document.getElementById("sendButton").style.visibility = "hidden";
        document.getElementById("loader").style.visibility = "hidden";
        return;
      }
      if (IDLines.length != QTYLines.length) {
        console.log("length not equal");
        document.getElementById("txtHint").innerHTML =
          "ID number and QTY number not match please check";
        hasError = true;
      } else if (IDLines.length != customerLines.length) {
        console.log("length not equal");
        document.getElementById("txtHint").innerHTML =
          "ID number and customer number not match please check";
        hasError = true;
      } else if (IDLines.length != orderLines.length) {
        console.log("length not equal");
        document.getElementById("txtHint").innerHTML =
          "ID number and Order number not match please check";
        hasError = true;
      } else {
        document.getElementById("txtHint").innerHTML = "All data lines matched";
      }
      if (hasError) {
        document.getElementById("sendButton").style.visibility = "hidden";
        document.getElementById("loader").style.visibility = "hidden";
        return;
      }
      //intial the data table
      for (var i = 0; i < IDLines.length; i++) {
        if (
          IDLines[i].includes("NP") ||
          IDLines[i].includes("HN") ||
          IDLines[i].includes("KS") ||
          IDLines[i].includes("SD")
        ) {
          infoTable[IDLines[i]] = {
            startLine: 0,
            lineNumber: 0,
            inputData: [],
            orderID: [],
            buyer: []
          };
        } else {
          var temp = IDLines[i].replace("S", "");
          infoTable[temp] = {
            startLine: 0,
            lineNumber: 0,
            inputData: [],
            orderID: [],
            buyer: []
          };
        }
      }
      //push data to table
      for (var i = 0; i < IDLines.length; i++) {
        if (
          IDLines[i].includes("NP") ||
          IDLines[i].includes("HN") ||
          IDLines[i].includes("KS") ||
          IDLines[i].includes("SD")
        ) {
          infoTable[IDLines[i]].inputData.push(QTYLines[i]);
          infoTable[IDLines[i]].orderID.push(orderLines[i]);
          infoTable[IDLines[i]].buyer.push(customerLines[i]);
        } else {
          var temp = IDLines[i].replace("S", "");
          infoTable[temp].inputData.push(QTYLines[i]);
          infoTable[temp].orderID.push(orderLines[i]);
          infoTable[temp].buyer.push(customerLines[i]);
        }

        //
      }
      for (var id in infoTable) {
        if (
          id.includes("NP") ||
          id.includes("HN") ||
          id.includes("KS") ||
          id.includes("SD")
        ) {
          totalNPNumer++;
        } else {
          totalSVNumber++;
        }
      }
      var PCIDList = [];
      var SVIDList = [];
      for (var id in infoTable) {
        //getLineNumber(id,totalNPNumer);
        if (
          id.includes("NP") ||
          id.includes("HN") ||
          id.includes("KS") ||
          id.includes("SD")
        ) {
          //getColNumber(pcSheetID, id);
          PCIDList.push("'" + id + "'!A3:Z3");
        } else {
          //getColNumber(svSheetID, id);
          SVIDList.push(id + "!A3:Z3");
        }
      }
      if (PCIDList.length >= 1) {
        console.log("PCID List", PCIDList);
        getColNumber(pcSheetID, PCIDList);
      }
      if (SVIDList.length >= 1) {
        getColNumber(svSheetID, SVIDList);
      }
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
    }
  );
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
    document.getElementById("signinButton").style.display = "none";
    document.getElementById("sendButton").style.visibility = "visible";

    document.getElementById("IOType").style.visibility = "visible";
  } else {
    console.log("google logged out");
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
function getColNumber(sheetID, IDList, type) {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    ranges: ["NP1!A3:ZZ", "NP2!A3:ZZ", "NP3!A3:ZZ"], // TODO: Update placeholder value.

    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: "FORMATTED_VALUE", // TODO: Update placeholder value.

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING" // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log("get col result", response);
      var FBANumber = 0;
      var CustomerNumber = 0;
      var RINColNumber = 0;

      var directShipColNumber = 0;
      var orderIDNumber = 0;
      var POColNumber = 0;
      var sumCol = 0;
      var onHandCol = 0;
      var range = response.result.valueRanges;
      console.log("Range.length", range.length);
      if (range.length > 0) {
        for (var j = 0; j < range.length; j++) {
          var ID = range[j].range.split("!")[0].replace(/'/g, "");

          console.log("ID", ID);
          for (i = 0; i < range[j].values.length; i++) {
            if (range[j].values[0][i] == "FBA") {
              FBANumber = i;
              console.log("FBA column ", FBANumber);
            }
            if (range[j].values[0][i] == "Customer Name") {
              CustomerNumber = i;
              console.log("customerCol " + CustomerNumber);
            }

            if (range[j].values[0][i] == "Order No.") {
              orderIDNumber = i;
            }
            if (range[j].values[0][i] == "Sum") {
              sumCol = i;
            }
            if (range[j].values[0][i] == "On Hand") {
              onHandCol = i;
            }
            if (
              range[j].values[0][i] == "FBM" ||
              range[j].values[0][i] == "Direct Ship"
            ) {
              directShipColNumber = i;
            }
            if (range[j].values[0][i] == "PO") {
              POColNumber = i;
            }
            if (
              range[j].values[0][i] == "RIN/ADJ" ||
              range[j].values[0][i] == "RIN"
            ) {
              RINColNumber = i;
            }
          }
          console.log("FBA col num " + aphabetArray[FBANumber]);
          console.log("customerCol2 " + CustomerNumber);
          console.log("infoTable[ID].orderID " + infoTable[ID].orderID);
          getLineNumber(
            ID,
            range,
            FBANumber,
            CustomerNumber,
            sumCol,
            onHandCol,
            directShipColNumber,
            POColNumber,
            RINColNumber
          );
        }

        /*if (document.getElementById("deleteRadio").checked == true) {
          getLineNumberByOrderID(
            sheetID,
            ID,
            infoTable[ID].orderID[0],
            orderIDNumber
          );
        } else {
          getLineNumber(
            ID,
            range,
            FBANumber,
            CustomerNumber,
            sumCol,
            onHandCol,
            directShipColNumber,
            POColNumber,
            RINColNumber
          );
        }*/
      } else {
        console.log("no data from PC 2019");
      }
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Error: " + reason.result.error.message);
    }
  );
}
function getLineNumber(
  ID,
  range,
  FBAColNum,
  customerCol,
  sumCol,
  onHandCol,
  directShipColNumber,
  POColNumber,
  RINColNumber
) {
  var number = range.values.length;
  if (range.length > 0) {
    console.log("range value length > 0");
    for (let i = range.values.length - 1; i > 1; i--) {
      //console.log("i is ", i);
      let hasValue = false;
      for (let j = 0; j < range.values[i].length; j++) {
        if (range.values[i][j] != "" && j != sumCol && j != onHandCol) {
          hasValue = true;
          console.log("sum Col ", sumCol);
          console.log("onHand ", onHandCol);
          console.log("the first value found is ", range.values[i][j]);
          break;
        }
      }

      if (hasValue) {
        break;
      } else {
        number--;
      }
    }
    console.log("line number is " + parseInt(number) + 1);
    //getting the current date and push to value array.
    var valueArray = [];
    var monthArray = [];
    var dayArray = [];
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var inputColNumber = 0;
    var isFBA = false;
    //loop though each item from input
    for (var j = 0; j < infoTable[ID].inputData.length; j++) {
      monthArray.push(mm);
      dayArray.push(dd);
    }
    // push the date first
    valueArray.push(monthArray);
    valueArray.push(dayArray);
    //if it is the PO input------------------------------------------------------
    if (document.getElementById("PORadio").checked == true) {
      var tempPOArray = [];
      inputColNumber = POColNumber;
      for (var d = 0; d < infoTable[ID].inputData.length; d++) {
        tempPOArray.push(infoTable[ID].inputData[d]);
      }
      //jump to input column
      for (var e = 0; e < inputColNumber - 2; e++) {
        valueArray.push([]);
      }
      valueArray.push(tempPOArray);
      //skip all colum to FBA column
    } else if (document.getElementById("RINRadio").checked == true) {
      //If it is RIN section-------------
      //jump to RIN colum
      inputColNumber = RINColNumber;
      //jump to input column
      for (var e = 0; e < inputColNumber - 2; e++) {
        valueArray.push([]);
      }

      var tempRINArray = [];
      for (var d = 0; d < infoTable[ID].inputData.length; d++) {
        tempRINArray.push(infoTable[ID].inputData[d]);
      }
      valueArray.push(tempRINArray);
    } else if (document.getElementById("outgoingRadio").checked == true) {
      //If it is outgoing section-------------
      //jump to outgoing section

      for (var j = 0; j < directShipColNumber - 2; j++) {
        valueArray.push([]);
      }
      //initial FBA and FBM array
      var tempFBA = [];
      var tempFBM = [];

      //loop though each item id and push FBA or direct ship quantity temp FBA and FBM array.
      for (var d = 0; d < infoTable[ID].inputData.length; d++) {
        //console.log("line 537", infoTable[ID].orderID[d]);
        if (String(infoTable[ID].orderID[d]).includes("FBA")) {
          inputColNumber = FBAColNum;
          tempFBA.push(infoTable[ID].inputData[d]);
          tempFBM.push("");
          isFBA = true;
        } else {
          inputColNumber = directShipColNumber;
          tempFBM.push(infoTable[ID].inputData[d]);
          tempFBA.push("");
        }
      }
      valueArray.push(tempFBM);
      valueArray.push(tempFBA);
    }

    console.log("customerCol is" + customerCol);
    // jump to customer column--------------------------------------------
    console.log("input Col is ", inputColNumber);
    if (document.getElementById("outgoingRadio").checked == false) {
      for (var k = 0; k < customerCol - inputColNumber - 1; k++) {
        valueArray.push([]);
      }
    } else {
      if (isFBA == false) {
        for (var k = 0; k < customerCol - inputColNumber - 2; k++) {
          valueArray.push([]);
        }
      } else {
        for (var k = 0; k < customerCol - inputColNumber - 1; k++) {
          valueArray.push([]);
        }
      }
    }
    valueArray.push(infoTable[ID].buyer);
    valueArray.push(infoTable[ID].orderID);
    if (
      ID.includes("NP") ||
      ID.includes("HN") ||
      ID.includes("KS") ||
      ID.includes("SD")
    ) {
      pcData.push({
        range: ID + "!A" + parseInt(number + 1) + ":Z",
        majorDimension: "COLUMNS",
        values: valueArray
      });
      console.log("pcData" + JSON.stringify(pcData));
    } else {
      svData.push({
        range: ID + "!A" + parseInt(number + 1) + ":Z",
        majorDimension: "COLUMNS",
        values: valueArray
      });
      console.log("svData" + JSON.stringify(svData));
    }
  } else {
    console.log("no data from PC 2018");
  }
  if (
    ID.includes("NP") ||
    ID.includes("HN") ||
    ID.includes("KS") ||
    ID.includes("SD")
  ) {
    processedNP++;
    if (processedNP == totalNPNumer) {
      sendToSheet(pcSheetID, pcData);
    }
  } else {
    processedSV++;
    if (processedSV == totalSVNumber) {
      sendToSheet(svSheetID, svData);
    }
  }
}
/*function getLineNumber(
  sheetID,
  ID,
  FBAColNum,
  customerCol,
  sumCol,
  onHandCol,
  directShipColNumber,
  POColNumber,
  RINColNumber
) {
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    range: ID + "!A1:ZZ", // TODO: Update placeholder value.

    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: "FORMATTED_VALUE", // TODO: Update placeholder value.

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING" // TODO: Update placeholder value.
  };

  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      //getting the current line number

      var range = response.result;
      var number = range.values.length;
      if (range.values.length > 0) {
        console.log("range value length > 0");
        for (let i = range.values.length - 1; i > 1; i--) {
          //console.log("i is ", i);
          let hasValue = false;
          for (let j = 0; j < range.values[i].length; j++) {
            if (range.values[i][j] != "" && j != sumCol && j != onHandCol) {
              hasValue = true;
              console.log("sum Col ", sumCol);
              console.log("onHand ", onHandCol);
              console.log("the first value found is ", range.values[i][j]);
              break;
            }
          }

          if (hasValue) {
            break;
          } else {
            number--;
          }
        }
        console.log("line number is " + parseInt(number + 1));
        //getting the current date and push to value array.
        var valueArray = [];
        var monthArray = [];
        var dayArray = [];
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var inputColNumber = 0;
        var isFBA = false;
        //loop though each item from input
        for (var j = 0; j < infoTable[ID].inputData.length; j++) {
          monthArray.push(mm);
          dayArray.push(dd);
        }
        // push the date first
        valueArray.push(monthArray);
        valueArray.push(dayArray);
        //if it is the PO input------------------------------------------------------
        if (document.getElementById("PORadio").checked == true) {
          var tempPOArray = [];
          inputColNumber = POColNumber;
          for (var d = 0; d < infoTable[ID].inputData.length; d++) {
            tempPOArray.push(infoTable[ID].inputData[d]);
          }
          //jump to input column
          for (var e = 0; e < inputColNumber - 2; e++) {
            valueArray.push([]);
          }
          valueArray.push(tempPOArray);
          //skip all colum to FBA column
        } else if (document.getElementById("RINRadio").checked == true) {
          //If it is RIN section-------------
          //jump to RIN colum
          inputColNumber = RINColNumber;
          //jump to input column
          for (var e = 0; e < inputColNumber - 2; e++) {
            valueArray.push([]);
          }

          var tempRINArray = [];
          for (var d = 0; d < infoTable[ID].inputData.length; d++) {
            tempRINArray.push(infoTable[ID].inputData[d]);
          }
          valueArray.push(tempRINArray);
        } else if (document.getElementById("outgoingRadio").checked == true) {
          //If it is outgoing section-------------
          //jump to outgoing section

          for (var j = 0; j < directShipColNumber - 2; j++) {
            valueArray.push([]);
          }
          //initial FBA and FBM array
          var tempFBA = [];
          var tempFBM = [];

          //loop though each item id and push FBA or direct ship quantity temp FBA and FBM array.
          for (var d = 0; d < infoTable[ID].inputData.length; d++) {
            //console.log("line 537", infoTable[ID].orderID[d]);
            if (String(infoTable[ID].orderID[d]).includes("FBA")) {
              inputColNumber = FBAColNum;
              tempFBA.push(infoTable[ID].inputData[d]);
              tempFBM.push("");
              isFBA = true;
            } else {
              inputColNumber = directShipColNumber;
              tempFBM.push(infoTable[ID].inputData[d]);
              tempFBA.push("");
            }
          }
          valueArray.push(tempFBM);
          valueArray.push(tempFBA);
        }

        console.log("customerCol is" + customerCol);
        // jump to customer column--------------------------------------------
        console.log("input Col is ", inputColNumber);
        if (document.getElementById("outgoingRadio").checked == false) {
          for (var k = 0; k < customerCol - inputColNumber - 1; k++) {
            valueArray.push([]);
          }
        } else {
          if (isFBA == false) {
            for (var k = 0; k < customerCol - inputColNumber - 2; k++) {
              valueArray.push([]);
            }
          } else {
            for (var k = 0; k < customerCol - inputColNumber - 1; k++) {
              valueArray.push([]);
            }
          }
        }
        valueArray.push(infoTable[ID].buyer);
        valueArray.push(infoTable[ID].orderID);
        if (
          ID.includes("NP") ||
          ID.includes("HN") ||
          ID.includes("KS") ||
          ID.includes("SD")
        ) {
          pcData.push({
            range: ID + "!A" + parseInt(number + 1) + ":Z",
            majorDimension: "COLUMNS",
            values: valueArray
          });
          console.log("pcData" + JSON.stringify(pcData));
        } else {
          svData.push({
            range: ID + "!A" + parseInt(number + 1) + ":Z",
            majorDimension: "COLUMNS",
            values: valueArray
          });
          console.log("svData" + JSON.stringify(svData));
        }
      } else {
        console.log("no data from PC 2018");
      }
      if (
        ID.includes("NP") ||
        ID.includes("HN") ||
        ID.includes("KS") ||
        ID.includes("SD")
      ) {
        processedNP++;
        if (processedNP == totalNPNumer) {
          sendToSheet(pcSheetID, pcData);
        }
      } else {
        processedSV++;
        if (processedSV == totalSVNumber) {
          sendToSheet(svSheetID, svData);
        }
      }
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Error: " + reason.result.error.message);
    }
  );
}*/

function sendToSheet(sheetID, data) {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: sheetID // TODO: Update placeholder value.
  };

  var batchUpdateValuesRequestBody = {
    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED", // TODO: Update placeholder value.

    // The new values to apply to the spreadsheet.
    data: data // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
  };

  var request = gapi.client.sheets.spreadsheets.values.batchUpdate(
    params,
    batchUpdateValuesRequestBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      document.getElementById("sendButton").style.visibility = "visible";
      var wrapper = $("#content"),
        container;
      for (var key in data) {
        container = $('<div id="data_item" class="container"></div>');
        wrapper.append(container);
        container.append(
          '<div class="item">' + data[key].range.split(":")[0] + "</div>"
        );
      }
      appendPre("Data sent");
      appendPre(JSON.stringify(data));
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
//===========all delete functions===========================================================

function getLineNumberByOrderID(sheetID, itemID, OrderID, orderIDColNumber) {
  var orderIDColLetter = aphabetArray[orderIDColNumber];
  var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of the values to retrieve.
    range: itemID + "!" + orderIDColLetter + ":" + orderIDColLetter, // TODO: Update placeholder value.

    // How values should be represented in the output.
    // The default render option is ValueRenderOption.FORMATTED_VALUE.
    valueRenderOption: "UNFORMATTED_VALUE", // TODO: Update placeholder value.

    // How dates, times, and durations should be represented in the output.
    // This is ignored if value_render_option is
    // FORMATTED_VALUE.
    // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
    dateTimeRenderOption: "FORMATTED_STRING" // TODO: Update placeholder value.
  };
  var request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      var deleteIDLineNumber;
      console.log("delete Order ID", OrderID);
      for (var i = 0; i < response.result.values.length; i++) {
        if (response.result.values[i] == OrderID) {
          deleteIDLineNumber = i + 1;
        }
      }
      var row =
        "A" +
        deleteIDLineNumber +
        ":" +
        orderIDColLetter +
        "" +
        deleteIDLineNumber;
      var deleteRange = itemID + "!" + row;
      console.log("deleteLineNumber", deleteIDLineNumber);
      clearRow(sheetID, deleteRange);
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      appendPre("Cannot Find order ID " + OrderID + " in " + itemID);
    }
  );
}
function clearRow(sheetID, deleteRange) {
  var params = {
    // The ID of the spreadsheet to update.
    spreadsheetId: sheetID, // TODO: Update placeholder value.

    // The A1 notation of the values to clear.
    range: deleteRange // TODO: Update placeholder value.
  };

  var clearValuesRequestBody = {
    // TODO: Add desired properties to the request body.
  };

  var request = gapi.client.sheets.spreadsheets.values.clear(
    params,
    clearValuesRequestBody
  );
  request.then(
    function(response) {
      // TODO: Change code below to process the `response` object:
      console.log(response.result);
      document.getElementById("sendButton").style.visibility = "visible";
      document.getElementById("loader").style.visibility = "hidden";
      appendPre("Data deleted at: ");
      appendPre(JSON.stringify(response.result.clearedRange));
    },
    function(reason) {
      console.error("error: " + reason.result.error.message);
      document.getElementById("sendButton").style.visibility = "visible";
      document.getElementById("loader").style.visibility = "hidden";
      appendPre("error: " + reason.result.error.message);
    }
  );
}
