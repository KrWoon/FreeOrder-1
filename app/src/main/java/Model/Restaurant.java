package Model;

/**
 * Created by wnlwn on 2018-04-08.
 */

public class Restaurant {
    private String rst_name;
    private int rate;
    private String opentime;
    private String closetime;
    private String imgURL;
    private int rst_code;


    public String getClosetime() {
        return closetime;
    }

    public void setClosetime(String closetime) {
        this.closetime = closetime;
    }

    public Restaurant(String name, int rate, String opentime, String closetime, String imgURL ,int rst_code ){
        this.rst_name=name;
        this.rate=rate;
        this.opentime=opentime;
        this.imgURL=imgURL;
        this.closetime = closetime;
        this.rst_code = rst_code;
    }

    public int getRst_code() {
        return rst_code;
    }

    public void setRst_code(int rst_code) {
        this.rst_code = rst_code;
    }
    public String getRst_name() {
        return rst_name;
    }

    public int getRate() {
        return rate;
    }

    public String getOpentime() {
        return opentime;
    }

    public String getImgURL() {
        return imgURL;
    }

    public void setRst_name(String rst_name) {
        this.rst_name = rst_name;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public void setOpentime(String open) {
        this.opentime = open;
    }

    public void setImgURL(String imgURL) {
        this.imgURL = imgURL;
    }
}
