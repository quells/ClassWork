var OMDB = function(apikey) {
    this.url = "http://www.omdbapi.com/?apikey=" + apikey;

    this.withID = function(i) {
        this.url += "&i=" + i;
        for (p in this) {
            if (p !== "url" && p !== "get" && p !== "withFullPlot") {
                delete this[p];
            }
        }
        return this;
    }

    this.get = function(callback) {
        $.ajax({
            url: this.url,
            method: "GET"
        }).done(callback);
    };

    this.search = function(s) {
        s = s.split(" ").join("+");
        this.url += "&s=" + s;
        delete this.search;
        delete this.title;
        return this;
    }

    this.title = function(t) {
        t = t.split(" ").join("+");
        this.url += "&t=" + t;
        delete this.title;
        delete this.search;
        return this;
    };

    this.year = function(y) {
        this.url += "&y=" + y;
        delete this.year;
        return this;
    };

    this.onlyMovies = function() {
        this.url += "&type=movie";
        delete this.onlyMovies;
        delete this.onlySeries;
        delete this.onlyEpisode;
        return this;
    };

    this.onlySeries = function() {
        this.url += "&type=series";
        delete this.onlyMovies;
        delete this.onlySeries;
        delete this.onlyEpisode;
        return this;
    };

    this.onlyEpisode = function() {
        this.url += "&type=episode";
        delete this.onlyMovies;
        delete this.onlySeries;
        delete this.onlyEpisode;
        return this;
    };

    this.withFullPlot = function() {
        this.url += "&plot=full";
        delete this.withFullPlot;
        return this;
    }
}
