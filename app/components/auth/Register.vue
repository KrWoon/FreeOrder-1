<template>
    <div class="container">
        <form class="form-signin cover" v-on:submit.prevent="Register()">
            <div class="mb-4">
                <h1 class="h3 mb-3 font-weight-normal" style="color:white">SignUp Form</h1>
            </div>
            
            <div class="form-label-group">
                <input type="text" id="inputName" class="form-control" v-model="user.realname" placeholder="Username" required autofocus>
                <label for="inputName">Name</label>
            </div>
          
            <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required>
                <label for="inputEmail">Email address</label>
            </div>
            
            <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" v-model="user.password" placeholder="Password" required>
                <label for="inputPassword">Password</label>
            </div>
          
            <div class="form-label-group">
                <input type="password" id="confirmPassword" class="form-control" v-model="user.confirmPassword" placeholder="Confirm password" required>
                <label for="confirmPassword">Confirm password</label>
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
        </form>
    </div> <!-- /container -->
</template>

<script>
export default {
    data() {
        return {
            user: {},
            message: ''
        }
    },
    methods: {
        Register() {
            this.axios.post('/auth/register', this.user)
            .then(res => {
                this.message = res.data;
                if(this.message == 'success') {
                  this.$dialog.alert('SignUp complete');
                  this.$router.replace({name:'StartPage'});
                } 
                else if(this.message == 'password') {
                  this.$dialog.alert('Input password correctly');
                } 
                else {
                  this.$dialog.alert('ID already exists');
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

}
</script>

<style>
:root {
  --input-padding-x: .75rem;
  --input-padding-y: .75rem;
}

html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #333;
}
</style>


<style scoped>
.cover {
  padding: 0 1.5rem;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  margin: auto;
}

.form-signin {
  width: 100%;
  max-width: 420px;
  padding: 15px;
  margin: auto;
}

.form-label-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-label-group > input,
.form-label-group > label {
  padding: var(--input-padding-y) var(--input-padding-x);
}

.form-label-group > label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0; /* Override default `<label>` margin */
  line-height: 1.5;
  color: #495057;
  border: 1px solid transparent;
  border-radius: .25rem;
  transition: all .1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
  color: transparent;
}

.form-label-group input:-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-moz-placeholder {
  color: transparent;
}

.form-label-group input::placeholder {
  color: transparent;
}

.form-label-group input:not(:placeholder-shown) {
  padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
  padding-bottom: calc(var(--input-padding-y) / 3);
}

.form-label-group input:not(:placeholder-shown) ~ label {
  padding-top: calc(var(--input-padding-y) / 3);
  padding-bottom: calc(var(--input-padding-y) / 3);
  font-size: 12px;
  color: #777;
}
</style>