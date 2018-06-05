<template>
<div>
    <div class="container d-flex w-100 h-100 p-3 mx-auto flex-column text-center">
      <main role="main" class="inner cover" style="color:white"  v-if="this.info.login">
        <img class="mb-4" v-bind:src="'/images/freeorder.png'" alt="" width="120" height="120">
        <h1 class="cover-heading">Free Order</h1>
        <p class="lead">Welcome, {{this.info.login.Manager_Name}} ! </p>
        <p class="lead">
            <router-link :to="{ name: 'DisplayRestaurant'}" v-if="this.info.login.Power == 0" class="btn btn-lg btn-secondary" replace>
               Get Started
            </router-link>
            <router-link :to="{ name: 'DisplayAdminPage'}" v-if="this.info.login.Power == 1" class="btn btn-lg btn-secondary" replace>
               Manage App
            </router-link>
        </p>
      </main>
      <main role="main" class="inner cover" style="color:white" v-else>
        <img class="mb-4" v-bind:src="'/images/freeorder.png'" alt="" width="120" height="120">
        <h1 class="cover-heading">Free Order</h1>
        <p class="lead">Welcome to our web page</p>
        <p class="lead">
            <router-link :to="{ name: 'Login'}" class="btn btn-lg btn-secondary">
               Sign in
            </router-link>
        </p>
      </main>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            info: {}
        }
    },
    created() {
        this.fetchInfo();
    },
    sockets:{
        connect: function(){
            console.log('connection2 success')
        }
    },
    methods: {
        fetchInfo() {
            this.axios.get('/index')
            .then(res => {
                this.info = res.data;
		console.log('hi');
            })
            .catch(err => console.log(err));
        }
    }
}
</script>

<style>
body {
  background-color: #333;
}
</style>


<style scoped>
/* Links */
a,
a:focus,
a:hover {
  color: #fff;
}

/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
  background-color: #fff;
  border: .05rem solid #333;
}

/*
 * Cover
 */
.cover {
  padding: 0 1.5rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  margin: auto;
}
.cover .btn-lg {
  padding: .75rem 1.25rem;
  font-weight: 700;
}
</style>
