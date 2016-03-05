(function () {
    angular.module('app.directives.fileUploader', ['ngAnimate', 'ngMaterial', 'monospaced.mousewheel', 'ngFileUpload'])
        .filter('fileAlreadyInArray', function () {
            return function (object, uploadedObjects) {
                var isThere = false;
                angular.forEach(uploadedObjects, function (value) {
                    if (!isThere) {
                        isThere = value.name == object.file.name;
                    }
                });
                return isThere;
            }
        })
        .directive('fileUploader', fileUploader);

    /** @ngInject */
    function fileUploader(Upload, $filter, $timeout) {
        return {
            restrict: 'E',
            templateUrl: ' /app/components/fileUploader/fileUploader.html',
            link: linkFileUploader
        };

        function linkFileUploader($scope, element, attributes) {

            $scope.progressPercentage = 0;
            $scope.statusCode = -1;
            $scope.uploadObject = {};
            $scope.uploadedObjects = [];
            $scope.fileIsUploading = false;

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

                            $scope.uploadedObjects.push({
                                name: $scope.uploadObject.file.name,
                                comment: $scope.uploadObject.comment,
                                date: resp.data.currentDate
                            });
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

            $scope.$watch('uploadObject.file', function (newValue) {
                if (newValue) {
                    $scope.statusCode = -1;
                }
            });

            $scope.horizontalScroll = function (element) {
                var deltaY = element.deltaY;
                element.target.scrollLeft = element.target.scrollLeft + deltaY / 3 * 5;
                event.preventDefault();
            };

            $scope.clickSelectFileButton = function (el) {
                var sibling = el.currentTarget.nextElementSibling;
                sibling.click();
            };

            $scope.removeFile = function (el) {
                var removeElement = angular.element(el)[0].currentTarget;
                var value = removeElement.attributes['value'].value;

                $scope.uploadedObjects = $scope.uploadedObjects.filter(function (el) {
                    return el.name !== value;
                });
            };
        }
    }

    // angular.module('app.directives.fileUploader')
    //     .directive('uploaderPanel', function(){
    //         return{
    //             restrict: 'E',
    //             template:
    //             '<div class="uploader-panel">' +
    //                 '<file-form></file-form>' +
    //                 '<file-list></file-list>' +
    //             '</div>',
    //             controller: function () {
    //                 this.horizontalScroll = function (element) {
    //                     var deltaY = element.deltaY;
    //                     element.target.scrollLeft = element.target.scrollLeft + deltaY / 3 * 5;
    //                     event.preventDefault();
    //                 };
    //             },
    //             link: function ($scope, element, attributes) {
    //
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('fileForm', function(){
    //         return{
    //             restrict: 'E',
    //             scope: {},
    //             template:
    //             '<form name="fileForm">' +
    //                 '<file-selector></file-selector>' +
    //                 '<file-comment></file-comment>' +
    //                 '<file-sumbit upload-object="uploadObject"></file-sumbit>' +
    //             '</form>',
    //             controller: function ($scope) {
    //                 $scope.uploadObject = {};
    //                 var vm = this;
    //                 vm.setFile = function (file) {
    //                     $scope.uploadObject.file = file;
    //                 };
    //
    //                 vm.setComment = function (comment) {
    //                     $scope.uploadObject.comment = comment;
    //                 };
    //
    //                 vm.setDate = function (date) {
    //                     $scope.uploadObject.date = date;
    //                     $scope.$parent.$broadcast('fileIsUploaded', {
    //                         comment: $scope.uploadObject.comment,
    //                         name: $scope.uploadObject.file.name,
    //                         date: $scope.uploadObject.date
    //                     })
    //                 };
    //
    //                 vm.formIsValid = function (date) {
    //                     return $scope.fileForm.$valid;
    //                 };
    //             },
    //             link: function ($scope, element, attributes) {
    //
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('fileSelector', function(){
    //         return{
    //             restrict: 'E',
    //             require: ['^uploaderPanel', '^fileForm'],
    //             scope: {},
    //             template:
    //             '<div class="input-block" layout="row">' +
    //                 '<md-button flex="100" ng-click="clickSelectFileButton($event)" ng-disabled="fileIsUploading">' +
    //                     '<md-icon class="upload-icon"><i class="material-icons">note_add</i></md-icon>' +
    //                     'Select File' +
    //                 '</md-button>' +
    //                 '<input type="file" name="file" ng-model="file" ngf-select>' +
    //                 '<span class="SelectedfileName md-body-1" flex="100" ng-bind="file.name" msd-wheel="scroll($event, $delta, $deltaX, $deltaY)"></span>' +
    //             '</div>',
    //             link: function ($scope, element, attributes, Controllers) {
    //                 var UploaderPanelController = Controllers[0];
    //                 var FileFormController = Controllers[1];
    //                 var sibling;
    //
    //                 $scope.clickSelectFileButton = function (el) {
    //                     sibling = el.currentTarget.nextElementSibling;
    //                     sibling.click();
    //                 };
    //
    //                 $scope.$watch('file', function () {
    //                     FileFormController.setFile($scope.file);
    //                 });
    //
    //                 $scope.scroll = function ($event, $delta, $deltaX, $deltaY) {
    //                     UploaderPanelController.horizontalScroll($event, $delta, $deltaX, $deltaY);
    //                 }
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('fileComment', function(){
    //         return{
    //             restrict: 'E',
    //             require: '^fileForm',
    //             template:
    //             '<md-input-container class="md-block">' +
    //                 '<label>Description</label>' +
    //                 '<textarea name="comment" ng-model="comment" md-maxlength="50" rows="2" md-select-on-focus></textarea>' +
    //             '</md-input-container>',
    //             link: function ($scope, element, attributes, FileFormController) {
    //                 $scope.$watch('comment', function () {
    //                     FileFormController.setComment($scope.comment);
    //                 });
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('fileSumbit', function($filter, $timeout, Upload){
    //         return{
    //             restrict: 'E',
    //             require: '^fileForm',
    //             scope: {
    //                 'uploadObject': '='
    //             },
    //             template:
    //                 '<div layout="row" layout-align="end center">' +
    //                     '<div class="uploader-messages" layout="row" layout-align="center center" flex="auto">' +
    //                         '<span class="error-message" ng-show="statusCode == 0">This file already in list!</span>' +
    //                         '<span class="error-message" ng-show="statusCode == 1">Select the file!</span>' +
    //                         '<span class="success-message" ng-show="statusCode == 2">File uploaded successfully!</span>' +
    //                     '</div>' +
    //                     '<md-progress-circular md-mode="determinate" class="upload-rogress hidden-element" value="{{progressPercentage}}"></md-progress-circular>' +
    //                     '<md-button ng-click="uploadFile($event)" ng-disabled="formIsValid()">' +
    //                         '<md-icon class="upload-icon"><i class="material-icons">file_upload</i></md-icon>' +
    //                         'Upload' +
    //                     '</md-button>' +
    //                 '</div>',
    //             link: function ($scope, element, attributes, FileFormController) {
    //                 $scope.progressPercentage = 0;
    //                 $scope.statusCode = -1;
    //
    //                 $scope.formIsValid = function(){
    //                     return !FileFormController.formIsValid();
    //                 };
    //
    //                 var uploadButton = null;
    //                 var uploadProcess = null;
    //                 $scope.uploadFile = function (button) {
    //                     uploadButton = angular.element(button.currentTarget);
    //                     uploadProcess = angular.element(button.currentTarget.previousElementSibling);
    //                     var itemAlreadyInArray = $filter('fileAlreadyInArray')($scope.uploadObject, $scope.uploadedObjects);
    //
    //                     if (!$scope.uploadObject.file) {
    //                         $scope.statusCode = 1;
    //                     } else if (!itemAlreadyInArray) {
    //                         uploadButton.addClass('hidden-element');
    //                         uploadProcess.removeClass('hidden-element');
    //                         $scope.fileIsUploading = true;
    //                         $scope.upload($scope.uploadObject.file);
    //                     } else {
    //                         $scope.statusCode = 0;
    //                     }
    //                 };
    //
    //                 $scope.upload = function (file) {
    //                     Upload.upload({
    //                         url: '/upload-file',
    //                         data: {file: file, comment: $scope.uploadObject.comment}
    //                     }).then(function (resp) {
    //                         if (resp.status == 200) {
    //                             $timeout(function () {
    //                                 uploadProcess.addClass('hidden-element');
    //                                 uploadButton.removeClass('hidden-element');
    //
    //                                 FileFormController.setDate(resp.data.currentDate);
    //
    //                                 $scope.uploadObject = {};
    //                                 $scope.progressPercentage = 0;
    //                                 $scope.fileIsUploading = false;
    //                                 $scope.statusCode = 2;
    //                             }, 200);
    //                         }
    //                     }, function (resp) {
    //                         console.log('Error status: ' + resp.status);
    //                     }, function (evt) {
    //                         $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //                     });
    //                 };
    //
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('fileList', function(){
    //         return{
    //             restrict: 'E',
    //             template:
    //             '<div class="files-list">' +
    //                 '<div ng-repeat="file in files">' +
    //                     '<upload-file file="file"></upload-file>' +
    //                     '<md-divider ng-if="!$last"></md-divider>' +
    //                 '</div>' +
    //             '</div>',
    //             controller: function ($scope) {
    //                 var vm = this;
    //                 vm.removeFile = function (el) {
    //                     var removeElement = angular.element(el)[0].currentTarget;
    //                     var value = removeElement.attributes['value'].value;
    //
    //                     $scope.files = $scope.files.filter(function (el) {
    //                         return el.name !== value;
    //                     });
    //                 };
    //             },
    //             link: function ($scope, element, attributes) {
    //                 $scope.files = [];
    //
    //                 $scope.$on('fileIsUploaded', function (e, data) {
    //                     $scope.files.push({
    //                         name: data.name,
    //                         comment: data.comment,
    //                         date: data.date
    //                     })
    //                 });
    //             }
    //         }
    //     });
    //
    // angular.module('app.directives.fileUploader')
    //     .directive('uploadFile', function(){
    //         return{
    //             restrict: 'E',
    //             require: '^fileList',
    //             scope: {
    //                 file: '=file'
    //             },
    //             template:
    //                 '<div class="fileRow md-subhead" layout="row">' +
    //                     '<span class="fileName md-body-1" flex="auto" ng-bind="file.name" msd-wheel="horizontalScroll($event, $delta, $deltaX, $deltaY)"></span>' +
    //                     '<span class="fileComment md-body-1" ng-bind="file.comment" msd-wheel="horizontalScroll($event, $delta, $deltaX, $deltaY)"></span>' +
    //                     '<span class="fileDate md-body-1" ng-bind="file.date | date : \'dd.MM.yyyy\'"></span>' +
    //                     '<md-button layout-align="center center" ng-click="removeFile($event)" value="{{file.name}}">' +
    //                         '<md-icon class="delete-icon"><i class="material-icons">clear</i></md-icon>' +
    //                     '</md-button>' +
    //                 '</div>',
    //             link: function ($scope, element, attributes, FileListController) {
    //                 $scope.removeFile = function (el) {
    //                     FileListController.removeFile(el)
    //                 }
    //             }
    //         }
    //     });
})();
