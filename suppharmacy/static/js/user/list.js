"use strict";

let listApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            users: [
                {name: "Saulson", username: "Saulson"}
            ],
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
                    this.users = res.data.data;
                    console.log(this.users);
                }
            });
        }
    },
    mounted() {
        this.fetchUsers()
    }
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
        console.log(this.user);
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
