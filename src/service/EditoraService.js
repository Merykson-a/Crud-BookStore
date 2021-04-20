import axios from 'axios';

export default class EditoraService {
    // url = 'http://localhost:8080/api/';
    url = 'http://localhost:8080/api/';
    // url = 'https://livraria-wda-api-rest.herokuapp.com/api/';

    getAll() {
        return axios.get(this.url + 'editora');
    }
    salvar(editora) {
        return axios.post(this.url + 'editora', editora);
    }
    apagar(editora) {
        return axios.delete(this.url + 'editora', {
            data: editora
        });
    }
    atualizar(editora) {
        return axios.put(this.url + 'editora', editora);
    }
}
