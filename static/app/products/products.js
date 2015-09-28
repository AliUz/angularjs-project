(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('Products', Products)

    /* @ngInject */

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
        vm.getThumbnail = getThumbnail;

        var loading = false;
        var patternStr = '{id size price face date}';
        var cached = [];
        var count = 0;
        var isFirst = true;
        var sorting = false;
        var arr = [];
        
        function displayAd (index) {
            return (index % 20 === 0);
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
            // console.log('Stream started');
        }

        function done () {
            // console.log('Stream is done');
        }

        function finished() {

        }

        function error (error) {
            console.log('Stream error: ' + error);
        }

        function record (record) {

            if (vm.products.length > 0 && record.face === vm.products[0].face) {
                vm.isDone = true;
            }
            if (!vm.isDone) {
                cached.push(record);
            }
            if (cached.length % vm.limitParam === 0) {
                loading = false;
                if (isFirst) {
                    emptyCache();
                    isFirst = false;
                }
                if (count < 2) {
                    count++;
                    loadProducts();
                }
                else {
                    count = 0;
                }
            }
        }

        function sort(sortParam) {
            vm.sortParam = sortParam;
            sorting = true;
            resetParams();
            getProducts();
        }

        function productsPerPage(limitParam) {
            vm.limitParam = limitParam;
            resetParams();
            getProducts();
        }

        function getProducts() {
            emptyCache();
            loadProducts();
        }

        function getThumbnail(index) {
            var adIndex = index % 16;
            return '/ad/?r=' + arr[adIndex];
        }

        function emptyCache () {
            if (sorting) {
                sorting = false;
            }
            else {
                var chunk = cached.slice(0,vm.limitParam);
                vm.products = vm.products.concat(chunk);
                cached.splice(0,vm.limitParam);
            }
        }

        function resetParams() {
            vm.products = [];
            cached = [];
            vm.skipParam = 0;
            vm.isDone = false;
            loading = false;
            isFirst = true;
        }

        function createAndShuffleArray() {
            for (var i = 0; i <= 16; i++) {
                arr[i] = i;
            }
            arr = shuffle(arr);
            console.log(arr);
        }

        // Fisher-Yates shuffle algorithm
        function shuffle(array) {
            var counter = array.length, temp, index;

            // While there are elements in the array
            while (counter > 0) {
                // Pick a random index
                index = Math.floor(Math.random() * counter);

                // Decrease counter by 1
                counter--;

                // And swap the last element with it
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }

        // load initial batch of products
        getProducts();
        // create an array containing all numbers from 0 through 16 and do a random shuffle 
        createAndShuffleArray();
    }
})();