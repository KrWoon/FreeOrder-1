<template lang="html">
  <div>
      <h1> Edit Order </h1>
      <form v-on:submit.prevent="updateOrder">
            <div class="form-group">
                  <input type="text" v-model="order.UserName"  class="form-control">  
            </div>
            <div class="form-group">
                  <input type="text" v-model="order.UserLocation"  class="form-control">
            </div>  
          <button type="submit" name="button" class="btn btn-primary">
              Edit
          </button>
      </form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            order: {}
        }
    },
    created() {
        this.getOrder();
    },
    methods: {
        getOrder() {
            this.axios.get('/order/' + this.$route.params.id)
            .then(res => {
                this.order = res.data;
            })
            .catch(err => console.log(err));
        },
        updateOrder() {
            this.axios.put('/order/' + this.$route.params.id, this.order)
            .then(res => {
                this.$router.replace({name: 'DisplayOrder'});
            })
            .catch(err => console.log(err));
        }
    }
}
</script>

<style>

</style>
