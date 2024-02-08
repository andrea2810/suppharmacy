"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            categories: [],
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
        async fetchCategories() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/drug-category',
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
                    this.categories = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/drug-category',
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

                this.categories = res.data.data;
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
                    url: '/dataset/drug-category',
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

                this.categories = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.categories.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.categories.length ? (this.limit * (this.page - 1)) + this.categories.length : 0}`
                + ` / ${this.count}`
        },
        async deleteCategory(category) {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar la categoría ${category.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/drug-category',
                    method: 'delete',
                    data: {
                        id: category.id,
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
        this.fetchCategories();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('category-row', {
    delimiters: ["[[", "]]"],
    props: {
        category: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/drug-category/${this.category.id}`;
        },
    },
    methods: {
        deleteCategory() {
            this.$parent.deleteCategory(this.category);
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
                <a href="#" @click="deleteCategory">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ category.name ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
