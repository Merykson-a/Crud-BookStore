import axios from 'axios';

export default class LivroService {

    // https://livraria-api-rest.herokuapp.com/
    url = 'http://localhost:8080/api/';

    getAll() {
        return axios.get(this.url + "livro");
    }
    getAllDisp() {
        return axios.get(this.url + "livro/disponivel");
    }
    salvar(livro){
        return axios.post(this.url + "livro", livro);
    }
    apagar(livro){
        return axios.delete(this.url + "livro", {
            data: livro
        });
    }
    atualizar(livro){
        return axios.put(this.url + "livro", livro);
    }

}