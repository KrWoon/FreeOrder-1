package listadpater;


import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import Model.Menu;
import org.androidtown.signupdemo.R;

import java.util.ArrayList;

/**
 * Created by wnlwn on 2018-04-11.
 */

public class MenuListAdapter extends ArrayAdapter<Menu> {

    private static final String Tag = "MenuListAdapter";

    private Context mcontext;
    private int mresources;
    private int lastPosition =-1;


    private  static class ViewHolder{
        TextView name;
        TextView price;
    }

    public MenuListAdapter(Context context, int resource, ArrayList<Menu> objects){
        super(context, resource, objects);
        mcontext = context;
        mresources = resource;
    }

    public View getView(int position, View convertView, ViewGroup parent){


        String name = getItem(position).getMenu_name();
        int price = getItem(position).getPrice();

        final View result;

        ViewHolder holder;


        if(convertView == null){ // 처음화면에서는 convertview가 널값.
            LayoutInflater inflater = LayoutInflater.from(mcontext);
            convertView = inflater.inflate(mresources,parent,false);
            holder = new ViewHolder();
            holder.name = (TextView) convertView.findViewById(R.id.textView_menu1);
            holder.price = (TextView) convertView.findViewById(R.id.textView_menu2);

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
        holder.name.setText(name);
        holder.price.setText(price+"");
        return convertView;
    }
}
