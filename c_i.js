(function() {
    'use strict';

    angular
      .module('starter.controllers', ['starter.Services'])
      .controller('IntroCtrl', IntroCtrl)
      .controller('AppCtrl', AppCtrl)
      .controller("loginCtrl", loginCtrl)
      .controller("forgotpwdCtrl", forgotpwdCtrl)
      .controller("registerCtrl", registerCtrl)
      .controller("enrollCtrl", enrollCtrl)
      .controller("DashCtrl", DashCtrl)
      .controller("ProfileCtrl", ProfileCtrl)
      .controller("changePwdCtrl", changePwdCtrl)
      .controller("termsCtrl", termsCtrl)
      .controller("faqsCtrl", faqsCtrl)
      .controller("feedbackCtrl", feedbackCtrl)
      .controller("selectCourseCtrl", selectCourseCtrl)
      .controller("upgradePackageCtrl", upgradePackageCtrl)
      .controller("packageCtrl", packageCtrl)
      .controller("starterCtrl", starterCtrl)
      .controller("masterCtrl", masterCtrl)
      .controller("expertCtrl", expertCtrl)
      .controller("HomeCtrl", HomeCtrl)
      .controller("PracticeTabsCtrl", PracticeTabsCtrl)
      .controller("ListeningCtrl", ListeningCtrl)
      .controller("listenExamCtrl", listenExamCtrl)
      .controller("listenVideoCtrl", listenVideoCtrl)
      .controller("ReadingCtrl", ReadingCtrl)
      .controller("readExamCtrl", readExamCtrl)
      .controller("readVideoCtrl", readVideoCtrl)
      .controller("WritingCtrl", WritingCtrl)
      .controller("writeExamCtrl", writeExamCtrl)
      .controller("writeVideoCtrl", writeVideoCtrl)
      .controller("SpeakingCtrl", SpeakingCtrl)
      .controller("speakExamCtrl", speakExamCtrl)
      .controller("recordingCtrl", recordingCtrl)
      .controller("imagesSelectionCtrl", imagesSelectionCtrl)
      .controller("speakVideoCtrl", speakVideoCtrl)
      // .controller("iosProductsCtrl", iosProductsCtrl)
      .filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
      }]);


       // var baseurl = "http://192.168.0.65/ielts7band.net/";
      // var baseurl = "http://sandbox786.com/ielts7band/";
      // var baseurl = "http://sandbox786.com/sandielts/";
      var baseurl = "https://www.ielts7band.net/";

      var video;
      var vid;

      function IntroCtrl($scope, $state, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, introService, $timeout){

        $ionicSideMenuDelegate.canDragContent(false);
        $scope.startApp = function() {
          introService.hideModal();
        };
        $scope.next = function() {
          console.log("next");          
          $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
          $ionicSlideBoxDelegate.previous();
        };

        $scope.slideChanged = function(index) {
          $scope.slideIndex = index;
          console.log($scope.slideIndex);
          if($scope.slideIndex === 2){
            $timeout(function()
              {
                introService.hideModal();
              }, 2000);
            
          }
        };

      };

      function AppCtrl($scope, userService, $timeout, $location, $http, $state, $ionicModal, popoverService, ProfileService, $sce, $ionicSideMenuDelegate,
      $rootScope, $ionicPopup, $window, $ionicPopover, forgotpwdModalService, packagesModalService, LoginService, $ionicHistory, $cordovaToast, SpeakingPaperService,
      loginModalService, registerModalService, enrollModalService, $ionicLoading, $cordovaFile, AUTH_EVENTS, faqModalService, WritingPaperService, introService) {

        var vmApp = this;

          $rootScope.defaultPic = "img/avatar.jpg";

          if(ionic.Platform.isIOS()){
            $rootScope.iosPlatform = true;
          }
          else{
            $rootScope.iosPlatform = false;            
          }

          // var xhr = new (); xhr.withCredentials = true;

          // var url = baseurl+"Resources/video_uploads/IELTS7bandFinalS.mp4";
          var homeUrl = "https://www.youtube-nocookie.com/embed/612HWsqmTHs?rel=0&amp;showinfo=0";
          // console.log(homeUrl);
          $rootScope.homeURL = $sce.trustAsResourceUrl(homeUrl);
          var url = "https://www.youtube-nocookie.com/embed/VxI_qaiE_Sw?rel=0&showinfo=0";
          $rootScope.StaticURL = $sce.trustAsResourceUrl(url);

          
          var listenURL = "https://www.youtube-nocookie.com/embed/7fkIQYBddUE?rel=0&showinfo=0";
          $rootScope.listenURL = $sce.trustAsResourceUrl(listenURL);
          var readURL = "https://www.youtube-nocookie.com/embed/rjG1pWdVA8Y?rel=0&showinfo=0";
          $rootScope.readURL = $sce.trustAsResourceUrl(readURL);
          var writeURL = "https://www.youtube-nocookie.com/embed/88b2u_DdN3Q?rel=0&showinfo=0";
          $rootScope.writeURL = $sce.trustAsResourceUrl(writeURL);
          var speakURL = "https://www.youtube-nocookie.com/embed/2MLEHQ7MO_k?rel=0&showinfo=0";
          $rootScope.speakURL = $sce.trustAsResourceUrl(speakURL);

          $scope.$on(AUTH_EVENTS.notAuthenticated, function(event, res) {
            $ionicLoading.hide();
            if(!(LoginService.isAuthenticated()) && !($rootScope.loginStatus) && $rootScope.online && res.status == 401){
              LoginService.logoutUser();
              LoginService.outUser();
              $state.go("app.home");
              window.plugins.toast.showWithOptions({
                   message: 'Sorry, You have to login again.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 2000);
            }
          });

          $scope.$on(AUTH_EVENTS.notAuthorized, function(event, res) {
            $ionicLoading.hide();
            
            if(event && res.status == 403 && $rootScope.online){
              if(LoginService.isAuthenticated()){
                $state.go("app.user-dashobard");
              }
              else{
                $state.go("app.home");
              }
              window.plugins.toast.showWithOptions({
                   message: 'You are not allowed to access this resource.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 2000);
            }
          });


          $scope.$on(AUTH_EVENTS.notInternet, function(event, res) {

            $ionicLoading.hide();
            // alert(i++);
            if(event && !$rootScope.online){
              if(LoginService.isAuthenticated()){
                $state.go("app.user-dashobard");
              }
              else{
                $state.go("app.home");
              }
              if($rootScope.writeOffline){
                WritingPaperService.hideModal();
                $rootScope.writeOffline = false;
              }
              if($rootScope.speakOffline){
                SpeakingPaperService.hideModal();
                $rootScope.speakOffline = false;
              }
              if($rootScope.enrollOffline){
                enrollModalService.hideModal();
                $rootScope.enrollOffline = false;
              }
              window.plugins.toast.showWithOptions({
                   message: 'No Internet, please try later.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              // $cordovaToast.show("No Internet, please try later.",'long','center', styling: {
              //                 backgroundColor: '#FF0000', // red
              //                 borderRadius: 30, // a bit less than default, 0 means a square Toast
              //                 alpha: 180, // 0-255, 0 being fully transparent
              //                 padding: {
              //                   top: 20,
              //                   right: 30,
              //                   bottom: 20,
              //                   left: 30
              //                });
              $timeout(function()
              {
              }, 2000);
            }
          });

          $scope.$on(AUTH_EVENTS.serverError, function(event, res) {

            $ionicLoading.hide();
            if(event && res.status == 500 && $rootScope.online){
              if(LoginService.isAuthenticated()){
                $state.go("app.user-dashobard");
              }
              else{
                $state.go("app.home");
              }
              window.plugins.toast.showWithOptions({
                   message: 'Internal Server Error. Try again later',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 2000);
            }
          });

          $scope.$on(AUTH_EVENTS.someError, function(event, res) {

            $ionicLoading.hide();
            if(event && res.status == -1 && $rootScope.online){
              if(LoginService.isAuthenticated()){
                $state.go("app.user-dashobard");
              }
              else{
                $state.go("app.home");
              }
              window.plugins.toast.showWithOptions({
                   message: 'Unable to fetch data. Please try again later.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 2000);
            }
          });

        $rootScope.$on('no-data', function(event, res) {
            $ionicLoading.hide();
            if(event && $rootScope.online){
              if(LoginService.isAuthenticated()){
                $state.go("app.user-dashobard");
              }
              else{
                $state.go("app.home");
              }
              window.plugins.toast.showWithOptions({
                   message: 'Unable to fetch data. Please try again later.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 2000);
            }
         });

         $rootScope.$on('notPaidUser', function(event, res) {
           LoginService.logoutUser();
           LoginService.outUser();
           $state.go("app.home");
           // window.location.reload();
         });

         $scope.isMenuOpen = function() {
            return $ionicSideMenuDelegate.isOpen();
            console.log($ionicSideMenuDelegate.isOpen());
         };

       // var url = "https://www.youtube.com/embed/GNs4Cucm7Xo?rel=0&amp";

        vmApp.practiceTabs = function() {
            $state.go("app.practicetest.listening", {}, {reload : true});
        }

          vmApp.openPopover = function($event) {
              $scope.popover.show($event);
              //popoverService.showModal();
          };

          vmApp.gotoDash = function() {
              $state.go("app.user-dashobard", {}, {reload : true} )
              //popoverService.showModal();
          };

          if($rootScope.introPage){
            introService.showModal();
          }

           vmApp.feedbackForm = function() {
             vmApp.Feedback = {};
             vmApp.SubmitFeedback = function() {
              //  console.log(vmApp.Feedback);
             };
           };

           function stopVideo() {
                // vid.pause();
                $('iframe').attr('src', $('iframe').attr('src'));
            };

           // Open the login modal
           vmApp.openLogin = function() {
             if(video){
               stopVideo();
             }
             loginModalService.showModal();
           };

           vmApp.freeTrail = function(){
             if(video){
               stopVideo();
             }
            registerModalService.showModal();
           };           

           vmApp.newUser = function(){
             if(video){
               stopVideo();
             }
              enrollModalService.showModal();
           };

           vmApp.logout = function(){
             if(video){
               stopVideo();
             }
             LoginService.logoutUser();
             LoginService.outUser();
             // $ionicHistory.clearCache().then(function(){ $state.go('app.home', {}, {reload : true}) });
            $state.go('app.home', {}, {reload: true});
           };
           // Open packages modal
           vmApp.packages = function(){
             if(video){
               stopVideo();
             }
             packagesModalService.showModal();
           };
           vmApp.upgrade = function(){
             if(video){
               stopVideo();
             }
             var module = "60";
             userService.setData(module);
             enrollModalService.showModal();
           };
           vmApp.changePwd = function(){
               $state.go("app.user-changepassword", {}, {reload : true});
           };
           vmApp.feedback = function(){
             $state.go("app.user-feedback", {}, {reload : true});
           };

           vmApp.getFaqs = function(){
             if(video){
               stopVideo();
             }
             faqModalService.showModal();
           };
           vmApp.getUserFaqs = function(){
             $state.go("app.faqs", {}, {reload : true});
           };

           vmApp.IOSproducts = function(){
             $state.go("app.ios_products", {}, {reload : true});
           };

          //  console.log($rootScope.loginStatus);

         vmApp.shownGroup = null;
         vmApp.toggleGroup = function(group) {
             if (vmApp.isGroupShown(group)) {
               vmApp.shownGroup = null;
             } else {
               vmApp.shownGroup = group;
             }
         };
         vmApp.isGroupShown = function(group) {
           return vmApp.shownGroup === group;
         };

         vmApp.ListeningVideo = function(){
           $state.go("app.user-listening", {}, {reload : true});
           vmApp.shownGroup = null;
         };

         vmApp.ReadingVideo = function(){
           $state.go("app.user-reading", {}, {reload : true});
           vmApp.shownGroup = null;
         };

         vmApp.WritingVideo = function(){
           $state.go("app.user-writing", {}, {reload : true});
           vmApp.shownGroup = null;
         };

         vmApp.SpeakingVideo = function(){
           $state.go("app.user-speaking", {}, {reload : true});
           vmApp.shownGroup = null;
         };

         $rootScope.$on('updateSocialPackage', function(event, res) {
           var pack = res.dat;
           var Pack = res.dat + ".Package";
           LoginService.updatePack(Pack);
          //  .then(function(){
          //    $state.go("app.user-dashobard", {}, {reload : true});
          //    console.log($rootScope.Package);
          //    // $state.go("app.user-dashobard", {}, {reload : true});
          //  });
         });

         $rootScope.$on('updateNormalPackage', function(event, res) {
           var pack = res.dat;
           var Pack = pack + ".Package";
           LoginService.updatePack(Pack);          
         });

     };

     function changePwdCtrl($scope, $ionicPopup, $rootScope, ProfileService, $state) {

        var vmchgPwd = this;
        vmchgPwd.changePassword = {};

         vmchgPwd.CheckPWD = function(pass) {
           if(pass != $rootScope.Password && pass != undefined && pass != "") {
             var alertPopup = $ionicPopup.alert({
                 title: 'Alert',
                 template: 'Please enter correct password!',
                 cssClass: 'Error'
             });
             alertPopup.then(function(res) {
               vmchgPwd.changePassword.Oldpwd = "";
             });
           }
         };

         vmchgPwd.checkPassword = function(pass, cpass) {
           if(pass != cpass){
             var alertPopup = $ionicPopup.alert({
                 title: 'Re-type Password',
                 template: "Passwords doesn't match!",
                 cssClass: 'Error'
             });

             alertPopup.then(function(res) {
               vmchgPwd.changePassword.Newpwd = "";
               vmchgPwd.changePassword.Confirmpwd = "";
             });

           }
         };
         var res = {};
         vmchgPwd.Submit = function(pwd) {
           if(pwd.Newpwd == pwd.Confirmpwd){
             ProfileService.updatePassword(pwd).then(function(res){
               var alertPopup = $ionicPopup.alert({
                   title: 'Success',
                   template: 'Password changed successfully!',
                   cssClass: 'Success'
               });

               alertPopup.then(function(res) {
                 $scope.$emit('pwdChanged', {data : pwd.Confirmpwd});
                 vmchgPwd.changePassword = "";
                 $state.go("app.user-dashobard", {}, {reload : true});
               });
             }, function(error){
                   var alertPopup = $ionicPopup.alert({
                       title: 'Error',
                       template: 'Unable to update password!',
                       cssClass: 'Error'
                   });
                  // $rootScope.$emit('no-data');
             });
           }
           else {
             vmchgPwd.changePassword = {};
           }
         };
      };

     function ProfileCtrl(ProfileService, $rootScope, $cordovaFile, $ionicLoading, registerModalService, imageModalService,
                            $ionicPopup, userService, $cordovaFileTransfer, tabsService, $state) {

        var vmProfile = this;
        vmProfile.profile = {};
        vmProfile.profilePic = "";
        var pic = "";
        // var targetPath = "";
        // $ionicLoading.show({template : 'Loading...'});

        vmProfile.profile.dialCode = "+61";


        function getUserData(){

          ProfileService.getUserData().then(function(res){
            // alert(JSON.stringify(res.data.profile));
            $ionicLoading.hide();
            // profData = res.data.profile
            console.log(res.data.profile);
            vmProfile.profile.Username = res.data.profile.name;
            vmProfile.profile.Emailid = $rootScope.Username;
            vmProfile.profile.Address1 = res.data.profile.address;
            vmProfile.profile.Address2 = res.data.profile.address2;
            vmProfile.profile.City = res.data.profile.city;
            vmProfile.profile.Postcode = res.data.profile.pcode;
            if(res.data.profile.nationality) vmProfile.profile.nationality = res.data.profile.nationality;
            if(res.data.profile.phone){
              var mobileNo = res.data.profile.phone.split(" ");
              vmProfile.profile.dialCode = mobileNo[0];
              vmProfile.profile.phone = parseInt(mobileNo[1]);
            }
          }, function(err){
              // alert("Unable to fetch the data");
          });
        };

          getUserData();
          loadCountries();
        

        vmProfile.checkNumberFormat = function(mobile){
          if(!isValidMobileNumber(mobile)) {
            vmProfile.mobilePattern = true;
          }
          else {
            vmProfile.mobilePattern = false;
          }
        };

        function isValidMobileNumber(number) {
            var pattern = new RegExp(/^[0-9]{7,}$/);
            return pattern.test(number);
        };

        function loadCountries(){
          registerModalService.loadCountries().then(function(response){
            // console.log(response);
            vmProfile.countriesList = response.countries;
          });
        };

        vmProfile.getCountrycode = function(country){
          angular.forEach(vmProfile.countriesList, function (value, key){
            if(value.name == country){
              vmProfile.profile.dialCode = value.dial_code;
            }
          })
        };

        // $rootScope.$on('ProfilePicChange', function(event, res) {
        //   // vmProfile.profile.Pic = "";
        //   // alert(res.data);
        //   pic = res.data;
        //   var path = cordova.file.externalRootDirectory+"ielts7band/profilePics/";
        //   vmProfile.profilePic = path+pic;
        //   // alert(pic);
        //   // alert(vmProfile.profilePic);
        // });

        vmProfile.selectPic = function(){
          // folderExists();
          imageModalService.showModal();
        };

        function folderExists() {
          var directory;
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          } else {
            directory = cordova.file.externalRootDirectory; // for Android
          }
          $cordovaFile.checkDir(directory, "ielts7band/profilePics")
           .then(function (success) {
             // alert(directory);
             // alert("Present"+ JSON.stringify(success));
             // success
           }, function (error) {
             // error
             // alert(directory);
             // alert("No"+ JSON.stringify(error));
             $cordovaFile.createDir(directory+"ielts7band/", "profilePics", false)
               .then(function (success) {
                 // alert(directory);
                 // alert(JSON.stringify(success));
                 // alert("Created");
               }, function (error) {
                 // alert(directory);
                 // alert(JSON.stringify(error));
                 // error
               });
           });
         };


        var targetPath;

        vmProfile.updateProfile = function(profile) {
          // $ionicLoading.show({template : 'Updating Profile...'});
          console.log(profile);
          // return;
          // alert(JSON.stringify(profile));
          // if(vmProfile.profilePic.indexOf("ielts7band/profilePics/") > 0){
          //   // alert(vmProfile.profilePic);
          //   // Destination URL
          //    var url = baseurl+"Userservices/updateProfile/";
          //    var directory;
          //    if (cordova.file.documentsDirectory) {
          //      directory = cordova.file.documentsDirectory; // for iOS
          //    } else {
          //      directory = cordova.file.externalRootDirectory; // for Android
          //    }
          //
          //
          //    //File for Upload
          //    var targetPath = directory+"ielts7band/profilePics/"+pic;
          //   //  alert(targetPath);
          //    // File name only
          //    var filename = targetPath.split("/").pop();
          //   //  alert(filename);
          //
          //   //  var timeSpent = "0:"+record.timer;
          //   $ionicLoading.show({template : 'Updating Profile...'});
          //
          //    var options = {
          //         fileKey: "file",
          //         fileName: filename,
          //         httpMethod: "POST",
          //        //  mimeType: "audio/vnd.wav",
          //         mimeType: "image/jpeg",
          //         params : {
          //                     'userId': $rootScope.userID,
          //                     'fname':profile.fname,
          //                     'lname': "",
          //                     'address': profile.address,
          //                     // 'country': profile.nationality,
          //                     // 'phone':profile.dialCode +" "+profile.phone,
          //                     'sex': profile.sex,
          //                     // 'pic': filename,
          //                     'file': filename
          //                  }, // directory represents remote directory,  fileName represents final remote file name
          //         chunkedMode: false
          //     };
          //
          //     $cordovaFileTransfer.upload(url, targetPath, options, true).then(function (res) {
          //       // alert("Success: "+JSON.stringify(res));
          //          $ionicLoading.hide();
          //          var alertPopup = $ionicPopup.alert({
          //              title: 'Success',
          //              template: 'Profile Updated Successfully',
          //              cssClass: 'Success'
          //          });
          //          alertPopup.then(function(res) {
          //            $rootScope.$emit('picChanged', {data: "true"});
          //            $state.go("app.user-dashobard", {}, {reload : true});
          //          });
          //       }, function (err) {
          //           // alert("Error "+err);
          //           $ionicLoading.hide();
          //           var alertPopup = $ionicPopup.alert({
          //               title: 'Error',
          //               template: 'Oops something went wrong...',
          //               cssClass: 'Error'
          //           });
          //           alertPopup.then(function(res) {
          //             $state.go("app.user-dashobard", {}, {reload : true});
          //           });
          //           // recordingModalService.hideModal();
          //       }, function (progress) {
          //           // PROGRESS HANDLING GOES HERE
          //       });
          // }
          // else{
              tabsService.updateProfileInfo(profile).then(function(response){
                //  alert(JSON.stringify(response.data));
                console.log(response);
                $ionicLoading.hide();
                 if(response.data.status == true){
                   window.plugins.toast.showWithOptions({
                        message: 'Profile Updated Successfully',
                        duration: 'long',
                        position: 'center',
                        styling: {
                          borderRadius: 30, // a bit less than default, 0 means a square Toast
                          backgroundColor: '#325f67', // make sure you use #RRGGBB. Default #333333
                          alpha: 180, // 0-255, 0 being fully transparent
                          padding: {
                            top: 50,
                            right: 30,
                            // bottom: 20,
                            left: 30
                         }
                      }
                    })
                   $timeout(function()
                   {
                   }, 2000);
                   // var alertPopup = $ionicPopup.alert({
                   //     title: 'Success',
                   //     template: 'Profile Updated Successfully',
                   //     cssClass: 'Success'
                   // });
                   // alertPopup.then(function(res) {
                   //   $state.go("app.user-dashobard", {}, {reload : true});
                   // });
                 }else if(response.data.status == false){
                   window.plugins.toast.showWithOptions({
                        message: 'No changes updated',
                        duration: 'long',
                        position: 'center',
                        styling: {
                          borderRadius: 30, // a bit less than default, 0 means a square Toast
                          backgroundColor: '#325f67', // make sure you use #RRGGBB. Default #333333
                          alpha: 180, // 0-255, 0 being fully transparent
                          padding: {
                            top: 50,
                            right: 30,
                            // bottom: 20,
                            left: 30
                         }
                      }
                    })
                   $timeout(function()
                   {
                   }, 2000);
                   // var alertPopup = $ionicPopup.alert({
                   //     title: 'Success',
                   //     template: 'Profile already updated',
                   //     cssClass: 'Success'
                   // });
                   // alertPopup.then(function(res) {
                   //   $state.go("app.user-dashobard", {}, {reload : true});
                   // });
                 }
              }, function(err){
                window.plugins.toast.showWithOptions({
                     message: 'Oops something went wrong...',
                     duration: 'long',
                     position: 'center',
                     styling: {
                       borderRadius: 30, // a bit less than default, 0 means a square Toast
                       backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                       alpha: 180, // 0-255, 0 being fully transparent
                       padding: {
                         top: 50,
                         right: 30,
                         // bottom: 20,
                         left: 30
                      }
                   }
                 })
                $timeout(function()
                {
                }, 2000);
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'Error',
                    //     template: 'Oops something went wrong...',
                    //     cssClass: 'Error'
                    // });
                    // alertPopup.then(function(res) {
                    //   $state.go("app.user-dashobard", {}, {reload : true});
                    // });
                  // alert("Unable to fetch the data");
              });
            // }
          };
      };

      function imagesSelectionCtrl($scope, imageModalService, $cordovaFile, $cordovaCamera, $cordovaFileTransfer, $ionicPopup) {
        var image = this;
        // var pictureSource = navigator.camera.PictureSourceType;
        // var destinationType = navigator.camera.DestinationType;

        image.selectPhoto = function(){


          navigator.camera.getPicture(onSuccess, onFail, {
                quality: 80,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                mediaType: Camera.MediaType.ALLMEDIA,
                encodingType: Camera.EncodingType.JPEG
          });

          function onSuccess(imageURL) {
            // alert(imageURL);
            if(imageURL == undefined || imageURL == ""){
              var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'Please select image from device',
                  cssClass: 'Error'
              });
            }else{
              var imageURI = 'file://' + imageURL;

              var options = new FileUploadOptions();
              options.fileKey = "file";
              options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
              options.mimeType = "image/jpeg";
              options.params = {}; // if we need to send parameters to the server request

              var res = imageURI.replace(options.fileName, "");
              var directory;
              if (cordova.file.documentsDirectory) {
                directory = cordova.file.documentsDirectory; // for iOS
              } else {
                directory = cordova.file.externalRootDirectory; // for Android
              }

              $cordovaFile.checkFile(directory+"ielts7band/profilePics/", options.fileName)
                .then(function (success) {
                  // alert("Success: "+JSON.stringify(success));
                  $scope.$emit('ProfilePicChange', {data : options.fileName});
                  imageModalService.hideModal();
                  // success
              }, function (error) {
                  // alert("Error: "+JSON.stringify(error));
                  $cordovaFile.copyFile(res, options.fileName, directory+"ielts7band/profilePics/", options.fileName)
                  .then(function (success) {
                    // alert("Copy: "+JSON.stringify(success));
                    $scope.$emit('ProfilePicChange', {data : options.fileName});
                    // image.profilePic = fileURI;

                    imageModalService.hideModal();
                    // success
                  }, function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Failed because: ' + error,
                            cssClass: 'Error'
                          });
                    // alert("Copy error: "+JSON.stringify(error));
                    // error
                  });
                // error
              });
            }
        };
        function onFail(message) {
          var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: 'Failed because: ' + message,
              cssClass: 'Error'
            });
              // alert('Failed because: ' + message);
          };
        };

        image.takeAPic = function(){
          navigator.camera.getPicture(onCapturePhoto, onFail, {
            quality: 100,
            destinationType: destinationType.FILE_URI
          });
        };

        var retries = 0;
        function onCapturePhoto(fileURI) {
          var win = function (r) {
              clearCache();
              retries = 0;
              // alert('Done!');
          };

          var fail = function (error) {
              if (retries == 0) {
                  retries ++
                  setTimeout(function() {
                      onCapturePhoto(fileURI)
                  }, 1000)
              } else {
                  retries = 0;
                  clearCache();
                  var alertPopup = $ionicPopup.alert({
                      title: 'Error',
                      template: 'Oops... Something wrong!',
                      cssClass: 'Error'
                  });
                  // alert('Ups. Something wrong happens!');
              }
          };

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.params = {}; // if we need to send parameters to the server request

            var res = fileURI.replace(options.fileName, "");
            var directory;
            if (cordova.file.documentsDirectory) {
              directory = cordova.file.documentsDirectory; // for iOS
            } else {
              directory = cordova.file.externalRootDirectory; // for Android
            }

            $cordovaFile.copyFile(res, options.fileName, directory+"ielts7band/profilePics/", options.fileName)
            .then(function (success) {
              // alert(success);
              // alert("Copy: "+JSON.stringify(success));
              image.profilePic = fileURI;
              $scope.$emit('ProfilePicChange', {data : options.fileName});
              imageModalService.hideModal();
              // success
            }, function (error) {
                // alert("Copy error: "+JSON.stringify(error));
              // error
            });
        };
        function onFail(message) {
          // alert('Failed because: ' + message);
        };

        image.closeModal = function() {
          imageModalService.hideModal();
        };


      };

      function feedbackCtrl(ProfileService, $rootScope, $ionicPopup, $ionicLoading, $state) {

        var vmFeedback = this;
        vmFeedback.Feedback = {};

        vmFeedback.SubmitFeedback = function(){
          console.log(vmFeedback.Feedback);
          $ionicLoading.show({template : 'Loading...'});
          ProfileService.sendFeedback(vmFeedback.Feedback).then(function(response){
            // console.log(data);
            if(response.data.status===true){
              var alertPopup = $ionicPopup.alert({
                  title: 'Success',
                  template: 'Feedback submitted successfully',
                    cssClass: 'Success'
              });
              $ionicLoading.hide();
              alertPopup.then(function(res) {
                $state.go('app.user-dashobard', {}, {reload : true});
              });
            }
            else{
              var alertPopup = $ionicPopup.alert({
                  title: 'Error',
                  template: 'Unable to send feedback, try again later!',
                    cssClass: 'Error'
              });
              $ionicLoading.hide();
              alertPopup.then(function(res) {
                $state.go('app.user-dashobard', {}, {reload : true});
              });
            }
          }, function(data, status, headers, config){
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Unable to send feedback, try again later!',
                      cssClass: 'Error'
                });
                $ionicLoading.hide();
                alertPopup.then(function(res) {
                  $state.go('app.user-dashobard', {}, {reload : true});
                });
          })
        };

      };

     function loginCtrl(loginModalService, LoginService, $ionicPopup, $state, enrollModalService, userService, forgotpwdModalService, $ionicLoading, $rootScope, registerModalService){

       var vmLogin = this;
       vmLogin.login = {};
       var result = {};
      //  $ionicLoading.hide();

       vmLogin.loginData = function(){
         $ionicLoading.show({template : 'Loading...'});
         var login = true;
         LoginService.loginUser(vmLogin.login.Username, vmLogin.login.Password, login).then(function(data) {
           console.log(data);
           // var userID =
           // return;
           if(data.id){
             userService.setData(data);
             $ionicLoading.hide();
             loginModalService.hideModal();
            //  registerModalService.hideModal();
             $state.go('app.user-dashobard', {}, {reload : true});
           }
           else if(data.userStatus === true){
             var confirmPopup = $ionicPopup.confirm({
               title: 'ALERT',
               template: 'Enrolled Successfully but payment is pending',
               cancelText: 'Use Free Trial',
               okText: 'Make Payment',
               cancelType: 'button-calm',
               okType: 'button-balanced',
               cssClass: 'QUIT'

             });
             $ionicLoading.hide();

             confirmPopup.then(function(res) {
                 if(res){
                   console.log("Payment");
                   var reg = {
                     emailid : vmLogin.login.Username,
                     page : "login"
                   }
                   userService.setData(reg);
                   enrollModalService.showModal();
                 }
                 else{
                   console.log("Free Trial");
                   LoginService.updateUserType(data.userID).then(function(data, status, headers, config){
                     console.log(data);
                     if(data.status){
                       var login = true;
                       LoginService.loginUser(vmLogin.login.Username, vmLogin.login.Password, login).then(function(res){
                           // console.log(res);
                           loginModalService.hideModal();
                           userService.setData(res);
                           $state.go('app.user-dashobard', {}, {reload : true});
                           $ionicLoading.hide();
                       });
                     }
                   }, function(data, status, headers, config) {

                   })
                 }
            })
           }
           else{
             $ionicLoading.hide();
             var alertPopup = $ionicPopup.alert({
                 title: 'Login failed!',
                 template: 'Please check your credentials!',
                 cssClass: 'Error'
             });
           }

              //  result = data;
              //  console.log(result);
              //  $rootScope.totalDays = result.totalDay;
              //  $rootScope.completed = result.Completed;

          }, function(err) {
                 $ionicLoading.hide();
                 var alertPopup = $ionicPopup.alert({
                     title: 'Login failed!',
                     template: 'Please check your credentials!',
                     cssClass: 'Error'
                 });

             });

        };

      //   vmLogin.LoginFB = function(){
      //     //  console.log("FB");
      //      facebookConnectPlugin.login(['email', 'public_profile'], function(response){
      //       //  alert("Login Success");
      //       //  alert(JSON.stringify(response));
      //
      //        // fetch details
      //        var authResponse = response.authResponse;
      //
      //        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      //          function (profileInfo) {
      //           //  alert(profileInfo.name);
      //             // alert(profileInfo.email);
      //             $ionicLoading.show({template : 'Loading...'});
      //             var reg = {
      //                         name: profileInfo.name,
      //                         emailid: profileInfo.email,
      //                         // country: "",
      //                         // phone_number: "",
      //                         module: "",
      //                         media: "facebook"
      //                       };
      //                       //
      //             // alert(JSON.stringify(reg));
      //             LoginService.loginSocial(reg).then(function(response){
      //               // alert(JSON.stringify(response));
      //                 // console.log(response);
      //                 // console.log($rootScope.Username);
      //                 // console.log($rootScope.userID);
      //                 // console.log($rootScope.enrollType);
      //                 // console.log($rootScope.Course);
      //                 // alert(JSON.stringify(response));
      //                 if(response.id){
      //                   $ionicLoading.hide();
      //                   loginModalService.hideModal();
      //                   $state.go("app.user-dashobard", {}, {reload : true});
      //                }
      //                else if(response.msg == "0"){
      //                  $ionicLoading.hide();
                       // var alertPopup = $ionicPopup.alert({
                       //     title: 'Error',
                       //     template: 'Unable to login. Try again later!',
                       //       cssClass: 'Error'
                       // });
                       //
                       // alertPopup.then(function(res) {
                       //   loginModalService.hideModal();
                       // });
      //                }
      //            });
      //             // $scope.user["email"] = profileInfo.email;
      //             // $scope.user["name"] = profileInfo.name;
      //             // $scope.user["picUrl"] = "http://graph.facebook.com/" + authResponse.userID + "/picture?type=small";
      //             // alert(JSON.stringify($scope.user));
      //          },
      //          function (fail) {
      //             // alert(fail);
      //          });
      //      }, function(error){
      //         //  alert(JSON.stringify(error));
      //      });
      // };
      //
      //   vmLogin.LoginGmail = function(){
      //     window.plugins.googleplus.login(
      //           {
      //             'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      //             'webClientId': '1002713911629-j0pijtgs7j342ki086svio7m3pipo64u.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      //             'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      //           },
      //           function (profileInfo) {
      //             // alert(JSON.stringify(profileInfo)); // do something useful instead of alerting
      //
      //             $ionicLoading.show({template : 'Loading...'});
      //             var reg = {
      //                         name: profileInfo.displayName,
      //                         emailid: profileInfo.email,
      //                         // country: "",
      //                         // phone_number: "",
      //                         module: "",
      //                         media: "google"
      //                       };
      //
      //             // alert(JSON.stringify(reg));
      //             LoginService.loginSocial(reg).then(function(response){
      //               // alert(JSON.stringify(response));
      //                 // console.log(response);
      //                 // console.log($rootScope.Username);
      //                 // console.log($rootScope.userID);
      //                 // console.log($rootScope.enrollType);
      //                 // console.log($rootScope.Course);
      //                 // alert(JSON.stringify(response));
      //                 if(response.id){
      //                   $ionicLoading.hide();
      //                   loginModalService.hideModal();
      //                   $state.go("app.user-dashobard", {}, {reload : true});
      //                }
      //                else if(response.msg == "0"){
      //                  $ionicLoading.hide();
      //                  var alertPopup = $ionicPopup.alert({
      //                      title: 'Error',
      //                      template: 'Unable to login. Try again later!',
      //                        cssClass: 'Error'
      //                  });
      //
      //                  alertPopup.then(function(res) {
      //                    loginModalService.hideModal();
      //                  });
      //                }
      //            });
      //           },
      //           function (msg) {
      //             alert('error: ' + msg);
      //           }
      //       );
      //   };

        vmLogin.newUser = function(){
          enrollModalService.showModal();
          //  loginModalService.hideModal();
       };

       vmLogin.forgotpwd = function() {
         forgotpwdModalService.showModal();
        //  loginModalService.hideModal();
       };

       vmLogin.closeLogin = function(){
         loginModalService.hideModal();
       }
    };

     function termsCtrl($scope, termsService){
       $scope.closeTerms = function(){
         termsService.hideModal();
       };
     };

     function faqsCtrl($scope, faqModalService, $http, $sce, $rootScope, $ionicLoading){
       $scope.frontend_faqs = "";
       function FAQS() {
         $ionicLoading.show({template : 'Loading...'});
         faqModalService.getFaqs().then(function(data){
           // console.log(data);
           $scope.frontend_faqs = $sce.trustAsResourceUrl(data);
           $ionicLoading.hide();
         }, function (error) {
              console.log(error);
         });
       };

       function userFAQS() {
         $ionicLoading.show({template : 'Loading...'});
         faqModalService.getUserFaqs().then(function(data){
           // console.log(data);
           $scope.frontend_faqs = $sce.trustAsResourceUrl(data);
           $ionicLoading.hide();
         }, function (error) {
              console.log(error);
         });
       };
       if(!$rootScope.loginStatus){
         FAQS();
       }
       else{
         userFAQS();
       }
       $scope.closeFaq = function(){
         faqModalService.hideModal();
       };
     };

    function registerCtrl(registerModalService, loginModalService, userService, $state, $ionicPopup, $rootScope, $ionicLoading, termsService,
        enrollModalService, LoginService){

      var vmRegister = this;
      vmRegister.Freereguser = {};
      vmRegister.res = [];
      vmRegister.userExists = false;
      vmRegister.num = false;
      vmRegister.mobilePattern = false;
      vmRegister.emailPattern = false;
      vmRegister.countriesList = [];

      vmRegister.openTerms = function(){
        termsService.showModal();
      };

      // vmRegister.checkNumberFormat = function(mobile) {
      //   if(!isValidMobileNumber(mobile)) {
      //     vmRegister.mobilePattern = true;
      //   }
      //   else {
      //     vmRegister.mobilePattern = false;
      //   }
      // };
      //
      // function isValidMobileNumber(number) {
      //     var pattern = new RegExp(/^[0-9]{7,}$/);
      //     return pattern.test(number);
      // };
      // vmRegister.loadCountries = function(){
      //   registerModalService.loadCountries().then(function(response){
      //     // console.log(response);
      //     vmRegister.countriesList = response.countries;
      //   });
      // };
      // vmRegister.loadCountries();
      vmRegister.status = false;
      vmRegister.checkEmailFormat = function(email) {
        if(!isValidEmailAddress(email)) {
          vmRegister.emailPattern = true;
        }
        else {
          vmRegister.status = true;
          vmRegister.emailPattern = false;

        }
        // console.log(vmRegister.status);
      };

      function isValidEmailAddress(emailAddress) {
          var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
          // vmRegister.status = true;
          // console.log(pattern.test(emailAddress));
          return pattern.test(emailAddress);
      };


      vmRegister.Modules=[{value:"1", name:"General IELTS"},{value:"2", name:"Academic IELTS"}];

      vmRegister.freeuser_reg = function(reg){
          // reg.media = "";
          // console.log(reg);
          $ionicLoading.show({template : 'Loading...'});
          LoginService.registerUser(reg).then(function(response){
            console.log(response);
            // return;
              var alertPopup;
              var popStatus;
              if(response.userType == "2" && response.regStatus == true){
                alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Registered Successfully.',
                    cssClass: 'Success'
                });
                popStatus = true;
                $ionicLoading.hide();
              }else if(response.userType == "2" && response.regStatus == false){
                alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Already Registered.',
                    cssClass: 'Success'
                  });
                  popStatus = true;
                  $ionicLoading.hide();
              }else if(response.userType == "1" && response.regStatus == false && response.payment == true){
                alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Already Registered.',
                    cssClass: 'Success'
                  });
                  popStatus = true;
                  $ionicLoading.hide();
              }else if(response.userType == "1" && response.regStatus == false && response.payment == false && !$rootScope.iosPlatform){
                var confirmPopup = $ionicPopup.confirm({
                  title: 'ALERT',
                  template: 'Enrolled Successfully but payment is pending',
                  cancelText: 'Use Free Trial',
                  okText: 'Make Payment',
                  cancelType: 'button-calm',
                  okType: 'button-balanced',
                  cssClass: 'QUIT'

                });
                popStatus = false;
                $ionicLoading.hide();

                confirmPopup.then(function(res) {
                    if(res){
                      console.log("Payment");
                      var details = {
                        emailid : reg.emailid,
                        name : reg.name,
                        page : "reg"
                      }
                      userService.setData(details)
                      enrollModalService.showModal();
                    }
                    else{
                      console.log("Free Trial");
                      LoginService.updateUserType(response.id).then(function(data, status, headers, config){
                        console.log(data);
                        if(data.status){
                          var login = false;
                          LoginService.loginUser(response.loginId, response.password, login).then(function(res){
                              // console.log(res);
                              registerModalService.hideModal();
                              userService.setData(res);
                              $state.go('app.user-dashobard', {}, {reload : true});
                              $ionicLoading.hide();
                          });
                        }
                      }, function(data, status, headers, config) {

                      })
                    }
               })
              }
              if(popStatus){

                alertPopup.then(function(res) {
                  $ionicLoading.show({template : 'Loading...'});
                  var login = false;
                  LoginService.loginUser(response.loginId, response.password, login).then(function(res){
                      console.log(res);
                      if(res){
                        registerModalService.hideModal();                        
                        userService.setData(res);
                        $state.go('app.user-dashobard', {}, {reload : true});
                        $ionicLoading.hide();                            
                        LoginService.updateMobileData($rootScope.uuid, $rootScope.userID)
                          .then(function(data, status, headers, config){
                            // alert("Success");        
                          }, function(data, status, headers, config){
                            // alert("Failed");
                        });
                                                                 
                      }
                      else{
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Login failed!',
                            template: 'Please try later!',
                            cssClass: 'Error'
                        });
                      }
                  });
                })
              }
              else if(!popStatus){
                console.log("Change");
              }
              else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'User Registration is not successful',
                    cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                  registerModalService.hideModal();
                });
              }
         }, function(error){
              $rootScope.$emit('no-data');
         });
      };

      vmRegister.LoginFB = function(){
        //  console.log("FB");
         facebookConnectPlugin.login(['email', 'public_profile'], function(response){
           // alert("Login Success");
           // alert(JSON.stringify(response));

           // fetch details
           var authResponse = response.authResponse;

           facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
             function (profileInfo) {
               // alert(profileInfo.name);
               //  alert(profileInfo.email);
                $ionicLoading.show({template : 'Loading...'});
                var reg = {
                            name: profileInfo.name,
                            emailid: profileInfo.email,
                            // country: "",
                            // phone_number: "",
                            module: "",
                            media: "facebook"
                          };
                          //
                // alert("FB DATA: "+JSON.stringify(reg));
                LoginService.loginSocial(reg).then(function(response){
                  // alert("FB RESULT: "+JSON.stringify(response));
                    // console.log(response);
                    // console.log($rootScope.Username);
                    // console.log($rootScope.userID);
                    // console.log($rootScope.enrollType);
                    // console.log($rootScope.Course);
                    // alert(JSON.stringify(response));
                    if(response.id){
                      $ionicLoading.hide();
                      registerModalService.hideModal();
                      $state.go("app.user-dashobard", {}, {reload : true});
                   }
                   else if(response.msg == "0"){
                     $ionicLoading.hide();
                     var alertPopup = $ionicPopup.alert({
                         title: 'Error',
                         template: 'Unable to login. Try again later!',
                         cssClass: 'Error'
                     });

                     alertPopup.then(function(res) {
                       registerModalService.hideModal();
                     });
                   }
               });
                // $scope.user["email"] = profileInfo.email;
                // $scope.user["name"] = profileInfo.name;
                // $scope.user["picUrl"] = "http://graph.facebook.com/" + authResponse.userID + "/picture?type=small";
                // alert(JSON.stringify($scope.user));
             },
             function (fail) {
                alert("Fail "+fail);
             });
         }, function(error){
            //  alert(JSON.stringify(error));
         });
       };

        vmRegister.LoginGmail = function(){
          window.plugins.googleplus.login(
                {
                  'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                  'webClientId': '1002713911629-j0pijtgs7j342ki086svio7m3pipo64u.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                  'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
                },
                function (profileInfo) {
                  // alert("G+ DATA: "+JSON.stringify(profileInfo)); // do something useful instead of alerting

                  $ionicLoading.show({template : 'Loading...'});
                  var reg = {
                              name: profileInfo.displayName,
                              emailid: profileInfo.email,
                              // country: "",
                              // phone_number: "",
                              module: "",
                              media: "google"
                            };

                  // alert("G+ DATA: "+JSON.stringify(reg));
                  LoginService.loginSocial(reg).then(function(response){
                    // alert("G+ RESPONSE: "+JSON.stringify(response));
                      // console.log(response);
                      // console.log($rootScope.Username);
                      // console.log($rootScope.userID);
                      // console.log($rootScope.enrollType);
                      // console.log($rootScope.Course);
                      // alert(JSON.stringify(response));
                      if(response.id){
                        $ionicLoading.hide();
                        registerModalService.hideModal();
                        $state.go("app.user-dashobard", {}, {reload : true});
                     }
                     else if(response.msg == "0"){
                       $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                           title: 'Error',
                           template: 'Unable to login. Try again later!',
                           cssClass: 'Error'
                       });

                       alertPopup.then(function(res) {
                         registerModalService.hideModal();
                       });
                     }
                 });
                },
                function (msg) {
                  alert('error: ' + msg);
                }
            );
        };

        vmRegister.closeFreetrail = function() {
          registerModalService.hideModal();
        };
    };

    function upgradePackageCtrl(upgradePackageService, userService, enrollModalService) {

      var vmUpgrade = this;

      vmUpgrade.selectOptions = [
        {"id":'40', "name": "Starter", color: '#8ac926'},
        {"id":'60', "name": "Master", color: '#ff595e'},
        {"id":'75', "name": "Expert", color: '#63adf2'}
     ];

      vmUpgrade.packageSelected = function(pack){
        if(pack != undefined){
          console.log(pack);
          userService.setData(pack);
          upgradePackageService.hideModal();
          enrollModalService.showModal();
        }
      };
      vmUpgrade.closeUpgrade = function(){
        upgradePackageService.hideModal();
      };
    };

   function DashCtrl($scope, userService, $ionicLoading, $ionicNavBarDelegate, LoginService, $state, $ionicPopup, $location, $rootScope, enrollModalService,
     SpeakingPaperService, packagesModalService, courseModalService, upgradePackageService, ListeningPaperService, $cordovaFile, tabsService,
     ReadingPaperService, WritingPaperService, ProfileService, $sce) {

       var vmDash = this;
       vmDash.data = {};
       var g1;
       // var url = "https://www.youtube.com/embed/GNs4Cucm7Xo?rel=0&amp";
       // vmDash.StaticURL = $sce.trustAsResourceUrl(url);
       // vmDash.StaticURL = $rootScope.StaticURL;

       $rootScope.$on('GetNewData', function(event, res) {
         // alert(res.data);
         if(res.data === true){
           // window.plugins.toast.showWithOptions({
           //      message: 'You are now Online',
           //      duration: 'long',
           //      position: 'center',
           //      styling: {
           //        borderRadius: 30, // a bit less than default, 0 means a square Toast
           //        backgroundColor: '#325f67', // make sure you use #RRGGBB. Default #333333
           //        alpha: 180, // 0-255, 0 being fully transparent
           //        padding: {
           //          top: 50,
           //          right: 30,
           //          // bottom: 20,
           //          left: 30
           //       }
           //    }
           //  })
            $state.go("app.user-dashobard", {}, {reload : true});
         }
         else{
           window.plugins.toast.showWithOptions({
                message: 'You are now Offline',
                duration: 'long',
                position: 'center',
                styling: {
                  borderRadius: 30, // a bit less than default, 0 means a square Toast
                  backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                  // color: "#fff",
                  alpha: 180, // 0-255, 0 being fully transparent
                  padding: {
                    top: 50,
                    right: 30,
                    // bottom: 20,
                    left: 30
                 }
              }
            })
            $state.go("app.user-dashobard", {}, {reload : true});
         }
       });

       vid = document.getElementsByTagName("iframe");
       if(vid) video = true;
       // console.log(video);
       function stopVideo() {
            // vid.pause();
            $('iframe').attr('src', $('iframe').attr('src'));
          //  iframe.postMessage('{"event":"command","func":"' + 'pauseVideo' +   '","args":""}', '*');
        };

        $ionicLoading.show({template : 'Loading...'});

      if(userService.getData() != undefined) {
        vmDash.data = userService.getData();
       //  console.log(vmDash.data);

        if(vmDash.data.course == "0" || $rootScope.Course == "0"){
          courseModalService.showModal();
        }
        // courseModalService.showModal();

        if($rootScope.Media != "" && vmDash.data.enrollType == "1"){
             var pack = vmDash.data.package;
             var Pack = pack + ".Package";
             LoginService.updatePack(Pack);
         }else if($rootScope.Password != "" && vmDash.data.enrollType == "1"){
             var pack = vmDash.data.package;
             var Pack = pack + ".Package";
             LoginService.updatePack(Pack);
           }
        userService.setData(null);
      }

      function freeUserData(){
        if($rootScope.Course != "0"){
          tabsService.getFreeTrialPapers($rootScope.userID, $rootScope.Username, $rootScope.Password, "listening", $rootScope.Course).success(function(payload) {
            // console.log(payload.list[0]);
            vmDash.listeningBand = payload.list[0].Band;
          });
          tabsService.getFreeTrialPapers($rootScope.userID, $rootScope.Username, $rootScope.Password, "reading", $rootScope.Course).success(function(payload) {
            // console.log(payload.list[0]);
            vmDash.readingBand = payload.list[0].Band;
          });
          tabsService.getFreeTrialPapers($rootScope.userID, $rootScope.Username, $rootScope.Password, "writing", $rootScope.Course).success(function(payload) {
            // console.log(payload.list[0]);
            vmDash.writingBand = payload.list[0].Band;
          });
          tabsService.getFreeTrialPapers($rootScope.userID, $rootScope.Username, $rootScope.Password, "speaking", $rootScope.Course).success(function(payload) {
            // console.log(payload.list[0]);
            vmDash.UploadedPapers = payload.list[0].UploadedPapers;
          });
        }
      };

      // console.log($rootScope.online);

        if($rootScope.enrollType == "1" && $rootScope.online){
          Days();
          Package();
        }
        if($rootScope.enrollType == "2" && $rootScope.online){
          freeUserData();
        }


       console.log("UserName: "+$rootScope.Username);
       console.log("User ID: "+$rootScope.userID);
       console.log("enrollType: "+$rootScope.enrollType);
       console.log("Media: "+$rootScope.Media);
       console.log("Course: "+$rootScope.Course);
       console.log("Password: "+$rootScope.Password);
       console.log("Package: "+$rootScope.Package);

      function getUserData(){
        ProfileService.getUserData().then(function(res){
          $ionicLoading.hide();
          if(res.data.msg != 0){
            $rootScope.Pic = baseurl+res.data.profile.pic.split("./")[1];
          }
         //  if(res.data.profile.pic && $rootScope.loginStatus){
         //  }
         //  alert(vmApp.Pic);
        }, function(err){
            // alert("Unable to fetch the data");
        });
      };
      // getUserData();

      $rootScope.$on('picChanged', function(event, res) {
          ProfileService.getUserData().then(function(res){
            $ionicLoading.hide();
            $rootScope.Pic = baseurl+res.data.profile.pic.split("./")[1];
           //  alert(vmApp.Pic);
          }, function(err){
              // alert("Unable to fetch the data");
          });
      });

       function Package(){
         if($rootScope.Media != ""){
          //  alert("I'm package media");
           LoginService.getSocialDates().then(function(data) {
              // alert("Social "+JSON.stringify(data));
              var pack = data.package;
              if(data.enrollType == "1"){
                $scope.$emit('updateSocialPackage', {dat : pack});
              }

                // $ionicLoading.hide();
            });
         }else if($rootScope.Password != ""){
          //  alert("I'm package normal");
           LoginService.getDates().then(function(data) {
              // alert("Normal "+JSON.stringify(data));
              var pack = data.package;
              if(data.enrollType == "1"){
                $scope.$emit('updateNormalPackage', {dat : pack});
              }
                // $ionicLoading.hide();
            });
         }
       };

        $rootScope.$on('moduleChanged', function(event, res) {
          var course = res.data + ".Course";
          LoginService.updateCourse(course).then(function(){
            $ionicLoading.hide();
            $state.go("app.user-dashobard", {}, {reload : true});
            // alert($rootScope.Course);
          });
        });

       $rootScope.$on('pwdChanged', function(event, res) {
         var login = false;
         LoginService.loginUser($rootScope.Username, res.data, login);
         $state.go("app.user-dashobard", {}, {reload : true});
         $rootScope.Password = res.data;
       });


      //  var path = $location.path();
      //  if ((path.indexOf('dashboard') != -1)) $ionicNavBarDelegate.showBackButton(false);
      //  else  $ionicNavBarDelegate.showBackButton(true);

      $rootScope.$on('enrolledUser', function(event, res) {
        console.log(res.data);
        var type = res.data + ".yourType";
        LoginService.updateEnrollType(type).then(function(){
          $ionicLoading.hide();
          console.log($rootScope.enrollType);
        });
      });
      // upgradePackageService.showModal();
       function Days(){
         $ionicLoading.show({template : 'Loading...'});
         if($rootScope.Media != "" && $rootScope.enrollType == "1"){
            $ionicLoading.show({template : 'Loading...'});
           LoginService.getSocialDates().then(function(data) {
              // alert("Social dates "+JSON.stringify(data));

              if(data.payment === 0){
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'You are an enrolled user but payment is pending.',
                    cssClass: 'QUIT'
                  });
                alertPopup.then(function(res) {
                    enrollModalService.showModal();
                });
              }
              else{
                vmDash.totalDays = data.totalDay;
                vmDash.completed = data.Completed;
                $rootScope.remDays = data.totalDay - data.Completed;
                $ionicLoading.hide();
                if($rootScope.remDays < 1){
                  var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Package expired. Please renew it',
                      cssClass: 'QUIT'
                    });
                  alertPopup.then(function(res) {
                      enrollModalService.showModal();
                  });
                }
                // console.log($rootScope.remDays);
                $rootScope.package = data.package;
               //  console.log($rootScope.package);
                  // var g = new JustGage({
                  //   id: "gauge",
                  //   value: parseInt(vmDash.completed),
                  //   min: 0,
                  //   max: parseInt(vmDash.totalDays)
                  // });

                  g1 = new JustGage({
                      id: "g1",
                      value: parseInt(vmDash.completed),
                      min: 0,
                      max: parseInt(vmDash.totalDays),
                      title: "",
                      label: ""
                  });
              }
              $ionicLoading.hide();
            });
         }else if($rootScope.Password != "" && $rootScope.enrollType == "1"){
            $ionicLoading.show({template : 'Loading...'});
           LoginService.getDates().then(function(data) {
             console.log(data);
            //  alert("Dates normal "+JSON.stringify(data));
              if(data.payment === 0){
                var confirmPopup = $ionicPopup.confirm({
                  title: 'ALERT',
                  template: 'You are an enrolled user but payment is pending.',
                  cancelText: 'Use Free Trial',
                  okText: 'Make Payment',
                  cancelType: 'button-calm',
                  okType: 'button-balanced',
                  cssClass: 'QUIT'

                });
                $ionicLoading.hide();

                confirmPopup.then(function(res) {
                    if(res){
                      enrollModalService.showModal();
                    }
                    else{
                      $ionicLoading.show({template : 'Loading...'});
                      LoginService.updateUserType(data.id).then(function(data, status, headers, config){
                        console.log(data);
                        if(data.status){
                          var login = false;
                          LoginService.loginUser($rootScope.Username, $rootScope.Password, login).then(function(res){
                              window.location.reload();
                          });
                        }
                      }, function(data, status, headers, config) {

                      })
                    }
                  })



                // var alertPopup = $ionicPopup.alert({
                //     title: 'Alert',
                //     template: 'You are an enrolled user but payment is pending.',
                //     cssClass: 'QUIT'
                //   });
                // alertPopup.then(function(res) {
                //     upgradePackageService.showModal();
                // });
              }
              else{
                vmDash.totalDays = data.totalDay;
                vmDash.completed = data.Completed;
                $rootScope.remDays = data.totalDay - data.Completed;
                $ionicLoading.hide();
                // console.log($rootScope.remDays);
                // console.log(data);
                if($rootScope.remDays < 1){
                  var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Package expired. Please renew it',
                      cssClass: 'QUIT'
                    });
                  alertPopup.then(function(res) {
                      enrollModalService.showModal();
                  });
                }

                $rootScope.package = data.package;
               //  console.log($rootScope.package);
                  // var g = new JustGage({
                  //   id: "gauge",
                  //   value: parseInt(vmDash.completed),
                  //   min: 0,
                  //   max: parseInt(vmDash.totalDays)
                  // });

                  g1 = new JustGage({
                      id: "g1",
                      value: parseInt(vmDash.completed),
                      min: 0,
                      max: parseInt(vmDash.totalDays),
                      title: "",
                      label: ""
                  });

              }
              $ionicLoading.hide();
            });
         }
       };

       $ionicLoading.hide();

       vmDash.upgradePackage = function() {
         if(video){
           stopVideo();
         }
         packagesModalService.showModal();
       };
       vmDash.res = [];
       function getFreeTrialData(password, examType) {
        //  $ionicLoading.show({template : 'Loading...'});
         tabsService.getFreeTrialPapers($rootScope.userID, $rootScope.Username, password, examType, $rootScope.Course).success(function(payload) {
           vmDash.res = payload.list;
          //  alert(JSON.stringify(payload.list));
           $ionicLoading.hide();
           if(payload.msg == "Technical Error Contact To Admin"){
             $rootScope.$emit('no-data');
           }
           else{
             if(examType == "listening"){
               var data = {paperID : vmDash.res[0].Question, link : "abc"};
              //  $ionicLoading.hide();
               userService.setData(data);
               ListeningPaperService.showModal();
             }else if(examType == "reading"){
               var data = vmDash.res[0].Question;
              //  $ionicLoading.hide();
               userService.setData(data);
               ReadingPaperService.showModal();
             }else if(examType == "writing"){
               var data = vmDash.res[0].Question;
              //  $ionicLoading.hide();
               userService.setData(data);
               WritingPaperService.showModal();
             }else if(examType == "speaking"){
               var data = vmDash.res[0];
              //  $ionicLoading.hide();
              console.log(data);
              // alert(JSON.stringify(data.Question));
              // alert(JSON.stringify(data.$$hashKey));
               userService.setData(data);
               SpeakingPaperService.showModal();
             }
           }
          //  $ionicLoading.hide();
         }, function(errorPayload) {
              $rootScope.$emit('no-data');
            //  console.log('failure loading movie', errorPayload);
            //  $ionicLoading.hide();
         });
       };

       vmDash.listen = function(){
         if(video){
           stopVideo();
         }
           $ionicLoading.show({template : 'Loading...'});
           if($rootScope.enrollType === "1"){
             $state.go("app.practicetest.listening", {}, {reload : true});
           }else if($rootScope.Media && $rootScope.enrollType === "2"){
             var examType = "listening";
             var password = "";
             getFreeTrialData(password, examType);
             // $ionicLoading.hide();
           }else if ($rootScope.Password && $rootScope.enrollType === "2") {
             var examType = "listening";
             getFreeTrialData($rootScope.Password, examType);
           }
           else{
             $rootScope.$emit('no-data');
           }
       };

       vmDash.read = function(){
         if(video){
           stopVideo();
         }
          $ionicLoading.show({template : 'Loading...'});
          //  $state.go("app.practicetest.reading", {}, {reload : true});
          if($rootScope.enrollType === "1"){
            $state.go("app.practicetest.reading", {}, {reload : true});
          }else if($rootScope.Media && $rootScope.enrollType === "2"){
            var examType = "reading";
            var password = "";
            getFreeTrialData(password, examType);
          }else if ($rootScope.Password && $rootScope.enrollType === "2") {
            var examType = "reading";
             getFreeTrialData($rootScope.Password, examType);
          }
        };

       vmDash.write = function(){
         if(video){
           stopVideo();
         }
          $ionicLoading.show({template : 'Loading...'});
          //  $state.go("app.practicetest.writing", {}, {reload : true});
          if($rootScope.enrollType === "1"){
            $state.go("app.practicetest.writing", {}, {reload : true});
          }else if($rootScope.Media && $rootScope.enrollType === "2"){
            var examType = "writing";
            var password = "";
            getFreeTrialData(password, examType);
          }else if ($rootScope.Password && $rootScope.enrollType === "2") {
            var examType = "writing";
             getFreeTrialData($rootScope.Password, examType);
          }
       };

       vmDash.speak = function(){
         if(video){
           stopVideo();
         }
         $ionicLoading.show({template : 'Loading...'});
         if($rootScope.enrollType === "1"){
           $state.go("app.practicetest.speaking", {}, {reload : true});
         }
         else if($rootScope.Media && $rootScope.enrollType === "2"){
           var examType = "speaking";
           var password = "";
           getFreeTrialData(password, examType);
         }else if ($rootScope.Password && $rootScope.enrollType === "2") {
           var examType = "speaking";
            getFreeTrialData($rootScope.Password, examType);
         }
       };
  };


     function selectCourseCtrl($scope, courseModalService, $rootScope, $ionicLoading, ProfileService, $ionicPopup,  $state) {

       var vmModule = this;

       vmModule.selectOptions = [
          {"id":'1', "name": "General IELTS", color: '#17b3f0'},
          {"id":'2', "name": "Academic IELTS", color: '#17b3f0'}
       ];
       vmModule.courseSelected = function(course) {
         if(course != undefined){
           ProfileService.updateModule(course).then(function(res){
             var alertPopup = $ionicPopup.alert({
                 title: 'Success',
                 template: 'Module updated successfully!',
                 cssClass: 'Success'
             });

             alertPopup.then(function(res) {
               courseModalService.hideModal();
               $scope.$emit('moduleChanged', {data : course});
               $ionicLoading.show({template : 'Loading...'});
               $state.go("app.user-dashobard", {}, {reload : true});
             });
          }, function(error){
               var alertPopup = $ionicPopup.alert({
                   title: 'Error',
                   template: 'Something went wrong!',
                   cssClass: 'Error'
               });
          });
         }
       };
     };

   function enrollCtrl($scope, $state, ProfileService, enrollModalService, userService, $rootScope, registerModalService, $ionicLoading, loginModalService,
                starterModalService, masterModalService, expertModalService, packagesModalService, $ionicPopup, $sce, termsService,
                LoginService, $ionicHistory, $http) {

     $scope.enroll = {};
     $scope.enrollSuccess = false;
     $scope.countriesList = [];
     var pack = "";
     // $scope.colors = ['#8ac926  ','#ff595e', '#63adf2'];
     $scope.selectOptions = [
        {"id":'40', "name": "Starter", color: '#8ac926'},
        {"id":'60', "name": "Master", color: '#ff595e'},
        {"id":'75', "name": "Expert", color: '#63adf2'}
     ];

     $scope.Modules=[
        {value:"1", name:"General IELTS", color: '#17b3f0'},
        {value:"2", name:"Academic IELTS", color: '#17b3f0'}
     ];

     $scope.openTerms = function(){
       termsService.showModal();
     };

     $scope.status = false;
      $scope.checkEmailFormat = function(email) {
        if(!isValidEmailAddress(email)) {
          $scope.emailPattern = true;
        }
        else {
          $scope.emailPattern = false;
          if($rootScope.userID){
            $scope.oldUser = true;
            $scope.status = true;
          }
          else{
            LoginService.checkUserType(email).then(function(response){
              console.log(response);
              if(response.status == false){
                $scope.oldUser = false;
                $scope.status = true;
              }
              else if(response.id){
                // if(response.payment == true){
                  $scope.oldUser = true;
                  $scope.status = true;                
              }
              // return;
            });
          }
        }
      };

      function isValidEmailAddress(emailAddress) {
          var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
          return pattern.test(emailAddress);
      };

     function getUserData(){
       ProfileService.getUserData().then(function(res){
          var data = res.data.profile;
          // console.log(data);
          // var mobile = data.phone.split(" ");
          $scope.enroll.fname = data.fname;
          // $scope.enroll.dialCode = mobile[0];
          // $scope.enroll.phone = parseInt(mobile[1]);
          // $scope.enroll.Module = data.examtypeid;
          // $scope.enroll.Country = data.nationality;

        //  vmProfile.profile = res.data.profile;
       }, function(err){
           // alert("Unable to fetch the data");
       });
     };



     if(userService.getData() != undefined) {
       if($rootScope.userID){
         $scope.status = true;
         $scope.enroll.EmailId =  $rootScope.Username;
         pack = userService.getData();
         $scope.enroll.Choice = pack;
         // console.log($scope.enroll.Choice);
         if(!angular.equals({}, $scope.enroll.Choice)){
           $scope.enrollPath = true;
         }
         else{
           $scope.enrollPath = false;
           $scope.enroll.Choice = "60";
         }
        //  getUserData();
       }
       else{
         var userDetails = userService.getData();
         $scope.status = true;
         if(userDetails.page === "login"){
           $scope.enroll.EmailId = userDetails.emailid;
           $scope.enroll.Choice = "60";
           $scope.LogPath = true;
           // pack = "";
         }
         else if(userDetails.page === "reg"){
           $scope.enroll.fname = userDetails.name;
           $scope.enroll.EmailId = userDetails.emailid;
           $scope.enroll.Choice = "60";
           $scope.RegPath = true;
           // pack = "";
         }
         else if(!angular.equals({}, userDetails)){
           $scope.enroll.Choice = userDetails;
           pack = userDetails;
           $scope.enrollPath = true;
         }
         else{
           $scope.enroll.Choice = "60";
           $scope.enrollPath = false;
         }
       }
       userService.setData(null);
     }
     else{
       $scope.enroll.Choice = "60";
       $scope.enrollPath = false;
       pack = "";
       if($rootScope.userID){
         $scope.status = true;
         $scope.enroll.EmailId =  $rootScope.Username;
       }else{
       }
     }
     
    //  console.log($scope.enrollPath);
     //  $scope.loadCountries = function(){
    //    registerModalService.loadCountries().then(function(response){
    //     //  console.log(response);
    //      $scope.countriesList = response.countries;
    //    });
    //  };
    //  $scope.loadCountries();
     //
    //  $scope.enroll.dialCode = "+61";
     //
    //  $scope.getCountrycode = function(country){
    //    angular.forEach($scope.countriesList, function (value, key){
    //      if(value.dial_code == country){
    //        $scope.enroll.dialCode = value.dial_code;
    //      }
    //    })
    //  };
    //  $scope.checkNumberFormat = function(mobile) {
    //    if(!isValidMobileNumber(mobile)) {
    //      $scope.mobilePattern = true;
    //    }
    //    else {
    //      $scope.mobilePattern = false;
    //    }
    //  };
     //
    //  function isValidMobileNumber(number) {
    //      var pattern = new RegExp(/^[0-9]{7,}$/);
    //      return pattern.test(number);
    //  };

     $scope.enrollUser = function(enroll){
      // console.log($scope.enroll);
      // return;
      if(!angular.equals({}, enroll.Choice) && enroll.Choice != undefined){

          console.log(enroll);
          // return;
             if($rootScope.userID){
               console.log("Update");
               $scope.oldUser = true;
               var userData = {
                 fname : $scope.enroll.fname,
                 EmailId : $scope.enroll.EmailId,
                 userID : $rootScope.userID,
                 Module  : $scope.enroll.Module,
                 Choice  : $scope.enroll.Choice
               };
               $ionicLoading.show({template : 'Redirecting to payment gateway...'});
               LoginService.updateEnrollUser(userData).then(function(response){
                 console.log(response);
                 if(response){
                   $rootScope.$emit("enrolledUser", {data: "1"});
                  //  alert("Old User");
                  console.log($rootScope.enrollType);
                   $scope.enrollSuccess = true;
                   console.log(response);
                   var data;
                   data = response.split("||");

                     if (data[0] == "yes") {

                         var ORDER_ID = data[1];
                         var ACCOUNT = data[2];
                         var TIMESTAMP = data[3];
                         var CURRENCY = "USD";
                         var AMOUNT = data[5];
                         var MD5HASH = data[6];
                         var MERCHANT_ID = data[7];
                         var enrollApp = "app";   

                         if($rootScope.iosPlatform){
                          $scope.enrollSuccess = false;
                          var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;                           
                          var URL = cordova.InAppBrowser
                                      .open(encodeURI(payment), '_blank', 'location=no');
                                      $ionicLoading.hide();
                         }
                         else{
                          $scope.enrollSuccess = true;
                            var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;
                            console.log(payment);
                            $scope.payment = $sce.trustAsResourceUrl(payment);
                            $ionicLoading.hide();
                         }
                   
                        
                         // cordova.InAppBrowser.open(payment, '_blank', 'location=no');
                         
                      }
                   }
                   else{
                     $ionicLoading.hide();
                   }
                });
             }
             else{
               $ionicLoading.show({template : 'Redirecting...'});
               LoginService.checkUserType($scope.enroll.EmailId).then(function(response){
                 console.log(response);

                 if(response.status == false){  
                   $scope.oldUser = false;
                   console.log("New");
                   LoginService.enrollUser(enroll).then(function(response){
                     console.log(response);
                     if(response){
                       // $rootScope.$emit("enrolledUser", {data: "1"});
                      //  alert("New User");
                       $scope.enrollSuccess = true;
                       console.log(response);

                       var data;
                       data = response.split("||");

                         if (data[0] == "yes") {

                             var ORDER_ID = data[1];
                             var ACCOUNT = data[2];
                             var TIMESTAMP = data[3];
                             var CURRENCY = "USD";
                             var AMOUNT = data[5];
                             var MD5HASH = data[6];
                             var MERCHANT_ID = data[7];                
                             var newuser = "new";   
                             var enrollApp = "app";   
                   
                             if($rootScope.iosPlatform){
                              $scope.enrollSuccess = false;
                              var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;                           
                              var URL = cordova.InAppBrowser
                                          .open(encodeURI(payment), '_blank', 'location=no');
                                          $ionicLoading.hide();
                             }
                             else{
                              $scope.enrollSuccess = true;
                                var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;
                                console.log(payment);
                                $scope.payment = $sce.trustAsResourceUrl(payment);
                                $ionicLoading.hide();
                             }

                              // var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp+"&newuser="+newuser;
                              // console.log(payment);
                              
                              // // cordova.InAppBrowser.open(payment, '_blank', 'location=no');
                              // $scope.payment = $sce.trustAsResourceUrl(payment);
                              // $ionicLoading.hide();
                             
                          }
                       }
                       else{
                         $ionicLoading.hide();
                       }
                    });
                 }
                 else if(response.id && response.userType == "1" && response.payment === true){
                   console.log("Stop");
                   // if(response.payment == true){
                     $scope.oldUser = true;
                     $ionicLoading.hide();
                     // $scope.status = false;
                     var alertPopup = $ionicPopup.alert({
                       title: 'Alert',
                       template: 'This user already has a package. Please login!',
                       cssClass: 'Error'
                     });

                    alertPopup.then(function(res) {
                     // $scope.enroll.EmailId = "";
                    });
                   }
                   else if(response.id && (response.userType == "1" || response.userType == "2") && response.payment === false){
                       console.log("Update");
                       $scope.oldUser = true;
                       var userData = {
                       fname : enroll.fname,
                       EmailId : enroll.EmailId,
                       userID : response.id,
                       Module  : enroll.Module,
                       Choice  : enroll.Choice
                     }
                    LoginService.updateEnrollUser(userData).then(function(response){
                      console.log(response);
                      if(response){
                        // $rootScope.$emit("enrolledUser", {data: "1"});
                       //  alert("Old User");
                       // console.log($rootScope.enrollType);
                        $scope.enrollSuccess = true;
                       //  console.log(response);
                        var data;
                        data = response.split("||");
                   
                          if (data[0] == "yes") {
                   
                              var ORDER_ID = data[1];
                              var ACCOUNT = data[2];
                              var TIMESTAMP = data[3];
                              var CURRENCY = "USD";
                              var AMOUNT = data[5];
                              var MD5HASH = data[6];
                              var MERCHANT_ID = data[7];
                              
                              var enrollApp = "app";   
                   
                              if($rootScope.iosPlatform){
                                $scope.enrollSuccess = false;
                                var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;                           
                                var URL = cordova.InAppBrowser
                                            .open(encodeURI(payment), '_blank', 'location=no');
                                            $ionicLoading.hide();
                               }
                               else{
                                $scope.enrollSuccess = true;
                                  var payment = baseurl+"payment/request?ORDER_ID="+ORDER_ID+"&ACCOUNT="+ACCOUNT+"&TIMESTAMP="+TIMESTAMP+"&CURRENCY="+CURRENCY+"&AMOUNT="+AMOUNT+"&MD5HASH="+MD5HASH+"&MERCHANT_ID="+MERCHANT_ID+"&enrollApp="+enrollApp;
                                  console.log(payment);
                                  $scope.payment = $sce.trustAsResourceUrl(payment);
                                  $ionicLoading.hide();
                               }                        
                           }
                        }
                        else{
                          $ionicLoading.hide();
                        }
                     });
                   }
             })
           }
       }else{
         var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: 'Please select a package.',
           cssClass: 'Error'
         });

        alertPopup.then(function(res) {
         //  listen.showTimer = false;
        //  console.log("hi");
        });
       }
      };

     $scope.closeEnroll = function() {
       // console.log($scope.enroll.Choice);
       // console.log(pack);
       if($rootScope.online){
         $rootScope.enrollOffline = false;
       }
       else{
         $rootScope.enrollOffline = true;
       }
       if($scope.enrollSuccess){
        //  alert("Success");
        if($rootScope.userID && $rootScope.Password){
          $ionicLoading.show({template : 'Loading...'});
          var login = true;
          LoginService.loginUser($rootScope.Username, $rootScope.Password, login).then(function(data){
            console.log(data);
            if(data.id){
              window.location.reload();
            }
            else if(data.userStatus === true){
              var confirmPopup = $ionicPopup.confirm({
                title: 'ALERT',
                template: 'Enrolled Successfully but payment is pending',
                cancelText: 'Use Free Trial',
                okText: 'Make Payment',
                cancelType: 'button-calm',
                okType: 'button-balanced',
                cssClass: 'QUIT'
              });
              $ionicLoading.hide();

              confirmPopup.then(function(res) {
                  if(res){
                    console.log("Payment");
                  }
                  else{
                    $ionicLoading.show({template : 'Loading...'});
                    LoginService.updateUserType(data.userID).then(function(data, status, headers, config){
                      console.log(data);
                      if(data.status){
                        var login = false;
                        LoginService.loginUser($rootScope.Username, $rootScope.Password, login).then(function(res){
                            window.location.reload();
                        });
                      }
                    })
                  }
                });
            }
          });
          // $ionicLoading.show({template : 'Loading...'});
        }else{
          var reg = {
            emailid : $scope.enroll.EmailId,
            name : $scope.enroll.fname
          };
          $ionicLoading.show({template : 'Loading...'});
          LoginService.registerUser(reg).then(function(response){
            console.log(response);
            // return;
            if(response.userType == "1" && response.payment == true){
                var alertPopup = $ionicPopup.alert({
                    title: 'Success',
                    template: 'Enrolled Successfully',
                    cssClass: 'Success'
                  });
                  $ionicLoading.hide();
                  alertPopup.then(function(res) {
                    // alert("hi");
                      $ionicLoading.show({template : 'Loading...'});
                      var login = false;
                      LoginService.loginUser(response.loginId, response.password, login).then(function(data){
                        console.log(data);
                        if(data.id){
                          userService.setData(data);
                          $ionicLoading.hide();
                          enrollModalService.hideModal();
                          // if($scope.enrollPath && pack == "40"){
                          //   starterModalService.hideModal();
                          // }
                          // else if($scope.enrollPath && pack == "60"){
                          //   masterModalService.hideModal();
                          // }
                          // else if($scope.enrollPath && pack == "75"){
                          //   expertModalService.hideModal();
                          // }
                          if($scope.enrollPath){
                            packagesModalService.hideModal();
                          }
                          if($scope.LogPath){
                            loginModalService.hideModal();
                          }else if($scope.RegPath){
                            registerModalService.hideModal();
                          }
                          $state.go('app.user-dashobard', {}, {reload : true});
                          // window.location.reload();
                        }
                      })
                 })
            }
            else if(response.userType == "1" && response.payment == false){
              var confirmPopup = $ionicPopup.confirm({
                title: 'ALERT',
                template: 'Enrolled Successfully but payment is pending',
                cancelText: 'Use Free Trial',
                okText: 'Make Payment',
                cancelType: 'button-calm',
                okType: 'button-balanced',
                cssClass: 'QUIT'

              });
              $ionicLoading.hide();

              confirmPopup.then(function(res) {
                  if(res){
                    console.log("Payment");
                  }
                  else{
                    $ionicLoading.show({template : 'Loading...'});
                    LoginService.updateUserType(response.id).then(function(data, status, headers, config){
                      console.log(data);
                      $ionicLoading.hide()
                      if(data.status){
                        var login = false;
                        LoginService.loginUser(response.loginId, response.password, login).then(function(res){
                          $state.go('app.user-dashobard', {}, {reload : true});
                          console.log(res);
                          if(res.id){
                            enrollModalService.hideModal();
                            // if($scope.enrollPath && pack == "40"){
                            //   starterModalService.hideModal();
                            // }
                            // else if($scope.enrollPath && pack == "60"){
                            //   masterModalService.hideModal();
                            // }
                            // else if($scope.enrollPath && pack == "75"){
                            //   expertModalService.hideModal();
                            // }
                            if($scope.enrollPath){
                              packagesModalService.hideModal();
                            }
                            if($scope.LogPath){
                              loginModalService.hideModal();
                            }else if($scope.RegPath){
                              registerModalService.hideModal();
                            }
                          }
                          else{
                            enrollModalService.hideModal();
                            $rootScope.$emit('no-data');
                          }

                        }, function(res){
                          enrollModalService.hideModal();
                          $rootScope.$emit('no-data');
                        });
                      }

                    }, function(data, status, headers, config) {
                         
                    })
                  }
                });
            }
            else{
              enrollModalService.hideModal();
            }
          })
        }
       }
       else{
         if($rootScope.userID){
             $ionicLoading.show({template : 'Loading...'});
             var login = true;
             LoginService.loginUser($rootScope.Username, $rootScope.Password, login).then(function(data){
               console.log(data);
               if(data.id && data.enrollType === "1"){
                 userService.setData(data);
                 $ionicLoading.hide();
                 $state.go('app.user-dashobard', {}, {reload : true});
                 window.location.reload();
               }
               else if(data.userStatus === true){
                 var confirmPopup = $ionicPopup.confirm({
                   title: 'ALERT',
                   template: 'You are enrolled user but payment is pending',
                   cancelText: 'Use Free Trial',
                   okText: 'Make Payment',
                   cancelType: 'button-calm',
                   okType: 'button-balanced',
                   cssClass: 'QUIT'

                 });
                 $ionicLoading.hide();

                 confirmPopup.then(function(res) {
                     if(res){

                     }
                     else{
                       LoginService.updateUserType(data.userID).then(function(data, status, headers, config){
                         console.log(data);
                         if(data.status){
                           var login = false;
                           LoginService.loginUser($rootScope.Username, $rootScope.Password, login).then(function(res){
                               // console.log(res);
                               enrollModalService.hideModal();
                               userService.setData(res);
                               $state.go('app.user-dashobard', {}, {reload : true});
                               $ionicLoading.hide();
                           });
                         }
                       }, function(data, status, headers, config) {

                       })
                     }
                   })
                   //     $rootScope.$emit("notPaidUser");

               }
               else{
                 $ionicLoading.hide();
                 enrollModalService.hideModal();
               }
             });
           }
           else{
             $ionicLoading.hide();
             enrollModalService.hideModal();
           }
       }
     };
   };

   function HomeCtrl($rootScope, LoginService, $sce) {

     var vmHome = this;

     vid = document.getElementsByTagName("iframe");
     if(vid) video = true;
     // console.log(video);
   };

   function forgotpwdCtrl(forgotpwdModalService, $rootScope, LoginService, $ionicPopup, loginModalService, $ionicLoading) {

     var vmForgotPwd = this;

     vmForgotPwd.forgetPassword = function(email){
       if(email){
         $ionicLoading.show({template : 'Loading...'});
         LoginService.forgotPasscode(email).then(function(data, status, headers, config){
           var alertPopup;
           var popUp;
           $ionicLoading.hide();
            if(data.status === true && data.payment === true){
              popUp = true;
              alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'Password is sent to your email',
                cssClass: 'Success'
              });
            }
            else if(data.status === false && data.payment === false){
              popUp = false;
              alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'You are an enrolled user but payment is pending. Please complete the payment and try again.',
                cssClass: 'Success'
              });
            }
            else if(data.status === true && data.payment === false){
              popUp = false;
              alertPopup = $ionicPopup.alert({
                title: 'Success!',
                template: 'Password is sent to your email',
                cssClass: 'Success'
              });
            }
            else{
              popUp = true;
              alertPopup = $ionicPopup.alert({
                title: 'Alert!',
                template: 'User does not exists. Please check email.',
                cssClass: 'Error'
              });
            }
            alertPopup.then(function(res) {
               if(popUp){
                 forgotpwdModalService.hideModal();
                 // loginModalService.hideModal();
               }
               else{
                 forgotpwdModalService.hideModal();
                 loginModalService.hideModal();
               }

            });
            console.log(data);
         }, function(data, status, headers, config){
              console.log(data);
         })
       }
       else{
         window.plugins.toast.showWithOptions({
              message: 'Please enter email',
              duration: 'long',
              position: 'center',
              styling: {
                borderRadius: 30, // a bit less than default, 0 means a square Toast
                backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                alpha: 180, // 0-255, 0 being fully transparent
                padding: {
                  top: 50,
                  right: 30,
                  // bottom: 20,
                  left: 30
               }
            }
          })
         $timeout(function()
         {
         }, 1000);
       }
     };

     vmForgotPwd.closeForgotPwd = function(){
       forgotpwdModalService.hideModal();
     };
   };


   //starter package functionality
   function starterCtrl(starterModalService, enrollModalService, userService, $rootScope) {

       var vmStarter = this;

       vmStarter.closeIelts_starter = function() {
         starterModalService.hideModal();
       };

       // starter enroll
       var module = "40";
       vmStarter.enrollStarter = function() {
      //  starterModalService.hideModal();
       userService.setData(module);
       enrollModalService.showModal();
   };

 };

   //master package functionality
   function masterCtrl(masterModalService, enrollModalService, userService, $rootScope) {

       var vmMaster = this;

       vmMaster.closeIelts_master = function() {
         masterModalService.hideModal();
       };

       // master enroll
       var module = "60";
       vmMaster.enrollMaster = function(){
      //  masterModalService.hideModal();
        userService.setData(module);
        enrollModalService.showModal();
     };
   };

   //expert package functionality
   function expertCtrl(expertModalService, enrollModalService, userService, $rootScope) {

       var vmExperts = this;

       vmExperts.closeIelts_expert = function() {
         expertModalService.hideModal();
       };

       // expert enroll
       var module = "75";
       vmExperts.enrollExpert = function(){
      //  expertModalService.hideModal();
       userService.setData(module);
       enrollModalService.showModal();
     };
   };

   function packageCtrl(packagesModalService, userService, enrollModalService, $rootScope) {

       var vmPackage = this;

       // Enroll package Modals open
       vmPackage.ielts_starter = function() {
         var module = "40";
         userService.setData(module);
         enrollModalService.showModal();
             // starterModalService.showModal();
            //  vmPackage.closePackages();
       };
       vmPackage.ielts_master = function() {
         var module = "60";
         userService.setData(module);
         enrollModalService.showModal();
             // masterModalService.showModal();
            //  vmPackage.closePackages();
             //enrollModalService.hideModal();
       };
       vmPackage.ielts_expert = function() {
         var module = "75";
         userService.setData(module);
         enrollModalService.showModal();
             // expertModalService.showModal();
            //  vmPackage.closePackages();
             //enrollModalService.hideModal();
       };

       // Close packages modal
       vmPackage.closePackages = function() {
          packagesModalService.hideModal();
       };

   };

   function PracticeTabsCtrl($rootScope, $state, $cordovaFile) {

         var vmPractice = this;

         vmPractice.gotoHome = function() {
           $state.go("app.user-dashobard", {}, {reload : true});
         };

         vmPractice.loadListeningTests = function(){
           $state.go("app.practicetest.listening", {}, {reload : true});
         };
         vmPractice.loadReadingTests = function(){
           $state.go("app.practicetest.reading", {}, {reload : true});
         };
         vmPractice.loadWritingTests = function(){
           $state.go("app.practicetest.writing", {}, {reload : true});
         };
         vmPractice.loadSpeakingTests = function(){
           $state.go("app.practicetest.speaking", {}, {reload : true});
         };
   };

   function ListeningCtrl($rootScope, $state, $q, $http, tabsService, $log, userService, $ionicLoading, ListeningPaperService, ProfileService) {

      //  $state.reload();

       var vmListen = this;
       var result = {};
      //  var examType = "listening";

       $ionicLoading.show({template : 'Loading...'});

       vmListen.getRegisteredData = function() {
         vmListen.listeningData = [];
         var promise = tabsService.getListeningData($rootScope.userID);
         promise.then(function(payload) {
           // console.log(payload);
          if(payload.data.msg == "Request Error"){
            $rootScope.$emit('no-data');
          }
          else {
            result = payload.data.list;
            // alert("Data "+ JSON.stringify(result));
            vmListen.listeningData = result;
            $ionicLoading.hide();
          }

         }, function(errorPayload) {
              $rootScope.$emit('no-data');
              // $log.error('failure loading movie', errorPayload);
         });
       };
       vmListen.getRegisteredData();

      //  if($rootScope.enrollType === "1"){
      //    vmListen.getRegisteredData();
      //  }else{
      //    getFreeTrialData();
      //  }

      //  function getFreeTrialData() {
      //    vmListen.listeningData = [];
      //    tabsService.getFreeTrialPapers($rootScope.Username, $rootScope.Password, examType, $rootScope.Course).success(function(payload) {
      //      vmListen.listeningData = payload.list;
      //      $ionicLoading.hide();
      //    }, function(errorPayload) {
      //         console.log('failure loading movie', errorPayload);
      //    });
      //  };

       vmListen.getListeningPaper = function(item){
        //  console.log(item);
          var data = {paperID : item};
          userService.setData(data);
          ListeningPaperService.showModal();
       };
   };

   function listenExamCtrl($scope, $http, $rootScope, userService, ListeningPaperService, $ionicHistory, $sce, $timeout, $state, $ionicPopup, $ionicPlatform) {
       var listen = this;

       if(userService.getData() != undefined) {

         listen.paper = {};
         listen.paper = userService.getData();
         //  console.log(listen.paper);
        // alert(JSON.stringify(listen.paper));
        var status = "false";
        var listenUrl = baseurl+"Userservices/listening?paperId="+listen.paper.paperID+"&username="+$rootScope.Username+"&password="+$rootScope.Password+"&closeID="+status;
        $http.get(baseurl+"Userservices/listening?paperId="+listen.paper.paperID+"&username="+$rootScope.Username+"&password="+$rootScope.Password+"&closeID="+status)
          .success(function(data, status, headers, config) {
            if(status == 200){
              var dynamicUrl = listenUrl;
              listen.url = $sce.trustAsResourceUrl(dynamicUrl);
              listen.endPaper = true;
            }
            else{
              window.plugins.toast.showWithOptions({
                   message: 'Unable to fetch data. Try later.',
                   duration: 'long',
                   position: 'center',
                   styling: {
                     borderRadius: 30, // a bit less than default, 0 means a square Toast
                     backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                     alpha: 180, // 0-255, 0 being fully transparent
                     padding: {
                       top: 50,
                       right: 30,
                       // bottom: 20,
                       left: 30
                    }
                 }
               })
              $timeout(function()
              {
              }, 1000);
              ListeningPaperService.hideModal();
            }
          })
          .error(function(data, status, headers, config) {
            window.plugins.toast.showWithOptions({
                 message: 'Unable to fetch data. Try later.',
                 duration: 'long',
                 position: 'center',
                 styling: {
                   borderRadius: 30, // a bit less than default, 0 means a square Toast
                   backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                   alpha: 180, // 0-255, 0 being fully transparent
                   padding: {
                     top: 50,
                     right: 30,
                     // bottom: 20,
                     left: 30
                  }
               }
             })
            $timeout(function()
            {
            }, 2000);
            ListeningPaperService.hideModal();
          });
          userService.setData(null);
       }

       listen.closeModal = function() {
         var confirmPopup = $ionicPopup.confirm({
           title: 'QUIT',
           template: 'Are you sure want to close the exam?',
           cancelText: 'Cancel',
           okText: 'OK',
           cancelType: 'button-assertive',
           okType: 'button-balanced',
           cssClass: 'QUIT'

         });

         confirmPopup.then(function(res) {
           if(res) {
             var status = "true";
             listen.endPaper = false;
             var dynamicUrl = baseurl+"Userservices/listening?paperId="+listen.paper.paperID+"&username="+$rootScope.Username+"&password="+$rootScope.Password+"&closeID="+status;
             listen.url = $sce.trustAsResourceUrl(dynamicUrl);
             userService.setData(null);

             if($rootScope.enrollType == "2"){
              $state.go("app.user-dashobard", {}, {reload : true});
             }
             else{
              $state.go("app.practicetest.listening", {}, {reload : true});              
             }

             var clearSession = true;
             ListeningPaperService.hideModal();
           } else {
            //  console.log('You are not sure');
           }
         });
       };
   };

   function listenVideoCtrl(videosService, $sce, $rootScope) {
       var vmListenVideo = this;
       
       vmListenVideo.getListeningVideos  = function(){
         videosService.getVideos().then(function(response){
          //  console.log(response);
          var dataVideo = response.data.class;
          for(var i=0; i<dataVideo.length; i++){
            dataVideo[i].video_path = dataVideo[i].video_path.replace(".com", "-nocookie.com");
          }
           vmListenVideo.ListeningVideos = dataVideo;
           // console.log(vmListenVideo.ListeningVideos);
          
         })
       };
       vmListenVideo.getListeningVideos();

       vmListenVideo.playListenVideo = function(path) {
         // console.log(path);
         var url = $sce.trustAsResourceUrl(path);
         vmListenVideo.listenUrl = url;
       };
   };

   function ReadingCtrl($rootScope, $state, tabsService, $log, userService, $ionicLoading, ReadingPaperService) {
       var vmRead = this;

       $ionicLoading.show({template : 'Loading...'});
       // console.log($rootScope.Password);

       vmRead.getRegisteredData = function() {
         var result = {};
         vmRead.readingData = [];
         var promise = tabsService.getReadingData($rootScope.userID);
         promise.then(function(payload) {
          //  console.log(payload);
          if(payload.data.msg == "Request Error"){
            $rootScope.$emit('no-data');
          }
          else {
            result = payload.data.list;
            // alert("Data "+ JSON.stringify(result));
            vmRead.readingData = result;
            $ionicLoading.hide();
          }

         }, function(errorPayload) {
              $rootScope.$emit('no-data');
              $log.error('failure loading movie', errorPayload);
         });
       };
       vmRead.getRegisteredData();

       vmRead.getReadingPaper = function(item){
        //  console.log(item);
         userService.setData(item);
        //  $state.go("app.practicetest.ReadingPaper");
         ReadingPaperService.showModal();
       };
   };

   function readExamCtrl($rootScope, $http, userService, ReadingPaperService, $sce, $timeout, $state, $ionicPopup) {
       var read = this;


       if(userService.getData() != undefined) {
         read.paperid = userService.getData();

         var readUrl = baseurl+"userservices/reading/"+read.paperid+"?username="+$rootScope.Username+"&password="+$rootScope.Password;
         console.log(readUrl);
         $http.get(baseurl+"userservices/reading/"+read.paperid+"?username="+$rootScope.Username+"&password="+$rootScope.Password)
           .success(function(data, status, headers, config) {
             if(status == 200){
               var dynamicUrl = readUrl;
               read.url = $sce.trustAsResourceUrl(dynamicUrl);
             }
             else{
               window.plugins.toast.showWithOptions({
                    message: 'Unable to fetch data. Try later.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                      alpha: 180, // 0-255, 0 being fully transparent
                      padding: {
                        top: 50,
                        right: 30,
                        // bottom: 20,
                        left: 30
                     }
                  }
                })
               $timeout(function()
               {
               }, 1000);
               ReadingPaperService.hideModal();
               // var alertPopup = $ionicPopup.alert({
               //   title: 'Error!',
               //   template: 'Unable to fetch data. Please try again later.',
               //   cssClass: 'Error'
               // });
               // alertPopup.then(function(res) {
               // });
             }
           })
           .error(function(data, status, headers, config) {
             window.plugins.toast.showWithOptions({
                  message: 'Unable to fetch data. Try later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                    alpha: 180, // 0-255, 0 being fully transparent
                    padding: {
                      top: 50,
                      right: 30,
                      // bottom: 20,
                      left: 30
                   }
                }
              })
             $timeout(function()
             {
             }, 2000);
             ReadingPaperService.hideModal();
             // var alertPopup = $ionicPopup.alert({
             //   title: 'Error!',
             //   template: 'Unable to fetch data. Please try again later.',
             //   cssClass: 'Error'
             // });
             // alertPopup.then(function(res) {
           //   });
           });
         userService.setData(null);
       }
       read.closeModal = function() {
         var confirmPopup = $ionicPopup.confirm({
           title: 'QUIT',
           template: 'Are you sure want to close the exam?',
           cancelText: 'Cancel',
           okText: 'OK',
           cancelType: 'button-assertive',
           okType: 'button-balanced',
           cssClass: 'QUIT'
         });

         confirmPopup.then(function(res) {
           if(res) {
             if($rootScope.enrollType == "2"){
              $state.go("app.user-dashobard", {}, {reload : true});
             }
             else{
              $state.go("app.practicetest.reading", {}, {reload : true});              
             }
             ReadingPaperService.hideModal();
           }
         });
       };
   };

   function readVideoCtrl(videosService, $sce) {

       var vmReadVideo = this;
       // var url = "https://www.youtube.com/embed/GNs4Cucm7Xo?rel=0&amp";
       // vmReadVideo.StaticURL = $sce.trustAsResourceUrl(url);



       vmReadVideo.getReadingVideos  = function(){
         videosService.getVideos().then(function(response){
           // console.log(response);
          var dataVideo = response.data.class;
          for(var i=0; i<dataVideo.length; i++){
            dataVideo[i].video_path = dataVideo[i].video_path.replace(".com", "-nocookie.com");
          }
           vmReadVideo.ReadingVideos = dataVideo;
           // console.log(vmReadVideo.ReadingVideos);
         })
       };
       vmReadVideo.getReadingVideos();

       vmReadVideo.playReadVideo = function(path) {
         var url = $sce.trustAsResourceUrl(path);
         vmReadVideo.readUrl = url;
       };
   };

   function WritingCtrl($rootScope, $state, tabsService, $log, userService, $ionicLoading, WritingPaperService) {

       var vmWrite = this;
       var result = {};
      //  var examType = "writing";

       $ionicLoading.show({template : 'Loading...'});

       vmWrite.getRegisteredData = function() {
         vmWrite.writingData = [];
         var promise = tabsService.getWritingData($rootScope.userID);
         promise.then(function(payload) {

           if(payload.data.msg == "Request Error"){
             $rootScope.$emit('no-data');
           }
           else {
             result = payload.data.list;
            //  alert("Data "+ JSON.stringify(result));
             vmWrite.writingData = result;
             $ionicLoading.hide();
           }
         }, function(errorPayload) {
              $rootScope.$emit('no-data');
              $log.error('failure loading movie', errorPayload);
         });
       };
       vmWrite.getRegisteredData();

      //  vmWrite.getData();

       vmWrite.getWritingPaper = function(item){
      //   console.log(item);
         userService.setData(item);
        //  $state.go("app.practicetest.WritingPaper");
         WritingPaperService.showModal();
       };
   };

   function writeExamCtrl($rootScope, $state, $window, tabsService, userService, WritingPaperService, $sce,
                            $ionicLoading, $timeout, $ionicPopup) {

      var write = this;

      // console.log($rootScope.Username);
      // console.log($rootScope.userID);
      write.writing = {};
      write.status = true;
      write.psg = true;
      write.psg1 = false;
      write.psg2 = false;
      write.passage1 = false;
      write.passage2 = false;
      write.writing.userID = $rootScope.userID;
      write.writing.userName = $rootScope.Username;

      write.nxt = "1";
      write.paper = [];


      write.timer = "60:00";
      var timerVariable;
      var startTimer =function() {
          var presentTime = write.timer;
          var timeArray = presentTime.split(/[:]+/);
          var m = timeArray[0];
          var s = checkSecond((timeArray[1] - 1));
          if(s==59){m=m-1}
          if(m<0){
            // timerCompleted();
            var alertPopup = $ionicPopup.alert({
                 title: 'TimeOut',
                 template: 'Submit your exam',
                 cssClass: 'Error'
               });
             alertPopup.then(function(res) {
               write.submitAnswers();
             });

            return false;
          }
          write.timer = m + ":" + s;
          timerVariable = $timeout(startTimer, 1000);
      };
      startTimer();

      function checkSecond(sec) {
          if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
          if (sec < 0) {sec = "59"};
          return sec;
      };

      var timerCompleted = function(){
        $timeout.cancel(timerVariable);
        //write.timer = "00:00";
        var alertPopup = $ionicPopup.alert({
             title: 'Congrats',
             template: 'Your exam is successfully submitted!',
             cssClass: 'Success'
           });

         alertPopup.then(function(res) {
           var clearSession = true;           
           WritingPaperService.hideModal();
           if($rootScope.enrollType == "1"){
              $state.go("app.practicetest.writing", {}, {reload : true});
             }
         });
      };

      if(userService.getData() != undefined) {
        write.writing.paperid = userService.getData();
        if($rootScope.online){
          $rootScope.writeOffline = false;
        }else{
          $rootScope.writeOffline = true;
        }
        tabsService.getWritingPaper1(write.writing.paperid).then(function(payload) {
          // console.log(payload);
          if(payload.msg == "false"){
            var alertPopup = $ionicPopup.alert({
              title: 'Error!',
              template: 'Unable to fetch data. Please try again later.',
              cssClass: 'Error'
            });
            alertPopup.then(function(res) {
              WritingPaperService.hideModal();
            });
          }else{
            write.nextID = payload[0].WPID;
            write.paper1 = payload[0].Content;
             //console.log(write.paper1);
             write.question2 = "";
             write.passage1 = true;
             write.passage2 = false;
            write.question1 = $sce.trustAsResourceUrl(write.paper1);
            $ionicLoading.hide();
          }


        }, function(errorPayload) {
             console.log('failure loading movie', errorPayload);
        });
      }
      else{
        $state.go("app.practicetest.writing", {}, {reload : true});
      }

      write.getPassage1 = function(){
        write.psg2 = false;
        tabsService.getWritingPaper1(write.writing.paperid).then(function(payload) {
          write.nextID = payload[0].WPID;
          write.paper1 = payload[0].Content;
         //  console.log(write.paper1);
          write.question2 = "";
          write.passage1 = true;
          write.passage2 = false;
          write.question1 = $sce.trustAsResourceUrl(write.paper1);
          write.status = true;
         $ionicLoading.hide();
        }, function(errorPayload) {
            //  console.log('failure loading movie', errorPayload);
        });
      };

      write.writeAnswer1 = function(){
        if(write.psg1){
           write.psg1 = false;
        }else{
           write.psg1 = true;
        }
      };

      write.getPassage2 = function(){
        write.psg1 = false;
        tabsService.getWritingPaper2(write.writing.paperid, write.nextID, write.nxt).then(function(payload) {
          write.paper2 = payload[0].psg;
          //console.log(write.paper2);
          write.question1 = "";
          write.passage2 = true;
          write.passage1 = false;
          write.question2 = $sce.trustAsResourceUrl(write.paper2);
          write.status = false;
         $ionicLoading.hide();
        }, function(errorPayload) {
            //  console.log('failure loading movie', errorPayload);
        });
      };

      write.writeAnswer2 = function(){
        if(write.psg2){
           write.psg2 = false;
        }else{
           write.psg2 = true;
        }
      };

      write.writing.timeSpent = "";
      write.submitAnswers = function() {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Save',
          template: 'Are you sure you want to save your answers?',
          cancelText: 'Cancel',
          okText: 'OK',
          cancelType: 'button-assertive',
          okType: 'button-balanced',
          cssClass: 'QUIT'
        });
        confirmPopup.then(function(res) {
          if(res) {
            $timeout.cancel(timerVariable);
            $ionicLoading.show({template : 'Loading...'});

            var min = 59;
            var sec = 60;
            var timer = write.timer.split(/[:]+/);
            var timeMin = (min-timer[0]);
            var timeSec = (sec-timer[1]);
            if(timeMin == 59 && timeSec == 60){
              write.writing.timeSpent =  "60:00";
            }
            else{
              write.writing.timeSpent =  timeMin + ":" + timeSec;
            }
            if(write.writing.Answer1 == undefined || write.writing.Answer1 == "") write.writing.Answer1 = "NA";
            if(write.writing.Answer2 == undefined || write.writing.Answer2 == "") write.writing.Answer2 = "NA";
            // console.log(write.writing);

            tabsService.submitWritingPaper(write.writing).then(function(payload) {
              console.log(payload);
              if(payload.msg == "true"){
                $ionicLoading.hide();
                timerCompleted();
              }
              else{
              $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                     title: 'Error',
                     template: 'Unable to save Data!',
                     cssClass: 'Error'
                   });

                 alertPopup.then(function(res) {
                   WritingPaperService.hideModal();
                   $state.go("app.user-dashobard", {}, {reload : true});
                 });
              }
            });
          } else {
           //  console.log('You are not sure');
          }
        });

      };

       write.closeModal = function() {
         var confirmPopup = $ionicPopup.confirm({
           title: 'QUIT',
           template: 'Are you sure want to close the exam?',
           cancelText: 'Cancel',
           okText: 'OK',
           cancelType: 'button-assertive',
           okType: 'button-balanced',
           cssClass: 'QUIT'
         });

         confirmPopup.then(function(res) {
           if(res) {
             $timeout.cancel(timerVariable);
             if($rootScope.enrollType == "2"){
              $state.go("app.user-dashobard", {}, {reload : true});
             }
             else{
              $state.go("app.practicetest.writing", {}, {reload : true});              
             }
             WritingPaperService.hideModal();
           } else {
            //  console.log('You are not sure');
           }
         });
       };
   };

   function writeVideoCtrl(videosService, $sce) {

       var vmWriteVideo = this;
       // var url = "https://www.youtube.com/embed/GNs4Cucm7Xo?rel=0&amp";
       // vmWriteVideo.StaticURL = $sce.trustAsResourceUrl(url);




       vmWriteVideo.getWritingVideos  = function(){
         videosService.getVideos().then(function(response){
          //  console.log(response);
          var dataVideo = response.data.class;
          for(var i=0; i<dataVideo.length; i++){
            dataVideo[i].video_path = dataVideo[i].video_path.replace(".com", "-nocookie.com");
          }
           vmWriteVideo.WritingVideos = dataVideo;
         })
       };
       vmWriteVideo.getWritingVideos();

       vmWriteVideo.playWriteVideo = function(path) {
         var url = $sce.trustAsResourceUrl(path);
         vmWriteVideo.writeUrl = url;
       };
   };

   function SpeakingCtrl($rootScope, $state, tabsService, $log, userService, $ionicLoading, SpeakingPaperService, $cordovaFile) {

     var vmSpeak = this;
     var result = {};
    //  var examType = "speaking";

     $ionicLoading.show({template : 'Loading...'});

     vmSpeak.getRegisteredData = function() {
       vmSpeak.speakingData = [];
       var promise = tabsService.getSpeakingData($rootScope.userID);
       promise.then(function(payload) {
        //  console.log(payload.data);
        if(payload.data.msg == "Request Error"){
          $rootScope.$emit('no-data');
        }
        else {
          result = payload.data.list;
          // alert("Data "+ JSON.stringify(result));
          vmSpeak.speakingData = result;
          $ionicLoading.hide();
        }
       }, function(errorPayload) {
            $rootScope.$emit('no-data');
            // console.log(errorPayload);
            // $log.error('failure loading movie', errorPayload);
       });
     };
     vmSpeak.getRegisteredData();


     vmSpeak.getSpeakingPaper = function(item){
      //  console.log(item);
      // if(item.$$hashKey != ""){
      //   delete item.$$hashKey;
      // }
       userService.setData(item);
       SpeakingPaperService.showModal();
     };

 };

 function speakExamCtrl($scope, userService, $ionicLoading, $sce, tabsService, $rootScope, SpeakingPaperService, $ionicPopup,
          $cordovaFile, recordingModalService, $state) {

     var speak = this;

     speak.questions = [];
     speak.Section1 = [];
     speak.Section2 = [];
     speak.Section3 = [];
     speak.Sections = [];

     var dataToSend = {};

    //  recordingModalService.showModal();

     function folderExists() {
        var directory;
        if (cordova.file.documentsDirectory) {
          directory = cordova.file.documentsDirectory; // for iOS
        } else {
          directory = cordova.file.externalRootDirectory; // for Android
        }
        $cordovaFile.checkDir(directory, "ielts7band/recordings")
         .then(function (success) {
           // alert(directory);
           // alert("Present"+ JSON.stringify(success));
           // success
         }, function (error) {
           // error
           // alert(directory);
           // alert("No"+ JSON.stringify(error));
           $cordovaFile.createDir(directory+"ielts7band/", "recordings", false)
             .then(function (success) {
               // alert(directory);
               // alert(JSON.stringify(success));
               // alert("Created");
             }, function (error) {
               // alert(JSON.stringify(error));
               // error
             });
         });
       };

       if(userService.getData() != undefined) {
         if(ionic.Platform.isAndroid()){
           folderExists();
         }
        speak.id = userService.getData();
        if($rootScope.online){
          $rootScope.speakOffline = false;
        }else{
          $rootScope.speakOffline = true;
        }
        dataToSend.PaperID = speak.id.Question;
        //  alert("UserService "+dataToSend.PaperID);
       }
       userService.setData(null);


     $rootScope.$on('recordedFile', function(event, res) {
       angular.forEach(speak.questions, function (value, key){
         if(value.Question_No == res.QuesNo){
           value.timeSpent = res.timeSpent;
         }
       })
     });

     speak.getData = function(){
        $ionicLoading.show({template : 'Loading...'});

          tabsService.getSpeakingPapers(speak.id.Question).then(function(res) {
              if(res.data.msg == "false"){
                var alertPopup = $ionicPopup.alert({
                  title: 'Error!',
                  template: 'Unable to fetch data. Please try again later.',
                  cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                  SpeakingPaperService.hideModal();
                  $ionicLoading.hide();
                });
              }
              else{
                // recordingModalService.hideModal();
                speak.Section1 = res.data.Speaking[1];
                speak.Section2 = res.data.Speaking[2];
                speak.Section3 = res.data.Speaking[3];
                speak.Sections = speak.Section1.concat(speak.Section2);
                speak.questions = speak.Sections.concat(speak.Section3);

                for(var i=0; i< speak.questions.length; i++){
                  var url = speak.questions[i].Audio_Url.split("../")[1];
                  speak.questions[i].Audio_Url = $sce.trustAsResourceUrl(baseurl+url);
                  // console.log(speak.questions[i].Audio_Url);
                  speak.questions[i].timeSpent = "";
                   $ionicLoading.hide();
                }

            };
        })
      };
     speak.getData();


     speak.playAudio = function(queNo, sectionNo){
       console.log(queNo);
      //  console.log(document.getElementById(queNo));
       var sound = document.getElementById(queNo);
       sound.play();
      //  for(var j=0; j<sound.length; j++){
      //    sounds[j].play();
      //    // play = true;
      //    // document.getElementById("playAudioID").innerHTML = "Pause";
      //  }
     };


     speak.recordAnswer = function(queNo, sectionNo) {

       dataToSend.QuesNo = queNo;
       dataToSend.sectionNo = sectionNo;
       // console.log(dataToSend);
        userService.setData(dataToSend);
        recordingModalService.showModal();

     };

     speak.closeModal = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'QUIT',
         template: 'Are you sure want to close the exam?',
         cancelText: 'Cancel',
         okText: 'OK',
         cancelType: 'button-assertive',
         okType: 'button-balanced',
         cssClass: 'QUIT'
       });

       confirmPopup.then(function(res) {
         if(res) {
           if($rootScope.enrollType == "2"){
            $state.go("app.user-dashobard", {}, {reload : true});
           }
           else{
              $state.go("app.practicetest.speaking", {}, {reload : true});              
             }
           var clearSession = true;
           SpeakingPaperService.hideModal();
         } else {
          //  console.log('You are not sure');
         }
       });
     };

 };

 function recordingCtrl($scope, $rootScope, recordingModalService, $ionicPopup, $timeout, $interval, userService, $cordovaFile, $ionicLoading, $cordovaFileTransfer) {
   var record = this;
   record.recording = false;
   record.stopped = false;
   record.progressval = 0;
   record.stopinterval = null;
   record.Params = {};
   var dataToSendBack = {};

  //  function getDataQue(){
     if(userService.getData() != null) {
      //  alert("userService "+JSON.stringify(userService.getData()));
       record.Params = userService.getData();
       console.log(record.Params);
     }
     userService.setData(null);

     PhoneCallTrap.onCall(function(state) {
        console.log("CHANGE STATE: " + state);

        switch (state) {
            case "RINGING":
                console.log("Phone is ringing");
                $timeout.cancel(timerVariable);
                record.stopped = true;
                record.recording = false;
                window.plugins.audioRecorderAPI.stop(function(savedFilePath) {
                  var currentdate = new Date();
                  var datetime = currentdate.getDate() + "-"+(currentdate.getMonth()+1)
                                  + "-" + currentdate.getFullYear() + "_"
                                  + currentdate.getHours() + "-"
                                  + currentdate.getMinutes() + "-" + currentdate.getSeconds();

                  var fileName = savedFilePath.split('/')[savedFilePath.split('/').length - 1];
                   var directory;

                   var newName = "audio_recording_"+datetime+".mp3";
                   if (cordova.file.documentsDirectory) {
                     directory = cordova.file.documentsDirectory; // for iOS
                   } else {
                     directory = cordova.file.externalRootDirectory+"ielts7band/recordings/"; // for Android
                   }
                   $cordovaFile.copyFile(cordova.file.dataDirectory, fileName, directory, newName)
                     .then(function (success) {
                       record.newName = newName;
                       // alert("Moved");
                     }, function (error) {
                       // alert("Error");
                       alert("Error "+err);
                     });
                 }, function(msg) {
                   // failed
                   // alert('ko: ' + msg);
                 });
                break;
            case "OFFHOOK":
                console.log("Phone is off-hook");
                break;
            case "IDLE":
                console.log("Phone is idle");
                break;
        }
     });

  // console.log(record.Params);

   var sec=0;
   var min=0;
   record.timer = min + " : " + sec;
   var timerVariable;

   function clock(){
     var presentTime = record.timer;
     var timeArray = presentTime.split(/[:]+/);
       var m = timeArray[0];
       var s = timeArray[1];
       s = ++sec;
       if(s>59){
         sec=0;
         s = 0;
         m= ++min;
       }
       if(m>5){

       }
       record.timer = m + ":" + s;
       timerVariable = $timeout(clock, 1000);
   };

   record.recordAudio = function() {
     record.newName = "";
     if(!record.recording){
       record.recording = true;
     }else{
       record.recording = false;
     }

     if(record.recording){
        // startprogress();
       clock();
        window.plugins.audioRecorderAPI.record(function(msg) {
          // recordAudioFile(savedFilePath);
        }, function(msg) {
            // alert('ko: ' + msg);
            // Akhil
        }, 100000);
     }
     else{
       $timeout.cancel(timerVariable);
       record.stopped = true;
       window.plugins.audioRecorderAPI.stop(function(savedFilePath) {
         var currentdate = new Date();
         var datetime = currentdate.getDate() + "-"+(currentdate.getMonth()+1)
                         + "-" + currentdate.getFullYear() + "_"
                         + currentdate.getHours() + "-"
                         + currentdate.getMinutes() + "-" + currentdate.getSeconds();

         var fileName = savedFilePath.split('/')[savedFilePath.split('/').length - 1];
          var directory;
          var fromPath;
          // if(ionic.Platform.isAndroid()){
          //   fromPath = cordova.file.dataDirectory;
          // }
          // else if(ionic.Platform.isIOS()){
          //   fromPath = cordova.file.dataDirectory;
          // }

          // alert("PATH: "+savedFilePath);
          // alert("Android: "+cordova.file.dataDirectory);
          // alert("IOS: "+cordova.file.syncedDataDirectory);

          var newName = "audio_recording_"+datetime+".mp3";
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          } else {
            directory = cordova.file.externalRootDirectory+"ielts7band/recordings/"; // for Android
          }
          $cordovaFile.copyFile(cordova.file.dataDirectory, fileName, directory, newName)
            .then(function (success) {
              record.newName = newName;
              // alert(directory);
              // alert(JSON.stringify(success));
              // alert("Moved");
            }, function (error) {
              // alert(directory);
              // alert(JSON.stringify(error));
              // alert("Error");
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Failed because: ' + JSON.stringify(error),
                    cssClass: 'Error'
                });
            });
        }, function(msg) {
          // failed
          // alert('ko: ' + msg);
        });
     }

   };

   record.playAudio = function(){
       window.plugins.audioRecorderAPI.playback(function(msg) {
            // complete
            // alert('ok: ' + msg);
          }, function(msg) {
            // failed
            // alert('ko: ' + msg);
       });
   };

     record.sendAudio = function(){
      //  alert("Upload");
      //  console.log(record.Params);
      //  console.log($rootScope.userID);

       $ionicLoading.show({template : 'Uploading...'});

       // Destination URL
        var url = baseurl+"Userservices/adupload/"+$rootScope.userID;
        var directory;
        if (cordova.file.documentsDirectory) {
          directory = cordova.file.documentsDirectory; // for iOS
        } else {
          directory = cordova.file.externalRootDirectory; // for Android
        }

        //File for Upload
        if(ionic.Platform.isAndroid()){
          var targetPath = directory+"ielts7band/recordings/"+record.newName;
        }
        else if(ionic.Platform.isIOS()){
          var targetPath = directory+record.newName;
        }

        // File name only
        var filename = targetPath.split("/").pop();
        var timeSpent = "0:"+record.timer;

        var options = {
             fileKey: "file",
             fileName: filename,
             httpMethod: "POST",
            //  mimeType: "audio/vnd.wav",
             mimeType: "audio/mp3",
             params : {
                        'paperId':record.Params.PaperID,
                        'queNo':record.Params.QuesNo,
                        'timeSpent': timeSpent,
                        // 'date': today,
                        'section': record.Params.sectionNo,
                        'file': filename
                      }, // directory represents remote directory,  fileName represents final remote file name
             chunkedMode: false
         };


         $cordovaFileTransfer.upload(url, targetPath, options, true).then(function (result) {
          //  alert(JSON.stringify(result));
          recordingModalService.hideModal();
          $ionicLoading.hide();
           $scope.$emit('recordedFile', {timeSpent : record.timer, QuesNo: record.Params.QuesNo});
           window.plugins.toast.showWithOptions({
                message: 'Recording Uploaded Successfully',
                duration: 'long',
                position: 'center',
                styling: {
                  borderRadius: 30, // a bit less than default, 0 means a square Toast
                  backgroundColor: '#325f67', // make sure you use #RRGGBB. Default #333333
                  alpha: 180, // 0-255, 0 being fully transparent
                  padding: {
                    top: 50,
                    right: 30,
                    // bottom: 20,
                    left: 30
                 }
              }
            })
           $timeout(function()
           {
           }, 1000);
           // var alertPopup = $ionicPopup.alert({
           //     title: 'Success',
           //     template: 'Recording Uploaded Successfully',
           //     cssClass: 'Success'
           // });
         }, function (err) {
             $ionicLoading.hide();
             window.plugins.toast.showWithOptions({
                  message: 'Not Uploaded',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#325f67', // make sure you use #RRGGBB. Default #333333
                    alpha: 180, // 0-255, 0 being fully transparent
                    padding: {
                      top: 50,
                      right: 30,
                      // bottom: 20,
                      left: 30
                   }
                }
              })
             $timeout(function()
             {
             }, 1000);
             recordingModalService.hideModal();
             // var alertPopup = $ionicPopup.alert({
             //     title: 'Error',
             //     template: 'Failed because: ' + JSON.stringify(err),
             //     cssClass: 'Error'
             // });
         }, function (progress) {
             // PROGRESS HANDLING GOES HERE
         });
     };

   record.closeModal = function() {
     recordingModalService.hideModal();
   };
 };



 function speakVideoCtrl(videosService, $sce) {

     var vmSpeakVideo = this;
     // var url = "https://www.youtube.com/embed/GNs4Cucm7Xo?rel=0&amp";
     // vmSpeakVideo.StaticURL = $sce.trustAsResourceUrl(url);



     vmSpeakVideo.getSpeakingVideos  = function(){
       videosService.getVideos().then(function(response){
         // console.log(response);         
         vmSpeakVideo.SpeakingVideos = response.data.class;
       })
     };
     vmSpeakVideo.getSpeakingVideos();

     vmSpeakVideo.playSpeakVideo = function(path) {
       var url = $sce.trustAsResourceUrl(path);
       vmSpeakVideo.speakUrl = url;
     };
 };

})();