import axios from 'axios';

export default class UsuarioService {
    
    // https://livraria-api-rest.herokuapp.com/
    url = 'http://localhost:8080/api/';
    
    getAll() {
        return axios.get(this.url + "usuario");
    }
    salvar(usuario){
        return axios.post(this.url + "usuario", usuario);
    }
    apagar(usuario){
        return axios.delete(this.url + "usuario", {
            data: usuario
        });
    }
    atualizar(usuario){
        return axios.put(this.url + "usuario", usuario);
    }
    
}