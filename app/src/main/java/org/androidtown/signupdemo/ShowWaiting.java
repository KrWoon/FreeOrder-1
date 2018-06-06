package org.androidtown.signupdemo;

import android.os.CountDownTimer;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

import java.util.Locale;

import android.app.FragmentManager;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Toast;


import com.google.android.gms.maps.CameraUpdateFactory;

import com.google.android.gms.maps.GoogleMap;

import com.google.android.gms.maps.MapFragment;

import com.google.android.gms.maps.OnMapReadyCallback;

import com.google.android.gms.maps.model.LatLng;

import com.google.android.gms.maps.model.MarkerOptions;

import Model.Order;

public class ShowWaiting extends AppCompatActivity implements OnMapReadyCallback {
    private static final long START_TIME_IN_MILLIS = 600000;
    private TextView mTextViewCountDown;
    private TextView tel;
    private CountDownTimer mCountDownTime;
    private  boolean mTimerRunning;
    private long mTimeLeftInMillis;
    private Order globalOrder;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_waiting);
        globalOrder = (Order) getIntent().getSerializableExtra("globalOrder");

        mTextViewCountDown = findViewById(R.id.text_countDown);
        mTimeLeftInMillis = (long) getIntent().getIntExtra("expectedTime",1)*60000;
        startTimer();

        tel = findViewById(R.id.text_tel);
        tel.setText(globalOrder.getRestaurant_Tel());

        FragmentManager fragmentManager = getFragmentManager();
        MapFragment mapFragment = (MapFragment)fragmentManager.findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        Toast.makeText(getApplicationContext(), "Wait! In 30seconds, your order can be cancelled", Toast.LENGTH_LONG).show();


    }
    private void startTimer(){
        mCountDownTime = new CountDownTimer(mTimeLeftInMillis, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                mTimeLeftInMillis = millisUntilFinished;
                updateCountDownText();
            }
            @Override
            public void onFinish() {
                mTimerRunning =false;
            }
        }.start();
        mTimerRunning = true;
    }
    private void updateCountDownText(){
        int minutes = (int) (mTimeLeftInMillis/1000) /60;
        int seconds = (int) (mTimeLeftInMillis /1000) %60;

        String timeLeftFormatted = String.format(Locale.getDefault(), "%02d:%02d",minutes,seconds);
        mTextViewCountDown.setText(timeLeftFormatted);
    }

    public void onMapReady(final GoogleMap map) {
        //Toast.makeText(this,globalOrder.getRestaurant_Latitude()+"  "+
         //       globalOrder.getRestaurant_Longitude(),Toast.LENGTH_LONG).show();

        LatLng Target = new LatLng(globalOrder.getRestaurant_Latitude(), globalOrder.getRestaurant_Longitude());
        MarkerOptions markerOptions = new MarkerOptions();
        markerOptions.position(Target);
        markerOptions.title(globalOrder.getRestaurant_Name());
        markerOptions.snippet("Restaurant");
        map.addMarker(markerOptions);
        map.moveCamera(CameraUpdateFactory.newLatLng(Target));
        map.animateCamera(CameraUpdateFactory.zoomTo(10));
    }


}
