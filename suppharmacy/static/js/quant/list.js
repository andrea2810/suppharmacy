"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            quants: [],
            fields: 'product_id.name,quantity',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            productFilter: "",
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

            if (this.productFilter) {
                args.push(['product_id.name', 'ilike', `%${this.productFilter}%`]);
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
        async fetchQuants() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/stock-quant',
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
                    this.quants = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/stock-quant',
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

                this.quants = res.data.data;
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
                    url: '/dataset/stock-quant',
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

                this.quants = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.quants.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.quants.length ? (this.limit * (this.page - 1)) + this.quants.length : 0}`
                + ` / ${this.count}`
        },
    },
    mounted() {
        this.fetchQuants();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('date-picker', VueDatePicker);

listApp.component('quant-row', {
    delimiters: ["[[", "]]"],
    props: {
        quant: {
            type: Object,
            required: true
        }
    },
    computed: {
    },
    methods: {
    },
    template: `
        <tr>
            <td>[[ quant.product_name ]]</td>
            <td>[[ quant.quantity ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
