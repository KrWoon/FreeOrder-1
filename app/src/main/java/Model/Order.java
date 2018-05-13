package Model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wnlwn on 2018-05-07.
 */

public class Order implements Serializable {



    private int Customer_Code;
    private String Customer_Name;
    private String Email;

    private int Restaurant_Code;
    private int Restaurant_ManagerCode;
    private String Restaurant_Location;
    private String Restaurant_Name;
    private String Restaurant_Category;
    private String Restaurant_OpenTime;
    private String Restaurant_CloseTime;
    private int Restaurant_rate;
    private int Restaurant_NumTable;
    private int Quantity;

    public int getQuantity() {
        return Quantity;
    }

    public void setQuantity(int quantity) {
        Quantity = quantity;
    }

    private int Menu_Code;
    private String Menu_Name;
    private int Menu_Price;
    private List<MenuOption> MenuOption_List;

    public String getSumMenuOptionName(){
        String tempString = "";
        if(!MenuOption_List.isEmpty()){
            for(int i=0; i<MenuOption_List.size(); i++){
                tempString += MenuOption_List.get(i).getMenuoption_name()+"   ";
            }
        }
        return tempString;
    }
    public int getSumMenuOptionPrice(){
        int sum=0;
        if(!MenuOption_List.isEmpty()){
            for(int i=0; i<MenuOption_List.size(); i++){
                sum += MenuOption_List.get(i).getMenuoption_price();
            }
        }
        return sum;
    }

    public List<MenuOption> getMenuOption_List() {
        return MenuOption_List;
    }

    public void setMenuOption_List(List<MenuOption> menuOption_List) {
        MenuOption_List = menuOption_List;
    }
    public void addMenuOption_List(MenuOption menuOption){
        MenuOption_List.add(menuOption);
    }
    public boolean isMenuOption_List_One(){
        if(MenuOption_List.size() == 1) return true;
        else return false;
    }
    public int getMenuOption_ListNum(){
        return MenuOption_List.size();
    }

    public int getMenuOption_Code() {
        return MenuOption_Code;
    }

    public void setMenuOption_Code(int menuOption_Code) {
        MenuOption_Code = menuOption_Code;
    }

    private int MenuOption_Code;
    private String MenuOption_Name;
    private int MenuOption_Price;

    public Order() {}
    public Order(String menuname, String menuoptionname, int menuprice, int menuoptionprice){
        Menu_Name=menuname;
        MenuOption_Name=menuoptionname;
        Menu_Price = menuprice;
        MenuOption_Price = menuoptionprice;
    }

    public int getCustomer_Code() {
        return Customer_Code;
    }

    public void setCustomer_Code(int customer_Code) {
        Customer_Code = customer_Code;
    }

    public String getCustomer_Name() {
        return Customer_Name;
    }

    public void setCustomer_Name(String customer_Name) {
        Customer_Name = customer_Name;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public int getRestaurant_Code() {
        return Restaurant_Code;
    }

    public void setRestaurant_Code(int restaurant_Code) {
        Restaurant_Code = restaurant_Code;
    }

    public int getRestaurant_ManagerCode() {
        return Restaurant_ManagerCode;
    }

    public void setRestaurant_ManagerCode(int restaurant_ManagerCode) {
        Restaurant_ManagerCode = restaurant_ManagerCode;
    }

    public String getRestaurant_Location() {
        return Restaurant_Location;
    }

    public void setRestaurant_Location(String restaurant_Location) {
        Restaurant_Location = restaurant_Location;
    }

    public String getRestaurant_Name() {
        return Restaurant_Name;
    }

    public void setRestaurant_Name(String restaurant_Name) {
        Restaurant_Name = restaurant_Name;
    }

    public String getRestaurant_Category() {
        return Restaurant_Category;
    }

    public void setRestaurant_Category(String restaurant_Category) {
        Restaurant_Category = restaurant_Category;
    }

    public String getRestaurant_OpenTime() {
        return Restaurant_OpenTime;
    }

    public void setRestaurant_OpenTime(String restaurant_OpenTime) {
        Restaurant_OpenTime = restaurant_OpenTime;
    }

    public String getRestaurant_CloseTime() {
        return Restaurant_CloseTime;
    }

    public void setRestaurant_CloseTime(String restaurant_CloseTime) {
        Restaurant_CloseTime = restaurant_CloseTime;
    }

    public int getRestaurant_rate() {
        return Restaurant_rate;
    }

    public void setRestaurant_rate(int restaurant_rate) {
        Restaurant_rate = restaurant_rate;
    }

    public int getRestaurant_NumTable() {
        return Restaurant_NumTable;
    }

    public void setRestaurant_NumTable(int restaurant_NumTable) {
        Restaurant_NumTable = restaurant_NumTable;
    }

    public int getMenu_Code() {
        return Menu_Code;
    }

    public void setMenu_Code(int menu_Code) {
        Menu_Code = menu_Code;
    }

    public String getMenu_Name() {
        return Menu_Name;
    }

    public void setMenu_Name(String menu_Name) {
        Menu_Name = menu_Name;
    }

    public int getMenu_Price() {
        return Menu_Price;
    }

    public void setMenu_Price(int menu_Price) {
        Menu_Price = menu_Price;
    }



    public String getMenuOption_Name() {
        return MenuOption_Name;
    }

    public void setMenuOption_Name(String menuOption_Name) {
        MenuOption_Name = menuOption_Name;
    }

    public int getMenuOption_Price() {
        return MenuOption_Price;
    }

    public void setMenuOption_Price(int menuOption_Price) {
        MenuOption_Price = menuOption_Price;
    }


}
