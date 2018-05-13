package org.androidtown.signupdemo;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.widget.SearchView;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

import Model.Order;

public class Main extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {

    private Order order;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        order = (Order) getIntent().getSerializableExtra("order");
        String my_email = order.getEmail();
        //LayoutInflater layoutInflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);
        //View myview = layoutInflater.inflate(R.layout.common_nav_header,null,false);
        //TextView textView_myemail = (TextView) myview.findViewById(R.id.textview_myemail);
        //textView_myemail.setText(my_email);
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        ImageButton showallfood = (ImageButton) findViewById(R.id.showallfood);
        showallfood.setImageResource(R.drawable.showall);
        ImageButton chicken = (ImageButton) findViewById(R.id.chicken);
        chicken.setImageResource(R.drawable.chicken);
        ImageButton koreanfood = (ImageButton) findViewById(R.id.koreanfood);
        koreanfood.setImageResource(R.drawable.korean);
        ImageButton chinesefood = (ImageButton) findViewById(R.id.chinesefood);
        chinesefood.setImageResource(R.drawable.chinese);
        ImageButton pizza = (ImageButton) findViewById(R.id.pizza);
        pizza.setImageResource(R.drawable.pizza);
        ImageButton schoolfood = (ImageButton) findViewById(R.id.schoolfood);
        schoolfood.setImageResource(R.drawable.school);
        ImageButton japanesefood = (ImageButton) findViewById(R.id.japanesefood);
        japanesefood.setImageResource(R.drawable.japan);

        showallfood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        chicken.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","chicken");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        koreanfood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","korean");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        chinesefood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","chinese");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        pizza.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","pizza");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        schoolfood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","school food");
                i.putExtra("order",order);
                startActivity(i);
            }
        });
        japanesefood.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key","japanese");
                i.putExtra("order",order);
                startActivity(i);
            }
        });

    }

//    public void setOnClickListenerr(final ImageButton btn, Order order){
//
//        btn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Intent i = new Intent(getApplicationContext(), Search.class);
//                Toast.makeText(getApplicationContext(),""+btn.getTransitionName(),Toast.LENGTH_LONG).show();
//                i.putExtra("search_key",""+btn.getId());
//
//                startActivity(i);
//            }
//        });
//    }


    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    SearchView searchView;

    @Override
    public boolean onCreateOptionsMenu(Menu menu) { //액션바가있다면 액션바에 무엇을 표현할것인가를 추가.
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.actionbar_serach, menu);//검색버튼만들기

        searchView = (SearchView) menu.findItem(R.id.action_search).getActionView();

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {//SearchView리스너
            @Override
            public boolean onQueryTextSubmit(String s) {

                Intent i = new Intent(getApplicationContext(), Search.class);
                i.putExtra("search_key",s);
                i.putExtra("order",order);
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

    /*@Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }*/

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
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
}
