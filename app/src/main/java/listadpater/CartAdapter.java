package listadpater;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amulyakhare.textdrawable.TextDrawable;

import org.androidtown.signupdemo.R;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import Interface.ItemClickListener;
import Model.Order;


/**
 * Created by wnlwn on 2018-05-08.
 */

class CartViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener{

    public TextView txt_cart_name, txt_option_name, txt_price;
    private ItemClickListener itemClickListener;



    public void setTxt_cart_name(TextView txt_cart_name) {
        this.txt_cart_name = txt_cart_name;
    }

    public void setTxt_option_name(TextView txt_option_name) {
        this.txt_option_name = txt_option_name;
    }

    public void setTxt_price(TextView txt_price) {
        this.txt_price = txt_price;
    }

    public CartViewHolder(View itemView){
        super(itemView);
        txt_cart_name=(TextView) itemView.findViewById(R.id.cart_item_name);
        txt_option_name=(TextView) itemView.findViewById(R.id.cart_item_option);
        txt_price=(TextView) itemView.findViewById(R.id.cart_price);


    }
    public void onClick(View view){
       }

}

public class CartAdapter extends RecyclerView.Adapter<CartViewHolder> {

    private List<Order> listData =new ArrayList<>();
    private Context context;

    public CartAdapter(List<Order> listData, Context context) {
        this.listData = listData;
        this.context = context;
    }

    @Override
    public CartViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View itemView = inflater.inflate(R.layout.cart_layout,parent,false);
        return new CartViewHolder(itemView);

    }

    @Override
    public void onBindViewHolder(CartViewHolder holder, int position) {
        Locale locale = new Locale("en","US");
        NumberFormat fmt = NumberFormat.getCurrencyInstance(locale);
        int price =(listData.get(position).getMenu_Price()+
                listData.get(position).getSumMenuOptionPrice());
        holder.txt_price.setText(fmt.format(price));
        holder.txt_cart_name.setText(listData.get(position).getMenu_Name());
        holder.txt_option_name.setText(listData.get(position).getSumMenuOptionName());
    }

    @Override
    public int getItemCount() {
        return listData.size();
    }
}
