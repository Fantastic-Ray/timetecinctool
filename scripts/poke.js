var sku;
var brand;
var product_type;
var Manufacturer_part_num;
var memory_type;
var capacity;
var standard = "DDR3";
var speed;
var error_check = "Non-ECC";
var signal = "Unbuffered";
var voltage = "1.5V";
var CL;
var rank;
var rankNum;
var rank2;
var pin;
var PC;
var PCNum;
var DIMM;
var kit = 0;
var number;
var IC;
var description = "";
var warranty;
var compatiBrand = "";
var compatiList = "";
var appleSearchTerm = [];
var country;

function getInfo(e) {
  compatiBrand = "";
  compatiList = "";
  error_check = "Non-ECC";
  signal = "Unbuffered";
  voltage = "1.5V";
  standard = "DDR3";
  kit = 1;

  pin = "240 Pin";
  warranty = "life";
  $(".error").html("");
  var DDRGroup = document.getElementsByName("DDRGroup");

  for (var i = 0; i < DDRGroup.length; i++) {
    if (DDRGroup[i].checked) {
      standard = DDRGroup[i].value;
    }
  }

  var numGroup = document.getElementsByName("numGroup");

  for (i = 0; i < numGroup.length; i++) {
    if (numGroup[i].checked) {
      number = numGroup[i].value;
    }
  }

  var ICGroup = document.getElementsByName("ICGroup");

  for (var i = 0; i < ICGroup.length; i++) {
    if (ICGroup[i].checked) {
      IC = ICGroup[i].value;
    }
  }

  var channelGroup = document.getElementsByName("channelGroup");

  for (var i = 0; i < channelGroup.length; i++) {
    if (channelGroup[i].checked) {
      country = channelGroup[i].value;
    }
  }

  if (standard == "DDR2") {
    voltage = "1.8V";
    PC = "PC2";
  } else if (standard == "DDR4") {
    voltage = "1.2V";
    PC = "PC4";
    pin = "288 Pin";
  } else {
    PC = "PC3";
  }

  sku = $("#SKU").val();

  if (sku[0] != 7) {
    $(".error").html(
      '<p style="color:red;text-align:left;">ERROR: SKU number start with 7</p>'
    );
  } else if (sku[1] == 0 || sku[1] == 1 || sku[1] == 3) {
    switch (country) {
      case "US":
        product_type = "Server";
        break;
      case "UK":
        product_type = "Server";
        break;
      case "DE":
        product_type = "Server";
        break;
      case "ES":
        product_type = "Servidor";
        break;
      case "FR":
        product_type = "Serveur";
        break;
      case "IT":
        product_type = "Server";
        break;
    }
    if (sku[1] == 0) {
      warranty = "1year";
    }
    if (sku[1] == 3) {
      warranty = "3month";
    }
  } else if (sku[1] == 5) {
    switch (country) {
      case "US":
        product_type = "Desktop";
        break;
      case "UK":
        product_type = "Desktop";
        break;
      case "DE":
        product_type = "Desktop";
        break;
      case "ES":
        product_type = "Pc sobremesa";
        break;
      case "FR":
        product_type = "Bureau";
        break;
      case "IT":
        product_type = "Desktop";
        break;
    }

    DIMM = "UDIMM";
  } else if (sku[1] == 6) {
    switch (country) {
      case "US":
        product_type = "Laptop Notebook Computer";
        break;
      case "UK":
        product_type = "Laptop Notebook Computer";
        break;
      case "DE":
        product_type = "Laptop / Notizbuch";
        break;
      case "ES":
        product_type = "Portatil";
        break;
      case "FR":
        product_type = "Ordinateur portable";
        break;
      case "IT":
        product_type = "Computer portatile";
        break;
    }

    DIMM = "SODIMM";
  } else if (sku[1] == 8) {
    product_type = "Apple";
    DIMM = "SODIMM";
    //brand ="Apple";
  } else {
    $(".error").html(
      '<p style="color:red;text-align:left;">ERROR: Cannot find memory type</p>'
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////-->
  if (sku[2] + sku[3] == "TT") {
    brand = IC;
  } else if (sku[2] + sku[3] == "DL") {
    brand = "Dell";
  } else if (sku[2] + sku[3] == "HP") {
    brand = "HP";
  } else if (sku[2] + sku[3] == "NY") {
    brand = "Nanya";
  } else if (sku[2] + sku[3] == "SM") {
    brand = "Samsung";
  } else if (sku[2] + sku[3] == "TG") {
    brand = "Teamgroup";
  } else if (sku[2] + sku[3] == "KG") {
    brand = "Kingston";
  } else if (sku[2] + sku[3] == "HN") {
    brand = "Hynix";
  } else if (sku[2] + sku[3] == "AP") {
    brand = "Apple";
  } else {
    brand = "Unknow";
  }
  ////////////////////////////////////////////////////////////////////////////////////////////-->
  if (sku[4] + sku[5] == 80) {
    speed = 800;
    PCNum = 6400;
    CL = "CL6";
  } else if (sku[4] + sku[5] == 10) {
    speed = 1066;
    PCNum = 8500;
    CL = "CL7";
  } else if (sku[4] + sku[5] == 13) {
    speed = 1333;
    PCNum = 10600;
    CL = "CL9";
  } else if (sku[4] + sku[5] == 16) {
    speed = 1600;
    PCNum = 12800;
    CL = "CL11";
  } else if (sku[4] + sku[5] == 18) {
    speed = 1866;
    PCNum = 14900;
    CL = "CL13";
  } else if (sku[4] + sku[5] == 21) {
    speed = 2133;
    PCNum = 17000;
    CL = "CL15";
  } else if (sku[4] + sku[5] == 24) {
    speed = 2400;
    PCNum = 19200;
    CL = "CL17";
  } else if (sku[4] + sku[5] == 26) {
    speed = 2666;
    PCNum = 21300;
    CL = "CL19";
  } else if (sku[4] + sku[5] == 28) {
    speed = 2800;
    PCNum = 22400;
    CL = "CL21";
  } else if (sku[4] + sku[5] == 30) {
    speed = 3000;
    PCNum = 24000;
    CL = "CL23";
  } else if (sku[4] + sku[5] == 32) {
    speed = 3200;
    PCNum = 25600;
    CL = "CL25";
  } else {
    speed = "Unknow speed";
  }
  ////////////////////////////////////////////////////////////////////////////////////////////-->

  for (var i = 6; i < sku.length; i++) {
    if (sku[i] == "E") {
      error_check = "ECC";
      if (sku[i + 1] == "U") {
        signal = "Unbuffered";
        DIMM = "UDIMM";
      } else if (sku[i + 1] == "R") {
        signal = "Registered";
        DIMM = "RDIMM";
      }
    }
    if (sku[i] == "L") {
      voltage = "1.35V";
      standard = "DDR3L";
    }

    if (sku[i] == "-") {
      rank2 = sku[i - 1];
      if (sku[i - 3] == 1) {
        rank = "Single Rank";
        rankNum = 1;
      } else if (sku[i - 3] == 2) {
        rank = "Dual Rank";
        rankNum = 2;
      } else if (sku[i - 3] == 4) {
        rank = "Quad Rank";
        rankNum = 4;
      }

      if (sku[i + 2] == "G") {
        capacity = sku[i + 1];
      } else {
        capacity = sku[i + 1] + sku[i + 2];
      }
    }

    if (sku[i] == "K") {
      kit = sku[i + 1];
    }

    if (sku[i] == "S") {
      pin = "204 Pin";
      if (standard == "DDR4") {
        pin = "260 Pin";
      }
    }
  }

  if (kit == 1) {
    console.log(
      brand +
        " " +
        capacity +
        "GB" +
        " " +
        speed +
        "MHz" +
        " " +
        signal +
        " " +
        error_check +
        " " +
        product_type +
        " Memory Ram Module Upgrade"
    );
  } else {
    console.log(
      brand +
        " " +
        capacity * kit +
        "GB Kit (" +
        kit +
        "*" +
        capacity +
        "GB) " +
        speed +
        "MHz" +
        " " +
        signal +
        " " +
        error_check +
        " " +
        product_type +
        " Memory Ram Module Upgrade"
    );
  }
  ///////////////////////////////////////////Compatible List& bullet 4/////////////////////////////////////////////////-->

  if ($("compaListarea").val() != "") {
    var lines = $("#compaListarea")
      .val()
      .replace(/\n/g, "###")
      .replace(/\s/g, "@@")
      .split("###");
    //console.log($('#compaListarea').val().replace(/\n/g,"###").replace(/\s/g,"@@"));
    var temp;
    var tempBrand;
    var tempBrandOld = "";
    var tempOld = "";
    var temp2;
    var temp2Old = "  ";
    var appleModel = [];
    var appleCPUModel = [];
    //Get bullet 4
    var brandNum = 0;
    for (var k = 0; k < lines.length; k++) {
      tempBrand = lines[k].split("-");
      tempBrand[0] = tempBrand[0].replace(/@@/g, " ");
      //console.log("tempBrand[0]" + tempBrand[0]);

      if (tempBrand[0].toUpperCase() != tempBrandOld.toUpperCase()) {
        tempBrandOld = tempBrand[0];
        compatiBrand += tempBrand[0] + ", ";
        brandNum++;
      }
    }
    compatiBrand = compatiBrand.slice(0, -2);
    var charNum = 0;

    //get non apple description
    if (document.getElementById("appleCheckbox").checked == false) {
      var tempListLength = 0;
      for (var i = 0; i < lines.length; i++) {
        temp = lines[i].split("@@");
        tempBrand = lines[i].split("-");
        tempBrand[0] = tempBrand[0].replace(/@@/g, " ");
        //console.log(temp);
        if (tempBrand[0].toUpperCase() != tempBrandOld.toUpperCase()) {
          tempListLength = 0;
          compatiList = compatiList.slice(0, -2);
          compatiList += "/...<p>";
          console.log("temp[0] " + temp[0]);
          tempBrandOld = tempBrand[0];

          compatiList += "<b>" + tempBrand[0] + "</b> - ";
          tempListLength += temp[0].length + 10;
        }
        if (tempListLength < 1800 / brandNum) {
          console.log("1800/brandNum = " + 1800 / brandNum);
          for (var j = 1; j < temp.length; j++) {
            //console.log("tempListLength = "+  tempListLength);
            if (temp[j] != "" || temp[j] != "-") {
              if (i > 0) {
                temp2Old = lines[i - 1].split("@@");
                if (temp[j] != temp2Old[j]) {
                  compatiList += temp[j] + " ";
                  tempListLength += temp[j].length + 1;
                }
              } else {
                if (temp[j] != "-") {
                  compatiList += temp[j] + " ";
                  tempListLength += temp[j].length + 1;
                }
              }
            }
          }
          compatiList = compatiList.slice(0, -1);
          compatiList += "/ ";
          tempListLength += 2;
        }
        //compatiList+="/...";

        //tempListLength = compatiList.length;

        //////if(compatiList.length<= 1900){
      }
      compatiList = compatiList.slice(0, -1);
      compatiList += "...";
    } else {
      // **************if apple description is checked
      lines = $("#compaListarea")
        .val()
        .split("\n");
      console.log(lines);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].includes("Mac") == false && lines[i] != "s") {
          console.log(lines[i]);
          temp = lines[i].split("(");
          if (temp[0].includes(".")) {
            compatiList += temp[0];
            if (temp[1] != null) {
              appleSearchTerm.push(temp[1].split(")")[0]);
            }
          }
          if (temp[1] != null) {
            temp2 = temp[1].split(/\s/);
            compatiList += "(" + temp2[1] + ")<br>";
          } else {
            compatiList = compatiList.slice(0, -1);
            compatiList += "<br>";
          }
        } else {
          compatiList += "<br><br><b>" + lines[i] + "</b><br>";
        }
      }
    }
  }
  console.log("brandNum: " + brandNum);
  console.log("compatiList " + compatiList);

  displayInfo();
  displaySepc();
  return false;
}

function displayInfo() {
  //--------------------Title-------------------------------------------------------------------
  var title;
  var RAMTranslate;
  var ModuleTranslate;
  var ForTranstlate;
  var packageTranslate;
  var mustTranslate;
  switch (country) {
    case "US":
      RAMTranslate = "Memory RAM";
      ModuleTranslate = "Module Size: ";
      ForTranstlate = "For ";
      packageTranslate = "Package: ";
      mustTranslate = "must";
      break;
    case "UK":
      RAMTranslate = "Memory RAM";
      ModuleTranslate = "Module Size: ";
      ForTranstlate = "For ";
      packageTranslate = "Package: ";
      mustTranslate = "must";
      break;
    case "DE":
      RAMTranslate = "Arbeitsspeicher";
      ModuleTranslate = "Modulgröße: ";
      ForTranstlate = "Für ";
      packageTranslate = "Paket: ";
      mustTranslate = "sollen";
      break;
    case "ES":
      RAMTranslate = "Memoria principal";
      ModuleTranslate = "Tamaño del módulo: ";
      ForTranstlate = "Para ";
      packageTranslate = "Paquete: ";

      mustTranslate = "tener que";
      break;
    case "FR":
      RAMTranslate = "Mémoire RAM";
      ModuleTranslate = "Taille du paquet: ";
      ForTranstlate = "Pour ";
      packageTranslate = "Paquet: ";
      mustTranslate = "doit";
      break;
    case "IT":
      RAMTranslate = "Memorie";
      ModuleTranslate = "Dimensione del modulo: ";
      ForTranstlate = "Per ";
      packageTranslate = "Pacchetto: ";
      mustTranslate = "mosto";
      break;
  }

  if (kit == 1) {
    title =
      "Timetec " +
      brand +
      " " +
      capacity +
      "GB " +
      standard +
      " " +
      speed +
      "MHz" +
      " " +
      PC +
      "-" +
      PCNum +
      " " +
      signal +
      " " +
      error_check +
      " " +
      voltage +
      " " +
      CL +
      " " +
      rankNum +
      "Rx" +
      rank2 +
      " " +
      rank +
      " " +
      pin +
      " " +
      DIMM +
      " " +
      product_type +
      " " +
      RAMTranslate +
      " Module Upgrade " +
      "(" +
      capacity +
      "GB)";
  } else {
    title =
      "Timetec " +
      brand +
      " " +
      capacity * kit +
      "GB Kit (" +
      kit +
      "x" +
      capacity +
      "GB) " +
      standard +
      " " +
      speed +
      "MHz " +
      PC +
      "-" +
      PCNum +
      " " +
      signal +
      " " +
      error_check +
      " " +
      voltage +
      " " +
      CL +
      " " +
      rankNum +
      "Rx" +
      rank2 +
      " " +
      rank +
      " " +
      pin +
      " " +
      DIMM +
      " " +
      product_type +
      " " +
      RAMTranslate +
      " Module Upgrade (" +
      capacity * kit +
      "GB Kit (" +
      kit +
      "x" +
      capacity +
      "GB))";
  }

  $("#titleDiv").html("<b>Title:</b><br><br>" + title + "<br><br>");

  //--------------------Bullet Point-------------------------------------------------------------------
  var bullet1 =
    standard +
    " • " +
    speed +
    "MHz • " +
    PC +
    "-" +
    PCNum +
    " • " +
    pin +
    " • " +
    signal +
    " • " +
    error_check +
    " • " +
    voltage +
    " • " +
    CL +
    " • " +
    rank +
    " • " +
    rankNum +
    "Rx" +
    rank2 +
    " based" +
    " • " +
    number +
    "x" +
    rank2;
  var bullet2;
  if (voltage == "1.5V") {
    bullet2 = "JEDEC standard 1.5V (1.425V ~1.575V) Power Supply";
  } else if (voltage == "1.35V") {
    bullet2 =
      "JEDEC standard 1.35V (1.28V ~ 1.45V) and 1.5V (1.425V ~ 1.575V) Power Supply • This is a dual voltage piece and can operate at 1.35V or 1.5V";
  } else if (voltage == "1.2V") {
    bullet2 =
      "Power Supply: VDD=1.2V (1.14V to 1.26V) • VDDQ = 1.2V (1.14V to 1.26V)";
  }

  var bullet3 =
    ModuleTranslate +
    capacity +
    "GB • " +
    packageTranslate +
    kit +
    "x" +
    capacity +
    "GB ";
  console.log("product_type: " + product_type);

  if (
    product_type == "Server" ||
    product_type == "Servidor" ||
    product_type == "Serveur"
  ) {
    bullet3 +=
      " • A " +
      mustTranslate +
      " " +
      ForTranstlate +
      product_type +
      ", Not " +
      ForTranstlate +
      getTranslated(country, "Desktop") +
      "/" +
      getTranslated(country, "Laptop");
  } else if (
    product_type == "Desktop" ||
    product_type == "Pc sobremesa" ||
    product_type == "Bureau"
  ) {
    console.log("in Desktop");
    bullet3 +=
      " • " +
      ForTranstlate +
      getTranslated(country, "Desktop") +
      ",  Not " +
      ForTranstlate +
      getTranslated(country, "Laptop");
  } else if (
    product_type == "Laptop Notebook Computer" ||
    product_type == "Laptop / Notizbuch" ||
    product_type == "Portatil" ||
    product_type == "Ordinateur portable" ||
    product_type == "Computer portatile"
  ) {
    console.log("in Laptop");
    bullet3 +=
      " • " +
      ForTranstlate +
      getTranslated(country, "Laptop") +
      ",  Not " +
      ForTranstlate +
      getTranslated(country, "Desktop");
  } else if (product_type == "Apple") {
    bullet3 += " • " + ForTranstlate + "Apple iMac/ Mac mini/ Macbook Pro only";
  }

  var bullet4 = ForTranstlate + "Selected " + compatiBrand;
  var bullet5;

  switch (country) {
    case "US":
      if (warranty == "1year") {
        bullet5 =
          "Guaranteed – 1 year warranty from Purchase Date • Free technical support (support@timetecinc.com) • MON - FRI 9AM-6PM PST";
      } else if (warranty == "3month") {
        bullet5 =
          "Guaranteed – 3 months warranty from Purchase Date • Free technical support (support@timetecinc.com) • MON - FRI 9AM-6PM PST";
      } else {
        bullet5 =
          "Guaranteed – Lifetime warranty from Purchase Date • Free technical support (support@timetecinc.com) • MON - FRI 9AM-6PM PST";
      }
      break;
    case "UK":
      bullet5 = "Guaranteed – Life Time warranty from Purchase Date";
      break;
    case "DE":
      bullet5 = "Garantiert - Lifetime Garantie ab Kaufdatum";
      break;
    case "ES":
      bullet5 = "Garantizado - Garantía de por vida desde la fecha de compra";
      break;
    case "FR":
      bullet5 = "Garanti - Garantie à vie à partir de la date d'achat";
      break;
    case "IT":
      bullet5 = "Garantita - Garanzia a vita dalla data di acquisto";
      break;
  }

  $("#bulletDiv").html(
    "<b>Bullet Points:</b><p>" +
      bullet1 +
      "<p>" +
      bullet2 +
      "<p>" +
      bullet3 +
      "<p>" +
      bullet4 +
      "<p>" +
      bullet5 +
      "<p>"
  );

  //--------------------Description-------------------------------------------------------------------

  //if(document.getElementById("appleCheckbox").checked == false){
  switch (country) {
    case "US":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Please click image for more compatible systems model<p>" +
        compatiList +
        "<p><b>Need to know if this part is compatible?</b><br>Contact us with manufacturer and model information of your motherboard";
      break;
    case "UK":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Please click image for more compatible systems model<p>" +
        compatiList +
        "<p><b>Need to know if this part is compatible?</b><br>Contact us with manufacturer and model information of your motherboard";
      break;
    case "DE":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Bitte klicken Sie auf das Bild für kompatibleres Systemmodell<p>" +
        compatiList +
        "<p><b>Muss wissen, ob dieser Teil kompatibel ist?</b><br>Kontaktieren Sie uns mit Hersteller- und Modellinformationen Ihres Motherboards";
      break;
    case "ES":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Haga clic en la imagen para ver un modelo de sistema más compatible<p>" +
        compatiList +
        "<p><b>Vous devez savoir si cette partie est compatible?</b><br>Contactez-nous avec l'information du fabricant et du modèle de votre carte mère";
      break;
    case "FR":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Cliquez sur l'image pour un modèle de système plus compatible<p>" +
        compatiList +
        "<p><b>¿Necesita saber si esta parte es compatible?</b><br>Contáctenos con información del fabricante y del modelo de su placa base";
      break;
    case "IT":
      description =
        "<b>Timetec® – Memory of a lifetime</b><p><b>Compatible with (But not Limited to):</b><br>*Clicca sull'immagine per un modello di sistema più compatibile<p>" +
        compatiList +
        "<p><b>Hai bisogno di sapere se questa parte è compatibile?</b><br>Contattaci con il produttore e le informazioni di modello della tua scheda madre";
      break;
  }

  $("#descripDiv").html(
    "<b>Description:</b><br><br>" +
      description +
      "<br><br><b style='color: red;'>HTML Format</b><br><br>"
  );

  $("#descripTextDiv").text(description);
  $("#searchTermDiv").html(
    "<br><b style='color: red;'>Search Term</b><br><br>" +
      appleSearchTerm.join()
  );
}
//}
function displaySepc() {
  $("#productType-input").val(product_type);
  $("#cas-input").val(CL);
  $("#DIMM-input").val(DIMM);
  $("#error-input").val(error_check);
  $("#signal-input").val(signal);
  $("#voltage-input").val(voltage);
  $("#pin-input").val(pin);
}
function modifyInfo() {
  product_type = $("#productType-input").val();
  CL = $("#cas-input").val();
  DIMM = $("#DIMM-input").val();
  error_check = $("#error-input").val();
  signal = $("#signal-input").val();
  voltage = $("#voltage-input").val();
  pin = $("#pin-input").val();
  displayInfo();
  return false;
}
function getTranslated(countries, PCModel) {
  switch (countries) {
    case "US":
      console.log("US" + PCModel);
      return PCModel;
      break;

    case "UK":
      console.log(PCModel);
      return PCModel;

      break;
    case "DE":
      if (PCModel == "Server") {
        return "Server";
      }
      if (PCModel == "Desktop") {
        return "Desktop";
      }
      if (PCModel == "Laptop") {
        return "Laptop / Notizbuch";
      }

      break;
    case "ES":
      if (PCModel == "Server") {
        return "Servidor";
      }
      if (PCModel == "Desktop") {
        return "Pc sobremesa";
      }
      if (PCModel == "Laptop") {
        return "Portatil";
      }

      break;
    case "FR":
      if (PCModel == "Server") {
        return "Serveur";
      }
      if (PCModel == "Desktop") {
        return "Bureau";
      }
      if (PCModel == "Laptop") {
        return "Ordinateur Portable";
      }

      break;

    case "IT":
      if (PCModel == "Server") {
        return "Server";
      }
      if (PCModel == "Desktop") {
        // console.log(PCModel);
        return "Desktop";
      }
      if (PCModel == "Laptop") {
        console.log(PCModel);
        return "Computer Portatile";
      }

      break;
  }
  //console.log(PCModel);
}
