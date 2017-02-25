package com.xecoder.business.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.Remuneration;
import com.xecoder.business.service.OrderService;
import com.xecoder.business.service.RemunerationService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.common.util.SimpleDate;
import com.xecoder.entity.User;
import com.xecoder.entity.UserRole;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import com.xecoder.shiro.ShiroUser;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
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
 * Created by imanon.net on 16/9/3.
 * Duser.name = imanon
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

    @Autowired
    RemunerationService remunerationService;

    private static final String INDEX = "console/index/index";
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
        ModelAndView mav = new ModelAndView(INDEX);
        ShiroUser shiroUser = SecurityUtils.getShiroUser();
        List<UserRole> list = shiroUser.getUser().getUserRoles();
        for(UserRole userRole:list){
            if(userRole.getRoleId()==2||userRole.getRoleId()==3){
                mav = new ModelAndView(HOME);
                mav.addObject("realname", shiroUser.getUser().getRealname());
            }
        }
        return mav;
    }

    /**
     * 统计
     *
     * @param type      0 查询  1直代统计  2次代查询 3查询123层 4所有tree
     * @param beginDate
     * @param endDate
     * @param produceId
     * @return
     */
    @RequiresPermissions("Query:show")
    @RequestMapping(value = "/query")
    public ModelAndView query(@RequestParam(defaultValue = "3") int type,
                              @RequestParam(required = false) String beginDate,
                              @RequestParam(required = false) String endDate,
                              @RequestParam(defaultValue = "0") long produceId,
                              @RequestParam(defaultValue = "0") int status,
                              @RequestParam(defaultValue = "0") long agentId) {

        Subject currentUser = SecurityUtils.getSubject();
        String pageType = QUERY;
        if (type >= 1 && type <= 3) {
            currentUser.checkPermission("Report:show");
            pageType = REPORT;
        }
        if (type == 4) {
            currentUser.checkPermission("SuperReport:show");
            pageType = REPORTADV;
        }
        ModelAndView mav = new ModelAndView(pageType);
        User user = SecurityUtils.getLoginUser();
        Order order = new Order();
        Date dateB = beginDate == null || beginDate.equals("") ? SimpleDate.getDayEnd(new Date(), -365) : SimpleDate.strToDate(beginDate, "yyyy-MM-dd");
        Date dateE = endDate == null || endDate.equals("") ? SimpleDate.getDayEnd(new Date(), 0) : SimpleDate.strToDate(endDate, "yyyy-MM-dd");
        order.setBeginDate(dateB);
        order.setEndDate(dateE);
        if (produceId != 0) {
            order.setProduceId(produceId);
        }

        order.setParentId(agentId);

        order.setStatus(status==0?null:status);
        order.setAgentId(user.getId());

        Page page = new Page(1, 10000, "input_time", "desc");
        List<Order> orderList = orderService.findAll(page, order, type);

        //所有积分
        List<Remuneration> remunerations = remunerationService.findAll(null,new Remuneration());

        if (type >= 1 && type <= 3){
            for(Order o:orderList){
                if(o.getParentId().equals(user.getId())){//直代
                    for(Remuneration remuneration:remunerations){
                        if(remuneration.getLevel()==1&&o.getProduceId().equals(remuneration.getProduceId())){
                            o.setPoint(o.getProduceNumber()*remuneration.getRemuneration());
                        }
                    }
                }
                else if(!o.getParentId().equals(user.getId())&&!o.getAgentId().equals(user.getId())){//次代
                    for(Remuneration remuneration:remunerations){
                        if(remuneration.getLevel()==2&&o.getProduceId().equals(remuneration.getProduceId())){
                            o.setPoint(o.getProduceNumber()*remuneration.getRemuneration());
                        }
                    }
                }
                else{
                    o.setPoint((long) 0);//自己
                }

            }
        }


        mav.addObject("beginDate", SimpleDate.format(dateB, "yyyy-MM-dd"));
        mav.addObject("endDate", SimpleDate.format(dateE, "yyyy-MM-dd"));
        mav.addObject("produceId", produceId);
        mav.addObject("agentId", agentId);
        mav.addObject("type", type);
        mav.addObject("status", status);
        mav.addObject("orderList", orderList);
        return mav;
    }


    @RequiresPermissions("Agent:save")
    @RequestMapping(value = "/new")
    public ModelAndView newAgent() {
        ModelAndView mav = new ModelAndView(NEW);
        User user = SecurityUtils.getLoginUser();
        mav.addObject("title", "新代理申请");
        mav.addObject("parentName", user.getRealname()==null?"":user.getRealname());
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

    @RequiresPermissions("Order:save")
    @RequestMapping(value = "/info")
    public ModelAndView info() {
        ModelAndView mav = new ModelAndView(NEW);
        User user = SecurityUtils.getLoginUser();
        mav.addObject("title", "修改信息");
        mav.addObject("parentName", user.getRealname()==null?"":user.getParentName());
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

    @RequiresPermissions("Order:save")
    @RequestMapping(value = "/order")
    public ModelAndView order() {
        User user = SecurityUtils.getLoginUser();
        Order order = new Order();
        order.setAgentId(user.getId());
        order.setAgentName(user.getRealname());
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        order.setSelfOrder("1");
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

    @RequiresPermissions("Order:save")
    @RequestMapping(value = "/edit/{id}")
    @ResponseBody
    public ModelAndView edit(@PathVariable String id) {
        ModelAndView mav = new ModelAndView(ORDER);
        try {
            Order order = orderService.get(id);
            ObjectMapper mapper = JacksonMapper.getInstance();
            String self = SecurityUtils.getLoginUser().getId().equals(order.getAgentId())?"1":"0";//有权修改
            order.setSelfOrder(self);
            String json =mapper.writeValueAsString(order);
            mav.addObject("order",json);
            return mav;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
    }

}
