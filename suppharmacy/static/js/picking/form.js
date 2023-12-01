"use strict";

const STATES = {
    draft: 'Borrador',
    ready: 'Preparado',
    done: 'Hecho',
    cancel: 'Cancelado',
}

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            picking: {
                id: 0,
                name: '',
                date: new Date(),
                state: 'draft',
                partner_id: null,
                user_id: null,
                move_ids: [],
                type_picking: '',
            },
            moves: [],
            loading: true,
            visibleModalMove: false,
            modalMove: {
                id: 0,
                product_id: null,
                product_qty: 1,
            },
            indexMove: -1,
        }
    },
    computed: {
        nameState() {
            return STATES[this.picking.state];
        },
    },
    methods: {
        async save () {
            this.loading = true;
            try {
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

                if (this.picking.id == 0) {
                    window.location.href = `/stock/${res.data.data.id}`;
                } else {
                    this.picking.move_ids = [];
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
                        fields: 'name,date,state,partner_id,user_id,type_picking',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                Object.assign(this.picking, res.data.data[0]);

                if (this.picking.date) {
                    this.picking.date = new Date(this.picking.date + " 00:00:00 GMT-0600");
                }

                res = await axios({
                    url: '/dataset/stock-move',
                    method: 'get',
                    params: {
                        fields: 'product_id,product_id.name,name,product_qty,quantity_done',
                        args: JSON.stringify([['picking_id', '=', id]])
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
                    quantity_done: 1,
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
                    quantity_done: move.quantity_done,
                };
            }

            console.log("openMove");
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
                return {};
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
                <a href="#" @click="updateMove">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/pencill-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td style="width: 2%;">
                <a href="#" @click="deleteMove">
                    <svg class="bi bi bi-pencil-fill me-2" width="16" height="16">
                        <image xlink:href="/static/img/icons/trash-fill.svg"/>
                    </svg>
                </a>
            </td>
            <td style="width: 32%;">[[ move.product_name ]]</td>
            <td style="width: 32%;">[[ move.product_qty ]]</td>
            <td style="width: 32%;">[[ move.quantity_done ]]</td>
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
                                <span class="input-group-text">Cantidad</span>
                                <input class="form-control" type="number" v-model="move.product_qty"/>
                            </div>
                            <div class="input-group m-3">
                                <span class="input-group-text">Cantidad Hecha</span>
                                <input class="form-control" type="number" v-model="move.quantity_done"/>
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
