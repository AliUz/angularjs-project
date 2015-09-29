(function() {

    'use strict';

    angular
        .module('app.dataservice', [])
        .service('Oboe', Oboe)
        .factory('OboeStream', OboeStream);
        
        /* @ngInject */

        function Oboe(OboeStream) {
            return function (params) {
                return OboeStream.get(params);
            };
        }

        OboeStream.$inject = ['$q'];

        function OboeStream($q) {
            return {
                get: function (params) {
                    var defer = $q.defer();
                    var stream = oboe(params)
                    .start(function (status, headers) {
                        if (typeof params.start === 'function' && status === 200) {
                            params.start(stream);
                        }
                    })
                    .fail(function (error) {
                        defer.reject(error);
                    })
                    .node(params.pattern || '.', function (node) {
                        defer.notify(node);
                        return oboe.drop;
                    })
                    .done(function () {
                        if (typeof params.done === 'function') {
                            params.done();
                        }
                        return oboe.drop;
                    });
                    return defer.promise;
                }
            };
        }
})();