<template>
    <div>
        <Panel header="Editora" id="alterarTop">
            <Toast />
            <div class="card">
                <DataTable
                    :rowHover="true"
                    ref="dt"
                    :value="editoras"
                    :paginator="true"
                    :rows="rows"
                    dataKey="id"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    :loading="loading"
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
                    <Column field="cidade" header="Cidade" sortable></Column>
                    <Column field="livros" header="Quantidade de livros" sortable>
                        <template #body="dados">
                            <span>{{ contar(dados.data.livros) }}</span>
                        </template>
                    </Column>
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
                    <template #footer>
                        {{ editoras ? editoras.length : 0 }} editoras cadastrados encontrados.
                    </template>
                </DataTable>
                <Dialog
                    id="margem"
                    :header="editora.id === null ? 'Adicionar Editora' : 'Editar Editora'"
                    :visible.sync="displayModal"
                    :modal="true"
                >
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '100%' }">
                            <span class="p-float-label">
                                <InputText
                                    id="nome"
                                    type="text"
                                    v-model="editora.nome"
                                    required="true"
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
                        <div class="p-mb-2" :style="{ width: '100%' }">
                            <span class="p-float-label">
                                <InputText
                                    id="cidade"
                                    type="text"
                                    v-model="editora.cidade"
                                    :style="{ width: '100%' }"
                                    :class="{ 'p-invalid': submittedC }"
                                />
                                <label for="cidade">Cidade</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'cidade'">
                                    - {{ erro.defaultMessage }} {{ naoOkC() }}<br
                                /></small>
                            </span>
                        </div>
                    </div>
                    <Button
                        label="Salvar"
                        class="p-button-success"
                        @click="editora.id != null ? editarConfirmar() : salvar()"
                    />
                    <Button label="Cancelar" class="p-button-danger" @click="fecharModal()" />
                </Dialog>

                <Dialog :visible.sync="deleteEditoraModal" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem;" />&nbsp;
                        <span v-if="editora"
                            >Você tem certeza que deseja excluir a editora? <b>{{ editora.nome }}</b
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
import EditoraService from '../service/EditoraService';
export default {
    name: 'Editora',
    data() {
        return {
            selectedEditoras: null,
            erros: null,
            rows: 5,
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
            editoras: null,
            editora: {
                id: null,
                nome: '',
                cidade: '',
                livros: null
            },
            submittedN: false,
            submittedC: false,
            filters: {},
            displayModal: false,
            deleteEditoraModal: false,
            loading: false
        };
    },
    editoraService: null,
    created() {
        this.editoraService = new EditoraService();
    },
    mounted() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.editoras = this.getAll(0, this.rows);
        }, 250);
    },
    methods: {
        contar(livros) {
            return livros.length;
        },
        naoOkN() {
            this.submittedN = true;
        },
        naoOkC() {
            this.submittedC = true;
        },
        zerarTudo() {
            (this.erros = null), (this.submittedN = false);
            this.submittedC = false;
            this.editora = {
                nome: '',
                cidade: ''
            };
        },
        showSaveModal() {
            this.displayModal = true;
            this.zerarTudo();
        },
        getAll() {
            this.editoraService.getAll().then(data => {
                this.editoras = data.data;
            });
        },
        limpar() {
            this.filters = {};
        },
        salvar() {
            this.editoraService
                .salvar(this.editora)
                .then(data => {
                    if (data.status == 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao salvar!',
                            detail: 'Editora ' + this.editora.nome + ' salva com sucesso!',
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao salvar!',
                            detail: 'Não foi possível salvar essa editora',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    this.submittedN = false;
                    this.submittedC = false;
                    this.erros = error.response.data.errors;
                });
        },
        fecharModal() {
            this.displayModal = false;
            this.getAll();
            this.zerarTudo();
        },
        editar(editora) {
            this.zerarTudo();
            this.displayModal = true;
            this.editora = { ...editora };
        },
        editarConfirmar() {
            this.editoraService
                .atualizar(this.editora)
                .then(data => {
                    if (data.status === 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao editar!',
                            detail: 'Editora ' + this.editora.nome + ' editada com sucesso!',
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
                    this.submittedN = false;
                    this.submittedC = false;
                    this.erros = error.response.data.errors;
                });
        },
        mensagemExcluir(editora) {
            this.deleteEditoraModal = true;
            this.editora = editora;
        },
        excluir() {
            this.editoraService
                .apagar(this.editora)
                .then(data => {
                    if (data.status === 200) {
                        this.deleteEditoraModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao apagar!',
                            detail: 'Editora ' + this.editora.nome + ' apagada com sucesso!',
                            life: 3000
                        });
                    }
                })
                .catch(() => {
                    this.deleteEditoraModal = false;
                    this.getAll();
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro ao apagar!',
                        detail: 'Não foi possível excluir, pois essa editora possui livros cadastrados!',
                        life: 3000
                    });
                });
        },
        fecharModalDelete() {
            this.deleteEditoraModal = false;
        }
    }
};
</script>
<style>
</style>