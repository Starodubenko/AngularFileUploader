(function(){
    angular.module('app.directives.fileUploader')
        .directive('uploadedFile', function(){
            return{
                restrict: 'E',
                require: '^fileList',
                scope: {
                    file: '=file'
                },
                template:
                '<div class="fileRow md-subhead" layout="row">' +
                '<span class="fileName md-body-1" flex="auto" ng-bind="file.name" msd-wheel="horizontalScroll($event, $delta, $deltaX, $deltaY)"></span>' +
                '<span class="fileComment md-body-1" ng-bind="file.comment" msd-wheel="horizontalScroll($event, $delta, $deltaX, $deltaY)"></span>' +
                '<span class="fileDate md-body-1" ng-bind="file.date | date : \'dd.MM.yyyy\'"></span>' +
                '<md-button layout-align="center center" ng-click="removeFile($event)" value="{{file.name}}">' +
                '<md-icon class="delete-icon"><i class="material-icons">clear</i></md-icon>' +
                '</md-button>' +
                '</div>',
                link: function ($scope, element, attributes, FileListController) {
                    $scope.removeFile = function (el) {
                        FileListController.removeFile(el)
                    }
                }
            }
        });
})();
