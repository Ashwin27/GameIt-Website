//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/game/start', {
            templateUrl: '/views/games/start.html'
        }).
        when('/game/profile', {
            templateUrl: '/views/games/profile.html'
        }).
        when('/game/map', {
            templateUrl: '/views/games/map.html'
        }).
        when('/game/create', {
            templateUrl: '/views/games/create.html'
        }).
        when('/edit/game/:gameId', {
            templateUrl: '/views/games/edit.html'
        }).
        when('/game/viewAll', {
            templateUrl: '/views/games/index.html'
        }).
        when('/game/:gameId', {
            templateUrl: '/views/games/view.html'
        }).
        when('index.html', {
            templateUrl: '/views/games/index.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);