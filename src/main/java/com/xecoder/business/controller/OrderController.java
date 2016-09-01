package com.xecoder.business.controller;

import com.xecoder.business.entity.Order;
import com.xecoder.business.service.OrderService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.Result;
import com.xecoder.common.util.UploadUtils;
import com.xecoder.entity.User;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import com.xecoder.viewModel.GridModel;
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

    private static final String INDEX = "/business/order/list";
    private static final String CHECK = "/business/order/check";
    private static final String EDIT = "/business/order/edit";
    private static final String CHECKEDIT = "/business/order/checkEdit";
    private static final String INFO = "/business/order/info";
    private static final String QUERY = "/business/order/query";
    private static final String QUERYREPORT = "/business/order/queryReport";

    @RequestMapping(value = "/index")
    public String index() {
        return INDEX;
    }

    @RequestMapping(value = "/check")
    public String check() {
        return CHECK;
    }

    @RequestMapping(value = "/query")
    public String query() {
        return QUERY;
    }

    @RequestMapping(value = "/queryReport")
    public ModelAndView queryReport(@RequestParam int produceId,@RequestParam int agentId,@RequestParam String start,@RequestParam String end,@RequestParam int status) {
        ModelAndView mav = new ModelAndView(QUERYREPORT);
        try {
            User user = userService.get((long) agentId);
            mav.addObject("produceId",produceId);
            mav.addObject("agentName",user.getRealname());
            mav.addObject("agentId",agentId);
            mav.addObject("start",start);
            mav.addObject("end",end);
            mav.addObject("status",status);
            return mav;
        }
        catch (Exception e)
        {
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

    @RequestMapping(value="/alterOrderCheck")
    @ResponseBody
    public int alterAgentCheck(){
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isPermitted("Check:edit")) {
            Order order = new Order();
            order.setStatus(1);
            List<Order> list =  orderService.findAll(null,order);
            return list!=null?list.size():0;
        }
        return 0;
    }
    /**
     * 添加订单
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public ModelAndView add() {
        Order order = new Order();
        User  user = SecurityUtils.getLoginUser();
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        return getView(EDIT, "order", order);
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
        User  user = SecurityUtils.getLoginUser();
        order.setInputId(user.getId());
        order.setInputName(user.getRealname());
        return getView(EDIT, "order", order);
    }

    /**
     * 确认订单
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/check/{id}")
    @ResponseBody
    public ModelAndView check(@PathVariable Long id) {
        Order order = orderService.get(id);
        User  user = SecurityUtils.getLoginUser();
        order.setCheckId(user.getId());
        order.setCheckName(user.getRealname());
        return getView(CHECKEDIT, "order", order);
    }

    /**
     * 查看订单
     *
     * @return ModelAndView
     */
    @RequestMapping(value = "/view/{id}")
    @ResponseBody
    public ModelAndView view(@PathVariable Long id) {
        Order order = orderService.get(id);
        return getView(INFO, "order", order);
    }


    /**
     * 保存订单
     *
     * @param order
     * @return Result
     */
    @RequestMapping(value = "/save")
    @ResponseBody
    public Result saveOrder(@ModelAttribute Order order,
                            @RequestParam("file") MultipartFile file) {
        Result result = new Result();
        try {

            if (!file.isEmpty()) {
//                order.setBankMemo(file.getOriginalFilename());
                String path = UploadUtils.upload(file, request);
                order.setUrl(path);
//                String code = ImageReader.getCode(path);
//                order.setProduceName(code);
            }
            if(order.getAgentId()!=null&&order.getAgentId()!=0){
                User u = userService.get(order.getAgentId());
                order.setParentId(u.getParentId());
                order.setParentName(u.getParentName());
            }

            order.setStatus(1);
            order.setInputTime(new Date());
            if(order.getId()==null)
                orderService.save(order);
            else
                orderService.update(order);

            result.setMsg("成功");
            result.setSuccessful(true);
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
    @RequestMapping(value = "/update")
    @ResponseBody
    public Result updateOrder(@ModelAttribute Order order) {
        Result result = new Result();
        try {
            Order order_db = orderService.get(order.getId());
            if(order_db.getStatus()==1) {
                orderService.update(order);
                result.setMsg("修改成功");
                result.setSuccessful(true);
            }
            else{
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
    @RequestMapping(value = "/get/{id}")
    @ResponseBody
    public Order getInfo(@PathVariable Long id) {
        return orderService.get(id);
    }

    /**
     * 删除订单
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/delete/{id}")
    @ResponseBody
    public Result deleteInfo(@PathVariable Long id) {
        Result result = new Result();
        User  user = SecurityUtils.getLoginUser();
        Order order = orderService.get(id);
        if(order.getStatus()!=9) {
            order.setStatus(9);
            if(!order.getInputId().equals(user.getId())){
                order.setCheckId(user.getId());
                order.setCheckName(user.getRealname());
            }
            orderService.update(order);
            result.setSuccessful(true);
            result.setMsg("撤销成功");
        }
        else{
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
    @RequestMapping(value = "/checkSave")
    @ResponseBody
    public Result checkSave(@ModelAttribute Order orderO) {
        Result result = new Result();
        Order order = orderService.get(orderO.getId());
        User  user = SecurityUtils.getLoginUser();
        if(order.getStatus()==1) {
            order.setStatus(2);
            order.setCheckId(user.getId());
            order.setCheckName(user.getRealname());
            orderService.update(order);
            result.setSuccessful(true);
            result.setMsg("确认成功");
        }
        else{
            result.setSuccessful(false);
            result.setMsg("订单已被其他人修改,确认失败");
        }
        return result;
    }
}

