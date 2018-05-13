package Model;


public class MenuOption {
    private int menuoption_code;
    private String menuoption_name;
    private int menuoption_price;
    public MenuOption(){}
    public MenuOption(int menuoption_code, String menuoption_name, int menuoption_price) {
        this.menuoption_code = menuoption_code;
        this.menuoption_name = menuoption_name;
        this.menuoption_price = menuoption_price;
    }

    public int getMenuoption_code() {
        return menuoption_code;
    }

    public void setMenuoption_code(int menuoption_code) {
        this.menuoption_code = menuoption_code;
    }

    public String getMenuoption_name() {
        return menuoption_name;
    }

    public void setMenuoption_name(String menuoption_name) {
        this.menuoption_name = menuoption_name;
    }

    public int getMenuoption_price() {
        return menuoption_price;
    }

    public void setMenuoption_price(int menuoption_price) {
        this.menuoption_price = menuoption_price;
    }



}
