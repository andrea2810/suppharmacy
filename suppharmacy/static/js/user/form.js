"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            user: {
                id: 0,
                name: '',
                username: '',
                active: false,
                password: '',
            },
            loading: true,
        }
    },
    computed: {
    },
    methods: {
        async save () {
            alert("Guardado");
        },
        discard () {
            window.history.back();
        },
        async updatePassword() {

        },
        async __fetchUser() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    // this.loading = false;
                    return;
                }

                let res = await axios({
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.user = res.data.data[0];

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

formApp.mount('#vue-form');
