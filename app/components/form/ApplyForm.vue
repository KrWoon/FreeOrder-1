<template>
<div>
    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3">Application Form</h1>
          <p>Fill out the form to apply restaurant</p>
          <router-link :to="{ name: 'DisplayApplication'}" class="btn btn-primary btn-lg" replace>
              &laquo; Back 
            </router-link>
        </div>
      </div>

        <div class="mycontainer">
        <form v-on:submit.prevent="Apply()">
            <div class="mb-3">
                <label for="rname">Restaurant name</label>   
                <input type="text" class="form-control" id="rname" v-model="form.rname" placeholder="Restaurant name" required autofocus>    
                                      
            </div>

        <div class="row">
            <div class="col-md-4 mb-3">
                <label for="license1">Business License</label>
                <input type="text" class="form-control text-center" v-model="form.license1" id="license1" maxLength="3" placeholder="123" required>
            </div>      

            <div class="col-md-3 mb-3">  
                <label for="license2">&nbsp;</label>                      
                <input type="text" class="form-control text-center" v-model="form.license2" id="license2" maxLength="2" placeholder="12" required>
            </div>      

            <div class="col-md-5 mb-3">
                <label for="license3">&nbsp;</label>
                <input type="text" class="form-control text-center" v-model="form.license3" id="license3" maxLength="5" placeholder="12345" required>
            </div>
        </div>   
            
            <div class="mb-3">
                <label for="inputAddress">Address</label>
                <input type="text" id="inputAddress" class="form-control" v-model="form.Address" placeholder="Address" required>               
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="submit">Submit</button>        
        </form>            
    </div>
    <!-- /container -->    
    </main>
</div>
</template>

<script>
export default {
    data() {
        return {
            form: {}
        }
    },
    methods: {
        Apply() {
            this.axios.post('/form/apply', this.form)
            .then(res => {
                this.$dialog.alert(res.data.application);
                this.$router.replace({name:'DisplayApplication'});
            })
            .catch(err => {
                console.log(err);
            })
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
    width: 500px;
  }
}

@media (min-width: 1200px) {
  .mycontainer {
    width: 500px;
  }
}

.border-top { border-top: 1px solid #e5e5e5; }
.border-bottom { border-bottom: 1px solid #e5e5e5; }
.border-top-gray { border-top-color: #adb5bd; }

.box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

.lh-condensed { line-height: 1.25; }
</style>