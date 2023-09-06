"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            laboratory: {
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
                let data = JSON.parse(JSON.stringify(this.laboratory));

                if (this.laboratory.id == 0) {
                    res = await axios({
                        url: '/dataset/laboratory',
                        method: 'post',
                        data,
                    });
                } else {
                    delete data['password'];
                    res = await axios({
                        url: '/dataset/laboratory',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.laboratory.id == 0) {
                    window.location.href = `/laboratory/${res.data.data.id}`;
                } else {
                    this.__fetchLaboratory();
                }

            } catch (error) {
                alert(error);
                this.__fetchLaboratory();
            } finally {
                this.loading = false;
            }
        },
        discard () {
            window.location.href = `/laboratory`;
        },
        async __fetchLaboratory() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/laboratory',
                    method: 'get',
                    params: {
                        fields: 'name,active',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.laboratory = res.data.data[0];

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deleteLaboratory() {
            try {
                this.loading = true;
                const labConfirms = confirm(
                    `¿Está seguro que desea eliminar el laboratorio ${this.laboratory.name}?`);

                if (!labConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/laboratory',
                    method: 'delete',
                    data: {
                        id: this.laboratory.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/laboratory`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    async mounted() {
        this.__fetchLaboratory();
    },
});

formApp.component('loading', loadingComponent);

formApp.mount('#vue-form');
