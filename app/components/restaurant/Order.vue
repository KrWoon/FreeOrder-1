<template lang="html">
    <div>
    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> Order </h1>
          <p>You can set your restaurant information in here</p>
          <button class="btn btn-info btn-lg disabled">Open Your Restaurant &raquo;</button>
        <button class="btn btn-primary" v-on:click="sendMobileOrders()"> 
            Send 
        </button>    
        </div>
      </div>      

    <div class="mycontainer">
        <h3> Display Order </h3>

        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Email</th>
                    <!-- <th>Operation</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders">
                    <td>{{index + 1}}</td>
                    <td>{{order.Email}}</td>
                    <!-- <td>
                        <a href="#" class="btn btn-danger" v-on:click="deleteOrder(order.UserID)"> 
                            Delete 
                        </a>         
                                  
                    </td> -->
                </tr>
            </tbody>
        </table>
        </div>
    <!-- /container -->    

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
            mobileOrders: [
                {
                    Email: "bbb@naver.com",
                    Restaurant_Code: "211",
                    Menu_Code: "391",
                    MenuOption_CodeList: [
                            { MenuOption_Code: "331" },
                            { MenuOption_Code: "341" }
                    ]
                    
                },
                {
                    Email: "bbb@naver.com",
                    Restaurant_Code: "211",
                    Menu_Code: "401",
                    MenuOption_CodeList: [

                    ]
                    
                }
            ]
        }
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            this.axios.get('/order/mobile/' + this.$route.params.id)
            .then(res => {
                this.orders = res.data;
                console.log(this.orders);
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
            console.log(this.mobileOrders);
            this.axios.post('/order/mobile', this.mobileOrders)
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