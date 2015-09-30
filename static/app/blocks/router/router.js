(function() {
    'use strict';

    angular
        .module('app.router')
        .provider('routeHelper', routeHelperProvider);

    /* @ngInject */

    function routeHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {

        this.$get = RouterHelper;

        $locationProvider.html5Mode(true);

        /* @ngInject */

        function RouterHelper($rootScope, $state) {
            var hasOtherwise = false;

            var service = {
                configureStates: configureStates,
                getStates: getStates
            };

            handleRoutingErrors();

            return service;

            function configureStates(states, otherwisePath) {
                states.forEach(function(state) {
                    $stateProvider.state(state.state, state.config);
                });
                if (otherwisePath && !hasOtherwise) {
                    hasOtherwise = true;
                    $urlRouterProvider.otherwise(otherwisePath);
                }
            }

            function getStates() { return $state.get(); }

            function handleRoutingErrors() {
                $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams) {
                    e.preventDevault();
                    console.log('Generic state change error: ' + error.message);
                    $state.go('products', null, {notify: false});
                });
            }
        }
    }
})();
