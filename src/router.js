import Vue from 'vue'
import VueRouter from 'vue-router'
import Livro from './components/Livro.vue'
import Editora from './components/Editora.vue'
import Usuario from './components/Usuario.vue'
import Aluguel from './components/Aluguel.vue'
import Inicio from './components/Home/Inicio.vue'
import Login from './components/Login/Login.vue'
import Registro from './components/Login/Registro.vue'

Vue.use(VueRouter)

const routes = [

    {
        path: '/',
        component: Inicio
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/registro',
        component: Registro
    },
    {
        path: '/livro',
        name: 'livro',
        component: Livro
    },
    {
        path: '/editora',
        name: 'editora',
        component: Editora
    },
    {
        path: '/usuario',
        name: 'usuario',
        component: Usuario
    },
    {
        path: '/aluguel',
        name: 'aluguel',
        component: Aluguel
    }
]

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes
    })

export default router