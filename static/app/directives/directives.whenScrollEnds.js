(function () { 
    'use strict';

    angular
        .module('app.directives')
        .directive('whenScrollEnds', whenScrollEnds);

    function whenScrollEnds () {
        var directive = {
            restrict: "A",
            link: function(scope, element, attrs) {
                var threshold = 200;
                $(window).scroll(checkScroll);
                
                function checkScroll() {
                    if ( $(window).scrollTop() > ($(document).height() - $(window).height() - threshold)) {

                        // Call the loading function.
                        scope.$apply(attrs.whenScrollEnds);
                    }
                }
            }
        };
        return directive;
    }
})();