var userLong ='';
var userLat = '';
var uberPrice;
var uberTime;
var locationArray = [];
var searched = "";
var nanobar;

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
     window.uberPriceFunc = function(lat, long)
    {
        console.log("in price function");
        console.log('Lat: '+userLat + 'Long: '+userLong);
 
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            uberPrice = xhttp.responseText;
            }
        };

        xhttp.open('GET', 'https://api.uber.com/v1.2/estimates/price?start_latitude='+userLat+'&start_longitude='+userLong+'&end_latitude='+lat+'&end_longitude='+long,true);
        xhttp.setRequestHeader("Authorization", "Token gyxrCkq-oUEznly0dtJ9nx2kXyWpN3hJoUEnsykL");
        xhttp.send();
    }//End of uberPriceFunc

    //Call this function and it will use the global userLat and userLong variables as well as the global locLat and locLong variables to return a JSON with uber pricing estimates
    //uberTime[i].localized_display_name (type of uber) uberTime[i].estimate (time estimate away from you in seconds). Maybe divide this by 60 to get minutes right off the bat.
     window.uberTimeFunc = function()
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
     var yelpCall = function(search)
     {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term="+search+"&latitude="+userLat+"&longitude="+userLong,
            headers: {
            'Authorization':'Bearer g0n8An81KiDzyrjHvJ6N5WNNdAArz-dQEBFLVjN12OI-HO5ov33zXYgt8kupJLcR7AdjAT2Vj5-bZ0XGXx-wdwooYoy1YhSpovrMF3KiVMHIsQu_hwmzzodNXQ46XHYx',
        },
            method: 'GET',
            dataType: 'json',
            success: function(data){
                // Grab the results from the API JSON return
                locationArray = data;
                console.log("Done With Yelp");
            }

            })
    };
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
    $("#locations").empty();
    $(this).prop('disabled',true);
    event.preventDefault();
     

    var progress = 0;
    nanobar = new Nanobar('bar','row',$("#locations"));
    nanobar.go(0);
    var loadBar = setInterval(function(){
        nanobar.go(progress)
        progress += 1;
        if(progress >= 100) clearInterval(loadBar);

    },20)
 

      
        // Grabbed values from text-boxes
       searched = $("#search-input").val().trim();
       if (searched == "")
       {
           alert("please enter what you are looking");
       }
       else{
        
  
        // Code for "Setting values in the database"
        database.ref().push({
          searched: searched,
          
        });
        apiLoop(); 
        $("#last-searched").empty()
    }
    });
 

        // Firebase watcher .on("child_added"

    database.ref().limitToLast(5).on("child_added", function(snapshot) {
            // storing the snapshot.val() in a variable for convenience
            var sv = snapshot.val();
    
            // Console.logging the last user's data
            console.log(sv.searched);
                  // Change the HTML to reflect
                  $("#last-searched").text(snapshot.val().searched);
             
        });
      
        

var apiLoop = function()
         {
             
              console.log("In the button function");
             var searchQuery = $("#search-input").val();
             yelpCall(searchQuery);
            setTimeout(function(){
                loop(0)
                nanobar.go(0);
            },2050);

            
            var loop = function(i)   
            {
                $("#search").prop('disabled',false);
                setTimeout(function()
                {   
                    try
                    {
                        locLat = locationArray.businesses[i].coordinates.latitude;
                        locLong = locationArray.businesses[i].coordinates.longitude;
                        var businessName = locationArray.businesses[i].name;
                        var rating = locationArray.businesses[i].rating;
                        var website = locationArray.businesses[i].url;
                        var imageUrl = locationArray.businesses[i].image_url;
                        var distance = ((locationArray.businesses[i].distance)*.000621371).toFixed(2);
                        var card = $("<div class='card mx-auto' style='width: 18rem;'>")
                        var image = $("<image class='card-img-top' style='height:280px; width:280px;'>")
                            image.attr('src',imageUrl);
                            card.append(image);
                        var body = $("<div class='card-body'>");
                        body.append($("<h5 class='card-title'>"+businessName+"</h5>"));
                        var list = $("<ul class='list-group list-group-flush' id='"+i+"'</ul>");
                        list.append($("<li class='list-group-item'>Rating: "+rating+"</li>"));
                        list.append($("<li class='list-group-item'>Only "+distance+" miles away!</li>"));
                        card.append(body);
                        var body2 = $("<div class='card-body'>");
                        body2.append($("<a href='"+website+"'>Location Website</a>"));
                        var button = ($("<button class='uberButton btn btn-primary' type='button'>Check Uber Stats!</button>"))
                        button.attr("long",locLong);
                        button.attr("lat",locLat);
                        button.attr("num",i);
                        body2.append(button);   
                        card.append(list);
                        card.append(body2);
                        $("#locations").append(card);

                        if(i<4)
                        {
                            loop(i+1);
                        }
                    }
                    catch(error)
                    {
                        $("#locations").append("<h1>That's Our Bad! Please Try Again</h1>");
                    }
                 
                },0);
              
            }

          }

  




});//Document.Ready Ends here

$(document).on("click", ".uberButton", function(){

    $(".uberButton").prop('disabled',true);

    uberPriceFunc($(this).attr('lat'),$(this).attr('long'));
    setTimeout(function(){
        setters()
    },3000);

    var listNum = $(this).attr('num');
    console.log(listNum);
    console.log($("#"+listNum));
    

    var setters = function()
    {   
        console.log(uberPrice);
        var newData2=JSON.parse(uberPrice).prices;
        var uberPriceEst = newData2[1].estimate;
        var uberName = newData2[1].display_name;
        var uberDuration = (newData2[1].duration)/60;
        console.log(uberPriceEst+" "+uberName+" "+uberDuration+" "+listNum);
        $("#"+listNum).append($("<li class='list-group-item'><p>Type: "+uberName+".</p><p> Price: "+uberPriceEst+".</p> <p> Estimated Uber Duration: "+uberDuration+" Mins.</p></li>"));
        $(".uberButton").prop('disabled',false);
        
    }

  });

  