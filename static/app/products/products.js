(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('Products', Products);

    Products.$inject = ['Oboe'];

    function Products(Oboe) {
    	var vm = this;
    	vm.name = 'Aloha';
    	console.log('hello in products controller');
    }
})();