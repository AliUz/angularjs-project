(function () { 
    'use strict';

    angular
        .module('app.directives')
        .directive('whenScrollEnds', whenScrollEnds);

        function whenScrollEnds () {
            return {
                restrict: "A",
                // scope: {whenScrollEnds: '&whenScrollEnds'},
                link: function(scope, element, attrs) {
                    var threshold = 200; // pixels

                    $(window).scroll(checkScroll);
                    // $(window).scroll();  // dummy event in case entire page fits on screen

                    function checkScroll() {
                        if (nearBottomOfPage()) {
                            // call the loading function
                            scope.$apply(attrs.whenScrollEnds);
                        }
                    }

                    function nearBottomOfPage() {
                        return $(window).scrollTop() > ($(document).height() - $(window).height() - threshold);
                    }
                }
            };
        }


        })();