package org.androidtown.signupdemo;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
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
import java.sql.Date;

import Model.Order;
import info.guardianproject.netcipher.NetCipher;

public class WriteReview extends AppCompatActivity {
    EditText reviewText;
    int score;
    RadioGroup scoreButton;
    JSONObject jsonObject;
    Order order;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review3);
        order = (Order) getIntent().getSerializableExtra("order");


    }

    public void btCancel(View v){
        Intent intent = new Intent(WriteReview.this, ShowReview.class);
        intent.putExtra("order", order);
        startActivity(intent);
        finish();
    }
    public void btConfirm(View v){
        reviewText = (EditText) findViewById(R.id.editText);
        scoreButton = (RadioGroup) findViewById(R.id.scoreRadio) ;
        int id = scoreButton.getCheckedRadioButtonId();

        if(reviewText.getText().length() <= 0 || id == -1) {
            Toast.makeText(getApplicationContext(), "Please enter score and content.", Toast.LENGTH_SHORT).show();
            return;
        }
        RadioButton scoreChecked = (RadioButton) findViewById(id);
        score = Integer.parseInt(scoreChecked.getText().toString().substring(0, 1));
        int res_code = order.getRestaurant_Code();
        jsonObject = new JSONObject();
        try {
            jsonObject.accumulate("reviewtext", reviewText.getText().toString());
            jsonObject.accumulate("res_code", res_code);
            jsonObject.accumulate("score", score);
        }
        catch (JSONException e1) {

            // TODO Auto-generated catch block

            e1.printStackTrace();

        }


        JSONTask task = new JSONTask();
        task.execute("https://freeorder3.herokuapp.com/auth/android/writereview");//AsyncTask 시작시킴

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
                    //con = (HttpURLConnection) url.openConnection();
                    con = NetCipher.getHttpsURLConnection(url);
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
            Toast.makeText(getApplicationContext(), result, Toast.LENGTH_LONG).show();
            Intent intent = new Intent(WriteReview.this, ShowReview.class);
            intent.putExtra("order", order);
            startActivity(intent);
            finish();
        }
    }
}
