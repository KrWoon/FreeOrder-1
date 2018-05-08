<template lang="html">
    <div>
        <h3> Display Order </h3>

        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Operation</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders">
                    <td>{{order.UserID}}</td>
                    <td>{{order.UserName}}</td>
                    <td>{{order.UserLocation}}</td>
                    <td>
                        <router-link :to="{ name : 'EditOrder', params: {id: order.UserID} }" class="btn btn-nav">
                            Edit
                        </router-link>   
                        <a href="#" class="btn btn-danger" v-on:click="deleteOrder(order.UserID)"> 
                            Delete 
                        </a>                                             
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: []
        }
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            this.axios.get('/order')
            .then(res => {
                this.orders = res.data;
            })
            .catch(err => console.log(err));
        },
        deleteOrder(id) {
            var response = confirm('Are you sure you want to delete?');

            if(response) {
                this.axios.delete('/order/' + id)
                .then(res => {
                    var deletedOrder = null;

                    this.orders.forEach(function(n) {
                        if(n.UserID == id) {
                            deletedOrder = n;
                        }
                    });

                    this.orders.splice(this.orders.indexOf(deletedOrder), 1)
                })
                .catch(err => console.log(err));
            }
            return;
        }
    }
}
</script>
