package org.androidtown.signupdemo;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.NavigationView;
import android.support.design.widget.Snackbar;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SearchView;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;

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

import Model.Order;
import Model.Restaurant;
import info.guardianproject.netcipher.NetCipher;
import listadpater.RestaurantListAdapter;

public class Search extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {
    TextView view;
    String query;
    JSONObject jsonObject;
    JSONParser jsonParser;
    JSONObject jsonObj ;
    JSONArray restaurantArray ;
    ListView mListView;
    Context mcontext;
    RestaurantListAdapter adapter;
    ArrayList<Restaurant> restaurantlist = new ArrayList<>();
    Order order;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

//            FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
//            }
//        });
//        FloatingActionButton fab =(FloatingActionButton) findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Intent cartIntent = new Intent(getApplicationContext(), ShowCart.class);
//                cartIntent.putExtra("order",order);
//                startActivity(cartIntent);
//            }
//        });

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();
        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
        //
        order = (Order) getIntent().getSerializableExtra("order");
        query = getIntent().getStringExtra("search_key");//전 인텐트에서 전달받은 데이터
        jsonObject = new JSONObject();
        jsonObject.put("query", query);
        mcontext = this;
        JSONTask task = new JSONTask();
        task.execute("https://freeorder3.herokuapp.com/auth/search");//AsyncTask 시작시킴
        //192.168.43.209

    }


    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }
    SearchView searchView;
    public boolean onCreateOptionsMenu(Menu menu) {//앱바서 검색시 다시...
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.actionbar_serach, menu);

        searchView = (SearchView) menu.findItem(R.id.action_search).getActionView();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String s) {

                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key",s);
                startActivity(i);

                return false;
            }
            @Override
            public boolean onQueryTextChange(String s) {
                return false;
            }
        });
        return true;
    }
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camera) {
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
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
                    con = NetCipher.getHttpsURLConnection(url);

                   //con = (HttpURLConnection) url.openConnection();
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
                 restaurantArray = (JSONArray) jsonObj.get("RESTAURANTS");


                 System.out.println("respond");
                 for(int i=0; i<restaurantArray.size() ; i++){
                     JSONObject tempObj = (JSONObject) restaurantArray.get(i);
                     Restaurant tempRst = new Restaurant(tempObj.get("name").toString(),Integer.parseInt(tempObj.get("rate").toString()),
                             tempObj.get("opentime").toString(),tempObj.get("closetime").toString(),tempObj.get("imgUrl").toString(),
                             Integer.parseInt(tempObj.get("rstcode").toString()),Integer.parseInt(tempObj.get("delayTime").toString()),
                             Float.parseFloat(tempObj.get("latitude").toString()),Float.parseFloat(tempObj.get("longitude").toString()),
                             tempObj.get("tel").toString());
                     restaurantlist.add(tempRst);
                 }
                mListView = (ListView) findViewById(R.id.listview);
                adapter = new RestaurantListAdapter(mcontext, R.layout.listview_restaurant,restaurantlist);
                mListView.setAdapter(adapter);
                mListView.setOnItemClickListener(mItemClickListener);


                }
                catch(ParseException e){
                e.printStackTrace();
            }
        }
    }
    private AdapterView.OnItemClickListener mItemClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position,
                                long l_position) {
            // parent는 AdapterView의 속성의 모두 사용 할 수 있다.
            // ListAdapter의 클릭리스너
            Restaurant a = (Restaurant) parent.getAdapter().getItem(position);
            Intent i = new Intent(getApplicationContext(), ShowMenu.class);
            order.setRestaurant_Name(a.getRst_name());
            order.setRestaurant_rate(a.getRate());
            order.setRestaurant_OpenTime(a.getOpentime());
            order.setRestaurant_CloseTime(a.getClosetime());
            order.setRestaurant_Code(a.getRst_code());
            order.setRestaurant_delayTime(a.getDelayTime());
            order.setRestaurant_Latitude(a.getLatitude());
            order.setRestaurant_Longitude(a.getLongitude());
            order.setRestaurant_Tel(a.getTel());
            i.putExtra("order",order);
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



}
