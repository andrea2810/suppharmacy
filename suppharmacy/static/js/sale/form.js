"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            sale: {
                id: 0,
                name: '',
                date: new Date(),
                state: '',
                partner_id: null,
                user_id: null,
                line_ids: [],
                amount_untaxed: 0,
                amount_total: 0,
            },
            lines: [],
            loading: true,
            visibleModalLine: false,
            modalLine: {
                id: 0,
                product_id: null,
                product_qty: 1,
            },
            indexLine: -1,
        }
    },
    computed: {
    },
    methods: {
        async save () {
            this.loading = true;
            try {
                let res;
                let data = JSON.parse(JSON.stringify(this.sale));

                if (data.date) {
                    data.date = formatDateToArgs(this.sale.date);
                }

                if (this.sale.id == 0) {
                    res = await axios({
                        url: '/dataset/sale-order',
                        method: 'post',
                        data,
                    });
                } else {
                    res = await axios({
                        url: '/dataset/sale-order',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.sale.id == 0) {
                    window.location.href = `/sale/${res.data.data.id}`;
                } else {
                    this.sale.line_ids = [];
                    this.__fetchSale();
                }

            } catch (error) {
                alert(error);
                this.__fetchSale();
            } finally {
                this.loading = false;
            }
        },
        userChange(data) {
            this.sale.user_id = data.id;
        },
        partnerChange(data) {
            this.sale.partner_id = data.id;
        },
        discard () {
            window.location.href = `/sale`;
        },
        async __fetchSale() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/sale-order',
                    method: 'get',
                    params: {
                        fields: 'name,date,state,partner_id,user_id',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                Object.assign(this.sale, res.data.data[0]);

                if (this.sale.date) {
                    this.sale.date = new Date(this.sale.date + " 00:00:00 GMT-0600");
                }

                res = await axios({
                    url: '/dataset/sale-order-line',
                    method: 'get',
                    params: {
                        fields: 'product_id,product_id.name,product_qty,price_unit,taxes,price_subtotal,price_total',
                        args: JSON.stringify([['order_id', '=', id]])
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.lines = res.data.data;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deleteSale() {
            try {
                this.loading = true;
                const saleConfirms = confirm(
                    `¿Está seguro que desea eliminar la venta ${this.sale.name}?`);

                if (!saleConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/sale-order',
                    method: 'delete',
                    data: {
                        id: this.sale.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/sale`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        openLine(line_id=0) {
            if (!line_id) {
                this.indexLine = -1;
                this.modalLine = {
                    id: 0,
                    product_id: null,
                    product_qty: 1,
                };
            } else {
                this.indexLine = this.lines.findIndex(l => l.id == line_id);

                if (this.indexLine < 0) {
                    alert("Error: no se encontró la linea")
                    return;
                }

                const line = this.lines[this.indexLine];

                this.modalLine = {
                    id: line.id,
                    product_id: line.product_id,
                    product_qty: line.product_qty,
                };
            }

            this.toggleModalLine();
        },
        async createLine(line) {
            const newLine = await this._onchangeLine(line);

            if (!newLine) {
                return;
            }

            this.lines.push(newLine);
            this.sale.line_ids.push([0, newLine.id, newLine]);

            this.toggleModalLine();

        },
        async updateLine(line) {
            const updatedLine = await this._onchangeLine(line);

            if (!updatedLine) {
                return;
            }

            this.lines[this.indexLine] = updatedLine;

            const index = this.sale.line_ids.findIndex(l => l[1] == updatedLine.id);

            if (index < 0) {
                this.sale.line_ids.push([1, updatedLine.id, updatedLine]);
            } else {
                this.sale.line_ids[index][2] = updatedLine;
            }

            this.toggleModalLine();
        },
        deleteLine(line_id) {
            let index = this.lines.findIndex(l => l.id == line_id);

            this.lines.splice(index, 1);

            index = this.sale.line_ids.findIndex(l => l[1] == line_id);

            if (index > -1) {
                this.sale.line_ids.splice(index, 1);
            }

            if (typeof line_id === 'number') {
                this.sale.line_ids.push([2, line_id, null]);
            }
            
        },
        async _onchangeLine(line) {
            this.loading = true;

            try {
                const res = await axios({
                    url: '/dataset/call/sale-order-line',
                    method: 'post',
                    data: {
                        method: 'onchange_line',
                        args: [line]
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                return res.data.data;
                
            } catch (error) {
                alert(error);
                return {};
            } finally {
                this.loading = false;
            }
        },
        async _onchangeLines() {
            try {
                const res = await axios({
                    url: '/dataset/call/sale-order',
                    method: 'post',
                    data: {
                        method: 'onchange_lines',
                        args: [this.lines]
                    }
                });
    
                if (res.data.ok == false) {
                    throw res.data.error;
                }
    
                Object.assign(this.sale, res.data.data);
            } catch (error) {
                alert(error);
            }
        },
        toggleModalLine() {
            this.visibleModalLine = !this.visibleModalLine;
        }
        
    },
    async mounted() {
        this.__fetchSale();
    },
    watch: {
        lines: {
            handler: function (val, oldVal) {
                console.log("changed lines");
                this._onchangeLines();
            },
            deep: true
        }
    },
});

formApp.component('sale-line-row', {
    delimiters: ["[[", "]]"],
    props: {
        line: {
            type: Object,
            required: true
        }
    },
    computed: {
    },
    methods: {
        updateLine() {
            this.$parent.openLine(this.line.id);
        },
        deleteLine() {
            this.$parent.deleteLine(this.line.id);
        }
    },
    template: `
        <tr>
            <td style="width: 2%;">
                <a href="#" @click="updateLine">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/pencill-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td style="width: 2%;">
                <a href="#" @click="deleteLine">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td style="width: 16%;">[[ line.product_name ]]</td>
            <td style="width: 16%;">[[ line.product_qty ]]</td>
            <td style="width: 16%;">[[ line.price_unit ]]</td>
            <td style="width: 16%;">[[ line.taxes ]]</td>
            <td style="width: 16%;">[[ line.price_subtotal ]]</td>
            <td style="width: 16%;">[[ line.price_total ]]</td>
        </tr>
    `
});

formApp.component('modal-line', {
    delimiters: ["[[", "]]"],
    data() {
        return {
            
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        line: {
            type: Object,
            required: true,
        },
    },
    methods: {
        productChange(data) {
            this.line.product_id = data.id;
        },
        async update() {
            if (!this.line.product_id) {
                alert("Debe seleccionar un medicamento.");
                return;
            }

            if (!this.line.product_qty < 0) {
                alert("Al menos debe registrar un medicamento");
                return;
            }

            if (this.line.id) {
                await this.$parent.updateLine(this.line);
            } else {
                await this.$parent.createLine(this.line);
            }
        },
        close() {
            this.$parent.toggleModalLine();
        }
    },
    mounted() {

    },
    template: `
        <div v-if="visible" class="modal fade show" tabindex="-1" aria-modal="true" 
            role="dialog">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Linea</h5>
                        <button type="button" class="btn-close" aria-label="Close"
                            @click="close"/>
                    </div>
                    <div class="modal-body">
                    <div class="container-fluid">
                        <div class="row">
                            <field-relational
                                string="Producto"
                                field="name"
                                table="product"
                                :initial="line.product_id"
                                @value-changed="productChange"
                            ></field-relational>
                            <div class="input-group m-3">
                                <span class="input-group-text">Cantidad</span>
                                <input class="form-control" type="number" v-model="line.product_qty"/>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="close">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="update">
                            <span v-if="line.id == 0">Agregar</span>
                            <span v-else>Actualizar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
});

formApp.component('loading', loadingComponent);

formApp.component('field-relational', fieldRelationalComponent);

formApp.component('date-picker', VueDatePicker);

formApp.mount('#vue-form');
