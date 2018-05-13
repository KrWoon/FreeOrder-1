package listadpater;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import Model.MenuOption;
import org.androidtown.signupdemo.R;

import java.util.ArrayList;

public class MenuOptionListAdapter extends ArrayAdapter<MenuOption> {

    private static final String Tag = "MenuOptionListAdapter";

    private Context mcontext;
    private int mresources;
    private int lastPosition =-1;


    private  static class ViewHolder{
        TextView name;
        TextView price;
    }

    public MenuOptionListAdapter(Context context, int resource, ArrayList<MenuOption> objects){
        super(context, resource, objects);
        mcontext = context;
        mresources = resource;

    }
    ViewHolder holder;
    public View getView(int position, View convertView, ViewGroup parent){

        String name = getItem(position).getMenuoption_name();
        int price = getItem(position).getMenuoption_price();

        final View result;




        if(convertView == null){ // 처음화면에서는 convertview가 널값.
            LayoutInflater inflater = LayoutInflater.from(mcontext);
            convertView = inflater.inflate(mresources,parent,false);
            holder = new ViewHolder();
            holder.name = (TextView) convertView.findViewById(R.id.CheckedTextView_menuoption1);
            holder.price = (TextView) convertView.findViewById(R.id.textView_menuoption2);

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
