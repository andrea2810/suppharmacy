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

let loadingComponent = {
    delimiters: ["[[", "]]"],
    props: ['loading'],
    watch: { 
        loading: function(newVal, oldVal) { } // watch it
    }, 
    template: `
        <div v-if="loading" class="loading d-flex flex-column flex-wrap align-content-center justify-content-center">
            <div class="spinner-border text-light" role="status">
                <span class="visually-hidden"></span>
            </div>
            <div>
                Cargando...
            </div>
        </div>
    `,
}

homeApp.mount('#vue-sidebar');
