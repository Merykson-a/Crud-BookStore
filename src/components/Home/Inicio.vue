<template>
    <div id="margem">
        <cards-dados></cards-dados>
        <div class="p-grid">
            <div class="p-col">
                <statistic-pie></statistic-pie> 
            </div>
            <div class="p-col">
                <ultimos-alugueis></ultimos-alugueis>
            </div>
        </div>
    </div>
</template>
<script>
import StatisticPie from './graphic/StatisticPie.vue'
import CardsDados from './cardsTotal/Cards.vue'
import UltimosAlugueis from './ultimosAlugueis/painelAlugueis.vue'

export default {

    components: {
        StatisticPie,
        CardsDados,
        UltimosAlugueis
    }
}
</script>
<style>
#margem{
    margin-left: 2%;
    margin-right: 2%
}
.p-mb-2#dashboard{
    margin: 20px;
}   
.p-card-body{
    margin-top: 3%;
    background: #5c5c5c1e;
}
</style>
