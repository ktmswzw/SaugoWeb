package com.xecoder.common.util;

import com.alibaba.fastjson.JSONObject;
import com.taobao.api.ApiException;
import com.taobao.api.DefaultTaobaoClient;
import com.taobao.api.TaobaoClient;
import com.taobao.api.request.AlibabaAliqinFcSmsNumSendRequest;
import com.taobao.api.response.AlibabaAliqinFcSmsNumSendResponse;
import com.xecoder.common.SecurityConstants;
import com.xecoder.entity.LogEntity;

import java.util.Date;
import java.util.Random;

/**
 * Created by vincent on 16/9/9.
 * Duser.name = 224911261@qq.com
 * SaugoWeb
 */
public class AliyunSmsPush {

    public static boolean sendSms(String phone,String templateCode, String jsonString,LogEntity log) {
        TaobaoClient client = new DefaultTaobaoClient(SecurityConstants.SMS_URL, SecurityConstants.SMS_KEY, SecurityConstants.SMS_SECRET);
        AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
        req.setExtend("1");
        req.setSmsType("normal");
        req.setSmsFreeSignName(SecurityConstants.SMSFREESIGNNAME);
        req.setRecNum(phone);
        req.setSmsTemplateCode(templateCode);
        req.setSmsParamString(jsonString);
        try {
            AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
            if(rsp.getResult()!=null&&rsp.getResult().getSuccess()) {
                log.setMessage("发送短信成功");
                return true;
            }
            else {
                log.setMessage("发送短信失败-" + rsp.getSubMsg());
                return false;
            }
        } catch (ApiException e) {
            log.setMessage("发送短信失败");
            return false;
        }
    }
    
    public static void main(String[] strings){

//        JSONObject object = new JSONObject();
//        object.put("realname", "test");
//        object.put("username", "15869100507");
//        object.put("password", "123456");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14726055", object.toJSONString(),log);


//        JSONObject object = new JSONObject();
//        object.put("name", "test");
//        object.put("password", "123456");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14685924", object.toJSONString(),log);

//        JSONObject object = new JSONObject();
//        object.put("name", "test");
//        object.put("agent", "test2");
//        object.put("number", "200");
//        object.put("point", "6000");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14765447", object.toJSONString(),log);

//        JSONObject object = new JSONObject();
//        object.put("name", "test");
//        object.put("agent", "test2");
//        object.put("number", "200");
//        object.put("point", "6000");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14770485", object.toJSONString(),log);


//        JSONObject object = new JSONObject();
//        object.put("agent", "test2");
//        object.put("number", "200");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14700583", object.toJSONString(),log);
//


//        JSONObject object = new JSONObject();
//        object.put("name", "test2");
//        object.put("number", "200");
//        LogEntity log = new LogEntity();
//        sendSms("15869100507", "SMS_14780357", object.toJSONString(),log);

        JSONObject object = new JSONObject();
        object.put("subAgent", "test2");
        object.put("agent", "test3");
        LogEntity log = new LogEntity();
        sendSms("15869100507", "SMS_14771654", object.toJSONString(),log);
    }
}


//模板名称:直代短信通知
//模板ID:SMS_14765447
//模板内容:尊敬的${name},您的直属代理${agent}已经订购${number}台淑格！恭喜您获得${point}点积分

//模板名称:次代订单生效通知
//模板ID:SMS_14770485
//模板内容:尊敬的${name}，您的次级代理${agent}已经订购${number}台淑格！恭喜您获得${point}点积分！

//模板名称:新订单审批通知
//模板ID:SMS_14700583
//模板内容:小主，${agent}又下订单${number}台了，赶紧去确认！

//模板名称:确认发货通知
//模板ID:SMS_14780357
//模板内容:尊敬的${name}，恭喜您！您订购${number}台的淑格已经生效，感谢您对淑格的信任，我们将尽快给您发货！

//模板名称:新代理申请
//模板ID:SMS_14771654
//模板内容:小主，又有新总代了。${subAgent}为他下面的直属总代${agent}申请已经提交，请尽快去确认哦

//模板名称:新用户密码
//模板ID:SMS_14726055
//模板内容:尊敬的${realname}，恭喜您成为全国总代，您的账户是${username}, 密码是${password}, 请尽快到系统后台更改密码。登录方式：淑格公众号-客户服务-系统登录

//模板名称:密码重置
//模板ID:SMS_14685924
//模板内容:尊敬的${name}，新密码是${password}，请尽快到系统后台更改密码；如不是你发起的请忽略


//模板名称:密码重置
//模板ID:SMS_14685924
//模板内容:尊敬的${name}，新密码是${password}，请尽快到系统后台更改密码；如不是你发起的请忽略

//模板名称:密码重置
//模板ID:SMS_1111111
//尊敬的${subAgent}，您申请的总代${agent}已经成功进入淑格系统，赶紧去恭喜TA吧