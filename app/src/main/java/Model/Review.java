package Model;

import java.util.*;

/**
 * Created by wnlwn on 2018-04-08.
 */


public class Review {
    private int rev_code;
    private int res_code;
    private String text;
    private int score;
    private String use_code;
    private Date addedDate;

    public Review(int rev_code, int res_code, String text, int score, String use_code, Date addedDate){
        this.rev_code = rev_code;
        this.res_code = res_code;
        this.text = text;
        this.score = score;
        this.use_code = use_code;
        this.addedDate = addedDate;
    }

    public int getRev_code(){return rev_code;}
    public int getRes_code(){return res_code;}
    public String getText(){return text;}
    public int getScore() {return score; }
    public String getUse_code(){return use_code;}
    public Date getAddedDate(){return addedDate;}

    public void setAddedDate(Date addedDate) {
        this.addedDate = addedDate;
    }

    public void setRev_code(int rev_code) {
        this.rev_code = rev_code;
    }

    public void setRes_code(int res_code) {
        this.res_code = res_code;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setUse_code(String use_code) {
        this.use_code = use_code;
    }
}
