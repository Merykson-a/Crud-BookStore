import axios from 'axios';

export default class AluguelService {
    url = 'https://livraria-wda-api-rest.herokuapp.com/api/';

    getAll() {
        return axios.get(this.url + 'aluguel');
    }
    salvar(aluguel) {
        return axios.post(this.url + 'aluguel', aluguel);
    }
    apagar(aluguel) {
        return axios.delete(this.url + 'aluguel', {
            data: aluguel
        });
    }
    atualizar(aluguel) {
        return axios.put(this.url + 'aluguel', aluguel);
    }
    devolver(aluguel) {
        return axios.put(this.url + 'aluguel/devolver', aluguel);
    }
}
