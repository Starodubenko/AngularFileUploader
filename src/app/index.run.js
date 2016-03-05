(function() {
  'use strict';

  angular
    .module('angularFileUploader')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
