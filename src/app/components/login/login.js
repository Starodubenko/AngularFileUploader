(function () {
  angular.module('login', ['ngAnimate']);

  angular.module('photo')
    .factory('LoginService', function () {
      var service = {};
      service.users = [
        {
          firstname: 'Rodion',
          lastname: 'Starodubenko',
          login: 'Rody',
          password: '1'
        }
      ];
      return {
        setCurrentPhoto: function () {

        }
      }
    });


  angular.module('photo')
    .directive('loginView', function (PhotoService) {
      return {
        restrict: 'E',
        template: '<div class="photo-view" layout="row" layout-wrap layout-align="center start">' +
        '<photo-panel photo="photo" ng-repeat="photo in photos" tabindex="1" right-key="PhotoService.showNext()" left-key="PhotoService.showPrevious()" esc-key="PhotoService.setShownSlider(false)" ></photo-panel>' +
        '<photo-slider></photo-slider>' +
        '</div>',
        link: function ($scope) {
          $scope.PhotoService = PhotoService;
          $scope.photos = PhotoService.getPhotos();
        }
      }
    });
})();
