(function(){
    angular.module('angularUploaderPanel')
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
})();
