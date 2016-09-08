package com.xecoder.common.util;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.Date;
import java.util.UUID;

/**
 * Created by admin on 2014/8/28.
 */
public class UploadUtils {
    public static String upload(MultipartFile file,HttpServletRequest request){

        String logoPathDir = "/Users/vincent/Downloads/upload/"+ SimpleDate.format(SimpleDate.localDate(new Date(),1));
//        String logoPathDir = "/upload/" + SimpleDate.format(SimpleDate.localDate(new Date(),1));
        //String contextPath = request.getSession().getServletContext().getRealPath(logoPathDir);

        //String filePath = contextPath + File.separator ;
        String filePath = logoPathDir ;
        File file_in = new File(filePath);
        file_in.mkdirs();

        String newFilenameBase = UUID.randomUUID().toString();
        String originalFileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        String newFilename = newFilenameBase + originalFileExtension;
        File source = new File(filePath + "/" + newFilename);

        if(!file.getContentType().equals("image/jpeg")) {
            try {
                file.transferTo(source);
            } catch (IOException e) {
                e.printStackTrace();
                return "ERROR";
            }
            return filePath + "/" + newFilename;
        }
        else{
            try{
                ImageReader.convertImage(file.getInputStream(),filePath + "/" + newFilename,1000,1000);
                return filePath + "/" + newFilename;
            }catch (Exception e){
                e.printStackTrace();
            }

        }
        return "";
    }



    public static File multipartToFile(MultipartFile multipart) throws IllegalStateException, IOException
    {
        File convFile = new File( multipart.getOriginalFilename());
        multipart.transferTo(convFile);
        return convFile;
    }
}
