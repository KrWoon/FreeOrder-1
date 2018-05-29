<template>
  <div>

    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> Information </h1>
          <p>You can set your restaurant information in here</p>
          <button class="btn btn-info btn-lg" @click="changeStatus()">
              <template v-if="this.status.status == 'open'">
                Open Your Restaurant &raquo;
              </template>
              <template v-else>
                Close Your Restaurant &raquo;
              </template>
          </button>
        </div>
      </div>      

        <div class="mycontainer">
        <form>
            <div class="mb-3">
                <label for="inputName">Restaurant name</label>   
                <input type="text" class="form-control" v-model="info.Signboard" id="inputName" placeholder="Restaurant name" required autofocus>                                          
            </div>

            <div class="mb-3">
                <label for="inputAddress">Address</label>   
                <input type="text" class="form-control" v-model="info.Address" id="inputAddress" placeholder="Address" @change="searchLocation" required>  
            </div>

          <div class="row">
              <div class="col-md-6 mb-3">
                  <label>Latitude</label>
                  <input type="text" class="form-control text-center"  v-model="info.Latitude"  disabled>
              </div>      

              <div class="col-md-6 mb-3">
                  <label>Longitude</label>
                  <input type="text" class="form-control text-center"  v-model="info.Longitude"  disabled>
              </div>      
          </div>   

            <p>PhoneNumber</p>
            <div class="row">
              <div class="col-md-4 mb-3">
                  <input type="text" class="form-control text-center" v-model="phoneNumber[0]" size="4" maxlength="3" required>
              </div>
              <div class="col-md-4 mb-3">
                  <input type="text" class="form-control text-center" v-model="phoneNumber[1]" size="4" maxlength="4" required>
              </div>      
              <div class="col-md-4 mb-3">
                  <input type="text" class="form-control text-center" v-model="phoneNumber[2]" size="4" maxlength="4" required>
              </div>
            </div>


            <div class="mb-3">
                <label for="inputCategory">Category</label>   
                <input type="text" class="form-control" v-model="info.Category" id="inputCategory" placeholder="Category" required>                                          
            </div>

            <div class="mb-3">
                <label for="inputTables">Number of Table</label>   
                <input type="number" class="form-control" v-model="info.NumberOfTable" id="inputTables" placeholder="Number of Table" required>                                          
            </div>

            <div class="mb-3">
                <label for="inputDelay">Expected Delay</label>   
                <input type="number" class="form-control" v-model="info.Delay" id="inputDelay" placeholder="Delay" required>                                          
            </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="inputOpen">Open Time</label>
                <input type="text" class="form-control text-center"  v-model="info.openTime" id="inputOpen" placeholder="09:00" pattern="\d{2}:\d{2}" title="Input type = ??:??" required>
            </div>      

            <div class="col-md-6 mb-3">
                <label for="inputClose">Close Time</label>
                <input type="text" class="form-control text-center"  v-model="info.closeTime" id="inputClose" placeholder="21:00" pattern="\d{2}:\d{2}" title="Input type = ??:??" required>
            </div>      
        </div>   

            <button class="btn btn-lg btn-primary btn-block" type="submit" v-confirm="{ok: updateInfo, message: 'Are you sure you want to edit?'}">Update</button>        
        </form>     

     
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
      info: {},
      status: {status: ''},
      currentLocation : { lat : 0, lng : 0},
      phoneNumber: ''
    }
  },
  created() {
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      this.axios.get('/restaurant/' + this.$route.params.id)
      .then(res => {
        this.info = res.data;
        this.phoneNumber = this.info.PhoneNumber.split('-');

        if(this.info.BusinessStatus == 'open') {
          this.status.status = 'close'
        } else {
          this.status.status = 'open'
        }
      })
      .catch(err => console.log(err));
    },
    updateInfo() {
      this.info.PhoneNumber = this.phoneNumber[0] + '-' + this.phoneNumber[1] + '-' + this.phoneNumber[2];
      this.axios.put('/restaurant/' + this.$route.params.id, this.info)
      .then(res => {
          this.$dialog.alert(res.data.restaurant);
          console.log(this.info);
      })
      .catch(err => console.log(err));
    },
    changeStatus() {
      this.axios.post('/restaurant/changeStatus/' + this.$route.params.id, this.status)
      .then(res => {
        this.$dialog.alert(res.data.message);

        if(res.data.change == 1) {
          if(this.status.status == 'open') {
            this.status.status = 'close';
          } else {
            this.status.status = 'open';
          }
        }
        
      })
      .catch(err => console.log(err));
    },
    searchLocation: function() {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': this.info.Address}, (results, status) => {
            if (status === 'OK') {
                this.info.Latitude = results[0].geometry.location.lat();
                this.info.Longitude = results[0].geometry.location.lng();
            }
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