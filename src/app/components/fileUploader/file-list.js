(function () {
    angular.module('angularUploaderPanel')
        .directive('fileList', function($http){
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
                        var id = removeElement.attributes['value'].value;

                      $http({
                        method: 'POST',
                        url: 'http://localhost:8282/delete-file',
                        headers : {
                          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: {id: id}
                      }).then(function successCallback(resp) {
                        if (resp.status == 200){
                          $scope.files = $scope.files.filter(function (el) {
                            return el.id != id;
                          });
                        }
                      }, function errorCallback(response) {
                        console.log(response);
                      });
                    };
                },
                link: function ($scope, element, attributes) {
                    $scope.files = [];

                    $scope.$on('fileIsUploaded', function (e, data) {
                        $scope.files.push({
                            id: data.id,
                            name: data.name,
                            comment: data.comment,
                            date: data.date
                        })
                    });
                }
            }
        });
})();
