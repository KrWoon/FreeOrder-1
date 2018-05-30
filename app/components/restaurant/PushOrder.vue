<template>
    <div>
        <main role="main">
            <!-- Main jumbotron for a primary marketing message or call to action -->
            <div class="jumbotron">
                <div class="container">
                    <h1 class="display-3" v-if="status"> Accpeted Order </h1>
                    <h1 class="display-3" v-else> Not Accpeted Order </h1>
                    <p> <br/> </p>
                </div>
            </div>      

            <div class="mycontainer">
                <table class="table text-center">
                    <thead>
                        <tr>
                            <th>No. </th>
                            <th>Menu</th>
                            <th>Menu Price</th>
                            <th>Option </th>
                            <th>Option Price </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(menu, index) in menus" :key="menu.Menu_Code">
                            <td> {{index + 1}} </td>
                            <td> 
                                <h3>{{menu.Menu_Name}} </h3>
                            </td>
                            <td> 
                                <h3>{{menu.Menu_Price}} </h3>
                            </td>
                            <td>
                                <p v-for="option in options" :key="option.MenuOption_Code" v-if="option.Menu_Code == menu.Menu_Code">
                                    {{ option.MenuOption_Name }}
                                </p>
                            </td>
                            <td>
                                <p v-for="option in options" :key="option.MenuOption_Code" v-if="option.Menu_Code == menu.Menu_Code">
                                    {{option.MenuOption_Price}}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right">
                    <!-- <button class="btn btn-primary" @click="orderIsReady()" v-if="status"> Ready </button> -->
                    <button class="btn btn-primary" v-confirm="{loader: true, ok: dialog => orderIsReady(dialog),  message: 'Are you sure you send ready message to customer?'}" > Ready </button>
                    <!-- <button class="btn btn-primary" @click="acceptOrder()" v-else> Accept </button> -->
                    <router-link :to="{ name: 'Order'}" class="btn btn-primary" replace>
                        Back
                    </router-link>
                </div>
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
            menus: [],
            options: [],
            status: 0
        }
    },
    created() {
        this.fetchOrder();
    },
    methods: {
        fetchOrder() {
            this.axios.get('/order/' + this.$route.params.oid)
            .then(res => {
                this.menus = res.data.menus;
                this.options = res.data.options;

                if(this.menus[0].OrderStatus == 'Accept') {
                    this.status = 1;
                } else {
                    this.status = 0;
                }
                console.log(this.menus);
                console.log(this.options);
            })
            .catch(err => console.log(err));
        },
        orderIsReady(dialog) {
            this.axios.post('/order/ready/' + this.$route.params.oid)
            .then(res => {
                dialog.close();
                this.$router.replace({name:'Order'});
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
    width: 600px;
  }
}

@media (min-width: 1200px) {
  .mycontainer {
    width: 600px;
  }
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }
.border-top-gray { border-top-color: #adb5bd; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.lh-condensed { line-height: 1.25; }
</style>