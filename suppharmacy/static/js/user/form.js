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
                password: '',
            },
            loading: true,
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
            window.history.back();
        },
        async updatePassword() {

        },
        async __fetchUser() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
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
