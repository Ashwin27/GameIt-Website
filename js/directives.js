window.app.directive('gameTools', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/partials/gameTools.html',
        link: function (scope, element, attrs) {
            scope.init = function () {
                scope.location = "";
                scope.sport = "";
                scope.level = "";
                scope.description = "";
                scope.num_players = "";
                scope.start_time = "";
                scope.end_time = "";
            };
            scope.init();
        }
    };
});

window.app.directive('mapTools', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/partials/mapTools.html',
        link: function (scope, element, attrs) {

        }
    };
});