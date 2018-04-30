// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('eposHybrid', ['ionic', 'starter.controllers', 'ksSwiper', 'googlechart', 'chart.js', 'ngCordova', 'ionic-datepicker'])

  .run(function($state, $ionicPlatform, $ionicHistory, $cordovaFile, $rootScope, $cordovaToast, $timeout, $window, LoginService) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if(window.localStorage.getItem("loadFirstTime") != 1) {
          // Running for the first time.
          window.localStorage.setItem("loadFirstTime", 1);
          if(ionic.Platform.isAndroid()){
             folderExists();
          }
          function folderExists() {
            var directory;
            if (cordova.file.documentsDirectory) {
              directory = cordova.file.documentsDirectory; // for iOS
            } else {
              directory = cordova.file.externalRootDirectory; // for Android
            }
              $cordovaFile.createDir(directory, "eposhybrid", true)
              .then(function (success) {                
              }, function (error) {                
              });
          };
      }
      else{
        if(ionic.Platform.isAndroid()){
           folderExists();
        }
        function folderExists() {
        var directory;
        if (cordova.file.documentsDirectory) {
          directory = cordova.file.documentsDirectory; // for iOS
        } else {
          directory = cordova.file.externalRootDirectory; // for Android
        }
        $cordovaFile.checkDir(directory, "eposhybrid")
           .then(function (success) {            
           }, function (error) {             
             $cordovaFile.createDir(directory, "eposhybrid", false)
               .then(function (success) {                 
               }, function (error) {                
               });
           });
       };        
      }

      if (LoginService.isAuthenticated() && $rootScope.loginStatus) {
        $state.go('app.dashboard', {}, {reload : true});
      }
      else {        
        $state.go('app.login', {}, {reload : true});
        // event.preventDefault();
      }

    }

    );

    $ionicPlatform.registerBackButtonAction(function (event) {
      if ($ionicHistory.currentStateName() == 'app.login' || $ionicHistory.currentStateName() == 'app.dashboard'){
        if ($rootScope.backButtonPressedOnceToExit)
            {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                navigator.app.exitApp();
            }
            $rootScope.backButtonPressedOnceToExit = true;
            $cordovaToast.show("Press again to exit",'short','bottom');
            $timeout(function()
            {
                $rootScope.backButtonPressedOnceToExit = false;
            }, 2000);
      }
      else{
           navigator.app.backHistory();
        }
  }, 100)

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

  })

  .run(function ($rootScope, $cordovaNetwork) {
    document.addEventListener("deviceready", function () {
      var type = $cordovaNetwork.getNetwork();
      var isOnline = $cordovaNetwork.isOnline();
      var isOffline = $cordovaNetwork.isOffline();
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
        if(onlineState){
          $rootScope.online = true;          
        }        
      });
      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        var offlineState = networkState;
        if(offlineState){
          $rootScope.online = false;                 
        }        
      });
    }, false);
  })

  // .run(function ($rootScope, $state, LoginService) {
  //   $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
  //     if (!(LoginService.isAuthenticated()) && !($rootScope.loginStatus)) {
  //       // alert("logged out");
  //       if (next.name != 'app.login') {
  //         event.preventDefault();
  //         $state.go('app.login');
  //       }
  //     }          
  //   });
  // })

  .config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      // closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'modal',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: false,
      showCloseButton: false,
      dateFormat: 'dd MM yyyy',
      closeOnSelect: true,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      controllerAs : "vmApp"
    })
    .state('app.login', {
      cache : true,
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'vmLogin'
        }
      }
    })    

    .state('app.dashboard', {
      cache : false,
      url: '/dashboard',       
      controller: "DashCtrl",    
      controllerAs: "vmDash",      
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html'
        }         
      }
   })
    .state('app.item-management', {
      cache: false,
      url: '/item-management',
      views: {
        'menuContent': {
          templateUrl: 'templates/item-management.html',
          controller : "ItemManagementCtrl",
          controllerAs : "vmItem"
        }
      }
   })
   .state('app.promotion', {
      url: '/promotion',
      views: {
        'menuContent': {
          templateUrl: 'templates/promotion.html'
        },
        controller : "PromotionCtrl",
        controllerAs : "vmPromotion"
      }      
   })
   .state('app.staff-management', {
      url: '/staff-management',
      views: {
        'menuContent': {
          templateUrl: 'templates/staff-management.html'
        }
      },
      controller : "StaffManagementCtrl",
      controllerAs : "vmStaffManagement"
   })
   .state('app.staff-management.todayStaff', {
      url: '/todaystaff',
      views: {
        'menuContent@today-staff': {
          templateUrl: 'templates/todayStaff.html',
          controller: 'todayStaffCtrl',
          controllerAs : "todayS"
        }
      }
    })
    .state('app.staff-management.allStaff', {
       url: '/allstaff',
       views: {
         'menuContent@all-staff': {
           templateUrl: 'templates/allStaff.html',
           controller: 'allStaffCtrl',
           controllerAs : "allS"
         }
       }
     })

    // .state('app.todayRota', {
    //   cache : true,
    //   url: '/todayrota',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/todayRota.html',
    //       controller: 'todayRotaCtrl',
    //        controllerAs : "todayR"

    //     }
    //   }
    // })

   .state('app.app-management', {
      url: '/app-management',
      views: {
        'menuContent': {
          templateUrl: 'templates/app-management.html'
        }
      },
      controller : "AppManagementCtrl",
      controllerAs : "vmAppManagement"
   })
   .state('app.table-management', {
      url: '/table-management',
      views: {
        'menuContent': {
          templateUrl: 'templates/table-management.html',
          controller : "TableManagementCtrl",
          controllerAs : "vmTableManagement"
        }
      }
   })
   .state('app.table-management.occTables', {
      url: '/occtables',
      views: {
        'menuContent@tab-occupied': {
          templateUrl: 'templates/occupiedTables.html',
          controller: 'bookedTablesCtrl',
          controllerAs : "vmBooked"
        }
      }
    })
    .state('app.table-management.bookedTables', {
      url: '/bookedtables',
      views: {
        'menuContent@tab-booked': {
          templateUrl: 'templates/bookedTables.html',
          controller: 'occupiedTablesCtrl',
          controllerAs : "vmOccupied"
        }
      }
    })


  ;
  // if none of the above states are matched, use this as the fallback

  // $urlRouterProvider.otherwise('/app/dashboard');
});
