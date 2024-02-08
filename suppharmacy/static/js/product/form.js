"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            product: {
                id: 0,
                code: '',
                dealer_price: 0.0,
                description: '',
                list_price: 0.0,
                name: '',
                presentation: '',
                laboratory_id: null,
                drug_category_id: null,
                is_antibiotic: false,
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
                let data = JSON.parse(JSON.stringify(this.product));

                if (this.product.id == 0) {
                    res = await axios({
                        url: '/dataset/product',
                        method: 'post',
                        data,
                    });
                } else {
                    res = await axios({
                        url: '/dataset/product',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.product.id == 0) {
                    window.location.href = `/product/${res.data.data.id}`;
                } else {
                    this.__fetchProduct();
                }

            } catch (error) {
                alert(error);
                this.__fetchProduct();
            } finally {
                this.loading = false;
            }
        },
        discard () {
            window.location.href = `/product`;
        },
        labChange(data) {
            this.product.laboratory_id = data.id;
        },
        categoryChange(data) {
            this.product.drug_category_id = data.id;
        },
        async __fetchProduct() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/product',
                    method: 'get',
                    params: {
                        fields: 'code,dealer_price,description,list_price,name,'
                            + 'presentation,laboratory_id,drug_category_id,'
                            + 'is_antibiotic',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.product = res.data.data[0];

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deleteProduct() {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar el medicamento ${this.product.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/product',
                    method: 'delete',
                    data: {
                        id: this.product.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/product`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    async mounted() {
        this.__fetchProduct();
    },
});

formApp.component('loading', loadingComponent);

formApp.component('field-relational', fieldRelationalComponent);

formApp.mount('#vue-form');
