<template>
    <Chart type="pie" :data="chartData" :options="options" />
</template>
<script>
import EstatisticaService from '../../../service/EstatisticaService';
export default {
    data() {
        return {
            dados: {
                noPrazo: 0,
                entregueA: 0,
                entregueP: 0
            },
            chartData: null,
            options: {}
        };
    },
    estatisticaService: null,
    created() {
        this.estatisticaService = new EstatisticaService();
    },
    mounted() {
        this.getStatisticAluguel();
    },
    methods: {
        getStatisticAluguel() {
            this.estatisticaService.getStatisticAluguel().then(data => {
                this.dados = data.data;
                if (this.dados.noPrazo == 0 && this.dados.entregueA == 0 && this.dados.entregueP == 0) {
                    this.chartData = {
                        labels: ['Sem aluguéis cadastrados'],
                        datasets: [
                            {
                                data: [1],
                                backgroundColor: ['#42A5F5'],
                                hoverBackgroundColor: ['#64B5F6'],
                                borderWidth: 2
                            }
                        ]
                    };
                } else {
                    this.chartData = {
                        labels: ['Em andamento', 'Devolvido no prazo', 'Devolvido com atraso'],
                        datasets: [
                            {
                                data: [this.dados.noPrazo, this.dados.entregueP, this.dados.entregueA],
                                backgroundColor: ['#42A5F5', '#66BB6A', '#FF0000'],
                                hoverBackgroundColor: ['#64B5F6', '#81C784', '#ff0000db'],
                                borderWidth: 2
                            }
                        ]
                    };
                }
            });
        }
    }
};
</script>
<style>
</style>