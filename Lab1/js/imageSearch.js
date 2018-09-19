var imgApp = angular.module("imgApp", []);



imgApp.controller('imgController', function($scope, $http){
    $scope.ygetImages = function () {
        $http.get('http://search.yahooapis.com/ImageSearchService/V1/imageSearch?appid=mxA21b3c&query=' + $scope.searchTerm + '&results=1').success(function(data) {
            console.log(data);
        })
    }

    $scope.ggetImages = function () {
        var searcher = new google.search.ImageSearch();
        searcher.setRestriction(
            google.search.ImageSearch.RESTRICT_COLORIZATION,
            google.search.ImageSearch.COLORIZATION_GRAYSCALE
        );
    }
});
