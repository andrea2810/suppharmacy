"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [],
            fields: 'name,username',
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /',
            nameFilter: "",
        }
    },
    computed: {
        paginationEnableClass() {
            return {
                disabled: this.count < this.limit,
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
        async fetchUsers() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                const args = this.__getArgs();

                let res;
                res = await axios({
                    url: '/dataset/user',
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
                    this.users = [];
                    this.__updatePagination();
                    return;
                }

                res = await axios({
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        args,
                        fields: this.fields,
                        limit: this.limit,
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.users = res.data.data;
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
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        args: this.__getArgs(),
                        fields: this.fields,
                        limit: this.limit,
                        offset: (this.page - 1) * this.limit,
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.users = res.data.data;
            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }

            this.__updatePagination();
        },
        __updatePagination() {
            this.pagination = 
                `${this.users.length ? (this.limit * (this.page - 1)) + 1 : 0}`
                + `-${this.users.length ? (this.limit * (this.page - 1)) + this.users.length : 0}`
                + ` / ${this.count}`
        },
        async deleteUser(user) {
            try {
                this.loading = true;
                const userConfirms = confirm(
                    `¿Está seguro que desea eliminar el usuario ${user.name}?`);

                if (!userConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/user',
                    method: 'delete',
                    data: {
                        id: user.id,
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
    async mounted() {
        this.fetchUsers();
    },
});

listApp.component('loading', loadingComponent);

listApp.component('user-row', {
    delimiters: ["[[", "]]"],
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    computed: {
        url() {
            return `/user/${this.user.id}`;
        },
    },
    methods: {
        deleteUser() {
            this.$parent.deleteUser(this.user);
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
                <a href="#" @click="deleteUser">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td>[[ user.name ]]</td>
            <td>[[ user.username ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
