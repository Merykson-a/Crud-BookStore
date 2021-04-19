import axios from 'axios';

export default class EstatisticaService {


        // url = 'http://localhost:8080/api/';
        url = 'https://livraria-wda-api-rest.herokuapp.com/api/';

    getTotalData() {
        return axios.get(this.url + "total");
    }
    getStatisticAluguel(){
        return axios.get(this.url + "aluguel");
    }
    getUltimosAlugueis(){
        return axios.get(this.url + "ultimosDados");
    }
}