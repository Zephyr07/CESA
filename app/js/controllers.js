/**
 * Created by Thedward on 29/02/2016.
 */

controller
    .controller('MainCtrl',['$scope','$stateParams','DepartementFactory','UserFactory','$location',
        function($scope,$stateParams,DepartementFactory,UserFactory,$location) {
            $scope.currentDate=new Date();
            getDepartement(DepartementFactory,$scope);

            $scope.adresseServeur=adresse;

            $scope.UserDisconnect=function(){
                UserFactory.logoutUser({token:localStorage.getItem('token')}).then(function(data){
                    console.log(data);
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    localStorage.removeItem("login");
                    window.location.reload();
                    $location.path("login");
                })
            }
        }
    ]
)
    .controller('HomeCtrl',['$scope','$stateParams','DepartementFactory','UserFactory','$timeout','$location','$rootScope',
        function($scope,$stateParams,DepartementFactory,UserFactory,$timeout,$location,$rootScope) {
            // Chargement des infos sur l'utilisateur
            if(localStorage.getItem('id')!=null){
                UserFactory.getUser({id:parseInt(localStorage.getItem('id')),token:localStorage.getItem('token')}).then(
                    function(data){
                        if(data.type==0){
                            //$scope.user=data.data;
                            $rootScope.user=data.data;
                        }
                        else if(data.type==-1){
                            console.log(data.message);
                            $timeout(function(){
                                $location.path("logout");
                            },1000)
                            $scope.loadingUser=false;
                        }
                        else{
                            $location.path("home");
                        }
                    }
                )
                getDepartement(DepartementFactory,$scope);
            }
            // Fin
        }
    ]
)
.controller('DepartementCtrl',['$scope','$stateParams','DepartementFactory','UserFactory','$timeout','$rootScope',
        function($scope,$stateParams,DepartementFactory,UserFactory,$timeout,$rootScope) {
            $scope.par_page=10;

            //$scope.login();
            $scope.loading=true;
            $scope.loadDepartement=function(libelle){
                DepartementFactory.getDepartement({libelle:libelle}).then(function(data){
                    $scope.departement=data;
                });

                UserFactory.getUsers({dept:libelle}).then(function(data){
                    if(data.type==0){
                        $scope.users=data.data;
                        //console.log(data);
                    }
                    else if(data.type==-1){
                        console.log("Aucun étudiant");
                        $("#message").html(data.message);
                    }
                    $scope.loading=false;
                });
            }

            $scope.loadDepartement($stateParams.libelle);
        }
    ]
)
    .controller('UserCtrl',['$scope','$stateParams','UserFactory','$timeout','$location','$rootScope','$filter',
        function($scope,$stateParams,UserFactory,$timeout,$location,$rootScope,$filter) {
            $scope.loadingUser=true;
            if($stateParams.state!=""){
                $('#message').html("Modification effectuée");
                $("#message").addClass('message-info');
            }
            UserFactory.getUser({dept:$stateParams.dept,id:parseInt($stateParams.id)}).then(function(data){
                if(data.type==0){
                    $scope.userU=data.data;
                    $rootScope.usr=data.data;
                    if(data.data.infosuser.user.photo==null){
                        data.data.infosuser.user.photo="profil.png";
                    }
                    $scope.edit=false;
                    if(parseInt($stateParams.id)==parseInt(localStorage.getItem('id'))){
                        $scope.edit=true;
                    }
                    $scope.loadingUser=false;
                }
                else if(data.type==-1){
                    console.log(data.message);
                    $timeout(function(){
                        $location.path("home");
                    },1000)
                    $scope.loadingUser=false;
                }
                else{
                    $location.path("home");
                }
                //$scope.loadingUser=false;
            });

            UserFactory.getUsers({dept: $stateParams.dept}).then(function(data){
                if(data.type==0){
                    $scope.usr=data.data;
                }
                else if(data.type==-1){
                    console.log("Aucun étudiant");
                }
                $scope.loading=false;
            });

            /** fonction de slide des user **/
            // atribution de numero aux users
            var i=1;
            $scope.next=function(user,currentUser){
                angular.forEach(user,function(value,key){
                    value.rang=i;
                    value.email=value.user.email;
                    i++
                });
                // selection de l'user en cours
                email=currentUser.infosuser.user.email;
                var currentUser=$filter('filter')(user,{email:email},true)[0];
                next=(currentUser.rang+1)%(i);
                if(next%i==0){
                    next++;
                }
                var nextUser=$filter('filter')(user,{rang:(next%i)},true)[0]
                $location.path('user/'+nextUser.user.dept.sigle+'/'+nextUser.user.id+'/');
                i=1;
            }

            $scope.previous=function(user,currentUser){
                angular.forEach(user,function(value,key){
                    value.rang=i;
                    value.email=value.user.email;
                    i++
                });
                // selection de l'user en cours
                email=currentUser.infosuser.user.email;
                var currentUser=$filter('filter')(user,{email:email},true)[0];
                prev=(currentUser.rang-1)%(i);
                if(prev==0){
                    prev=i-1;
                }
                var previousUser=$filter('filter')(user,{rang:(prev)},true)[0]
                console.info(previousUser.user.dept.sigle,previousUser.user.id);
                $location.path('user/'+previousUser.user.dept.sigle+'/'+previousUser.user.id+'/');
                i=1;
            }
        }
    ]
)
    .controller('EditCtrl',['$scope','$stateParams','UserFactory','$location',
        function($scope,$stateParams,UserFactory,$location) {
            UserFactory.getUser({dept:$stateParams.dept,id:parseInt($stateParams.id)}).then(function(data){
                if(data.type==0){
                    u=data.data;
                    $scope.user={};
                    $scope.user.login= u.login;
                    $scope.user.idmod= u.infosuser.user.id;
                    $scope.user.nom= u.infosuser.user.nom;
                    $scope.user.email= u.infosuser.user.email;
                    $scope.user.tel= u.infosuser.user.tel;
                    $scope.user.promotion= u.infosuser.user.promotion;
                    $scope.user.profil= u.infosuser.user.profil;
                    $scope.user.ville= u.infosuser.ville;
                    $scope.user.lserv= u.infosuser.lserv;
                    $scope.user.poste= u.infosuser.poste;
                }
                else if(data.type==-1){
                    alert(data.message);
                    $timeout(function(){
                        $location.path("home");
                    },1000)

                }
                else{
                    $location.path("home");
                }
            });

            $scope.EditUser=function(user){
                user.id=$scope.id;
                UserFactory.editUser(user).then(function(data){
                    $location.path('user/'+data.data+'/'+user.id+'/ok');
                })
            }
        }
    ]
)
    .controller('FormCtrl',['$scope','$stateParams','UserFactory','$location','$timeout',
        function($scope,$stateParams,UserFactory,$location,$timeout) {

            $scope.SaveUser=function(user){
                ////$scope.uploadFile(user.photo);
                //if($scope.userLogin.photo1!=null && $scope.userLogin.photo1!=undefined){
                //    user.photo=$scope.userLogin.photo1.name;
                //}
                //user.admin=0;
                UserFactory.addUser(user).then(function(data){
                    console.log(data);
                    if(data.type==0){
                        //redirection vers l'accueil
                        $location.path("home");
                        //window.location.href=$location.path();
                        $timeout(function(){
                            window.location.reload();
                        },500);
                    }
                    else{
                        $location.path(login);
                        $('#message').html(data.message);
                    }
                })
            }
        }
    ]
)
    .controller('LoginCtrl',['$scope','$stateParams','UserFactory','$rootScope','$location','$timeout',
        function($scope,$stateParams,UserFactory,$rootScope,$location,$timeout) {
            $scope.UserConnexion=function(user){
                $scope.loadingLogin=true;
                UserFactory.loginUser(user).then(function(data){
                    //$scope.user=$rootScope.user;
                    console.log(data);
                    if(data.type==0){
                        //redirection vers l'accueil
                        $location.path("home");
                        //window.location.href=$location.path();
                        $timeout(function(){
                            window.location.reload();
                        },500);
                    }
                    else{
                        $location.path(login);
                        $('#message').html(data.message);
                        $scope.loadingLogin=false;
                    }

                })
            }
        }
    ]
)
    .controller('LogoutCtrl',['$scope','$stateParams','UserFactory','$rootScope','$location',
        function($scope,$stateParams,UserFactory,$rootScope,$location) {
            $scope.UserDisconnect=function(){
                UserFactory.logoutUser({token:localStorage.getItem('token')}).then(function(data){
                    console.log(data);
                    localStorage.removeItem("id");
                    localStorage.removeItem("token");
                    localStorage.removeItem("login");
                    window.location.reload();
                    $location.path("login");
                })
            }
        }
    ]
)
    .controller('AdminCtrl',['$scope','$stateParams','AdminFactory','$location','$filter','$rootScope',
        function($scope,$stateParams,AdminFactory,$location,$filter,$rootScope) {
            $scope.loadingAdmin=true;
            $scope.admin=localStorage.getItem('admin');
            AdminFactory.getAllUsers().then(function(data){
               //console.log(data.data);
                if(data.type==0){
                    $scope.users=data.data;
                    $scope.loadingAdmin=false;
                }
                else if(data.type==-1){
                    $("#message").html(data.message);
                    $scope.loadingAdmin=false;
                }
                else{
            
                }
            });
            $scope.par_page=20;
            //$rootScope.user=$scope.users;
            //
            //$scope.listeUtilisateur=function(user){
            //    angular.forEach(user, function(value,key){
            //        value.admin=value.infosuser.user.admin;
            //    });
            //    console.log($rootScope.user);
            //    $scope.users=$filter('filter')(user,{admin:0},true);
            //}
            //$scope.listeAdministrateur=function(user){
            //    angular.forEach(user, function(value,key){
            //        value.admin=value.infosuser.user.admin;
            //    });
            //    console.log($rootScope.user);
            //    $scope.users=$filter('filter')(user,{admin:1},true);
            //}

            $scope.deleteUser=function(id){
                AdminFactory.deleteUser(id).then(function(data){
                    $("#message-info").html(data.message);
                    $('#message-info').addClass("message-info");
                });
            }

            $scope.setProfile=function(id){
                AdminFactory.changeProfile(id).then(function(data){
                    $("#message-info").html(data.message);
                    $('#message-info').addClass("message-info");
                });
            }
        }
    ]
)

    .controller('FileUploadCtrl', ['$scope', 'FileUploader','UserFactory', function($scope, FileUploader,UserFactory)
    {
        $scope.progress=0;
        var uploader = $scope.uploader = new FileUploader({
            //url: 'http://localhost/cordova/upload.php'
            url: adresse+'upload.php?login='+localStorage.getItem('login')+"&token="+localStorage.getItem('token')
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS
        //console.log(uploader);
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            //console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            //console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            //console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', progress);
            $scope.progress=progress;
        };
        uploader.onProgressAll = function(progress) {
            //console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            //console.info('onSuccessItem', response, status, headers);
        };
        //uploader.onErrorItem = function(fileItem, response, status, headers) {
        //    console.info('onErrorItem', response, status, headers);
        //};
        //uploader.onCancelItem = function(fileItem, response, status, headers) {
        //    console.info('onCancelItem', response, status, headers);
        //};
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem',response);
            ext=fileItem.file.name;
            st=ext.split(".");
            if(status==200){
                //Succes
                if(response==0) {//Success
                    //sauvegarde d' l'image dans la bd
                    UserFactory.addPicture(
                        {id:parseInt(localStorage.getItem('id')),
                            login:localStorage.getItem('login'),
                            token:localStorage.getItem('token'),
                            extension:st[st.length-1]
                        }).then(function(data){
                            console.log(data);
                            $("#message").html(data.message);
                        })
                }
                else if(response==-1){
                    //Extension non autorisé
                    $("#message").html("Extension non autorisée. Choisir une image avec l'une des extensions suivant: jpg, jpeg, png, giff");
                }
                else {
                    console.log(typeof response);
                }
            }
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        //console.info('uploader', uploader);
    }])

function getDepartement(DepartementFactory,$scope){
    DepartementFactory.getDepartements().then(function(data){
        $scope.departements=data;
    });
}