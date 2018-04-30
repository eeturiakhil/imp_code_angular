// ielts7band Ionic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ielts7band', ['ionic', 'starter.controllers', 'ngCordova', 'starter.accordion', 'starter.ngJustGage',])

.run(function($ionicPlatform, $state, $ionicPopup, $rootScope, $window, $cordovaFile, LoginService, $cordovaKeyboard) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          // cordova.plugins.Keyboard.disableScroll(true);
          window.cordova.plugins.Keyboard.disableScroll(true);
          // $cordovaKeyboard.hideAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // StatusBar.hide();
      // ionic.Platform.fullScreen();
      StatusBar.styleDefault();
      StatusBar.overlaysWebView(false);
      StatusBar.backgroundColorByHexString("#17b3f0");
    }

    if(LoginService.isAuthenticated() && $rootScope.loginStatus){  
         $state.go('app.user-dashobard', {}, {reload : true});    
         $rootScope.introPage = false;   
      } 
      else{
        $state.go('app.home', {}, {reload : true});
        $rootScope.introPage = true;
        event.preventDefault();
      }

    if(window.localStorage.getItem("loadFirstTime1") != 1) {
      // Running for the first time.
      window.localStorage.setItem("loadFirstTime1", 1);
      // console.log("1st time");
      // alert("1st time");      



      LoginService.saveMobileData(device).then(function(data, status, headers, config){
        // alert("Success");        
      }, function(data, status, headers, config){
        // alert("Failed");
      });
      $rootScope.uuid = device.uuid;

      if(ionic.Platform.isAndroid()){
         checkPermission();
         folderExists();
      }

        function folderExists() {
          var directory;
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          } else {
            directory = cordova.file.externalRootDirectory; // for Android
          }
            $cordovaFile.createDir(directory, "ielts7band", true)
            .then(function (success) {
              // alert(directory);
              // alert("First"+ JSON.stringify(success));
              // success
            }, function (error) {
              // error
              // alert(directory);
              // alert("First error"+ JSON.stringify(error));

            });

        };

      function checkPermission(){
        // alert("hi");
        var permissions = cordova.plugins.permissions;
        var list = [
                      permissions.READ_EXTERNAL_STORAGE,
                      permissions.RECORD_AUDIO
                   ];

        permissions.hasPermission(list, success, null);

        function error() {
          // alert('First Camera or Accounts permission is not turned on');
        };

        function success( status ) {
          if( !status.hasPermission ) {

            permissions.requestPermissions(list, function(status) {
                if( !status.hasPermission ) error();
              },
              error);
          }
        };

      };

      function error() {
        // alert('Camera permission is not turned on');
      };

      function success( status ) {
        if(!status.hasPermission ) error();
      };

    }
    else{
      //Already run this app before.
      // console.log("running this for more than one time");
      // alert("running this for more than one time");
      // alert("1st time");

      // alert(JSON.stringify(device));

      LoginService.saveMobileData(device).then(function(data, status, headers, config){
        // alert("Success");
      }, function(data, status, headers, config){
        // alert("Failed");
      });
      $rootScope.uuid = device.uuid;
      
      function folderExists() {
        var directory;
        if (cordova.file.documentsDirectory) {
          directory = cordova.file.documentsDirectory; // for iOS
        } else {
          directory = cordova.file.externalRootDirectory; // for Android
        }
        $cordovaFile.checkDir(directory, "ielts7band")
           .then(function (success) {
             // alert(directory);
             // alert("Second"+ JSON.stringify(success));
             // alert(JSON.stringify(success));
           }, function (error) {
             // alert(directory);
             // alert("Second error"+JSON.stringify(error));
             // alert("No"+ JSON.stringify(error));
             $cordovaFile.createDir(directory, "ielts7band", false)
               .then(function (success) {
                 // alert(directory);
                 // alert("Created"+ JSON.stringify(success));
               }, function (error) {
                 // alert(directory);
                 // alert(JSON.stringify(error));
                 // error
               });
           });
       };
       if(ionic.Platform.isAndroid()){
         folderExists();
       }       
    }    

  }  

  )



  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="app.user-dashobard" || $state.current.name=="app.home"){
      var confirmPopup = $ionicPopup.confirm({
         title: '<p style="background-color: green;">Alert</p>',
         template: 'Are you sure you want to exit the app?',
         cancelText: 'Cancel',
         okText: 'OK',
         cancelType: 'button-assertive',
         okType: 'button-balanced',
         cssClass: 'QUIT'
      });
      confirmPopup.then(function(res) {
       if(res) {
         navigator.app.exitApp();
       } else {
         console.log('You are not sure');
       }
     });
      //navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);

  $rootScope.online = navigator.onLine;
  $window.addEventListener("offline", function () {
    $rootScope.$apply(function() {
      $rootScope.online = false;
    });
  }, false);
  $window.addEventListener("online", function () {
    $rootScope.$apply(function() {
      $rootScope.online = true;
    });
  }, false);

  $window.addEventListener('play', function(e){
    var audios = document.getElementsByTagName('audio');
    for(var i = 0, len = audios.length; i < len;i++){
        if(audios[i] != e.target){
            audios[i].pause();
            audios[i].currentTime = 0;
        }
    }
  }, true);

  if(window.localStorage.getItem("intro1") != 1) {
    window.localStorage.setItem("intro1", 1);
    $rootScope.firstTime = true;
  }
  else{
    $rootScope.firstTime = false;
  }

})

// .run(function ($rootScope, $state, LoginService, introService) {
//   $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
//     if (!(LoginService.isAuthenticated()) && !($rootScope.loginStatus)) {  
//       if (next.name != 'app.home') {       
//           $state.go('app.home'); 
//           event.preventDefault();                                  
//       }           
//     }
//   });
// })

.run(function ($rootScope, $cordovaNetwork) {
  document.addEventListener("deviceready", function () {
    var type = $cordovaNetwork.getNetwork();
    var isOnline = $cordovaNetwork.isOnline();
    var isOffline = $cordovaNetwork.isOffline();
    // alert("ONLINE "+isOnline);
    // alert("OFFLINE "+isOffline);
    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      if(onlineState){
        $rootScope.online = true;
        $rootScope.$emit("GetNewData", {data: true});
      }
      // alert("ONLINE 1 "+$rootScope.online);
    });
    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      if(offlineState){
        $rootScope.online = false;
        $rootScope.$emit("GetNewData", {data: false});
      }
      // alert("OFFLINE 2 "+$rootScope.online);
    });
  }, false);
})

/*.run(function ($rootScope, $state, LoginService) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
    if (LoginService.isAuthenticated() && $rootScope.loginStatus) {
      if (next.name == 'app.user-dashobard' || next.name == 'app.home') {
        $rootScope.backButton = false;
      }
      else{
        $rootScope.backButton = true;
      }
    }else{
        if (next.name =='app.home') {
          $rootScope.backButton = false;
        }
    }
  });
})*/

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
}])

.config(function($stateProvider, $urlRouterProvider) {
  // $locationProvider.html5Mode(true);

  $stateProvider

  .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      controllerAs : "vmApp"
    })
    .state('app.intro', {
      url: '/intro',
      views: {
        'menuContent': {
          templateUrl: 'templates/intro.html',
          controller: "IntroCtrl"
        }
      }
    })
  .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html'
          }
        },
        controller: "HomeCtrl",
        controllerAs: "vmHome"
     })
    .state('app.user-dashobard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/dashboard.html'
        }
      },
      controller : "DashCtrl",
      controllerAs : "vmDash"
    })
    .state('app.user-changepassword', {
      url: '/changepassword',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/changepassword.html',
          controller: 'changePwdCtrl',
          controllerAs : "vmchgPwd"
        }
      }
    })
    .state('app.user-feedback', {
      url: '/feedback',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/feedback.html',
          controller: 'feedbackCtrl',
          controllerAs : "vmFeedback"
        }
      }
    })
    .state('app.faqs', {
      url: '/faqs',
      views: {
        'menuContent': {
          templateUrl: 'templates/faqs.html',
          controller: 'faqsCtrl'
        }
      }
    })
    // .state('app.ios_products', {
    //   url: '/ios_products',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/ios_products.html',
    //       controller: 'iosProductsCtrl'
    //     }
    //   }
    // })
    .state('app.user-profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/profile.html',
          controller: 'ProfileCtrl',
          controllerAs : "vmProfile"
        }
      }
    })
    .state('app.user-listening', {
      url: '/listeningvideo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/videoClass/listening_video.html'
        }
      },
      controller : "listenVideoCtrl",
      controllerAs : "vmListenVideo"
    })
    .state('app.user-reading', {
      url: '/readingvideo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/videoClass/reading_video.html'
        }
      },
      controller : "readVideoCtrl",
      controllerAs : "vmReadVideo"
    })
    .state('app.user-writing', {
      url: '/writingvideo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/videoClass/writing_video.html'
        }
      },
      controller : "writeVideoCtrl",
      controllerAs : "vmWriteVideo"
    })
    .state('app.user-speaking', {
      url: '/speakingvideo',
      views: {
        'menuContent': {
          templateUrl: 'templates/userpanel/videoClass/speaking_video.html'
        }
      },
      controller : "speakVideoCtrl",
      controllerAs : "vmSpeakVideo"
    })
    .state('app.practicetest', {
        url: '/practicetest',
        views: {
          'menuContent': {
            templateUrl: 'templates/userpanel/tabspracticetest.html',
            controller : "PracticeTabsCtrl",
            controllerAs : "vmPractice"
          }
        }
    })
    .state('app.practicetest.listening', {
      url: '/listening',
      views: {
        'menuContent@tab-listen': {
          templateUrl: 'templates/userpanel/tabListening.html',
          controller: 'ListeningCtrl',
          controllerAs : "vmListen"
        }
      }
    })
    .state('app.practicetest.reading', {
      url: '/reading',
      views: {
        'menuContent@tab-read': {
          templateUrl: 'templates/userpanel/tabReading.html',
          controller: 'ReadingCtrl',
          controllerAs : "vmRead"
        }
      }
    })
    .state('app.practicetest.writing', {
      url: '/writing',
      views: {
        'menuContent@tab-write': {
          templateUrl: 'templates/userpanel/tabWriting.html',
          controller: 'WritingCtrl',
          controllerAs : "vmWrite"
        }
      }
    })
    .state('app.practicetest.speaking', {
      url: '/speaking',
      views: {
        'menuContent@tab-speak': {
          templateUrl: 'templates/userpanel/tabSpeaking.html',
          controller: 'SpeakingCtrl',
          controllerAs : "vmSpeak"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/app/dashboard');
});
