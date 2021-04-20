<template>
    <div>
        <Panel header="Aluguéis" id="alterarTop">
            <Toast />
            <div class="card">
                <DataTable
                    ref="dt"
                    :value="alugueis"
                    :paginator="true"
                    :rows="rows"
                    :filters="filters"
                    :rowHover="true"
                    responsiveLayout="scroll"
                    :rowsPerPageOptions="[5, 10, 25]"
                >
                    <template #header>
                        <div class="table-header">
                            <div class="p-grid">
                                <div class="p-col" style="text-align: left;">
                                    <Button
                                        label="Novo"
                                        icon="pi pi-plus"
                                        class="p-button-success p-mr-2"
                                        @click="showSaveModal()"
                                    />
                                    <Button
                                        label="Atualizar"
                                        icon="pi pi-fw pi-refresh"
                                        class="p-button-warning"
                                        @click="getAll()"
                                    />
                                </div>
                                <div class="p-col" style="text-align: right;">
                                    <span class="p-input-icon-left">
                                        <i class="pi pi-search" />
                                        <InputText v-model="filters['global']" placeholder="Search..." />
                                    </span>
                                    <Button
                                        label="Limpar"
                                        class="p-button-rounded p-button-secondary"
                                        @click="limpar()"
                                    />
                                </div>
                            </div>
                        </div>
                    </template>
                    <Column field="id" header="Id" sortable></Column>
                    <Column field="usuario.nome" header="Usuário" sortable></Column>
                    <Column field="livro.nome" header="Livro" sortable></Column>
                    <Column field="dataAluguel" header="Aluguel" sortable></Column>
                    <Column field="prevDataDevolucao" header="Previsão" sortable></Column>
                    <Column field="dataDevolucao" header="Devolução " sortable>
                        <template #body="slotProps">
                            <span v-if="slotProps.data.dataDevolucao != null">{{ slotProps.data.dataDevolucao }}</span>
                            <Button
                                label="Devolver"
                                class="p-button-rounded p-button-danger"
                                v-if="slotProps.data.dataDevolucao == null"
                                @click="devolver(slotProps.data)"
                            />
                        </template>
                    </Column>
                    <Column field="status" header="Status" sortable>
                        <template #body="dados">
                            <div
                                id="status"
                                :class="
                                    dados.data.status == 'EM_ANDAMENTO'
                                        ? 'em-andamento'
                                        : dados.data.status == 'ENTREGUE_PRAZO'
                                        ? 'entregue-prazo'
                                        : 'entregue-atrasado'
                                "
                                v-tooltip.top="
                                    dados.data.status == 'EM_ANDAMENTO'
                                        ? 'Em andamento'
                                        : dados.data.status == 'ENTREGUE_PRAZO'
                                        ? 'Livro entregue no prazo'
                                        : 'Livro entregue com atraso'
                                "
                            ></div>
                        </template>
                    </Column>
                    <!-- <Column field="lancamento" header="Lançamento">
                <template #body="slotProps">
                    <span :class="'customer-badge status-' + slotProps.data.lancamento">{{mudarFormato(slotProps.data.lancamento)}}</span>
                </template>
            </Column> -->
                    <Column header="Ações">
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-success p-mr-2"
                                @click="editar(slotProps.data)"
                                v-if="slotProps.data.dataDevolucao == null"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-warning"
                                v-if="slotProps.data.dataDevolucao != null"
                                @click="mensagemExcluir(slotProps.data)"
                            />
                        </template>
                        <ConfirmPopup></ConfirmPopup>
                    </Column>
                    <template #footer>
                        {{ alugueis ? alugueis.length : 0 }} aluguéis cadastrados encontrados.
                    </template>
                </DataTable>
                <Dialog
                    id="margem"
                    :contentStyle="{ overflow: 'visible' }"
                    :header="aluguel.id === null ? 'Fazer aluguel' : !acaoDevolucao ? 'Editar aluguel' : 'Devolver'"
                    :visible.sync="displayModal"
                    :style="{ width: '40vw' }"
                    :modal="true"
                >
                    <div>
                        <div class="p-d-flex" :style="{ width: '100%' }">
                            <div class="p-mb-2" :style="{ width: '50%' }">
                                <span class="p-float-label">
                                    <Dropdown
                                        :style="{ width: '100%' }"
                                        v-model="aluguel.livro.id"
                                        :options="livros"
                                        optionLabel="nome"
                                        optionValue="id"
                                        scrollHeight="300px"
                                        :showClear="acaoDevolucao === true || aluguel.id != null ? false : true"
                                        :disabled="acaoDevolucao === true || aluguel.id != null"
                                    />
                                    <label>Livro</label>
                                </span>
                                <span class="p-invalid">
                                    <small v-if="livros == null || livros == ''">
                                        - Não há livros disponíveis<br
                                    /></small>
                                </span>
                                <span class="p-invalid">
                                    <small v-if="submittedL"> - Esse campo não pode ser vazio<br /></small>
                                </span>
                            </div>
                            <div class="p-mb-2" :style="{ width: '50%' }">
                                <span class="p-float-label">
                                    <Dropdown
                                        :class="{ 'p-invalid': submittedU }"
                                        :style="{ width: '100%' }"
                                        v-model="aluguel.usuario.id"
                                        :options="usuarios"
                                        optionLabel="nome"
                                        optionValue="id"
                                        scrollHeight="300px"
                                        :showClear="acaoDevolucao === true || aluguel.id != null ? false : true"
                                        :disabled="acaoDevolucao === true || aluguel.id != null"
                                    />
                                    <label>Usuário</label>
                                </span>
                                <span class="p-invalid">
                                    <small v-if="usuarios == null || usuarios == ''">
                                        - Não há usuários cadastrados<br
                                    /></small>
                                </span>
                                <span class="p-invalid">
                                    <small v-if="submittedU"> - Esse campo não pode ser vazio<br /></small>
                                </span>
                            </div>
                        </div>
                        <div class="p-d-flex" :style="{ width: '100%' }">
                            <div class="p-mb-2" :style="{ width: '50%' }">
                                <span class="p-float-label">
                                    <Calendar
                                        :style="{ width: '100%' }"
                                        :showButtonBar="true"
                                        :locale="br"
                                        id="navigators"
                                        v-model="aluguel.dataAluguel"
                                        :monthNavigator="true"
                                        :yearNavigator="true"
                                        yearRange="1900:2021"
                                        dateFormat="dd/mm/yy"
                                        :disabled="acaoDevolucao === true"
                                        :class="{ 'p-invalid': submittedA }"
                                    />
                                    <label for="calendario">Data aluguel</label>
                                </span>
                                <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                    <small v-if="erro.field === 'dataAluguel'">
                                        - {{ erro.defaultMessage }} {{ naoOkA() }}<br
                                    /></small>
                                </span>
                            </div>
                            <div class="p-mb-2" :style="{ width: '50%' }" id="prazo">
                                <span class="p-float-label">
                                    <InputText
                                        :style="{ width: '100%' }"
                                        v-model="aluguel.prevDataDevolucao"
                                        disabled
                                        :class="{ 'p-invalid': submittedP }"
                                    />
                                    <label for="calendario">Prazo aluguel:</label>
                                </span>
                                <SelectButton
                                    v-model="qtdDia"
                                    :options="diasDevolucao"
                                    optionLabel="nome"
                                    optionValue="value"
                                    :disabled="acaoDevolucao == true"
                                />
                                <span style="text-align= center" v-if="aluguel.dataAluguel != null" hidden>{{
                                    qtdDia != null ? mostrarPrev(aluguel.dataAluguel, qtdDia) : ''
                                }}</span>
                                <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                    <small v-if="erro.field === 'prevDataDevolucao'">
                                        - {{ erro.defaultMessage }} {{ naoOkP() }}<br
                                    /></small>
                                </span>
                            </div>
                        </div>

                        <div class="p-d-flex" :style="{ width: '100%' }">
                            <div class="p-mb-2" :style="{ width: '63.5%' }" v-if="acaoDevolucao === true">
                                <span class="p-float-label">
                                    <Calendar
                                        :style="{ width: '100%' }"
                                        :showButtonBar="true"
                                        :locale="br"
                                        id="navigators"
                                        v-model="aluguel.dataDevolucao"
                                        :monthNavigator="true"
                                        :yearNavigator="true"
                                        yearRange="1900:2021"
                                        dateFormat="dd/mm/yy"
                                        :class="{ 'p-invalid': submittedD }"
                                    />
                                    <label for="calendario">Data aluguel</label>
                                </span>
                                <span class="p-invalid">
                                    <small v-if="erroDev != null"> - {{ erroDev }} {{ naoOkD() }}<br /></small>
                                </span>
                            </div>
                            <div class="p-mb-2" :style="acaoDevolucao === true ? '' : 'margin-top: -10%'">
                                <Button
                                    label="Salvar"
                                    class="p-button-success"
                                    @click="
                                        aluguel.id != null
                                            ? !acaoDevolucao
                                                ? editarConfirmar()
                                                : devolverConfirm()
                                            : salvar()
                                    "
                                />
                                <Button label="Cancelar" class="p-button-danger" @click="fecharModal()" />
                            </div>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    :visible.sync="deleteAluguelModal"
                    :style="{ width: '450px' }"
                    header="Confirmar  "
                    :modal="true"
                >
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem;" />&nbsp;
                        <span v-if="aluguel"
                            >Você tem certeza que deseja o aluguel do livro <b>{{ aluguel.livro.nome }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" class="p-button-text" @click="fecharModalDelete()" />
                        <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="excluir()" />
                    </template>
                </Dialog>
            </div>
        </Panel>
    </div>
</template>




<script>
import UsuarioService from '../service/UsuarioService';
import LivroService from '../service/LivroService';
import AluguelService from '../service/AluguelService';
import moment from 'moment';

export default {
    name: 'Aluguel',
    data() {
        return {
            erroDev: null,
            erros: null,
            acaoDevolucao: false,
            br: {
                firstDayOfWeek: 0,
                dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                dayNamesMin: ['Do', 'Se', 'T', 'Qa', 'Qi', 'Sx', 'Sb'],
                monthNames: [
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro'
                ],
                monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                today: 'Hoje',
                clear: 'Limpar',
                dateFormat: 'mm/dd/yy',
                weekHeader: 'Wk'
            },
            diasDevolucao: [
                { nome: '7 Dias', value: 7 },
                { nome: '14 Dias', value: 14 },
                { nome: '21 Dias', value: 21 }
            ],
            qtdDia: null,
            contador: null,
            qntdDados: null,
            contadortwo: null,
            rows: 5,
            livros: null,
            usuarios: null,
            numeros: [
                {
                    opcao: 5
                },
                {
                    opcao: 10
                },
                {
                    opcao: 15
                }
            ],
            alugueis: null,
            aluguel: {
                id: null,
                dataAluguel: '',
                dataDevolucao: null,
                prevDataDevolucao: '',
                usuario: {
                    id: null
                },
                livro: {
                    id: null
                },
                status: 0
            },
            filters: {},
            displayModal: false,
            deleteAluguelModal: false,
            submittedL: false,
            submittedU: false,
            submittedA: false,
            submittedP: false,
            submittedD: false
        };
    },
    aluguelService: null,
    livroService: null,
    usuarioService: null,

    created() {
        this.livroService = new LivroService();
        this.usuarioService = new UsuarioService();
        this.aluguelService = new AluguelService();
    },
    mounted() {
        this.getAll();
    },
    methods: {
        naoOkD() {
            this.submittedD = true;
        },
        naoOkA() {
            this.submittedA = true;
        },
        naoOkP() {
            this.submittedP = true;
        },
        zerarSubmitt() {
            (this.erros = null),
                (this.submittedL = false),
                (this.submittedU = false),
                (this.submittedA = false),
                (this.submittedP = false),
                (this.submittedD = false);
        },
        mostrarPrev(dats, qtd) {
            if (this.deleteAluguelModal != true) {
                this.aluguel.prevDataDevolucao = moment(dats, 'DD/MM/YYYY')
                    .add(qtd, 'days')
                    .format('DD/MM/YYYY');
            }
        },
        mostrarLivro() {
            this.livroService.getAll().then(data => {
                this.livros = data.data;
            });
        },
        mostrarLivroDisponivel() {
            this.livroService.getAllDisp().then(data => {
                this.livros = data.data;
            });
        },
        mostrarUsuario() {
            this.usuarioService.getAll().then(data => {
                this.usuarios = data.data;
            });
        },
        zerarTudo() {
            (this.erroDev = null), this.zerarSubmitt();
            (this.acaoDevolucao = false),
                (this.qtdDia = null),
                (this.aluguel = {
                    id: null,
                    dataAluguel: '',
                    dataDevolucao: null,
                    prevDataDevolucao: '',
                    usuario: {
                        id: null
                    },
                    livro: {
                        id: null
                    },
                    status: 0
                });
        },
        showSaveModal() {
            this.displayModal = true;
            this.mostrarLivroDisponivel();
            this.mostrarUsuario();
            this.zerarTudo();
        },
        getAll() {
            this.aluguelService.getAll().then(data => {
                this.alugueis = data.data;
            });
        },
        limpar() {
            this.filters = {};
        },
        salvar() {
            if (this.aluguel.dataAluguel != '' && this.aluguel.dataAluguel != null) {
                this.aluguel.dataAluguel = moment(this.aluguel.dataAluguel, 'DD/MM/YYYY').format('DD/MM/YYYY');
            }
            if (this.aluguel.prevDataDevolucao != '' && this.aluguel.prevDataDevolucao != 'Data inválida') {
                this.aluguel.prevDataDevolucao = moment(this.aluguel.dataAluguel, 'DD/MM/YYYY')
                    .add(this.qtdDia, 'day')
                    .format('DD/MM/YYYY');
            } else {
                this.aluguel.prevDataDevolucao = '';
            }
            this.aluguelService
                .salvar(this.aluguel)
                .then(data => {
                    if (data.status == 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao salvar!',
                            detail: 'Aluguel realizado com sucesso!',
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao salvar!',
                            detail: 'Não foi possível realizar esse aluguel',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    this.zerarSubmitt();
                    if (this.aluguel.livro.id == '' || this.aluguel.livro.id == null) {
                        this.submittedL = true;
                    }
                    if (this.aluguel.usuario.id == '' || this.aluguel.usuario.id == null) {
                        this.submittedU = true;
                    }
                    this.erros = error.response.data.errors;
                });
        },
        fecharModal() {
            this.acaoDevolucao = false;
            this.displayModal = false;
            this.getAll();
        },
        editar(aluguel) {
            this.zerarSubmitt();
            this.acaoDevolucao = false;
            this.mostrarLivro();
            this.mostrarUsuario();
            this.displayModal = true;
            this.aluguel = { ...aluguel };
            this.qtdDia = moment(this.aluguel.prevDataDevolucao, 'DD/MM/YYYY').diff(
                moment(this.aluguel.dataAluguel, 'DD/MM/YYYY'),
                'day'
            );
        },
        editarConfirmar() {
            if (
                this.aluguel.dataAluguel != '' &&
                this.aluguel.dataAluguel != null &&
                this.aluguel.dataAluguel != 'Data inválida'
            ) {
                this.aluguel.dataAluguel = moment(this.aluguel.dataAluguel, 'DD/MM/YYYY').format('DD/MM/YYYY');
            } else {
                this.aluguel.dataAluguel = '';
            }
            if (this.aluguel.prevDataDevolucao != '' && this.aluguel.prevDataDevolucao != 'Data inválida') {
                this.aluguel.prevDataDevolucao = moment(this.aluguel.dataAluguel, 'DD/MM/YYYY')
                    .add(this.qtdDia, 'day')
                    .format('DD/MM/YYYY');
                this.aluguel.dataAluguel = moment(this.aluguel.dataAluguel, 'DD/MM/YYYY').format('DD/MM/YYYY');
            } else {
                this.aluguel.prevDataDevolucao = '';
            }
            this.aluguelService
                .atualizar(this.aluguel)
                .then(data => {
                    if (data.status === 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao editar!',
                            detail: 'Aluguel do livro ' + this.aluguel.livro.nome + ' editado com sucesso!',
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao editar!',
                            detail: 'Não foi possível editar!',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    this.zerarSubmitt();
                    if (this.aluguel.livro.id == '' || this.aluguel.livro.id == null) {
                        this.submittedL = true;
                    }
                    if (this.aluguel.usuario.id == '' || this.aluguel.usuario.id == null) {
                        this.submittedU = true;
                    }
                    this.erros = error.response.data.errors;
                });
        },
        mensagemExcluir(aluguel) {
            this.deleteAluguelModal = true;
            this.aluguel = aluguel;
        },
        excluir() {
            this.aluguelService.apagar(this.aluguel).then(data => {
                if (data.status === 200) {
                    this.deleteAluguelModal = false;
                    this.getAll();
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sucesso ao apagar!',
                        detail: 'Aluguel do livro ' + this.aluguel.livro.nome + ' apagado com sucesso!',
                        life: 3000
                    });
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro ao apagar!',
                        detail: 'Não foi possível excluir!',
                        life: 3000
                    });
                }
            });
        },
        fecharModalDelete() {
            this.deleteAluguelModal = false;
        },
        devolver(aluguel) {
            this.zerarTudo();
            this.zerarSubmitt();
            this.acaoDevolucao = true;
            this.mostrarLivro();
            this.mostrarUsuario();
            this.displayModal = true;
            this.aluguel = { ...aluguel };
            this.qtdDia = moment(this.aluguel.prevDataDevolucao, 'DD/MM/YYYY').diff(
                moment(this.aluguel.dataAluguel, 'DD/MM/YYYY'),
                'day'
            );
        },
        devolverConfirm() {
            console.log('executando');
            if (
                this.aluguel.dataDevolucao != '' &&
                this.aluguel.dataDevolucao != 'Data Inválida' &&
                this.aluguel.dataDevolucao != null
            ) {
                this.aluguel.dataDevolucao = moment(this.aluguel.dataDevolucao, 'DD/MM/YYYY').format('DD/MM/YYYY');
            }
            this.aluguelService
                .devolver(this.aluguel)
                .then(data => {
                    if (data.status === 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao devolver!',
                            detail: 'Livro devolvido com sucesso! ' + this.aluguel.livro.nome + ' editado com sucesso!',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    if (error.response.data.status == 500) {
                        this.erroDev = 'A data de devolução não pode ser vazia!';
                    } else {
                        this.erroDev = error.response.data;
                    }
                });
        }
    }
};
</script>
<style>
.p-buttonset .p-button {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
</style>