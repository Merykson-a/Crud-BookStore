<template>
    <div id="login">
        <Panel header="Login" style="width: 30%; margin-top: 15%">
            <div class="p-grid" style="margin: 5px">
                <div class="p-col">
                    <span class="p-float-label">
                        <InputText style="width: 100%" id="username" type="text" v-model="value2" />
                        <label for="username">Email</label>
                    </span>
                </div>
            </div>
            <div class="p-grid" style="margin: 5px">
                <div class="p-col">
                    <span class="p-float-label">
                        <Password style="width: 100%" v-model="value3" toggleMask :feedback="true"></Password>
                        <label for="username">Senha</label>
                    </span>
                </div>
            </div>
            <div class="p-grid" style="margin: 5px; text-align: center;">
                <div class="p-col">
                    <Button label="Entrar" style="margin-right: 10px;" />
                    <label for="username">Registre-se</label>
                </div>
            </div>
        </Panel>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                email: null,
                senha: null
            }
        };
    }
};
</script>

<style>
#login {
    height: 0 auto;
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
</style>