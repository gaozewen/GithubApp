package com.gzw.u_share;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * 分享组件
 * 功能：暴露 给 RN 接口
 */

public class UShareModule extends ReactContextBaseJavaModule{

    public UShareModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "UShare";
    }

    // 向 ReactNative 中 暴露了一个 Share 方法
    @ReactMethod
    public static void share(String title, String content, String imageUrl, String targetUrl, final Callback successCallback, final Callback errorCallback) {
        UShare.share(title,content,imageUrl,targetUrl,successCallback,errorCallback);
    }
}
