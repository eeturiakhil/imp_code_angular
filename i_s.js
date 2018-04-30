(function() {
    'use strict';

    angular
      .module('starter.Services', [])
      .constant('AUTH_EVENTS', AUTH_EVENTS)
      .service("ProfileService", ProfileService)
      .service('LoginService', LoginService)
      .service('introService', introService)
      .factory('AuthInterceptor', AuthInterceptor)
      .factory('userService', userService)
      .service('loginModalService', loginModalService)
      .service('termsService', termsService)
      .service('forgotpwdModalService', forgotpwdModalService)
      .service('registerModalService', registerModalService)
      .service('enrollModalService', enrollModalService)
      .service('packagesModalService', packagesModalService)
      .service('starterModalService', starterModalService)
      .service('masterModalService', masterModalService)
      .service('expertModalService', expertModalService)
      .service('popoverService', popoverService)
      .service('tabsService', tabsService)
      .service('courseModalService', courseModalService)
      .service('upgradePackageService', upgradePackageService)
      .service('ListeningPaperService', ListeningPaperService)
      .service('ReadingPaperService', ReadingPaperService)
      .service('WritingPaperService', WritingPaperService)
      .service('SpeakingPaperService', SpeakingPaperService)
      .service('recordingModalService', recordingModalService)
      .service('videosService', videosService)
      .service('imageModalService', imageModalService)
      .service('faqModalService', faqModalService)
      .directive('focus', function() {
        return {
          restrict: 'A',
          link: function($scope,elem,attrs) {

            elem.bind('keydown', function(e) {
              var code = e.keyCode || e.which;
              if (code === 13) {
                e.preventDefault();
                elem.next().focus();
              }
            });
          }
        }
      })

      .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
      })

      function AUTH_EVENTS() {
          notAuthenticated: 'auth-not-authenticated'
          notAuthorized: 'auth-not-authorized'
          serverError: 'auth-server-error'
      };

      function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
         return {
           responseError: function (response) {
             var status = response.status;
             // alert("hi");
             $rootScope.$broadcast({
               401: AUTH_EVENTS.notAuthenticated,
               403: AUTH_EVENTS.notAuthorized,
               500: AUTH_EVENTS.serverError,
               status: AUTH_EVENTS.noError
             }[response.status], response);
             return $q.reject(response);
           }
         };
      };

     // var baseurl = "http://192.168.0.65/ielts7band.net/";
     // var baseurl = "http://sandbox786.com/ielts7band/";
      // var baseurl = "http://sandbox786.com/sandielts/";     
     var baseurl = "https://www.ielts7band.net/";

     function LoginService($q, $http, $rootScope, userService) {
      	var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var LOCAL_TOKEN_MEDIA = 'yourMedia';
        var LOCAL_TOKEN_ID = "yourID";
        var LOCAL_TOKEN_TYPE = "yourType";
        var LOCAL_TOKEN_COURSE = "yourCourse";
        var LOCAL_TOKEN_PACKAGE = "yourPackage";

      	var isAuthenticated = false;
        $rootScope.loginStatus = false;

        var username = "";
        var userId = "";
        var Media = "";
        var Course = "";
        var eType = "";
        var Package = "";

        var authToken;

        	function loadUserCredentials(){
          		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
              var media = window.localStorage.getItem(LOCAL_TOKEN_MEDIA);
              var id = window.localStorage.getItem(LOCAL_TOKEN_ID);
              var eType = window.localStorage.getItem(LOCAL_TOKEN_TYPE);
              var course = window.localStorage.getItem(LOCAL_TOKEN_COURSE);
              var pack = window.localStorage.getItem(LOCAL_TOKEN_PACKAGE);

          		if(token) {
          		      useCredentials(token, media, id, eType, course, pack);
          		}
          	};
    	      loadUserCredentials();

            var updateCourse = function(course) {
              window.localStorage.setItem(LOCAL_TOKEN_COURSE, course);
              modifyCourse(course);
            };


            function modifyCourse(course){
              Course = course.split('.')[0];
              $rootScope.Course = Course;
            };

            var updateEnrollType = function(type) {
              window.localStorage.setItem(LOCAL_TOKEN_TYPE, type);
              modifyEnrollType(type);
            };


            function modifyEnrollType(type){
              eType = type.split('.')[0];
              $rootScope.enrollType = eType;
            };

            var updatePack = function(pack) {
              if(pack != null){
                window.localStorage.setItem(LOCAL_TOKEN_PACKAGE, pack);
                modifyPackage(pack);
              }
            };

            function modifyPackage(pack){
              Package = pack.split('.')[0];
              $rootScope.Package = Package;
            };

          	function storeUserCredentials(email, media, id, type, course, pack) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, email);
                window.localStorage.setItem(LOCAL_TOKEN_MEDIA, media);
                window.localStorage.setItem(LOCAL_TOKEN_ID, id);
                window.localStorage.setItem(LOCAL_TOKEN_TYPE, type);
                window.localStorage.setItem(LOCAL_TOKEN_COURSE, course);
                window.localStorage.setItem(LOCAL_TOKEN_PACKAGE, pack);

                // if(type != null && type.split('.')[0] == "1"){
                //   modifyPackage(pack);
                // }
          	    useCredentials(email, media, id, type, course, pack);
          	};

            function useCredentials(token, media, id, etype, course, pack) {
          	    username = token.split('*')[0];
                Media = media.split('.')[0];
                userId = id.split('.')[0];
                eType = etype.split('.')[0];
                Course = course.split('.')[0];
                Package = pack.split('.')[0];

          	    isAuthenticated = true;
                authToken = token;
                $rootScope.loginStatus = true;

                if(Media == "facebook" || Media == "google"){
                  $rootScope.Password = "";
                  $rootScope.Media = Media;
                }
                else{
                  $rootScope.Media = "";
                  $rootScope.Password = Media;
                }
                $rootScope.userID = userId;
                $rootScope.Username = username;
                $rootScope.enrollType = eType;
                $rootScope.Course = Course;
                $rootScope.Package = Package;

          	    // Set the token as header for your requests!
          	    $http.defaults.headers.common['X-Auth-Token'] = token;
            };

            function destroyUserCredentials() {
          	    authToken = undefined;
                username = "";
          	    isAuthenticated = false;
                $rootScope.loginStatus = false;
                $rootScope.userID = undefined;
                $rootScope.Username = undefined;
                $rootScope.firstTime = undefined;
          	    $http.defaults.headers.common['X-Auth-Token'] = undefined;
          	    window.localStorage.removeItem(LOCAL_TOKEN_ID);
                window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                window.localStorage.removeItem(LOCAL_TOKEN_MEDIA);
                window.localStorage.removeItem(LOCAL_TOKEN_TYPE);
                window.localStorage.removeItem(LOCAL_TOKEN_COURSE);
                window.localStorage.removeItem(LOCAL_TOKEN_PACKAGE);
          	};

        	   var logoutUser = function() {
            		destroyUserCredentials();
          	 };

             var forgotPasscode = function(email) {
               var deferred = $q.defer();
                 $http({
                             method: 'POST',
                             data: $.param({
                                         'email': email
                                     }),
                             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                             url: baseurl+'Userservices/forgetPassword'
                      }).success(function(data, status, headers, config) {
                         console.log(data);
                         deferred.resolve(data);
                      }, function(data, status, headers, config){
                        console.log("Fail: "+data);
                           deferred.reject();
                      });
               return deferred.promise;
          	 };

             var saveMobileData = function(device) {
              // alert(JSON.stringify(device));   
              $rootScope.uuid = device.uuid;   
               var deferred = $q.defer();
                 $http({
                             method: 'POST',
                             data: $.param({
                                         'platform': device.platform,
                                         'version': device.version,
                                         'uuid': device.uuid,
                                         'model': device.model, 
                                     }),
                             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                             url: baseurl+'Userservices/saveMobileData'
                      }).success(function(data, status, headers, config) {
                         // alert("Success" + JSON.stringify(data));
                         deferred.resolve(data);
                      }, function(data, status, headers, config){
                        // alert("Fail: "+JSON.stringify(data));
                           deferred.reject();
                      });
               return deferred.promise;
             };

             var updateMobileData = function(uuid, id) { 
               // alert("UUID: " +uuid);
               // alert("ID: " +id);                 
               var deferred = $q.defer();
                 $http({
                             method: 'POST',
                             data: $.param({
                                         'update': true,
                                         'uuid': uuid,
                                         'userId': id 
                                     }),
                             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                             url: baseurl+'Userservices/saveMobileData'
                      }).success(function(data, status, headers, config) {
                         // alert("UserId Updated" + JSON.stringify(data));
                         deferred.resolve(data);
                      }, function(data, status, headers, config){
                        // alert("UserId Fail: "+JSON.stringify(data));
                           deferred.reject();
                      });
               return deferred.promise;
             };

              var updateUserType = function(userID) {
                var deferred = $q.defer();
                  $http({
                              method: 'POST',
                              data: $.param({
                                          'type': 'userType',
                                          'eType': '2',
                                          'userKey': userID
                                      }),
                              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                              url: baseurl+'Userservices/Update'
                       }).success(function(data, status, headers, config) {
                          // console.log("Updated: "+data);
                          deferred.resolve(data);
                       }, function(data, status, headers, config){
                         console.log("Fail: "+data);
                            deferred.reject();
                       });
                return deferred.promise;
              };

             var loginUser = function(email, pw, login) {
               var deferred = $q.defer();
                 $http({
                     method: 'GET',
                     params: {
                               'username': email,
                               'password': pw,
                               'task': 'loginAuthentication'
                             },
                             url: baseurl+'Userservices'
                      }).success(function(data, status, headers, config) {
                        var paymentStatus = {};
                        if(data.id){
                          if(login && data.enrollType == "2"){
                            var status = logData(email, pw, data);
                            deferred.resolve(data);
                          }else if(login && data.enrollType == "1"){
                            if(data.payment > 0){
                              var status = logData(email, pw, data);
                              deferred.resolve(data);
                            }else{
                              paymentStatus.userStatus = true;
                              paymentStatus.userID = data.id;
                              deferred.resolve(paymentStatus);
                            }
                          }
                          else if(!login){
                            var status = logData(email, pw, data);
                            deferred.resolve(data);
                          }
                        }else if(data.LoginStatus == false){
                          paymentStatus = false;
                          deferred.resolve(paymentStatus);
                         }
                         else{
                            deferred.reject();
                         }

                   }, function(data, status, headers, config){
                        deferred.reject();
                   });
               return deferred.promise;
             };

             function logData(email, pw, result) {
               // console.log(result);
                 var isloggedin = false;
                 var status = false;
                   if (result.id) {
                         isloggedin = true;
                   }
                   if(isloggedin){
                    if(result.package == ""){
                      var pack = "none";
                      storeUserCredentials(email + '*yourServerToken', pw + '.yourPassword', result.id + '.yourID', result.enrollType + '.Type', result.course + '.Course', pack + '.Package');                      
                    }else{
                      storeUserCredentials(email + '*yourServerToken', pw + '.yourPassword', result.id + '.yourID', result.enrollType + '.Type', result.course + '.Course', result.package + '.Package');
                    }
                     status = true;
                   }
                   else if(!isloggedin){
                         status = false;
                   }
                return status;
             };

             var registerUser = function(reg) {
               var deferred = $q.defer();
               $http({
                   method: 'GET',
                   params: {
                                  'name': reg.name,
                                  'email': reg.emailid
                                },
                   url: baseurl+'Userservices/freeUser',
                   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).success(function(data, status, headers, config) {
                      // console.log(data);
                        if(data.id){
                          deferred.resolve(data);
                        }
                         else{
                           deferred.reject();
                         }
                    }, function(data, status, headers, config){
                         deferred.reject();
                    });
                 return deferred.promise;
             };

             var outUser = function(reg) {
               var deferred = $q.defer();
               $http({
                   method: 'GET',
                   url: baseurl+'Userservices/out',
                   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).success(function(data, status, headers, config) {
                      console.log(data);
                      deferred.resolve(data);
                    }, function(data, status, headers, config){
                         deferred.reject();
                    });
                 return deferred.promise;
             };

             var checkUserType = function(email) {
               var deferred = $q.defer();
               $http({
                   method: 'GET',
                   params: {
                                  'email': email
                                },
                   url: baseurl+'Userservices/checkUserType',
                   headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }).success(function(data, status, headers, config) {
                          deferred.resolve(data);
                    }, function(data, status, headers, config){
                         deferred.reject();
                    });
                 return deferred.promise;
             };

             // var checkUser = function(email){
             //   var deferred = $q.defer();
             //   $http({
             //        method: 'POST',
             //        url: baseurl+'Requestdispatcher/CheckExistance',
             //        data:$.param({'value':email, 'field':'email', 'table':'user_regdata'}),
             //        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             //      }).success(function(data, status, headers, config) {
             //            deferred.resolve(data);
             //      }, function(data, status, headers, config){
             //           deferred.reject();
             //      });
             //   return deferred.promise;
             // };

             var loginSocial = function(reg) {
               var deferred = $q.defer();
                 $http({
                     method: 'GET',
                     params: {
                               'name': reg.name,
                               'email': reg.emailid,
                               'module': reg.module,
                               'media': reg.media
                             },
                      url: baseurl+'Userservices/sLogin'
                      }).success(function(data, status, headers, config) {
                        if(data.id){
                          var pack = "none";
                          storeUserCredentials(reg.emailid + '*yourServerToken', reg.media +'.Media', data.id + '.yourID', data.enrollType + '.Type', data.course + '.Course', pack + '.Package');
                          deferred.resolve(data);
                        }
                        else if(result.msg == "0"){
                          deferred.reject();
                        }
                   }, function(data, status, headers, config){
                        deferred.reject();
                   });
               return deferred.promise;
             };

             var getDates = function() {
               var deferred = $q.defer();
                 $http({
                     method: 'GET',
                     params: {
                               'username': $rootScope.Username,
                               'password': $rootScope.Password,
                               'task': 'loginAuthentication'
                             },
                      url: baseurl+'Userservices'
                      }).success(function(data, status, headers, config) {
                        if(data.id){
                          deferred.resolve(data);
                        }
                        else{
                          // $rootScope.$emit('no-data');
                          deferred.reject();
                        }
                   }, function(data, status, headers, config){
                        deferred.reject();
                   });
               return deferred.promise;
             };
             //
             var getSocialDates = function() {
               var deferred = $q.defer();
                 $http({
                     method: 'GET',
                     params: {
                               'email': $rootScope.Username
                             },
                      url: baseurl+'Userservices/sLogin'
                      }).success(function(data, status, headers, config) {
                        alert("FB Dates...." +JSON.stringify(data));
                        if(data.id){
                          deferred.resolve(data);
                        }
                        else if(data.msg == "0"){
                          deferred.reject();
                        }
                   }, function(data, status, headers, config){
                        deferred.reject();
                   });
               return deferred.promise;
             };

              var enrollUser = function(enroll) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    data: $.param({
                              'name': enroll.fname,
                              'username': enroll.EmailId,
                              'email': enroll.EmailId,
                              'module': enroll.Module,
                              'package': enroll.Choice,
                              'c_code': "",
                              'moneyType': "USD",
                              'discount': ""
                            }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: baseurl+'Requestdispatcher/Enrolluser'
                     }).success(function(data, status, headers, config) {
                      //  alert(JSON.stringify(data));
                        console.log(data);
                        deferred.resolve(data);
                     }, function(data, status, headers, config){
                          deferred.reject();
                     }, function(data, status, headers, config){
                          deferred.reject();
                     });
                  return deferred.promise;
              };

              var updateEnrollUser = function(enroll) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    data: $.param({
                              'name': enroll.fname,
                              'username': enroll.EmailId,
                              'email': enroll.EmailId,
                              'id': enroll.userID,
                              'module': enroll.Module,
                              'package': enroll.Choice,
                              'c_code': "",
                              'CurrencyCode': "USD",
                              'discount': ""
                            }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: baseurl+'Requestdispatcher/enrollAppUser'
                     }).success(function(data, status, headers, config) {
                      //  alert(JSON.stringify(data));
                        // console.log(data);
                        deferred.resolve(data);
                     }, function(data, status, headers, config){
                          // $rootScope.$emit('no-data');
                          deferred.reject();
                     });
                  return deferred.promise;
              };

              var dashVideo = function(enroll) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: baseurl+'Userservices/dashVideo'
                     }).success(function(data, status, headers, config) {
                      //  alert(JSON.stringify(data));
                        // console.log(data);
                        deferred.resolve(data);
                     }, function(data, status, headers, config){
                          // $rootScope.$emit('no-data');
                          deferred.reject();
                     });
                  return deferred.promise;
              };

            return {
                dashVideo : dashVideo,
                updateUserType : updateUserType,
                getDates: getDates,
                getSocialDates: getSocialDates,
                registerUser: registerUser,
                enrollUser: enrollUser,
                checkUserType : checkUserType,
            	  loginUser: loginUser,
            	  logoutUser: logoutUser,
                loginSocial: loginSocial,
                updatePack: updatePack,
                updateEnrollUser: updateEnrollUser,
            	  isAuthenticated: function() {return isAuthenticated;},
                updateCourse: updateCourse,
                updateEnrollType : updateEnrollType,
                forgotPasscode: forgotPasscode,
                saveMobileData: saveMobileData,
                updateMobileData: updateMobileData,
                outUser: outUser
           };
     };

     function introService($ionicModal) {
      this.showModal = function() {
          var service = this;
          $ionicModal.fromTemplateUrl('templates/intro.html', {
            scope: null,
            animation: 'slide-in-right',
            backdropClickToClose: false,
            // hardwareBackButtonClose: false,
            controller: 'IntroCtrl'
          }).then(function(modal) {
              service.modal = modal;
              service.modal.show();
          });
      };
      this.hideModal = function() {
          this.modal.hide();
      };
   };

     function registerModalService($ionicModal, $http, $q, $rootScope, LoginService) {

        this.showModal = function() {
            var service = this;
            $ionicModal.fromTemplateUrl('templates/free-trail-modal.html', {
              scope: null,
              animation: 'slide-in-right',
              backdropClickToClose: false,
              focusFirstInput: true,
              hardwareBackButtonClose: false,
              controller: 'registerCtrl'
            }).then(function(modal) {
                service.modal = modal;
                service.modal.show();
            });
        };
        this.hideModal = function() {
            this.modal.hide();
        };

        this.loadCountries = function() {
          var deferred = $q.defer();
          $http({
              method: 'POST',
              url: baseurl+'Userservices/countriesList'
               }).success(function(data, status, headers, config) {
                      //  console.log(result);
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                      //  $rootScope.$emit('no-data');
                       deferred.reject();
               });
               return deferred.promise;
        };
     };

     function userService(){
       var user = {};
          return {

          getData : function () {
            return user;
          },

          setData : function (message) {
            user = message;
          }
        }
     };

     function loginModalService($ionicModal) {
        this.showModal = function() {
            var service = this;
            $ionicModal.fromTemplateUrl('templates/login.html', {
              scope: null,
              animation: 'slide-in-right',
              backdropClickToClose: false,
              hardwareBackButtonClose: false,
              focusFirstInput: true,
              controller: 'loginCtrl'
            }).then(function(modal) {
                service.modal = modal;
                service.modal.show();
            });
        };
        this.hideModal = function() {
            this.modal.hide();
        };
     };

     function faqModalService($ionicModal, $http, $q, $rootScope) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/faq-modal.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'faqsCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
        this.getFaqs = function() {
          var deferred = $q.defer();
          $http({
                  method:'POST',
                  url:baseurl+'Userservices/GetFaqs',
                  headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              }).success(function(data, status, headers, config) {
               //  alert(JSON.stringify(data));
                 // console.log(data);
                 deferred.resolve(data);
              }, function(data, status, headers, config){
                   // $rootScope.$emit('no-data');
                   deferred.reject();
              });
           return deferred.promise;
        };
        this.getUserFaqs = function() {
          var deferred = $q.defer();
          $http({
                  method:'POST',
                  url:baseurl+'Userservices/GetUserFaqs',
                  params: {usertype: $rootScope.enrollType},
                  headers : {'Content-Type': 'application/x-www-form-urlencoded'},
              }).success(function(data, status, headers, config) {
               //  alert(JSON.stringify(data));
                //  console.log(data);
                 deferred.resolve(data);
              }, function(data, status, headers, config){
                   // $rootScope.$emit('no-data');
                   deferred.reject();
              });
           return deferred.promise;
        };
     };

     function termsService($ionicModal) {
        this.showModal = function() {
            var service = this;
            $ionicModal.fromTemplateUrl('templates/termsandconditions.html', {
              scope: null,
              animation: 'slide-in-right',
              backdropClickToClose: false,
              // hardwareBackButtonClose: false,
              controller: 'termsCtrl'
            }).then(function(modal) {
                service.modal = modal;
                service.modal.show();
            });
        };
        this.hideModal = function() {
            this.modal.hide();
        };
     };

     function forgotpwdModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/forgot-password.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'forgotpwdCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function enrollModalService($ionicModal) {
        this.showModal = function() {
            var service = this;
            $ionicModal.fromTemplateUrl('templates/enroll-here-modal.html', {
              scope: null,
              animation: 'slide-in-right',
              backdropClickToClose: false,
              hardwareBackButtonClose: false,
              // focusFirstInput: true,
              controller: 'enrollCtrl'
            }).then(function(modal) {
                service.modal = modal;
                service.modal.show();
            });
        };
        this.hideModal = function() {
            this.modal.hide();
        };
     };

     function packagesModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/packages-modal.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
            //  hardwareBackButtonClose: false,
             controller: 'packageCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function starterModalService($ionicModal) {
        this.showModal = function() {
            var service = this;
            $ionicModal.fromTemplateUrl('templates/ielts-starter-modal.html', {
              scope: null,
              animation: 'slide-in-right',
              backdropClickToClose: false,
              // hardwareBackButtonClose: false,
              controller: 'starterCtrl'
            }).then(function(modal) {
                service.modal = modal;
                service.modal.show();
            });
        };
        this.hideModal = function() {
            this.modal.hide();
        };
     };

     function masterModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/ielts-master-modal.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
            //  hardwareBackButtonClose: false,
             controller: 'masterCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
    };

     function expertModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/ielts-expert-modal.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
            //  hardwareBackButtonClose: false,
             controller: 'expertCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function courseModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/moduleSelection.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'selectCourseCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function upgradePackageService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/upgradeReminder.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'upgradePackageCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function popoverService($ionicPopover) {
       this.showModal = function() {
           var service = this;
           $ionicPopover.fromTemplateUrl('templates/profileSetting.html', {
             scope: null,
             controller: 'settingsCtrl'
           }).then(function(popover) {
               service.popover = popover;
               service.popover.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function tabsService($http, $q, $rootScope) {

       //Done
       var getWritingPaper1 = function(paperId){
         var deferred = $q.defer();
             $http({
                 method: 'POST',
                 url: baseurl+'Userservices/writing',
                 data: "Quest=" + paperId,
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             }).success(function(data, status, headers, config) {
                  // console.log(result);
                    deferred.resolve(data);
              }, function(data, status, headers, config) {
                    //  $rootScope.$emit('no-data');
                     deferred.reject();
            });
            return deferred.promise;
       };

       //Done
       var getWritingPaper2 = function(paperId, PWID, nxt){
            var data = $.param({
                                  Quest: paperId,
                                  nextPaper: PWID,
                                  next: nxt
                              });

            var config = {
                  headers : {
                      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                  }
            }
            var deferred = $q.defer();
            $http.post(baseurl+'Userservices/writing', data, config)
              .success(function (data, status, headers, config) {
                // console.log(data);
                deferred.resolve(data);
              }, function(data, status, headers, config) {
                  //  $rootScope.$emit('no-data');
                   deferred.reject();
             });
             return deferred.promise;
       };

        var submitWritingPaper = function(answers){
          var deferred = $q.defer();
          $http({
              method: 'GET',
              params: {
                          'name': "",
                          'email': answers.userName,
                          'userId': answers.userID,
                          'timeSpent': answers.timeSpent,
                          'paperId': answers.paperid,
                          'ans1': answers.Answer1,
                          'ans2': answers.Answer2
                      },
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                      url: baseurl+'Userservices/saveWriting'
               }).success(function(data, status, headers, config) {
                      //  console.log(result);
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                      //  $rootScope.$emit('no-data');
                       deferred.reject();
               });
               return deferred.promise;
        };

        //Done
        var getSpeakingPapers = function(paperID){
          // console.log(paperID);
          var deferred = $q.defer();
          return $http({
                method: 'POST',
                url: baseurl+'Userservices/speaking',
                params: {
                            'paperId': paperID
                        }
                 }).success(function(data, status, headers, config) {
                      // console.log(result);
                      deferred.resolve(data);
                 }, function(data, status, headers, config){
                      // $rootScope.$emit('no-data');
                      deferred.reject();
                 });
              return deferred.promise;
        };

        var updateProfileInfo = function(profile){
          var deferred = $q.defer();
          return $http({
              method: 'POST',
              data: $.param({
                        'userKey': $rootScope.userID,
                        'name':profile.Username,
                        'email': profile.Emailid,
                        'addrs': profile.Address1,
                        'addrs2': profile.Address2,
                        'city': profile.City,
                        'pcode': profile.Postcode,
                        'dialcode': profile.dialCode,
                        'country': profile.nationality,
                        'phone':profile.dialCode +" "+profile.phone
                      }),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url: baseurl+'Userservices/updateProfile'
               }).success(function(data, status, headers, config) {
                       console.log(data);
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                      console.log(data);
                       deferred.reject();
               });
               return deferred.promise;
        };

        var getFreeTrialPapers = function(userID, userName, passcode, examType, courseId){
          var deferred = $q.defer();
          return $http({
                method: 'POST',
                url: baseurl+'Userservices/freePapers',
                data: $.param({
                            'id': userID,
                            'userId': userName,
                            'password': passcode,
                            'paper': examType,
                            'examtypeid': courseId
                        }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                 }).success(function(data, status, headers, config) {
                      // alert(data);
                      deferred.resolve(data);
                 }, function(data, status, headers, config){
                      // $rootScope.$emit('no-data');
                      deferred.reject();
                 });
              return deferred.promise;
        };

       return {
            //Done
            getListeningData: function(userID) {
                                return $http.get(baseurl+'Userservices/paidQuestionList/listening?invoiceid='+userID);
                              },
            // getListenFreeTrial: function(examType){
            //                     return $http.get(baseurl+'Userservices/freePapers/listening?examtypeid='+examType);
            //                   },
            getReadingData: function(userID) {
                                return $http.get(baseurl+'Userservices/paidQuestionList/reading?invoiceid='+userID);
                              },
            getWritingData: function(userID) {
                                return $http.get(baseurl+'Userservices/paidQuestionList/writing?invoiceid='+userID);
                              },
            getSpeakingData: function(userID) {
                                return $http.get(baseurl+'Userservices/paidQuestionList/speaking?invoiceid='+userID);
                              },
            //Done
            // getListeningData: getListeningData,
            getWritingPaper1: getWritingPaper1,
            getWritingPaper2: getWritingPaper2,
            submitWritingPaper: submitWritingPaper,
            getSpeakingPapers: getSpeakingPapers,
            getFreeTrialPapers: getFreeTrialPapers,
            updateProfileInfo: updateProfileInfo

        };
     };

     function ProfileService($http, $rootScope, $q) {

       var service = {};

       service.getUserData = function(){
         var deferred = $q.defer();
         return $http({
               method: 'POST',
               data: $.param({
                           'userId': $rootScope.userID
                       }),
               headers: {'Content-Type': 'application/x-www-form-urlencoded'},
               url: baseurl+'Userservices/profile'
                }).success(function(data, status, headers, config) {
                     deferred.resolve(data);
                }, function(data, status, headers, config){
                    // $rootScope.$emit('no-data');
                    deferred.reject();
                });
             return deferred.promise;
       };

       service.sendFeedback = function(feed){
         console.log(feed);
         var deferred = $q.defer();
         return $http({
               method: 'POST',
               data: $.param({
                           'userKey': $rootScope.userID,
                           'email': $rootScope.Username,
                           'title': 'mobile',
                           'feedback': feed.Content
                       }),
               headers: {'Content-Type': 'application/x-www-form-urlencoded'},
               url: baseurl+'Userservices/feedback'
                }).success(function(data, status, headers, config) {
                   // console.log(data);
                   if(data.status===true){
                     deferred.resolve(data);
                   }
                   else{
                     // $rootScope.$emit('no-data');
                     deferred.reject();
                   }
                });
             return deferred.promise;
       };

        service.updatePassword = function(pwdDetails){
          var deferred = $q.defer();
          return $http({
                method: 'GET',
                params: {
                          'userId': $rootScope.userID,
                          'currentPassword': pwdDetails.Oldpwd,
                          'newPassword': pwdDetails.Newpwd,
                          'confirmPassword': pwdDetails.Confirmpwd
                        },
                url: baseurl+'Userservices/changePassword'
                 }).success(function(data, status, headers, config) {
                    // console.log(result);
                    if(data.msg==="true"){
                      deferred.resolve(data);
                    }
                    else{
                      // $rootScope.$emit('no-data');
                      deferred.reject();
                    }
                 });
              return deferred.promise;
        };

        service.updateModule = function(courseId){
          var deferred = $q.defer();
          return $http({
                method: 'POST',
                params: {
                          'userId': $rootScope.userID,
                          'examtypeid': courseId
                        },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: baseurl+'Userservices/course'
                 }).success(function(data, status, headers, config) {
                    // console.log(result);
                      deferred.resolve(data);
                 }, function(data, status, headers, config){
                      // $rootScope.$emit('no-data');
                      deferred.reject();
                 });
              return deferred.promise;
        };

        // service.getListeningData = function(userID){
        //   var deferred = $q.defer();
        //   return $http({
        //         method: 'GET',
        //         url: baseurl+'Userservices/paidQuestionList/listening/',
        //         params: {
        //                     'invoiceid': userID
        //                 }
        //          }).success(function(result) {
        //               // console.log(result);
        //               deferred.resolve(result);
        //          }, function(errorPayload){
        //               deferred.reject();
        //          });
        //       return deferred.promise;
        // };

        service.updateProfile = function(){};
        service.updateFeedback = function(){};

       return service;
     };

     function ListeningPaperService($ionicModal, $rootScope) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/listeningExam.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'listenExamCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };

       var getListeningData = function(userID){
         var deferred = $q.defer();
         return $http({
               method: 'GET',
               url: baseurl+'Userservices/paidQuestionList/listening',
               params: {
                           'invoiceid': userID
                       }
                }).success(function(result) {
                     // console.log(result);
                     deferred.resolve(result);
                }, function(errorPayload){
                    //  $rootScope.$emit('no-data');
                     deferred.reject();
                });
             return deferred.promise;
       };

     };

     function ReadingPaperService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/readingExam.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'readExamCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function WritingPaperService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/writingExam.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'writeExamCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function SpeakingPaperService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/speakingExam.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'speakExamCtrl'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function recordingModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/recording.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'recordingCtrl',
             controllerAs: 'record'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

     function videosService($http, $q, $rootScope) {

        this.getVideos = function(){
          var deferred = $q.defer();
          return $http({
                method: 'POST',
                url: baseurl+'Userservices/videoClass',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                 }).success(function(data, status, headers, config) {
                    // console.log(result);
                      deferred.resolve(data);
                 }, function(data, status, headers, config){
                      // $rootScope.$emit('no-data');
                      deferred.reject();
                 });
              return deferred.promise;
        };
     };

     function imageModalService($ionicModal) {
       this.showModal = function() {
           var service = this;
           $ionicModal.fromTemplateUrl('templates/userpanel/imagesSelection.html', {
             scope: null,
             animation: 'slide-in-right',
             backdropClickToClose: false,
             hardwareBackButtonClose: false,
             controller: 'imagesSelectionCtrl',
             controllerAs: 'record'
           }).then(function(modal) {
               service.modal = modal;
               service.modal.show();
           });
       };
       this.hideModal = function() {
           this.modal.hide();
       };
     };

})();
