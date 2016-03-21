angular.module('starter.controllers', [])

.controller('DashCtrl', function ($scope, $http, $state, $ionicLoading, Results) {

    $scope.takePicture = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL
        });
    };
    $scope.selectPicture = function () {

        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
            destinationType: Camera.DestinationType.DATA_URL
        });
    };

    function onSuccess(imageData) {
        $ionicLoading.show({
            template: 'Loading...'
        });

        //apiKey: Replace this with your own Project Oxford Emotion API key, please do not use my key. I include it here so you can get up and running quickly but you can get your own key for free at https://www.projectoxford.ai/emotion 
        var apiKey = "1dd1f4e23a5743139399788aa30a7153";

        //apiUrl: The base URL for the API. Find out what this is for other APIs via the API documentation
        var apiUrl = "https://api.projectoxford.ai/emotion/v1.0/recognize";

        CallAPI(imageData, apiUrl, apiKey);

        setTimeout(function () {
            $state.go('tab.results', null, { reload: true });
            $ionicLoading.hide();
        }, 5000)
         
        
    }

    function onFail(message) {
        console.log('Failed because: ' + message);
    }

    function CallAPI(file, apiUrl, apiKey) {

        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + file;
        var blob = dataURItoBlob("data:image/jpeg;base64," + file);

        $http({
            method: 'POST',
            url: apiUrl,
            data: blob,
            headers: { 'Content-Type': 'application/octet-stream', "Ocp-Apim-Subscription-Key": apiKey }
        })
        .then(function (response) {
            Results.clear();
            var facedata = response.data;

            facedata.sort(function (a, b) {
                return parseFloat(b.scores.happiness) - parseFloat(a.scores.happiness);
            });
            
            for (var i = 0; i < facedata.length; i++) {

                var img = new Image();
                createfunc(i, img);

            }
            function createfunc(i, img) {
                img.onload = function () {
                    crop(i);
                }
                img.src = document.getElementById("myImage").src;
                function crop(person) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext("2d");
                    var h = facedata[person].faceRectangle.height;
                    var l = facedata[person].faceRectangle.left;
                    var t = facedata[person].faceRectangle.top;
                    var w = facedata[person].faceRectangle.width;
                    // this takes a 105x105px crop from img at x=149/y=4
                    // and copies that crop to the canvas
                    ctx.drawImage(img, l - w, t, w * 3, h * 3, 0, 0, 300, 300);
                    // this uses the canvas as the src for the cropped img element
                    Results.add(canvas.toDataURL(), facedata[person].scores);

                }
            }
        },
        function (response) {
            // failed

        });
    }

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

})

.controller('ResultsCtrl', function ($scope, Results) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.results = Results.all();
    $scope.remove = function (item) {
        Results.remove(item);
    };
})

.controller('ResultsDetailCtrl', function ($scope, $stateParams, Results) {
    $scope.result = Results.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
    $scope.settings = {
        enableFriends: false
    };
});
