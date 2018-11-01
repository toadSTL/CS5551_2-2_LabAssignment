var MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var assert = require('assert');
const path=require('path');
const request = require('request');
var router=express.Router();
var mongoUrl = "mongodb://toadSTL:toadSTL1@ds255930.mlab.com:55930/face-detection";


const GoogleImages = require('google-images');

//Port number
const port = process.env.PORT||3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

var db;

MongoClient.connect(mongoUrl, function(err, database) {
    if (err) {
        console.log("Connection Failed, Error while connecting to Database");
    } else {
        db = database;
    }
});


app.get('/get1',function(req,resp,next){
    console.log(req.query.name);

    const subscriptionKey = '6c660e3adfd7446698c30e611bde5b1a';

    // You must use the same location in your REST call as you used to get your
    // subscription keys. For example, if you got your subscription keys from
    // westus, replace "westcentralus" in the URL below with "westus".
    const uriBase = 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect';
    // const herokuUrl = https://secret-brushlands-75804.herokuapp.com/get1?url=
    // const imageUrl =
    // 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';
    // Request parameters.
    const params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,' +
            'hair,makeup,occlusion,accessories,blur,exposure,noise'
    };

    const client = new GoogleImages('013938265571473042478:kb9xyrf5daq', 'AIzaSyA_xsU4Pm-IHEWnBp72OJvLrPEEfSU7L0Y');

    var searchUrl = '';
    client.search(req.query.name).then(images => {
        searchUrl = images[0].url;

        //var foundEntry = false;

        var cursor = db.collection('people').find({ "name": req.query.name });
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            //foundEntry = true;
            console.log(doc);
            var urlArr = doc.urls.split('| |');
            var urlFound = false;
            for(i = 0; i< images.length; i++){
                urlFound = false;
                for(u = 0; u < urlArr.length; u++){
                    if(images[i].url == urlArr[u]){
                        urlFound == true;
                    }
                }
                if(!urlFound){
                    searchUrl = images[i].url;
                    break;
                }
            }
        });


        console.log(searchUrl);
        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + searchUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };

        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            console.log(body);
            var obj = JSON.parse(body);
            var imgurl = {
                imgUrl: searchUrl
            };
            obj.push(imgurl);

            entry = {
                name: req.query.name,		                        //used as primary key
                urls: searchUrl, 			                        //"url| |url| |url"  <-- checked to see if the url is new
                age: obj[0].faceAttributes.age,			            //average from list of reported-age	: 	number
                reportedAge: obj[0].faceAttributes.age.toString(), 		    //"age| |age| |age"
                gender: obj[0].faceAttributes.gender,			    //most commonly occuring from list of gender	: 	enum gender = {'male','female'}
                reportedGender: obj[0].faceAttributes.gender, 	    //"gender| |gender| |gender"
                usualMakeup: obj[0].faceAttributes.makeup.eyeMakeup,		//most commonly occuring from list of reported-makeup	:	boolean
                reportedMakeup: obj[0].faceAttributes.makeup.eyeMakeup	    //"makeup| |makeup| | makeup"
            };

            db.collection('people').insertOne(entry, function (err, result) {
                if (err) {
                    console.log("Insert Failed, Error while inserting document");
                } else {
                    console.log("Inserted document into the 'people' collection.");
                }
            });



            let jsonResponse = JSON.stringify(obj, null, '  ');
            resp.send(jsonResponse);
            //console.log('JSON Response\n');
            //console.log(jsonResponse);

        });

    });

});





app.listen(port,function(){
    console.log('Server Started At '+port);
})
