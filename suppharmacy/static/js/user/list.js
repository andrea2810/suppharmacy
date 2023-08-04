"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [],
            loading: true,
            limit: 10,
            count: 0,
            page: 1,
            pages: 1,
            pagination: '- /'
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
        async fetchUsers() {
            this.loading = true;
            this.page = 1;
            this.pages = 1;

            try {
                let res;
                res = await axios({
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        count: 1
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.count = res.data.data.count;
                this.pages = Math.ceil(this.count / this.limit);
                
                if (this.count == 0) {
                    return;
                }

                res = await axios({
                    url: '/dataset/user',
                    method: 'get',
                    params: {
                        fields: 'name,username',
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
            if (this.count < this.limit){
                return;
            }

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
                        fields: 'name,username',
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
        }
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
    mounted() {

    },
    template: `
        <tr>
            <td>[[ user.name ]]</td>
            <td>[[ user.username ]]</td>
        </tr>
    `
})

listApp.mount('#vue-list');
