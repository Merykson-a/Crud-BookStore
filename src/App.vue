<template>
    <div id="app">
        <div class="content">
            <Panel classStyle="inicio">
                <TabMenu :model="items" />
            </Panel>
            <router-view />
        </div>
        <footer id="rodape">
            <p class="p-text-bold">&copy;Livraria WDA - By: Merykson Acácio</p>
        </footer>
    </div>
</template>

<script scoped>
export default {
    data() {
        return {
            items: [
                { label: 'Tela Principal', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Editora', icon: 'pi pi-fw pi-pencil', to: '/editora' },
                { label: 'Livro', icon: 'pi pi-fw pi-book', to: '/livro' },
                { label: 'Usuário', icon: 'pi pi-fw pi-user', to: '/usuario' },
                { label: 'Aluguel', icon: 'pi pi-id-card', to: '/aluguel' }
            ]
        };
    }
};
</script>

<style>
html,
body {
    height: 100%;
    margin: 0;
}
#app {
    min-height: 100%;
    position: relative;
}
.content {
    /** Altura do rodapé tem que ser igual a isso aqui e vice-versa **/
    padding-bottom: 50px;
}
footer {
    background: #5c5c5c1e;
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
}
</style>
