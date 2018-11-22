package com.gzw.u_share;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.gzw.u_share.config.Constants;
import com.gzw.u_share.model.ShareModel;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;

import java.lang.ref.WeakReference;
/**
 * 分享组件
 * 功能：负责与友盟SDK的交互
 */
public class UShare {
  private static WeakReference<Activity> mActivity;
  private static WeakReference<ShareModel> mShareModel;

  // 初始化方法需要一个 Activity ，我们采用 弱引用的方式
  // 弱引用方式，当源引用被 置 null 时，会被立即回收
  // 和 WeakReference 有一点点的不同，SoftReference比较大方，在内存快用尽的时候才会回收这个对象。
  // 而 Weak 会很快就回收，强引用是就算内存不足了，也不会回收，这就是他的危险之处
  public static void init(Activity activity) {
    if (activity == null) return;
    mActivity = new WeakReference<>(activity);
    UMConfigure.init(mActivity.get(),"57fb0aa1e0f55a6c61001a51"
      ,"umeng",UMConfigure.DEVICE_TYPE_PHONE,"");
  }

  public static void share(final String title, final String content, final String imageUrl, final String targetUrl, final Callback errorCallback, final Callback successCallback) {
    if (mActivity == null) return;
    boolean granted = true;
    // 分享用到了图片，需要将图片缓存起来，需要读写 SD 卡，需要动态申请权限
    if (!TextUtils.isEmpty(imageUrl)) { // 有图片，判断是否已授权读取 SD 卡
      granted = ContextCompat.checkSelfPermission(mActivity.get(), Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }
    if (!granted) { // 未授权，申请权限
      ShareModel shareModel=new ShareModel(title,content,imageUrl,targetUrl,errorCallback,successCallback);
      mShareModel=new WeakReference<>(shareModel);
      ActivityCompat.requestPermissions(mActivity.get(),new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, Constants.RC_REQUEST_PERMISSIONS);
      return;
    }
    // 授权了 直接调用 主线程
    mActivity.get().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        // 通过 openShare 去打开 分享面板
        openShare(title, content, imageUrl, targetUrl, errorCallback, successCallback);
      }
    });

  }
  private static void share(ShareModel shareModel){
    share(shareModel.getTitle(),shareModel.getContent(),shareModel.getImageUrl(),shareModel.getTargetUrl(),shareModel.getErrorCallback(),shareModel.getSuccessCallback());
  }
  private static void openShare(String title, String content, String imageUrl, String targetUrl, final Callback errorCallback, final Callback successCallback) {
    UMWeb web = new UMWeb(targetUrl);
    web.setTitle(title);//标题
    web.setThumb(new UMImage(mActivity.get(), imageUrl));  //缩略图
    web.setDescription(content);//描述
    ShareAction shareAction = new ShareAction(mActivity.get()).setDisplayList(SHARE_MEDIA.SINA, SHARE_MEDIA.QQ, SHARE_MEDIA.QZONE, SHARE_MEDIA.WEIXIN, SHARE_MEDIA.WEIXIN_CIRCLE, SHARE_MEDIA.WEIXIN_FAVORITE, SHARE_MEDIA.MORE)
      .withMedia(web)
      .setCallback(new UMShareListener() {
        @Override
        public void onStart(SHARE_MEDIA share_media) {

        }

        @Override
        public void onResult(SHARE_MEDIA platform) {
          if (platform.name().equals("WEIXIN_FAVORITE")) {
            if (successCallback != null) successCallback.invoke("收藏成功啦");
          } else {
            // Toast.makeText(mActivity.get(), platform + " 分享成功啦", Toast.LENGTH_SHORT).show();
            if (successCallback != null) successCallback.invoke("分享成功啦");
          }
        }

        @Override
        public void onError(SHARE_MEDIA platform, Throwable t) {
          if (errorCallback != null) errorCallback.invoke("分享失败啦");
          if (t != null) {
            Log.d("throw", "throw:" + t.getMessage());
          }
        }

        @Override
        public void onCancel(SHARE_MEDIA platform) {
          if (errorCallback != null) errorCallback.invoke("分享取消了");
        }
      });
   /* if (!TextUtils.isEmpty(imageUrl)) {
      shareAction.withMedia(new UMImage(mActivity.get(), imageUrl));
    }*/

    shareAction.open();
  }

  // 安卓6.0 后 动态申请权限后，执行 onActivityResult,onRequestPermissionsResult 这个回调
  public static void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (mActivity == null) return;
    UMShareAPI.get(mActivity.get()).onActivityResult(requestCode, resultCode, data);
  }
  public static void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    if(mShareModel==null)return;
    if (requestCode == Constants.RC_REQUEST_PERMISSIONS) {
      for (int i = 0, j = permissions.length; i < j; i++) {
        if(TextUtils.equals(permissions[i],Manifest.permission.WRITE_EXTERNAL_STORAGE)){
          if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
            share(mShareModel.get());
          }else {
            if(mActivity==null)return;
            Toast.makeText(mActivity.get(),"没有使用SD卡的权限，请在权限管理中为GitHubGzw开启使用SD卡的权限",Toast.LENGTH_SHORT).show();
          }
        }
      }
    }
  }
}
