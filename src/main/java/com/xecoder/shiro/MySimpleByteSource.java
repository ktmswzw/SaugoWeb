package com.xecoder.shiro;

import org.apache.shiro.util.ByteSource;
import org.apache.shiro.util.SimpleByteSource;

import java.io.Serializable;

/**
 * Created by imanon.net on 16/9/7.
 * Duser.name = imanon
 * SaugoWeb
 */
public class MySimpleByteSource  extends SimpleByteSource implements ByteSource,Serializable {
    private static final long serialVersionUID = -8264769257993147799L;

    public MySimpleByteSource(byte[] bytes) {
        super(bytes);
    }
}
