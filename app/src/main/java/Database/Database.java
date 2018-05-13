package Database;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteQueryBuilder;

import com.readystatesoftware.sqliteasset.SQLiteAssetHelper;

import java.util.ArrayList;
import java.util.List;

import Model.MenuOption;
import Model.Order;

/**
 * Created by wnlwn on 2018-05-07.
 */

public class Database extends SQLiteAssetHelper {
    private static final String DB_NAME="orderDB.db";
    private static final int DB_VER=8;
//    public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion){
//        db.execSQL("DROP TABLE IF EXISTS OrderDetail");
//        db.execSQL("DROP TABLE IF EXISTS MenuOption");
//        db.execSQL("DROP TABLE IF EXISTS MenuOptionLink");
//        onCreate(db);
//    }
    public Database(Context context){
        super(context, DB_NAME, null, DB_VER);
        setForcedUpgrade();
    }

    public List<Order> getCarts() {
        SQLiteDatabase db = getReadableDatabase();
//        SQLiteQueryBuilder qb = new SQLiteQueryBuilder();
//
//        String[] sqlSelect = {"MenuName", "MenuPrice", "MenuOptionName", "MenuOptionPrice"};
//        String sqlTable = "OrderDetail";
//
//        qb.setTables(sqlTable);
//        Cursor c = qb.query(db, sqlSelect, null, null, null, null, null);
        Cursor c = db.rawQuery("SELECT OrderID FROM OrderDetail",null);
        final List<Integer> orderId = new ArrayList<>();
        final List<Order> result = new ArrayList<>();



        if(c.moveToFirst()){
            do{
                orderId.add(c.getInt(c.getColumnIndex("OrderID")));
            }while(c.moveToNext());
        }

        for(int i=0; i<orderId.size(); i++) {
            List<MenuOption> menuOptionList = new ArrayList<>();
            Order order = new Order();
            Cursor c2 = db.rawQuery("SELECT Email, RestaurantCode, MenuCode, MenuOptionCode, MenuName, MenuOptionName, MenuPrice, MenuOptionPrice FROM OrderDetail, MenuOptionLink, MenuOption WHERE " +
                    "OrderDetail.OrderID = MenuOptionLink.OrderID AND MenuOptionLink.MenuOptionID =" +
                    "MenuOption.MenuOptionID AND OrderDetail.OrderID = "+orderId.get(i)+";" , null);
            if(c2.moveToFirst()){
                do{
                    order.setEmail(c2.getString(c2.getColumnIndex("Email")));
                    order.setRestaurant_Code(c2.getInt(c2.getColumnIndex("RestaurantCode")));
                    order.setMenu_Code(c2.getInt(c2.getColumnIndex("MenuCode")));
                    order.setMenu_Name(c2.getString(c2.getColumnIndex("MenuName")));
                    order.setMenu_Price(c2.getInt(c2.getColumnIndex("MenuPrice")));
                    MenuOption tempMenuOption = new MenuOption();
                    tempMenuOption.setMenuoption_code(c2.getInt(c2.getColumnIndex("MenuOptionCode")));
                    tempMenuOption.setMenuoption_name(c2.getString(c2.getColumnIndex("MenuOptionName")));
                    tempMenuOption.setMenuoption_price(c2.getInt(c2.getColumnIndex("MenuOptionPrice")));
                    menuOptionList.add(tempMenuOption);

                }while(c2.moveToNext());
            }
            order.setMenuOption_List(menuOptionList);
            result.add(order);
        }
        return result;
    }

    public void addToCart(Order order){
        SQLiteDatabase db= getReadableDatabase();

        String query = String.format("INSERT INTO OrderDetail(Email,RestaurantCode,MenuCode,MenuName,MenuPrice) VALUES('%s',%d,%d,'%s',%d);",
                order.getEmail(),
                order.getRestaurant_Code(),
                order.getMenu_Code(),
                order.getMenu_Name(),
                order.getMenu_Price());
        db.execSQL(query);

        for(int i=0; i<order.getMenuOption_ListNum(); i++){
            String query2 = String.format("INSERT INTO MenuOption(MenuOptionCode,MenuOptionName,MenuOptionPrice) VALUES(%d,'%s',%d);",
                    order.getMenuOption_List().get(i).getMenuoption_code(),
                    order.getMenuOption_List().get(i).getMenuoption_name(),
                    order.getMenuOption_List().get(i).getMenuoption_price());
            db.execSQL(query2);

        }
        makeLink(order);



    }
    public void makeLink(Order order){
        SQLiteDatabase db = getReadableDatabase();
        SQLiteQueryBuilder qb = new SQLiteQueryBuilder();

        String[] sqlSelect = {"OrderID"};
        String sqlTable = "OrderDetail";
        int MenuOptionID =0;
        ArrayList<Integer> orderIdList = new ArrayList<>();
        qb.setTables(sqlTable);
        Cursor c = qb.query(db, sqlSelect, null, null, null, null, null);

        if (c.moveToLast()) {
                MenuOptionID = c.getInt(c.getColumnIndex("OrderID"));
        }



        String[] sqlSelect2 = {"MenuOptionID"};
        sqlTable="MenuOption";
        qb.setTables(sqlTable);
        Cursor c2 = qb.query(db,sqlSelect2, null,null,null,null,null);
        if(c2.moveToLast()) {
            for (int i = 0; i < order.getMenuOption_ListNum(); i++) {
                orderIdList.add(c2.getInt(c2.getColumnIndex("MenuOptionID")));
                if(c2.moveToPrevious());
            }
        }

        for(int i=0; i<order.getMenuOption_ListNum(); i++){
            String query = String.format("INSERT INTO MenuOptionLink(OrderID,MenuOptionID) VALUES(%d,%d);",
                    MenuOptionID,
                    orderIdList.get(i));
            db.execSQL(query);
        }





    }
    public void cleanCart(){
        SQLiteDatabase db= getReadableDatabase();
        String query = String.format("DELETE FROM OrderDetail");
        db.execSQL(query);
    }

}
