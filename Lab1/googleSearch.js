var myApp = angular.module("myApp", []);

myApp.controller('myController', ['$scope', function($scope) {
    $scope.gKnowledgeSearch = function() {
        console.log("got here");
        var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
        var params = {
            'query': $scope.searchTerm,
            'limit': 10,
            'indent': true,
            'key' : 'AIzaSyBTAZVHIXn7L1PIUUe0MUyGWvyYwrH_rRA',
        };
        $.getJSON(service_url + '?callback=?', params, function(response) {
            console.log(response);
            $scope.resultName = response.itemListElement[0].result.name;
            $scope.resultDesc = response.itemListElement[0].result.description;
        });
    }


}]);