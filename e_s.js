(function() {
    'use strict';

    angular
      .module('starter.Services', [])
      .constant('AUTH_EVENTS', AUTH_EVENTS)
      .service('LoginService', LoginService)
      .service('dashboardService', dashboardService)
      .factory('AuthInterceptor', AuthInterceptor)
      .factory('userService', userService)
      .service('DigitalCodeService', DigitalCodeService)
      .service('SecurityCodeService', SecurityCodeService)
      .service('ChangeCodeService', ChangeCodeService)

      .service('ItemsService', ItemsService)
      .service('ItemsSinglePriceService', ItemsSinglePriceService)
      .service('ItemsMultiPriceService', ItemsMultiPriceService)

      .service('PromotionService', PromotionService)
      .service('PromotionEditService', PromotionEditService)

      .service('TablesService', TablesService)

      .service('StaffService', StaffService)

      .service('StaffStatusService', StaffStatusService)
      .service('StaffAppsService', StaffAppsService)
      .service('todayRotaModalService', todayRotaModalService)
      .service('viewRotaModalService', viewRotaModalService)
      .service('addRotaModalService', addRotaModalService)
      .service('AppManagementService', AppManagementService)
      .service('updateAppCodeModalService', updateAppCodeModalService)

      .factory('SearchService', SearchService)

      .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
      });

      function AUTH_EVENTS() {
          notAuthenticated: 'auth-not-authenticated'
          notAuthorized: 'auth-not-authorized'
          serverError: 'auth-server-error'
      };

      // var baseurl = "http://192.168.0.254/test-epos/Admininsight/";
      var baseurl = "http://www.eposhybrid.uk/Admininsight/";


      function SearchService($q, $timeout) {
          var searchText = function(searchFilter) {
              var deferred = $q.defer();
              var matches = airlines.filter( function(airline) {
                  if(airline.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 ) return true;
              })
              $timeout( function(){
                 deferred.resolve( matches );
              }, 1000);
              return deferred.promise;
          };
          return {
              searchText : searchText
        }
      };

      function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
          return {
            responseError: function (response) {
              var status = response.status;
              $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized,
                500: AUTH_EVENTS.serverError,
                status: AUTH_EVENTS.someError
              }[response.status], response);
                return $q.reject(response);              
            }
          };
       };
       function userService(){
         var user = {};
         var more = [];
            return {

            getData : function () {
              return user;
            },

            setData : function (message) {
              user = message;
            },

            setMoreData : function(message1, message2){
              if(message1 != null && message2 != null){
                more.push(message1, message2);
              }else{
                more = [];
              }
            },

            getMoreData : function(){
              return more;
            }
          }
       };


        function LoginService($rootScope, $http, $q){
          var LOCAL_TOKEN_KEY = 'yourTokenKey';
          var LOCAL_TOKEN_PASSWORD = 'yourMedia';
          var LOCAL_TOKEN_USERCODE = 'yourCode';
          var LOCAL_TOKEN_CUSTID = "yourID";
          var LOCAL_TOKEN_BUSINESSNAME = "yourType";
          var LOCAL_TOKEN_FNAME = "yourCourse";
          var LOCAL_TOKEN_UNICODE = "Currency";
          var LOCAL_TOKEN_THEME = "Theme";
          var LOCAL_TOKEN_BACK_COLOR = "Background";
          var LOCAL_TOKEN_COLOR = "Color";

          var isAuthenticated = false;
          $rootScope.loginStatus = false;

          var appKey = "";
          var password = "";
          var Code = "";
          var custId = "";
          var businessName = "";
          var fName = "";
          var Package = "";
          var Currency = "";
          var Theme = "";
          var Background = "";
          var Color = "";

          var authToken;

            function loadUserCredentials(){
            		var key = window.localStorage.getItem(LOCAL_TOKEN_KEY);
                var passcode = window.localStorage.getItem(LOCAL_TOKEN_PASSWORD);
                var Code = window.localStorage.getItem(LOCAL_TOKEN_USERCODE);
                var cust_id = window.localStorage.getItem(LOCAL_TOKEN_CUSTID);
                var buss_name = window.localStorage.getItem(LOCAL_TOKEN_BUSINESSNAME);
                var fname = window.localStorage.getItem(LOCAL_TOKEN_FNAME);
                var currency = window.localStorage.getItem(LOCAL_TOKEN_UNICODE);
                var theme = window.localStorage.getItem(LOCAL_TOKEN_THEME);
                var background = window.localStorage.getItem(LOCAL_TOKEN_BACK_COLOR);
                var color = window.localStorage.getItem(LOCAL_TOKEN_COLOR);

            		if(key) {
            		      useCredentials(key, passcode, Code, cust_id, buss_name, fname, currency, theme, background, color);
            		}
          	};
    	      loadUserCredentials();

            function useCredentials(key, passcode, Code, cust_id, buss_name, fname, currency, theme, background, color) {
          	    appKey = key.split('*')[0];
                password = passcode.split('.')[0];
                Code = Code.split('.')[0];
                custId = cust_id.split('.')[0];
                businessName = buss_name.split('.')[0];
                fName = fname.split('.')[0];
                Currency = currency.split('.')[0];
                Theme = theme.split('.')[0];
                Background = background.split('.')[0];
                Color = color.split('.')[0];

          	    isAuthenticated = true;
                authToken = appKey;
                $rootScope.loginStatus = true;

                $rootScope.AppKey = appKey;
                $rootScope.Password = password;
                $rootScope.CODE = Code;
                $rootScope.CustId = custId;
                $rootScope.BusinessName = businessName;
                $rootScope.FirstName = fName;
                $rootScope.Curency = Currency;
                if(Theme === "false"){
                  $rootScope.white_theme = false;
                  $rootScope.graph_backcolor = '#2a343d';
                  $rootScope.graph_color = '#fff';
                }
                else{
                  $rootScope.white_theme = true;
                  $rootScope.graph_backcolor = '#fff';
                  $rootScope.graph_color = '#2a343d';                                    
                }


          	    // Set the token as header for your requests!
          	    $http.defaults.headers.common['X-Auth-Token'] = appKey;
            };
            function storeUserCredentials(key, passcode, Code, cust_id, buss_name, fname, currency) {
                window.localStorage.setItem(LOCAL_TOKEN_KEY, key);
                window.localStorage.setItem(LOCAL_TOKEN_PASSWORD, passcode);
                window.localStorage.setItem(LOCAL_TOKEN_USERCODE, Code);
                window.localStorage.setItem(LOCAL_TOKEN_CUSTID, cust_id);
                window.localStorage.setItem(LOCAL_TOKEN_BUSINESSNAME, buss_name);
                window.localStorage.setItem(LOCAL_TOKEN_FNAME, fname);
                window.localStorage.setItem(LOCAL_TOKEN_UNICODE, currency);
                var theme, background, color;
                if(window.localStorage.getItem(LOCAL_TOKEN_THEME)){                  
                  theme = window.localStorage.getItem(LOCAL_TOKEN_THEME);
                  background = window.localStorage.getItem(LOCAL_TOKEN_BACK_COLOR);
                  color = window.localStorage.getItem(LOCAL_TOKEN_COLOR);                   
                }
                else{
                  theme = 'false';
                  background = '#2a343d';
                  color = '#fff';
                  window.localStorage.setItem(LOCAL_TOKEN_THEME, theme);
                  window.localStorage.setItem(LOCAL_TOKEN_BACK_COLOR, background);
                  window.localStorage.setItem(LOCAL_TOKEN_COLOR, color);
                }                

                // if(type != null && type.split('.')[0] == "1"){
                //   modifyPackage(pack);
                // }
          	    useCredentials(key, passcode, Code, cust_id, buss_name, fname, currency, theme, background, color);
          	};
            function destroyUserCredentials() {
          	    authToken = undefined;
                appKey = "";
          	    isAuthenticated = false;
                $rootScope.loginStatus = false;
                $rootScope.AppKey = undefined;
                $rootScope.Password = undefined;
                $rootScope.CODE = undefined;
                $rootScope.CustId = undefined;
                $rootScope.BusinessName = undefined;
                $rootScope.FirstName = undefined;
                $rootScope.Curency = undefined;
          	    $http.defaults.headers.common['X-Auth-Token'] = undefined;
          	    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
                window.localStorage.removeItem(LOCAL_TOKEN_PASSWORD);
                window.localStorage.removeItem(LOCAL_TOKEN_USERCODE);
                window.localStorage.removeItem(LOCAL_TOKEN_CUSTID);
                window.localStorage.removeItem(LOCAL_TOKEN_BUSINESSNAME);
                window.localStorage.removeItem(LOCAL_TOKEN_FNAME);
                window.localStorage.removeItem(LOCAL_TOKEN_UNICODE);
                // window.localStorage.removeItem(LOCAL_TOKEN_THEME);
          	};

    	    var logoutUser = function() {
        		  destroyUserCredentials();
          };
          
          var updateCodeData = function(code) {
            window.localStorage.setItem(LOCAL_TOKEN_USERCODE, code);
            modifyCode(code);
          };

          function modifyCode(code){
            Code = code.split('.')[0];
            $rootScope.CODE = Code;
          };

          var updateTheme = function(theme) {
            window.localStorage.setItem(LOCAL_TOKEN_THEME, theme);
            modifyTheme(theme);
          };

          function modifyTheme(theme){
            Theme = theme.split('.')[0];
            var background, color;
            if(Theme === "false"){
              background = '#2a343d';
              color = '#fff'; 
              window.localStorage.setItem(LOCAL_TOKEN_BACK_COLOR, background);
              window.localStorage.setItem(LOCAL_TOKEN_COLOR, color);
              $rootScope.white_theme = false;
            }
            else{
              background = '#fff';
              color = '#2a343d';
              window.localStorage.setItem(LOCAL_TOKEN_BACK_COLOR, background);
              window.localStorage.setItem(LOCAL_TOKEN_COLOR, color);
              $rootScope.white_theme = true;                  
            }
            modifyColors(background, color);
          };

          function modifyColors(background, color){
            Background = background.split('.')[0];
            Color = color.split('.')[0];
            $rootScope.graph_backcolor = Background;
            $rootScope.graph_color = Color;
          };

          var loginUser = function(key, passcode) {
            // console.log(CodeStatus);            
              var deferred = $q.defer();
                $http({
                    method: 'GET',
                    params: {
                              'app_key' : key,
                              'password' : passcode,
                              'task' : 'login_authenticate'
                            },
                            url: baseurl
                     }).success(function(data, status, headers, config) {
                       // console.log(data);
                       if(data.details.customer_id){
                          deferred.resolve(data);                                          
                       }
                       else if(data.details.message === false){
                          deferred.reject();
                       }
                       else{
                         deferred.reject();
                       }

                  }, function(data, status, headers, config){
                       deferred.reject();
                  });
              return deferred.promise;
            };

            var updateCode = function(key, password, code) {
              var deferred = $q.defer();
                $http({
                    method: 'GET',
                    params: {
                              'app_key' : key,
                              'password' : password,
                              'task' : 'login_authenticate'
                            },
                            url: baseurl
                     }).success(function(data, status, headers, config) {
                       // console.log(data);
                       if(data.details.customer_id){
                          // deferred.reject();
                         var status = logData(key, password, code, data);
                         deferred.resolve(data);
                       }
                       else if(data.details.message === false){
                          deferred.reject();
                       }
                       else{
                         deferred.reject();
                       }

                  }, function(data, status, headers, config){
                       deferred.reject();
                  });
              return deferred.promise;              
            };

            function logData(key, passcode, Code, result) {
               // console.log(result);
                 var isloggedin = false;
                 if(result.details.customer_id){
                   isloggedin = true;                   
                   storeUserCredentials(key + '*yourServerToken', passcode + '.yourPassword', Code+ '.yourCode', result.details.customer_id + '.yourID', result.details.business_name + '.BusinessName', result.details.customer_firstname + '.Fname', result.details.code + '.Currency');                                                          
                 }
                  else{
                    isloggedin = false;
                  }
                return isloggedin;
             };
            return {
              updateTheme: updateTheme,
              loginUser: loginUser,
              updateCode: updateCode,
              updateCodeData: updateCodeData,
              logoutUser: logoutUser,
              isAuthenticated: function() {return isAuthenticated;}
            }

        };

        function DigitalCodeService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/loginModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'DigitalCodeCtrl',
                controllerAs: 'vmCode'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function SecurityCodeService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/securityCode.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'SecurityCodeCtrl',
                controllerAs: 'vsCode'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function ChangeCodeService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/changeSecurityCode.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'ChangeCodeCtrl',
                controllerAs: 'vcCode'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function dashboardService($rootScope, $http, $q){
          var getDashboardData = function(key, start, end){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'task' : 'dashboard',
                            'key' : key,
                            'app_key' : $rootScope.AppKey,
                            'start_date': start,
                            'end_date': end
                          },
                          url: baseurl
                          // url: "http://www.eposhybrid.uk/Admininsight"
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       // return;
                       deferred.resolve(data);

                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          return {
            getDashboardData: getDashboardData,
          }
        };

        function ItemsSinglePriceService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/singlePriceItem.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'ItemsSinglePriceCtrl',
                controllerAs: 'singlePrice'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function ItemsMultiPriceService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/multiPriceItem.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'ItemsMultiPriceCtrl',
                controllerAs: 'multiPrice'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function ItemsService($http, $q, $rootScope){

          var menuTypes = function(){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key' : $rootScope.AppKey,
                            'task' : 'get_menutype'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var menuCategories = function(category_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key' : $rootScope.AppKey,
                            'category_id' : category_id,
                            'task' : 'get_menucategory'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var multiPrice = function(item_id) {
              var deferred = $q.defer();
                $http({
                    method: 'GET',
                    params: {
                              'app_key' : $rootScope.AppKey,
                              'item_id' : item_id,
                              'task' : 'item_sizes'
                            },
                            url: baseurl
                     }).success(function(data, status, headers, config) {
                       // console.log(data);
                         deferred.resolve(data);
                  }, function(data, status, headers, config){
                       deferred.reject();
                  });
              return deferred.promise;
            };

            var updateSinglePrice = function(item_data){
              var deferred = $q.defer();
              $http({
              method: 'POST',
              data: $.param({
                        'app_key' : item_data.app_key,
                        'item_id' : item_data.item_id,
                        'price': item_data.price                       
                      }),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url: baseurl+'update_item'
               }).success(function(data, status, headers, config) {
                       // alert('Yes '+JSON.stringify(data));
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                       // alert('Error '+JSON.stringify(data));
                      
                       deferred.reject();
               });
               return deferred.promise;             
            };

             var updateMultiplePrice = function(item_data){
              var deferred = $q.defer();
              $http({
                  method: 'POST',
                  data: $.param({
                            'app_key' : item_data.app_key,
                            'item_id' : item_data.item_id,
                            'multi_sizeprice': item_data.multiple_sizeprice                        
                          }),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                  url: baseurl+'update_item'
                   }).success(function(data, status, headers, config) {
                           // alert('Yes '+JSON.stringify(data));
                           deferred.resolve(data);
                      }, function(data, status, headers, config) {
                           // alert('Error '+JSON.stringify(data));
                          
                           deferred.reject();
                   });
               return deferred.promise;
            };

            var updateStatus = function(item_data){
              var deferred = $q.defer();
              return $http({
              method: 'POST',
              data: $.param({
                        'app_key' : item_data.app_key,
                        'item_id' : item_data.item_id,
                        'status': item_data.status                     
                      }),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url: baseurl+'update_item'
               }).success(function(data, status, headers, config) {
                       // alert('Yes '+JSON.stringify(data));
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                       // alert('Error '+JSON.stringify(data));
                      
                       deferred.reject();
               });
               return deferred.promise;             
            };

          return{
            menuTypes : menuTypes,
            menuCategories : menuCategories,
            multiPrice: multiPrice,
            updateStatus : updateStatus,
            updateSinglePrice : updateSinglePrice,
            updateMultiplePrice: updateMultiplePrice,
            getItems: function(category_id, sub_id) {
                                if(category_id != undefined && sub_id != undefined) {
                                  if(sub_id != "0" && category_id != "0"){
                                    return $http.get(baseurl+'?task=item_list&category_id='+category_id+'&sub_id='+sub_id+'&app_key='+$rootScope.AppKey);
                                  }
                                  else if(category_id != "0"){
                                    return $http.get(baseurl+'?task=item_list&category_id='+category_id+'&sub_id=0&app_key='+$rootScope.AppKey);
                                  }
                                  else{
                                    return $http.get(baseurl+'?task=item_list&category_id=0&sub_id='+sub_id+'&app_key='+$rootScope.AppKey);
                                  }
                                }
                                // else if(category_id){
                                // }
                                // else if(sub_id){
                                //   return $http.get(baseurl+'?task=item_list&sub_id='+sub_id+'&app_key='+$rootScope.AppKey);
                                // }
                                else{
                                  return $http.get(baseurl+'?task=item_list&app_key='+$rootScope.AppKey);
                                }
                              }
          }
        };

        function PromotionEditService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/promotionModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'PromotionsEditCtrl',
                controllerAs: 'vmEditProm'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function PromotionService($http, $q, $rootScope){

          var updatePromotionPrice = function(item_data){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'item_data' : item_data,
                            'task' : 'update_promotion'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var updateStatus = function(item_data){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'status_flag': true,
                            'item_data' : item_data,
                            'task' : 'update_promotion'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var promotionTypes = function(category_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'task' : 'get_promotiontype'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };


          return{
            updatePromotionPrice : updatePromotionPrice,
            updateStatus : updateStatus,       
            promotionTypes: promotionTypes,     
            getPromotions: function(type_id) {
                              if(type_id != undefined) {
                                  if(type_id != "0"){
                                    return $http.get(baseurl+'?task=promotion_list&type_id='+type_id+'&app_key='+$rootScope.AppKey);
                                  }
                                  
                                  else{
                                    return $http.get(baseurl+'?task=promotion_list&app_key='+$rootScope.AppKey);
                                  }
                                }                                
                                else{
                                  return $http.get(baseurl+'?task=promotion_list&app_key='+$rootScope.AppKey);
                                }
          
          }

          }
        };

        function TablesService($http, $q, $rootScope){

          return {

            getBookedTablesData: function() {
                                return $http.get(baseurl+'?task=current_bookings&app_key='+$rootScope.AppKey);
                              },
            getOccTablesData: function() {
                                return $http.get(baseurl+'?task=current_occupy&app_key='+$rootScope.AppKey);
                              }
          }
        };

        function StaffStatusService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/staffStatusModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'staffStatusEditCtrl',
                controllerAs: 'vmStaffStatus'
              }).then(function(modal) {
                  service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function StaffAppsService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/staffAppsModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'staffAppsEditCtrl',
                controllerAs: 'vmStaffApps'
              }).then(function(modal) {
                    service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function viewRotaModalService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/viewRotaModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'viewRotaCtrl',
                controllerAs: 'viewR'
              }).then(function(modal) {
                    service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function todayRotaModalService($ionicModal){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/todayRotaModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'todayRotaCtrl',
                controllerAs: 'todayR'
              }).then(function(modal) {
                    service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };
        };

        function addRotaModalService($ionicModal, $q, $http){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/addRotaModal.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'addRotaCtrl',
                controllerAs: 'addR'
              }).then(function(modal) {
                    service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };

        };

        function StaffService($http, $q, $rootScope){

          var addRotaStaff = function(addRotaData){
            var dataObj = {
              'app_key' : $rootScope.AppKey,
              'staff_id' : addRotaData.staff_id,
              'date': addRotaData.date,
              'pattern_id' : addRotaData.pattern_id,
              'designation_id' : addRotaData.designation_id,
              'type_code' : addRotaData.type_code
            }
            // console.log(dataObj);
            dataObj = JSON.stringify(dataObj);
            // var addRota = JSON.stringify(addRotaData);
            // console.log(addRota);
            var deferred = $q.defer();


             $http({
              method: 'POST',
              data: dataObj,
              url: baseurl+'add_rota'
               }).success(function(data, status, headers, config) {
                       deferred.resolve(data);
                  }, function(data, status, headers, config) {
                      console.log(data);
                       deferred.reject();
               });

            return deferred.promise;
          };

          var deleteRota = function(rota_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'rota_id': rota_id,
                            'task' : 'delete_staff_rota'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var shiftPatterns = function(){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'task' : 'rota_shift_patterns'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var staffDesignations = function(staff_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'staff_id': staff_id,
                            'task' : 'get_staff_designations'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var shiftTypes = function(){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'task' : 'get_shift_types'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var updateAppPermissions = function(permission_data){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'permission_data' : permission_data,
                            'task' : 'update_staff_permissions'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var statusReasons = function(){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'task' : 'staff_status_list'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var getRotaData = function(staff_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'staff_id': staff_id,
                            'task' : 'view_rota'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var getNextRotaData = function(staff_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key': $rootScope.AppKey,
                            'staff_id': staff_id,
                            'task' : 'view_rota_next_week'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var updateStatus = function(item_data){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'status_data' : item_data,
                            'task' : 'update_staff_status'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };




          var getAppsList = function(staff_id){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key' : $rootScope.AppKey,
                            'staff_id' : staff_id,
                            'task' : 'get_permissions'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };      

          return{
            addRotaStaff : addRotaStaff,
            deleteRota : deleteRota,
            shiftPatterns : shiftPatterns,
            staffDesignations : staffDesignations,
            shiftTypes : shiftTypes,
            getAppsList : getAppsList,
            updateStatus : updateStatus,
            statusReasons : statusReasons,
            getRotaData : getRotaData,
            getNextRotaData: getNextRotaData,
            updateAppPermissions : updateAppPermissions,
            getTodayStaff: function() {
                                return $http.get(baseurl+'?task=today_staff&app_key='+$rootScope.AppKey);
                              },
            getTodayRota: function() {
              return $http.get(baseurl+'?task=today_rota&app_key='+$rootScope.AppKey);
            },
            getTommRota: function() {
              return $http.get(baseurl+'?task=tomorrow_rota&app_key='+$rootScope.AppKey);
            },
            getAllStaff: function() {
                                return $http.get(baseurl+'?task=staff_list&app_key='+$rootScope.AppKey);
                              }
          }
        };

        function updateAppCodeModalService($ionicModal, $q, $http){
          this.showModal = function() {
              var service = this;
              $ionicModal.fromTemplateUrl('templates/modals/updateAppCode.html', {
                scope: null,
                animation: 'slide-in-right',
                backdropClickToClose: false,
                // hardwareBackButtonClose: false,
                controller: 'updateAppCodeCtrl',
                controllerAs: 'addR'
              }).then(function(modal) {
                    service.modal = modal;
                  service.modal.show();
              });
          };
          this.hideModal = function() {
              this.modal.hide();
          };

        };

        function AppManagementService($http, $q, $rootScope) {

          var getAppDevices = function(){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key' : $rootScope.AppKey,
                            'task' : 'getAllDevices'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var updateAppCode = function(code_id, code){
            var dataObj = {
              'app_key' : $rootScope.AppKey,
              'code_id' : code_id,
              'code' : code
            }
            dataObj = JSON.stringify(dataObj);
            // dataArray.push(dataObj);
            var deferred = $q.defer();
              $http({
                          method: 'POST',
                          data: dataObj,
                          url: baseurl+'setDeviceCode'
                   }).success(function(data, status, headers, config) {
                        // console.log(data);
                        deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };

          var updateAppStatus = function(item){
            var deferred = $q.defer();
              $http({
                  method: 'GET',
                  params: {
                            'app_key' : $rootScope.AppKey,
                            'code_id' : item.code_id,
                            'status' : item.device_status,
                            'task' : 'setDeviceStatus'
                          },
                          url: baseurl
                   }).success(function(data, status, headers, config) {
                       // console.log(data);
                       deferred.resolve(data);
                }, function(data, status, headers, config){
                     deferred.reject();
                });
            return deferred.promise;
          };    

          return{
            getAppDevices : getAppDevices,
            updateAppCode : updateAppCode,
            updateAppStatus : updateAppStatus
          }
        };

})();
