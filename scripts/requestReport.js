var requestReportID;
function requestAReport(market, reportType) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("requestAReport", this.responseText);
      requestReportID = this.responseText;
      sleep(2000).then(() => {
        return getReadyReportRequestList(market, reportType);
      });
    }
  };

  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/RequestReportAllMarkets.php?requestInfo=" +
      market +
      "/" +
      reportType,
    true
  );
  xmlhttp.send();
}

function getReadyReportRequestList(market, reportType) {
  var DBreportType = getDBReportType(reportType);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText.includes("DONE")) {
        reportID = this.responseText.split("!")[1].replace(/[^\d.]/g, "");
        console.log("DONE", this.responseText);
        let currentTime = getCurrentTime();
        firebase
          .database()
          .ref("Report/" + market + DBreportType)
          .update({
            ReportID: reportID,
            ReportDate: currentTime
          });
        //getReadyReport(reportID, market);
      } else if (this.responseText.includes("CANCELLED")) {
        console.log("in not done", this.responseText);
        firebase
          .database()
          .ref("Report/" + market + DBreportType)
          .once("value")
          .then(function(snapshot) {
            reportID = snapshot.val().ReportID;
            //getReadyReport(reportID, market);
          });
      } else {
        console.log("start to sleep");
        sleep(8000).then(() => {
          getReadyReportRequestList(market, reportType);
          console.log("end sleeping");
        });
      }
    }
  };
  xmlhttp.open(
    "GET",
    "MarketplaceWebService/Samples/GetReportRequestListAllMarket.php?requestInfo=" +
      requestReportID +
      "/" +
      market +
      "/" +
      reportType,
    true
  );
  xmlhttp.send();
}
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};
function getReadyReport(reportID, country) {
  console.log("ReportID " + reportID);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = this.responseText;
      return result;
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
function getDBReportType(reportType) {
  var DBreportType;
  switch (reportType) {
    case "_GET_FBA_MYI_UNSUPPRESSED_INVENTORY_DATA_":
      DBreportType = "Report";
      break;
    case "_GET_RESTOCK_INVENTORY_RECOMMENDATIONS_REPORT_":
      DBreportType = "RSReport";
      break;
    default:
      DBreportType = "OtherReport";
  }
  return DBreportType;
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
