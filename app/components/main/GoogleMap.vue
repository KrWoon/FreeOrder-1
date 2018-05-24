<template>
<div>
    <div id="locationField">
    <input id="autocomplete" placeholder="Enter your address" type="text">
    </div>
    
    <input class="field" id="lat">
    <input class="field" id="lng">
</div>
</template>

<script>
export default {
    data() {
        return {
            placeSearch: null,
            autocomplete: null
        }
    },
    methods: {
        initAutocomplete() {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocomplete = new google.maps.places.Autocomplete(
                                                (document.getElementById('autocomplete')),{types: ['geocode']});
            // When the user selects an address from the dropdown, populate the address
            // fields in the form.
            autocomplete.addListener('place_changed', fillInAddress);
        },
        fillInAddress() {
            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
            document.getElementById("lat").value=place.geometry.location.lat();
            document.getElementById("lng").value=place.geometry.location.lng();
        }
    }
}
</script>

<style>

</style>
