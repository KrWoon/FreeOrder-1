<template>
<div>
    <main role="main">

      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3">Administer</h1>
          <p>You can accept or reject applications</p>
        </div>
      </div>

    <div class="container">
        <h3> Application List </h3>

        <table class="table table-hover table-bordered text-center">
            <thead>
                <tr>
                    <th>Restaurant Name</th>
                    <th>Email</th>
                    <th>Business License</th>
                    <th>Location</th>
                    <th>Permit</th>
                    <th>Reject</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="admin in infos.admins" :key="admin.Application_Code">
                    <td>{{ admin.Restaurant_Name }}</td>
                    <td>{{ admin.Email }}</td>
                    <td> {{ admin.Businesslicense }} </td>
                    <td> {{ admin.Location }} </td>
                    <td>
                        <a href="#" class="btn btn-primary"  v-on:click="acceptForm(admin.Application_Code)"> 
                            Accept 
                        </a>                                      
                    </td>
                    <td>  
                        <a href="#" class="btn btn-danger"> 
                            Reject
                        </a>      
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    <!-- /container -->    

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
        infos: [],
        targetInfo: {}
      }
    },
    created() {
      this.fetchInfos();
    },
    methods: {
        fetchInfos() {
            this.axios.get('/index/admins')            
            .then(res => {
                this.infos = res.data;
                console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        },
        acceptForm(id) {
          var response = confirm('Are you sure you want to accept this application?');
          
          if(response) {
              //find clicked application
              for(var i=0; i<this.infos.admins.length; i++) {
                if(id == this.infos.admins[i].Application_Code) {
                  this.targetInfo = this.infos.admins[i];
                }
              }              
            
              this.axios.post('/form/accept/' + id, this.targetInfo)
              .then(res => {
                this.fetchInfos();
              })
              .catch(err => {
                console.log(err);
              })
          }
              return;
        },
        rejectForm(id) {
          var response = confirm('Are you sure you want to reject this application?');
          
          if(response) {
              //find clicked application
              for(var i=0; i<this.infos.admins.length; i++) {
                if(id == this.infos.admins[i].Application_Code) {
                  this.targetInfo = this.infos.admins[i];
                }
              }              
            
              this.axios.post('/form/reject/' + id, this.targetInfo)
              .then(res => {
                this.fetchInfos();
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