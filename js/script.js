var app = new Vue({
    el: "#root",
    data: {

        /* ----- API RELATED ----- */
        searchedFilms : [],
        searchedSeries: [],

        //Insieme di generi delle serie Tv
        serieGenreSet : new Set(),
    
        //Insieme di generi dei FILM
        filmGenreSet : new Set(),
        

        //filtro select SERIE TV
        selectChoiceSerie : "ALL",
        //filtro select FILM
        selectChoiceFilm: "ALL",

        //field di ricerca film/serie tv
        search: "",
        urlFilm: "https://api.themoviedb.org/3/search/movie?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",
        urlSerie: "https://api.themoviedb.org/3/search/tv?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",
        //prima parte dell'url per le immagini
        imgStartPath: "https://image.tmdb.org/t/p/w342",

        
        /* ----- STYLING RELATED ---- */
        widthGrow : "",
    },
    

    /*
    MORE
    - commentare nel dettaglio il funzionamento della funzione searchBy()
    - rimuovere console.log di debug

    MS4
    - implementare lingua => bandiera
     
    */

    methods: {
        /* ----- FUNZIONI LEGATE ALLA MANIPOLAZIONE DELLE API ----- */
        searchBy(){
            //resetta il contenuto dell insieme dei generi delle serie tv ogni volta che si cerca qualcosa di nuovo
            this.serieGenreSet.clear();
            this.filmGenreSet.clear();
            // per evitare di cercare un genere che non c'è tra i film/ serie quando si effettua una nuova ricerca
            this.selectChoiceSerie = "ALL";
            this.selectChoiceFilm = "ALL";

            if (this.search.length) {
                //CHIAMATA per i film con titolo che corrisponde al campo di ricerca
                axios
                    .get(`${this.urlFilm}${this.search}`)
                    .then((response) => {
                        let ris1 = response.data.results;
                        let castFilmsArray = [];
                        let genreMovieArray = [];
                        this.searchedFilms = this.filterByLang(ris1);
                        this.voteTransform(this.searchedFilms);
                        for (const obj of this.searchedFilms) {
                            //CAST
                            this.getCast(obj.id, "movie")
                                .then(data => {
                                    (data.length) ? obj.credits = data : obj.credits = ["N/A"]
                                    //obj.credits = data
                                    castFilmsArray.push(obj);
                                    this.searchedFilms = castFilmsArray;
                                })
                            //GENERI da aggiungere, come nelle serie
                            this.getGenres(obj.id, "movie")
                                .then(data => {
                                    if (!data.length) {
                                        obj.generi = ["N/A"];
                                    }
                                    else {
                                        let temp = [];
                                        for (const iterator of data) {
                                            temp.push(iterator.name);
                                        }
                                        obj.generi = temp;
                                    }
                                    genreMovieArray.push(obj)
                                    this.searchedFilms = genreMovieArray;
                                })
                        }
                    })

                //CHIAMATA per le serie con titolo che corrisponde al campo di ricerca
                axios
                    .get(`${this.urlSerie}${this.search}`)
                    .then((response) => {
                        let ris2 = response.data.results;
                        let castSerieArray = [];                           
                        let genreSerieArray = [];
                        this.searchedSeries = this.filterByLang(ris2);
                        this.voteTransform(this.searchedSeries);
                        for (const obj of this.searchedSeries) {
                            //CAST
                            this.getCast(obj.id, "tv")
                                .then(data => {
                                    (data.length) ? obj.credits = data : obj.credits = ["N/A"]
                                    castSerieArray.push(obj);
                                    this.searchedSeries = castSerieArray;
                                })
                            //GENERI
                            this.getGenres(obj.id, "tv")
                                .then(data => {
                                    if (!data.length) {
                                        obj.generi = ["N/A"];
                                    }
                                    else{
                                        let temp = [];
                                        for (const iterator of data) {
                                            temp.push(iterator.name);
                                        }
                                        obj.generi = temp;
                                    }
                                    genreSerieArray.push(obj)
                                    this.searchedSeries = genreSerieArray;
                                })
                        }
                        console.log(this.searchedSeries);
                        
                    })
            }
            this.search = "";
        },

        //per estrapolare i generi
        getGenres(id, from){
            let url = `https://api.themoviedb.org/3/${from}/${id}?api_key=e05661b069389f9a2788162b272f96a8`
            return axios
                .get(url)
                .then((response) => {
                    //(from == "movie") ? this.filmGenreSet.add("ALL") : this.serieGenreSet.add("ALL");
                    if (from == "movie") {
                        this.filmGenreSet.add("ALL");
                        for (const obj of response.data.genres) {
                            this.filmGenreSet.add(obj.name);
                        }
                    }
                    else{
                        this.serieGenreSet.add("ALL");
                        for (const obj of response.data.genres) {
                            this.serieGenreSet.add(obj.name);
                        }
                    }
                    return response.data.genres
                })
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
        //filtra in base al valore selezionato
        filterBySelect(objArray, valore) {
            let filteredArray = [];
            if (valore == "ALL") {
                filteredArray = objArray;
            }
            else{
                for (const film of objArray) {
                    if (film.generi.includes(valore)) {
                        filteredArray.push(film);
                    }
                }
            }
            return filteredArray;
        },
        //trasforma il voto
        voteTransform(array){
            return array.forEach((obj) => obj.vote_average = Math.ceil(obj.vote_average / 2));
        },
        //per evitare film e serie tv da tutto il mondo
        filterByLang(array){
            return array.filter((obj) => obj.original_language == "en" && obj.poster_path != null)
        },
        backToHomePage(){
            this.searchedFilms = [];
            this.searchedSeries = [];
        },
        /* ----- FUNZIONI PER LO STYLING ----- */
        searchExpand(){
            (this.widthGrow.length) ? this.widthGrow = "" : this.widthGrow = "width-grow";
        }
    },
    //inutilizzata
    mounted(){
        
    }
})




