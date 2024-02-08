"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            labs: [],
            fields: 'name',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
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

            return {
                name: this.order[0] == 'name' ? [caret] : [],
            }
        }
    },
    methods: {
        __getArgs() {
            const args = [];

            if (this.nameFilter) {
                args.push(['name', 'ilike', `%${this.nameFilter}%`]);
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
        async fetchLabs() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/laboratory',
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
                    this.labs = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/laboratory',
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

                this.labs = res.data.data;
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
                    url: '/dataset/laboratory',
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

                this.labs = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.labs.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.labs.length ? (this.limit * (this.page - 1)) + this.labs.length : 0}`
                + ` / ${this.count}`
        },
        async deleteLab(lab) {
            try {
                this.loading = true;
                const labConfirms = confirm(
                    `¿Está seguro que desea eliminar el laboratorio ${lab.name}?`);

                if (!labConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/laboratory',
                    method: 'delete',
                    data: {
                        id: lab.id,
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
        this.fetchLabs();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('lab-row', {
    delimiters: ["[[", "]]"],
    props: {
        lab: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/laboratory/${this.lab.id}`;
        },
    },
    methods: {
        deleteLab() {
            this.$parent.deleteLab(this.lab);
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
                <a href="#" @click="deleteLab">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ lab.name ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
