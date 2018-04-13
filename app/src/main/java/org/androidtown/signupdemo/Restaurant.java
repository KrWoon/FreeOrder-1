package org.androidtown.signupdemo;

/**
 * Created by wnlwn on 2018-04-08.
 */

public class Restaurant {
    private String rst_name;
    private int rate;
    private int opentime;
    private String imgURL;

    public Restaurant(String name, int rate, int opentime, String imgURL ){
        this.rst_name=name;
        this.rate=rate;
        this.opentime=opentime;
        this.imgURL=imgURL;
    }


    public String getRst_name() {
        return rst_name;
    }

    public int getRate() {
        return rate;
    }

    public int getOpentime() {
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

    public void setOpentime(int open) {
        this.opentime = open;
    }

    public void setImgURL(String imgURL) {
        this.imgURL = imgURL;
    }
}
