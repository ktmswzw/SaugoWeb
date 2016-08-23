package com.xecoder.common.util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.sun.image.codec.jpeg.JPEGCodec;
import com.sun.image.codec.jpeg.JPEGEncodeParam;
import com.sun.image.codec.jpeg.JPEGImageEncoder;
import org.apache.commons.lang3.StringUtils;

/**
 * Created by Vincent on 2015/4/10.
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
        return img;
    }


    public static String getCode(String path) {
        String code;
        try {
            InputStream barCodeInputStream = new FileInputStream(path);
            BufferedImage barCodeBufferedImage = ImageIO.read(barCodeInputStream);
            code = ImageReader.readImage(barCodeBufferedImage);
            if(!StringUtils.isNotBlank(code)){
                code = ImageReader.readImage(rotateImage(barCodeBufferedImage, 90));
            }
            return code;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void main(String[] args) {
        System.out.println(getCode("/Users/vincent/Downloads/2223.jpg"));
    }

    public static void Tosmallerpic(File oldFile,File newFile,int width,int height,float quality){
        if(!newFile.getParentFile().exists()){
            newFile.getParentFile().mkdirs();
        }
        Image src=null;
        BufferedImage tag=null;
        FileOutputStream newimage=null;
        try {
            try{
                src = javax.imageio.ImageIO.read(oldFile); //构造Image对象
            }catch(Exception e){
                e.printStackTrace();
                try {
                    ThumbnailConvert convert=new ThumbnailConvert();
                    //convert.setCMYK_COMMAND(oldFile.getPath());
                    String CMYK_COMMAND = "mogrify -colorspace RGB -quality 100 file1";//转换cmyk格式
                    convert.exeCommand(CMYK_COMMAND.replace("file1",oldFile.getPath()));
                    src = Toolkit.getDefaultToolkit().getImage(oldFile.getPath());
                    MediaTracker mediaTracker = new MediaTracker(new Container());
                    mediaTracker.addImage(src, 0);
                    mediaTracker.waitForID(0);
                    src.getWidth(null);
                    src.getHeight(null);
                }catch (Exception e1){
                    e1.printStackTrace();
                }
            }
            //,String ext 保留字段 缩略图拼接字段
            //String img_midname=newFile;
            int old_w=src.getWidth(null)==-1?width:src.getWidth(null); //得到源图宽
            int old_h=src.getHeight(null)==-1?height:src.getHeight(null);
            int new_w=0;
            int new_h=0; //得到源图长
            double w2=(old_w*1.00)/(width*1.00);
            double h2=(old_h*1.00)/(height*1.00);
            //图片调整为方形结束
            if(old_w>width)
                new_w=(int)Math.round(old_w/w2);
            else
                new_w=old_w;
            if(old_h>height)
                new_h=(int)Math.round(old_h/h2);//计算新图长宽
            else
                new_h=old_h;
            tag = new BufferedImage(new_w,new_h,BufferedImage.TYPE_INT_RGB);
            //tag.getGraphics().drawImage(src,0,0,new_w,new_h,null); //绘制缩小后的图
            tag.getGraphics().drawImage(src.getScaledInstance(new_w, new_h,  Image.SCALE_SMOOTH), 0,0,null);
            newimage=new FileOutputStream(newFile); //输出到文件流
            JPEGImageEncoder encoder = JPEGCodec.createJPEGEncoder(newimage);
            JPEGEncodeParam jep=JPEGCodec.getDefaultJPEGEncodeParam(tag);
                /* 压缩质量 */
            jep.setQuality(quality, true);
            encoder.encode(tag, jep);
            //encoder.encode(tag); //近JPEG编码
            newimage.close();
        } catch (IOException ex) {
            ex.printStackTrace();
            //Logger.getLogger(File:mpress.class.getName()).log(Level.SEVERE, null, ex);
        }finally{
            if(newimage!=null){
                try {
                    newimage.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if(tag!=null){
                tag.flush();
            }
        }
    }



}
