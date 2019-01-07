var priceList;
var PnSDataList = [];
var priceListArray = [];
var PnSDataListArray = [];
var PnSItemTable = [];
var typeItemsTable = [];
var PnSDataTable = [];
window.onload = function() {
  var caSalesDataRef = firebase.database().ref("Sales/CA");
  caSalesDataRef.on("value", function(snapshot) {
    var allData = snapshot.val();

    var dates = Object.keys(snapshot.val());
    var index = dates.indexOf("0");
    if (index > -1) {
      dates.splice(index, 1);
    }
    var salesQTY = [];
    var typeSaleTable = [];
    typeItemsTable = [];
    PnSDataTable = [];
    var lastUpdateDate =
      dates[dates.length - 1].substring(0, 2) +
      "/" +
      dates[dates.length - 1].substring(2, 4) +
      "/" +
      dates[dates.length - 1].substring(4, 8);
    document.getElementById("Top").innerHTML = "Last Update: " + lastUpdateDate;
    for (var child in allData) {
      console.log("Child" + child);
      //console.log(allData[child]);
      if (child != "0") {
        var sum = 0;
        for (var child2 in allData[child]) {
          // get sales qty data
          sum += allData[child][child2].QTY;
          // get item type data
          var type = getItemType(child2);
          if (typeSaleTable[type]) {
            typeSaleTable[type] += allData[child][child2].QTY;
            if (typeItemsTable[type].includes(child2) == false) {
              typeItemsTable[type].push(child2);
              //console.log("typeItemsTable pushed " + type+ " " +child2 );
            }
          } else {
            typeSaleTable[type] = 0;
            typeSaleTable[type] += allData[child][child2].QTY;
            typeItemsTable[type] = [];
            typeItemsTable[type].push(child2);
            //console.log("typeItemsTable pushed first Time " + type+ " " +child2 );
          }
          // get price and sales data
          //console.log("sku: " + child2);
          //console.log("sku - price  " + allData[child][child2].Price + " qty " +allData[child][child2].QTY);

          if (PnSDataTable[child2]) {
            if (PnSDataTable[child2][allData[child][child2].Price]) {
              PnSDataTable[child2][allData[child][child2].Price].push(
                allData[child][child2].QTY
              );
            } else {
              PnSDataTable[child2][allData[child][child2].Price] = [];
              PnSDataTable[child2][allData[child][child2].Price].push(
                allData[child][child2].QTY
              );
            }
          } else {
            PnSDataTable[child2] = [];
            PnSDataTable[child2][allData[child][child2].Price] = [
              allData[child][child2].QTY
            ];
          }
        }
        salesQTY.push(sum);
      }
    }
    console.log(typeSaleTable);

    console.log(salesQTY);
    console.log(PnSDataTable);
    console.log("typeItemsTable " + typeItemsTable["Apple SODIMM DDR3"]);
    //add options to select
    var options = "";
    for (var t = 0; t < Object.keys(typeSaleTable).length; t++) {
      options +=
        "<option value='" +
        Object.keys(typeSaleTable)[t] +
        "'>" +
        Object.keys(typeSaleTable)[t] +
        "</option>";
    }
    document.getElementById("typeSelect").innerHTML = options;
    // draw line chart
    var ctx = document.getElementById("myChart");
    var myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            data: salesQTY,
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#007bff",
            borderWidth: 3,
            pointBackgroundColor: "#007bff"
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: "Units ordered Sales"
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false
              }
            }
          ]
        },
        legend: {
          display: false
        }
      }
    });
    //draw pie chart
    var pieData = [];
    for (var i in typeSaleTable) {
      console.log("i is " + i);
      pieData.push(typeSaleTable[i]);
    }
    var ctx2 = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx2, {
      type: "pie",
      data: {
        datasets: [
          {
            data: pieData,
            backgroundColor: [
              "#8b008b",
              "#1e90ff",
              "#b22222",
              "#fffaf0",
              "#ffd700",
              "#ff8c00",
              "#8fbc8f"
            ]
          }
        ],
        labels: Object.keys(typeSaleTable)
      }
    });
  });
};
function drawAllPnS() {
  $("#myCanvasDiv").empty();
  PnSItemTable = [];
  var selectedType = document.getElementById("typeSelect").value;
  for (var k in typeItemsTable[selectedType]) {
    var sku = typeItemsTable[selectedType][k];
    console.log("type SKU " + sku);
    priceList = Object.keys(PnSDataTable[sku]);
    PnSDataList = [];
    for (var p = 0; p < priceList.length; p++) {
      var sum = 0;
      for (var s = 0; s < PnSDataTable[sku][priceList[p]].length; s++) {
        sum += PnSDataTable[sku][priceList[p]][s];
      }
      var average = sum / PnSDataTable[sku][priceList[p]].length;
      PnSDataList.push(average);
    }
    //getPCCost();
    //priceListArray.push(priceList);
    //PnSDataListArray.push(PnSDataList);
    PnSItemTable[sku] = { PriceList: priceList, AveSales: PnSDataList };
  }

  var counter = 0;
  for (var sku in PnSItemTable) {
    $("#myCanvasDiv").append(
      "<div class='col'>" +
        "<canvas class='my-4 w-100' id='" +
        sku +
        "Canvas' width='900' height='380'></canvas>" +
        "</div>"
    );
    counter++;
    if (counter % 2 == 0) {
      $("#myCanvasDiv").append("<div class='w-100'></div>");
    }
  }
  getPCCost();
}
function drawPnSTable(id, priceList, salesList, profitData) {
  //
  var ctx = document.getElementById(id);
  var myPnSChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: priceList,
      datasets: [
        {
          label: "Daily Average Sales",
          data: salesList,
          lineTension: 0,
          backgroundColor: "transparent",
          borderColor: "#007bff",
          borderWidth: 3,
          pointBackgroundColor: "#007bff",
          yAxesID: "y-axis-1"
        },
        {
          label: "Daily Average Profit",
          borderColor: "#ffd700",
          backgroundColor: "#ffd700",
          fill: false,
          data: profitData,
          yAxisID: "y-axis-2"
        }
      ]
    },
    options: {
      responsive: true,
      hoverMode: "index",
      stacked: false,
      title: {
        display: true,
        text: id
      },
      scales: {
        yAxes: [
          {
            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: "left",
            id: "y-axis-1",
            ticks: {
              beginAtZero: false
            }
          },
          {
            type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: "right",
            id: "y-axis-2",

            // grid line settings
            gridLines: {
              drawOnChartArea: false // only want the grid lines for one axis to show up
            }
          }
        ]
      },
      legend: {
        //display: false,
      }
    }
  });
}
function getItemType(item) {
  var type = "";
  if (item.includes("AP")) {
    type += "Apple ";
  }
  if (item.substring(0, 1) == "3") {
    type += "SSD";
  } else if (item.substring(0, 2) == "75") {
    type += "DIMM";
  } else if (item.substring(0, 2) == "76" || item.substring(0, 2) == "78") {
    type += "SODIMM";
  } else {
    type = "Other";
  }
  if (type != "SSD") {
    if (parseInt(item.substring(4, 6)) <= 20) {
      type += " DDR3";
    } else {
      type += " DDR4";
    }
  }
  return type;
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
  } else {
    console.log("logged out");
    gapi.auth2.getAuthInstance().signIn();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
var costList = [];
function getPCCost() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1r4vvca5PZtGQG53r8AkGrW34gAwsCo2r4KJTEbEDdBs",
      range: "Master!A3:F"
    })
    .then(
      function(response) {
        var range = response.result;
        if (range.values.length > 0) {
          for (i = 0; i < range.values.length; i++) {
            var row = range.values[i];
            // Print columns A and E, which correspond to indices 0 and 4.
            costList[row[3]] = row[5];
          }
          for (var sku in PnSItemTable) {
            //var sku = sku.split('K')[0];
            var costSKU = sku.split("K")[0];
            var profitList = [];
            for (var i = 0; i < PnSItemTable[sku].AveSales.length; i++) {
              console.log(sku);
              console.log(
                "Price " + parseFloat(PnSItemTable[sku].PriceList[i])
              );
              console.log(
                "cost " + parseFloat(costList[costSKU].substring(1)) * 1.3
              );
              console.log("Ave Sales " + Number(PnSItemTable[sku].AveSales[i]));
              profitList.push(
                (parseFloat(PnSItemTable[sku].PriceList[i]) -
                  parseFloat(costList[costSKU].substring(1)) * 1.3) *
                  PnSItemTable[sku].AveSales[i]
              );
            }
            console.log("profitList " + profitList);
            drawPnSTable(
              sku + "Canvas",
              PnSItemTable[sku].PriceList,
              PnSItemTable[sku].AveSales,
              profitList
            );
          }
        } else {
          console.log("no data from PC 2018");
        }
      },
      function(response) {
        //appendPre('Error: ' + response.result.error.message);
      }
    );
}
function uploadData() {
  var fileInput = document.getElementById("dataFile");
  var dateInputTemp = document.getElementById("dateInput").value;
  var dateInput =
    dateInputTemp.split("-")[1] +
    dateInputTemp.split("-")[2] +
    dateInputTemp.split("-")[0];

  var database = firebase.database().ref("Sales/CA/0");
  database.once("value").then(function(snapshot) {
    var itemTable = snapshot.val();

    console.log("date value is" + dateInput);
    var csvFile = fileInput.files[0];
    var fr = new FileReader();
    fr.onload = function() {
      var dailyData = {};
      var itemData = {};
      var text = fr.result;

      var lines = text.split("\n");

      //=========Start decode file===========================================================
      for (var i = 1; i < lines.length - 1; i++) {
        var line = lines[i].split('",');
        //console.log("lines" + lines[i]);
        var sku = line[3].split('"')[1];
        sku = sku.split(".")[0];
        var qty = parseInt(line[9].split('"')[1]);
        var price =
          parseFloat(line[11].split("$")[1].replace(/,/g, "")) / Number(qty);
        console.log("line " + sku);
        console.log("qty " + qty);
        console.log("Sales " + line[11].split("$")[1]);
        console.log("Price " + price.toFixed(2));
        if (dailyData[sku]) {
          dailyData[sku].QTY = dailyData[sku].QTY + qty;
        } else {
          dailyData[sku] = { Price: price.toFixed(2), QTY: qty };
        }
      }

      for (var element in itemTable) {
        if (!dailyData[element]) {
          console.log("element in itemTable not in dailyData " + element);
          dailyData[element] = { Price: itemTable[element].Price, QTY: 0 };
        }
      }
      console.log("dailyData " + JSON.stringify(dailyData));
      if (dailyData) {
        firebase
          .database()
          .ref("Sales/CA/" + dateInput)
          .set(dailyData);

        firebase
          .database()
          .ref("Sales/CA")
          .update({
            0: dailyData
          });

        console.log("Daily date not empty");
      }
    };

    fr.readAsText(csvFile);
  });
  return false;
}
