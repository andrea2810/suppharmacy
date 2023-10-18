"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            partners: [],
            fields: 'name,rfc,phone,mobile,email',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
            rfcFilter: "",
            phoneFilter: "",
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
            if (this.rfcFilter) {
                args.push(['rfc', 'ilike', `%${this.rfcFilter}%`]);
            }
            if (this.phoneFilter) {
                args.push(['phone', 'ilike', `%${this.phoneFilter}%`], 'OR',
                    ['mobile', 'ilike', `%${this.phoneFilter}%`]);
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
        async fetchPartners() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/partner',
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
                    this.partners = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/partner',
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

                this.partners = res.data.data;
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
                    url: '/dataset/partner',
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

                this.partners = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.partners.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.partners.length ? (this.limit * (this.page - 1)) + this.partners.length : 0}`
                + ` / ${this.count}`
        },
        async deletePartner(partner) {
            try {
                this.loading = true;
                const partnerConfirms = confirm(
                    `¿Está seguro que desea eliminar el cliente/proveedor ${partner.name}?`);

                if (!partnerConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/partner',
                    method: 'delete',
                    data: {
                        id: partner.id,
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
        this.fetchPartners();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('partner-row', {
    delimiters: ["[[", "]]"],
    props: {
        partner: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/partner/${this.partner.id}`;
        },
    },
    methods: {
        deletePartner() {
            this.$parent.deletePartner(this.partner);
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
                <a href="#" @click="deletePartner">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ partner.name ]]</td>
            <td>[[ partner.rfc ]]</td>
            <td>[[ partner.phone ]]</td>
            <td>[[ partner.mobile ]]</td>
            <td>[[ partner.email ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
