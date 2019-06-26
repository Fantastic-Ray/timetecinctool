var name, email, photoUrl, uid;

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user logged in ");
      console.log(user);

      name = user.displayName;
      email = user.email;

      uid = user.uid;

      console.log("name: " + name);
      console.log("email: " + email);
      initialNavBar();
      // window.location = 'data.html';
    } else {
      // No user is signed in.
      console.log("not logged in inNav");
      window.location = "index.html";
    }
  });

  $("#navBar .navbar-nav .nav-item").click(function(e) {
    console.log("clicked nav");
    $(this).addClass("active");
  });
});

function initialNavBar() {
  console.log("user email", email);
  document.getElementById("navBar").innerHTML =
    "<nav id ='mainNav' class='navbar navbar-light fixed-top navbar-expand-lg bg-light p-0 shadow'style='background-color:white !important;'>" +
    "<a class='navbar-brand' href='data.html'>" +
    " <img src='image/ICON.png' width='30' height='30' class='d-inline-block align-top' alt=''>" +
    " Timetec Inc</a>" +
    "<button class='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavDropdown' aria-controls='navbarNavDropdown' aria-expanded='false' aria-label='Toggle navigation'>" +
    " <span class='navbar-toggler-icon'></span>" +
    "</button>" +
    " <div class='collapse navbar-collapse' id='navbarNavDropdown'>" +
    "<ul class='navbar-nav mr-auto' id='navBtnGroup'>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='dashboard.html'>Dashboard</a>" +
    "</li>" +
    "<li id='unshippedNav' class='nav-item' active>" +
    "<a class='nav-link' href='Unshipped.html'>Unshipped Order</a>" +
    "</li>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='data.html'>Memory Data</a>" +
    "</li>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='listing.html'>Listing</a>" +
    "</li>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='saleRate.html'>Sales</a>" +
    "</li>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='inventoryIO.html'>Inventory Recording</a>" +
    "</li>" +
    "<li class='nav-item'>" +
    "<a class='nav-link' href='inventoryReports.html'>Inventory Report</a>" +
    "</li>" +
    " <li class='nav-item dropdown'>" +
    "<a class='nav-link dropdown-toggle' href='#' id='navbarDropdownMenuLink' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'  >FBA</a>" +
    "<div class='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>" +
    "<a class='dropdown-item' href='FBAPlan.html'>FBA Shipping Plan</a>" +
    "<a class='dropdown-item' href='fba.html'>FBA Shipping Slip</a>" +
    "</div>" +
    "</li></ul>" +
    "<ul class='navbar-nav ml-auto'><li class='nav-item dropdown' style='left: auto !important;right: 0px;'>" +
    "<a class='nav-link dropdown-toggle' href='#' id='navbarDropdownMenuLink' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'  >" +
    email +
    "</a>" +
    "<div class='dropdown-menu' aria-labelledby='navbarDropdownMenuLink'>" +
    "<a class='dropdown-item' href='#'onclick='logout()'>Logout</a>" +
    "</div>" +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</nav>";
}
function logout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
      window.location = "index.html";
    })
    .catch(function(error) {
      // An error happened.
    });
}
