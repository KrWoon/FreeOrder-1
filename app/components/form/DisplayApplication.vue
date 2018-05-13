<template>
<div>
    <main role="main">

      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3">Application List</h1>
          <p>If you want to register you restaurant, fill out the form to apply restaurant</p>
          <router-link :to="{ name: 'ApplyForm'}" class="btn btn-primary btn-lg">
              Apply &raquo;
            </router-link>
        </div>
      </div>

      <div class="container">
        <!-- Example row of columns -->
        <div class="row">
          <div class="col-md-4" v-for="application in infos.applications" :key="application.Application_Code">
            <h2>{{application.Restaurant_Name}}</h2>
            <p>Your application is under review.<br/> To cancel, click the button.</p>
            <p><button class="btn btn-danger" v-on:click="deleteForm(application.Application_Code)">Cancel</button></p>
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
            this.axios.get('/index/applications')            
            .then(res => {
                this.infos = res.data;
                console.log(this.infos);
            })
            .catch(err => {
              console.log(err);
            });
        },
        deleteForm(id) {
          var response = confirm('Are you sure you want to delete?');
          
          if(response) {
              this.axios.delete('/form/' + id)
              .then(res => {
                this.fetchInfos();
                // var deleteForm = null;

                // this.infos.applications.forEach(function(n) {
                //    if(n.Application_Code == id) {
                //      deleteForm = n;
                //    }
                // });

                // this.infos.applications.splice(this.infos.applications.indexOf(deleteForm), 1);
              })
              .catch(err => {
                console.log(err);
              })
          }
              return;
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
