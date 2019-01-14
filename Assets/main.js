var userLong ='';
var userLat = '';
var locLong = '';
var locLat = '';
var uberPrice;
var uberTime;
var locationArray;
var searched = "";

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


     //Ajax call to the yelp API
     $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=by-chloe&location=boston",
        headers: {
         'Authorization':'Bearer g0n8An81KiDzyrjHvJ6N5WNNdAArz-dQEBFLVjN12OI-HO5ov33zXYgt8kupJLcR7AdjAT2Vj5-bZ0XGXx-wdwooYoy1YhSpovrMF3KiVMHIsQu_hwmzzodNXQ46XHYx',
     },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            // Grab the results from the API JSON return
            locationArray = data;
        }

        });

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCSAxfQpAwFsTgPDiztoxniYsq4oS7fMIk",
            authDomain: "project1-gtbootcamp.firebaseapp.com",
            databaseURL: "https://project1-gtbootcamp.firebaseio.com",
            projectId: "project1-gtbootcamp",
            storageBucket: "project1-gtbootcamp.appspot.com",
            messagingSenderId: "1082241557741"
        };
        firebase.initializeApp(config);

    //Adding database variable to provide easy calls to the db
        var database = firebase.database()

         // store searched data to firebase
    $("#search").on("click", function(event) {
        event.preventDefault();
  
        // Grabbed values from text-boxes
       searched = $("#search-input").val().trim();
        
  
        // Code for "Setting values in the database"
        database.ref().set({
          searched: searched,
          
        });

        // Firebase watcher .on("child_added"
    database.ref().on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
  
        // Console.logging the last user's data
        console.log(sv.searched);

    });

});

});//Document.Ready Ends here
         
         
         
         
         
        
     

