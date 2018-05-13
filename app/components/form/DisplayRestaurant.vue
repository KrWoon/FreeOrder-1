<template>
  <div>

    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3">My Restaurants</h1>
          <p>It is your restaurant list</p>
          <button class="btn btn-primary btn-lg" disabled>Below</button>
        </div>
      </div>

      <div class="container">
        <!-- Example row of columns -->
        <div class="row">

          <div class="col-md-4" v-for="restaurant in infos.restaurants" :key="restaurant.Restaurant_Code">
            <h2>{{restaurant.Signboard}}</h2>
            <p>You can manage the restaurant. <br/>Click the manage button and start it.</p>
            <router-link :to="{ name: 'Home', params: {id: restaurant.Restaurant_Code} }" class="btn btn-secondary" replace>
              Manage &raquo;
            </router-link>
          </div>
        </div>

        <hr>

      </div> <!-- /container -->
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
            infos: []
        }
    },
    created() {
        this.fetchInfos();
    },
    watch: {
      // 라우트가 변경되면 메소드를 다시 호출됩니다.
      '$route': 'fetchInfos'
    },
    methods: {
        fetchInfos() {
            this.axios.get('/index/restaurants')            
            .then(res => {
                this.infos = res.data;
            })
            .catch(err => {
              console.log(err);
            });
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
