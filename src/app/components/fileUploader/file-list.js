(function () {
    angular.module('angularUploaderPanel')
        .directive('fileList', function(){
            return{
                restrict: 'E',
                template:
                '<div class="files-list">' +
                '<div ng-repeat="file in files">' +
                '<uploaded-file file="file"></uploaded-file>' +
                '<md-divider ng-if="!$last"></md-divider>' +
                '</div>' +
                '</div>',
                controller: function ($scope) {
                    var vm = this;
                    vm.removeFile = function (el) {
                        var removeElement = angular.element(el)[0].currentTarget;
                        var value = removeElement.attributes['value'].value;

                        $scope.files = $scope.files.filter(function (el) {
                            return el.name !== value;
                        });
                    };
                },
                link: function ($scope, element, attributes) {
                    $scope.files = [];

                    $scope.$on('fileIsUploaded', function (e, data) {
                        $scope.files.push({
                            name: data.name,
                            comment: data.comment,
                            date: data.date
                        })
                    });
                }
            }
        });
})();
