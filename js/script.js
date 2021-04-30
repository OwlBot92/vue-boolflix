var app = new Vue({
    el: "#root",
    data: {

        // API RELATED
        searchedFilms : [],
        searchedSeries: [],
        search: "",
        urlFilm: "https://api.themoviedb.org/3/search/movie?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",
        urlSerie: "https://api.themoviedb.org/3/search/tv?api_key=e05661b069389f9a2788162b272f96a8&language=it-IT&query=",
        imgStartPath: "https://image.tmdb.org/t/p/w342",

        //STYLING RELATED
        widthGrow : "",
    },
    

    methods: {

        /* ----- FUNZIONI LEGATE AL FUNZIONAMENTO E ALLA MANIPOLAZIONE DELLE API ----- */
        searchBy(){
            if (this.search.length) {
                //CHIAMATA per i film con titolo che corrispondono al campo di ricerca
                axios
                    .get(`${this.urlFilm}${this.search}`)
                    .then((response) => {
                        let ris1 = response.data.results;
                        
                        this.searchedFilms = this.filterByLang(ris1);
                        this.voteTransform(this.searchedFilms);
                    })
                //CHIAMATA per le serie con titolo che corrisponde al campo di ricerca
                axios
                    .get(`${this.urlSerie}${this.search}`)
                    .then((response) => {
                        let ris2 = response.data.results;
                        
                        this.searchedSeries = this.filterByLang(ris2);
                        this.voteTransform(this.searchedSeries);
                    })
            }
            this.search = "";
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