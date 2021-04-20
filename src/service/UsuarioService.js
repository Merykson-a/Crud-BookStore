import axios from 'axios';

export default class UsuarioService {
    url = 'https://livraria-wda-api-rest.herokuapp.com/api/';

    getAll() {
        return axios.get(this.url + 'usuario');
    }
    salvar(usuario) {
        return axios.post(this.url + 'usuario', usuario);
    }
    apagar(usuario) {
        return axios.delete(this.url + 'usuario', {
            data: usuario
        });
    }
    atualizar(usuario) {
        return axios.put(this.url + 'usuario', usuario);
    }
}
