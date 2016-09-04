package com.xecoder.business.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xecoder.business.entity.Order;
import com.xecoder.business.service.OrderService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.entity.User;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by vincent on 16/9/3.
 * Duser.name = 224911261@qq.com
 * SaugoWeb
 */
@Controller
@RequestMapping(value = "/agent")
public class AgentController extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    OrderService orderService;

    @Autowired
    UserService userService;


    private static final String HOME = "/business/agent/home";
    private static final String ORDER = "/business/agent/order";//发起订单
    private static final String ORDEROK = "/business/agent/orderOk";//发起订单
    private static final String REPORT = "/business/agent/report";
    private static final String QUERY = "/business/agent/query";
    private static final String REPORTADV = "/business/agent/reportAdv";
    private static final String NEW = "/business/agent/new";//新代理
    private static final String NEWOK = "/business/agent/newOk";//新代理
    private static final String PASSWORD = "/business/agent/password";

    @RequestMapping(value = "/home")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView(HOME);
        User  user = SecurityUtils.getLoginUser();
        mav.addObject("realname", user.getRealname());
        return mav;
    }

    @RequestMapping(value = "/new")
    public ModelAndView newAgent() {
        ModelAndView mav = new ModelAndView(NEW);
        User  user = SecurityUtils.getLoginUser();
        mav.addObject("title", "新代理申请");
        mav.addObject("parentName", user.getRealname());
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            String json = mapper.writeValueAsString(new User());
            mav.addObject("user", json);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
        return mav;
    }

    @RequestMapping(value = "/info")
    public ModelAndView info() {
        ModelAndView mav = new ModelAndView(NEW);
        User  user = SecurityUtils.getLoginUser();
        mav.addObject("title", "修改信息");
        mav.addObject("parentName", user.getParentName());
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            String json =mapper.writeValueAsString(user);
            mav.addObject("user",json);
            return mav;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value="/password")
    public String password() {
        return PASSWORD;
    }

    @RequestMapping(value = "/order")
    public ModelAndView order() {
        User  user = SecurityUtils.getLoginUser();
        Order order = new Order();
        order.setAgentId(user.getId());
        order.setAgentName(user.getRealname());
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        return getView(ORDER, "order", order);
    }

    /**
     * 完成订单
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/orderOk/{produceNumber}/{produceName}")
    @ResponseBody
    public ModelAndView orderOk(@PathVariable String produceNumber,@PathVariable String produceName) {
        ModelAndView mav = new ModelAndView(ORDEROK);
        mav.addObject("produceNumber", produceNumber);
        mav.addObject("produceName", produceName);
        return mav;
    }

    /**
     * 完成新代理申请
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/newOk/{realName}/{phone}")
    @ResponseBody
    public ModelAndView newOk(@PathVariable String realName,@PathVariable String phone) {
        ModelAndView mav = new ModelAndView(NEWOK);
        mav.addObject("realname", realName);
        mav.addObject("phone", phone);
        return mav;
    }

    /**
     * 编辑订单
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/edit/{id}")
    @ResponseBody
    public ModelAndView edit(@PathVariable Long id) {
        Order order = orderService.get(id);
        return getView(ORDER, "order", order);
    }


//    @RequestMapping(value = "/order")
//    public ModelAndView order() {
//        ModelAndView mav = new ModelAndView(ORDER);
//        User  user = SecurityUtils.getLoginUser();
//        mav.addObject("realname", user.getRealname());
//        return mav;
//    }
//
//
//    @RequestMapping(value = "/order")
//    public ModelAndView order() {
//        ModelAndView mav = new ModelAndView(ORDER);
//        User  user = SecurityUtils.getLoginUser();
//        mav.addObject("realname", user.getRealname());
//        return mav;
//    }
}
