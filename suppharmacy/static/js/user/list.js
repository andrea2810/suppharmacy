"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [],
            loading: true
        }
    },
    methods: {
        fetchUsers() {
            axios({
                url: '/dataset/user',
                method: 'get',
                params: {
                    
                },
            }).then(res => {
                if (res.data.ok === true) {
                    this.loading = false;
                    this.users = res.data.data;
                }
            });
        },
    },
    mounted() {
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
