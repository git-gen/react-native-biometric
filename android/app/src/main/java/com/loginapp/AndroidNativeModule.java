package com.loginapp;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricPrompt;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt.AuthenticationCallback;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.UiThreadUtil;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;


public class AndroidNativeModule extends ReactContextBaseJavaModule {
    public AndroidNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    @Override
    public String getName() {
        return "AndroidModule";
    }
    @ReactMethod
    public void getApiLevel(Callback callback) {
        callback.invoke(Build.VERSION.SDK_INT);
    }
    @ReactMethod
    public void getAuthState(Callback callback) {
        BiometricManager biometricManager = BiometricManager.from(this.getReactApplicationContext());
        switch (biometricManager.canAuthenticate()) {
            case BiometricManager.BIOMETRIC_SUCCESS:
                callback.invoke("BIOMETRIC_SUCCESS");
                break;
            case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
                callback.invoke("BIOMETRIC_ERROR_NO_HARDWARE");
                break;
            case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
                callback.invoke("BIOMETRIC_ERROR_HW_UNAVAILABLE");
                break;
            case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
                callback.invoke("BIOMETRIC_ERROR_NONE_ENROLLED");
                break;
        }
    }
    @ReactMethod
    public void biometric(Callback callback) {
        UiThreadUtil.runOnUiThread(
                new Runnable() {
                    @Override
                    public void run() {
                        FragmentActivity fragmentActivity = (FragmentActivity) getCurrentActivity();
                        Executor executor = Executors.newSingleThreadExecutor();
                        AuthenticationCallback authCallback = new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                super.onAuthenticationError(errorCode, errString);
                            }
                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                callback.invoke("BIOMETRIC_SUCCEEDED");
                            }
                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                            }
                        };
                        BiometricPrompt biometricPrompt = new BiometricPrompt(fragmentActivity, executor, authCallback);
                        BiometricPrompt.PromptInfo promptInfo =
                                new BiometricPrompt.PromptInfo.Builder()
                                        .setTitle("生体認証")
                                        .setSubtitle("生体認証実行中です")
                                        .setNegativeButtonText("キャンセル")
                                        .setConfirmationRequired(false)
                                        .build();
                        biometricPrompt.authenticate(promptInfo);
                    }
                });
    }
}