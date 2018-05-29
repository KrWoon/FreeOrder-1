<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark textColor">
    <div class="container">
      <a class="navbar-brand" style="color:white">Free Order</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link :to="{ name: 'DisplayRestaurant'}" class="nav-link" replace>
              Restaurant
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'DisplayApplication'}" class="nav-link" replace>
              Application
            </router-link>
          </li>      
        </ul>
         <a href="/" class="btn btn-success" v-confirm="{loader: true, ok: dialog => Logout(dialog),  message: 'Are you sure want to logout?'}">
           Logout
         </a>
      </div>               
  </div>
  </nav>
</template>

<script>
export default {
    data() {
      return {
        
      }
    },
    methods: {
      Logout(dialog) {
          this.axios.post('/auth/logout')
          .then(res => {
            dialog.close();
            location.href = "/"
          })
          .catch(err => {
            console.log(err);
          })
      }
    }
}
</script>

<style>

</style>
