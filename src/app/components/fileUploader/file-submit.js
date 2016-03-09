(function () {
    angular.module('angularUploaderPanel')
        .directive('fileSumbit', function($filter, $timeout, Upload){
            return{
                restrict: 'E',
                require: '^fileForm',
                scope: {
                    'uploadObject': '='
                },
                template:
                '<div layout="row" layout-align="end center">' +
                '<div class="uploader-messages" layout="row" layout-align="center center" flex="auto">' +
                '<span class="error-message" ng-show="statusCode == 0">This file already in list!</span>' +
                '<span class="error-message" ng-show="statusCode == 1">Select the file!</span>' +
                '<span class="success-message" ng-show="statusCode == 2">File uploaded successfully!</span>' +
                '</div>' +
                '<md-progress-circular md-mode="determinate" class="upload-rogress hidden-element" value="{{progressPercentage}}"></md-progress-circular>' +
                '<md-button ng-click="uploadFile($event)" ng-disabled="formIsValid()">' +
                '<md-icon class="upload-icon"><i class="material-icons">file_upload</i></md-icon>' +
                'Upload' +
                '</md-button>' +
                '</div>',
                link: function ($scope, element, attributes, FileFormController) {
                    $scope.progressPercentage = 0;
                    $scope.statusCode = -1;

                    $scope.formIsValid = function(){
                        return !FileFormController.formIsValid();
                    };

                    var uploadButton = null;
                    var uploadProcess = null;
                    $scope.uploadFile = function (button) {
                        uploadButton = angular.element(button.currentTarget);
                        uploadProcess = angular.element(button.currentTarget.previousElementSibling);
                        var itemAlreadyInArray = $filter('fileAlreadyInArray')($scope.uploadObject, $scope.uploadedObjects);

                        if (!$scope.uploadObject.file) {
                            $scope.statusCode = 1;
                        } else if (!itemAlreadyInArray) {
                            uploadButton.addClass('hidden-element');
                            uploadProcess.removeClass('hidden-element');
                            $scope.fileIsUploading = true;
                            $scope.upload($scope.uploadObject.file);
                        } else {
                            $scope.statusCode = 0;
                        }
                    };

                    $scope.upload = function (file) {
                        Upload.upload({
                            url: 'http://localhost:8282/upload-file',
                            data: {file: file, comment: $scope.uploadObject.comment}
                        }).then(function (resp) {
                            if (resp.status == 200) {
                                $timeout(function () {
                                    uploadProcess.addClass('hidden-element');
                                    uploadButton.removeClass('hidden-element');

                                    FileFormController.setDate(resp.data.currentDate);
                                    FileFormController.setId(resp.data.id);
                                    FileFormController.sendFileInToList();

                                    $scope.uploadObject = {};
                                    $scope.progressPercentage = 0;
                                    $scope.fileIsUploading = false;
                                    $scope.statusCode = 2;
                                }, 200);
                            }
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    };

                }
            }
        });
})();
