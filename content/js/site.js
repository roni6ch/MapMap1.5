var app = angular.module('mapmapApp', ["ngRoute", "ui.materialize", "rzModule", "directive.g+signin", "vsGoogleAutocomplete"]);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider
			/*.when('/', {
				templateUrl: 'content/pages/main.html',
				controller: 'indexController',
				controllerAs: 'vm',
			})*/
			//.when('/searchZone', {
			.when('/', {
				templateUrl: 'content/pages/searchZone.html',
				controller: 'searchZoneController',
				controllerAs: 'vm',
			})
			.when('/publishNewHouse', {
				templateUrl: 'content/pages/publishNewHouseModal.html',
				controller: 'publishNewHouseController',
				controllerAs: 'vm',
			})
			.when('/tableView', {
				templateUrl: 'content/pages/tableView.html',
				controller: 'searchZoneController',
				controllerAs: 'vm',
			})
			.otherwise({
				redirectTo: '/'
			});

});
app.run(function($rootScope, $compile) {
	angular.element('.loginBT').show();
	$(".button-collapse").sideNav({
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true, // Choose whether you can drag to open on touch screens,
		onOpen: function(el) {
			if (localStorage.getItem('profile') !== null) {
				$('#mobile-hamburger .name').text(JSON.parse(localStorage.getItem("profile"))["ig"]);
				$('#mobile-hamburger .email').text(JSON.parse(localStorage.getItem("profile"))["U3"]);
				angular.element(".mobileNavOptions").show();
			}
		},
		onClose: function(el) {

		},
	});
	//init image of profile user if connected
	if (localStorage.getItem('profile') !== null) {
		$('.userProfile img').attr("src", JSON.parse(localStorage.getItem("profile"))["Paa"]);
		//$('#mobile-hamburger .mobileProfileImg').attr("src", JSON.parse(localStorage.getItem("profile"))["Paa"]);
		$('.userProfile').show();
		$('.loginBT').hide();
		angular.element("#publishNewHome").show();
	}
	//init auto complete
	$rootScope.autoCompleteOptions = {
		componentRestrictions: {
			country: 'IL'
		}
	}
	$rootScope.$on('event:google-plus-signin-success', function(event, googleUser) {
		var profile = googleUser.getBasicProfile();
		console.log("+ googleUser id_token: " + googleUser.getAuthResponse().id_token);
		var userProfile = {
			"account": "google",
			"google_user_id": googleUser.getAuthResponse().id_token,
			"name": profile.getName(),
			"email": profile.getEmail(),
			"image_url": profile.getImageUrl(),
		}
		/*	$.ajax({
		 url : 'https://mapmapserver.herokuapp.com/addUser',
		 dataType : "json",
		 type : 'POST',
		 contentType: "application/json; charset=utf-8",
		 data : JSON.stringify(userProfile),
		 success : function(result) {
		 console.log(result); // result is an object which is created from the returned JSON
		 },
		 });*/

		localStorage.setItem('profile', JSON.stringify(profile));
		$('.userProfile img').attr("src", profile.getImageUrl());
		$('.userProfile').show();
		$('.loginBT').hide();
		angular.element("#publishNewHome").show();

		//show mobile hamburger
		angular.element(".mobileNavDetails").show();
		$('#mobile-hamburger .name').text(JSON.parse(localStorage.getItem("profile"))["ig"]);
		$('#mobile-hamburger .email').text(JSON.parse(localStorage.getItem("profile"))["U3"]);
		angular.element(".mobileNavOptions").show();


	});
	$rootScope.$on('event:google-plus-signin-failure', function(event, authResult) {
		// Auth failure or signout detected
		console.log("event:google-plus-signin-failure : ", authResult);
	});

	$rootScope.page = null;


});
/***************** indexController ***************/
app.controller('indexController', function($scope, $timeout, $compile, $location, $http, $rootScope) {
	var vm = this;
	vm.init = function() {
		angular.element("#rentButton").hide();
		angular.element("#buyButton").hide();
		$rootScope.page = null;
	}
	vm.search = function() {
		var location = $(".mapsAutoComplete").val();
		//rent or buy
		vm.selectRentOrBuy = angular.element(".selectRentOrBuy ul .active span").text();
		vm.form = {
			"location": location,
			"selectRentOrBuy": vm.selectRentOrBuy
		}
		localStorage.setItem("firstData", JSON.stringify(vm.form));
		if (location !== null && location !== "")
			$location.path('/searchZone');

		/*
		 //apartment type
		 vm.apartmentType =  [];
		 $(".roomType .dropdown-content .active span").each(function() {
		 vm.apartmentType.push($(this).text());
		 });
		 if (vm.apartmentType.length == 0){
		 vm.apartmentType.push("הכל");
		 }
		 //room numbers
		 vm.roomNum =  [];
		 $(".roomNum .dropdown-content .active span").each(function() {
		 vm.roomNum.push($(this).text());
		 });
		 vm.roomNum.sort();
		 if (vm.roomNum.length == 0){
		 vm.roomNum.push("1");
		 }
		 //range
		 vm.range = [];
		 vm.range[0] = vm.slider.minValue;
		 vm.range[1] = vm.slider.maxValue;

		 */
	}
	vm.signOut = function() {
		signOut();
	}

});




/*GOOGLE SIGN-IN*/
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function() {
		console.log('User signed out.');
		$('.userProfile').hide();
		$('.userProfile').popover("hide");
		$('.loginBT').show();
		$("#publishNewHome").hide();
		localStorage.removeItem("profile");

		//mobile hamburger
		$(".mobileNavOptions").hide();
		$(".mobileNavDetails").hide();
	});

}