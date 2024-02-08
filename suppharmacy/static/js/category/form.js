"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            category: {
                id: 0,
                name: '',
                active: true,
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
                let data = JSON.parse(JSON.stringify(this.category));

                if (this.category.id == 0) {
                    res = await axios({
                        url: '/dataset/drug-category',
                        method: 'post',
                        data,
                    });
                } else {
                    res = await axios({
                        url: '/dataset/drug-category',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.category.id == 0) {
                    window.location.href = `/drug-category/${res.data.data.id}`;
                } else {
                    this.__fetchCategory();
                }

            } catch (error) {
                alert(error);
                this.__fetchCategory();
            } finally {
                this.loading = false;
            }
        },
        discard () {
            window.location.href = `/drug-category`;
        },
        async __fetchCategory() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/drug-category',
                    method: 'get',
                    params: {
                        fields: 'name,active',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.category = res.data.data[0];

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deleteCategory() {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar la categoría ${this.category.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/drug-category',
                    method: 'delete',
                    data: {
                        id: this.category.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/drug-category`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    async mounted() {
        this.__fetchCategory();
    },
});

formApp.component('loading', loadingComponent);

formApp.mount('#vue-form');
