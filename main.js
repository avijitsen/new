var count = 0;

function noop() {}

function jsonp(url, opts, fn) {
    if ('function' == typeof opts) {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};

    var prefix = opts.prefix || '__jp';

    // use the callback name that was passed if one was provided.
    // otherwise generate a unique name by incrementing our counter.
    var id = opts.name || (prefix + (count++));

    var param = opts.param || 'callback';
    var timeout = null != opts.timeout ? opts.timeout : 60000;
    var enc = encodeURIComponent;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;


    if (timeout) {
        timer = setTimeout(function() {
            cleanup();
            if (fn) fn(new Error('Timeout'));
        }, timeout);
    }

    function cleanup() {
        if (script.parentNode) script.parentNode.removeChild(script);
        window[id] = noop;
        if (timer) clearTimeout(timer);
    }

    function cancel() {
        if (window[id]) {
            cleanup();
        }
    }

    window[id] = function(data) {
        cleanup();
        if (fn) fn(null, data);
    };

    // add qs component
    url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
    url = url.replace('?&', '?');

    // create script
    script = document.createElement('script');
    script.src = url;
    target.parentNode.insertBefore(script, target);

    return cancel;
}

$(document).ready(function() {
    var watchID = navigator.geolocation.watchPosition(function(position) {
        var location = document.querySelector(".location_name");
        var upozila = document.querySelector(".location_upozila")
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var country = document.querySelector(".country")
        var weather = document.querySelector(".weather")
        var tempo = document.querySelector(".weather_box")
        var celcius = document.querySelector(".calcius")
        var status = document.querySelector(".status")
        var apiKey = '4e944a51bda86d0587e8142e496f527b';
        var locationapikey = 'AIzaSyDT82gfmcqG20_VNOhS49LNSzai_24_Uh4';
        var icon = document.querySelector("#canvas")
        var canvas_box = document.querySelector(".canvas_box")
        var skycons = new window.Skycons({
            color: "white"
        })
        var spinner = document.querySelector(".spinner")


        baseURL = 'https://api.darksky.net/forecast/' + apiKey + "/" + lat + "," + long;
        locationAPI = 'https://maps.googleapis.com/maps/api/geocode' + "/json?latlng=" + lat + "," + long + "&key=" + locationapikey;

        jsonp(baseURL, function(err, data) {
            var showingF;

            console.log(data);

            function farenhite() {
                showingF = true;
                weather.innerHTML = data.currently.temperature.toFixed(2) + "°" + " f";
            }
            farenhite();
            //weather.innerHTML = data.currently.temperature.toFixed(2) + "°" + " f";
            status.innerHTML = data.currently.summary;
            var skyicon = data.currently.icon.toUpperCase().replace(/-/g, '_')
            console.log(skyicon)
            skycons.add(icon, window.Skycons[skyicon])
            skycons.play()

            var avi = data.currently.temperature.toFixed(2);
            tempo.addEventListener("click", function(y) {
                console.log(y);
                if (showingF) {
                    showingF = false
                    var cal = ((avi - 32) * .5556).toFixed(2);
                    weather.innerHTML = cal + "°" + " c";
                } else {
                    farenhite();
                }

            })
            //  var cal = ((avi-32)*.5556).toFixed(2);
            //celcius.innerHTML = cal +"°"+ " c";

            axios.get(locationAPI)
                .then(function(x) {
                    console.log(x);
                    location.innerHTML = x.data.results[1].address_components[0].short_name;
                    upozila.innerHTML = x.data.results[1].address_components[1].short_name
                    country.innerHTML = x.data.results[1].address_components[4].long_name
                    spinner.style.display = "none";
                    canvas_box.style.display = "block";
                    tempo.style.display = "block";
                })


        })
    });
});


let obj = {
    name: 'avijit',
    age: 20
}
