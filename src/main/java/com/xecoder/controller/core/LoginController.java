package com.xecoder.controller.core;

import com.alibaba.fastjson.JSONObject;
import com.xecoder.common.SecurityConstants;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.util.AliyunSmsPush;
import com.xecoder.common.util.RadomUtils;
import com.xecoder.common.util.Result;
import com.xecoder.entity.LogEntity;
import com.xecoder.entity.Login;
import com.xecoder.entity.User;
import com.xecoder.service.core.LogEntityService;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.CaptchaUsernamePasswordToken;
import com.xecoder.shiro.IncorrectCaptchaException;
import com.xecoder.shiro.RepeatLoginException;
import com.xecoder.shiro.ShiroDbRealm;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;
import java.util.UUID;

@Controller
@RequestMapping("/")
public class LoginController extends BaseAction {

    @Autowired
    UserService userService;
	private static final Logger LOG = LoggerFactory.getLogger(LoginController.class);
	private static final String LOGIN_PAGE = "login";
    private static final String LOGIN_AGENT_PAGE = "agent";
    private static final String LOGIN_AGENT_FORGET = "forget";


    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView list() {
        return getView(new ModelAndView(LOGIN_PAGE));
    }


    @RequestMapping(value="/forget" ,method = RequestMethod.GET)
    public ModelAndView forget() {
        return getView(new ModelAndView(LOGIN_AGENT_FORGET));
    }

    @RequestMapping(value="/agentLogin" ,method = RequestMethod.GET)
    public ModelAndView agent() {
        return getView(new ModelAndView(LOGIN_AGENT_PAGE));
    }

    private ModelAndView getView(ModelAndView view){
        String salt = UUID.randomUUID().toString();
        view.addObject("salt",salt);
        return view;
    }


    @RequestMapping(value="/forgetSend",method= RequestMethod.POST)
    @ResponseBody
    public Result forgetSend(@ModelAttribute Login login) throws Exception {
        Result result = new Result();
        CaptchaUsernamePasswordToken token=new CaptchaUsernamePasswordToken();
        result.setSuccessful(false);
        try {
            token.setCaptcha(login.getCaptcha());
            ShiroDbRealm shiroDbRealm = new ShiroDbRealm();
            if (shiroDbRealm.isUseCaptcha()&&!doCaptchaValidate(token)) {//忽略大小写。
                throw new IncorrectCaptchaException("验证码错误");
            }
            User user = userService.get(login.getUsername());
            if(user==null){
                result.setMsg(SecurityConstants.UNKNOWN_ACCOUNT_EXCEPTION);
                return result;
            }
            else{
                //TODO 发送6位随机密码
                result.setSuccessful(true);
                result.setMsg("密码已发");
                user.setPlainPassword(String.valueOf(RadomUtils.nextSixInt()));
                LogEntity log = new LogEntity();
                log.setUsername(user.getUsername());
                log.setCreateTime(new Date());
                log.setSuperid(String.valueOf(user.getId()));
                log.setIpAddress(request.getRemoteAddr());
                JSONObject object = new JSONObject();
                object.put("name",user.getRealname());
                object.put("password",user.getPlainPassword());
                log.setLogLevel("3");
                this.sendFill(user.getPhone(),"SMS_14685924", object.toJSONString(), log,result);
                if(!result.isSuccessful()){
                    return result;
                }
                userService.update(user);
            }

        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("验证码错误");
        }
        return result;
    }

        //验证码校验
    public boolean doCaptchaValidate(CaptchaUsernamePasswordToken token){
        String captcha = (String) SecurityUtils.getSubject().getSession().getAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
        if (captcha != null &&!captcha.equalsIgnoreCase(token.getCaptcha())){
            return false;
        }
        return true;
    }

    @RequestMapping(value="/login/do",method= RequestMethod.POST)
    @ResponseBody
    public Result loadB(@ModelAttribute Login login) throws Exception {

        Result result = new Result();
        Subject subject=SecurityUtils.getSubject();
        CaptchaUsernamePasswordToken token=new CaptchaUsernamePasswordToken();
        token.setUsername(login.getUsername());
        token.setPassword(login.getPassword().toCharArray());
        token.setCaptcha(login.getCaptcha());
        token.setRememberMe(login.getRememberMe()!=null&&login.getRememberMe().equals("on")?true:false);
        try{
            result.setSuccessful(false);
            ShiroDbRealm shiroDbRealm = new ShiroDbRealm();

            try {
                if (shiroDbRealm.isUseCaptcha()&&!doCaptchaValidate(token)) {//忽略大小写。
                    throw new IncorrectCaptchaException("验证码错误");
                }
            } catch (Exception e) {
                // session如果没有刷新，validateResponseForID会抛出com.octo.captcha.service.CaptchaServiceException的异常
                throw new IncorrectCaptchaException("验证码错误");
            }
            subject.login(token);
            LOG.debug("sessionTimeout===>"+subject.getSession().getTimeout());
            result.setMsg(SecurityConstants.LOGIN_IS_SUCCESS);
            result.setSuccessful(true);
        }
        catch (UnknownSessionException use) {
            subject = new Subject.Builder().buildSubject();
            subject.login(token);
            LOG.error(SecurityConstants.UNKNOWN_SESSION_EXCEPTION);
            result.setMsg(SecurityConstants.UNKNOWN_SESSION_EXCEPTION);
        }
        catch(UnknownAccountException ex){
            LOG.error(SecurityConstants.UNKNOWN_ACCOUNT_EXCEPTION);
            result.setMsg(SecurityConstants.UNKNOWN_ACCOUNT_EXCEPTION);
        }
        catch (IncorrectCredentialsException ice) {
            result.setMsg(SecurityConstants.INCORRECT_CREDENTIALS_EXCEPTION);
        }
        catch (LockedAccountException lae) {
            result.setMsg(SecurityConstants.LOCKED_ACCOUNT_EXCEPTION);
        }
        catch (DisabledAccountException dae) {
            result.setMsg(SecurityConstants.DISABLED_ACCOUNT_EXCEPTION);
        }
        catch (IncorrectCaptchaException e) {
            result.setMsg(SecurityConstants.INCORRECT_CAPTCHA_EXCEPTION);
        }catch (RepeatLoginException e) {
            result.setMsg(SecurityConstants.REPEAT_LOGIN_EXCEPTION);
        }
        catch (AuthenticationException ae) {
            result.setMsg(SecurityConstants.AUTHENTICATION_EXCEPTION);
        }
        catch(Exception e){
            result.setMsg(SecurityConstants.UNKNOWN_EXCEPTION);
        }
        finally {

        }
        return result;
    }
}
