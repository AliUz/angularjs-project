(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('Products', Products)

    Products.$inject = ['Oboe'];

    function Products(Oboe) {
    	var vm = this;
    	vm.products = [];
        vm.displayAd = displayAd;
        vm.isDone = false;
        vm.sortParam = 'id';
        vm.limitParam = 20;
        vm.skipParam = 0;
        vm.loadProducts = loadProducts;
        vm.sort = sort;
        vm.productsPerPage = productsPerPage;
        vm.getProducts = getProducts;

        var loading = false;
        var patternStr = '{id size price face date}';
        var cached = [];
        var count = 0;
        var idleFlag = false;
        
        function displayAd (index) {
            if (index % 20 === 0) {
                return true;
            }
            return false;
        }

        function loadProducts () {
            if (!vm.isDone && !loading) {
                loading = true;
                var dataObj = {
                    pattern: patternStr, 
                    start: start, 
                    done: done,
                    url: '/api/products?limit=' + vm.limitParam + '&skip=' + vm.skipParam + '&sort=' + vm.sortParam };
                Oboe(dataObj).then(finished, error, record);
                vm.skipParam += vm.limitParam;
            }
        }

        function start (stream) {
            // the stream starts. create a reference
            // console.log('stream started');
        }

        function done () {
                     
            // console.log('stream is done');
        }

        function finished() {

        }

        function error (error) {
            console.log('Stream error: ' + error);
        }

        function record (record) {
            console.log('triggered');

            if (vm.products.length > 0 && record.face === vm.products[0].face) {
                console.log('products finished, cached length is:' + cached.length)
                vm.isDone = true;
                idleFlag = false;
            }
            if (!vm.isDone) {
                cached.push(record);
            }
            if (cached.length % vm.limitParam === 0) {
                loading = false;
                if (!idleFlag) {
                    emptyCache();
                    idleFlag = true;
                    loadProducts();
                }
            }
            if (vm.isDone && cached.length < vm.limitParam) {
                emptyCache();
            }
        }

        function sort(sortParam) {
            vm.sortParam = sortParam;
            vm.products = [];
            cached = [];
            vm.skipParam = 0;
            vm.isDone = false;
            getProducts();
        }

        function productsPerPage(limitParam) {
            vm.limitParam = limitParam;
            vm.products = [];
            cached = [];
            vm.skipParam = 0;
            vm.isDone = false;
            getProducts();
        }

        function getProducts() {
            if (vm.isDone || idleFlag) {
                emptyCache();
                loadProducts();
            }
            else {
               idleFlag = false;
               loadProducts();
            }
        }

        function emptyCache () {
            var chunk = cached.slice(0,vm.limitParam);
            vm.products = vm.products.concat(chunk);
            cached.splice(0,vm.limitParam);
        }

        function getRemainingProducts() {
            vm.products = vm.products.concat(cached);
        }

        // load initial batch of products
        getProducts();
    }
})();