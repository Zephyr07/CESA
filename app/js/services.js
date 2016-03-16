/**
 * Created by Thedward on 29/02/2016.
 */

var adresse="http://192.168.173.1/annuaire/";


/******************************************************************************************************************
     Departement Sercives
 *****************************************************************************************************************/
service.factory('DepartementFactory', ['$http','$filter','$q','$rootScope',
    function ($http,$filter,$q,$rootScope) {

        var factory = {
            departements: false,
            departement: false,
            getDepartements: function () {
                var deferred = $q.defer();
                $http.get(adresse+"departement/depts").success(function(data,status){
                //$http.get("ressources/departement.json").success(function(data,status){
                    //console.log("Departement");
                    //console.log(data);
                    if(data.type==0){
                        factory.departements = data.data;
                        //console.log(data);
                        deferred.resolve(factory.departements);
                    }
                    else if(data.type==1){
                        console.log("erreur")
                    }
                    else{
                        factory.departements = data;
                    }

                }).error(function(data,status){
                    console.log(status);
                    deferred.reject('Impossible de recuperer les departements');
                });

                return deferred.promise;

            },
            getDepartement: function (obj) {
                var deferred = $q.defer();
                var departements = factory.getDepartements().then(function(services){
                    deferred.resolve($filter('filter')(factory.departements,obj,true)[0]);
                },function(msg){
                    deferred.reject(msg);
                });
                return deferred.promise;



            }
        }

        return factory

    }])
/******************************************************************************************************************
    User Services
 *****************************************************************************************************************/
    .factory('UserFactory', ['$http','$filter','$q','$rootScope',
        function ($http,$filter,$q,$rootScope) {


            var factory = {
                users: false,
                user: false,
                getUsers: function (obj) {
                    var deferred = $q.defer();
                    //console.log(adresse+"user/userall?dept="+obj.dept+"&token="+localStorage.getItem('token'));
                    $http.get(adresse+"user/userall?dept="+obj.dept+"&token="+localStorage.getItem('token')).success(function(data,status){
                    //$http.get("ressources/user.json").success(function(data,status){
                    //    console.log("Users");
                    //    console.log(data);
                        if(data.type==0){
                            factory.users = data.data;
                            //console.log(data);
                        }
                        else if(data.type!=-1){
                            factory.users = data;
                        }
                        deferred.resolve(data);
                    }).error(function(data,status){
                        console.log(data);
                        console.log(status);
                        deferred.reject('Impossible de recuperer les users');
                    });

                    return deferred.promise;

                },
                getUser: function (obj) {
                    //console.log(adresse+"user/user?id="+obj.id+"&token="+localStorage.getItem('token'));
                    var deferred = $q.defer();
                    $http.get(adresse+"user/user?id="+obj.id+"&token="+localStorage.getItem('token')).success(function(data,status){
                    //$http.get("ressources/user.json").success(function(data,status){
                        //console.log("User");
                        //console.log(data);
                        if(data.type==0){
                            factory.user = data.data;
                            //console.log(data);
                        }
                        else if(data.type==1){
                            console.log("erreur")
                        }
                        else{
                            factory.user = data;
                        }
                        deferred.resolve(data);
                    }).error(function(data,status){
                        console.log(data);
                        console.log(status);
                        deferred.reject('Impossible de recuperer les users');
                    });
                    return deferred.promise;
                },
                addPicture: function (obj) {
                    var deferred = $q.defer();
                    console.log(obj);
                    $http.post(adresse+"user/insertImage",obj).
                        success(function(data,status){
                            console.log(data);
                            deferred.resolve(data);
                        }).error(function(data,status){
                            console.log(data);
                            console.log(status);
                            deferred.reject('Impossible de recuperer les users');
                        });
                    return deferred.promise;
                },
                addUser: function (obj) {
                    var deferred = $q.defer();
                    //console.log(obj);
                    $http.post(adresse+"user/user",obj).
                        success(function(data,status){
                            //console.log(data);
                            if(data.type==0){
                                deferred.resolve(data);
                                localStorage.setItem("login",data.data.infosuser.login);
                                localStorage.setItem("id",data.data.infosuser.user.id);
                                localStorage.setItem("token",data.token);
                                localStorage.setItem("admin",data.data.infosuser.user.admin);
                            }
                            else if(data.type==1){
                                $rootScope.messageLogin=data.message;
                            }
                                deferred.resolve(data);
                        }).error(function(data,status){
                            console.log(data);
                            console.log(status);
                            //deferred.reject('Impossible de recuperer les users');
                        });
                    return deferred.promise;
                },
                editUser: function (obj) {
                    var deferred = $q.defer();
                    obj.token=localStorage.getItem('token');
                    obj.id=localStorage.getItem('id'); // id de celui qui est connecté
                    console.log(obj);
                    $http.post(adresse+"user/userupd",obj).
                        success(function(data,status){
                            console.log("sqsdqsd");
                            if(data.type==0){
                                //deferred.resolve(data);
                            }
                            else if(data.type==1){
                                $rootScope.messageLogin=data.message;
                            }
                            deferred.resolve(data);
                        }).error(function(data,status,e){
                            console.log(data);
                            console.log(status);
                            console.log(e);
                            //deferred.reject('Impossible de recuperer les users');
                        });
                    return deferred.promise;
                },
                loginUser: function (obj) {
                    //console.log(obj);
                    var deferred = $q.defer();
                    $http.post(adresse+"user/usercon",obj).
                        success(function(data,status){
                            //console.log(data);
                            if(data.type==0){
                                localStorage.setItem("login",data.data.infosuser.login);
                                localStorage.setItem("id",data.data.infosuser.user.id);
                                localStorage.setItem("token",data.token);
                                localStorage.setItem("admin",data.data.infosuser.user.admin);
                                //deferred.resolve(data);
                                //console.log(data);
                            }
                            else if(data.type==-1){
                                $rootScope.messageLogin=data.message;
                            }
                            deferred.resolve(data);
                        }).error(function(data,status){
                            console.log(data);
                            console.log(status);
                           deferred.reject('Impossible de loguer l\'utilisateur');
                        });
                    return deferred.promise;
                },
                logoutUser: function (obj) {
                    var deferred = $q.defer();
                    //console.log(adresse+"user/userdisconn?token="+obj);
                    $http.get(adresse+"user/userdisconn?token="+obj).
                        success(function(data,status){
                            console.log(data);
                            deferred.resolve(data);
                        }).error(function(data,status){
                            console.log(data);
                            console.log(status);
                            deferred.reject('Impossible de loguer l\'utilisateur');
                        });
                    return deferred.promise;
                }
            }

            return factory

        }])

/******************************************************************************************************************
 Admin Services
 *****************************************************************************************************************/
    .factory('AdminFactory', ['$http','$filter','$q',
        function ($http,$filter,$q) {

            var factory = {
                getAllUsers:function(){
                    var deferred = $q.defer();
                    $http.get(adresse+"administrator/userall?token="+localStorage.getItem('token')).success(function(data,status){
                        if(data.type==0){
                            //console.log(data);
                        }
                        else if(data.type==1){
                            console.log("erreur")
                        }
                        else{
                            factory.user = data;
                        }
                        deferred.resolve(data);
                    }).error(function(data,status){
                        console.log(data);
                        console.log(status);
                        deferred.reject('Impossible de recuperer les users');
                    });
                    return deferred.promise;
                },
                deleteUser:function(id){
                    var deferred = $q.defer();
                    $http.get(adresse+"user/userdel?iddel="+id+"&id="+localStorage.getItem('id')+"&token="+localStorage.getItem('token')).success(function(data,status){
                        console.log(data);
                        if(data.type==0){
                            console.log(data);
                        }
                        else if(data.type==1){
                            //console.log("erreur")
                        }
                        else{
                            factory.user = data;
                        }
                        deferred.resolve(data);
                    }).error(function(data,status){
                        console.log(data);
                        console.log(status);
                        deferred.reject('Impossible de recuperer les users');
                    });
                    return deferred.promise;
                },
                changeProfile:function(id){
                    var deferred = $q.defer();
                    $http.post(adresse+"administrator/changeprofil",{idmod:id,id:localStorage.getItem('id'),token:localStorage.getItem('token')}).success(function(data,status){
                        if(data.type==0){
                            console.log(data);
                        }
                        else if(data.type==1){
                            console.log("erreur")
                        }
                        else{
                            factory.user = data;
                        }
                        deferred.resolve(data);
                    }).error(function(data,status){
                        console.log(data);
                        console.log(status);
                        deferred.reject('Impossible de recuperer les users');
                    });
                    return deferred.promise;
                }
            }
            return factory
        }])