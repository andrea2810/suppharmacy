"use strict";

let app = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            user: "",
            password: "",
            errors: [],
        }
    },
    methods: {
        login() {
            this.__validate_data();

            if (this.errors.length > 0) {
                return;
            }

            axios({
                url: '/login',
                method: 'post',
                data: {
                    user: this.user,
                    password: this.password
                },
            }).then(res => {
                if (res.data.ok === true) {
                    window.location.href = '/';
                    return; 
                }
                
                this.errors = ["Usuario o Contraseña Incorrectos"]
            });
        },
        __validate_data() {
            this.errors = [];

            if (!this.user) {
                this.errors.push("El usuario es requerido");
            }
            if (!this.password) {
                this.errors.push("La contraseña es requerida");
            }
        }
    },
    mounted() {
        
    }
});

app.mount('#vue-app');
