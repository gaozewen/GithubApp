package com.gzw.u_share.model;

import com.facebook.react.bridge.Callback;

public class ShareModel {

    private String title; // 分享标题
    private String content; // 分享内容
    private String imageUrl; // 分享图片的 url
    private String targetUrl; // 单击分享图片所要跳转的连接
    private Callback errorCallback; // 对 js 的回调
    private Callback successCallback;

    public ShareModel(String title, String content, String imageUrl, String targetUrl, Callback errorCallback, Callback successCallback) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.targetUrl = targetUrl;
        this.errorCallback = errorCallback;
        this.successCallback = successCallback;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public Callback getErrorCallback() {
        return errorCallback;
    }

    public void setErrorCallback(Callback errorCallback) {
        this.errorCallback = errorCallback;
    }

    public Callback getSuccessCallback() {
        return successCallback;
    }

    public void setSuccessCallback(Callback successCallback) {
        this.successCallback = successCallback;
    }
}
