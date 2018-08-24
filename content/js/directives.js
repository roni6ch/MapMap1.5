/**
 * Created by Roni on 04/01/2018.
 */
app.directive('roomType', function() {
    return {
        restrict: 'AE',
        replace: true,
        template: function(scope, element, attrs) {

            return '<div class="input-field  roomType"> <select multiple id="roomType" ng-model="vm.roomType"><option value="all" selected>הכל</option><option value="apartment">דירה</option><option value="unit">יחידת דיור</option> <option value="GardenApartment">דירת גן</option><option value="studio">סטודיו</option></select><label>סוג נכס</label></div>';
        },
        link: function(scope, element, attrs) {
            var roomTypeLength = 4;
            var activeAll = true;
            $(element).find('select').material_select();

            //init all to be checked
            $(element).find("ul li").each(function(index) {
                $(this).addClass("active");
                $(this).find("input[type=checkbox]").prop("checked", "checked");
            });
            //click on all
            $(element).find("ul li").first().click(function(){
                roomTypeLength = 0;
                //fist it make the li with active and then it check if it have class active
                if ($(this).hasClass("active")){
                    roomTypeLength = 4;
                    $(".roomType .select-wrapper input").val("הכל");
                    activeAll = true;
                }
                else{
                    //click again on all - remove all
                    $(".roomType .select-wrapper input").val("בחר נכס");
                    activeAll = false;
                }
                //check all other li's
                $(element).find("ul li:not(:first-child)").each(function(index) {
                    if (activeAll)
                        $(this).addClass("active");
                    else
                        $(this).removeClass("active");
                    $(this).find("input[type=checkbox]").prop("checked", $(element).find("ul li").first().find("input[type=checkbox]").prop("checked"));
                });

                scope.vm.changeApartmentType(roomTypeLength);
            });
            //click on other li's
            $(element).find("ul li:not(:first)").click(function() {
                roomTypeLength = $( ".roomType  ul li.active" ).length;
                if (activeAll) {
                    roomTypeLength -= 1;
                    activeAll = false;
                    $(element).find("ul li").first().removeClass("active");
                    $(element).find("ul li input[type=checkbox]").first().prop("checked", "");
                }
                else{
                    //check if it is all that has been clicked
                    if (roomTypeLength == 4){
                        activeAll = true;
                        $(element).find("ul li").first().addClass("active");
                        $(element).find("ul li input[type=checkbox]").first().prop("checked", "checked");
                    }
                }
                //check if some li's has been clicked
                if (roomTypeLength > 1 && roomTypeLength < 4 ){
                    $(".roomType .select-wrapper input").val(roomTypeLength + " אפשרויות");
                }else if(roomTypeLength == 4){
                    //check if "all" was clicked
                    $(".roomType .select-wrapper input").val("הכל");
                }
                else if(roomTypeLength == 1){
                    //change input name if only one left
                    $(".roomType .select-wrapper input").val($( ".roomType  ul li.active" ).text());
                }
                else if(roomTypeLength == 0){
                    //if there's nothing selected - init the input with value
                    $(".roomType .select-wrapper input").val("בחר נכס");
                }

                scope.vm.changeApartmentType(roomTypeLength);
            });

        }
    };
});
app.directive('roomNum', function() {
    return {
        restrict: 'AE',
        replace: true,
        template: function(scope, element, attrs) {
            return '<div class="input-field roomNum no-padding"> <select multiple id="roomNum" > <option value="1"  >1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> </select> <label>מספר חדרים</label> </div>';
        },
        link: function(scope, element, attrs) {
            angular.element('#roomNum').material_select();
            angular.element(".roomNum ul li").each(function(index,roomNumElement) {
                $(this).addClass("active");
                $(this).find("input[type=checkbox]").prop("checked", "checked");
                $(".roomNum .select-wrapper input").val("1,2,3,4,5");
            });

            $(element).change(function() {
                scope.vm.changeRoomNum();
            });
        }
    };
});
app.directive('rzSlider', function($timeout) {
    return {
        restrict: 'AE',
        replace: true,
        template: function(scope, element, attrs) {
            return '<div class="input-field rszslider no-padding"> <p>טווח</p> <rzslider rz-slider-model="vm.slider.minValue" rz-slider-high="vm.slider.maxValue" rz-slider-options="vm.slider.options"></rzslider> </div>';
        },
        link: function(scope, element, attrs) {
            scope.vm.slider = {
                minValue: attrs.min,
                maxValue: attrs.max,
                options: {
                    floor: 1000,
                    ceil: 8000,
                    step: 1000,
                    onEnd: scope.vm.changeSliderListener
                }
            };
            //init first dropdown min and max values when click on "more options" button
            scope.moreOptions = function(){
                $timeout(function () {
                    scope.$broadcast('rzSliderForceRender');
                });
            }
        }
    };
});
app.directive('googleSignInDropdown', function($compile) {
    return {
        restrict: 'AE',
        replace: true,
        controller: "indexController",
        controller: "searchZoneController",
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope, element, attrs) {
            var template = "<div class='userProfileCustomClass' role='tooltip'><span ng-click='vm.signOut()'>SignOut</span></div>";
            angular.element('.userProfile[data-toggle="popover"]').popover({
                html: true, tooltipClass: 'tooltip-custom',
                content: $compile(template)(scope)
            });
        }
    };
});
app.directive('markerWrapper', function($compile) {
    return {
        restrict: 'AE',
        replace: true,
        bindToController: true,
        link: function(scope, element, attrs) {
            return "<div class='aaa' >aaaaaaaaa</div>";
        }
    };
});
app.directive('loadScript', [function() {
    return function(scope, element, attrs) {
        angular.element('<script src="ninja-slider.js"></script>').appendTo(element);
    }
}]);