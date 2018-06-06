package org.androidtown.signupdemo;


        import android.content.Context;
        import android.content.Intent;
        import android.support.v7.app.AppCompatActivity;
        import android.os.Bundle;
        import android.support.v7.app.AppCompatDelegate;
        import android.text.InputType;
        import android.view.View;
        import android.widget.Button;
        import android.widget.EditText;
        import android.widget.Toast;

        import com.google.firebase.iid.FirebaseInstanceId;
        import com.google.firebase.messaging.FirebaseMessaging;
        import com.loopj.android.http.RequestParams;

        import org.json.JSONException;
        import org.json.JSONObject;

        import Model.Order;
        import Handler.AsyncClient;
        import Handler.SharedPreferencesHandler;
        import Handler.mJsonHttpResponseHandler;
        import cz.msebera.android.httpclient.Header;

public class Login2 extends AppCompatActivity {
    EditText username;
    EditText password;
    EditText login_email;
    EditText login_pw;
    Button login_btn;
    String page;
    Context context;
    String email;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        //FirebaseMessaging.getInstance().subscribeToTopic("news");
        //FirebaseInstanceId.getInstance().getToken();
        setTitle("Login2");

        username = (EditText) findViewById(R.id.login_email);

        password = (EditText) findViewById(R.id.login_password);
        password.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        login_btn = (Button) findViewById(R.id.login_btn);
        context = this.getApplicationContext();

        username.setText(SharedPreferencesHandler.getString(context, "username"));
        password.setText(SharedPreferencesHandler.getString(context, "password"));


    }

    public void login(final View v) {
        System.out.println("1");
        email= username.getText().toString();
        RequestParams params = new RequestParams();
        params.put("username", username.getText().toString());
        params.put("password", password.getText().toString());
        System.out.println("2");
        AsyncClient.post("https://freeorder3.herokuapp.com/auth/andlogin", params, new mJsonHttpResponseHandler(this) {

            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                try {
                    if (response.getInt(context.getString(R.string.server_response)) == 1) {
                        SharedPreferencesHandler.writeString(context, "username", username.getText().toString());
                            SharedPreferencesHandler.writeString(context, "password", password.getText().toString());
                            SharedPreferencesHandler.writeBoolean(context, "rememberMe", true);

                        Toast.makeText(context, response.getString(context.getString(R.string.server_message)), Toast.LENGTH_SHORT).show();
                        Intent i = new Intent(context, Main.class);
                        Order order = new Order();
                        order.setEmail(email);
                        i.putExtra("order",order);
                        startActivity(i);
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

    public void signUpButtonClikced(View v){
        //Intent intent = new Intent(getApplicationContext(), SignUp.class);
        Intent intent = new Intent(getApplicationContext(), SignUp.class);
        startActivity(intent);
    }

}