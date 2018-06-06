package listadpater;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.nostra13.universalimageloader.cache.memory.impl.WeakMemoryCache;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;
import com.nostra13.universalimageloader.core.assist.ImageScaleType;
import com.nostra13.universalimageloader.core.display.FadeInBitmapDisplayer;

import org.androidtown.signupdemo.R;
import Model.Restaurant;

import java.util.ArrayList;

/**
 * Created by wnlwn on 2018-04-11.
 */

public class RestaurantListAdapter extends ArrayAdapter<Restaurant> {

    private static final String Tag = "RestaurantListAdapter";

    private Context mcontext;
    private int mresources;
    private int lastPosition =-1;


    private  static class ViewHolder{
        TextView name;
        //TextView rate;
        TextView delayTime;
        TextView time;
        ImageView img;
    }

    public RestaurantListAdapter(Context context, int resource, ArrayList<Restaurant> objects){
        super(context, resource, objects);
        mcontext = context;
        mresources = resource;
    }

    public View getView(int position, View convertView, ViewGroup parent){

        setupImageLoader();
        //Adapter가 가지고 있는 data를 어떻게 보여줄것인가 ex)list item의 모양을 결정
        //ListView가 각각의 list item 그릴때 Adapter에게 어떻게 그릴지 묻는 함수 getView()
        //convertView는 처음에 null. 그후 화면에서
        String name = getItem(position).getRst_name();
        //int rate = getItem(position).getRate();
        String opentime = getItem(position).getOpentime();
        String imgURL = "https://freeorder1010.herokuapp.com/images/"+getItem(position).getImgURL();
        String closetime = getItem(position).getClosetime();
        int delayTime = getItem(position).getDelayTime();

        final View result;

        ViewHolder holder;


        if(convertView == null){ // 처음화면에서는 convertview가 널값.
            LayoutInflater inflater = LayoutInflater.from(mcontext);
            convertView = inflater.inflate(mresources,parent,false);
            holder = new ViewHolder();
            holder.name = (TextView) convertView.findViewById(R.id.textView1);
            holder.time = (TextView) convertView.findViewById(R.id.textView2);
            holder.delayTime = (TextView) convertView.findViewById(R.id.textView3);
            holder.img = (ImageView) convertView.findViewById(R.id.image_restaurant);
            //holder.img = (ImageView) convertView.findViewById(R.id.image_restaurant);
            result = convertView;
            convertView.setTag(holder); //holder에 textview위치 입력
        }
        else{
            holder = (ViewHolder) convertView.getTag(); //holder에 textview위치 입력
            result = convertView;
        }

        Animation animation = AnimationUtils.loadAnimation(mcontext, (position > lastPosition) ?
        R.anim.load_down_anim : R.anim.load_up_anim);
        result.startAnimation(animation);
        lastPosition = position;

        int defalutimage = mcontext.getResources().getIdentifier("@drawable/image_failed", null,
                mcontext.getPackageName());

        //이미지로더
        ImageLoader imageLoader = ImageLoader.getInstance();
        DisplayImageOptions options = new DisplayImageOptions.Builder().cacheInMemory(true)
                .cacheOnDisc(true).resetViewBeforeLoading(true)
                .showImageForEmptyUri(defalutimage)
                .showImageOnFail(defalutimage)
                .showImageOnLoading(defalutimage).build();

        imageLoader.displayImage(imgURL, holder.img, options);

        holder.time.setText(opentime + " ~ " + closetime);
        holder.name.setText(name);
        holder.delayTime.setText("Expected Delay : "+delayTime+"m");
//        if(rate ==1) holder.rate.setText("★☆☆☆☆");
//        else if(rate ==2) holder.rate.setText("★★☆☆☆");
//        else if(rate ==3) holder.rate.setText("★★★☆☆");
//        else if(rate ==4) holder.rate.setText("★★★★☆");
//        else if(rate ==5) holder.rate.setText("★★★★★");
//        else if(rate ==0) holder.rate.setText("No rate");


//        if(name.equals("BBQ CHICKEN")) holder.img.setImageResource(R.drawable.bbq);
//        if(name.equals("KFC")) holder.img.setImageResource(R.drawable.kfc);
//        if(name.equals("DOMINO PIZZA")) holder.img.setImageResource(R.drawable.domino);
//        if(name.equals("GOOBNE CHICKEN")) holder.img.setImageResource(R.drawable.goobne);
//        if(name.equals("KYOCHON CHICKEN")) holder.img.setImageResource(R.drawable.kyochon);
//        if(name.equals("MR.PIZZA")) holder.img.setImageResource(R.drawable.mrpizza);
//        if(name.equals("PIZZA SCHOOL")) holder.img.setImageResource(R.drawable.pizzaschool);
//        if(name.equals("SCHOOL FOOD")) holder.img.setImageResource(R.drawable.school);



        return convertView;
    }

    private void setupImageLoader(){
        // UNIVERSAL IMAGE LOADER SETUP
        DisplayImageOptions defaultOptions = new DisplayImageOptions.Builder()
                .cacheOnDisc(true).cacheInMemory(true)
                .imageScaleType(ImageScaleType.EXACTLY)
                .displayer(new FadeInBitmapDisplayer(300)).build();

        ImageLoaderConfiguration config = new ImageLoaderConfiguration.Builder(
                mcontext)
                .defaultDisplayImageOptions(defaultOptions)
                .memoryCache(new WeakMemoryCache())
                .discCacheSize(100 * 1024 * 1024).build();

        ImageLoader.getInstance().init(config);
        // END - UNIVERSAL IMAGE LOADER SETUP
    }

}
