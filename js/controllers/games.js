angular.module('gameit.games').controller('GamesController', ['$scope', '$routeParams', '$location', 'Games', function ($scope, $routeParams, $location, Games) {
    $scope.create = function() {
        var game = new Games({
            location: this.location,
            sport: this.sport,
            level: this.level,
            description: this.description,
            num_players: this.num_players,
            date: this.date,
            start_time: this.start_time,
            end_time: this.end_time,
            date_created: new Date(),
            date_updated: new Date()
        });
        game.$save(function(response) {
            $location.path("index.html");
        });
        this.date = "";
        this.location = "";
        this.sport = "";
        this.level = "";
        this.description = "";
        this.num_players = "";
        this.start_time = "";
        this.end_time = "";
    };

    $scope.remove = function(game) {
        game.$remove();

        for (var i in $scope.games) {
            if ($scope.games[i] === game) {
                $scope.games.splice(i, 1);
            }
        }
    };

    $scope.update = function() {
        var game = $scope.game;
        game.date_updated = new Date();
        if (!game.updated) {
            game.updated = [];
        }
        game.updated.push(new Date().getTime());

        game.$update(function() {
            $location.path('app/games/' + game._id);
        });
    };
    $scope.findAll = function() {
        Games.get({gameId: ""}, function(games) {
            $scope.games = games;
        });
    };

    $scope.find = function(query) {
        Games.query(query, function(games) {
            $scope.games = games;
        });
    };

    $scope.findOne = function() {
        Games.get({
            gameId: $routeParams.gameId
        }, function(game) {
            $scope.game = game;
        });
    };
}]);