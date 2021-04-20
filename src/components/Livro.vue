<template>
    <div>
        <Panel header="Livros" id="alterarTop">
            <Toast />
            <div class="card">
                <DataTable
                    ref="dt"
                    :value="livros"
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
                    <Column field="nome" header="Nome" sortable></Column>
                    <Column field="editora.nome" header="Editora" sortable></Column>
                    <Column field="autor" header="Autor" sortable></Column>
                    <Column field="quantidade" header="Total de livros" sortable></Column>
                    <Column field="lancamento" header="Lançamento" sortable></Column>
                    <!-- <Column field="lancamento" header="Lançamento">
                <template #body="slotProps">
                    <span :class="'customer-badge status-' + slotProps.data.lancamento">{{mudarFormato(slotProps.data.lancamento)}}</span>
                </template>
            </Column> -->
                    <Column field="alugados" header="Em aluguel" sortable></Column>
                    <Column field="totalAlugado" header="Total de aluguéis" sortable></Column>
                    <Column header="Ações">
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-success p-mr-2"
                                @click="editar(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-warning"
                                @click="mensagemExcluir(slotProps.data)"
                            />
                        </template>
                        <ConfirmPopup></ConfirmPopup>
                    </Column>
                    <template #footer> {{ livros ? livros.length : 0 }} livros cadastrados encontrados. </template>
                </DataTable>
                <Dialog
                    id="margem"
                    :contentStyle="{ overflow: 'visible' }"
                    :header="livro.id === null ? 'Adicionar Livro' : 'Editar Livro'"
                    :visible.sync="displayModal"
                    :style="{ width: '40vw' }"
                    :modal="true"
                >
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '100%' }">
                            <span class="p-float-label">
                                <InputText
                                    id="nome"
                                    type="text"
                                    v-model="livro.nome"
                                    :style="{ width: '100%' }"
                                    :class="{ 'p-invalid': submittedN }"
                                />
                                <label for="nome">Nome</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'nome'">
                                    - {{ erro.defaultMessage }} {{ naoOkN() }}<br
                                /></small>
                            </span>
                        </div>
                    </div>
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <Dropdown
                                    :style="{ width: '100%' }"
                                    v-model="livro.editora.id"
                                    :options="editoras"
                                    optionLabel="nome"
                                    optionValue="id"
                                    scrollHeight="300px"
                                    :showClear="true"
                                    :class="{ 'p-invalid': submittedE }"
                                />
                                <label>Editora</label>
                            </span>
                            <span class="p-invalid">
                                <small v-if="submittedE"> - Esse campo não pode ser vazio<br /></small>
                            </span>
                            <span class="p-invalid">
                                <small v-if="editoras == null || editoras == ''">
                                    - Não há editoras cadastradas<br
                                /></small>
                            </span>
                        </div>
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <InputText
                                    :style="{ width: '100%' }"
                                    id="autor"
                                    type="text"
                                    v-model="livro.autor"
                                    :class="{ 'p-invalid': submittedA }"
                                />
                                <label for="autor">Autor</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'autor'">
                                    - {{ erro.defaultMessage }} {{ naoOkA() }}<br
                                /></small>
                            </span>
                        </div>
                    </div>
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '100%' }">
                            <span class="p-float-label">
                                <Calendar
                                    dateFormat="dd/mm/yy"
                                    :showIcon="true"
                                    :style="{ width: '100%' }"
                                    :showButtonBar="true"
                                    :locale="br"
                                    id="navigators"
                                    v-model="livro.lancamento"
                                    :monthNavigator="true"
                                    :yearNavigator="true"
                                    yearRange="1900:2021"
                                    :class="{ 'p-invalid': submittedL }"
                                />
                                <label for="calendario">Lançamento</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'lancamento'">
                                    - {{ erro.defaultMessage }} {{ naoOkL() }}<br
                                /></small>
                            </span>
                        </div>
                        <div class="p-mb-2">
                            <span class="p-float-label">
                                <InputNumber
                                    :min="0"
                                    mode="decimal"
                                    v-model="livro.quantidade"
                                    showButtons
                                    :class="{ 'p-invalid': submittedQ }"
                                />
                                <label for="">Qtd</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'quantidade'">
                                    - {{ erro.defaultMessage }} {{ naoOkQ() }}<br
                                /></small>
                            </span>
                            <span class="p-invalid">
                                <small v-if="erroLivro != null"> - {{ erroLivro }} {{ naoOkQ() }}<br /></small>
                            </span>
                        </div>
                        <div class="p-mb-2">
                            <Button
                                label="Salvar"
                                class="p-button-success"
                                @click="livro.id != null ? editarConfirmar() : salvar()"
                            />
                        </div>
                        <div class="p-mb-2">
                            <Button label="Cancelar" class="p-button-danger" @click="fecharModal()" />
                        </div>
                    </div>
                </Dialog>

                <Dialog :visible.sync="deleteLivroModal" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem;" />&nbsp;
                        <span v-if="livro"
                            >Você tem certeza que deseja excluir o livro <b>{{ livro.nome }}</b
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
import LivroService from '../service/LivroService';
import EditoraService from '../service/EditoraService';
import moment from 'moment';
moment.locale('pt-br');

export default {
    name: 'Livro',
    data() {
        return {
            br: {
                firstDayOfWeek: 0,
                dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                dayNamesMin: ['D', 'S', 'T', 'Q', 'Q ', 'S ', ' S'],
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
                dateFormat: 'dd/mm/yy',
                weekHeader: 'Wk'
            },
            erroLivro: null,
            erros: null,
            contador: null,
            qntdDados: null,
            rows: 5,
            editoras: null,
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
            livros: null,
            livro: {
                id: null,
                nome: '',
                autor: '',
                quantidade: '',
                lancamento: '',
                alugados: '',
                editora: {
                    id: ''
                }
            },
            filters: {},
            displayModal: false,
            deleteLivroModal: false,
            submittedN: false,
            submittedE: false,
            submittedA: false,
            submittedL: false,
            submittedQ: false
        };
    },
    livroService: null,
    editoraService: null,
    created() {
        this.livroService = new LivroService();
        this.editoraService = new EditoraService();
    },
    mounted() {
        this.getAll();
    },
    methods: {
        mudarFormato(data) {
            return moment(data).format('DD/MM/YYYY');
        },
        naoOkN() {
            this.submittedN = true;
        },
        naoOkE() {
            this.submittedE = true;
        },
        naoOkA() {
            this.submittedA = true;
        },
        naoOkL() {
            this.submittedL = true;
        },
        naoOkQ() {
            this.submittedQ = true;
        },
        zerarSubmitt() {
            (this.erroLivro = null), (this.erros = null), (this.submittedN = false);
            this.submittedE = false;
            this.submittedA = false;
            this.submittedL = false;
            this.submittedQ = false;
        },
        mostrarEditora() {
            this.editoraService.getAll().then(data => {
                this.editoras = data.data;
            });
        },
        zerarTudo() {
            this.zerarSubmitt();
            this.livro = {
                id: null,
                nome: '',
                autor: '',
                quantidade: 0,
                alugados: '',
                editora: {
                    id: ''
                }
            };
        },
        showSaveModal() {
            this.displayModal = true;
            this.mostrarEditora();
            this.zerarTudo();
        },
        getAll() {
            this.livroService.getAll().then(data => {
                // Loop para alterar formato da data
                // this.qntdDados = data.data.length;
                // this.contador = 0;
                // while(this.contador < this.qntdDados){
                //     data.data[this.contador].lancamento = moment(data.data[this.contador].lancamento).format('DD/MM/YYYY')
                //     this.contador += 1;
                // }
                this.livros = data.data;
            });
        },
        limpar() {
            this.filters = {};
        },
        salvar() {
            if (this.livro.lancamento != '' && this.livro.lancamento != null) {
                this.livro.lancamento = moment(this.livro.lancamento, 'DD/MM/YYYY').format('DD/MM/YYYY');
            }
            this.livroService
                .salvar(this.livro)
                .then(data => {
                    if (data.status == 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao salvar!',
                            detail: 'Livro ' + this.livro.nome + ' salvo com sucesso!',
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao salvar!',
                            detail: 'Não foi possível salvar esse livro',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    this.zerarSubmitt();
                    if (this.livro.editora.id == '' || this.livro.editora.id == null) {
                        this.submittedE = true;
                    }
                    this.erros = error.response.data.errors;
                    console.log(this.erros);
                });
        },
        fecharModal() {
            this.displayModal = false;
            this.getAll();
        },
        editar(livro) {
            this.zerarSubmitt();
            this.mostrarEditora();
            this.displayModal = true;
            this.livro = { ...livro };
        },
        editarConfirmar() {
            this.livro.lancamento = moment(this.livro.lancamento, 'DD/MM/YYYY').format('DD/MM/YYYY');
            this.livroService
                .atualizar(this.livro)
                .then(data => {
                    if (data.status === 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao editar!',
                            detail: 'Livro ' + this.livro.nome + ' editado com sucesso!',
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
                    if (this.livro.editora.id == '' || this.livro.editora.id == null) {
                        this.submittedE = true;
                    }
                    this.erros = error.response.data.errors;
                    if (this.erros == null || this.erros == '') {
                        this.erroLivro = error.response.data;
                    }
                    console.log(this.erroLivro);
                });
        },
        mensagemExcluir(livro) {
            this.deleteLivroModal = true;
            this.livro = livro;
        },
        excluir() {
            this.livroService
                .apagar(this.livro)
                .then(data => {
                    if (data.status === 200) {
                        this.deleteLivroModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao apagar!',
                            detail: 'Livro ' + this.livro.nome + ' apagado com sucesso!',
                            life: 3000
                        });
                    } else {
                        console.log('oi');
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao apagar!',
                            detail: 'Não foi possível excluir!',
                            life: 3000
                        });
                    }
                })
                .catch(() => {
                    this.deleteLivroModal = false;
                    this.getAll();
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro ao apagar!',
                        detail: 'Não foi possível excluir, pois esse livro possui aluguel(is)!',
                        life: 3000
                    });
                });
        },
        fecharModalDelete() {
            this.deleteLivroModal = false;
        }
    }
};
</script>
<style>
</style>