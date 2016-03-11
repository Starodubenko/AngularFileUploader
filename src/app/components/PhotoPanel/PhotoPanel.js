(function () {
  angular.module('photo', []);

  angular.module('photo')
    .factory('PhotoService', function () {
      var service = {};
      service.photos = [
        {
          name: 'Photo_1',
          photoSrc: '/assets/images/images_1.jpg',
          currentPhoto: true
        },
        {
          name: 'Photo_2',
          photoSrc: '/assets/images/images_2.jpg',
          currentPhoto: false
        },
        {
          name: 'Photo_3',
          photoSrc: '/assets/images/images_3.jpg',
          currentPhoto: false
        },
        {
          name: 'Photo_4',
          photoSrc: '/assets/images/images_4.jpg',
          currentPhoto: false
        },
        {
          name: 'Photo_5',
          photoSrc: '/assets/images/images_5.jpg',
          currentPhoto: false
        }
      ];
      service.current = service.photos[0];
      service.shownSlider = false;
      var highlightPhoto = function (currentIndex, nextIndex) {
        service.photos[currentIndex].currentPhoto = false;
        service.photos[nextIndex].currentPhoto = true;
      };
      return {
        setCurrentPhoto: function (photo) {
          var currentIndex = service.photos.indexOf(service.current);
          var nextIndex = service.photos.indexOf(photo);
          service.current = photo;
          highlightPhoto(currentIndex, nextIndex);
        },
        getPhotos: function () {
          return service.photos;
        },
        getCurrentPhotoSrc: function () {
          return service.current.photoSrc;
        },
        getCurrentPhotoName: function () {
          return service.current.name;
        },
        showPrevious: function () {
          var currentIndex = service.photos.indexOf(service.current);
          var nextIndex = service.photos.indexOf(service.current) - 1;
          if (nextIndex < 0) {
            nextIndex = service.photos.length - 1;
            service.current = service.photos[nextIndex]
          } else {
            service.current = service.photos[nextIndex]
          }
          highlightPhoto(currentIndex, nextIndex);
        },
        showNext: function () {
          var currentIndex = service.photos.indexOf(service.current);
          var nextIndex = service.photos.indexOf(service.current) + 1;
          if (nextIndex > service.photos.length - 1) {
            nextIndex = 0;
            service.current = service.photos[nextIndex]
          } else {
            service.current = service.photos[nextIndex]
          }
          highlightPhoto(currentIndex, nextIndex);
        },
        setShownSlider: function (val) {
          service.shownSlider = val;
        },
        isShownSlider: function () {
          return service.shownSlider;
        }
      }
    });


  angular.module('photo')
    .directive('photoView', function (PhotoService) {
      return {
        restrict: 'E',
        template: '<div class="photo-view" layout="row" layout-wrap layout-align="center start">' +
        '<photo-panel photo="photo" ng-repeat="photo in photos"></photo-panel>' +
        '<photo-slider></photo-slider>' +
        '</div>',
        link: function ($scope) {
          $scope.PhotoService = PhotoService;
          $scope.photos = PhotoService.getPhotos();


        }
      }
    });

  angular.module('photo')
    .directive('photoPanel', function ($log, PhotoService) {
      return {
        restrict: 'E',
        scope: {
          photo: '=photo'
        },
        template:
        '<md-whiteframe class="md-whiteframe-12dp photo-panel" ng-class="{\'current-photo\': photo.currentPhoto}" layout="row">' +
        '<img class="photo" ng-src="{{photo.photoSrc}}" title="{{photo.name}}" ng-click="showSlider()" esc-key="PhotoService.setShownSlider(false)" left-key="PhotoService.showPrevious()" right-key="PhotoService.showNext()">' +
        '</md-whiteframe>',
        link: function ($scope) {
          $scope.PhotoService = PhotoService;
          $scope.showSlider = function () {
            PhotoService.setCurrentPhoto($scope.photo);
            PhotoService.setShownSlider(true);
          };
        }
      }
    });

  angular.module('photo')
    .directive('photoSlider', function (PhotoService) {
      return {
        restrict: 'E',
        scope: {
          name: '=name',
          image: '=image'
        },
        template: '<div class="photo-slider" ng-class="{\'show-mode\': PhotoService.isShownSlider()}" esc-key="PhotoService.setShownSlider(false)" left-key="PhotoService.showPrevious()" right-key="PhotoService.showNext()">' +
        '<div class="slider-buttons" layout="row">' +
        '<label class="photo-slider-previous" flex="50" ng-click="PhotoService.showPrevious()"></label>' +
        '<label class="photo-slider-next" flex="50" ng-click="PhotoService.showNext()"></label>' +
        '</div>' +
        '<div class="photo-slider-content" layout="row">' +
        '<img class="photo" ng-src="{{PhotoService.getCurrentPhotoSrc()}}" flex="100">' +
        '</div>' +
        '</div>',
        link: function ($scope) {
          $scope.PhotoService = PhotoService;

        }
      }
    });

  angular.module('photo')
    .directive('escKey', function () {
      return function ($scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if (event.which === 27) {
            $scope.$apply(function () {
              $scope.$eval(attrs.escKey);
            });

            event.preventDefault();
          }
        });
      };
    });

  angular.module('photo')
    .directive('leftKey', function () {
      return function ($scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if (event.which === 37) {
            $scope.$apply(function () {
              $scope.$eval(attrs.leftKey);
            });
            event.preventDefault();
          }
        });
      };
    });

  angular.module('photo')
    .directive('rightKey', function () {
      return function ($scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
          if (event.which === 39) {
            $scope.$apply(function () {
              $scope.$eval(attrs.rightKey);
            });
            event.preventDefault();
          }
        });
      };
    })
})();
