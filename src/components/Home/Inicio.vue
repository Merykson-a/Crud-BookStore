<template>
    <div id="margem">
        <cards-dados></cards-dados>
        <div class="p-grid">
            <div class="p-col" id="legal">
                <Fieldset legend="Gráfico - Resumo situações aluguéis" :toggleable="true">
                    <statistic-pie></statistic-pie>
                </Fieldset>
                <Fieldset legend="Gráfico - Quantidade de aluguel por livro" :toggleable="true" :collapsed="true">
                    <statistic-bar></statistic-bar>
                </Fieldset>
            </div>
            <div class="p-col" style="margin-top: 0.5%;">
                <ultimos-alugueis></ultimos-alugueis>
            </div>
        </div>
        <div class="p-grid">
            <div class="p-col"></div>
        </div>
    </div>
</template>
<script>
import StatisticPie from './graphic/StatisticPie.vue';
import CardsDados from './cardsTotal/Cards.vue';
import UltimosAlugueis from './ultimosAlugueis/painelAlugueis.vue';
import StatisticBar from './graphic/StatisticBar.vue';

export default {
    data() {
        return {
            images: null,
            responsiveOptions: [
                {
                    breakpoint: '1024px',
                    numVisible: 5
                },
                {
                    breakpoint: '768px',
                    numVisible: 3
                },
                {
                    breakpoint: '560px',
                    numVisible: 1
                }
            ]
        };
    },
    components: {
        StatisticPie,
        CardsDados,
        UltimosAlugueis,
        StatisticBar
    }
};
</script>
<style>
#margem {
    margin-left: 2%;
    margin-right: 2%;
}
.p-mb-2#dashboard {
    margin: 20px;
}
.p-card-body {
    margin-top: 3%;
    background: #5c5c5c1e;
}
@media screen and (max-width: 25em) {
    .p-col .p-orderlist.p-component {
        background: black;
        width: 350px;
    }
}
</style>
