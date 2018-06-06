package org.androidtown.signupdemo;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;

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
import java.util.ArrayList;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import javax.net.ssl.HttpsURLConnection;

import Model.Menu;
import Model.Order;
import cz.msebera.android.httpclient.protocol.HTTP;
import info.guardianproject.netcipher.NetCipher;
import listadpater.MenuListAdapter;

public class ShowMenu extends AppCompatActivity {
    TextView view;
    String query;
    JSONObject jsonObject;
    JSONParser jsonParser;
    JSONObject jsonObj;
    JSONArray menuArray;
    ListView mListView;
    Context mcontext;
    MenuListAdapter adapter;
    ArrayList<Menu> menulist = new ArrayList<>();
    Order order;
    Bitmap bitmap;
    String imgUrl;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);
        order = (Order) getIntent().getSerializableExtra("order");
        String rst_name = getIntent().getStringExtra("rst_name");
        int rate = getIntent().getIntExtra("rate", 1);
        String opentime = getIntent().getStringExtra("opentime");
        String closetime = getIntent().getStringExtra(("closetime"));
        imgUrl = getIntent().getStringExtra("imgUrl");

        TextView tv1 = (TextView) findViewById(R.id.textView1_menu);
        TextView tv2 = (TextView) findViewById(R.id.textView2_menu);
        TextView tv3 = (TextView) findViewById(R.id.textView3_menu);
        ImageView iv = (ImageView) findViewById(R.id.image_restaurant_menu);
        Button btnReview = (Button) findViewById(R.id.button4);
        tv1.setText(rst_name);
        tv2.setText(rate + "");
        tv3.setText(opentime + "~" + closetime);

        //레스토랑 이미지로더 bitmap으로 불러오기
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
            iv.setImageBitmap(bitmap);
        } catch (InterruptedException e) {
        }

        jsonObject = new JSONObject();
        jsonObject.put("query", rst_name);
        mcontext = this;
        JSONTask task = new JSONTask();
        task.execute("https://freeorder3.herokuapp.com/auth/menu");//AsyncTask 시작시킴

        btnReview.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent Intent = new Intent(ShowMenu.this,ShowReview.class);
                Intent.putExtra("order",order);
                Intent.putExtra("imgUrl",imgUrl);
                startActivity(Intent);
            }
        });

        FloatingActionButton fab =(FloatingActionButton) findViewById(R.id.fab2);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent cartIntent = new Intent(ShowMenu.this,ShowCart.class);
                cartIntent.putExtra("order",order);
                startActivity(cartIntent);
            }
        });


    }
//    public void reviewButtonAction(){
//        Intent intent = new Intent(ShowMenu.this, ShowReview.class);
//        intent.putExtra("order", order);
//        startActivity(intent);
//    }

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
                    con = NetCipher.getHttpsURLConnection(url);

//                    con = (HttpURLConnection) url.openConnection();
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
                menuArray = (JSONArray) jsonObj.get("MENUS");

                for(int i=0; i<menuArray.size() ; i++){
                    JSONObject tempObj = (JSONObject) menuArray.get(i);
                    Menu tempMenu = new Menu(Integer.parseInt(tempObj.get("menucode").toString()),
                            tempObj.get("name").toString(),
                            Integer.parseInt(tempObj.get("price").toString()),
                            Integer.parseInt(tempObj.get("cookingTime").toString()));
                    menulist.add(tempMenu);
                }
                mListView = (ListView) findViewById(R.id.listview_Menu);
                adapter = new MenuListAdapter(mcontext, R.layout.listview_menu,menulist);
                mListView.setAdapter(adapter);
                mListView.setOnItemClickListener(mItemClickListener);

            }
            catch(ParseException e){
                e.printStackTrace();
            }
        }
    }

    /*private AdapterView.OnItemClickListener mItemClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position,
                                long l_position) {
            // parent는 AdapterView의 속성의 모두 사용 할 수 있다.
            // ListAdapter의 클릭리스너
            Restaurant a = (Restaurant) parent.getAdapter().getItem(position);
            Intent i = new Intent(getApplicationContext(), ShowMenu.class);
            i.putExtra("rst_name",a.getRst_name());
            i.putExtra("rate",a.getRate());
            i.putExtra("opentime",a.getOpentime());
            i.putExtra("closetime",a.getClosetime());
            i.putExtra("imgUrl",a.getImgURL());
            startActivity(i);
            // view는 클릭한 Row의 view를 Object로 반환해 준다.
            //TextView tv_view = (TextView)view.findViewById(R.id.);
            //tv_view.setText("바꿈");

        }
    };
*/
    private AdapterView.OnItemClickListener mItemClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position,
                                long l_position) {
            // parent는 AdapterView의 속성의 모두 사용 할 수 있다.
            // ListAdapter의 클릭리스너
            Menu a = (Menu) parent.getAdapter().getItem(position);
            order.setMenu_Code(a.getMenu_code());
            order.setMenu_Name(a.getMenu_name());
            order.setMenu_Price(a.getPrice());
            order.setMenu_delayTime(a.getCookingTime());
            Intent i = new Intent(getApplicationContext(), ShowMenuOption.class);
            i.putExtra("order",order);
            startActivity(i);
            // view는 클릭한 Row의 view를 Object로 반환해 준다.
            //TextView tv_view = (TextView)view.findViewById(R.id.);
            //tv_view.setText("바꿈");

        }
    };
}
