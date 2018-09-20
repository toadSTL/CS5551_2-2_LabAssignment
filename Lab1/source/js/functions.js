var myApp = angular.module("myApp", []);

myApp.controller("myController", ["$scope", function($scope) {
    "use strict";
    $scope.gKnowledgeSearch = function() {
        var service_url = "https://kgsearch.googleapis.com/v1/entities:search";
        var params = {
            "query": $scope.searchTerm,
            "limit": 1,
            "indent": true,
            "key" : "AIzaSyBTAZVHIXn7L1PIUUe0MUyGWvyYwrH_rRA"
        };
        $.getJSON(service_url + "?callback=?", params, function(response) {
            if(response.itemListElement.length === 1){
                localStorage.setItem("resName", response.itemListElement[0].result.name);
                localStorage.setItem("resDesc", response.itemListElement[0].result.detailedDescription.articleBody);
                document.getElementById("resName").innerHTML = localStorage.getItem("resName");
                document.getElementById("resDesc").innerHTML = localStorage.getItem("resDesc");
            }else{
                document.getElementById("resName").innerHTML = "No result for search term:  " + $scope.searchTerm;
                document.getElementById("resDesc").innerHTML = "";
            }
        });
    };

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    var words = [];
    var grammar = "#JSGF V1.0; grammar words; public <word> = " + words.join(" | ") + " ;";

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    var diagnostic = document.querySelector(".output");
    var bg = document.querySelector("html");
    var hints = document.querySelector(".hints");


    $scope.listen = function() {
        recognition.start();
    };

    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var word = event.results[last][0].transcript;

        $scope.searchTerm = word;
        diagnostic.textContent = "Result received: " + word + ".";
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onnomatch = function(event) {
        diagnostic.textContent =
            "Didn't recognise that word.";
    };

    recognition.onerror = function(event) {
        diagnostic.textContent = "Error occurred in recognition: " + event.error;
    };


}]);


myApp.controller("accessController", ["$scope", function($scope) {
    $scope.goToLogin = function(){
        $(".logFields").css("display","block");
        $(".regFields").css("display","none");
        $(".loginbutton").css("background-color","dimgrey");
        $(".registerbutton").css("background-color","lightgrey");
    };

    $scope.goToRegister = function(){
        $(".logFields").css("display","none");
        $(".regFields").css("display","block");
        $(".loginbutton").css("background-color","lightgrey");
        $(".registerbutton").css("background-color","dimgrey");
    };

    $scope.login = function() {
        if (document.getElementById("username").value !== "" && document.getElementById("password").value !== "") {
            if (document.getElementById("username").value === localStorage.getItem("un") && document.getElementById("password").value === localStorage.getItem("pw")) {
                $(".g-signin2").css("display","none");
                $(".login").css("display","none");
                $(".content").css("display","block");
                $("#sucess").text(localStorage.getItem("email")+" successfully logged in!");
            }
            else {
                document.getElementById("logError").innerHTML = "Username or Password does not match!";
            }
        }
        else {
            document.getElementById("logError").innerHTML = "Please provide username and password!";
        }
    };


    $scope.register = function() {
        if (document.getElementById("un").value !== "" && document.getElementById("email").value.length !== "" && document.getElementById("pw").value.length !== "") {
            localStorage.setItem("un", (document.getElementById("un").value));
            localStorage.setItem("pw", (document.getElementById("pw").value));
            localStorage.setItem("email", (document.getElementById("email").value));
            window.location.href = "home.html";
        }
        else {
            document.getElementById("regError").innerHTML = "Please provide username, email, and password!";
        }
    };

}]);