var app = new Vue({
    el: "#root",
    data: {
        searchedFilms : [],
        searchedSeries: [],
        search: "",
        imgStartPath: "https://image.tmdb.org/t/p/w342"
    },
    

    methods: {
        searchBy(){
            if (this.search.length) {
                //CHIAMATA per i film con titolo che corrispondono al campo di ricerca
                axios
                    .get(`https://api.themoviedb.org/3/search/movie?api_key=e05661b069389f9a2788162b272f96a8&query=${this.search}&language=it-IT`)
                    .then((response) => {
                        let ris1 = response.data.results;
                        console.log(ris1);
                        this.searchedFilms = this.filterByLang(ris1);
                    })
                //CHIAMATA per le serie con titolo che corrisponde al campo di ricerca
                axios
                    .get(`https://api.themoviedb.org/3/search/tv?api_key=e05661b069389f9a2788162b272f96a8&query=${this.search}&language=it-IT`)
                    .then((response) => {
                        let ris2 = response.data.results;
                        this.searchedSeries = this.filterByLang(ris2);
                    })
                
                    
            }
            this.search = "";
        },

        //per evitare film e serie tv da tutto il mondo 
        filterByLang(array){
            return array.filter((obj) => obj.original_language == "en" && obj.poster_path != null)
        }
    },
    mounted(){
        
    }
})