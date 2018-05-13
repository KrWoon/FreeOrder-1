package org.androidtown.signupdemo;


import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class SignUp extends AppCompatActivity {
    EditText username ;
    EditText useremail ;
    EditText userpw ;
    EditText confirmpw ;
    String page;
    JSONObject jsonObject;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
         username = (EditText)findViewById(R.id.userName);
         useremail = (EditText)findViewById(R.id.userEmail);
         userpw = (EditText)findViewById(R.id.userPassword);
        userpw.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
         confirmpw = (EditText)findViewById(R.id.confirmPassword);
        confirmpw.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
         page="signup";


        Button btn = (Button)findViewById(R.id.signUpButton);
        btn.setOnClickListener(new View.OnClickListener() {

            @Override

            public void onClick(View view) {
                if(username.getText().toString().length() == 0 ||
                        useremail.getText().toString().length() == 0 ||
                        userpw.getText().toString().length() == 0 ||
                        confirmpw.getText().toString().length() == 0
                        ) Toast.makeText(getApplicationContext(),"Fill the blank",Toast.LENGTH_LONG).show();
                else if(!userpw.getText().toString().equals(confirmpw.getText().toString())){
                    Toast.makeText(getApplicationContext(),"Confirmpassword is not match",Toast.LENGTH_LONG).show();
                }
                else {
                    jsonObject = new JSONObject();
                    try {
                        jsonObject.accumulate("username", username.getText().toString());
                        jsonObject.accumulate("email", useremail.getText().toString());
                        jsonObject.accumulate("password", userpw.getText().toString());
                        jsonObject.accumulate("page", page);
                    }
                    catch (JSONException e1) {

                    // TODO Auto-generated catch block

                    e1.printStackTrace();

                }

                    JSONTask task = new JSONTask();
                    task.execute("http://172.30.1.35:3000/auth/android/register");//AsyncTask 시작시킴
                }
                }

        });
    }


    public class JSONTask extends AsyncTask<String, String, String> {

        @Override

        protected String doInBackground(String... urls) {

            try {
                //JSONObject를 만들고 key value 형식으로 값을 저장해준다.
                HttpURLConnection con = null;
                BufferedReader reader = null;
                try {
                    URL url = new URL(urls[0]);
                    //연결을 함
                    con = (HttpURLConnection) url.openConnection();
                    con.setRequestMethod("POST");//POST방식으로 보냄
                    con.setRequestProperty("Cache-Control", "no-cache");//캐시 설정
                    con.setRequestProperty("Content-Type", "application/json");//application JSON 형식으로 전송
                    con.setRequestProperty("Accept", "text/html");//서버에 response 데이터를 html로 받음
                    con.setDoOutput(true);//Outstream으로 post 데이터를 넘겨주겠다는 의미
                    con.setDoInput(true);//Inputstream으로 서버로부터 응답을 받겠다는 의미
                    con.connect();
                    //서버로 보내기위해서 스트림 만듬

                    OutputStream outStream = con.getOutputStream();
                    //버퍼를 생성하고 넣음
                    BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outStream));
                    writer.write(jsonObject.toString());
                    writer.flush();
                    writer.close();//버퍼를 받아줌
                    //서버로 부터 데이터를 받음
                    InputStream stream = con.getInputStream();
                    reader = new BufferedReader(new InputStreamReader(stream));
                    StringBuffer buffer = new StringBuffer();
                    String line = "";
                    while ((line = reader.readLine()) != null) {
                        buffer.append(line);
                    }
                    return buffer.toString();//서버로 부터 받은 값을 리턴해줌 아마 OK!!가 들어올것임
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    if (con != null) {
                        con.disconnect();
                    }
                    try {
                        if (reader != null) {
                            reader.close();//버퍼를 닫아줌
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            Toast.makeText(getApplicationContext(),result,Toast.LENGTH_LONG).show();
        }
    }
}


