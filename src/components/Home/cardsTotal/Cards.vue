<template>
    <div class="p-grid">
        <div class="p-col">
            <div>
                <Card>
                    <template #title>
                        Editoras
                    </template>
                    <template #content> Total: {{ dados.qtdE }} </template>
                </Card>
            </div>
        </div>
        <div class="p-col">
            <div>
                <Card>
                    <template #title>
                        Livros
                    </template>
                    <template #content> Total: {{ dados.qtdL }} </template>
                </Card>
            </div>
        </div>
        <div class="p-col">
            <div>
                <Card>
                    <template #title>
                        Usuários
                    </template>
                    <template #content> Total: {{ dados.qtdU }} </template>
                </Card>
            </div>
        </div>
        <div class="p-col">
            <div>
                <Card>
                    <template #title>
                        Aluguéis
                    </template>
                    <template #content> Total: {{ dados.qtdA }} </template>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
import EstatisticaService from '../../../service/EstatisticaService';
export default {
    data() {
        return {
            dados: ''
        };
    },
    estatisticaService: null,
    created() {
        this.estatisticaService = new EstatisticaService();
    },
    mounted() {
        this.getTotalData();
    },
    methods: {
        getTotalData() {
            this.estatisticaService.getTotalData().then(data => {
                this.dados = data.data;
            });
        }
    }
};
</script>
<style>
</style>