/**
 * Created by Roni on 26/06/2018.
 */
/***************** searchZoneController ********/
app.controller('searchZoneController', function($http, $scope, $compile, $timeout, $compile, $rootScope) {

    var vm = this,infowindow = null, markerIsOpen = null;;
    var parsedData, map, firstData, markers = [];
    vm.rzslider = [2000, 5000];
    vm.searchResults = null;




    vm.init = function() {
        var location = "תל אביב יפו, ישראל";
        if (localStorage.getItem("location") !== null) {
            location = JSON.parse(localStorage.getItem("location")).location;
        }
        vm.form = {
            "location": location,
            "selectRentOrBuy":  $(".selectRentOrBuy.active").text()
        }
        localStorage.setItem("location", JSON.stringify(vm.form));

        if ($(".tableViewWrapper").length > 0) {
            //im in table view
            $rootScope.page = 'table';
            $(".wrapper > .ng-scope").addClass("tableScope");
        } else {
            //im in map view
            $rootScope.page = 'map';
        }
        //todo - change it from images to ascii - amp problem
        vm.coin = 'ils'; //ils coin

        $('.filtersSideModalBT').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) {
                $('.filtersSideModal').css('opacity','1');
                $('.filtersSideModal').css('z-index','1');

                var currTrans = $(".searchZoneCards").css('transform').split(/[()]/)[1];
                var posx = Number(currTrans.split(',')[4].trim());
                if (posx == 0) //other nav is open - close it
                    $(".searchZoneNavCards").trigger("click");
            }, // A function to be called when sideNav is opened
            onClose: function(el) {
            }, // A function to be called when sideNav is closed
        });

        $('.searchZoneNavCards').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) {
                var currTrans = $(".filtersSideModal").css('transform').split(/[()]/)[1];
                var posx = Number(currTrans.split(',')[4].trim());
                if (posx == 0) //other nav is open - close it
                    $(".filters").trigger("click");
            }, // A function to be called when sideNav is opened
            onClose: function(el) {
            }, // A function to be called when sideNav is closed
        });
//mobile
        $('.mobileFilter').sideNav({
            menuWidth: 300, // Default is 300
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: true, // Choose whether you can drag to open on touch screens,
            onOpen: function(el) {
                $('.filtersSideModal').css('opacity','1');
                $('.filtersSideModal').css('z-index','13');
            }, // A function to be called when sideNav is opened
            onClose: function(el) {
            }, // A function to be called when sideNav is closed
        });

        angular.element("#rentButton").show();
        angular.element("#buyButton").show();

        //check if data exist in local storage
        if (localStorage.getItem("slider") !== null) {
            var slider = JSON.parse(localStorage.getItem("slider"));
            vm.rzslider[0] = slider[0];
            vm.rzslider[1] = slider[1];
            localStorage.setItem("slider", JSON.stringify(vm.rzslider));
        }
        //check if rent or buy for topNav results

        location = JSON.parse(localStorage.getItem("location"));
        $(".topNav li a").each(function() {
            if ($(this).text().trim() == location["selectRentOrBuy"])
                $(this).css("color", "#42A5F5");
            return;
        });

        vm.initModals();

        $(".mobileNavOptions > .searchZoneFilterBT").click(function() {
            var currTrans = $("#slide-in-filters").css('transform').split(/[()]/)[1];
            var posx = Number(currTrans.split(',')[4].trim());
            if (posx !== 0) //filter is close
            {
                //then open filter and close nav
                $("[data-activates='mobile-hamburger']").click();
            }
        })

        $(".closeModal").click(function(){
            $("[data-activates='slide-in-filters']").sideNav('hide');
        })


    }
    vm.isMobile = function(){

        var isMobile = false; //check if it is mobile
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }
        return isMobile;
    }
    vm.highlightCity = function(){
        var newarkcoords = [{ Longitude: "-74.2116099599969", Latitude: "40.696749000004" }, { Longitude: "-74.211095879996" , Latitude: "41.696749000004"}, { Longitude: "-74.2116099599969", Latitude: "40.696749000004"}];

        var NewarkHighlight;
        var mNewarkCoords = new Array;
        var latlng = new google.maps.LatLng(40.734184, -74.172679);
        var myOptions = {
            zoom: 13,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), myOptions);

        for (var i = 0; i < newarkcoords.length; i++) {
            mNewarkCoords[i] = new google.maps.LatLng(newarkcoords[i].Latitude, newarkcoords[i].Longitude);
        }
        // Construct the polygon
        // Note that we don't specify an array or arrays, but instead just
        // a simple array of LatLngs in the paths property
        NewarkHighlight = new google.maps.Polygon({
            paths: mNewarkCoords,
            strokeColor: "#6666FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#6666FF",
            fillOpacity: 0.35
        });
        NewarkHighlight.setMap(map);


    }
    vm.initModals = function() {
        //init advencedFilter modal
        angular.element('#advancedFilter').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '0%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                angular.element(".modal-overlay").addClass("advancedFilterOverlay");
            },
            complete: function() {
                //  console.log("close modal");
            } // Callback for Modal close
        });
        //init apartment modal
        angular.element('#apartmentModal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                $("#apartmentModal").appendTo("body");
                $('.carousel.carousel-slider').carousel({
                    fullWidth: true
                });

            },
            complete: function() {
                // console.log("close modal");
                $('.carousel.carousel-slider').carousel('destroy');
            } // Callback for Modal close
        });
    }
    vm.initGoogleMap = function() {
        var myMarker, geocoder, infowindow, myLatLng;

        if ($('#map')[0] != undefined && typeof google === 'object' && typeof google.maps === 'object') {



            geocoder = new google.maps.Geocoder();
            //init address typed
            var location = JSON.parse(localStorage.getItem("location"))["location"];
            var addressTyped = location != "" ? location : "תל אביב יפו, ישראל";
            vm.newAddress = addressTyped;
            //convert address typed to long,lat
            geocoder.geocode({
                'address': addressTyped
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = parseFloat(results[0].geometry.location.lat());
                    var longitude = parseFloat(results[0].geometry.location.lng());
                    myLatLng = {
                        lat: latitude,
                        lng: longitude
                    };

                    map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 14,
                        center: myLatLng
                    });


                    //event that check the map loaded succsesfully on the dom!
                    google.maps.event.addListener(map, 'tilesloaded', function() {

                        vm.form = {
                            myLatLng: myLatLng,
                            bounds: map.getBounds()
                        }
                        vm.initContent();

                        google.maps.event.clearListeners(map, 'tilesloaded');



                        $timeout(function() {
                            //remove map type
                            if (vm.isMobile){
                                $(".gm-style-mtc").parent().hide();
                            }
                        });


                    });
                }

                if (map) {
                    //drag map end - return new json with houses nearby
                    map.addListener('dragstart', function() {
                        vm.clearMarkers();
                    });
                    //drag map end - return new json with houses nearby
                    map.addListener('dragend', function() {
                        vm.refreshAddress();
                    });


                    //DRAW TOOLS
                    if (!vm.isMobile) {
                        var drawingManager = new google.maps.drawing.DrawingManager({
                            drawingMode: null,
                            drawingControl: true,
                            drawingControlOptions: {
                                position: google.maps.ControlPosition.TOP_CENTER,
                                drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
                            },
                            markerOptions: {
                                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                            },
                            circleOptions: {
                                fillColor: '#42a5f573',
                                fillOpacity: 1,
                                strokeWeight: 1,
                                clickable: true,
                                draggable: true,
                                editable: false,
                                zIndex: 1
                            },
                            rectangleOptions: {
                                strokeColor: '#000',
                                strokeWeight: 1,
                                fillColor: '#42a5f573',
                                fillOpacity: 0.6,
                                editable: true,
                                draggable: true
                            }
                        });

                        drawingManager.setMap(map);

                        //TODO: SEND TOMER LAT LNGS AND HE WILL SEND ME APRTMENTS

                        //flag
                        var flags = 0;
                        var originJson = {};
                        var destJson = {};
                        var middleWaypointsArr = [];

                        var shapes = [];
                        //start drawing
                        google.maps.event.addListener(drawingManager, "drawingmode_changed", function() {
                            if (drawingManager.getDrawingMode() != null) {
                                for (var i = 0; i < shapes.length; i++) {
                                    shapes[i].setMap(null);
                                }
                                shapes = [];
                            }
                        })
                        // Add a listener for creating new shape event.
                        google.maps.event.addListener(drawingManager, "overlaycomplete", function(event) {
                            var newShape = event.overlay;
                            newShape.type = event.type;
                            shapes.push(newShape);
                            if (drawingManager.getDrawingMode() && drawingManager.getDrawingMode() !== 'marker') {
                                drawingManager.setDrawingMode(null);
                            }

                        });


                        google.maps.event.addListener(drawingManager, 'markercomplete', function(flag) {
                            var lat = flag.getPosition().lat();
                            var lng = flag.getPosition().lng();
                            //  console.log(lat, ", ", lng);
                            flags++;

                            //first flag
                            if (flags == 1)
                                originJson = {
                                    lat: flag.getPosition().lat(),
                                    lng: flag.getPosition().lng()
                                };
                            //second flag
                            if (flags == 2)
                                destJson = {
                                    lat: flag.getPosition().lat(),
                                    lng: flag.getPosition().lng()
                                };

                            //more then 2 flags
                            /*	if (flags > 2)
                             middleWaypointsArr.push({
                             lat: flag.getPosition().lat(),
                             lng:  flag.getPosition().lng()
                             })
                             */
                            if (flags > 1) {
                                plotRoute(originJson, destJson);
                                flags = 0;
                            }

                        });
                        //circle
                        google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
                            var radius = circle.getRadius();
                            console.log(radius);
                        });
                        //polygon
                        google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
                            var polygons = [];
                            polygons.push(polygon);
                            var polylinePath = polygon.getPath();
                            console.log("polylines : " + polylinePath.getArray());
                        });
                        //polyline
                        google.maps.event.addListener(drawingManager, 'polylinecomplete', function(polyline) {
                            var polylines = [];
                            polylines.push(polyline);
                            var polylinePath = polyline.getPath();
                            console.log("polylines : " + polylinePath.getArray());

                        });
                        //rectangle
                        google.maps.event.addListener(drawingManager, 'rectanglecomplete', function(rectangle) {
                            var bounds = rectangle.getBounds();
                            console.log(bounds);
                        });


                    }



                    //CREATES A ROUT
                    function plotRoute(origin, dest) {
                        //in order to add middle way points, open the comments and add member to func
                        /*var items = middleWaypoints;
                         var waypoints = [];
                         for (var i = 0; i < items.length; i++) {
                         var address = items[i];
                         if (address !== "") {
                         waypoints.push({
                         location: address,
                         stopover: true
                         });
                         }
                         }
                         */

                        //set the starting address and destination address
                        var originAddress = origin;
                        var destinationAddress = dest;

                        //build directions request
                        var request = {
                            origin: originAddress,
                            destination: destinationAddress,
                            //	waypoints: waypoints, //an array of waypoints
                            optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        };
                        var directionsService = new google.maps.DirectionsService();
                        var renderOptions = {
                            draggable: true
                        };
                        var directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

                        //set the directions display service to the map
                        directionDisplay.setMap(map);
                        //set the directions display panel
                        //panel is usually just and empty div.
                        //This is where the turn by turn directions appear.
                        //directionDisplay.setPanel(directionsPanel);



                        //get the route from the directions service
                        directionsService.route(request, function(response, status) {
                            if (status == google.maps.DirectionsStatus.OK) {

                                directionDisplay.setDirections(response);
                                computeTotalDistance(directionDisplay.directions);
                            } else {
                                //handle error
                            }
                        });




                        function computeTotalDistance(result) {
                            var total = 0;
                            var myroute = result.routes[0];
                            for (i = 0; i < myroute.legs.length; i++) {
                                total += myroute.legs[i].distance.value;
                            }
                            total = total / 1000.
                            document.getElementById("total").innerHTML = total + " km";
                        }




                    }
                }
            });

        }
    }
    vm.getLocation = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(vm.showPosition);
        } else {
            print("Browser doesn't support geolocation");
        }
    }
    vm.showPosition = function(position) {
        var dest_lat = position.coords.latitude;
        var dest_long = position.coords.longitude;
        map.setCenter(new google.maps.LatLng(dest_lat,dest_long));
        var icon = {
            url: "content/images/icons/current.png",
            scaledSize: new google.maps.Size(30, 30), // scaled size
        };
        var marker = new google.maps.Marker({
            position: {lat:dest_lat , lng:dest_long},
            icon: icon,
            map: map
        });

    }
    vm.initContent = function() {
        //AJAX GET RESULTS
        $http.post('content/results.json', vm.form).then(function(data) {
            if (data.status == 200) {
                localStorage.setItem("data", JSON.stringify(data.data));

                parsedData = data.data;
                console.log(parsedData);
                vm.searchResults = parsedData;
                vm.resultsLength = vm.searchResults.results.length;
                vm.searchResults.roomNum = ["1", "2", "3", "4", "5"];
                vm.searchResults.apartmentType = "הכל";
                vm.orderBy = 'apartment.price';
                if ($rootScope.page == 'map') {
                    vm.refreshAddress();
                }
            }
        }, function(error) {
            //fail
            console.log("error results.json: ", error);
        });
    }
    vm.clearMarkers = function() {
        //init all markers before add the new one's
        $.each(markers, function(i) {
            markers[i].setMap(null);
        });

    }
    vm.refreshAddress = function() {
        vm.clearMarkers();
        var results = JSON.parse(localStorage.getItem("data"))["results"];
        var addressArrLatLng = $.map(results, function(resObj) {
            if (vm.checkResults(resObj)) {
                return resObj.apartment.latlng;
            }
        });

        if ($rootScope.page == 'map') {
            if (infowindow !== null) {
                // Close the info window
                infowindow.close();
            }
            infowindow = new google.maps.InfoWindow;

            vm.resultsLength = addressArrLatLng.length;
            markers = [];
            $.each(addressArrLatLng, function(index, latLng) {
                //check if the address is in the bounds of the map
                if (map.getBounds().contains(latLng)) {
                    var icon = {
                        url: "content/images/icons/icon.png",
                        scaledSize: new google.maps.Size(30, 30), // scaled size
                    };
                    var marker = new google.maps.Marker({
                        position: latLng,
                        icon: icon,
                        map: map
                    });
                    var apartmentObj;
                    marker.addListener('click', function() {

                        //get the obj for info window
                        var resultContent = _.filter(results, function(res) {
                            apartmentObj = res.apartment;
                            return _.some(res.apartment, latLng);
                        });

                        var heart = "heart";
                        if (resultContent[0].favorite == true) {
                            heart = "heart-full";
                        }

                        var apartment = resultContent[0].apartment;
                        var resultID = resultContent[0].id;
                        var image;
                        if (resultContent[0].images.length > 0)
                            image = resultContent[0].images[0];

                        var content = "<div class='markerWrapper' ng-click='vm.openApartmentModal(" + resultID + ")'>" +
                            "<div class='markerImgWrapper'>" +
                            "<p>" + apartment.price + " <img src='content/images/icons/price.png' /></p>" +
                            "<img class='markerImg'  />" + "<div id='streetImg' style='width: 200px; height: 150px;'></div>" +
                            "<img src='content/images/icons/" + heart + ".png' class='markerHeart' ng-click='vm.favorite(" + resultID + ",$event)'>" +
                            "</div>" +
                            "<div class='markerDetails'>" +
                            "<p>" + apartment.apartmentType + "</p><p>" + apartment.location + "</p>" +
                            "<p>" +
                            "<span>" + apartment.rooms + " <img src='content/images/icons/rooms.png' /></span>" +
                            "<span>" + apartment.floor + " <img src='content/images/icons/floor.png' /></span>" +
                            "<span>" + apartment.parking + " <img src='content/images/icons/parking.png' /></span>" +
                            "</p>" +
                            "<p>" +
                            "<span>" + apartment.entrence_date + " <img src='content/images/icons/entrence_date.png' /></span>" +
                            "</p>" +
                            "</div>" +
                            "</div>";



                        infowindow.setContent($compile(content)($scope)[0]);
                        infowindow.open(map, marker);


                        var lat = marker.position.lat();
                        var lng = marker.position.lng();

                        if (resultContent[0].images.length == 0) {
                            $(".markerImg").attr('src', 'content/images/no_image.jpg');
                            $(".markerImg").show();
                            $("#streetImg").hide();
                        } else {
                            $(".markerImg").attr('src', image);
                            $(".markerImg").show();
                            $("#streetImg").hide();
                        }


                    });
                    markers.push(marker);
                }
            });
        }
    }
    vm.goToMarker = function(result) {
        var latLng = result.apartment.latlng;
        map.setCenter({
            lat: latLng.lat,
            lng: latLng.lng
        });
        var found = false;

        _.find(markers, function(res, i) {
            if (res.getPosition().lat() == latLng.lat && res.getPosition().lng() == latLng.lng && found == false) {
                vm.refreshAddress();
                new google.maps.event.trigger(res, 'click');
                markerIsOpen = res;
                found = true;
            }
        });
        vm.refreshAddress();

    }
    vm.openApartmentModal = function(id) {

        _.find(vm.searchResults.results, function(res, i) {
            if (res.id == id) {
                vm.apartment = res;

                //https://analytics.google.com/analytics/web/#/report/content-event-events/a112419434w167614820p167825946/_u.date00=20180701&_u.date01=20180701/
                ga('send', 'event', 'apartments', 'open' ,id);
                //console.log(res);
                $timeout(function() {
                    angular.element('.owl-carousel').owlCarousel({
                        margin: 10,
                        loop: true,
                        autoWidth: true
                    })
                });


                var lat = vm.apartment.apartment.latlng.lat;
                var lng = vm.apartment.apartment.latlng.lng;

                if (vm.apartment.images.length == 0) {
                    //console.log(lat);
                    // console.log(lng);

                    var latLng = {
                        lat: lat,
                        lng: lng
                    };
                    //todo: WHERE TO LOOK STREET VIEW https://stackoverflow.com/questions/16443241/google-maps-api-streetview-panoramaoptions-point-of-view-setting-from-lon-lat
                    //var whereToLookLatLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

                    var streetViewService = new google.maps.StreetViewService();
                    var radius = 100;
                    streetViewService.getPanoramaByLocation(latLng, radius, function(data, status) {
                        if (status == google.maps.StreetViewStatus.OK) {
                            var nearStreetViewLocation = data.location.latLng;
                            lat = nearStreetViewLocation.lat();
                            lng = nearStreetViewLocation.lng();
                            latLng = {
                                lat: lat,
                                lng: lng
                            };


                            //get google street image
                            var panoramaOptions = {
                                position: latLng,
                                pov: {
                                    heading: 165,
                                    pitch: 0
                                },
                                visible: true,
                                zoom: 1
                            };

                            var panorama = new google.maps.StreetViewPanorama(document.getElementById('modalImage'), panoramaOptions);
                            map.setStreetView(panorama);

                        } else {
                            // console.log('a');
                        }
                    });
                } else {
                    var panorama = map.getStreetView();
                    panorama.setVisible(false);
                }
                $('#apartmentModal').modal('open');
            }
        });
        //share button
        var url = window.location.href;
        $('.fb-share-button').attr('data-href', 'http://roni.pe.hu/mapmap')
    }
    vm.saveNote = function(id) {
        $("textarea#notes").html(vm.note);
        //todo: ajax to tomer with note
        //console.log("save note to: " + id +" with: "+ vm.note);
    }
    vm.shareFacebook = function(apartment) {
        //works only live
        var url = window.location.href;
        //TODO: CHANGE URL TO ID
        FB.ui({
            method: 'share_open_graph',
            action_type: 'og.shares',
            action_properties: JSON.stringify({
                object: {
                    'og:url': url,
                    'og:title': 'MapMap - ' + apartment.apartment.location,
                    'og:description': apartment.apartment.apartmentType + " כניסה: " + apartment.apartment.entrence_date + " מידע נוסף: " + apartment.apartment.info,
                    'og:image': apartment.images[0]
                }
            })
        })
    }
    vm.advancedFilter = [{
        name: "חניה",
        filterName: "parking",
        filter: false
    },
        {
            name: "מעלית",
            filterName: "elevator",
            filter: false
        },
        {
            name: "מרפסת",
            filterName: "balcony",
            filter: false
        },
        {
            name: "ממ''ד",
            filterName: "mamad",
            filter: false
        },
        {
            name: "מזגן",
            filterName: "air_conditioner",
            filter: false
        },
        {
            name: "תמ''א",
            filterName: "tama",
            filter: false
        },
        {
            name: "משופץ",
            filterName: "reconditioned",
            filter: false
        },
        {
            name: "סורגים",
            filterName: "bars",
            filter: false
        },
        {
            name: "יחידת הורים",
            filterName: "master_room",
            filter: false
        },
        {
            name: "מחסן",
            filterName: "storage",
            filter: false
        },
        {
            name: "חדר כושר",
            filterName: "gym",
            filter: false
        },
        {
            name: "ריהוט",
            filterName: "furniture",
            filter: false
        },
        {
            name: "בע''ח",
            filterName: "pets",
            filter: false
        },
        {
            name: "שותפים",
            filterName: "roomates",
            filter: false
        },
        {
            name: "כניסה מיידית",
            filterName: "immediate_entrance",
            filter: false
        },
        {
            name: "תמונות",
            filterName: "apartment_image",
            filter: false
        },
    ]
    vm.changeFilter = function(i) {
        vm.advancedFilter[i].filter = !vm.advancedFilter[i].filter;
        vm.refreshAddress();
    }
    vm.favorite = function(result, e) {
        //find favorite by result id and save it on screen and localhost
        _.find(vm.searchResults.results, function(res, i) {
            if (res.id == result.id || res.id == result) {
                var fav = vm.searchResults.results[i].favorite;
                vm.searchResults.results[i].favorite = !fav;
                localStorage.setItem("data", JSON.stringify(vm.searchResults));

                if ($(".markerHeart").is(":visible")) {
                    if ($(".markerHeart").attr("src") == "content/images/icons/heart.png") {
                        $(".markerHeart").attr("src", "content/images/icons/heart-full.png");
                    } else {
                        $(".markerHeart").attr("src", "content/images/icons/heart.png");
                    }
                }

                //TODO: SEND AJAX WITH NEW FAV ICON ACCORDING TO ID
                return;
            }
        })
        e.stopPropagation();

    }
    vm.favFilterImg = false;
    vm.filterFavorites = function() {
        if ($(".lovedApartments > button").hasClass('active')) {
            $(".lovedApartments > button").removeClass('active');
        } else {
            $(".lovedApartments > button").addClass('active');
        }
        var index = 0;
        var favArr = [];
        if (!vm.favFilterImg) {
            _.find(vm.searchResults.results, function(res, i) {
                if (res.favorite)
                    favArr[index++] = res;
            });
            vm.searchResults.results = favArr;
            vm.favFilterImg = true;
        } else {
            //show all apartments
            var results = JSON.parse(localStorage.getItem("data"))["results"];
            _.find(results, function(res, i) {
                favArr[index++] = res;
            });

            vm.searchResults.results = favArr;
            vm.favFilterImg = false;
        }
        vm.refreshAddress();
    }
    vm.checkResults = function(result) {
        //check result price
        var returnValue = false;
        if (result.apartment.price >= vm.rzslider[0] && result.apartment.price <= vm.rzslider[1])
        //check room num
            if ($.inArray(result.apartment.rooms.toString(), vm.searchResults.roomNum) > -1) {
                //check property type
                if (vm.searchResults.apartmentType == "הכל" || $.inArray(result.apartment.apartmentType, vm.searchResults.apartmentType) > -1) {

                    //check andvancedFilter
                    var advancedFilter = _.filter(vm.advancedFilter, function(value) {
                        return value.filter == true;
                    });
                    if (advancedFilter.length > 0) {
                        $.each(advancedFilter, function(i, value) {
                            if (result.apartment[value.filterName] == true || result.apartment[value.filterName] > 0) {
                                returnValue = true;
                            } else {
                                returnValue = false;
                                return false;
                            }
                        });
                    } else if ($(".lovedApartments > button").hasClass('active') && result.favorite) {
                        returnValue = true;
                    } else if (!$(".lovedApartments > button").hasClass('active')) {
                        returnValue = true;
                    }
                }
            }
        return returnValue;
    }
    vm.changeRoomNum = function() {
        var roomNum = [];
        $(".roomNum .dropdown-content .active span").each(function() {
            roomNum.push($(this).text());
        });
        $scope.$apply(function() {
            vm.searchResults.roomNum = roomNum;
            $(".roomNum .select-dropdown").val(roomNum);
            vm.refreshAddress();
        });
    }
    vm.changeApartmentType = function(roomTypeLength) {
        var apartmentType = [];
        //check if all selected
        if ($(".roomType .dropdown-content li:first-child").hasClass("active") && roomTypeLength == 4) {
            $(".roomType .dropdown-content li span").each(function() {
                apartmentType.push($(this).text());
            });
        } else if ($(".roomType .dropdown-content li:first-child").hasClass("active") && roomTypeLength == 0) {
            apartmentType = [];
        } else {
            $(".roomType .dropdown-content .active span").each(function() {
                apartmentType.push($(this).text());
            });
        }
        $scope.$apply(function() {
            vm.searchResults.apartmentType = apartmentType;
            vm.refreshAddress();
        });
    }
    vm.changeSliderListener = function() {
        vm.rzslider[0] = vm.slider.minValue;
        vm.rzslider[1] = vm.slider.maxValue;
        localStorage.setItem("slider", JSON.stringify(vm.rzslider));
        vm.refreshAddress();
    }
    vm.print = function() {
        $("#hiddenPrint").html($(".apartmentModal .modal-content").html());
        window.print();
    }
    vm.printTable = function() {
        $("#hiddenPrint").html($(".tableView").html());
        window.print();
    }
    vm.sendMail = function(apartmentDetails) {
        // console.log(apartmentDetails);
        //send AJAX with mail content head and body
        var mail = {
            title: "הודעה חדשה מ  MAPMAP",
            content: "שלום ברצוני לבוא לראות את הדירה",
            emailTo: "Roni6ch@gmail.com",
            emailCC: "Roni691986@gmail.com",
            info: "רוני , טלפון 032434 ..."
        }
        window.open("mailto:"+mail.emailTo+'?cc='+mail.emailCC+'&subject='+mail.title+'&body='+mail.content, '_self');



    }
    vm.sendWhatsapp = function(number) {
        var mail = {
            title: "הודעה חדשה מ-MAPMAP: ",
            content: "שלום ברצוני לבוא לראות את הדירה",
            info: "רוני, טלפון: 0502560005 , תודה!"
        }
        window.open("https://api.whatsapp.com/send?phone=" + (number) + "&text=" + mail.title + " " + mail.content + " " + mail.info);

    }
    vm.openWaze = function(apartmentDetails){
        // console.log(apartmentDetails);
        window.open('http://waze.to/?ll=' + apartmentDetails.apartment.latlng.lat + ',' + apartmentDetails.apartment.latlng.lng + '&navigate=yes');
    }
    vm.calendar = function(apartment) {
        var calendar = {
            title: "MAPMAP - פגישה לדירה",
            info: apartment.apartment.info,
            location: apartment.apartment.location,
            owner: apartment.email
        }

        window.open("http://www.google.com/calendar/event?action=TEMPLATE&sprop=website:www.mapmap.co.il&text=" + calendar.title + "&location=" + calendar.location + "&details=" + calendar.info + "&add=" + calendar.owner, "MsgWindow", "width=800,height=800");
        return false;
    }
    vm.signOut = function() {
        signOut();
        window.location = "#";
    }
    vm.initTableViewPage = function() {
        $(".sk-cube-grid").show();
        $('.tableView tbody').hide();
        $timeout(function() {
            var table = $('.tableView').DataTable({
                language: {
                    "url": "content/js/dataTableHebrew.json"
                },
                order: [
                    [5, "desc"]
                ],
                destroy: true,
                bInfo: false,
                responsive: true,
                bLengthChange: false,
            });

            $('.tableView tbody').on('mouseenter', 'td', function() {
                if (table.cell(this).length > 0) {
                    var colIdx = table.cell(this).index().column;
                    $(table.cells().nodes()).removeClass('highlight');
                    $(table.column(colIdx).nodes()).addClass('highlight');
                }
            });

            $('.tableView tbody').show();
            $(".sk-cube-grid").hide();
        }, 1500);
    }
    vm.searchNewAddress = function() {
        //todo: get new data from user new location input and update
        if (localStorage.getItem("location")) {
            var location = JSON.parse(localStorage.getItem("location"));
            $timeout(function() {
                //added timeout to get the geo input after blur
                location["location"] = $(".mapsAutoComplete").val();
                localStorage.setItem("location", JSON.stringify(location));
                if ($rootScope.page == 'map') {
                    vm.initGoogleMap();
                }
                if ($rootScope.page == 'table') {

                    $scope.$apply(function() {
                        vm.searchResults.results = [];
                        vm.initTableViewPage();
                    });
                    vm.initContent();
                }


            });
        }
    }
    vm.addSiteToFav = function(title, href){
        if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
            window.sidebar.addPanel(title,href,'');
        } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
            window.external.AddFavorite(href,title);
        } else if(window.opera && window.print) { // Opera Hotlist
            this.title=title;
            return true;
        } else { // webkit - safari/chrome
            alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
        }
    }
});

