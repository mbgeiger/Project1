var userLong ='';
var userLat = '';
var locLong = '';
var locLat = '';
var uberPrice;
var uberTime;

$(document).ready(function()
    {
    //First portion of the user location functions. Logs that the function has started and calls the second half if the user accepts.
        console.log("getting location")
        if (navigator.geolocation) 
        {
            navigator.geolocation.getCurrentPosition(showPosition);

        } 
        else 
        { 
            console.log("Geolocation is not supported by this browser.");
        }
    });//Document.Ready Ends here

    //Second Part of Location Functions. Sets the variables for the current location of the user.
    function showPosition(position) 
    {
        var pos = position;
        userLat = pos.coords.latitude;
        userLong = pos.coords.longitude;
        console.log(userLat);
        console.log(userLong);
    }

    //Call this function and it will use the global userLat and userLong variables as well as the global locLat and locLong variables to return a JSON with uber pricing estimates
    //uberPrice[i].localized_display_name (type of uber) uberPrice[i].distance (distance of the trip) uberPrice[i].duration (duration of the trip in seconds) uberPrice[i].estimate (cost estimate String)
    var uberPriceFunc = function()
    {
        console.log("in price function");
        console.log('Lat: '+userLat + 'Long: '+userLong);
 
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log(xhttp.responseText);
            }
        };

        xhttp.open('GET', 'https://api.uber.com/v1.2/estimates/price?start_latitude='+userLat+'&start_longitude='+userLong+'&end_latitude='+locLat+'&end_longitude='+locLong,true);
        xhttp.setRequestHeader("Authorization", "Token gyxrCkq-oUEznly0dtJ9nx2kXyWpN3hJoUEnsykL");
        xhttp.send();
        uberPrice = xhttp.response;
        console.log(uberPrice);
    }//End of uberPriceFunc

    //Call this function and it will use the global userLat and userLong variables as well as the global locLat and locLong variables to return a JSON with uber pricing estimates
    //uberTime[i].localized_display_name (type of uber) uberTime[i].estimate (time estimate away from you in seconds). Maybe divide this by 60 to get minutes right off the bat.
    var uberTimeFunc = function()
    {
        console.log("in time function");
        console.log('Lat: '+userLat + 'Long: '+userLong);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        console.log(xhttp.responseText);
        }
        };
        xhttp.open('GET', 'https://api.uber.com/v1.2/estimates/time?start_latitude='+userLat+'&start_longitude='+userLong,true);
        xhttp.setRequestHeader("Authorization", "Token gyxrCkq-oUEznly0dtJ9nx2kXyWpN3hJoUEnsykL");
        xhttp.send();
        uberTime = xhttp.response;
        console.log(uberTime);
    }//End of uberTimeFunc



     // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCSAxfQpAwFsTgPDiztoxniYsq4oS7fMIk",
            authDomain: "project1-gtbootcamp.firebaseapp.com",
            databaseURL: "https://project1-gtbootcamp.firebaseio.com",
            projectId: "project1-gtbootcamp",
            storageBucket: "",
            messagingSenderId: "1082241557741"
        };
        firebase.initializeApp(config);



