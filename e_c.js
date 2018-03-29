(function() {
    'use strict';

		angular

      .module('starter.controllers', ['starter.Services'])
      .controller('AppCtrl', AppCtrl)
      .controller('LoginCtrl', LoginCtrl)
      .controller('DigitalCodeCtrl', DigitalCodeCtrl)
      .controller('SecurityCodeCtrl', SecurityCodeCtrl)
      .controller('ChangeCodeCtrl', ChangeCodeCtrl)
      .controller('DashCtrl', DashCtrl)
      .controller('ItemManagementCtrl', ItemManagementCtrl)
      .controller('ItemsSinglePriceCtrl', ItemsSinglePriceCtrl)
      .controller('ItemsMultiPriceCtrl', ItemsMultiPriceCtrl)
      .controller('PromotionCtrl', PromotionCtrl)
      .controller('PromotionsEditCtrl', PromotionsEditCtrl)
      .controller('StaffManagementCtrl', StaffManagementCtrl)
      .controller('TableManagementCtrl', TableManagementCtrl)
      .controller('bookedTablesCtrl', bookedTablesCtrl)
      .controller('occupiedTablesCtrl', occupiedTablesCtrl)
      .controller('todayStaffCtrl', todayStaffCtrl)
      .controller('allStaffCtrl', allStaffCtrl)
      .controller('staffStatusEditCtrl', staffStatusEditCtrl)
      .controller('staffAppsEditCtrl', staffAppsEditCtrl)
      .controller('viewRotaCtrl', viewRotaCtrl)
      .controller('addRotaCtrl', addRotaCtrl)
      .controller('AppManagementCtrl', AppManagementCtrl)
      .controller('updateAppCodeCtrl', updateAppCodeCtrl)
      // .module("ion-datetime-picker", ["ionic"])
      .directive("limitTo", [function() {
            return {
                restrict: "A",
                link: function(scope, elem, attrs) {
                    var limit = parseInt(attrs.limitTo);
                    angular.element(elem).on("keypress", function(e) {
                        if (this.value.length == limit){
                          e.preventDefault();
                        } 
                    });
                }
            }
        }])
        .factory('firstTime', function($cacheFactory) {
              return $cacheFactory('myData');
        });

      // var baseurl = "http://192.168.0.254/test-epos/Admininsight/";
      var baseurl = "http://www.eposhybrid.uk/Admininsight/";
      
      var currency_symbols = [
                                {name: "USD", code: "$"}, // US Dollar
                                {name: "EUR", code: "€"}, // Euro
                                {name: "CRC", code: "₡"}, // Costa Rican Colón
                                {name: "GBP", code: "£"}, // British Pound Sterling
                                {name: "ILS", code: "₪"}, // Israeli New Sheqel
                                {name: "INR", code: "₹"}, // Indian Rupee
                                {name: "JPY", code: "¥"}, // Japanese Yen
                                {name: "KRW", code: "₩"}, // South Korean Won
                                {name: "NGN", code: "₦"}, // Nigerian Naira
                                {name: "PHP", code: "₱"}, // Philippine Peso
                                {name: "PLN", code: "zł"}, // Polish Zloty
                                {name: "PYG", code: "₲"}, // Paraguayan Guarani
                                {name: "THB", code: "฿"}, // Thai Baht
                                {name: "UAH", code: "₴"}, // Ukrainian Hryvnia
                                {name: "VND", code: "₫"} // Vietnamese Dong
                             ];      

      function AppCtrl($scope, ChangeCodeService, $ionicSideMenuDelegate, $ionicPopup, $ionicLoading, LoginService, $state, $rootScope, DigitalCodeService, AUTH_EVENTS){
        var vmApp = this;

        // console.log($rootScope.white_theme);    

        // if(LoginService.isAuthenticated() && $rootScope.loginStatus){
        //   $state.go("app.dashboard", {}, {reload : true});
        //   alert("login");
        // }    
        // DigitalCodeService.showModal();

        $rootScope.items = false;
        $rootScope.promotions = false;
        $rootScope.staff = false;
        $rootScope.tables = false;
        $rootScope.apps = false;

        $rootScope.colors = ['#fabf7e','#fd8ac4', '#d770f0', '#6f91fd', '#4dc7e5', '#2ed5b9'];

        vmApp.Permissions = [{id: 2, name: "Item’s Management"}, {id: 3, name: "Promotions"}, {id: 4, name: "Staff Management"},
                             {id: 5, name: "Table management"}, {id: 6, name: "App Management"}]

        angular.forEach(vmApp.Permissions, function(value, key){
          if(value.id === 2){
            $rootScope.items = true;
          }
          if(value.id === 3){
            $rootScope.promotions = true;
          }
          if(value.id === 4){
            $rootScope.staff = true;
          }
          if(value.id === 5){
            $rootScope.tables = true;
          }
          if(value.id ===6){
            $rootScope.apps = true;
          }
        })



        $scope.$on(AUTH_EVENTS.notAuthenticated, function(event, res) {
            $ionicLoading.hide();
            if(!(LoginService.isAuthenticated()) && !($rootScope.loginStatus) && $rootScope.online && res.status == 401){
              LoginService.logoutUser();
              $state.go("app.login", {}, {reload : true});
              // var alertPopup = $ionicPopup.alert({
              //   title: 'Session Lost!',
              //   template: 'Sorry, You have to login again.',
              //   cssClass: 'Error'
              // });
              window.plugins.toast.showWithOptions({
                    message: 'Sorry, You have to login again.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }            
            window.plugins.toast.showWithOptions({
                  message: 'You are not allowed to access this resource.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }           
            window.plugins.toast.showWithOptions({
                  message: 'No Internet, please try later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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

         $scope.$on(AUTH_EVENTS.serverError, function(event, res) {
           
           $ionicLoading.hide();
           if(event && res.status == 500 && $rootScope.online){
              if(LoginService.isAuthenticated()){
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }
            window.plugins.toast.showWithOptions({
                  message: 'Internal Server Error. Try again later',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
           // console.log(res.config.params.task);
           if(event && res.status == -1 && $rootScope.online){
            if(LoginService.isAuthenticated()){
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }
            window.plugins.toast.showWithOptions({
                  message: 'Unable to fetch data. Please try again later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }
            window.plugins.toast.showWithOptions({
                  message: 'Unable to fetch data. Please try again later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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

        $rootScope.$on('not-saved', function(event, res) {
          $ionicLoading.hide();
                 
          if(event && $rootScope.online){
            if(LoginService.isAuthenticated()){
                if(res.config.params.task == 'dashboard'){
                  $rootScope.dataStatus = false;
                }
                else{
                  $state.go("app.dashboard", {}, {reload : true});  
                }                
              }
              else{
                $state.go("app.login", {}, {reload : true});
              }
               window.plugins.toast.showWithOptions({
                     message: 'Unable to save data. Please try again later.',
                     duration: 'long',
                     position: 'center',
                     styling: {
                       borderRadius: 30, // a bit less than default, 0 means a square Toast
                       backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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


        // vmApp.goDashboard();
         vmApp.isMenuOpen = function() {
            return $ionicSideMenuDelegate.isOpen();
         };

         vmApp.loginModal = function(){
            DigitalCodeService.showModal();
         };

         vmApp.goDashboard = function(){
            $state.go("app.dashboard", {}, {reload : true});
         };         
         vmApp.goItems = function(){
            $state.go("app.item-management", {}, {reload : true});
         };
         vmApp.goPromotion = function(){
            $state.go("app.promotion", {}, {reload : true});
         };
         vmApp.goStaff = function(){
            $state.go("app.staff-management.todayStaff", {}, {reload : true});
         };
         vmApp.goTable = function(){
            $state.go("app.table-management.occTables", {}, {reload : true});
         };
         vmApp.goApp = function(){
            $state.go("app.app-management", {}, {reload : true});
         };         

         vmApp.changeCode = function(){
           ChangeCodeService.showModal();
         };

         vmApp.generateCode = function(){
           DigitalCodeService.showModal();
         };

         vmApp.toggleTheme = function(){
            if($rootScope.white_theme){
              $rootScope.white_theme = false;
              $scope.$emit('themeChanged', {data : $rootScope.white_theme});
            }
            else{
              $rootScope.white_theme = true;
              $scope.$emit('themeChanged', {data : $rootScope.white_theme});
            }
          };
         

         vmApp.getPage = function(item){
           console.log(item);
         };

         vmApp.logoutUser = function(){
           LoginService.logoutUser();
           $state.go("app.login", {}, {reload : true});
         };

      };            

      function ChangeCodeCtrl($scope, LoginService, $ionicPopup, ChangeCodeService, userService, $state, $rootScope) {
        var vcCode = this;
        vcCode.loginData = {};       
        
        vcCode.checkOldLength = function(old){
          var str;
          if(old && old.toString().length > 3) {
            str = old.toString().slice(0, 4);
            vcCode.loginData.oldDigitalCode = parseInt(str);     
            if(str === $rootScope.CODE){

              console.log("OLD matched");              
            } else{
              vcCode.loginData.oldDigitalCode = "";                       
              window.plugins.toast.showWithOptions({
                      message: 'Code not matched',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          }
        };
        vcCode.checkNewLength = function(fresh){
          var str;
          if(fresh && fresh.toString().length > 4) {
            str = fresh.toString().slice(0, 4);
            vcCode.loginData.newDigitalCode = parseInt(str);                     
          }
        };
        vcCode.confirmNewLength = function(fresh, cFresh){
          var str;
          if(cFresh && cFresh.toString().length > 3) {
            str = cFresh.toString().slice(0, 4);
            vcCode.loginData.confirmDigitalCode = parseInt(str); 
            if(fresh === vcCode.loginData.confirmDigitalCode){
              console.log("matched"); 
              return;             
            } else{
              window.plugins.toast.showWithOptions({
                    message: 'Codes does not match!',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              vcCode.loginData.newDigitalCode = "";
              vcCode.loginData.confirmDigitalCode = "";               
            }          
          }    
        };

        vcCode.updateDigitalCode = function(code){
          var Code = code + ".Code";
          var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: 'Code Updated!',
                        cssClass: 'Success'
               });
              alertPopup.then(function(res) {      
              LoginService.updateCodeData(Code);
              ChangeCodeService.hideModal();          
                  // $state.go("app.dashobard", {}, {reload : true}); 
              });  
          
        };

        vcCode.closeModal = function(){
          ChangeCodeService.hideModal();
        };        

      };

      function LoginCtrl(LoginService, $rootScope, DigitalCodeService, $ionicPopup, userService, $state, $ionicSideMenuDelegate, $ionicLoading){
        var vmLogin = this;
        vmLogin.login = {};
        $ionicSideMenuDelegate.canDragContent(false);
       
        vmLogin.loginUser = function(){
          $rootScope.firstTime = true;
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          LoginService.loginUser(vmLogin.login.appKey, vmLogin.login.passcode).then(function(data, status, headers, config) {
            console.log(data);
            if(data.details.customer_id){
               $ionicLoading.hide(); 
               userService.setData(vmLogin.login);
               DigitalCodeService.showModal();                           
            }
            else{
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                       title: 'Login failed!',
                       template: 'Please check your credentials!',
                       cssClass: 'Error'
              });
              alertPopup.then(function(res) {                
                vmLogin.login = {};
              });
            }
           
          }, function(error){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                     title: 'Login failed!',
                     template: 'Please check your credentials!',
                     cssClass: 'Error'
            });
            alertPopup.then(function(res) {                
                vmLogin.login = {};
            });
          })
        };

        // vmLogin.closeModal = function(){
        //   LoginModalService.hideModal();
        // };
      };

      function DigitalCodeCtrl($scope, DigitalCodeService, userService, $state, $ionicPopup, $rootScope, LoginService, $ionicLoading) {
        var vmCode = this;
        vmCode.loginData = {};
        var userData = {};

        if(userService.getData() != ""){
          userData = userService.getData();
          // console.log(userData);          
          userService.setData(null);
        }

        vmCode.checkLength1 = function(code){
          var str;
          if(code && code.toString().length > 4) {
            str = code.toString().slice(0, 4);
            vmCode.loginData.digitalCode = parseInt(str);         
          }          
        };
        vmCode.checkLength2 = function(code1, code2){
          var str;
          if(code2 && code2.toString().length > 3) {
            str = code2.toString().slice(0, 4);
            vmCode.loginData.confirmDigitalCode = parseInt(str); 
            if(code1 === code2){
              console.log("matched");              
            } else{
                var alertPopup = $ionicPopup.alert({
                          title: 'Error!',
                          template: 'Codes does not match!',
                          cssClass: 'Error'
                });
                alertPopup.then(function(res) {                
                    vmCode.loginData.digitalCode = "";
                    vmCode.loginData.confirmDigitalCode = "";
                });
            }          
          }          
        };

        vmCode.userCode = function(userCode){
          if($rootScope.CODE === 'false'){
              $scope.$emit('codeChanged', {data : userCode.confirmDigitalCode});
              DigitalCodeService.hideModal();
          }
          else{
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            if(userCode.digitalCode === userCode.confirmDigitalCode){           
                LoginService.updateCode(userData.appKey, userData.passcode, userCode.confirmDigitalCode).then(function(data, status, headers, config) {
                    if(data.details.customer_id){
                      userService.setData(data);
                      console.log(data);
                      DigitalCodeService.hideModal();
                      $ionicLoading.hide();
                      $state.go('app.dashboard', {}, {reload : true});
                    }
                    else{
                       $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                                title: 'Error!',
                                template: 'Try again later!',
                                cssClass: 'Error'
                       });
                       alertPopup.then(function(res) {                
                          DigitalCodeService.hideModal();
                          LoginService.logoutUser();                    
                          $state.go("app.login", {}, {reload : true});
                      });
                    }
                 }, function(error){
                   $ionicLoading.hide();
                   var alertPopup = $ionicPopup.alert({
                            title: 'Error!',
                            template: 'Try again later!',
                            cssClass: 'Error'
                   });

                   alertPopup.then(function(res) {                
                      DigitalCodeService.hideModal();
                      LoginService.logoutUser();                    
                      $state.go("app.login", {}, {reload : true});
                  });
                 })
              } 
          }
                  
        };

        vmCode.closeModal = function(){
            if($rootScope.CODE === 'false'){
              DigitalCodeService.hideModal();
            }
            else{
              $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
              LoginService.updateCode(userData.appKey, userData.passcode, false).then(function(data, status, headers, config) {
                if(data.details.customer_id){
                  userService.setData(data);
                  console.log(data);
                  DigitalCodeService.hideModal();
                  $ionicLoading.hide();
                  $state.go('app.dashboard', {}, {reload : true});
                }
                else{

                }
                
             }, function(error){
               $ionicLoading.hide();
               var alertPopup = $ionicPopup.alert({
                        title: 'Error!',
                        template: 'Try again later!',
                        cssClass: 'Error'
               });

               alertPopup.then(function(res) {                
                  DigitalCodeService.hideModal();
                  $state.go('app.login', {}, {reload : true});
              });
             }) 
            }                       
        };
      };

      function SecurityCodeCtrl($scope, LoginService, SecurityCodeService, userService, $state, $rootScope) {
        var vsCode = this;
        vsCode.loginData = {};
        var userData = {};
        
        vsCode.checkLength = function(code){
          var str;
          if(code && code.toString().length > 4) {
            str = code.toString().slice(0, 4);
            vsCode.loginData.digitalCode = parseInt(str);                     
          }     
        };

        vsCode.checkCode = function(Code){
          if(Code === parseInt($rootScope.CODE)){  
            SecurityCodeService.hideModal();          
            // $state.go('app.dashboard', {}, {reload : true});
          }
          else{
            vsCode.loginData.digitalCode = "";
              window.plugins.toast.showWithOptions({
                     message: 'Please enter correct code.',
                     duration: 'long',
                     position: 'center',
                     styling: {
                       borderRadius: 30, // a bit less than default, 0 means a square Toast
                       backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
        };

        vsCode.closeModal = function(){
          SecurityCodeService.hideModal();
          // navigator.app.exitApp();
        };

        vsCode.logout = function(){
           SecurityCodeService.hideModal();
           LoginService.logoutUser();
           $state.go("app.login", {}, {reload : true});
        };

      };

      function DashCtrl($scope, $state, $cordovaFile, firstTime, $rootScope, LoginService, SecurityCodeService, $ionicSlideBoxDelegate, userService, $ionicLoading, ionicDatePicker, dashboardService, $ionicPopup){
        var vmDash = this;
        // alert('hi');
        vmDash.dashboard = {};
        // console.log($rootScope.graph_backcolor);
        // console.log($rootScope.graph_color);
        console.log($rootScope.CODE);

        vmDash.dashboard.selectItems = [
          {id: 1, name: 'Today'},
          {id: 2, name: 'Week'},
          {id: 3, name: 'Month'},
          {id: 5, name: 'Custom'}
        ];

        
        // vmDash.dashboard.selectedItem = '1';

        vmDash.getTotalData = function(key){
          console.log(key);
          if($rootScope.online){
            if(key === 5){
              vmDash.dashboard.customDates = true;
              vmDash.dashboard.startDate = '';
              vmDash.dashboard.endDate = '';
            } 
            else{
              vmDash.dashboard.customDates = false;
              DashboardData(key, '', '');
            } 
          }
          else{
            $rootScope.dataStatus = false;
          }
          
          // console.log(vmDash.dashboard.customDates);
          
        };


        $rootScope.$on('themeChanged', function(event, res) {
          // console.log(res.data);
          if(res.data){
            $rootScope.graph_backcolor = '#fff';
            $rootScope.graph_color = '#fff';
          }
          else{
            $rootScope.graph_backcolor = '#2a343d';
            $rootScope.graph_color = 'red';
          }
          var theme = res.data + ".Theme";          
          LoginService.updateTheme(theme);
          // console.log($state.current.name);
          if($state.current.name == 'app.dashboard'){
            $state.go("app.dashboard", {}, {reload : true});          
          }
        });

        $rootScope.dataStatus = false;
        vmDash.dashboard.customDates = false;

        // console.log(vmDash.dashboard.customDates);


        if(userService.getData != "" && userService.getData != undefined){
          vmDash.dashboard.userData = userService.getData();
          if(!angular.equals({}, vmDash.dashboard.userData) && vmDash.dashboard.userData != null){
            $rootScope.firstTime = true;
          }
          else{
            $rootScope.firstTime = false;
          }          
          // console.log(vmDash.dashboard.userData);
          DashboardData(1, '', '');
          userService.setData(null);
        }

        var cache = firstTime.get('fTime');
        if (cache === "true") { // If there’s something in the cache, use it!
          $scope.variable = true;
        }
        else { // Otherwise, let’s generate a new instance
          firstTime.put('fTime', "true");
          $scope.variable = false;
        }
        if(!$scope.variable && !$rootScope.firstTime && $rootScope.CODE != "false" && !$rootScope.dataStatus){
          SecurityCodeService.showModal();
        }

        


        vmDash.dashboard.dashData = [];

        if($rootScope.online){
          DashboardData(1, '', '');  
        }
        else{
          $rootScope.dataStatus = false;
        }

        

        function DashboardData(key, start, end){

          if($rootScope.online){
            vmDash.dashboard.dashData = [];
         
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            dashboardService.getDashboardData(key, start, end).then(function(data, status, headers, config){
              // console.log(data);
              // data.status = false;
              var response = data.data;
             if(data.status){
                $rootScope.dataStatus = true;
                vmDash.dashboard.dashData.totalSales = response.total;
                vmDash.dashboard.dashData.salesWise = response.servicewise;
                vmDash.dashboard.dashData.Bar_Graph = response.bar_graph;
                vmDash.dashboard.dashData.Line_Graph = response.line_graph;

                 vmDash.dashboard.lineData = [];
                 vmDash.dashboard.barData = [];
                 vmDash.dashboard.lineObject = {};
                 vmDash.dashboard.barObject = {};

                   if(key === 5){
                      vmDash.dashboard.customDates = true;            
                      angular.forEach(vmDash.dashboard.dashData.Line_Graph.data, function(value, key){
                        var c = [];
                        var k1 = {};
                        k1.v = key; 
                        var k2 = {};
                        // k2.v = Math.random();
                        k2.v = value;

                        c.push(k1, k2);
                        var c1 = {c};

                        vmDash.dashboard.lineData.push(c1);
                      });

                    // vmDash.dummy_bar = {13: "20", 14: "12", 15: "0", 16: "5", 17: "25", 18: "16", 19: "10"};

                      angular.forEach(vmDash.dashboard.dashData.Bar_Graph.data, function(value, key){
                        var c = [];
                        var k1 = {};
                        k1.v = key; 
                        var k2 = {};
                        // k2.v = Math.random();
                        k2.v = value;
                        // var k3 = {};
                        // k3.v = Math.random();
                        // k3.v = vmDash.dashboard.dashData.Bar_Graph.data[key];
                        c.push(k1, k2);
                        var c1 = {c};

                        vmDash.dashboard.barData.push(c1);
                      });

                      vmDash.dashboard.lineObject.type = "LineChart";
                      vmDash.dashboard.lineObject.data = {
                          "cols": [
                              { id: "t", label: "Topping", type: "string" },
                              { id: "s", label: "Sales", type: "number" }
                          ], "rows": vmDash.dashboard.lineData
                      };                  

                      vmDash.dashboard.lineObject.options = {
                          'curveType': 'function',
                          'pointSize': 5,                  
                          'title': vmDash.dashboard.dashData.Line_Graph.title,
                          'chartArea':{left:0,top:20, bottom:20, width:'100%',height:'100%'},
                          'colors':['#1ccdb9','#f68884'],
                          'legend': { 
                              position: 'none'                                              
                           },
                          'vAxis': { 
                              textPosition: 'none',
                              viewWindow: {min: 0},
                              gridlines: {
                                            color: 'transparent'
                                         }
                          },
                          'titleTextStyle': { color: $rootScope.graph_color },                  
                          'backgroundColor': $rootScope.graph_backcolor,
                          'hAxis': {
                            'textStyle': {
                            color: $rootScope.graph_color
                          }
                        }
                      };
                   }
                   else{
                      vmDash.dashboard.customDates = false;
                      angular.forEach(vmDash.dashboard.dashData.Line_Graph.data, function(value, key){
                        var c = [];
                        var k1 = {};
                        k1.v = key; 
                        var k2 = {};
                        // k2.v = Math.random();
                        k2.v = value;
                        var k3 = {};
                        // k3.v = Math.random();
                        k3.v = vmDash.dashboard.dashData.Line_Graph.data1[key];
                        c.push(k1, k2, k3);
                        var c1 = {c};
                        vmDash.dashboard.lineData.push(c1);
                      });
                    // vmDash.dummy_bar = {13: "20", 14: "12", 15: "0", 16: "5", 17: "25", 18: "16", 19: "10"};

                      angular.forEach(vmDash.dashboard.dashData.Bar_Graph.data, function(value, key){
                        var c = [];
                        var k1 = {};
                        k1.v = key; 
                        var k2 = {};
                        // k2.v = Math.random();
                        k2.v = value;
                        // var k3 = {};
                        // // k3.v = Math.random();
                        // k3.v = vmDash.dashboard.dashData.Bar_Graph.data[key];
                        c.push(k1, k2);
                        var c1 = {c};
                        vmDash.dashboard.barData.push(c1);
                      });


                      vmDash.dashboard.lineObject.type = "LineChart";                     
                      vmDash.dashboard.lineObject.data = {
                          "cols": [{
                            id: "day",
                            label: "Day",
                            type: "string"
                        }, {
                            id: "today",
                            label: vmDash.dashboard.dashData.Line_Graph.title1,
                            type: "number"
                        },
                        {
                            id: "LWD",
                            label: vmDash.dashboard.dashData.Line_Graph.title2,
                            type: "number"
                        }],
                         "rows": vmDash.dashboard.lineData
                         
                      };

                      vmDash.dashboard.lineObject.options = {
                          'curveType': 'function',
                          'pointSize': 5,                  
                          'title': vmDash.dashboard.dashData.Line_Graph.title,
                          'chartArea':{left:0,top:20, bottom:50, width:'100%',height:'100%'},
                          'colors':['#1ccdb9','#f68884'],
                          'legend': { 
                              position: 'bottom',
                              textStyle: {
                                'color': $rootScope.graph_color
                              }                    
                           },
                          'vAxis': { 
                              textPosition: 'none',
                              viewWindow: {min: 0},
                              gridlines: {
                                            color: 'transparent'
                                         }
                          },
                          'titleTextStyle': { color: $rootScope.graph_color },                  
                          'backgroundColor': $rootScope.graph_backcolor,
                          'hAxis': {
                            'textStyle': {
                            color: $rootScope.graph_color
                          }
                        }
                      };
                   }

                console.log(vmDash.dashboard.barData);

                
                vmDash.dashboard.barObject.type = "ColumnChart";
                vmDash.dashboard.barObject.data = {                  
                    "cols": [
                        { id: "t", label: "Topping", type: "string" },
                        { id: "s", label: "Sales", type: "number" }
                    ], "rows": vmDash.dashboard.barData

                };

                vmDash.dashboard.barObject.options = {
                    'title': vmDash.dashboard.dashData.Bar_Graph.title,
                     'chartArea':{left:0,top:20, bottom:20, width:'100%',height:'75%'},
                    'legend': { 
                        position: 'none'                     
                     },
                    // 'legend': { 
                    //     position: 'bottom', 
                    //     alignment: 'start',
                    //     textStyle: {color: $rootScope.graph_color, fontSize: 16 }
                    //  },
                    'vAxis': { 
                        textPosition: 'none',
                        viewWindow: {min: 0},
                        gridlines: {
                                      color: 'transparent'
                                   }
                    },
                    'titleTextStyle': { color: $rootScope.graph_color }, 
                    'color': $rootScope.graph_color,
                    'backgroundColor': $rootScope.graph_backcolor,
                    'hAxis': {
                      'textStyle': {
                      color: $rootScope.graph_color
                    }
                  }
                };       
                              
                $ionicLoading.hide();

              }
              else{
                 $rootScope.dataStatus = false;
                 // $state.go("app.dashboard", {}, {reload : true});
                 $ionicLoading.hide();
                 window.plugins.toast.showWithOptions({
                        message: 'Something went wrong. Pull to refresh the page',
                        duration: 'long',
                        position: 'center',
                        styling: {
                          borderRadius: 30, // a bit less than default, 0 means a square Toast
                          backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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

            }, function(data, status, headers, config){
                $rootScope.dataStatus = false;
                $ionicLoading.hide();
                window.plugins.toast.showWithOptions({
                        message: 'Something went wrong. Pull to refresh the page',
                        duration: 'long',
                        position: 'center',
                        styling: {
                          borderRadius: 30, // a bit less than default, 0 means a square Toast
                          backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
            });

          }
          else{
            $rootScope.dataStatus = false;
            $ionicLoading.hide();
          }                
        };        

        vmDash.doRefreshData = function() {
           DashboardData(1, '', '');
           $scope.$broadcast('scroll.refreshComplete');
        }; 

        $rootScope.$on('codeChanged', function(event, res) {
          var code = res.data + ".Code";
          LoginService.updateCodeData(code);
        });  

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
        $cordovaFile.checkDir(directory, "eposhybrid/Pics")
           .then(function (success) {            
           }, function (error) {             
             $cordovaFile.createDir(directory+"eposhybrid/", "Pics", false)
               .then(function (success) {                 
               }, function (error) {                
               });
           });
        };         

        for(var i=0; i<currency_symbols.length; i++){
          if(currency_symbols[i].name === $rootScope.Curency){
            vmDash.dashboard.currencyCode = currency_symbols[i].code;
          }
          else{
            vmDash.dashboard.currencyCode = currency_symbols[0].code;
          }
        };        

        vmDash.dashboard.showDates = false;

        vmDash.timeOptions = [{id:1, option:"Today Insights"},{id:2, option:"Week Sales"},{id:3, option:"Month Sales"},
                          {id:4, option:"Year Sales"}, {id:5, option:"Custom Dates"}];

        vmDash.clearStart = function(){
          vmDash.dashboard.startDate = "";
          vmDash.dashboard.endDate = "";
        };
        vmDash.clearEnd = function(){
          vmDash.dashboard.endDate = "";
        };

        function changeFormat(dt){
            // var today = new Date();
            var dd = dt.getDate();
            var mm = dt.getMonth()+1; //January is 0!
            var yyyy = dt.getFullYear();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
          };

        vmDash.startDatePicker = function() {
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              var start = new Date(val);
              vmDash.dashboard.startDate = changeFormat(start);
              // Startdt = dateFormat($scope.startDt);
              // var from = $scope.startDt.split("/");
              // var f = new Date(from[2], from[1] - 1, from[0]);
              // console.log(Startdt);
            },
            from: new Date(2016, 1, 1),
            to: new Date(),
            inputDate: new Date(),
            mondayFirst: true,
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'popup'
          };
          ionicDatePicker.openDatePicker(ipObj1);
        };
        vmDash.endDatePicker = function() {
          var from = vmDash.dashboard.startDate.split("/");
          var ipObj2 = {
            callback: function (val) {  //Mandatory
              var end = new Date(val);
              vmDash.dashboard.endDate = changeFormat(end);

              // console.log(Startdt);
            },

            from: new Date(from[2], from[1] - 1, from[0]),
            to: new Date(),
            inputDate: new Date(),
            mondayFirst: true,
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'popup'
          };
          ionicDatePicker.openDatePicker(ipObj2);
        };
      
        vmDash.getCustomData = function(key, start, end){
          console.log(key);
          console.log(start);
          console.log(end);
          DashboardData(key, start, end);       
        }

      };

      function ItemManagementCtrl($scope, $cordovaFile, $rootScope, userService, $ionicPopup, ItemsService, ItemsSinglePriceService, ItemsMultiPriceService, $ionicLoading){
        var vmItem = this;

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
        $cordovaFile.checkDir(directory, "eposhybrid/Pics")
           .then(function (success) {            
           }, function (error) {             
             $cordovaFile.createDir(directory+"eposhybrid/", "Pics", false)
               .then(function (success) {                 
               }, function (error) {                
               });
           });
        };
        vmItem.itemsData = {};

        vmItem.itemsData.listlength = 10;

        vmItem.doRefreshData = function() {
           getItems();
           getMenuTypes();
           getMenuCategory();
           $scope.$broadcast('scroll.refreshComplete');
        };        

        function getItems(){
          // $ionicLoading.show({template : 'Loading...'});
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          vmItem.totalItems = [];
          var promise = ItemsService.getItems();
          promise.then(function(data, status, headers, config) {
            // console.log(response.data.item_list[0].image);            
            if(data.data.status){

              vmItem.totalItems = data.data.data.item_list;
              // console.log(vmItem.totalItems);
              for(var i=0; i<vmItem.totalItems.length; i++){
                if(vmItem.totalItems[i].price !== "multiple_price"){
                  vmItem.totalItems[i].symbol = code;
                  vmItem.totalItems[i].mul_price = "";
                }else{
                  vmItem.totalItems[i].symbol = "";
                  vmItem.totalItems[i].mul_price = "Multiple Price";
                }
              }   

              for (var i=0; i<vmItem.totalItems.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmItem.totalItems[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmItem.totalItems[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmItem.totalItems[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }     
                $ionicLoading.hide();      
            }
            else{
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
            }
            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               $rootScope.$emit('no-data');
          });
        }
        getItems();

        function getMenuTypes(){
          vmItem.menuTypes = [];
          ItemsService.menuTypes().then(function(data, status, headers, config){
            var response = data.data;
            if(data.status){
              vmItem.menuTypes = response.menu_type;
              var item = {category_id:"0", category_name:"All"};
              vmItem.menuTypes.splice(0, 0, item);
              vmItem.itemsData.menuType='0';
            }
            else{
              $rootScope.$emit('no-data');
            }             
          })
        };
        // getMenuTypes();

        function getMenuCategory(){
          vmItem.menuCategories = [];
          ItemsService.menuCategories().then(function(data, status, headers, config){            
            var response = data.data;
            if(data.status){
              vmItem.menuCategories = response.menu_category;
              var item = {sub_id:"0", sub_catname:"All"};
              vmItem.menuCategories.splice(0, 0, item);
              vmItem.itemsData.menuCategory='0';
            }
            else{
              $rootScope.$emit('no-data');
            }
            
          })
        };
        // getMenuCategory();

        vmItem.menuTypeChange = function(category_id, sub_id){
          sub_id = "0";
          // vmItem.menuCategories = [];
          if(category_id != null){
            var promise = ItemsService.getItems(category_id, sub_id);
            promise.then(function(data, status, headers, config) {
              $ionicLoading.hide();         
              var response = data.data.data;
              if(data.data.status){
                if(category_id != "0"){
                  vmItem.menuCategories = response.menu_category;
                  var item = {sub_id:"0", sub_catname:"All"};
                  vmItem.menuCategories.splice(0, 0, item);
                  vmItem.itemsData.menuCategory='0';
                }else{
                  getMenuCategory();
                  // vmItem.menuCategories = [{sub_id:"0", sub_catname:"All"}];
                }
                if(response.item_list){
                  vmItem.totalItems = response.item_list;
                  // console.log(vmItem.totalItems);
                  for(var i=0; i<vmItem.totalItems.length; i++){
                    if(vmItem.totalItems[i].price !== "multiple_price"){
                      vmItem.totalItems[i].symbol = code;
                    }else{
                      vmItem.totalItems[i].symbol = "";
                      vmItem.totalItems[i].mul_price = "Multiple Price";
                    }
                  }
                }
                else{
                  vmItem.totalItems = [];
                }
                
              }
              else{
                $rootScope.$emit('no-data');
              }                         
            }, function(data, status, headers, config) {
                  $rootScope.$emit('no-data');
            });
          }          
        };

        vmItem.menuCategoryChange = function(category_id, sub_id){
          // console.log(category_id);
          // console.log(sub_id);
          if(category_id != null || sub_id != null){
            var promise = ItemsService.getItems(category_id, sub_id);
            promise.then(function(data, status, headers, config) {
              // console.log(response.data.item_list);
              $ionicLoading.hide();
              var response = data.data.data;
              if(data.data.status){
                if(data.data.data.item_list){
                  vmItem.totalItems = response.item_list;
                  // console.log(vmItem.totalItems);
                  for(var i=0; i<vmItem.totalItems.length; i++){
                    if(vmItem.totalItems[i].price !== "multiple_price"){
                      vmItem.totalItems[i].symbol = code;
                    }else{                      
                      vmItem.totalItems[i].symbol = "";
                      vmItem.totalItems[i].mul_price = "Multiple Price";
                    }
                  }
                }
                else{
                  vmItem.totalItems = [];
                }                
              }
              else{
                $rootScope.$emit('no-data');
              }
              
            }, function(data, status, headers, config) {
                  $rootScope.$emit('no-data');
            });
          }          
        };

        vmItem.changePricing = function(item){
            // console.log(item);
            if(item.price === "multiple_price"){
              // userService.setData(item);
              ItemsService.multiPrice(item.item_id).then(function(data, status, headers, confi){
                // console.log(data);
                // return;
                if(data.status){
                  userService.setMoreData(data,item);
                  ItemsMultiPriceService.showModal();  
                }
                else{
                  window.plugins.toast.showWithOptions({
                      message: 'Unable to fetch data. Please try later',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              })
            }else{
              userService.setData(item);
              ItemsSinglePriceService.showModal();
            }
        };

        var item_data = {};
        vmItem.statusChange = function(item){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure want to change the status?',
            cancelText: 'Cancel',
            cancelType: 'button-assertive',
            okText: 'OK',
            okType: 'button-balanced',
            cssClass: 'QUIT'
          });

          confirmPopup.then(function(res) {
            if(res){
              $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
              item_data = {app_key: $rootScope.AppKey,item_id: item.item_id, status: item.status};
              ItemsService.updateStatus(item_data).then(function(data, status, headers, config){                
                if(data.status){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                           title: 'Success!',
                           template: 'Successfully Updated!',
                           cssClass: 'Success'
                  });
                  alertPopup.then(function(res) {
                      getItems();
                  });
                }
                else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  }); 
                  alertPopup.then(function(res) {
                      getItems();
                  });                
                }
              }, function(error){
                  $ionicLoading.hide();                  
                  var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  }); 
                  alertPopup.then(function(res) {
                      getItems();
                  });                 
              })
            }
            else{
              getItems();
            }

          });

        };

        // console.log($rootScope.FirstName);
        // console.log($rootScope.Curency);
        var code = "";
        for(var i=0; i<currency_symbols.length; i++){
          if(currency_symbols[i].name === $rootScope.Curency){
            code = currency_symbols[i].code;
          }
          else{
            code = currency_symbols[0].code;
          }
        };
        

        $rootScope.$on("SinglePriceData", function() {
          getItems();
        })

        vmItem.loadMore = function(){
          if (!vmItem.totalItems){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              return;
          }
          if (vmItem.itemsData.listlength < vmItem.totalItems.length){
            vmItem.itemsData.listlength+=10;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };

        vmItem.clearSearch = function(){
          vmItem.itemsData.searchText = "";
        };
      };

      function ItemsSinglePriceCtrl($cordovaFile, $cordovaFileTransfer, ItemsSinglePriceService, userService, $rootScope, ItemsService, $ionicPopup, $ionicLoading){
        var singlePrice = this;

        var pictureSource = navigator.camera.PictureSourceType;
        var destinationType = navigator.camera.DestinationType;


        singlePrice.singleItem = {};
        var singleData = {};
        if(userService.getData() != ""){
          singleData = userService.getData();
          // console.log(singleData);
          singlePrice.singleItem.priceVal = singleData.price;
          // console.log(singlePrice.singleItem);
          userService.setData(null);
        }
        var item_data = {};      

        singlePrice.checkOptions = [{"id":1, "name": "Item Image", "key": 'item_img'},
        {"id":2, "name": "Digital Menu", "key": 'digital_img'}];        

        singlePrice.stateChanged = function(item){
          // console.log(singlePrice.picType);
        }; 
               
        singlePrice.choosePic = function(){
          if(ionic.Platform.isIOS()){
             navigator.camera.getPicture(onSuccess, onFail, {
                quality: 80,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.NATIVE_URI,
                mediaType: Camera.MediaType.ALLMEDIA,
                encodingType: Camera.EncodingType.JPEG,
                // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
                targetWidth: 900,
                targetHeight: 900
            });
          }
          navigator.camera.getPicture(onSuccess, onFail, {
                quality: 80,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                mediaType: Camera.MediaType.ALLMEDIA,
                encodingType: Camera.EncodingType.JPEG,
                // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
                targetWidth: 900,
                targetHeight: 900
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
              // alert("hi "+imageURL);
              var imageURI = "";

              if(ionic.Platform.isIOS()){
                
                if(imageURL.indexOf("file") >= 0){
                  imageURI = imageURL;                  
                  var fileName= imageURI.substr(imageURI.lastIndexOf('/') + 1);
                  var res = imageURI.replace(fileName, "");
                  var directory = "";
                  if (cordova.file.documentsDirectory) {
                    directory = cordova.file.documentsDirectory; // for iOS
                  }

                  $cordovaFile.checkFile(directory, fileName)
                    .then(function (success) {
                      $rootScope.$emit('IOSPicChange1', {data : fileName});

                      // alert("Success: "+JSON.stringify(success));
                  }, function (error) {
                      // alert("Error: "+JSON.stringify(error));
                      $cordovaFile.copyFile(res, fileName, directory, fileName)
                      .then(function (success) {
                        // alert("Copy: "+JSON.stringify(success));
                        $rootScope.$emit('IOSPicChange1', {data : fileName});
                        // image.profilePic = fileURI;
                      }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Failed because: ' + JSON.stringify(error),
                                cssClass: 'Error'
                              });
                        // alert("Copy error: "+JSON.stringify(error));
                        // error
                      });
                    // error
                  });
                  
                }
                else{
                  var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Unable to get the image',
                    cssClass: 'Error'
                  });
                }
              }
              else{
                  imageURI = 'file://' + imageURL;  
                  var options = new FileUploadOptions();
                  options.fileKey = "file";
                  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                  options.mimeType = "image/jpeg";
                  options.params = {}; // if we need to send parameters to the server request
                  // alert(options.fileName);
                  var res = imageURI.replace(options.fileName, "");
                  var directory;
                  if (cordova.file.documentsDirectory) {
                    directory = cordova.file.documentsDirectory; // for iOS
                  } else {
                    directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
                  }

                  $cordovaFile.checkFile(directory, options.fileName)
                    .then(function (success) {
                      $rootScope.$emit('PicChange1', {data : options.fileName});

                      // alert("Success: "+JSON.stringify(success));
                  }, function (error) {
                      // alert("Error: "+JSON.stringify(error));
                      $cordovaFile.copyFile(res, options.fileName, directory, options.fileName)
                      .then(function (success) {
                        // alert("Copy: "+JSON.stringify(success));
                        $rootScope.$emit('PicChange1', {data : options.fileName});
                        // image.profilePic = fileURI;
                      }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Failed because: ' + JSON.stringify(error),
                                cssClass: 'Error'
                              });
                        // alert("Copy error: "+JSON.stringify(error));
                        // error
                      });
                    // error
                  });
                }              
              }

              
          };

          function onFail(message) {
              var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Failed because: ' +JSON.stringify(message),
                    cssClass: 'Error'
                });
              // alert('Failed because: ' + message);
          };

        };
        singlePrice.defaultPic = "img/icons/blackBackgroundSwitchOff.png";

        $rootScope.$on('PicChange1', function(event, res) {
          // vmProfile.profile.Pic = "";
          // alert(res.data);
          singlePrice.picName = res.data;
          var  directory;
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          } else {
            directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
          }
          singlePrice.Pic = directory+singlePrice.picName;
          // alert(pic);
          // alert(vmProfile.profilePic);
        });

        $rootScope.$on('IOSPicChange1', function(event, res) {
          // vmProfile.profile.Pic = "";
          singlePrice.picName = res.data;

          var directory = "";
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          }
                    
          singlePrice.Pic = directory+singlePrice.picName;
          // alert(pic);
          // alert(vmProfile.profilePic);
        });

        singlePrice.takePic = function(){
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
                alert('Done!');
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
                directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
              }

              $cordovaFile.copyFile(res, options.fileName, directory, options.fileName)
              .then(function (success) {
                $rootScope.$emit('PicChange1', {data : options.fileName});
                // alert(success);
                // alert("Copy: "+JSON.stringify(success));
                // alert("File Path: "+fileURI);              
              }, function (error) {
                  // alert("Copy error: "+JSON.stringify(error));
                // error
              });
          };
          function onFail(message) {
            var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Failed because: ' +JSON.stringify(message),
                        cssClass: 'Error'
            });
            // alert('Failed because: ' +JSON.stringify(message));
          };

        

        singlePrice.updatePrices = function(){
          // console.log(singlePrice.picType);
          if(singlePrice.picType === undefined){
            // console.log(singlePrice.picType);
            singlePrice.picType = undefined;
            console.log("FALSE");
          }
          else{
            console.log(singlePrice.picType);            
            console.log("TRUE");
          }
          // return;
          // alert('pic '+singlePrice.Pic);
          // item_data = {app_key: $rootScope.AppKey,item_id: singleData.item_id, price: singlePrice.singleItem.priceVal};
          if(singlePrice.Pic != undefined && singlePrice.Pic != ''){
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});

            // alert('pic '+singlePrice.Pic);
            // Destination URL
             var url = baseurl+"update_item/";
             // alert(url);
             var directory;
             var targetPath;
             if (cordova.file.documentsDirectory) {
               directory = cordova.file.documentsDirectory; // for iOS
             } else {
               directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
             }
          
          
             //File for Upload
             if(ionic.Platform.isAndroid()){
                targetPath = directory+singlePrice.picName;
             }
             else{
                targetPath = directory+singlePrice.picName;
             }
             
             // alert(targetPath);
             // File name only
             var filename = targetPath.split("/").pop();
             // alert(filename);
          
            //  var timeSpent = "0:"+record.timer;
            // $ionicLoading.show({template : 'Updating Profile...'});
            // alert(JSON.stringify(singlePrice.picType));
             var options = {
                  // fileUpload: true,
                  fileKey: "file",
                  fileName: filename,
                  httpMethod: "POST",
                 //  mimeType: "audio/vnd.wav",
                  mimeType: "image/jpeg",
                  params : {
                              'app_key': $rootScope.AppKey,
                              'item_id':singleData.item_id,
                              'price': singlePrice.singleItem.priceVal,
                              'pic_type': singlePrice.picType,
                              // 'country': profile.nationality,
                              // 'phone':profile.dialCode +" "+profile.phone,
                              // 'sex': profile.sex,
                              // 'pic': filename,
                              'file': filename
                           }, // directory represents remote directory,  fileName represents final remote file name
                  chunkedMode: false
              };
              // alert(JSON.stringify(options));
              console.log(JSON.stringify(options));
              // return;
              $cordovaFileTransfer.upload(url, targetPath, options, true).then(function (res) {
                // alert("Success: "+JSON.stringify(res));
                   $ionicLoading.hide();
                   var alertPopup = $ionicPopup.alert({
                       title: 'Success',
                       template: 'Profile Updated Successfully',
                       cssClass: 'Success'
                   });
                   alertPopup.then(function(res) {
                     ItemsSinglePriceService.hideModal();
                     $rootScope.$emit("SinglePriceData");
                   });
                }, function (err) {
                    // alert("Error "+JSON.stringify(err));
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Unable to upload, something went wrong...',
                        cssClass: 'Error'
                    });
                    alertPopup.then(function(res) {
                      ItemsSinglePriceService.hideModal();
                      // $rootScope.$emit("SinglePriceData");
                    });
                    // recordingModalService.hideModal();
                }, function (progress) {
                  // alert("Progress "+JSON.stringify(progress));
                    // PROGRESS HANDLING GOES HERE
                });
          }
          else{
            // alert('hi');
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            var item_data = {app_key: $rootScope.AppKey,item_id: singleData.item_id, price: singlePrice.singleItem.priceVal};
            ItemsService.updateSinglePrice(item_data).then(function(data, status, headers, config){
              // console.log(res);
              if(data.status){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                         title: 'Success!',
                         template: 'Successfully Updated!',
                         cssClass: 'Success'
                });
                alertPopup.then(function(res) {
                    ItemsSinglePriceService.hideModal();
                    $rootScope.$emit("SinglePriceData");
                });
              }
              else{
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                         title: 'Error!',
                         template: 'Unable to Update!',
                         cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                    ItemsSinglePriceService.hideModal();
                });
              }
            }, function(error){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                         title: 'Error!',
                         template: 'Unable to Update!',
                         cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                      ItemsSinglePriceService.hideModal();
                      $rootScope.$emit("SinglePriceData");
                });
            })
          }

        };

        singlePrice.closeModal = function(){
          ItemsSinglePriceService.hideModal();
        };
      };
      function ItemsMultiPriceCtrl($cordovaFile, $ionicLoading, $cordovaFileTransfer, $ionicPopup, $rootScope, ItemsMultiPriceService, userService, ItemsService){
        var multiPrice = this;

        var pictureSource = navigator.camera.PictureSourceType;
        var destinationType = navigator.camera.DestinationType;

        multiPrice.multiItem = {};
        var totalData = {};
        if(userService.getMoreData() != ""){
          totalData = userService.getMoreData();
          // console.log(totalData);
          multiPrice.multiItem = totalData[0].data.multiple_sizeprice;
          multiPrice.itemInfo = totalData[1];

          userService.setMoreData(null, null);
        }

        multiPrice.checkOptions = [{"id":1, "name": "Item Image", "key": 'item_img'},
        {"id":2, "name": "Digital Menu", "key": 'digital_img'}];        

        multiPrice.stateChanged = function(item){
          // console.log(singlePrice.picType);
        };

        multiPrice.defaultPic = "img/icons/blackBackgroundSwitchOff.png";

        multiPrice.choosePic = function(){
          if(ionic.Platform.isIOS()){
             navigator.camera.getPicture(onSuccess, onFail, {
                quality: 80,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.NATIVE_URI,
                mediaType: Camera.MediaType.ALLMEDIA,
                encodingType: Camera.EncodingType.JPEG
                // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
                // targetWidth: 900,
                // targetHeight: 900
            });
          }
          navigator.camera.getPicture(onSuccess, onFail, {
                quality: 80,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI,
                mediaType: Camera.MediaType.ALLMEDIA,
                encodingType: Camera.EncodingType.JPEG
                // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
                // targetWidth: 900,
                // targetHeight: 900
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
              // alert("hi "+imageURL);
              var imageURI = "";

              if(ionic.Platform.isIOS()){
                
                if(imageURL.indexOf("file") >= 0){
                  imageURI = imageURL;                  
                  var fileName= imageURI.substr(imageURI.lastIndexOf('/') + 1);
                  var res = imageURI.replace(fileName, "");
                  var directory = "";
                  if (cordova.file.documentsDirectory) {
                    directory = cordova.file.documentsDirectory; // for iOS
                  }

                  $cordovaFile.checkFile(directory, fileName)
                    .then(function (success) {
                      $rootScope.$emit('IOSPicChange2', {data : fileName});

                      // alert("Success: "+JSON.stringify(success));
                  }, function (error) {
                      // alert("Error: "+JSON.stringify(error));
                      $cordovaFile.copyFile(res, fileName, directory, fileName)
                      .then(function (success) {
                        // alert("Copy: "+JSON.stringify(success));
                        $rootScope.$emit('IOSPicChange2', {data : fileName});
                        // image.profilePic = fileURI;
                      }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Failed because: ' + JSON.stringify(error),
                                cssClass: 'Error'
                              });
                        // alert("Copy error: "+JSON.stringify(error));
                        // error
                      });
                    // error
                  });
                  
                }
                else{
                  var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Unable to get the image',
                    cssClass: 'Error'
                  });
                }
              }
              else{
                  imageURI = 'file://' + imageURL;  
                  var options = new FileUploadOptions();
                  options.fileKey = "file";
                  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                  options.mimeType = "image/jpeg";
                  options.params = {}; // if we need to send parameters to the server request
                  // alert(options.fileName);
                  var res = imageURI.replace(options.fileName, "");
                  var directory;
                  if (cordova.file.documentsDirectory) {
                    directory = cordova.file.documentsDirectory; // for iOS
                  } else {
                    directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
                  }

                  $cordovaFile.checkFile(directory, options.fileName)
                    .then(function (success) {
                      $rootScope.$emit('PicChange2', {data : options.fileName});

                      // alert("Success: "+JSON.stringify(success));
                  }, function (error) {
                      // alert("Error: "+JSON.stringify(error));
                      $cordovaFile.copyFile(res, options.fileName, directory, options.fileName)
                      .then(function (success) {
                        // alert("Copy: "+JSON.stringify(success));
                        $rootScope.$emit('PicChange2', {data : options.fileName});
                        // image.profilePic = fileURI;
                      }, function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: 'Failed because: ' + JSON.stringify(error),
                                cssClass: 'Error'
                              });
                        // alert("Copy error: "+JSON.stringify(error));
                        // error
                      });
                    // error
                  });
                }              
              }

              
          };

          function onFail(message) {
              var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: 'Failed because: ' + JSON.stringify(message),
                    cssClass: 'Error'
              });
          };

        };

        $rootScope.$on('PicChange2', function(event, res) {
          // vmProfile.profile.Pic = "";
          // alert(res.data);
          multiPrice.picName = res.data;

          var  directory;
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          } else {
            directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
          }
          multiPrice.Pic = directory+multiPrice.picName;
          // alert(pic);
          // alert(vmProfile.profilePic);
        });

        $rootScope.$on('IOSPicChange2', function(event, res) {
          // vmProfile.profile.Pic = "";
          multiPrice.picName = res.data;
          var directory = "";
          if (cordova.file.documentsDirectory) {
            directory = cordova.file.documentsDirectory; // for iOS
          }
          
          multiPrice.Pic = directory+multiPrice.picName;
          // alert(pic);
          // alert(vmProfile.profilePic);
        });

        multiPrice.takePic = function(){
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
                directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
              }

              $cordovaFile.copyFile(res, options.fileName, directory, options.fileName)
              .then(function (success) {
                $rootScope.$emit('PicChange2', {data : options.fileName});
                // alert(success);
                // alert("Copy: "+JSON.stringify(success));
                // alert("File Path: "+fileURI);              
              }, function (error) {
                  // alert("Copy error: "+JSON.stringify(error));
                // error
              });
          };
          function onFail(message) {
            var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Failed because: ' +JSON.stringify(message),
                        cssClass: 'Error'
                    });
            // alert('Failed because: ' +JSON.stringify(message));
          };

        var item_data = {};
        multiPrice.updatePrices = function(){
          // item_data = {app_key: $rootScope.AppKey, item_id: multiPrice.itemInfo.item_id, multiple_sizeprice: multiPrice.multiItem};
          // console.log(item_data);
          // return;

          if(multiPrice.picType === undefined){
            // console.log(singlePrice.picType);
            multiPrice.picType = undefined;
            console.log("FALSE");
          }
          else{
            console.log(multiPrice.picType);            
            console.log("TRUE");
          }
          // return;
          if(multiPrice.Pic != undefined && multiPrice.Pic != ''){
            // alert('pic '+multiPrice.Pic);
            // Destination URL
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            var url = baseurl+"update_item/";
             // alert(url);
             var directory;
             
             if (cordova.file.documentsDirectory) {
               directory = cordova.file.documentsDirectory; // for iOS
             } else {
               directory = cordova.file.externalRootDirectory+"eposhybrid/Pics/"; // for Android
             }
          
            var targetPath;
             //File for Upload
             if(ionic.Platform.isAndroid()){
                targetPath = directory+multiPrice.picName;
             }
             else{
                targetPath = directory+multiPrice.picName;
             }
             
             // alert(targetPath);
             // File name only
             var filename = targetPath.split("/").pop();
             // alert(filename);
          
            //  var timeSpent = "0:"+record.timer;
            // $ionicLoading.show({template : 'Updating Profile...'});
            // alert(JSON.stringify(multiPrice.picType));
            
             var options = {
                  // fileUpload: true,
                  fileKey: "file",
                  fileName: filename,
                  httpMethod: "POST",
                 //  mimeType: "audio/vnd.wav",
                  mimeType: "image/jpeg",
                  params : {
                              'app_key': $rootScope.AppKey,
                              'item_id': multiPrice.itemInfo.item_id,
                              'multiple_sizeprice': multiPrice.multiItem,
                              'pic_type': multiPrice.picType,
                              // 'address': profile.address,
                              // 'country': profile.nationality,
                              // 'phone':profile.dialCode +" "+profile.phone,
                              // 'sex': profile.sex,
                              // 'pic': filename,
                              'file': filename
                           }, // directory represents remote directory,  fileName represents final remote file name
                  chunkedMode: false
              };
              // alert(JSON.stringify(options));
              // console.log(JSON.stringify(options));
              // return;
              $cordovaFileTransfer.upload(url, targetPath, options, true).then(function (res) {
                // alert("Success: "+JSON.stringify(res));
                   $ionicLoading.hide();
                   var alertPopup = $ionicPopup.alert({
                       title: 'Success',
                       template: 'Updated Successfully',
                       cssClass: 'Success'
                   });
                   alertPopup.then(function(res) {
                     ItemsMultiPriceService.hideModal();
                     $rootScope.$emit("SinglePriceData");
                   });
                }, function (err) {
                    // alert("Error "+JSON.stringify(err));
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Unable to update, something went wrong...',
                        cssClass: 'Error'
                    });
                    alertPopup.then(function(res) {
                      ItemsMultiPriceService.hideModal();
                      // $rootScope.$emit("SinglePriceData");
                    });
                    // recordingModalService.hideModal();
                }, function (progress) {
                  // alert("Progress "+JSON.stringify(progress));
                    // PROGRESS HANDLING GOES HERE
                });
          }
          else{
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          var item_data = {app_key: $rootScope.AppKey, item_id: multiPrice.itemInfo.item_id, multiple_sizeprice: multiPrice.multiItem}; 
          console.log(item_data);
              ItemsService.updateMultiplePrice(item_data).then(function(data, status, headers, config){
                // console.log(res);
                if(data.status){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                      title: 'Success!',
                      template: 'Successfully Updated!',
                      cssClass: 'Success'
                  });
                  alertPopup.then(function(res) {
                      ItemsMultiPriceService.hideModal();
                      $rootScope.$emit("SinglePriceData");
                  });
                }
                else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                           title: 'Error!',
                           template: 'Unable to Update!',
                           cssClass: 'Error'
                  });
                  alertPopup.then(function(res) {
                      ItemsMultiPriceService.hideModal();
                  });
                }            
              }, function(error){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                           title: 'Error!',
                           template: 'Unable to Update!',
                           cssClass: 'Error'
                  });
                  alertPopup.then(function(res) {
                      ItemsMultiPriceService.hideModal();
                  });
              })
          }   

        };

        multiPrice.closeModal = function(){
          ItemsMultiPriceService.hideModal();
        };
      };


      function PromotionCtrl($scope, $rootScope, userService, $ionicPopup, PromotionService, PromotionEditService, $ionicLoading){
        var vmPromotion = this;

        vmPromotion.listlength = 10;

        vmPromotion.doRefreshData = function() {
           getPromotions();
           $scope.$broadcast('scroll.refreshComplete');
        };

        vmPromotion.changePricing = function(item){
            // console.log(item);
            userService.setData(item);
            PromotionEditService.showModal();
        };

        var item_data = {};
        vmPromotion.statusChange = function(item){
          var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure want to change the status?',
            cancelText: 'Cancel',
            okText: 'OK',
            cancelType: 'button-assertive',
            okType: 'button-balanced',
            cssClass: 'QUIT'
          });

          confirmPopup.then(function(res) {
            if(res){
              $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
              item_data = {app_key: $rootScope.AppKey, promotion_id: item.promotion_id, status: item.status};
              PromotionService.updateStatus(item_data).then(function(data, status, headers, config){
                if(data.status){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                           title: 'Success!',
                           template: 'Successfully Updated!',
                           cssClass: 'Success'
                  });
                  alertPopup.then(function(res) {
                      getPromotions();
                  });
                }
                else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  });
                  alertPopup.then(function(res) {
                      getPromotions();
                  });
                }
              }, function(error){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  });
                  alertPopup.then(function(res) {
                      getPromotions();
                  });
              })
            }
            else{
              getPromotions();
            }
          })

        };

        var code = "";
        for(var i=0; i<currency_symbols.length; i++){
          if(currency_symbols[i].name === $rootScope.Curency){
            code = currency_symbols[i].code;
          }
          else{
            code = currency_symbols[0].code;
          }
        };
        

        $rootScope.$on("UpdatePromData", function() {
          getPromotions();
        });

        function getPromotions(){
          // $ionicLoading.show({template : 'Loading...'});
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          vmPromotion.totalItems = [];
          var promise = PromotionService.getPromotions();
          promise.then(function(data, status, headers, config) {
            var response = data.data.data;
            
            if(data.data.status){
              $ionicLoading.hide();
              vmPromotion.totalPromotions = response.promotion_list;      
              for(var i=0; i<vmPromotion.totalPromotions.length; i++){
                if(vmPromotion.totalPromotions[i].discount_type === 1){
                  vmPromotion.totalPromotions[i].percent = "";
                  vmPromotion.totalPromotions[i].symbol = code;
                  vmPromotion.totalPromotions[i].amount_type = true;
                }
                else if(vmPromotion.totalPromotions[i].discount_type === 2){
                  vmPromotion.totalPromotions[i].percent = "%";
                  vmPromotion.totalPromotions[i].percent_type = true;

                  // vmPromotion.totalPromotions[i].symbol = "";
                }else{
                  vmPromotion.totalPromotions[i].symbol = code;
                  // vmPromotion.totalPromotions[i].amount = "";
                  vmPromotion.totalPromotions[i].amount_type = true;
                  vmPromotion.totalPromotions[i].percent = "";
                }
                if(vmPromotion.totalPromotions[i].promotion_category === null){
                  vmPromotion.totalPromotions[i].promotion_category = "---";
                }
              }

              for (var i=0; i<vmPromotion.totalPromotions.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmPromotion.totalPromotions[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmPromotion.totalPromotions[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmPromotion.totalPromotions[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }
            }
            else{
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
            }
            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               $rootScope.$emit('no-data');
          });
        }
        getPromotions();

        vmPromotion.loadMore = function(){
          if (!vmPromotion.totalItems){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              return;
          }
          if (vmPromotion.listlength < vmPromotion.totalItems.length){
            vmPromotion.listlength+=10;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };

        vmPromotion.clearSearch = function(){
          vmPromotion.searchText = "";
        };

      };

      function PromotionsEditCtrl($rootScope, $ionicLoading, $ionicPopup, userService, PromotionEditService, PromotionService){
        var vmEditProm = this;

        vmEditProm.selectOptions = [{"id":1, "name": "Amount"},{"id":2, "name": "Percent"},{"id":3, "name": "Free"}]

        vmEditProm.promItem ={};

        

        if(userService.getData() != ""){
          vmEditProm.promInfo = userService.getData();
          // console.log(vmEditProm.promInfo);
          if(vmEditProm.promInfo.promotion_type_id == "1" || vmEditProm.promInfo.promotion_type_id == "9"){
            vmEditProm.selectOptions = [{"id":1, "name": "Amount"},{"id":2, "name": "Percent"},{"id":3, "name": "Free"}];
            vmEditProm.promItem.selectDiscount = vmEditProm.promInfo.discount_type;
          }
          else{
            vmEditProm.selectOptions = [{"id":1, "name": "Amount"},{"id":2, "name": "Percent"}]
            vmEditProm.promItem.selectDiscount = vmEditProm.promInfo.discount_type;
          }
          if(vmEditProm.promItem.selectDiscount == 1){
            vmEditProm.promItem.amountVal = vmEditProm.promInfo.discount_amount;
          }
          else if(vmEditProm.promItem.selectDiscount == 2){
            vmEditProm.promItem.percentVal = vmEditProm.promInfo.discount_amount;
          }
          userService.setData(null);
        }

        var prom_data = {};

        vmEditProm.updatePrices = function(){
            // console.log(vmEditProm.promItem);
            $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
            if(vmEditProm.promItem.selectDiscount == 1){
              prom_data = {app_key: $rootScope.AppKey, promotion_id:vmEditProm.promInfo.promotion_id, discount_type: vmEditProm.promItem.selectDiscount, discount_amount: vmEditProm.promItem.amountVal};
            }
            else if(vmEditProm.promItem.selectDiscount == 2){
              prom_data = {app_key: $rootScope.AppKey, promotion_id:vmEditProm.promInfo.promotion_id, discount_type: vmEditProm.promItem.selectDiscount, discount_amount: vmEditProm.promItem.percentVal};
            }
            else{
              prom_data = {app_key: $rootScope.AppKey, promotion_id:vmEditProm.promInfo.promotion_id, discount_type: vmEditProm.promItem.selectDiscount, discount_amount: 0};
            }
            // console.log(prom_data);
            PromotionService.updatePromotionPrice(prom_data).then(function(data, status, headers, config){                      
              if(data.status){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                         title: 'Success!',
                         template: 'Successfully Updated!',
                         cssClass: 'Success'
                });
                alertPopup.then(function(res) {
                    PromotionEditService.hideModal();
                    $rootScope.$emit("UpdatePromData");
                });
              }
              else{
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                    PromotionEditService.hideModal();                    
                });
              }
            }, function(error){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                    PromotionEditService.hideModal();
                });
            })
        };

        vmEditProm.closeModal = function(){
          PromotionEditService.hideModal();
        };


      };

      function StaffManagementCtrl($scope, $state, $ionicLoading, StaffService){
        var vmStaffManagement = this;

        vmStaffManagement.loadTodayStaff = function(){
          $state.go('app.staff-management.todayStaff', {}, {reload: true});
        };
        vmStaffManagement.loadAllStaff = function(){
          $state.go('app.staff-management.allStaff', {}, {reload: true});
        };

      };

      function todayStaffCtrl($scope, $rootScope, $ionicLoading, StaffService) {
        var todayS = this;

        todayS.listlength = 20;

        $rootScope.$on('TodayRotaData', function() {
            getTodaysList();
        });



        todayS.doRefreshData = function() {
           getTodaysList();
           $scope.$broadcast('scroll.refreshComplete');
        };
        
        todayS.staff_cloak = false;

        function getTodaysList(){
          // $ionicLoading.show({template : 'Loading...'});
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          todayS.todayStaffList = [];
          var promise = StaffService.getTodayStaff();
          promise.then(function(data, status, headers, config) {
            
            var response = data.data.data;
            if(data.data.status){
              $ionicLoading.hide();
              todayS.todayStaffList = response.today_staff;
              // console.log(todayS.todayStaffList);            
              if(todayS.todayStaffList.length >0){
                for(var i=0; i<todayS.todayStaffList.length; i++){
                  if(todayS.todayStaffList[i].clockin_time != null){
                        todayS.staff_cloak = true;
                  }
                }
                todayS.todayDate = todayS.todayStaffList[0].today_date;

                for (var i=0; i<todayS.todayStaffList.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    todayS.todayStaffList[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      todayS.todayStaffList[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      todayS.todayStaffList[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                } 
              }
            }
            else{
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
            }
            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               $rootScope.$emit('no-data');
          });
        };
        getTodaysList();
      };

      function allStaffCtrl($scope, $state, $rootScope, $ionicLoading, StaffService, $ionicPopup, StaffStatusService, userService, StaffAppsService,
                  viewRotaModalService, addRotaModalService) {
        var allS = this;

        allS.listlength = 10;

        allS.doRefreshData = function() {
           getAllStaff();
           $scope.$broadcast('scroll.refreshComplete');
        };

        $rootScope.$on("LatestStaffData", function() {
          getAllStaff();
        });

        var item_data = {};
        allS.statusChange = function(item){
            var confirmPopup = $ionicPopup.confirm({
              title: 'Confirm',
              template: 'Are you sure want to change the status?',
              cancelText: 'Cancel',
              okText: 'OK',
              cancelType: 'button-assertive',
              okType: 'button-balanced',
              cssClass: 'QUIT'
            });

            confirmPopup.then(function(res) {
              if(res){
                userService.setData(item);
                StaffStatusService.showModal();
              }
              else{
                getAllStaff();
              }
            });
        };

        allS.getAppPerm = function(item) {
          userService.setData(item);
          StaffAppsService.showModal();
        };

        function changeFormat(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
          };
          var today = changeFormat();

        allS.viewRota = function(item) {
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          StaffService.getRotaData(item.staff_id).then(function(data, status, headers, config){
            if(data.status){
              $ionicLoading.hide();
              console.log(item);
              userService.setData(item);
              viewRotaModalService.showModal();
            }
            else if(!data.status && data.msg_code == 1){
              $ionicLoading.hide();
              var addRotaData = {
                staff_id : item.staff_id,
                date : today,
                name : item.first_name,
                status: false
              };
              console.log(addRotaData);
              userService.setData(addRotaData);
              addRotaModalService.showModal();
            }
            else{
                $ionicLoading.hide();
                window.plugins.toast.showWithOptions({
                      message: 'Unable to fetch data. Please try again later.',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          }, function(data, status, headers, config){
              $ionicLoading.hide();
              window.plugins.toast.showWithOptions({
                      message: 'Unable to fetch data. Please try again later.',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          })

        };

        function getAllStaff(){
          // $ionicLoading.show({template : 'Loading...'});
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          allS.allStaffList = [];
          var promise = StaffService.getAllStaff();
          promise.then(function(data, status, headers, config) {
            
            var response = data.data.data;
            if(data.data.status){
              $ionicLoading.hide();
              allS.allStaffList = response.staff_list;

              for (var i=0; i<allS.allStaffList.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    allS.allStaffList[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      allS.allStaffList[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      allS.allStaffList[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }
            }
            else{
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
            }
            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               $rootScope.$emit('no-data');
          });
        }
        getAllStaff();

        allS.loadMore = function(){
          if (!allS.allStaffList){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              return;
          }
          if (allS.listlength < allS.allStaffList.length){
            allS.listlength+=10;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };

      };

      function viewRotaCtrl(StaffService, $rootScope, userService, viewRotaModalService, addRotaModalService, $ionicLoading, $ionicPopup){
        var viewR = this;        

        if(userService.getData() != ""){
          viewR.staffInfo = userService.getData();
          // console.log(viewR.staffInfo);
          viewR.staffInfo.statusFlag = true;
          viewR.first_name = viewR.staffInfo.first_name;
          viewR.last_name = viewR.staffInfo.last_name;
          userService.setData(null);
        }       

        viewR.activeTab = 1;
        viewR.thisWeek = true;
        viewR.nextWeek = false; 

        viewR.setActiveTab = function(tabToSet) {
              // alert(tabToSet);
            if (tabToSet == 1){
              viewR.activeTab = tabToSet;
              viewR.thisWeek = true;
              viewR.nextWeek = false;
              getThisWeekData();
            } 
            else{
              viewR.activeTab = tabToSet;            
              viewR.thisWeek = false;
              viewR.nextWeek = true;
              getNextWeekData();
            } 
        };

        function getThisWeekData(){
          viewR.thisWeekRotaData = [];
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          StaffService.getRotaData(viewR.staffInfo.staff_id).then(function(data, status, headers, config){
              if(data.status){
                viewR.thisWeekRotaData = data.data.staff_rota;
                $ionicLoading.hide();

                for (var p=0; p<viewR.thisWeekRotaData.length; p++){
                  for (var i=0; i<viewR.thisWeekRotaData[p].rota.length; i++){
                    var j,k;
                      if(i<$rootScope.colors.length){
                        viewR.thisWeekRotaData[p].rota[i].border_color = $rootScope.colors[i];
                      }                  
                      else{
                        if(i == $rootScope.colors.length){
                          j=0;
                          viewR.thisWeekRotaData[p].rota[i].border_color = $rootScope.colors[j];
                          j++;                      
                        }
                        else{                      
                          viewR.thisWeekRotaData[p].rota[i].border_color = $rootScope.colors[j];
                          j++;
                          if(j == $rootScope.colors.length) j=0;
                        }
                      }
                    }
                  
                }
                
              }
              else if(!data.status && data.msg_code == 1){
                $ionicLoading.hide();
                // var alertPopup = $ionicPopup.alert({
                //            title: 'Success!',
                //            template: 'Rota not allocated',
                //            cssClass: 'Error'
                //   });
                //   alertPopup.then(function(res) {
                //     // viewRotaModalService.hideModal();
                //   });                                     
              }
              else{
                $ionicLoading.hide();
                viewRotaModalService.hideModal();
                window.plugins.toast.showWithOptions({
                      message: 'Unable to fetch data. Please try again later.',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              
          }, function(data, status, headers, config){
              $ionicLoading.hide();
              viewRotaModalService.hideModal();
              window.plugins.toast.showWithOptions({
                    message: 'Unable to fetch data. Please try again later.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          })
        };
        getThisWeekData();

        $rootScope.$on('LatestRotaData', function() {
          if(viewR.thisWeek == true  && viewR.nextWeek == false){
            getThisWeekData();
          }
          else if(viewR.thisWeek == false && viewR.nextWeek == true){
            getNextWeekData();
          }                    
        });

        function getNextWeekData(){
          viewR.nextWeekRotaData = [];
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          StaffService.getNextRotaData(viewR.staffInfo.staff_id).then(function(data, status, headers, config){
              if(data.status){
                viewR.nextWeekRotaData = data.data.staff_rota;
                $ionicLoading.hide();

                for (var p=0; p<viewR.nextWeekRotaData.length; p++){
                  for (var i=0; i<viewR.nextWeekRotaData[p].rota.length; i++){
                    var j,k;
                      if(i<$rootScope.colors.length){
                        viewR.nextWeekRotaData[p].rota[i].border_color = $rootScope.colors[i];
                      }                  
                      else{
                        if(i == $rootScope.colors.length){
                          j=0;
                          viewR.nextWeekRotaData[p].rota[i].border_color = $rootScope.colors[j];
                          j++;                      
                        }
                        else{                      
                          viewR.nextWeekRotaData[p].rota[i].border_color = $rootScope.colors[j];
                          j++;
                          if(j == $rootScope.colors.length) j=0;
                        }
                      }
                    }
                  
                }
                
              }
              else if(!data.status && data.msg_code == 1){
                $ionicLoading.hide();
                // var alertPopup = $ionicPopup.alert({
                //            title: 'Success!',
                //            template: 'Rota not allocated',
                //            cssClass: 'Error'
                //   });
                //   alertPopup.then(function(res) {
                //     // viewRotaModalService.hideModal();
                //   });                              
              }
              else{
                $ionicLoading.hide();
                viewRotaModalService.hideModal();
                window.plugins.toast.showWithOptions({
                      message: 'Unable to fetch data. Please try again later.',
                      duration: 'long',
                      position: 'center',
                      styling: {
                        borderRadius: 30, // a bit less than default, 0 means a square Toast
                        backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              
          }, function(data, status, headers, config){
              $ionicLoading.hide();
              viewRotaModalService.hideModal();
              window.plugins.toast.showWithOptions({
                    message: 'Unable to fetch data. Please try again later.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          })
        };

        viewR.AddRota = function(date, name){
          var addRotaData = {
            staff_id : viewR.staffInfo.staff_id,
            date : date,
            name : name,
            status : viewR.staffInfo.status
          }
          // console.log(date);
          // console.log(name);
          // console.log(addRotaData);
          userService.setData(addRotaData);
          addRotaModalService.showModal();
        };

        viewR.DeleteRota = function(rota_id){
          // console.log(rota_id);
          var alertPopup = $ionicPopup.confirm({
                   title: 'Alert!',
                   template: 'Are you sure want to delete this Rota?',
                   cancelText: 'Cancel',
                   okText: 'OK',
                   cancelType: 'button-assertive',
                   okType: 'button-balanced',
                   cssClass: 'QUIT'
          });
          alertPopup.then(function(res) {
            if(res){
              $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
              StaffService.deleteRota(rota_id).then(function(data, status, headers, config){
                if(data.status){
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                           title: 'Success!',
                           template: 'Rota removed successfully',
                           cssClass: 'Success'
                  });
                  alertPopup.then(function(res) {
                    $rootScope.$emit("LatestRotaData");
                  });
                }else{
                    $ionicLoading.hide();
                    viewRotaModalService.hideModal();
                    window.plugins.toast.showWithOptions({
                       message: 'Unable to remove Rota. Please try again later.',
                       duration: 'long',
                       position: 'center',
                       styling: {
                         borderRadius: 30, // a bit less than default, 0 means a square Toast
                         backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              }, function(data, status, headers, config){
                  $ionicLoading.hide();
                  viewRotaModalService.hideModal();
                  window.plugins.toast.showWithOptions({
                        message: 'Unable to remove Rota. Please try again later.',
                        duration: 'long',
                        position: 'center',
                        styling: {
                          borderRadius: 30, // a bit less than default, 0 means a square Toast
                          backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
              })
            }

          });
        };

        viewR.closeModal = function() {
          viewRotaModalService.hideModal();
        };

      };

      function addRotaCtrl(StaffService, $ionicLoading, userService, $http, $q, ionicDatePicker, LoginService, addRotaModalService, $rootScope, $ionicPopup){
        var addR = this;
        addR.staffInfo = {};

        var totalData = [];
        if(userService.getData() != ""){
          totalData = userService.getData();
          // console.log(totalData);
          addR.staffInfo = userService.getData();
          // console.log(addR.staffInfo);
          userService.setData(null);
        }

        function changeFormat(dt){
            // var today = new Date();
            var dd = dt.getDate();
            var mm = dt.getMonth()+1; //January is 0!
            var yyyy = dt.getFullYear();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
        };

        addR.rotaDatePicker = function() {
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              var start = new Date(val);
              addR.staffInfo.date = changeFormat(start);
              // Startdt = dateFormat($scope.startDt);
              // var from = $scope.startDt.split("/");
              // var f = new Date(from[2], from[1] - 1, from[0]);
              // console.log(Startdt);
            },
            from: new Date(),
            to: new Date(2021, 1, 1),
            inputDate: new Date(),
            mondayFirst: true,
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'popup'
          };
          ionicDatePicker.openDatePicker(ipObj1);
        };

        $rootScope.$on('close_add_rota', function(event, res) {          
           if(event && $rootScope.online){
            addRotaModalService.hideModal();
            window.plugins.toast.showWithOptions({
                  message: 'Unable to fetch data. Please try again later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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

        addR.addRota = function(){
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          var addRotaData = {
                        app_key : $rootScope.AppKey,
                        staff_id : totalData.staff_id,
                        date: totalData.date,
                        pattern_id : addR.addRotaData.shiftPatterns,
                        designation_id : addR.addRotaData.staffDesignations,
                        type_code : addR.addRotaData.shiftTypes
                      };
                      // console.log(JSON.stringify(addRotaData));
            StaffService.addRotaStaff(addRotaData).then(function(data, status, headers, config){
              var alertPopup;
              // console.log(addR.staffInfo.status);
              // console.log(response.msg);
              // console.log(data);

              if(data.status){
                $ionicLoading.hide();
                alertPopup = $ionicPopup.alert({
                         title: 'Success!',
                         template: ''+data.msg+'',
                         cssClass: 'Success'
                });
                alertPopup.then(function(res) {
                  addRotaModalService.hideModal();
                  if(addR.staffInfo.status){
                    $rootScope.$emit("LatestRotaData");
                  }
                  else {
                    $rootScope.$emit("TodayRotaData");
                  }
                });
              }
              else if(!data.status && data.msg_code == 1){
                $ionicLoading.hide();
                alertPopup = $ionicPopup.alert({
                         title: 'Failed',
                         template: ''+data.msg+'',
                         cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                  addRotaModalService.hideModal();
                  if(addR.staffInfo.status){
                    $rootScope.$emit("LatestRotaData");
                  }
                  else {
                    $rootScope.$emit("TodayRotaData");
                  }
                });
            }
          }, function(data, status, headers, config){
              $ionicLoading.hide();
              alertPopup = $ionicPopup.alert({
                         title: 'Error!',
                         template: 'Unable to add rota. Please try later.',
                         cssClass: 'Error'
                });
              alertPopup.then(function(res) {
                  addRotaModalService.hideModal();                  
                  $rootScope.$emit("TodayRotaData");                  
              });
          });

        };

        function getShiftPatterns(){
          StaffService.shiftPatterns().then(function(data, status, headers, config){
              // console.log(data);
              var response = data.data;
              if(data.status){
                addR.shiftPatterns = response.shift_patterns;
                var item = {pattern_id:"1", pattern:"Select Shift"};
                addR.shiftPatterns.splice(0, 0, item);
              }
              else{
                $rootScope.$emit("close_add_rota");
              }
              
              // addR.shiftPatterns.unshift(});
          }, function(data, status, headers, config){
              $rootScope.$emit("close_add_rota");
          });
        };
        getShiftPatterns();

        function getStaffDesignations(){
          StaffService.staffDesignations(addR.staffInfo.staff_id).then(function(data, status, headers, config){
            // console.log(data);
            var response = data.data;
            if(data.status){
              addR.staffDesignations = response.staff_designations;
              var item = {designation_id:"0", designation_name:"Select Position"};
              addR.staffDesignations.splice(0, 0, item);
            }
            else{
              $rootScope.$emit("close_add_rota");
            }
            
          }, function(data, status, headers, config){
              $rootScope.$emit("close_add_rota");
          });
        };
        getStaffDesignations();

        function getShiftTypes(){
          StaffService.shiftTypes().then(function(data, status, headers, config){
            // console.log(data);
            var response = data.data;
            if(data.status){
              addR.shiftTypes = response.shift_types;
              for (var i = 0; i < addR.shiftTypes.length; i++) {
                addR.shiftTypes[i].type = addR.shiftTypes[i].type_name+" ("+addR.shiftTypes[i].type_code+")";
                // console.log(addR.shiftTypes[i].type);
              };
              var item = {type_id:"1", type_code:"0", type:"Select Shift Type"};
              addR.shiftTypes.splice(0, 0, item);
            }
            else{
              $rootScope.$emit("close_add_rota");
            }
            
          }, function(data, status, headers, config) {
              $rootScope.$emit("close_add_rota");
          });
        };
        getShiftTypes();


        addR.closeModal = function(){
          addRotaModalService.hideModal();
        };
      };


      function staffAppsEditCtrl(StaffService, $ionicLoading, StaffAppsService, $rootScope, userService, $ionicPopup){
        var vmStaffApps = this;

        vmStaffApps.staffInfo = {};

        if(userService.getData() != ""){
          vmStaffApps.staffInfo = userService.getData();
          userService.setData(null);
        }

        function getAppsList(){
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          StaffService.getAppsList(vmStaffApps.staffInfo.staff_id).then(function(data, status, headers, config){
            console.log(data);
            var response = data.data;
            if(data.status){

              vmStaffApps.appsList = response.staff_permissions;
              $ionicLoading.hide();

              for (var i=0; i<vmStaffApps.appsList.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmStaffApps.appsList[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmStaffApps.appsList[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmStaffApps.appsList[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                } 
            }
            else{
              $ionicLoading.hide();
              StaffAppsService.hideModal();
                window.plugins.toast.showWithOptions({
                    message: 'Unable to fetch data. Please try again later.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               StaffAppsService.hideModal();
               window.plugins.toast.showWithOptions({
                    message: 'Unable to fetch data. Please try again later.',
                    duration: 'long',
                    position: 'center',
                    styling: {
                      borderRadius: 30, // a bit less than default, 0 means a square Toast
                      backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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
          });
        };
        getAppsList();

        var permission_data = {};
        vmStaffApps.updateAppStatus = function(list){
          // console.log(vmStaffApps.appsList);
          var objList = {};
          for(var i=0; i<list.length; i++){
            // var obj = {};
            var id = list[i].id;
            objList[id] = list[i].status;
            // objList.push(obj);
            // return objList;
          }
          // console.log(objList);
          permission_data  = {app_key: $rootScope.AppKey, staff_id: vmStaffApps.staffInfo.staff_id, permissions: objList, customer_id: $rootScope.CustId};
          // console.log(JSON.stringify(permission_data));
          StaffService.updateAppPermissions(permission_data).then(function(data, status, headers, config){
            // console.log(res);
            if(data.status){
              var alertPopup = $ionicPopup.alert({
                       title: 'Success!',
                       template: 'Successfully Updated!',
                       cssClass: 'Success'
              });
              alertPopup.then(function(res) {
                  StaffAppsService.hideModal();
                  $rootScope.$emit("LatestStaffData");
              });
            }else{
              var alertPopup = $ionicPopup.alert({
                       title: 'Alert',
                       template: 'App Permissions not updated. Please try later.',
                       cssClass: 'Error'
              });
              alertPopup.then(function(res) {
                  StaffAppsService.hideModal();
                  $rootScope.$emit("LatestStaffData");
              });
            }
          }, function(error){
              var alertPopup = $ionicPopup.alert({
                       title: 'Alert',
                       template: 'App Permissions not updated. Please try later.',
                       cssClass: 'Error'
              });
              alertPopup.then(function(res) {
                  StaffAppsService.hideModal();
                  $rootScope.$emit("LatestStaffData");
              });
          })

        };

        vmStaffApps.closeModal = function(){
          StaffAppsService.hideModal();
        };
      };

      function staffStatusEditCtrl(StaffService, StaffStatusService, $rootScope, userService, $ionicPopup){
        var vmStaffStatus = this;
        vmStaffStatus.staffInfo = {};

        if(userService.getData() != ""){
          vmStaffStatus.staffInfo = userService.getData();
          userService.setData(null);
        }

        $rootScope.$on('close_status_rota', function(event, res) {          
           if(event && $rootScope.online){
            StaffStatusService.hideModal();
            $rootScope.$emit("LatestStaffData");
            window.plugins.toast.showWithOptions({
                  message: 'Unable to fetch data. Please try again later.',
                  duration: 'long',
                  position: 'center',
                  styling: {
                    borderRadius: 30, // a bit less than default, 0 means a square Toast
                    backgroundColor: '#CCCCCC', // make sure you use #RRGGBB. Default #333333
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

        function Reasons(){
          vmStaffStatus.selectOptions = [];
          StaffService.statusReasons().then(function(data, status, headers, config){
              var response = data.data;
              if(data.status){
                vmStaffStatus.selectOptions = response.staff_status_list;
              }
              else{
                $rootScope.$emit("close_status_rota");
              }
              
          }, function(data, status, headers, config) {
               $rootScope.$emit("close_status_rota");
          });
        };
        Reasons();

        var staffStatus_data = {}
        vmStaffStatus.updateStatus = function(reason){
          staffStatus_data = {app_key: $rootScope.AppKey, staff_id:vmStaffStatus.staffInfo.staff_id, status: reason};

          StaffService.updateStatus(staffStatus_data).then(function(data, status, headers, config){
            console.log(data);
            var alertPopup;
            // return;
            // StaffStatusService.hideModal();
            if(data.status === true){
              alertPopup = $ionicPopup.alert({
                       title: 'Success!',
                       template: ''+data.msg+'',
                       cssClass: 'Success'
              });     
              alertPopup.then(function(res) {
                  StaffStatusService.hideModal();
                  $rootScope.$emit("LatestStaffData");
              });         
            }else{
              alertPopup = $ionicPopup.alert({
                       title: 'Alert!',
                       template: 'Status not Updated!',
                       cssClass: 'Error'
              });              
            }
            alertPopup.then(function(res) {
                StaffStatusService.hideModal();
                $rootScope.$emit("LatestStaffData");
            });
          }, function(error){
              var alertPopup = $ionicPopup.alert({
                       title: 'Alert!',
                       template: 'Status not Updated!',
                       cssClass: 'Error'
              });
              alertPopup.then(function(res) {
                StaffStatusService.hideModal();
                $rootScope.$emit("LatestStaffData");
              });
          })

        };

        vmStaffStatus.closeModal = function(){
          StaffStatusService.hideModal();
          $rootScope.$emit("LatestStaffData");
        };
      };

      function TableManagementCtrl($state){
        var vmTableManagement = this;

        vmTableManagement.loadOccTables = function(){
          $state.go('app.table-management.occTables', {}, {reload: true});
        };
        vmTableManagement.loadBookedTables = function(){
          $state.go('app.table-management.bookedTables', {}, {reload: true});
        };

      };

      function bookedTablesCtrl($scope, TablesService, ionicDatePicker, $rootScope, $ionicLoading){
        var vmBooked = this;

        vmBooked.doRefreshData = function() {
           getBookedTablesData();
           $scope.$broadcast('scroll.refreshComplete');
        };

        function getBookedTablesData(){
          vmBooked.BookedTables = [];
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          TablesService.getBookedTablesData().then(function(data, status, headers, config){
            var response = data.data.data;
            if(data.data.status){
              $ionicLoading.hide();
            vmBooked.BookedTables = response.current_bookings;  

            for (var i=0; i<vmBooked.BookedTables.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmBooked.BookedTables[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmBooked.BookedTables[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmBooked.BookedTables[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }   

            }
            else{
              $ionicLoading.hide();
              vmBooked.BookedTables = [];
            }
          }, function(data, status, headers, config){
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
          });
        };
        getBookedTablesData();

        function changeFormat(dt){
            // var today = new Date();
            var dd = dt.getDate();
            var mm = dt.getMonth()+1; //January is 0!
            var yyyy = dt.getFullYear();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            var today = dd+'/'+mm+'/'+yyyy;
            return today;
          };

        vmBooked.getDate = function() {
          var ipObj1 = {
            callback: function (val) {  //Mandatory
              var start = new Date(val);
              vmBooked.searchText = changeFormat(start);
              // Startdt = dateFormat($scope.startDt);
              // var from = $scope.startDt.split("/");
              // var f = new Date(from[2], from[1] - 1, from[0]);
              // console.log(Startdt);
            },
            from: new Date(),
            to: new Date(2019, 1, 1),
            inputDate: new Date(),
            mondayFirst: true,
            disableWeekdays: [],
            closeOnSelect: false,
            templateType: 'popup'
          };
          ionicDatePicker.openDatePicker(ipObj1);
        };

        vmBooked.clearSearch = function(){
          vmBooked.searchText = "";
        };
      };
      function occupiedTablesCtrl($scope, TablesService, $rootScope, $ionicLoading){
        var vmOccupied = this;

        vmOccupied.doRefreshData = function() {
           getOccTablesData();
           $scope.$broadcast('scroll.refreshComplete');
        };

        function getOccTablesData(){
          vmOccupied.OccupiedTables = [];
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          TablesService.getOccTablesData().then(function(data, status, headers, config){
            var response = data.data.data;
            if(data.data.status){
              $ionicLoading.hide();
              vmOccupied.OccupiedTables = response.current_occupy;

              for (var i=0; i<vmOccupied.OccupiedTables.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmOccupied.OccupiedTables[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmOccupied.OccupiedTables[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmOccupied.OccupiedTables[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }
            }
            else{
              $ionicLoading.hide();
              vmOccupied.OccupiedTables = [];
            }
            
          }, function(data, status, headers, config){
              $rootScope.$emit('no-data');
          });
        };
        getOccTablesData();
      };

      function AppManagementCtrl($scope, $ionicPopup, $rootScope, AppManagementService, $ionicLoading, updateAppCodeModalService, userService){
        var vmAppManagement = this;

        vmAppManagement.listlength = 10;

        $rootScope.$on("AppCodeUpdate", function() {
          getAllDevices();
        })

        vmAppManagement.doRefreshData = function(){
          getAllDevices();
          $scope.$broadcast('scroll.refreshComplete');
        };

        function getAllDevices(){
          // $ionicLoading.show({template : 'Loading...'});
          $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
          vmAppManagement.totalAppItems = [];
          var promise = AppManagementService.getAppDevices();
          // return;
          promise.then(function(data, status, headers, config) {
            console.log(data);
            var response = data.data;
                        
            // return;
            if(data.status){
              $ionicLoading.hide();
              vmAppManagement.totalAppItems = response.device_codes;
              if(vmAppManagement.totalAppItems.length > 0) {
                for(var i=0; i < vmAppManagement.totalAppItems.length; i++){
                  if(vmAppManagement.totalAppItems[i].device_status == "1"){
                    vmAppManagement.totalAppItems[i].status = true;
                  }else{
                    vmAppManagement.totalAppItems[i].status = false;
                  }
                  if(vmAppManagement.totalAppItems[i].availability == "1"){
                    vmAppManagement.totalAppItems[i].usedStatus = true;
                  }else{
                    vmAppManagement.totalAppItems[i].usedStatus = false;
                  }
                }

                for (var i=0; i<vmAppManagement.totalAppItems.length; i++){
                var j,k;
                  if(i<$rootScope.colors.length){
                    vmAppManagement.totalAppItems[i].border_color = $rootScope.colors[i];
                  }                  
                  else{
                    if(i == $rootScope.colors.length){
                      j=0;
                      vmAppManagement.totalAppItems[i].border_color = $rootScope.colors[j];
                      j++;                      
                    }
                    else{                      
                      vmAppManagement.totalAppItems[i].border_color = $rootScope.colors[j];
                      j++;
                      if(j == $rootScope.colors.length) j=0;
                    }
                  }
                }
              }             
            }
            else{
              $ionicLoading.hide();
              $rootScope.$emit('no-data');
            }            
          }, function(data, status, headers, config) {
               $ionicLoading.hide();
               $rootScope.$emit('no-data');
          });
        }
        getAllDevices();

        vmAppManagement.changeAppCode = function(item){
          // console.log(item);
          userService.setData(item);
          updateAppCodeModalService.showModal();
        };

        vmAppManagement.statusChange = function(item){
          console.log(item);
          var confirmPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure want to change the status?',
            cancelText: 'Cancel',
            cancelType: 'button-assertive',
            okText: 'OK',
            okType: 'button-balanced',
            cssClass: 'QUIT'
          });

          confirmPopup.then(function(res) {
            if(res){
              $ionicLoading.show({template: '<ion-spinner icon="ios"></ion-spinner>'});
              AppManagementService.updateAppStatus(item).then(function(data, status, headers, config){       
              var alertPopup;         
                if(data.status){
                  $ionicLoading.hide();
                  alertPopup = $ionicPopup.alert({
                           title: 'Success!',
                           template: 'Successfully Updated!',
                           cssClass: 'Success'
                  });
                  alertPopup.then(function(res) {
                      getAllDevices();
                  });
                }
                else{
                  $ionicLoading.hide();
                  alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  }); 
                  alertPopup.then(function(res) {
                      getAllDevices();
                  });                
                }
              }, function(error){
                  $ionicLoading.hide();
                  alertPopup = $ionicPopup.alert({
                       title: 'Error!',
                       template: 'Unable to Update!',
                       cssClass: 'Error'
                  }); 
                  alertPopup.then(function(res) {
                      getAllDevices();
                  });                 
              })
            }
            else{
              getAllDevices();
            }

          });
        };

        vmAppManagement.loadMore = function(){
          if (!vmAppManagement.totalAppItems){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              return;
          }
          if (vmAppManagement.listlength < vmAppManagement.totalAppItems.length){
            vmAppManagement.listlength+=10;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };
      };

      function updateAppCodeCtrl($scope, $http, $rootScope, AppManagementService, updateAppCodeModalService, userService, $ionicPopup){
          var appCode = this;

          appCode.codeValue = {};
          appCode.codeInfo = {};
          if(userService.getData() != "") {
            appCode.codeInfo = userService.getData();
            appCode.codeValue.Code = parseInt(appCode.codeInfo.device_code);
            userService.setData(null);
          }


          appCode.updateAppCode = function(){
            AppManagementService.updateAppCode(appCode.codeInfo.code_id, appCode.codeValue.Code).then(function(response) {
              console.log(response);
              // return;
              var alertPopup;
              // console.log(response.msg);
              if(response.status){
                alertPopup = $ionicPopup.alert({
                         title: 'Success!',
                         template: ''+response.msg+'',
                         cssClass: 'Success'
                });
                alertPopup.then(function(res) {
                  updateAppCodeModalService.hideModal();
                  $rootScope.$emit("AppCodeUpdate");
                });
              }
              else{
                alertPopup = $ionicPopup.alert({
                         title: 'Failed',
                         template: ''+response.msg+'',
                         cssClass: 'Error'
                });
                alertPopup.then(function(res) {
                  updateAppCodeModalService.hideModal();
                  $rootScope.$emit("AppCodeUpdate");
                });
              }
            }, function(data, status, headers, config) {
                 $log.error('failure loading movie');
            });

          };

          appCode.closeModal = function(){
            updateAppCodeModalService.hideModal();
          };
      };


})();
