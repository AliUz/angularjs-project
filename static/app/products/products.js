(function() {
    'use strict';

    angular
        .module('app.products')
        .controller('Products', Products)

    /* @ngInject */

    function Products (Oboe) {
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
        var prefetchSize = 2;
        
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
            console.log('Stream error: ' + JSON.stringify(error));
        }

        function record (record) {
            if (vm.products.length > 0 && record.face === vm.products[0].face) {

                // If we encounter the first face again, then we have looped back to the beginning and we are done.
                vm.isDone = true;
                loading = false;
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

                // While first batch of products is loaded, pre-fetch two more batches taking advantage of idle time.
                if (count < prefetchSize) {
                    count++;
                    loadProducts();
                }
                else {
                    count = 0;
                }
            }
        }

        function sort(sortParam) {

            // Disable sorting while products are loading to prevent cache from emptying early
            if (!loading) {
                vm.sortParam = sortParam;
                // Sort flag so that we don't show prefetched products from previous sort.
                sorting = true;
                resetParams();
                getProducts();
            }
            else {
                console.log('Sort is disabled while products are loading!');
            }
        }

        function productsPerPage(limitParam) {
            vm.limitParam = limitParam;

            // Reset all parameters.
            resetParams();
            getProducts();
        }

        function getProducts() {
            emptyCache();
            loadProducts();
        }

        function getThumbnail(index) {

            /* Ad API only supports up to 16 ads and then loops around, this is not the most optimal solution to get
             * non-consecutive random images although in its current form it will never result in two identical ads to 
             * appear twice in a row.
             */
            var adIndex = index % 16;
            return '/ad/?r=' + arr[adIndex];
        }

        function emptyCache () {
            if (sorting) {

                // Check if we are sorting by another parameter and set flag to false.
                sorting = false;
            }
            else {

                // Get a chunk of size <limitParam> and splice first <limitParam> elements from cache.
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
        }

        // Fisher-Yates shuffle algorithm.
        function shuffle(array) {
            var counter = array.length, temp, index;

            // While there are elements in the array.
            while (counter > 0) {
                // Pick a random index.
                index = Math.floor(Math.random() * counter);

                // Decrease counter by 1.
                counter--;

                // And swap the last element with it.
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }

            return array;
        }

        // Load initial batch of products.
        getProducts();

        // Create an array containing all numbers from 0 through 16 and do a random shuffle.
        createAndShuffleArray();
    }
})();