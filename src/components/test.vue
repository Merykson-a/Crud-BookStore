<template>
    <div class="p-d-flex" :style="{width: '100%'}">
    
             <div class="p-mb-2" id="dashboard">
                <Card>
                    <template #title>
                        Editoras
                    </template>
                    <template #content>
                        Total: {{dados.qtdE}}
                    </template>
                </Card>
             </div>
             <div class="p-mb-2" id="dashboard">
                <Card>
                    <template #title>
                        Livros
                    </template>
                    <template #content>
                        Total: {{dados.qtdL}}
                    </template>
                </Card>
             </div>
             <div class="p-mb-2" id="dashboard">
                <Card>
                    <template #title>
                        Usuários
                    </template>
                    <template #content>
                        Total: {{dados.qtdU}}
                    </template>
                </Card>
             </div>
             <div class="p-mb-2" id="dashboard">
                <Card>
                    <template #title>
                        Aluguéis
                    </template>
                    <template #content>
                        Total: {{dados.qtdA}}
                    </template>
                </Card>
             </div>
        </div>  
</template>