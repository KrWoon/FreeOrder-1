package org.androidtown.signupdemo;


        import android.content.Context;
        import android.content.Intent;
        import android.support.v7.app.AppCompatActivity;
        import android.os.Bundle;
        import android.view.View;
        import android.widget.Button;
        import android.widget.EditText;

public class Login2 extends AppCompatActivity {
    EditText username;
    EditText password;
    EditText login_email;
    EditText login_pw;
    Button login_btn;
    String page;
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setTitle("Login2");

        username = (EditText) findViewById(R.id.login_email);
        password = (EditText) findViewById(R.id.login_password);
        login_btn = (Button) findViewById(R.id.login_btn);
        context = this.getApplicationContext();

        username.setText(SharedPreferencesHandler.getString(context, "username"));
        password.setText(SharedPreferencesHandler.getString(context, "password"));


    }
/*
    public void login(final View v) {
        System.out.println("1");
        RequestParams params = new RequestParams();
        params.put("username", username.getText().toString());
        params.put("password", password.getText().toString());
        System.out.println("2");
        AsyncClient.post("http://172.16.20.141:3000/auth/andlogin", params, new mJsonHttpResponseHandler(this) {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {System.out.println("3");
                    if (response.getInt(context.getString(R.string.server_response)) == 1) {



                            SharedPreferencesHandler.writeString(context, "username", username.getText().toString());
                            SharedPreferencesHandler.writeString(context, "password", password.getText().toString());
                            SharedPreferencesHandler.writeBoolean(context, "rememberMe", true);

                    System.out.println("4");

                        Toast.makeText(context, response.getString(context.getString(R.string.server_message)), Toast.LENGTH_SHORT).show();
                        //Intent i = new Intent(context, SignUp.class);
                        //startActivity(i);
                        finish();
                    } else if (
                            response.getInt(context.getString(R.string.server_response)) == 0) {
                        Toast.makeText(context, response.getString(context.getString(R.string.server_message)), Toast.LENGTH_SHORT).show();

                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }
*/
    public void signUpButtonClikced(View v){
        //Intent intent = new Intent(getApplicationContext(), SignUp.class);
        Intent intent = new Intent(getApplicationContext(), Main.class);
        startActivity(intent);
    }

}