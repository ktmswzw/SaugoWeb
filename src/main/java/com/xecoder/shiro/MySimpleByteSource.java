package com.xecoder.shiro;

import org.apache.shiro.util.SimpleByteSource;

import java.io.Serializable;

/**
 * Created by imanon.net on 16/9/7.
 * Duser.name = imanon
 * SaugoWeb
 */
public class MySimpleByteSource  extends SimpleByteSource implements Serializable {
    public MySimpleByteSource(byte[] bytes) {
        super(bytes);
    }
}
