import axios from "axios"

const PkmTcgService = axios.create({
    baseURL: "https://api.pokemontcg.io/v2/cards"
});

export default PkmTcgService;