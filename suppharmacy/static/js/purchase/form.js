"use strict";

const STATES = {
    draft: 'Borrador',
    purchase: 'Validado',
    done: 'Entregado',
    cancel: 'Cancelado',
}

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            purchase: {
                id: 0,
                name: 'Nuevo',
                date: new Date(),
                state: 'draft',
                partner_id: null,
                user_id: null,
                line_ids: [],
                amount_untaxed: 0,
                amount_total: 0,
                picking_id: 0,
                picking_name: '',
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
        nameState() {
            return STATES[this.purchase.state];
        },
        disabledFieldsNotDraft() {
            return this.purchase.state != 'draft';
        }
    },
    methods: {
        async __save() {
            let res;
            let data = JSON.parse(JSON.stringify(this.purchase));

            if (data.date) {
                data.date = formatDateToArgs(this.purchase.date);
            }

            if (this.purchase.id == 0) {
                res = await axios({
                    url: '/dataset/purchase-order',
                    method: 'post',
                    data,
                });
            } else {
                res = await axios({
                    url: '/dataset/purchase-order',
                    method: 'put',
                    data,
                })
            }

            if (res.data.ok == false) {
                throw res.data.error;
            }

            return res.data.data.id;
        },
        async save () {
            this.loading = true;
            try {
                const purchase_id = await this.__save();

                if (this.purchase.id == 0) {
                    window.location.href = `/purchase/${purchase_id}`;
                } else {
                    this.__fetchPurchase();
                }

            } catch (error) {
                alert(error);
                this.__fetchPurchase();
            } finally {
                this.loading = false;
            }
        },
        async actionConfirm() {
            this.loading = true;

            try {
                let purchase_id = await this.__save();

                const res = await axios({
                    url: '/dataset/call/purchase-order',
                    method: 'post',
                    data: {
                        method: 'action_confirm',
                        args: [purchase_id]
                    }
                });

                if (this.purchase.id == 0) {
                    window.location.href = `/purchase/${purchase_id}`;
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.purchase.id != 0) {
                    this.__fetchPurchase();
                }
            } catch (error) {
                alert(error);
                this.__fetchPurchase();
            } finally {
                this.loading = false;
            }
        },
        userChange(data) {
            this.purchase.user_id = data.id;
        },
        partnerChange(data) {
            this.purchase.partner_id = data.id;
        },
        discard () {
            window.location.href = `/purchase`;
        },
        async __fetchPurchase() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/purchase-order',
                    method: 'get',
                    params: {
                        fields: 'name,date,state,partner_id,partner_id.name,user_id,user_id.name,amount_untaxed,amount_total,picking',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                Object.assign(this.purchase, res.data.data[0]);
                this.purchase.line_ids = [];

                if (this.purchase.date) {
                    this.purchase.date = new Date(this.purchase.date + " 00:00:00 GMT-0600");
                }

                res = await axios({
                    url: '/dataset/purchase-order-line',
                    method: 'get',
                    params: {
                        fields: 'product_id,product_id.name,product_qty,price_unit,taxes,price_subtotal,price_total',
                        args: JSON.stringify([['order_id', '=', id]]),
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
        async deletePurchase() {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar la compra ${this.purchase.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/purchase-order',
                    method: 'delete',
                    data: {
                        id: this.purchase.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/purchase`;

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
            this.purchase.line_ids.push([0, newLine.id, newLine]);

            this.toggleModalLine();

        },
        async updateLine(line) {
            const updatedLine = await this._onchangeLine(line);

            if (!updatedLine) {
                return;
            }

            this.lines[this.indexLine] = updatedLine;

            const index = this.purchase.line_ids.findIndex(l => l[1] == updatedLine.id);

            if (index < 0) {
                this.purchase.line_ids.push([1, updatedLine.id, updatedLine]);
            } else {
                this.purchase.line_ids[index][2] = updatedLine;
            }

            this.toggleModalLine();
        },
        deleteLine(line_id) {
            let index = this.lines.findIndex(l => l.id == line_id);

            this.lines.splice(index, 1);

            index = this.purchase.line_ids.findIndex(l => l[1] == line_id);

            if (index > -1) {
                this.purchase.line_ids.splice(index, 1);
            }

            if (typeof line_id === 'number') {
                this.purchase.line_ids.push([2, line_id, null]);
            }
            
        },
        async _onchangeLine(line) {
            this.loading = true;

            try {
                const res = await axios({
                    url: '/dataset/call/purchase-order-line',
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

                return null;
            } finally {
                this.loading = false;
            }
        },
        async _onchangeLines() {
            try {
                const res = await axios({
                    url: '/dataset/call/purchase-order',
                    method: 'post',
                    data: {
                        method: 'onchange_lines',
                        args: [this.lines]
                    }
                });
    
                if (res.data.ok == false) {
                    throw res.data.error;
                }
    
                Object.assign(this.purchase, res.data.data);
            } catch (error) {
                alert(error);
            }
        },
        toggleModalLine() {
            this.visibleModalLine = !this.visibleModalLine;
        }
        
    },
    async mounted() {
        this.__fetchPurchase();
    },
    watch: {
        lines: {
            handler: function (val, oldVal) {
                this._onchangeLines();
            },
            deep: true
        }
    },
});

formApp.component('purchase-line-row', {
    delimiters: ["[[", "]]"],
    props: {
        line: {
            type: Object,
            required: true
        }
    },
    computed: {
        parentState() {
            return this.$parent.purchase.state;
        }
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
                <a v-if="parentState == 'draft'" href="#" @click="updateLine">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/pencill-fill.svg"/>
                    </svg>
                </a>
                <a v-else>
                    <svg class="me-2" width="16" height="16">
                    </svg>
                </a>
            </td>
            <td style="width: 2%;">
                <a v-if="parentState == 'draft'" href="#" @click="deleteLine">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
                <a v-else>
                    <svg class="me-2" width="16" height="16">
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
                                string="Medicamento"
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
