<template>
<div>
  <button class="geolocation" v-on:click="showLocation()">
      gi
    </button>
    {{currentLocation}}

        <div class="search">
      <input type="text" v-model="searchAddressInput">
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            currentLocation : { lat : 0, lng : 0},
            searchAddressInput: ''
        }
    },
    methods: {
        searchLocation: function() {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address': this.searchAddressInput}, (results, status) => {
                if (status === 'OK') {
                    this.currentLocation.lat = results[0].geometry.location.lat();
                    this.currentLocation.lng = results[0].geometry.location.lng();
                }
            });
        },
        showLocation() {
            this.searchLocation();
            console.log(this.currentLocation);
        }
    }
}
</script>

<style>

</style>
