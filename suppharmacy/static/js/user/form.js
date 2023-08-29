"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            user: {
                id: 0,
                name: '',
                username: '',
                active: true,
                password: '*****',
            },
            loading: true,
            modalPassword: false,
        }
    },
    computed: {
    },
    methods: {
        async save () {
            this.loading = true;
            try {
                let res;
                let data = JSON.parse(JSON.stringify(this.user));

                if (this.user.id == 0) {
                    res = await axios({
                        url: '/dataset/user',
                        method: 'post',
                        data,
                    });
                } else {
                    delete data['password'];
                    res = await axios({
                        url: '/dataset/user',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.user.id == 0) {
                    window.location.href = `/user/${res.data.data.id}`;
                } else {
                    this.__fetchUser();
                }

            } catch (error) {
                alert(error);
                this.__fetchUser();
            } finally {
                this.loading = false;
            }
        },
        discard () {
            window.location.href = `/user`;
        },
        async updatePassword (newPassword) {
            this.loading = true;
            try {
                let res;
                let data = {
                    id: this.user.id,
                    password: newPassword
                };

                res = await axios({
                    url: '/dataset/user',
                    method: 'put',
                    data,
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
                this.__fetchUser();
                this.toggleModalPassword();
            }
        },
        toggleModalPassword() {
            this.modalPassword = !this.modalPassword;
        },
        userChange(data) {
            console.log("userChanged", data);
        },
        async __fetchUser() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    this.user.password = '';
                    return;
                }

                let res = await axios({
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        fields: 'name,username,active',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.user = res.data.data[0];
                this.user.password = "*****"

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    async mounted() {
        this.__fetchUser();
    },
});

formApp.component('loading', loadingComponent);

formApp.component('field-relational', fieldRelationalComponent);

formApp.component('modal-password', {
    delimiters: ["[[", "]]"],
    data() {
        return {
            password: ''
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        update() {
            this.$emit('update-password', this.password);
        },
        close() {
            this.$emit("toggle-visible");
        }
    },
    mounted() {

    },
    template: `
        <div v-if="visible" class="modal fade show" tabindex="-1" aria-modal="true" 
            role="dialog">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Actualizar contraseña</h5>
                        <button type="button" class="btn-close" aria-label="Close"
                            @click="close"/>
                    </div>
                    <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="input-group m-3">
                                <span class="input-group-text">Nueva Contraseña</span>
                                <input class="form-control" type="password" v-model="password"/>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="close">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="update">Actualizar</button>
                    </div>
                </div>
            </div>
        </div>
    `
})

formApp.mount('#vue-form');
