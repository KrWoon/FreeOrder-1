<template lang="html">
    <div>
    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> Order </h1>
          <p>You can set your restaurant information in here</p>
          <button class="btn btn-info btn-lg disabled">Order &raquo;</button>
        <button class="btn btn-primary" v-on:click="sendMobileOrders()"> 
            Send 
        </button>    
        </div>
      </div>      

    <div class="container">
      <div class="row">
        <div class="col-md-6">
            <h3> Not Accepted Order </h3>

            <table class="table table-hover table-bordered  text-center">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Email</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in noAcceptedOrders" v-if="order.OrderStatus == 'NoAccept'">
                        <td>{{ index + 1 }}</td>
                        <td>{{ order.Email }}</td>
                        <td>{{ order.TotalPrice }}</td>
                        <td>{{ order.Date }}</td>
                        <td>
                            <router-link :to="{ name: 'ViewAcceptedOrder', params: {id: order.Order_Code}}" class="btn btn-info" replace>
                                View
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> <!-- col-md-6 -->

        <div class="col-md-6">
            <h3> Accepted Order </h3>

            <table class="table table-hover table-bordered  text-center">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Email</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in acceptedOrders" v-if="order.OrderStatus == 'Accept'">
                        <td>{{ index + 1 }}</td>
                        <td>{{ order.Email }}</td>
                        <td>{{ order.TotalPrice }}</td>
                        <td>{{ order.Date }}</td>
                        <td>
                           <router-link :to="{ name: 'ViewAcceptedOrder', params: {id: order.Order_Code}}" class="btn btn-info" replace>
                                View
                            </router-link>    
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> <!-- col-md-6 -->
      </div> <!-- row -->
    </div>   <!-- /container -->    

        <hr>
    </main>

    <footer class="container">
      <p>&copy; BBGoo 2018</p>
    </footer>

        
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [],
            acceptedOrders: [],
            noAcceptedOrders: [],
            mobileOrder: [
                {
                    Email: "bro@naver.com",
                    Restaurant_Code: "212",
                    Menu_Code: "501",
                    MenuOption_CodeList: [
                        { MenuOption_Code: "331" },
                        { MenuOption_Code: "442" }
                    ]                    
                },
                {
                    Email: "bro@naver.com",
                    Restaurant_Code: "212",
                    Menu_Code: "401",
                    MenuOption_CodeList: [
                        
                    ]                    
                }
            ],
            socketData: 0
        }
    },
    created() {
         this.fetchOrders();       
    },
    sockets:{
        connect: function(){
            console.log('connection success')
        },
        customOrder: function(val){
          this.socketData = val;
          console.log('eg: io.emit("customOrder", data)')
          console.log('socket menu: ' + this.socketData.Order_Code);
          this.updatePriceAndDelay(this.socketData.Order_Code);
        },
    },
    methods: {
        fetchOrders() {
            this.axios.get('/order/mobile/' + this.$route.params.id)
            .then(res => {
                this.orders = res.data;

                this.acceptedOrders = this.orders.filter(function(item, index, array) {
                    if(item.OrderStatus == 'Accept') {
                        return item;
                    }
                });

                this.noAcceptedOrders = this.orders.filter(function(item, index, array) {
                    if(item.OrderStatus == 'NoAccept') {
                        return item;
                    }
                });
            })
            .catch(err => console.log(err));
        },
        updatePriceAndDelay(orderId) {
            this.axios.put('/order/mobile/' + orderId)
            .then(res => {                
                this.fetchOrders();
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
        },
        sendMobileOrders() {
            console.log(this.mobileOrder);
            this.axios.post('/order/mobile', this.mobileOrder)
            .then(res => {
                console.log('send complete');
            })
            .catch(err => console.log(err));
        }
    }
}
</script>

<style>
body {
  padding-top: 3.5rem;
  background-color:white;
}
.textColor {
  color: #fff;
}
</style>

<style scoped>
.mycontainer {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 768px) {
  .mycontainer {
    width: 750px;
  }
}

@media (min-width: 992px) {
  .mycontainer {
    width: 700px;
  }
}

@media (min-width: 1200px) {
  .mycontainer {
    width: 700px;
  }
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }
.border-top-gray { border-top-color: #adb5bd; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.lh-condensed { line-height: 1.25; }
</style>