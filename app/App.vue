<template lang="html">
    <div>        
        <h1> Vuejs function </h1>
        <router-link :to="{ name: 'CreateOrder'}" class="btn btn-primary">
            Create Order
        </router-link>
        <router-link :to="{ name: 'DisplayOrder'}" class="btn btn-primary">
            View Order
        </router-link>
                
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {};
</script>
