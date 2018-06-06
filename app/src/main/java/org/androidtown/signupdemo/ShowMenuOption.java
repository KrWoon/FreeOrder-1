package org.androidtown.signupdemo;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CheckedTextView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

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

import Database.Database;
import Model.MenuOption;
import Model.Order;
import info.guardianproject.netcipher.NetCipher;
import listadpater.MenuOptionListAdapter;

public class ShowMenuOption extends AppCompatActivity {
    TextView view;
    String query;
    JSONObject jsonObject;
    JSONParser jsonParser;
    JSONObject jsonObj ;
    JSONArray menuOptionArray ;
    ListView mListView;
    Context mcontext;
    MenuOptionListAdapter adapter;
    ArrayList<MenuOption> menuOptionList = new ArrayList<>();
    ArrayList<MenuOption> menuOptionList2 = new ArrayList<>();
    ArrayList<Integer> menuOptionCodeList = new ArrayList<>();
    Order order;
    ArrayList<Order> orderList = new ArrayList<>();
    Button btnCart;
    Button btnCancel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        System.out.println("Ok");
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menuoption);
        order = (Order) getIntent().getSerializableExtra("order");
        int menuCode= order.getMenu_Code();
        //String rst_name = getIntent().getStringExtra("rst_name");
        //int rate = getIntent().getIntExtra("rate",1);
        //String opentime = getIntent().getStringExtra("opentime");
        //String closetime = getIntent().getStringExtra(("closetime"));
        //String imgUrl = getIntent().getStringExtra("imgUrl");
        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);

        int width = dm.widthPixels;
        int height = dm.heightPixels;

        getWindow().setLayout((int)(width*.9),(int)(height*.7));

        jsonObject = new JSONObject();
        jsonObject.put("query", menuCode);
        mcontext = this;
        JSONTask task = new JSONTask();
        task.execute("https://freeorder3.herokuapp.com/auth/menuoption");//AsyncTask 시작시킴



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
                menuOptionArray = (JSONArray) jsonObj.get("MENUOPTIONS");

                for(int i=0; i<menuOptionArray.size() ; i++){
                    JSONObject tempObj = (JSONObject) menuOptionArray.get(i);
                    MenuOption tempMenuOption = new MenuOption(
                            Integer.parseInt(tempObj.get("code").toString()),
                            tempObj.get("name").toString(),
                            Integer.parseInt(tempObj.get("price").toString()));
                    menuOptionList.add(tempMenuOption);
                }
                mListView = (ListView) findViewById(R.id.listview_menuoption);
                mListView.setChoiceMode(ListView.CHOICE_MODE_MULTIPLE);
                adapter = new MenuOptionListAdapter(mcontext, R.layout.listview_menuoption,menuOptionList);
                mListView.setAdapter(adapter);
                mListView.setOnItemClickListener(mItemClickListener);

                //액티비티 inflate 후 카트버튼 리스너
                btnCart = (Button) findViewById(R.id.btn_addToCart);
                btnCancel = (Button) findViewById(R.id.btn_cancel);
                btnCancel.setOnClickListener(new View.OnClickListener(){
                    public void onClick(View view){
                        finish();
                        //new Database(getBaseContext()).cleanCart();
                    }
                });
                btnCart.setOnClickListener(new View.OnClickListener(){

                    public void onClick(View view){

                            Order tempOrder = new Order();
                            tempOrder.setRestaurant_delayTime(order.getRestaurant_delayTime());
                            tempOrder.setMenu_delayTime(order.getMenu_delayTime());
                            tempOrder.setEmail(order.getEmail());
                            tempOrder.setMenu_Code(order.getMenu_Code());
                            tempOrder.setMenu_Price(order.getMenu_Price());
                            tempOrder.setMenu_Name(order.getMenu_Name());
                            tempOrder.setRestaurant_Code(order.getRestaurant_Code());
                            tempOrder.setMenuOption_List(menuOptionList2);
                            orderList.add(tempOrder);
                        for(int i=0; i<orderList.size(); i++) {
                            new Database(getBaseContext()).addToCart(orderList.get(i));
                        }
                        Toast.makeText(mcontext,"Added to basket",Toast.LENGTH_LONG).show();
                    }
                });

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

            CheckedTextView ctv = (CheckedTextView)view.findViewById(R.id.CheckedTextView_menuoption1);
            if(ctv.isChecked()) {
                ctv.setChecked(false);
            }
            else{
                ctv.setChecked(true);
            }
            MenuOption a = (MenuOption) parent.getAdapter().getItem(position);
            int selectedCode = a.getMenuoption_code();
            boolean tag = true;
            //Toast.makeText(mcontext,"d"+selectedCode+"d"+"-"+menuOptionCodeList.contains(selectedCode),Toast.LENGTH_LONG).show();
            if(menuOptionList2.isEmpty()) menuOptionList2.add(a);
            else {
                for (int i = 0; i < menuOptionList2.size(); i++) {
                    if (menuOptionList2.get(i).getMenuoption_code() == selectedCode) {
                        menuOptionList2.remove(i);
                        tag=false;
                    }
                }
                if(tag == true) menuOptionList2.add(a);

            }

      }
    };

//    public void showSelcectedCodes(View view){
//        String items ="";
////        for(int i=0; i<menuOptionList2.size(); i++){
////            items += "-"+menuOptionList2.get(i).getMenuoption_code()+"\n";
////        }
////        Toast.makeText(this,""+items,Toast.LENGTH_LONG).show();
//
//        for(int i=0; i<menuOptionList2.size(); i++){
//            Order tempOrder = new Order();
//            tempOrder.setEmail(order.getEmail());
//            tempOrder.setMenu_Code(order.getMenu_Code());
//            tempOrder.setMenu_Price(order.getMenu_Price());
//            tempOrder.setMenu_Name(order.getMenu_Name());
//            tempOrder.setRestaurant_Code(order.getRestaurant_Code());
//            tempOrder.setMenuOption_Code(menuOptionList2.get(i).getMenuoption_code());
//            tempOrder.setMenuOption_Price(menuOptionList2.get(i).getMenuoption_price());
//            tempOrder.setMenuOption_Name(menuOptionList2.get(i).getMenuoption_name());
//            orderList.add(tempOrder);
//
//        }
//        for(int i=0; i<orderList.size(); i++){
//           new Database(getBaseContext()).addToCart(orderList.get(i));
//        }
//        //Toast.makeText(this,""+items,Toast.LENGTH_LONG).show();
//        //db.addToCart(tempOrder);
//
//
//    }

}
