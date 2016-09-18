package com.xecoder.business.controller;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.Remuneration;
import com.xecoder.business.service.OrderService;
import com.xecoder.business.service.RemunerationService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.*;
import com.xecoder.entity.LogEntity;
import com.xecoder.entity.User;
import com.xecoder.entity.UserRole;
import com.xecoder.service.core.LogEntityService;
import com.xecoder.service.core.UserRoleService;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.IncorrectCaptchaException;
import com.xecoder.shiro.SecurityUtils;
import com.xecoder.viewModel.GridModel;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;
import java.util.List;

/**
 * Created by xecoder on Sun Aug 21 15:24:09 CST 2016.
 */
@Controller
@SuppressWarnings("unchecked")
@RequestMapping(value = "/business/order")
public class OrderController extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    OrderService orderService;

    @Autowired
    UserService userService;

    @Autowired
    UserRoleService userRoleService;

    @Autowired
    private RemunerationService remunerationService;

    private static final String INDEX = "/business/order/list";
    private static final String CHECK = "/business/order/check";
    private static final String EDIT = "/business/order/edit";
    private static final String CHECKEDIT = "/business/order/checkEdit";
    private static final String INFO = "/business/order/info";
    private static final String QUERY = "/business/order/query";
    private static final String QUERYREPORT = "/business/order/queryReport";
    private static final String REPORT = "/business/order/report";
    private static final String SUPERREPORT = "/business/order/superReport";

    @RequestMapping(value = "/index")
    public String index() {
        return INDEX;
    }

    @RequiresPermissions("Check:show")
    @RequestMapping(value = "/check")
    public String check() {
        return CHECK;
    }

    @RequiresPermissions("Query:show")
    @RequestMapping(value = "/query")
    public String query() {
        return QUERY;
    }


    @RequiresPermissions("Report:show")
    @RequestMapping(value = "/report")
    public String report() {
        return REPORT;
    }

    @RequiresPermissions("SuperReport:show")
    @RequestMapping(value = "/superReport")
    public String superReport() {
        return SUPERREPORT;
    }

    @RequiresPermissions("Report:show")
    @RequestMapping(value = "/queryReport")
    public ModelAndView queryReport(@RequestParam int agentId, @RequestParam String condition) {
        ModelAndView mav = new ModelAndView(QUERYREPORT);
        try {
            Order order = new Order();

            User user = userService.get((long) agentId);
            User currentUser = SecurityUtils.getLoginUser();
            if(currentUser.getEmail().equals("")) {
                List<User> list = userService.selectTreeById(currentUser.getId());
                if (!list.contains(user)) {
                    new IncorrectCaptchaException("没有权限");
                }
            }
            String produceId, start, end;
            String[] temp = condition.split("~");
            produceId = (temp[0]).replace("|", "");
            start = temp[1].replace("|", "");
            end = temp[2].replace("|", "");

            if (produceId != null && !produceId.equals(""))
                order.setParentId(Long.valueOf(produceId));

            if (agentId != 0)
                order.setAgentId(Long.valueOf(agentId));


            if (start != null && !start.equals(""))
                order.setBeginDate(SimpleDate.strToDate(start));


            if (end != null && !end.equals(""))
                order.setEndDate(SimpleDate.strToDate(end));

            ObjectMapper mapper = JacksonMapper.getInstance();
            String json = mapper.writeValueAsString(order);

            mav.addObject("order", json);

            return mav;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 表格订单
     *
     * @return GridModel
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public GridModel list() {
        Order order = SearchForm(Order.class);
        Page info = orderService.findByPage(page(), order);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }

    @RequestMapping(value = "/alterOrderCheck")
    @ResponseBody
    public int alterAgentCheck() {
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isPermitted("Check:edit")) {
            Order order = new Order();
            order.setStatus(1);
            List<Order> list = orderService.findAll(null, order, 0);
            return list != null ? list.size() : 0;
        }
        return 0;
    }

    /**
     * 添加订单
     *
     * @return ModelAndView
     */
    @RequiresPermissions("Order:save")
    @RequestMapping(value = "/add")
    @ResponseBody
    public ModelAndView add() {
        Order order = new Order();
        User user = SecurityUtils.getLoginUser();
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        return getView(EDIT, "order", order);
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
        Order order = orderService.get(id);
        User user = SecurityUtils.getLoginUser();
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        return getView(EDIT, "order", order);
    }

    /**
     * 确认订单
     *
     * @return ModelAndView
     */
    @RequiresPermissions("Check:edit")
    @RequestMapping(value = "/check/{id}")
    @ResponseBody
    public ModelAndView check(@PathVariable String id) {
        Order order = orderService.get(id);
        User user = SecurityUtils.getLoginUser();
        order.setCheckId(user.getId());
        order.setCheckName(user.getRealname());
        return getView(CHECKEDIT, "order", order);
    }

    /**
     * 查看订单
     *
     * @return ModelAndView
     */
    @RequiresPermissions("Query:show")
    @RequestMapping(value = "/view/{id}")
    @ResponseBody
    public ModelAndView view(@PathVariable String id) {
        Order order = orderService.get(id);
        return getView(INFO, "order", order);
    }


    /**
     * 保存订单
     *
     * @param order
     * @return Result
     */
    @RequiresPermissions("Order:save")
    @RequestMapping(value = "/save")
    @ResponseBody
    public Result saveOrder(@ModelAttribute Order order,
                            @RequestParam("file") MultipartFile file) {
        Result result = new Result();
        String agent = "";
        try {

            if (!file.isEmpty()) {
//                order.setBankMemo(file.getOriginalFilename());
                String path = UploadUtils.upload(file, request);
                order.setUrl(path);
//                String code = ImageReader.getCode(path);
//                order.setProduceName(code);
            }
            if (order.getAgentId() != null && order.getAgentId() != 0) {
                User u = userService.get(order.getAgentId());
                agent = u.getRealname();
                order.setParentId(u.getParentId());
                //order.setParentName(u.getParentName());
            }
            order.setStatus(1);
            order.setInputTime(new Date());
            if (order.getId() == null || order.getId().equals(""))
                orderService.save(order);
            else
                orderService.update(order);

            result.setMsg("成功");
            result.setData(order.getAgentId());
            result.setSuccessful(true);

            if (order.getAgentId() != null) {//审核人

                LogEntity log = new LogEntity();
                log.setUsername(agent);
                log.setCreateTime(new Date());
                log.setSuperid(String.valueOf(order.getId()));
                log.setIpAddress(request.getRemoteAddr());

                JSONObject object = new JSONObject();
                object.put("name", agent);
                object.put("number", String.valueOf(order.getProduceNumber()));
                log.setLogLevel("6");
                UserRole userRole = new UserRole();
                userRole.setRoleId(Long.valueOf(101));
                List<UserRole> list = userRoleService.find(userRole);
                if (list != null && list.size() > 0) {
                    for (UserRole userRole1 : list) {
                        User user = userService.get(userRole1.getUserId());
                        if (user != null) {
                            this.sendFill(user.getPhone(), "SMS_14700583", object.toJSONString(), log, result);
                        }
                    }
                    if (!result.isSuccessful()) {
                        return result;
                    }
                }
            }


        } catch (Exception e) {
            e.printStackTrace();
            result.setMsg("失败" + e.getMessage());
            result.setSuccessful(false);
        }
        return result;
    }


    /**
     * 保存订单
     *
     * @param order
     * @return Result
     */
    @RequiresPermissions("Order:edit")
    @RequestMapping(value = "/update")
    @ResponseBody
    public Result updateOrder(@ModelAttribute Order order) {
        Result result = new Result();
        try {
            Order order_db = orderService.get(order.getId());
            if (order_db.getStatus() == 1) {
                orderService.update(order);
                result.setMsg("修改成功");
                result.setSuccessful(true);
            } else {
                result.setSuccessful(false);
                result.setMsg("订单已被其他人修改,修改失败");
            }

        } catch (Exception e) {
            result.setMsg("失败" + e.getMessage());
            result.setSuccessful(false);
        }
        return result;
    }


    /**
     * 查询单个订单
     *
     * @param id
     * @return
     */
    @RequiresPermissions("Order:view")
    @RequestMapping(value = "/get/{id}")
    @ResponseBody
    public Order getInfo(@PathVariable String id) {
        return orderService.get(id);
    }

    /**
     * 删除订单
     *
     * @param id
     * @return
     */
    @RequiresPermissions("Order:delete")
    @RequestMapping(value = "/delete/{id}")
    @ResponseBody
    public Result deleteInfo(@PathVariable String id) {
        Result result = new Result();
        User user = SecurityUtils.getLoginUser();
        Order order = orderService.get(id);
        if (order.getStatus() != 9) {
            order.setStatus(9);
            if (!order.getInputId().equals(user.getId())) {
                order.setCheckId(user.getId());
                order.setCheckName(user.getRealname());
            }
            orderService.update(order);
            result.setSuccessful(true);
            result.setMsg("撤销成功");
        } else {
            result.setSuccessful(false);
            result.setMsg("订单已被其他人撤销,撤销失败");
        }
        return result;
    }

    /**
     * 审核订单
     *
     * @param orderO
     * @return
     */
    @RequiresPermissions("Check:edit")
    @RequestMapping(value = "/checkSave")
    @ResponseBody
    public Result checkSave(@ModelAttribute Order orderO) {
        Result result = new Result();
        Order order = orderService.get(orderO.getId());
        User user = SecurityUtils.getLoginUser();
        if (order.getStatus() == 1) {
            order.setStatus(2);
            order.setCheckId(user.getId());
            order.setCheckName(user.getRealname());
            result.setSuccessful(true);
            result.setMsg("确认成功");

            LogEntity log = new LogEntity();
            log.setUsername(user.getUsername());
            log.setCreateTime(new Date());
            log.setSuperid(String.valueOf(order.getId()));
            log.setIpAddress(request.getRemoteAddr());

            User agent = userService.get(order.getAgentId());
            if (order.getAgentId() != null) {//代理

                JSONObject object = new JSONObject();
                object.put("name", agent.getRealname());
                object.put("number", String.valueOf(order.getProduceNumber()));
                log.setLogLevel("7");
                this.sendFill(agent.getPhone(), "SMS_14780357", object.toJSONString(), log,result);
                if (!result.isSuccessful()) {
                    return result;
                }
            }

            //积分
            Remuneration remuneration = new Remuneration();
            remuneration.setProduceId(order.getProduceId());
            Page page = new Page(1, 10, "level", "desc");
            List<Remuneration> list = remunerationService.findAll(page, remuneration);

            if (order.getParentId() != null) {//上级代理
                User user1 = userService.get(order.getParentId());
                JSONObject object = new JSONObject();
                object.put("name", user1.getRealname());
                object.put("agent", agent.getRealname());
                object.put("number", String.valueOf(order.getProduceNumber()));
                if (list.size() == 2) {
                    remuneration = list.get(0);
                    object.put("point", remuneration.getRemuneration()*order.getProduceNumber());
                }
                log.setLogLevel("4");
                this.sendFill(user1.getPhone(), "SMS_14765447", object.toJSONString(), log,result);
                if (!result.isSuccessful()) {
                    return result;
                }
            }


            if (order.getParentId() != null) {//上上级代理
                User user1 = userService.get(order.getParentId());
                User user2 = userService.get(user1.getParentId());
                JSONObject object = new JSONObject();
                object.put("name", user2.getRealname());
                object.put("agent", agent.getRealname());
                object.put("number", String.valueOf(order.getProduceNumber()));
                if (list.size() == 2) {
                    remuneration = list.get(1);
                    object.put("point", remuneration.getRemuneration()*order.getProduceNumber());
                }
                log.setLogLevel("5");
                this.sendFill(user2.getPhone(), "SMS_14770485", object.toJSONString(), log,result);
                if (!result.isSuccessful()) {
                    return result;
                }
            }

            orderService.update(order);
        } else {
            result.setSuccessful(false);
            result.setMsg("订单已被其他人修改,确认失败");
        }
        return result;
    }
}

