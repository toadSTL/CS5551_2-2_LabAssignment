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

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var words = [];
    var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    var diagnostic = document.querySelector('.output');
    var bg = document.querySelector('html');
    var hints = document.querySelector('.hints');

//var colorHTML= '';
    words.forEach(function(v, i, a){
        console.log(v, i);
    });
    //hints.innerHTML = 'Tap/click then say a word to show the word.';

    $scope.listen = function() {
        recognition.start();
        console.log('Ready to receive a word.');
    }

    recognition.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The [last] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object

        var last = event.results.length - 1;
        var word = event.results[last][0].transcript;

        $scope.searchTerm = word;
        diagnostic.textContent = 'Result received: ' + word + '.';
        //bg.style.backgroundColor = color;
        console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onspeechend = function() {
        recognition.stop();
    }

    recognition.onnomatch = function(event) {
        diagnostic.textContent = "I didn't recognise that word.";
    }

    recognition.onerror = function(event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }


}]);