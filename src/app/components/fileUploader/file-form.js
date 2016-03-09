(function(){
    angular.module('angularUploaderPanel')
        .directive('fileForm', function(){
            return{
                restrict: 'E',
                scope: {},
                template:
                '<form name="fileForm">' +
                '<file-selector></file-selector>' +
                '<file-comment></file-comment>' +
                '<file-sumbit upload-object="uploadObject"></file-sumbit>' +
                '</form>',
                controller: function ($scope) {
                    $scope.uploadObject = {};
                    var vm = this;
                    vm.setFile = function (file) {
                        $scope.uploadObject.file = file;
                    };

                    vm.setComment = function (comment) {
                        $scope.uploadObject.comment = comment;
                    };

                    vm.setDate = function (date) {
                        $scope.uploadObject.date = date;
                    };

                    vm.setId = function (id) {
                      $scope.uploadObject.id = id;

                    };

                    vm.sendFileInToList = function () {
                        $scope.$parent.$broadcast('fileIsUploaded', {
                          id: $scope.uploadObject.id,
                          comment: $scope.uploadObject.comment,
                          name: $scope.uploadObject.file.name,
                          date: $scope.uploadObject.date
                        })
                    };

                    vm.formIsValid = function () {
                        return $scope.fileForm.$valid;
                    };
                }
            }
        });
})();
