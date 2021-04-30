var app = new Vue({
    el: "#root",
    data: {

        // API RELATED
        searchedFilms : [],
        searchedSeries: [],

        currentCast : [],

        search: "",
        urlFilm: "https://api.themoviedb.org/3/search/movie?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",
        urlSerie: "https://api.themoviedb.org/3/search/tv?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",

        imgStartPath: "https://image.tmdb.org/t/p/w342",

        
        //STYLING RELATED
        widthGrow : "",
    },
    

    methods: {

        /* ----- FUNZIONI LEGATE ALLA MANIPOLAZIONE DELLE API ----- */
        searchBy(){
            if (this.search.length) {
                //CHIAMATA per i film con titolo che corrispondono al campo di ricerca
                axios
                    .get(`${this.urlFilm}${this.search}`)
                    .then((response) => {
                        let ris1 = response.data.results;
                        let castFilmsArray = [];
                        this.searchedFilms = this.filterByLang(ris1);
                        this.voteTransform(this.searchedFilms);
                        for (const obj of this.searchedFilms) {
                            this.getCast(obj.id, "movie")
                                .then(data => {
                                    obj.credits = data
                                    castFilmsArray.push(obj);
                                    this.searchedFilms = castFilmsArray;
                                })
                        }
                    })

                //CHIAMATA per le serie con titolo che corrisponde al campo di ricerca
                axios
                    .get(`${this.urlSerie}${this.search}`)
                    .then((response) => {
                        let ris2 = response.data.results;
                        let castSerieArray = []
                        this.searchedSeries = this.filterByLang(ris2);
                        this.voteTransform(this.searchedSeries);
                        for (const obj of this.searchedSeries) {
                            this.getCast(obj.id, "tv")
                                .then(data => {
                                    obj.credits = data
                                    castSerieArray.push(obj);
                                    this.searchedSeries = castSerieArray;
                                })
                        }
                    })
            }
            this.search = "";
        },
        //per estrapolare il cast
        getCast(id, from){
            let url = `https://api.themoviedb.org/3/${from}/${id}/credits?api_key=e05661b069389f9a2788162b272f96a8`
            return axios
                .get(url)
                .then((response) => {
                    let cast = [];
                    let castArray = response.data.cast;
                    castArray = castArray.slice(0, 5);
                    for (const obj of castArray) {
                        cast.push(obj.name);
                    }
                    return cast;
                })
        },

        //trasforma il voto
        voteTransform(array){
            return array.forEach((obj) => obj.vote_average = Math.ceil(obj.vote_average / 2));
        },
        //per evitare film e serie tv da tutto il mondo
        filterByLang(array){
            return array.filter((obj) => obj.original_language == "en" && obj.poster_path != null)
        },
        /* ----- FUNZIONI PER LO STYLING ----- */
        searchExpand(){
            (this.widthGrow.length) ? this.widthGrow = "" : this.widthGrow = "width-grow";
        }
    },
    mounted(){
        
    }
})

//PER IL CAST
//https://api.themoviedb.org/3/movie/181812/credits?api_key=e05661b069389f9a2788162b272f96a8&query=



/* 
let url = `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=e05661b069389f9a2788162b272f96a8`
axios
    .get(url)
    .then((response) => {
        let castArray = response.data.cast;
        let cast = [];
        castArray = castArray.slice(0, 5);
        console.log(castArray)
        for (const obj of castArray) {
            cast.push(obj.name);
        }
        film.credits = cast;
    }) */




