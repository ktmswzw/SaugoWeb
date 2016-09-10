package com.xecoder.common.util;


import java.security.SecureRandom;
import java.util.Random;

/**
 * Created by xecoder
 */
public class RadomUtils {
    private static int DEFAULT_KEY_LENGTH = 8;
    private static SecureRandom random = null;

    private static Random randomZ = null;

    /**
     * 获取随机字符串
     *
     * @param keyLength 字符串长度
     * @return 随机字符串
     */
    public static String getRadomStr(int keyLength) {
        if (random == null) {
            random = new SecureRandom();
        }

        byte[] buffer = new byte[keyLength];
        random.nextBytes(buffer);
        String str = new String(buffer);
        return str;
    }

    public static int nextSixInt(){
        if(randomZ ==null )
        randomZ = new Random();
        return randomZ.nextInt(899999)+100000;

    }

    public static String getRadomStr() {
        return getRadomStr(DEFAULT_KEY_LENGTH);
    }


}
