/**
 * Created by Thedward on 29/02/2016.
 */
'use strict';

// Declare app level module which depends on views, and components
var template_url='templates/'; // chemin vers le dossier des templates
//definition de tout les modules
var controller =angular.module('ngom.controllers', ['ui.router']);
var service =angular.module('ngom.services', ['ui.router']);
var directive =angular.module('ngom.directives', ['ui.router']);

var message_erreur="Aucun contenu";

angular.module('ngom', [
    'ui.router',
    'gettext',
    'angularUtils.directives.dirPagination',
    'ngom.controllers',
    'ngom.directives',
    'angularFileUpload',
    'ngom.services'
]).run(['$rootScope','$state','$location','gettextCatalog',
    function($rootScope,$state,$location,gettextCatalog){
        /* Translate */
        gettextCatalog.currentLanguage=navigator.language;
        gettextCatalog.debug=true;
        /* End Translate */
        /* ceci est le main de l'application */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
            // mise a jour du title de la page de maniere automatique
            $rootScope.title=toState.title;
            $rootScope.currentUser={};
            $rootScope.currentUser.roles = [{name:'Admin'},{name:'UserManager '},{name:"User"}];

            if(localStorage.getItem('id')==null && localStorage.getItem('token')==null){
                // Pas encore identifié
                if(toState.access.requiresLogin==true){
                    $location.path("login");
                }
                else if(fromState.name==""){
                    $location.path("login");
                }
            }
            else if(localStorage.getItem('id')!=null && localStorage.getItem('token')!=null){
                //identifié, veirification des ses permissions
                if(toState.access.requiresAdminRule==true && toState.access.requiresSuperAdminRule==true){
                    if(parseInt(localStorage.getItem('admin'))!=2 && parseInt(localStorage.getItem('admin'))!=1){
                        $location.path('403');
                    }
                    else{
                        console.log("erreur");
                    }
                }
                else if(toState.access.requiresAdminRule==false && toState.access.requiresSuperAdminRule==true){
                    if(parseInt(localStorage.getItem('admin'))!=1){
                        $location.path('403');
                    }
                }
                else if(fromState.name==""){

                }
            }
            else{
                $location.path("login");
            }

        });
    }])



    .config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
        $urlRouterProvider.otherwise( '/login');
        $stateProvider.state('home', {
            url: "/home",
            templateUrl:  template_url+'home.html',
            controller:"HomeCtrl",
            access:{
                requiresLogin:true,
                requiresAdminRule: false,
                requiresSuperAdminRule: false
            }
        }).state('departement', {
            url: "/departement/:libelle",
            templateUrl:  template_url+'departement.html',
            controller:"DepartementCtrl",
            access:{
                requiresLogin:true,
                requiresAdminRule: false,
                requiresSuperAdminRule: false
            }
        })
            .state('user', {
                url: "/user/:dept/:id/:state?",
                templateUrl:  template_url+'user.html',
                controller:"UserCtrl",
                access:{
                    requiresLogin:true,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            })
            .state('form', {
                url: "/form",
                templateUrl:  template_url+'form.html',
                controller:"FormCtrl",
                access:{
                    requiresLogin:true,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            })
            .state('edit', {
                url: "/edit/:id",
                templateUrl:  template_url+'edit.html',
                controller:"EditCtrl",
                access:{
                    requiresLogin:true,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            })
            .state('admin', {
                url: "/zephyr08",
                templateUrl:  template_url+'administration.html',
                controller:"AdminCtrl",
                access:{
                    requiresLogin:true,
                    requiresAdminRule: true,
                    requiresSuperAdminRule: true
                }
            })
            .state('login', {
                url: "/login",
                templateUrl:  template_url+'login.html',
                controller:"LoginCtrl",
                access:{
                    requiresLogin:false,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            })
            .state('logout', {
                url: "/logout",
                //templateUrl:  template_url+'login.html',
                controller:"LogoutCtrl",
                access:{
                    requiresLogin:true,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            })
            .state('403', {
                url: "/403",
                templateUrl:  template_url+'403.html',
                access:{
                    requiresLogin:false,
                    requiresAdminRule: false,
                    requiresSuperAdminRule: false
                }
            });
    }]);
