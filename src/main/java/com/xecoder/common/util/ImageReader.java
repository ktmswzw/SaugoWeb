package com.xecoder.common.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.HashMap;
import java.util.Map;

import com.google.zxing.*;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import org.apache.commons.lang3.StringUtils;
import org.imgscalr.Scalr;

/**
 * Created by imanon.net on 2015/4/10.
 */
public final class ImageReader {

    private static final int BLACK = 0xFF000000;
    private static final int WHITE = 0xFFFFFFFF;

    private ImageReader() {
    }


    public static BufferedImage toBufferedImage(BitMatrix matrix) {
        int width = matrix.getWidth();
        int height = matrix.getHeight();
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                image.setRGB(x, y, matrix.get(x, y) ? BLACK : WHITE);
            }
        }
        return image;
    }


    public static void convertImage(InputStream ins, String newFilename,int width,int height) {
        BufferedImage originalImage;
        try {
            originalImage = ImageIO.read(ins);
            BufferedImage thumbnail = Scalr.resize(originalImage, Scalr.Method.QUALITY, Scalr.Mode.FIT_TO_WIDTH,
                    width, height, Scalr.OP_ANTIALIAS);

            if (!ImageIO.write(thumbnail, "JPEG", new File(newFilename)))
                System.out.println("File write failed.");;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void writeToFile(BitMatrix matrix, String format, File file)
            throws IOException {
        BufferedImage image = toBufferedImage(matrix);
        if (!ImageIO.write(image, format, file)) {
            throw new IOException("Could not write an image of format " + format + " to " + file);
        }
    }


    public static void writeToStream(BitMatrix matrix, String format, OutputStream stream)
            throws IOException {
        BufferedImage image = toBufferedImage(matrix);
        if (!ImageIO.write(image, format, stream)) {
            throw new IOException("Could not write an image of format " + format);
        }
    }


    private static String readImage(BufferedImage bufferedImage) {
        try {
            LuminanceSource source = new BufferedImageLuminanceSource(bufferedImage);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            MultiFormatReader reader = new MultiFormatReader();
            com.google.zxing.Result result = reader.decode(bitmap);
            return result.getText();
        } catch (Exception ignored) {

        }
        return "";
    }


    private static BufferedImage rotateImage(final BufferedImage bufferedimage,
                                            final int degree) throws IOException {
        int w = bufferedimage.getWidth();
        int h = bufferedimage.getHeight();
        int type = bufferedimage.getColorModel().getTransparency();
        BufferedImage img;
        Graphics2D graphics2d;
        int temp = 0;
        if (degree == 90 || degree == -90) {
            temp = w;
            w = h;
            h = temp;
        }
        (graphics2d = (img = new BufferedImage(w, h, type))
                .createGraphics()).setRenderingHint(
                RenderingHints.KEY_INTERPOLATION,
                RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        graphics2d.rotate(Math.toRadians(degree), w / 2, h / 2);
        graphics2d.drawImage(bufferedimage, 0, 0, null);
        graphics2d.dispose();


//        ImageIO.write(img, "jpg", new File("/Users/vincent/Downloads/upload2016-08-26/22.jpg"));

        return img;
    }




    public static String decodeQRcode(BufferedImage image){
        String qrCodeText;
        try {
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            Binarizer binarizer = new HybridBinarizer(source);
            BinaryBitmap binaryBitmap = new BinaryBitmap(binarizer);
            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");
            // 对图像进行解码
            Result result = new MultiFormatReader().decode(binaryBitmap, hints);
            qrCodeText = result.getText();
            return qrCodeText;
        } catch (NotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String getCode(String path) {
        String code;
        try {
            InputStream barCodeInputStream = new FileInputStream(path);
            BufferedImage barCodeBufferedImage = ImageIO.read(barCodeInputStream);
            code = ImageReader.decodeQRcode(barCodeBufferedImage);
            if(!StringUtils.isNotBlank(code)){
                code = ImageReader.decodeQRcode(rotateImage(barCodeBufferedImage, 90));
            }
            return code;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void main(String[] args) {

        System.out.println(getCode("/Users/vincent/Downloads/upload/2016-08-26/9628fd41-f34e-4c5b-b55e-036a33aabd87.jpg"));
//        System.out.println(getCode("/Users/vincent/Downloads/2.jpg"));
    }


}
