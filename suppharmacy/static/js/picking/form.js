"use strict";

const STATES = {
    draft: 'Borrador',
    ready: 'Preparado',
    done: 'Hecho',
    cancel: 'Cancelado',
}

const TYPES = {
    sale: 'Salida',
    purchase: 'Ingreso',
    expired: 'Expirado',
}

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            picking: {
                id: 0,
                name: "Nuevo",
                date: new Date(),
                state: 'draft',
                partner_id: null,
                user_id: null,
                move_ids: [],
                type_picking: 'expired',
            },
            moves: [],
            loading: true,
            visibleModalMove: false,
            modalMove: {
                id: 0,
                product_id: null,
                product_qty: 1,
                lot_number: '',
                expiration_time: null,
            },
            indexMove: -1,
        }
    },
    computed: {
        partnerString() {
            if (this.picking.type_picking == 'purchase') {
                return "Proveedor"
            }
            if (this.picking.type_picking == 'sale') {
                return "Cliente"
            }
            
            return "";
        },
        nameState() {
            return STATES[this.picking.state];
        },
        nameType() {
            return TYPES[this.picking.type_picking];
        },
        origin() {
            if (this.picking.type_picking == 'sale') {
                return this.picking.sale_name;
            }
            if (this.picking.type_picking == 'purchase') {
                return this.picking.purchase_name;
            }

            return '';
        },
        disabledFieldsNotDraft() {
            return this.picking.state != 'draft';
        },
        disabledFieldsNotReady() {
            return !['draft', 'ready'].includes(this.picking.state)
        },
        isTypePurchase() {
            return this.picking.type_picking == 'purchase';
        },
        colSize() {
            if (this.picking.type_picking == 'purchase') {
                return '24';
            }
            
            return '32';
        },
    },
    methods: {
        async __save () {
            let res;
            let data = JSON.parse(JSON.stringify(this.picking));

            if (data.date) {
                data.date = formatDateToArgs(this.picking.date);
            }

            if (this.picking.id == 0) {
                res = await axios({
                    url: '/dataset/stock-picking',
                    method: 'post',
                    data,
                });
            } else {
                res = await axios({
                    url: '/dataset/stock-picking',
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
                const picking_id = await this.__save();

                if (this.picking.id == 0) {
                    window.location.href = `/stock/${picking_id}`;
                } else {
                    this.__fetchPicking();
                }

            } catch (error) {
                alert(error);
                this.__fetchPicking();
            } finally {
                this.loading = false;
            }
        },
        async actionConfirm() {
            this.loading = true;

            try {
                let picking_id = await this.__save();

                const res = await axios({
                    url: '/dataset/call/stock-picking',
                    method: 'post',
                    data: {
                        method: 'action_confirm',
                        args: [picking_id]
                    }
                });

                if (this.picking.id == 0) {
                    window.location.href = `/stock/${picking_id}`;
                }
                
                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.picking.id != 0) {
                    this.__fetchPicking();
                }

            } catch (error) {
                alert(error);
                this.__fetchPicking();
            } finally {
                this.loading = false;
            }
        },
        async actionValidate() {
            this.loading = true;

            try {
                let picking_id = await this.__save();

                const res = await axios({
                    url: '/dataset/call/stock-picking',
                    method: 'post',
                    data: {
                        method: 'action_validate',
                        args: [picking_id]
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.picking.id == 0) {
                    window.location.href = `/stock/${picking_id}`;
                } else {
                    this.__fetchPicking();
                }
            } catch (error) {
                alert(error);
                this.__fetchPicking();
            } finally {
                this.loading = false;
            }
        },
        userChange(data) {
            this.picking.user_id = data.id;
        },
        partnerChange(data) {
            this.picking.partner_id = data.id;
        },
        discard () {
            window.location.href = `/stock`;
        },
        async __fetchPicking() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/stock-picking',
                    method: 'get',
                    params: {
                        fields: 'name,date,state,partner_id,partner_id.name,'
                            + 'user_id,user_id.name,type_picking,'
                            + 'purchase_id.name,sale_id.name',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                Object.assign(this.picking, res.data.data[0]);
                this.picking.move_ids = [];

                if (this.picking.date) {
                    this.picking.date = new Date(this.picking.date + " 00:00:00 GMT-0600");
                }

                res = await axios({
                    url: '/dataset/stock-move',
                    method: 'get',
                    params: {
                        fields: 'product_id,product_id.name,name,product_qty,lot_number,expiration_time',
                        args: JSON.stringify([['picking_id', '=', id]]),
                        limit: 0,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.moves = res.data.data;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deletePicking() {
            try {
                this.loading = true;
                const confirms = confirm(
                    `¿Está seguro que desea eliminar el movimiento ${this.picking.name}?`);

                if (!confirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/stock-picking',
                    method: 'delete',
                    data: {
                        id: this.picking.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/stock`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        openMove(move_id=0) {
            if (!move_id) {
                this.indexMove = -1;
                this.modalMove = {
                    id: 0,
                    product_id: null,
                    product_qty: 1,
                    lot_number: '',
                    expiration_time: null,
                };
            } else {
                this.indexMove = this.moves.findIndex(l => l.id == move_id);

                if (this.indexMove < 0) {
                    alert("Error: no se encontró el movimiento")
                    return;
                }

                const move = this.moves[this.indexMove];

                this.modalMove = {
                    id: move.id,
                    product_id: move.product_id,
                    product_qty: move.product_qty,
                    lot_number: move.lot_number,
                    expiration_time: new Date(move.expiration_time + " 00:00:00 GMT-0600"),
                };
            }

            this.toggleModalMove();
        },
        async createMove(move) {
            const newMove = await this._onchangeMove(move);

            if (!newMove) {
                return;
            }

            this.moves.push(newMove);
            this.picking.move_ids.push([0, newMove.id, newMove]);

            this.toggleModalMove();

        },
        async updateMove(move) {
            const updatedMove = await this._onchangeMove(move);

            if (!updatedMove) {
                return;
            }

            this.moves[this.indexMove] = updatedMove;

            const index = this.picking.move_ids.findIndex(l => l[1] == updatedMove.id);

            if (index < 0) {
                this.picking.move_ids.push([1, updatedMove.id, updatedMove]);
            } else {
                this.picking.move_ids[index][2] = updatedMove;
            }

            this.toggleModalMove();
        },
        deleteMove(move_id) {
            let index = this.moves.findIndex(l => l.id == move_id);

            this.moves.splice(index, 1);

            index = this.picking.move_ids.findIndex(l => l[1] == move_id);

            if (index > -1) {
                this.picking.move_ids.splice(index, 1);
            }

            if (typeof move_id === 'number') {
                this.picking.move_ids.push([2, move_id, null]);
            }
            
        },
        async _onchangeMove(move) {
            this.loading = true;

            try {
                const res = await axios({
                    url: '/dataset/call/stock-move',
                    method: 'post',
                    data: {
                        method: 'onchange_move',
                        args: [move]
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
        toggleModalMove() {
            this.visibleModalMove = !this.visibleModalMove;
        }
        
    },
    async mounted() {
        this.__fetchPicking();
    },
    watch: {
    },
});

formApp.component('stock-move-row', {
    delimiters: ["[[", "]]"],
    props: {
        move: {
            type: Object,
            required: true
        }
    },
    computed: {
        isTypePurchase() {
            return this.$parent.isTypePurchase;
        },
        colSize() {
            return this.$parent.colSize;
        },
        disabledFieldsNotReady() {
            return this.$parent.disabledFieldsNotReady;
        },
        displayDate() {
            if (this.move.expiration_time) {
                return moment(this.move.expiration_time).format('DD/MM/YYYY');
            }

            return '';
        },
    },
    methods: {
        updateMove() {
            this.$parent.openMove(this.move.id);
        },
        deleteMove() {
            this.$parent.deleteMove(this.move.id);
        }
    },
    template: `
        <tr>
            <td style="width: 2%;">
                <a v-if="disabledFieldsNotReady">
                    <svg class="me-2" width="16" height="16">
                    </svg>
                </a>
                <a v-else href="#" @click="updateMove">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/pencill-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td style="width: 2%;">
                <a v-if="disabledFieldsNotReady">
                    <svg class="me-2" width="16" height="16">
                    </svg>
                </a>
                <a v-else href="#" @click="deleteMove">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td :style="\`width: \${colSize}%;\`">[[ move.product_name ]]</td>
            <td :style="\`width: \${colSize}%;\`">[[ move.lot_number ]]</td>
            <td v-if="isTypePurchase" :style="\`width: \${colSize}%;\`">[[ displayDate ]]</td>
            <td :style="\`width: \${colSize}%;\`">[[ move.product_qty ]]</td>
        </tr>
    `
});

formApp.component('modal-move', {
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
        move: {
            type: Object,
            required: true,
        },
    },
    computed: {
        isTypePurchase() {
            return this.$parent.isTypePurchase;
        },
    },
    methods: {
        productChange(data) {
            this.move.product_id = data.id;
        },
        async update() {
            if (!this.move.product_id) {
                alert("Debe seleccionar un medicamento.");
                return;
            }

            if (!this.move.product_qty < 0) {
                alert("Al menos debe registrar un medicamento");
                return;
            }

            if (this.move.expiration_time) {
                this.move.expiration_time = formatDateToArgs(this.move.expiration_time);
            }

            if (this.move.id) {
                await this.$parent.updateMove(this.move);
            } else {
                await this.$parent.createMove(this.move);
            }
        },
        close() {
            this.$parent.toggleModalMove();
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
                        <h5 class="modal-title">Movimiento</h5>
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
                                :initial="move.product_id"
                                @value-changed="productChange"
                            ></field-relational>
                            <div class="input-group m-3">
                                <span class="input-group-text">Lote</span>
                                <input class="form-control" type="text" v-model="move.lot_number"/>
                            </div>
                            <div class="input-group m-3">
                                <span class="input-group-text">Cantidad</span>
                                <input class="form-control" type="number" v-model="move.product_qty"/>
                            </div>
                            <div v-if="isTypePurchase">
                                <div class="input-group input-group-date m-3">
                                    <span class="input-group-text">Fecha</span>
                                    <date-picker 
                                        @update:model-value="(date) => {move.expiration_time = date}"
                                        :enable-time-picker="false"
                                        select-text="Seleccionar"
                                        cancel-text="Cancelar"
                                        v-model="move.expiration_time"
                                        locale="es"
                                        format="dd/MM/yyyy">
                                    </date-picker>
                                </div>
                                <div style="height: 350px;"/>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="close">Cerrar</button>
                        <button type="button" class="btn btn-primary" @click="update">
                            <span v-if="move.id == 0">Agregar</span>
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
