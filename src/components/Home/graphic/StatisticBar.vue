<template>
    <div><Chart type="line" :data="basicData" /></div>
</template>

<script>
import LivroService from '../../../service/LivroService';
export default {
    data() {
        return {
            dataLabels: [],
            dataData: [],
            livros: null,
            basicData: null,
            height: 100,
            contador: null
        };
    },
    livroService: null,
    created() {
        this.livroService = new LivroService();
    },
    mounted() {
        this.getAll();
    },
    methods: {
        getAll() {
            this.livroService.getAll().then(data => {
                this.livros = data.data;
                this.gerarDados();
            });
        },
        gerarDados() {
            this.contador = 0;
            while (this.contador < this.livros.length) {
                this.dataLabels.push(
                    this.livros[this.contador].nome + '(' + this.livros[this.contador].editora.nome + ')'
                );
                this.dataData.push(this.livros[this.contador].totalAlugado);
                this.contador += 1;
            }
            this.gerarGrafico();
        },
        gerarGrafico() {
            this.basicData = {
                labels: this.dataLabels,
                datasets: [
                    {
                        label: 'Quantidade de aluguel por livro',
                        backgroundColor: '#42A5F5',
                        data: this.dataData
                    }
                ]
            };
        }
    }
};
</script>

<style>
</style>