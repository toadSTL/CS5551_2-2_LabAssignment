var app = angular.module("facedetect", []);
app.controller("Ctrl1", function ($scope, $http) {
    //Delclaring the name variable.
    $scope.searchedName = '';

        //'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';
    
    

    //In this method will make a get request to node api to get all records. 
    $scope.getImages = function () {
        $http({
            method: 'GET',
            //name: $scope.searchedName,
            //https://secret-brushlands-75804.herokuapp.com/get1?url=
            //127.0.0.1:3000
            url: 'http://127.0.0.1:3000/get1?name=' + $scope.searchedName//$scope.url
        }).then(function successCallback(response) {
            console.log("Success Response:");
            console.log(response.data);
            
           //jsonResp
            $scope.gender=response.data[0].faceAttributes.gender;
            $scope.age=response.data[0].faceAttributes.age;
            $scope.eyemakeup=response.data[0].faceAttributes.makeup.eyeMakeup;
            $scope.imgUrl=response.data[(response.data.length-1)].imgUrl;
        
        }, function errorCallback(response) {
            console.log("Error Response:");
            console.log(response);
        });
    }
});