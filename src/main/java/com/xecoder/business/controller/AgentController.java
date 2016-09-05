package com.xecoder.business.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.Report;
import com.xecoder.business.service.OrderService;
import com.xecoder.business.service.ReportService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.common.util.SimpleDate;
import com.xecoder.entity.User;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;
import java.util.List;

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

    private static final String HOME = "/business/agent/home";//主页
    private static final String ORDER = "/business/agent/order";//发起订单
    private static final String ORDEROK = "/business/agent/orderOk";//发起订单
    private static final String QUERY = "/business/agent/query";//订单查询
    private static final String REPORT = "/business/agent/report";//订单统计
    private static final String REPORTADV = "/business/agent/reportAdv";
    private static final String NEW = "/business/agent/new";//新代理
    private static final String NEWOK = "/business/agent/newOk";//新代理
    private static final String PASSWORD = "/business/agent/password";//修改密码

    @RequestMapping(value = "/home")
    public ModelAndView index() {
        ModelAndView mav = new ModelAndView(HOME);
        User user = SecurityUtils.getLoginUser();
        mav.addObject("realname", user.getRealname());
        return mav;
    }

    /**
     * 统计
     * @param type 1 直代  2次代  3所有
     * @param beginDate
     * @param endDate
     * @param produceId
     * @return
     */
    @RequestMapping(value = "/query")
    public ModelAndView query(@RequestParam(defaultValue = "0") int type,
                              @RequestParam(required = false) String beginDate,
                              @RequestParam(required = false) String endDate,
                              @RequestParam(defaultValue = "0") long produceId,
                              @RequestParam(defaultValue = "0") long agentId) {
        ModelAndView mav = new ModelAndView(QUERY);
        User user = SecurityUtils.getLoginUser();
        Order order = new Order();
        Date dateB = beginDate==null||beginDate.equals("")?SimpleDate.getDayEnd(new Date(), -30):SimpleDate.strToDate(beginDate, "yyyy-MM-dd");
        Date dateE = endDate==null||endDate.equals("")?SimpleDate.getDayEnd(new Date(), 0):SimpleDate.strToDate(endDate, "yyyy-MM-dd");
        order.setBeginDate(dateB);
        order.setEndDate(dateE);
        if (produceId != 0) {
            order.setProduceId(produceId);
        }
        if (agentId == 0) {
            order.setAgentId(user.getId());
        }
        else
        {
            order.setAgentId(agentId);
        }
        order.setAgentId(user.getId());
        Page page = new Page(1,10000,"input_time","desc");
        List<Order> orderList = orderService.findAll(page, order,type);

        mav.addObject("beginDate", SimpleDate.format(dateB,"yyyy-MM-dd"));
        mav.addObject("endDate", SimpleDate.format(dateE,"yyyy-MM-dd"));
        mav.addObject("produceId", produceId);
        mav.addObject("orderList", orderList);
        return mav;
    }


    @RequestMapping(value = "/new")
    public ModelAndView newAgent() {
        ModelAndView mav = new ModelAndView(NEW);
        User user = SecurityUtils.getLoginUser();
        mav.addObject("title", "新代理申请");
        mav.addObject("parentName", user.getRealname());
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            String json = mapper.writeValueAsString(new User());
            mav.addObject("user", json);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return mav;
    }

    @RequestMapping(value = "/info")
    public ModelAndView info() {
        ModelAndView mav = new ModelAndView(NEW);
        User user = SecurityUtils.getLoginUser();
        mav.addObject("title", "修改信息");
        mav.addObject("parentName", user.getParentName());
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            String json = mapper.writeValueAsString(user);
            mav.addObject("user", json);
            return mav;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/password")
    public String password() {
        return PASSWORD;
    }

    @RequestMapping(value = "/order")
    public ModelAndView order() {
        User user = SecurityUtils.getLoginUser();
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
    public ModelAndView orderOk(@PathVariable String produceNumber, @PathVariable String produceName) {
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
    public ModelAndView newOk(@PathVariable String realName, @PathVariable String phone) {
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

}
