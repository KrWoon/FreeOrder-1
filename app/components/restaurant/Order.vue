<template lang="html">
    <div>
    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> Order </h1>
          <p>You can set your restaurant information in here</p>
          <p> <br/> </p>
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
                            <router-link :to="{ name: 'ViewOrder', params: {oid: order.Order_Code}}" class="btn btn-info" replace>
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
                           <router-link :to="{ name: 'ViewOrder', params: {oid: order.Order_Code}}" class="btn btn-info" replace>
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
                    ClientToken: "HI",
                    Email: "bro@naver.com",
                    Restaurant_Code: "212",
                    Menu_Code: "501",
                    MenuOption_CodeList: [
                        { MenuOption_Code: "331" },
                        { MenuOption_Code: "442" }
                    ]                    
                },
                {
                    ClientToken: "HI",
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
          console.log('socket menu: ' + this.socketData);
          this.fetchOrders();
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

                console.log(this.acceptedOrders);
                console.log(this.noAcceptedOrders);
            })
            .catch(err => console.log(err));
        },
        sendMobileOrders() {
            this.axios.post('/order/mobile', this.mobileOrder)
            .then(res => {
                console.log(res);
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