package com.xecoder.common.util;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Method;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.xecoder.entity.User;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
/**
 * Created by imanon.net on 16/8/18.
 * Duser.name = imanon
 * SaugoWeb
 */
@SuppressWarnings("unchecked")
public class ObjListToExcel {
    @SuppressWarnings("unchecked")
    public static String[] objListToExcel(String name, Map data) {

        Map<String, String> FieldList = (Map<String, String>) data.get("FieldList");
        List listData = (List) data.get("listData");
        Object[] keys = FieldList.keySet().toArray();
        String[] FieldListKeys = new String[keys.length];
        for (Object key : keys) {
            String temp = key.toString();
            int xuHao = Integer.valueOf(temp.substring(0, 1));
            FieldListKeys[xuHao] = temp.substring(1);
        }
        try {
            String path = name+".xls";
            File newFile = new File(path);
            newFile.createNewFile();
            System.out.println("创建文件成功：" + path);
            HSSFWorkbook wb = new HSSFWorkbook();
            HSSFSheet sheet = wb.createSheet();

            for (int i = 0; i < listData.size(); i++) {
                HSSFRow row = sheet.createRow(i);
                Object obj = listData.get(i);
                for (int j = 0; j < FieldListKeys.length; j++) {
                    HSSFCell cell = row.createCell(j);
                    if (i == 0) {
                        sheet.setColumnWidth(j, 6000);
                        cell.setCellValue(new HSSFRichTextString(FieldList.get(j
                                + FieldListKeys[j])));
                    } else {
                        String FieldListName = (String) FieldListKeys[j];
                        System.out.println(FieldListName);
                        FieldListName = FieldListName.replaceFirst(FieldListName
                                .substring(0, 1), FieldListName.substring(0, 1)
                                .toUpperCase());
                        FieldListName = "get" + FieldListName;
                        Class clazz = Class.forName(obj.getClass().getName());
                        Method[] methods = clazz.getMethods();
                        Pattern pattern = Pattern.compile(FieldListName);
                        Matcher mat = null;
                        for (Method m : methods) {
                            mat = pattern.matcher(m.getName());
                            if (mat.find()) {
                                Object shuXing = m.invoke(obj);
                                if (shuXing != null) {
                                    cell.setCellValue(shuXing.toString());//这里可以做数据格式处理
                                } else {
                                    cell.setCellValue("");
                                }
                                break;
                            }
                        }
                    }
                }
            }
            OutputStream out = new FileOutputStream(path);
            wb.write(out);// 写入File
            out.flush();
            out.close();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    public static void main(String args[]) {
        try {
            List listData = new ArrayList();
            for (int i = 0; i < 6; i++) {
                User vo = new User();//要导出的数据类
                vo.setRolesName("abc");
                vo.setAddress("123123123");
                try {
                    listData.add(vo);
                }catch (Exception ignored){}
            }
            Map<String, String> FieldList = new HashMap<String, String>();
            FieldList.put("0rolesName", "房间号");//属性前边的数字代表字段的先后顺序。
            FieldList.put("1address", "非住宅建筑面积");//最好将源码中判别顺序的格式改为"序号-字段"。
            Map data = new HashMap();
            data.put("listData", listData);
            data.put("FieldList", FieldList);
            ObjListToExcel.objListToExcel("测试", data);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
