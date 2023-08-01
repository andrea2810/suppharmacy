"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [],
            loading: true,
            limit: 80,
            count: 0,
        }
    },
    methods: {
        async fetchUsers() {
            this.loading = true;

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
