<template lang="html">
  <div class="">      
      <form v-on:submit.prevent="addOrder" class="card">
          <div class="card-title">
            <h1>Create an Order</h1>
          </div>    
          <div class="card-body">
              <div class="form-group">
                  <input type="text" v-model="order.UserName" placeholder="Input Name" class="form-control">              
              </div>
              <div class="form-group">
                  <input type="text" v-model="order.UserLocation" placeholder="Input Location" class="form-control">
              </div>
                <button type="submit" class="btn btn-primary">
                    Add Order
                </button>
            </div>
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
    methods: {
        addOrder() {
            this.axios.post('/order', this.order)
            .then(res => {
                this.$router.replace({name:'DisplayOrder'});
            })
            .catch(err => console.log(err));
        }
    }
}
</script>

<style>

</style>
