package Model;

/*
 * Created by wnlwn on 2018-04-08.
 */

public class Menu {
    private String menu_name;
    private int price;
    private int cookingTime;

    public int getMenu_code() {
        return menu_code;
    }

    public void setMenu_code(int menu_code) {
        this.menu_code = menu_code;
    }

    private int menu_code;


    public Menu(int menu_code, String menu_name, int price, int cookingTime){
        this.menu_code = menu_code;
        this.menu_name = menu_name;
        this.price = price;
        this.cookingTime = cookingTime;
    }

    public String getMenu_name() {
        return menu_name;
    }

    public int getPrice() {
        return price;
    }

    public void setMenu_name(String menu_name) {
        this.menu_name = menu_name;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public int getCookingTime() {
        return cookingTime;
    }

    public void setCookingTime(int cookingTime) {
        this.cookingTime = cookingTime;
    }
}
