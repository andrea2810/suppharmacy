"use strict";

let app = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            user: "",
            password: "",
        }
    },
    methods: {
        login() {
            axios({
                url: '/login/',
                method: 'post',
                data: {
                    user: this.user,
                    password: this.password
                },
            }).then(res => {
                // TODO redirect if correct login and set cookie
                // TODO show message incorrect login
                console.log('login', res.data);
            });
        },
    },
    mounted() {
        
    }
});

app.mount('#vue-app');
