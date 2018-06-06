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


    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    private String tel;

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    private float latitude;

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    private float longitude;

    private int delayTime;


    public String getClosetime() {
        return closetime;
    }

    public void setClosetime(String closetime) {
        this.closetime = closetime;
    }

    public Restaurant(String name, int rate, String opentime, String closetime, String imgURL ,int rst_code, int delayTime,
                      float latitude, float longitude, String tel){
        this.rst_name=name;
        this.rate=rate;
        this.opentime=opentime;
        this.imgURL=imgURL;
        this.closetime = closetime;
        this.rst_code = rst_code;
        this.delayTime = delayTime;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tel = tel;
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

    public int getDelayTime() {
        return delayTime;
    }

    public void setDelayTime(int delayTime) {
        this.delayTime = delayTime;
    }
}
