var myApp = angular.module("myApp", []);

myApp.controller('myController', ['$scope', function($scope) {
    $scope.gmail = {
        username: "",
        email: ""
    };
    $scope.googleLogin = function(){
        console.log("inside onGoogleLogin()");
        var params = {
            'clientid' : '790101742280-qcvrrjjisd4i1p4e870luieilj49b7nm.apps.googleusercontent.com',
            'cookiepolicy' : 'single_host_origin',
            'callback' : function(result){
                console.log("inside callback");
                console.log(result);
                if(result['status']['signed_in']){
                    gapi.client.load('plus','v1', function () { //This solved the problem
                        var request = gapi.client.plus.people.get({
                            'userId': 'me',
                        });
                        request.execute(function (resp) {
                            $scope.$apply(function () {
                                $scope.gmail.username = resp.displayName;
                                $scope.gmail.email = resp.emails[0].value;
                                $scope.g_image = resp.image.url;
                                localStorage.setItem("userName", resp.displayName);
                                localStorage.setItem("userEmail", resp.emails[0].value);
                                console.log(resp);

                                console.log($scope.gmail.username);
                                console.log($scope.gmail.email);
                            });
                        });
                    });
                }else{
                    console.log("failed to sign in " + result['status']['signed_in'])
                }
            },
            'approvalprompt' : 'force',
            'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
        };
        gapi.auth.signIn(params);
    }

}]);