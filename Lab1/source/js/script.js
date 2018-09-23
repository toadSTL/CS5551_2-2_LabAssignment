function onSignIn(googleUser){
    "use strict";
    var profile=googleUser.getBasicProfile();
    $(".g-signin2").css("display","none");
    $(".login").css("display","none");
    $(".content").css("display","block");
    $("#sucess").text(profile.getEmail()+" successfully logged in!");
}

function signOut(){
    "use strict";
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function(){
        $(".g-signin2").css("display","block");
        $(".login").css("display","block");
        $(".content").css("display","none");

    });
}