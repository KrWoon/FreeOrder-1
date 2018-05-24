<template>
  <div class="container">
    <div v-if="!image">
        <input type="file" name="userfile" @change="onFileSelected">
    </div>
          <div v-else>
            <img :src="image" />
            <button @click="removeImage">Remove image</button>
        </div>
        
        <button @click="onUpload"> Upload </button>
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
          const fd = new FormData();
          fd.append('image', this.file);
          const config = { headers: { 'Content-Type': 'multipart/form-data' }};         
          
          this.axios.post('/index/upload', fd)
          .then(res => {
              console.log(res);
          })
          .catch(err => console.log(err));
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

</style>
