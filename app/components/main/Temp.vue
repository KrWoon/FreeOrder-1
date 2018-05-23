<template>
  <div class="container">
        <input type="file" name="userfile" @change="onFileSelected">
        <button @click="onUpload"> Upload </button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            file: ''
        }
    },
    methods: {
      onFileSelected(event) {
          this.file = event.target.files[0];
          console.log(this.file);
      },
      onUpload() {
          const fd = new FormData();
          fd.append('image', this.file, this.file.name);
          const config = { headers: { 'Content-Type': 'multipart/form-data' }};         
          
          this.axios.post('/index/upload', fd)
          .then(res => {
              console.log(res);
          })
          .catch(err => console.log(err));
      }
    }
}
</script>

<style>

</style>
