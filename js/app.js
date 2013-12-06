window.app = angular.module('gameit', ['ngCookies', 'ngResource', 'gameit.games'], function($interpolateProvider) {
	$interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

angular.module('gameit.games', []);