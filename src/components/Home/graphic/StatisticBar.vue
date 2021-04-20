<template>
    <div><Chart type="line" :data="basicData" :options="options" /></div>
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
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                callback: function(value) {
                                    if (value % 1 === 0) {
                                        return value;
                                    }
                                }
                            }
                        }
                    ]
                }
            },
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
                        fill: false,
                        backgroundColor: '#FFA726',
                        borderColor: '#FFA726',
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