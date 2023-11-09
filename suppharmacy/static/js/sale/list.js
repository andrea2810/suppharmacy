"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            sales: [],
            fields: 'name,date,partner_id.name,user_id.name,amount_total,state',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
            partnerFilter: "",
            dateStartFilter: null,
            dateEndFilter: null,
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
            if (this.partnerFilter) {
                args.push(['partner_id.name', 'ilike', `%${this.partnerFilter}%`]);
            }
            if (this.dateStartFilter) {
                args.push(['date', '>=', formatDateToArgs(this.dateStartFilter)]);
            }
            if (this.dateEndFilter) {
                args.push(['date', '<=', formatDateToArgs(this.dateEndFilter)]);
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
        async fetchSales() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/sale-order',
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
                    this.sales = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/sale-order',
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

                this.sales = res.data.data;
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
                    url: '/dataset/sale-order',
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

                this.sales = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.sales.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.sales.length ? (this.limit * (this.page - 1)) + this.sales.length : 0}`
                + ` / ${this.count}`
        },
        async deleteSale(sale) {
            try {
                this.loading = true;
                const saleConfirms = confirm(
                    `¿Está seguro que desea eliminar la venta ${sale.name}?`);

                if (!saleConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/sale-order',
                    method: 'delete',
                    data: {
                        id: sale.id,
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
        this.fetchSales();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('date-picker', VueDatePicker);

listApp.component('sale-row', {
    delimiters: ["[[", "]]"],
    props: {
        sale: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/sale/${this.sale.id}`;
        },
        displayDate() {
            return moment(this.sale.date).format('DD/MM/YYYY');
        }
    },
    methods: {
        deleteSale() {
            this.$parent.deleteSale(this.sale);
        },
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
                <a href="#" @click="deleteSale">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ sale.name ]]</td>
            <td>[[ displayDate ]]</td>
            <td>[[ sale.partner_name ]]</td>
            <td>[[ sale.user_name ]]</td>
            <td>[[ sale.amount_total ]]</td>
            <td>[[ sale.state ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
