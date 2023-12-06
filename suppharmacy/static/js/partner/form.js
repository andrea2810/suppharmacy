"use strict";

const formApp = Vue.createApp({
    delimiters: ["[[", "]]"],
    data() {
        return {
            partner: {
                id: 0,
                name: '',
                city: '',
                country: '',
                email: '',
                is_company: false,
                mobile: '',
                phone: '',
                ref: '',
                rfc: '',
                cp: '',
                customer: false,
                supplier: false,
            },
            loading: true,
        }
    },
    computed: {
    },
    methods: {
        async save () {
            this.loading = true;
            try {
                let res;
                let data = JSON.parse(JSON.stringify(this.partner));

                if (this.partner.id == 0) {
                    res = await axios({
                        url: '/dataset/partner',
                        method: 'post',
                        data,
                    });
                } else {
                    res = await axios({
                        url: '/dataset/partner',
                        method: 'put',
                        data,
                    })
                }

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                if (this.partner.id == 0) {
                    window.location.href = `/partner/${res.data.data.id}`;
                } else {
                    this.__fetchPartner();
                }

            } catch (error) {
                alert(error);
                this.__fetchPartner();
            } finally {
                this.loading = false;
            }
        },
        discard () {
            window.location.href = `/partner`;
        },
        async __fetchPartner() {
            const id = Number(this.$el.parentElement.attributes['rec-id'].value);

            try {
                if (!id) {
                    return;
                }

                let res = await axios({
                    url: '/dataset/partner',
                    method: 'get',
                    params: {
                        fields: 'name,active,city,country,email,is_company,mobile,phone,ref,rfc,cp,customer,supplier',
                        args: JSON.stringify([['id', '=', id]])
                    },
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                this.partner = res.data.data[0];

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
        async deletePartner() {
            try {
                this.loading = true;
                const partnerConfirms = confirm(
                    `¿Está seguro que desea eliminar el Cliente/Proveedor ${this.partner.name}?`);

                if (!partnerConfirms) {
                    return;
                }

                const res= await axios({
                    url: '/dataset/partner',
                    method: 'delete',
                    data: {
                        id: this.partner.id,
                    }
                });

                if (res.data.ok == false) {
                    throw res.data.error;
                }

                window.location.href = `/partner`;

            } catch (error) {
                alert(error);
            } finally {
                this.loading = false;
            }
        },
    },
    async mounted() {
        this.__fetchPartner();
    },
});

formApp.component('loading', loadingComponent);

formApp.mount('#vue-form');
