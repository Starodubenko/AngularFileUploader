(function () {
    angular.module('app.directives.fileUploader')
        .directive('fileComment', function(){
            return{
                restrict: 'E',
                require: '^fileForm',
                template:
                '<md-input-container class="md-block">' +
                '<label>Description</label>' +
                '<textarea name="comment" ng-model="comment" md-maxlength="50" rows="1" md-select-on-focus></textarea>' +
                '</md-input-container>',
                link: function ($scope, element, attributes, FileFormController) {
                    $scope.$watch('comment', function () {
                        FileFormController.setComment($scope.comment);
                    });
                }
            }
        });
})();
