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

let fieldRelationalComponent = {
    delimiters: ["[[", "]]"],
    data() {
        return {
            data: {},
            items: [],
            input: "",
            timer: null,
        }
    },
    props: {
        string: {
            type: String,
            required: true,
        },
        table: {
            type: String,
            required: true,
        },
        field: {
            type: String,
            required: true,
        },
        limit: {
            type: Number,
            default: 5,
        },
        operator: {
            type: String,
            default: 'ilike'
        },
        initial: {
            type: Number,
            default: 0,
        }
    },
    methods: {
        __debounce(fn, wait) {
            if(this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            const context = this;
            this.timer = setTimeout(() => {
                fn.apply(context);
            }, wait);
        },
        async __getData(args) {
            try {
                let res = await axios({
                    url: `/dataset/${this.table}`,
                    method: 'get',
                    params: {
                        fields: this.field,
                        args,
                        limit: this.limit,
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                return res.data.data;

            } catch (error) {
                console.error(error);
                return [];
            } 
        },
        blur() {
            if (this.data.id && this.input 
                && this.data[this.field] == this.input) {
                this.$emit('value-changed', JSON.parse(JSON.stringify(this.data)));
            } else {
                this.input = '';
                this.keyup();
                this.$emit('value-changed', {id: 0});
            }
        },
        async keyup() {
            this.__debounce(async () => {
                let value = this.input;
    
                if (this.operator.includes('like')) {
                    value = `%${value}%`
                }
    
                const args = JSON.stringify([[this.field, this.operator, value]]);
                const data = await this.__getData(args);
                
                this.items = data;
                
                if (this.items.length) {
                    this.data = this.items[0];
                } else {
                    this.data = {
                        id: 0,
                    }
                }

                this.input;
            }, 300);
        },
    },
    async mounted() {
        if (this.initial) {
            const args = JSON.stringify([['id', '=', this.initial]]);
            const data = await this.__getData(args);

            this.items = data;

            if (this.items.length) {
                this.data = this.items[0];
                this.input = this.data[this.field];
            } else {
                this.data = {
                    id: 0,
                }
            }
        } else {
            this.keyup();
        }
    },
    template: `
        <div class="input-group m-3">
            <span class="input-group-text">[[ string ]]</span>
            <input class="form-control" type="text" 
                v-model="input"
                :list="'data-list-' + table"
                @keyup="keyup"
                @blur="blur"/>
            <datalist :id="'data-list-' + table">
                <option v-for="item in items" :key="item.id" :value="item.name"></option>
            </datalist>
        </div>
    `,
}

homeApp.mount('#vue-sidebar');
