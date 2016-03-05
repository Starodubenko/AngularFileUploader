(function(){
    angular.module('angularUploaderPanel')
        .directive('fileSelector', function(){
            return{
                restrict: 'E',
                require: ['^uploaderPanel', '^fileForm'],
                scope: {},
                template:
                '<div class="input-block" layout="row">' +
                '<md-button flex="40" ng-click="clickSelectFileButton($event)" ng-disabled="fileIsUploading">' +
                '<md-icon class="upload-icon"><i class="material-icons">note_add</i></md-icon>' +
                'Select File' +
                '</md-button>' +
                '<input type="file" name="file" ng-model="file" ngf-select>' +
                '<span class="SelectedfileName md-body-1" flex="60" ng-bind="file.name" msd-wheel="scroll($event, $delta, $deltaX, $deltaY)"></span>' +
                '</div>',
                link: function ($scope, element, attributes, Controllers) {
                    var UploaderPanelController = Controllers[0];
                    var FileFormController = Controllers[1];
                    var sibling;

                    $scope.clickSelectFileButton = function (el) {
                        sibling = el.currentTarget.nextElementSibling;
                        sibling.click();
                    };

                    $scope.$watch('file', function () {
                        FileFormController.setFile($scope.file);
                    });

                    $scope.scroll = function ($event, $delta, $deltaX, $deltaY) {
                        UploaderPanelController.horizontalScroll($event, $delta, $deltaX, $deltaY);
                    }
                }
            }
        });
})();
