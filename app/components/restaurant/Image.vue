<template>
  <div>

    <main role="main">
      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3"> Image </h1>
          <p>You can upload your restaurant's image in here</p>
          <p><br/></p>
        </div>
      </div>      

    <div class="container">
        <div v-if="!image">
          <div class="custom-file">
            <input type="file" class="custom-file-input" id="customFile" @change="onFileSelected">
            <label class="custom-file-label" for="customFile">Choose your restaurant image</label>
          </div>
        </div>
        <div class="text-center" v-else>
            <img :src="image" class="rounded mx-auto d-block">
            <p><br/></p>
            <button class="btn btn-danger" @click="removeImage">Reload image</button>
            <button class="btn btn-primary" @click="onUpload"> Upload </button>
        </div>        
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
            image: '',
            file: ''
        }
    },
    methods: {
      onFileSelected(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.createImage(files[0]);
        this.file = event.target.files[0];
        console.log(this.file);
      },
      onUpload() {
          if(this.file) {
            const fd = new FormData();
            fd.append('image', this.file);
            const config = { headers: { 'Content-Type': 'multipart/form-data' }};         
            
            this.axios.post('/restaurant/upload/' + this.$route.params.id, fd)
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err));
          } else {
              alert('Select image file');
          }

      },
        createImage(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = (e) => {
                vm.image = e.target.result;
                // console.log(vm.image);
            };
            reader.readAsDataURL(file);
        },
      removeImage: function (e) {
            this.image = '';
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