package com.msbmobileretail;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;

import java.util.concurrent.TimeUnit;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.CertificatePinner.Builder;

public class CertificatePinningClientFactory implements OkHttpClientFactory {

    @Override
    public OkHttpClient createNewNetworkModuleClient(){

        String hostName = "ebank.msb.com.vn";
        String hostName1 = "118.70.157.239";

        String certificatePublicKey1 = "sha256/EJzBysQmsB9kS0uVMFzv2dexbQqJLsgFjNsJEChPIDM=";
        String certificatePublicKey2 = "sha256/86fLIetopQLDNxFZ0uMI66Xpl1pFgLlHHn9v6kT0i4I=";
        OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder();

        CertificatePinner certificatePinner = new CertificatePinner.Builder()
                .add(hostName, certificatePublicKey1)
                .add(hostName, certificatePublicKey2)
                .add(hostName1, certificatePublicKey1)
                .add(hostName1, certificatePublicKey2)
                .build();

        clientBuilder.certificatePinner(certificatePinner);
        clientBuilder.cookieJar(new ReactCookieJarContainer());
        clientBuilder.connectTimeout(1, TimeUnit.MINUTES);
        clientBuilder.readTimeout(1, TimeUnit.MINUTES);
        clientBuilder.writeTimeout(1, TimeUnit.MINUTES);
        return clientBuilder.build();
    }
}