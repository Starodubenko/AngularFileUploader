(function(){
    angular.module('app.directives.fileUploader', ['ngAnimate', 'ngMaterial', 'monospaced.mousewheel', 'ngFileUpload'])
        .directive('uploaderPanel', function(){
            return{
                restrict: 'E',
                template:
                '<div class="uploader-panel">' +
                '<file-form></file-form>' +
                '<file-list></file-list>' +
                '</div>',
                controller: function () {
                    this.horizontalScroll = function (element) {
                        var deltaY = element.deltaY;
                        element.target.scrollLeft = element.target.scrollLeft + deltaY / 3 * 5;
                        event.preventDefault();
                    };
                }
            }
        });
})();
