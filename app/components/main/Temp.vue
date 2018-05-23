<template>
    <!-- <form v-on:submit.prevent="uploadFile" enctype="multipart/form-data"> -->
    <form action="/index/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="userfile">
        <input type="submit">
    </form>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        uploadFile() {
            this.axios.post('/index/upload')
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
