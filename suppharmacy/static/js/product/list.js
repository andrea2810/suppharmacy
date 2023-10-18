"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            products: [],
            fields: 'name,code,presentation,is_antibiotic',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
            codeFilter: "",
            presentationFilter: "",
            antibioticFilter: "-1",
            order: ['id', 'ASC'],
        }
    },
    computed: {
        paginationEnableClass() {
            return {
                disabled: this.count < this.limit,
            }
        },
        orderFieldClass() {
            const caret = this.order[1] == 'ASC'? 'dropdown' : 'dropup';
            const res = {};
            const fields = this.fields.split(',');

            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];

                if (field.includes('_id.')) {
                    field = field.replace('_id.', '_');
                }

                res[field] = this.order[0] == fields[i] ? [caret] : [];
            }

            return res;
        }
    },
    methods: {
        __getArgs() {
            const args = [];

            if (this.nameFilter) {
                args.push(['name', 'ilike', `%${this.nameFilter}%`]);
            }
            if(this.codeFilter) {
                args.push(['code', 'ilike', `%${this.codeFilter}%`]);
            }
            if(this.presentationFilter) {
                args.push(['presentation', 'ilike', `%${this.presentationFilter}%`]);
            }

            const is_antibiotic = Number(this.antibioticFilter);
            if(is_antibiotic > -1) {
                args.push(['is_antibiotic', '=', Boolean(is_antibiotic)]);
            }

            return JSON.stringify(args);
        },
        changeOrder(field) {
            if(field == this.order[0]) {
                if (this.order[1] == 'ASC') {
                    this.order[1] = 'DESC';
                } else {
                    this.order[1] = 'ASC';
                }
            } else {
                this.order[0] = field;
                this.order[1] = 'ASC';
            }

            if (this.count) {
                this.changePage(0);
            }
        },
        async fetchProducts() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/product',
                    method: 'get',
                    params: {
                        count: 1,
                        args
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.count = res.data.data.count;
                this.pages = Math.ceil(this.count / this.limit);
                
                if (this.count == 0) {
                    this.products = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/product',
                    method: 'get',
                    params: {
                        args,
                        fields: this.fields,
                        limit: this.limit,
                        order: this.order.join(' '),
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                console.log(res.data);
                this.products = res.data.data;
                console.log(this.products);
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        async changePage (page) {
            this.page += page;
            if (this.page > this.pages) {
                this.page = 1;
            }
            if (this.page == 0) {
                this.page = this.pages;
            }

            this.loading = true;

            try {
                let res = await axios({
                    url: '/dataset/product',
                    method: 'get',
                    params: {
                        args: this.__getArgs(),
                        fields: this.fields,
                        limit: this.limit,
                        offset: (this.page - 1) * this.limit,
                        order: this.order.join(' '),
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.products = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.products.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.products.length ? (this.limit * (this.page - 1)) + this.products.length : 0}`
                + ` / ${this.count}`
        },
        async deleteProduct(product) {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar el medicamento ${product.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/product',
                    method: 'delete',
                    data: {
                        id: product.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.count -= 1;
                this.pages = Math.ceil(this.count / this.limit);
                this.changePage(0);

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.fetchProducts();
        console.log(this.products);
    },
});

listApp.component('loading', loadingComponent);

listApp.component('product-row', {
    delimiters: ["[[", "]]"],
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/product/${this.product.id}`;
        },
    },
    methods: {
        deleteProduct() {
            this.$parent.deleteProduct(this.product);
        },
    },
    mounted() {

    },
    template: `
        <tr>
            <td>
                <a :href="url">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/pencill-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>
                <a href="#" @click="deleteProduct">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ product.name ]]</td>
            <td>[[ product.code ]]</td>
            <td>[[ product.presentation ]]</td>
            <td>
                <input type="checkbox" v-model="product.is_antibiotic" disabled>
            </td>
        </tr>
    `
})

listApp.mount('#vue-list');
