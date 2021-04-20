<template>
    <OrderList v-model="alugueis" dataKey="id" listStyle="height: 300px;">
        <template #header>
            Últimos 4 aluguéis
        </template>
        <template #item="dados">
            <div class="p-caritem">
                <div class="p-grid">
                    <span id="modif"
                        ><span
                            id="status"
                            :class="
                                dados.item.status == 'EM_ANDAMENTO'
                                    ? 'em-andamento'
                                    : dados.item.status == 'ENTREGUE_PRAZO'
                                    ? 'entregue-prazo'
                                    : 'entregue-atrasado'
                            "
                            v-tooltip.top="
                                dados.item.status == 'EM_ANDAMENTO'
                                    ? 'Em andamento'
                                    : dados.item.status == 'ENTREGUE_PRAZO'
                                    ? 'Livro entregue no prazo'
                                    : 'Livro entregue com atraso'
                            "
                        ></span
                    ></span>
                    <div class="p-col">
                        <div class="p-grid">
                            <div class="p-col p-text-left">
                                <span class="p-text-italic p-text-bold">Nome do livro: </span
                                ><span>{{ dados.item.livro.nome }}</span>
                            </div>

                            <div class="p-col p-text-right">
                                <span class="p-text-italic p-text-bold">Nome do usuário: </span
                                ><span>{{ dados.item.usuario.nome }}</span>
                            </div>
                        </div>
                        <div class="p-grid">
                            <div class="p-col p-text-left">
                                <span class="p-text-italic p-text-bold">Aluguel: </span
                                ><span>{{ dados.item.dataAluguel }}</span>
                            </div>
                            <div class="p-col p-text-right">
                                <span class="p-text-italic p-text-bold">Previsão: </span
                                ><span>{{ dados.item.prevDataDevolucao }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </OrderList>
</template>
<script>
import EstatisticaService from '../../../service/EstatisticaService';
export default {
    data() {
        return {
            alugueis: null
        };
    },
    estatisticaService: null,
    created() {
        this.estatisticaService = new EstatisticaService();
    },
    mounted() {
        this.getUltimosAlugueis();
    },
    methods: {
        getUltimosAlugueis() {
            this.estatisticaService.getUltimosAlugueis().then(data => {
                this.alugueis = data.data;
            });
        }
    }
};
</script>
<style>
#modif {
    margin: 5% 1% 1% 1%;
}
</style>
