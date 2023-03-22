"use strict";

const listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [],
            loading: false
        }
    },
    methods: {
        fetchUsers() {
            axios({
                url: '/user/data',
                method: 'get',
                data: {
                    
                },
            }).then(res => {
                if (res.data.ok === true) {
                    this.loading = true;
                    this.users = res.data.data;
                }
            });
            this.loading = true;
        },
    },
    mounted() {
        this.fetchUsers();
    },
});

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
        <div class="row">
            <div class="col-6">
                [[ user.name ]]
            </div>
            <div class="col-6">
                [[ user.username ]]
            </div>
        </div>
    `
})

listApp.mount('#vue-list');
