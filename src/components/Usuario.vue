<template>
    <div>
        <Panel header="Usuários" id="alterarTop">
            <Toast />
            <div class="card">
                <DataTable
                    ref="dt"
                    :value="usuarios"
                    :paginator="true"
                    :rows="rows"
                    dataKey="id"
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
                    <Column field="endereco" header="Endereço" sortable></Column>
                    <Column field="cidade" header="Cidade" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
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
                        {{ usuarios ? usuarios.length : 0 }} usuários cadastrados encontrados.
                    </template>
                </DataTable>
                <Dialog
                    id="margem"
                    :header="usuario.id === null ? 'Adicionar Usuário' : 'Editar Usuário'"
                    :visible.sync="displayModal"
                    :modal="true"
                >
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <InputText
                                    :style="{ width: '100%' }"
                                    id="nome"
                                    type="text"
                                    v-model="usuario.nome"
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
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <InputText
                                    :style="{ width: '100%' }"
                                    id="email"
                                    type="email"
                                    v-model="usuario.email"
                                    :class="{ 'p-invalid': submittedEm }"
                                />
                                <label for="email">Email</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'email'">
                                    - {{ erro.defaultMessage }} {{ naoOkEm() }}<br
                                /></small>
                            </span>
                        </div>
                    </div>
                    <div class="p-d-flex" :style="{ width: '100%' }">
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <InputText
                                    :style="{ width: '100%' }"
                                    id="endereco"
                                    type="text"
                                    v-model="usuario.endereco"
                                    :class="{ 'p-invalid': submittedEnd }"
                                />
                                <label for="endereco">Endereço</label>
                            </span>
                            <span class="p-invalid" v-for="erro in erros" :key="erro.codes[0]">
                                <small v-if="erro.field === 'endereco'">
                                    - {{ erro.defaultMessage }} {{ naoOkEnd() }}<br
                                /></small>
                            </span>
                        </div>
                        <div class="p-mb-2" :style="{ width: '50%' }">
                            <span class="p-float-label">
                                <InputText
                                    :style="{ width: '100%' }"
                                    id="cidade"
                                    type="text"
                                    v-model="usuario.cidade"
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

                    <div id="margemtwo" class="p-d-flex">
                        <div class="p-mb-2">
                            <Button
                                label="Salvar"
                                class="p-button-success"
                                :style="{ margin: '2%' }"
                                @click="usuario.id != null ? editarConfirmar() : salvar()"
                            />
                        </div>
                        <div class="p-mb-2">
                            <Button
                                label="Cancelar"
                                class="p-button-danger"
                                :style="{ margin: '2%' }"
                                @click="fecharModal()"
                            />
                        </div>
                    </div>
                </Dialog>

                <Dialog :visible.sync="deleteUsuarioModal" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem;" />&nbsp;
                        <span v-if="usuario"
                            >Você tem certeza que deseja excluir o usuário <b>{{ usuario.nome }}</b
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
export default {
    name: 'Usuario',
    data() {
        return {
            erros: null,
            messages: [],
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
            usuarios: null,
            usuario: {
                id: null,
                nome: '',
                endereco: '',
                cidade: '',
                email: ''
            },

            filters: {},
            displayModal: false,
            deleteUsuarioModal: false,
            submittedN: false,
            submittedEm: false,
            submittedEnd: false,
            submittedC: false
        };
    },
    usuarioService: null,
    created() {
        this.usuarioService = new UsuarioService();
    },
    mounted() {
        this.getAll();
    },
    methods: {
        naoOkN() {
            this.submittedN = true;
        },
        naoOkEm() {
            this.submittedEm = true;
        },
        naoOkEnd() {
            this.submittedEnd = true;
        },
        naoOkC() {
            this.submittedC = true;
        },
        zerarSubmitt() {
            (this.erros = null), (this.submittedN = false);
            this.submittedEm = false;
            this.submittedEnd = false;
            this.submittedC = false;
        },
        zerarTudo() {
            this.zerarSubmitt();
            this.usuario = {
                id: null,
                nome: '',
                endereco: '',
                cidade: '',
                email: ''
            };
        },

        showSaveModal() {
            this.displayModal = true;
            this.zerarTudo();
        },
        getAll() {
            this.usuarioService.getAll().then(data => {
                this.usuarios = data.data;
            });
        },
        limpar() {
            this.filters = {};
        },
        salvar() {
            this.usuarioService
                .salvar(this.usuario)
                .then(data => {
                    if (data.status == 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao salvar!',
                            detail: 'Usuário ' + this.usuario.nome + ' salvo com sucesso!',
                            life: 3000
                        });
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Erro ao salvar!',
                            detail: 'Não foi possível salvar esse usuário',
                            life: 3000
                        });
                    }
                })
                .catch(error => {
                    this.zerarSubmitt();
                    this.erros = error.response.data.errors;
                });
        },
        fecharModal() {
            this.displayModal = false;
            this.getAll();
        },
        editar(usuario) {
            this.zerarSubmitt();
            this.displayModal = true;
            this.usuario = usuario;
        },
        excluir() {
            this.usuarioService
                .apagar(this.usuario)
                .then(data => {
                    if (data.status === 200) {
                        this.deleteUsuarioModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao apagar!',
                            detail: 'Usuário ' + this.usuario.nome + ' apagado com sucesso!',
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
                })
                .catch(() => {
                    this.deleteUsuarioModal = false;
                    this.getAll();
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Erro ao apagar!',
                        detail: 'Não foi possível excluir, pois esse usuário possui aluguel(is)!',
                        life: 3000
                    });
                });
        },
        mensagemExcluir(usuario) {
            this.deleteUsuarioModal = true;
            this.usuario = usuario;
        },
        editarConfirmar() {
            this.usuarioService
                .atualizar(this.usuario)
                .then(data => {
                    if (data.status === 200) {
                        this.displayModal = false;
                        this.getAll();
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Sucesso ao editar!',
                            detail: 'Usuário ' + this.usuario.nome + ' editado com sucesso!',
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
                    this.erros = error.response.data.errors;
                });
        },
        fecharModalDelete() {
            this.deleteUsuarioModal = false;
        }
    }
};
</script>

<style>
</style>