package org.androidtown.signupdemo;

/**
 * Created by wnlwn on 2018-05-26.
 */

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.widget.Toast;

import com.google.firebase.messaging.RemoteMessage;

import Model.Order;


public class MyFirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {
    private static final String TAG = "FirebaseMsgService";
    public static int okFlag =0;
    public static Order globalOrder;
    public static int expectedtime;
    public static void setOrder(Order order, int expectedTime){
        globalOrder=order;
        expectedtime=expectedTime;

    }
    public void startOrder(){
        Intent i = new Intent(getApplicationContext(), ShowWaiting.class);
        i.putExtra("globalOrder", globalOrder);
        i.putExtra("expectedTime", expectedtime);
        //i.putExtra("order",getIntent().getSerializableExtra("order"));
        startActivity(i);
    }

    // [START receive_message]
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        //추가한것

        System.out.println(remoteMessage.getData().isEmpty());

        System.out.println(remoteMessage.getData().entrySet());



        System.out.println(remoteMessage.getData()+"");

        System.out.println(remoteMessage.getData()+"");

        //Toast.makeText(this,remoteMessage.getData().get("message")+"",Toast.LENGTH_LONG).show();
        //startOrder();
        sendNotification(remoteMessage.getData().get("message"));

    }

    private void sendNotification(String messageBody) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0 /* Request code */, intent,
                PendingIntent.FLAG_ONE_SHOT);

        Uri defaultSoundUri= RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("FCM Push Test")
                .setContentText(messageBody)
                .setAutoCancel(true)
                .setSound(defaultSoundUri)
                .setContentIntent(pendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }

}
