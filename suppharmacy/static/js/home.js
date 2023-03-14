"use strict";

let homeApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
        }
    },
    methods: {
        logout() {
            axios({
                url: '/logout',
                method: 'post',
            }).then(() => {
                window.location.href = '/login';
                return;
            });
        },
    },
    mounted() {
        
    }
});

homeApp.mount('#vue-sidebar');
