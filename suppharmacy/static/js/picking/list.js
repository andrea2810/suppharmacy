"use strict";

const STATES = {
    draft: 'Borrador',
    ready: 'Preparado',
    done: 'Hecho',
    cancel: 'Cancelado',
}

const TYPES = {
    sale: 'Salida',
    purchase: 'Ingreso',
    expired: 'Expirado',
}

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            pickings: [],
            fields: 'name,date,user_id.name,type_picking,state',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
            userFilter: "",
            dateStartFilter: null,
            dateEndFilter: null,
            stateFilter: '',
            typeFilter: '',
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
            if (this.userFilter) {
                args.push(['user_id.name', 'ilike', `%${this.userFilter}%`]);
            }
            if (this.dateStartFilter) {
                args.push(['date', '>=', formatDateToArgs(this.dateStartFilter)]);
            }
            if (this.dateEndFilter) {
                args.push(['date', '<=', formatDateToArgs(this.dateEndFilter)]);
            }
            if (this.stateFilter) {
                args.push(['state', '=', this.stateFilter]);
            }
            if (this.typeFilter) {
                args.push(['type_picking', '=', this.typeFilter]);
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
        async fetchPickings() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/stock-picking',
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
                    this.pickings = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/stock-picking',
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

                this.pickings = res.data.data;
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
                    url: '/dataset/stock-picking',
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

                this.pickings = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.pickings.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.pickings.length ? (this.limit * (this.page - 1)) + this.pickings.length : 0}`
                + ` / ${this.count}`
        },
        async deletePicking(picking) {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar el movimiento ${picking.name}?`);

                if (!confirms) {
                    return;
                }

                const res = await axios({
                    url: '/dataset/stock-picking',
                    method: 'delete',
                    data: {
                        id: picking.id,
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
        this.fetchPickings();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('date-picker', VueDatePicker);

listApp.component('picking-row', {
    delimiters: ["[[", "]]"],
    props: {
        picking: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/stock/${this.picking.id}`;
        },
        displayDate() {
            return moment(this.picking.date).format('DD/MM/YYYY');
        },
        nameState() {
            return STATES[this.picking.state];
        },
        nameType() {
            return TYPES[this.picking.type_picking];
        },
    },
    methods: {
        deletePicking() {
            this.$parent.deletePicking(this.picking);
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
                <a href="#" @click="deletePicking">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ picking.name ]]</td>
            <td>[[ displayDate ]]</td>
            <td>[[ picking.user_name ]]</td>
            <td>[[ nameType ]]</td>
            <td>[[ nameState ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
