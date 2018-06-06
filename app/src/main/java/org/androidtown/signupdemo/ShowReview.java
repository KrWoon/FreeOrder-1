package org.androidtown.signupdemo;

        import android.content.Intent;
        import android.graphics.Bitmap;
        import android.graphics.BitmapFactory;
        import android.graphics.Color;
        import android.os.AsyncTask;
        import android.support.v4.content.ContextCompat;
        import android.support.v7.app.AppCompatActivity;
        import android.os.Bundle;
        import android.support.v7.widget.AppCompatTextView;
        import android.view.View;
        import android.widget.Button;
        import android.widget.ImageView;
        import android.widget.LinearLayout;
        import android.widget.TextView;

        import org.json.simple.JSONArray;
        import org.json.simple.JSONObject;
        import org.json.simple.parser.JSONParser;
        import org.json.simple.parser.ParseException;

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
        import java.text.SimpleDateFormat;
        import java.util.ArrayList;

        import Model.Order;
        import Model.Review;
        import info.guardianproject.netcipher.NetCipher;

        import static android.view.Gravity.CENTER;
        import static android.view.Gravity.CENTER_HORIZONTAL;

public class ShowReview extends AppCompatActivity {

    TextView view;
    JSONObject jsonObject;
    JSONParser jsonParser;
    JSONObject jsonObj ;
    JSONArray reviewArray ;
    ArrayList<Review> reviewList = new ArrayList<>();
    Order order;
    String imgUrl;
    Bitmap bitmap;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review);
        order = (Order) getIntent().getSerializableExtra("order");
        imgUrl = getIntent().getStringExtra("imgUrl");

        ImageView rest_Image = (ImageView) findViewById(R.id.restaurant_image);
        Thread mThread = new Thread() {
            public void run() {
                try {
                    URL url = new URL("https://freeorder1010.herokuapp.com/images/" + imgUrl);

                    HttpURLConnection con = (HttpURLConnection) url.openConnection();
                    con.setDoInput(true);
                    con.connect();

                    InputStream is = con.getInputStream();
                    bitmap = BitmapFactory.decodeStream(is);

                } catch (MalformedURLException e) {
                } catch (IOException e) {
                }
            }
        };

        mThread.start();
        try {
            mThread.join();
            rest_Image.setImageBitmap(bitmap);
        } catch (InterruptedException e) {
        }


        //ImageView rest_Image = (ImageView) findViewById(R.id.restaurant_image);
        TextView rest_title = (TextView) findViewById(R.id.restaurant_title);
        //rest_Image.setImageDrawable();                                                    //레스토랑 사진
        rest_title.setText(order.getRestaurant_Name());                                                             //레스토랑 이름

        /**/
        //////////////////
        int rst_code = order.getRestaurant_Code();
        jsonObject = new JSONObject();
        jsonObject.put("query", rst_code);
        JSONTask task = new JSONTask();
        task.execute("https://freeorder3.herokuapp.com/auth/Review");//AsyncTask 시작시킴

        //////////////////
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
            try{
                jsonParser = new JSONParser();
                jsonObj = (JSONObject) jsonParser.parse(result);
                reviewArray = (JSONArray) jsonObj.get("REVIEWS");
                System.out.println("respond");
                for(int i=0; i<reviewArray.size() ; i++){
                    JSONObject tempObj = (JSONObject) reviewArray.get(i);
                    try {
                        String date = tempObj.get("AddedDate").toString().substring(0, 10);
                        String time = tempObj.get("AddedDate").toString().substring(11, 19);
                        String dateTime = date + " " + time;
                        Review tempRst = new Review(

                                1, Integer.parseInt(tempObj.get("res_Code").toString()), tempObj.get("reviewText").toString(), Integer.parseInt(tempObj.get("score").toString()), "Y", new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").parse(dateTime)
                        );
                        int j = 0;
                        for(j = 0; j < reviewList.size(); j++){
                            if(reviewList.get(j).getAddedDate().getTime() < tempRst.getAddedDate().getTime())
                                break;
                        }
                        reviewList.add(j, tempRst);
                    }
                    catch (Exception e){
                        e.printStackTrace();
                    }

                }


            }
            catch(ParseException e){
                e.printStackTrace();
            }
            makeRiview();
        }

    }
    public void makeRiview(){
        LinearLayout list = (LinearLayout) findViewById(R.id.linearList);
        list.setBackgroundColor(ContextCompat.getColor(this,R.color.colorPrimary));


        Button reviewBt = new Button(this);
        reviewBt.setText("Go to write review");
        reviewBt.setOnClickListener(new Button.OnClickListener(){
            public void onClick(View v) {
                Intent intent = new Intent(ShowReview.this, WriteReview.class);
                intent.putExtra("order", order);
                startActivity(intent);
                finish();
            }
        });
        list.addView(reviewBt);

        for(int i = 0; i < reviewList.size(); i++){
            TextView tvText = new AppCompatTextView(this);
            LinearLayout starList = new LinearLayout(this);
            starList.setOrientation(LinearLayout.HORIZONTAL);
            starList.setGravity(CENTER);
            for(int j = 0; j < reviewList.get(i).getScore(); j++) {
                ImageView star = new ImageView(this);

                star.setImageDrawable(getDrawable(R.drawable.star));
                star.setScaleType(ImageView.ScaleType.FIT_XY);
                star.setBackgroundColor(Color.RED);
                star.setLayoutParams(new LinearLayout.LayoutParams(100,100));
                starList.addView(star);
            }
            tvText.setWidth(200);
            //tvText.setHeight(200);
            tvText.setGravity(CENTER_HORIZONTAL);
            tvText.setBackgroundColor(Color.RED);
            tvText.setBackground(getDrawable(R.drawable.edittextstyle));
            tvText.setTextColor(Color.BLACK);
            long a = (System.currentTimeMillis() - reviewList.get(i).getAddedDate().getTime())/(60*1000);
            if(a < 60)
                tvText.setText(reviewList.get(i).getText() + "\n<" + a + " minute ago>");
            else if(a < 3600 && a >= 60)
                tvText.setText(reviewList.get(i).getText() + "\n<" + a/60 + " hour ago>");
            else
                tvText.setText(reviewList.get(i).getText() + "\n<" + a/60/3600 + " day ago>");

            LinearLayout textList = new LinearLayout(this);
            textList.setGravity(CENTER);
            textList.setOrientation(LinearLayout.HORIZONTAL);
            TextView temp = new TextView(this);
            temp.setWidth(50);
            temp.setHeight(50);
            //textList.addView(temp);
            //textList.addView(tvText);
            //textList.addView(temp);
            list.addView(starList);
            list.addView(tvText);
        }
    }
}
