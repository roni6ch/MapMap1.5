/**
 * Created by Roni on 26/06/2018.
 */
/***************** publishNewHouseController ********/
app.controller('publishNewHouseController', function($scope, $timeout, $compile, $location, $http) {
    var vm = this;
    vm.initPublishModal = function() {
        $("#publishModal").modal();
        if (localStorage.getItem('profile') !== null) {
            vm.publisherName = JSON.parse(localStorage.getItem("profile"))["ig"];
            vm.publisherEmail = JSON.parse(localStorage.getItem("profile"))["U3"];
        }
        $('.uploadFiles').imageuploadify();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 3, // Creates a dropdown of 15 years to control year,
            yearRange: '2018:2020',
            today: 'היום',
            clear: 'נקה',
            close: 'אישור',
            closeOnSelect: false // Close upon selecting a date,
        });

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
    vm.publishNewApartment = function(form) {
        if (form.$valid) {
            console.log(form);
            //TODO: AJAX send form
            /*	$http.post("...",form).then(function(data) {
             if (data.status == 200){
             console.log("SUCCSESS");
             }
             }, function (error) {
             //fail
             console.log("error in publishNewApartment: " , error);
             });*/

        }
    }

});