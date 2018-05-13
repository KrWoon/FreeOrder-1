<template>
  <div>

    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> {{ this.info.Signboard }} </h1>
          <p>This is the main page of your restaurant</p>
          <button class="btn btn-dark btn-lg" disabled>Home</button>
        </div>
      </div>      
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
      info: {}
    }
  },
  created() {
    this.fetchInfo();
  },
  watch: {
    // 라우트가 변경되면 메소드를 다시 호출됩니다.
    '$route': 'fetchInfo'
  },
  methods: {
    fetchInfo() {
      this.axios.get('/restaurant/' + this.$route.params.id)
      .then(res => {
        this.info = res.data;
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