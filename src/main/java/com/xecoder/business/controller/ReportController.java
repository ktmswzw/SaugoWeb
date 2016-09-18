package com.xecoder.business.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonEncoding;
import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.Report;
import com.xecoder.business.service.ReportService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.common.util.Result;
import com.xecoder.common.util.SimpleDate;
import com.xecoder.entity.User;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import com.xecoder.viewModel.GridModel;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.Security;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Created by xecoder on Thu Sep 01 23:24:45 CST 2016.
 */
@Controller
@SuppressWarnings("unchecked")
@RequestMapping(value = "/business/report")
public class ReportController extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ReportService reportService;


    @Autowired
    UserService userService;

    private static final String INDEX = "/business/report/list";
    private static final String EDIT = "/business/report/edit";
    private static final String CHARLINE = "/business/report/charLine";
    private static final String LASAGNA = "/business/report/lasagna";

    @RequestMapping(value="/index")
    public String index() {
        return INDEX;
    }

    @RequiresPermissions("CharReport:show")
    @RequestMapping(value="/charLine")
    public ModelAndView charLine() {

        ModelAndView mav = new ModelAndView(CHARLINE);
        try {
            User user = new User();
            user.setStatus("enabled");
            int agentNumber = userService.findAgentCount(user);
            mav.addObject("agentNumber", agentNumber);
            return mav;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequiresPermissions("CharReport:show")
    @RequestMapping(value="/lasagna/{date}")
    public ModelAndView lasagna(@PathVariable String date) {
        ModelAndView mav = new ModelAndView(LASAGNA);
        try {
            mav.addObject("date", date);
            return mav;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 表格积分统计
     * @return GridModel
     */
    @RequiresPermissions("Report:show")
    @RequestMapping(value="/reportSuperlist")
    @ResponseBody
    public GridModel reportSuperlist() {
        Report report = SearchForm(Report.class);
        report.setSuperReport(true);
        Page info = reportService.reportTreeByPage(page(), report);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }

    /**
     * 首页统计
     * @return GridModel
     */
    @RequiresPermissions("Report:show")
    @RequestMapping(value="/charLineList")
    @ResponseBody
    public List<Report> charLineList() {
        Report report = SearchForm(Report.class);
        report.setSuperReport(true);
        if(report.getBeginDate()!=null&&!report.getBeginDate().equals("")){
            report.setBeginDate(SimpleDate.getDayStart(new Date(),-30));
        }
        List<Report> list = reportService.reportChar(report);
        return list;
    }

    /**
     * 表格积分统计
     * @return GridModel
     */
    @RequiresPermissions("Report:show")
    @RequestMapping(value="/reportList")
    @ResponseBody
    public GridModel reportList() {
        Report report = SearchForm(Report.class);
        report.setSuperReport(false);
        Page info = reportService.reportTreeByPage(page(), report);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }



    /**
     * 图标统计
     * @return GridModel
     */
    @RequiresPermissions("CharReport:show")
    @RequestMapping(value="/lasagnaData/{date}")
    @ResponseBody
    public List<Report> lasagnaData(@PathVariable String date) {
        Report report = new Report();
        report.setBeginDate(SimpleDate.strToDate(date));
        report.setEndDate(SimpleDate.strToDate(date));
        Page info = reportService.reportTreeByPage(page(), report);
        List<Report> result = info.getRows();
        Iterator<Report> itr = result.iterator();
        while (itr.hasNext()){
            Report report1 = itr.next();
            if(report1.getAgentSum()==0){
                itr.remove();
            }
        }
        return result;
    }

    /**
     * 添加积分统计
     * @return ModelAndView
     */
    @RequestMapping(value="/add")
    @ResponseBody
    public ModelAndView add() {
        return getView(EDIT,"report", new Report());
    }

    /**
     * 编辑积分统计
     * @return ModelAndView
     */
    @RequestMapping(value="/edit/{id}")
    @ResponseBody
    public ModelAndView edit(@PathVariable Long id) {
        Report report = reportService.get(id);
        return getView(EDIT,"report",report);
    }



    /**
     * 保存积分统计
     * @param report
     * @return Result
     */
    @RequestMapping(value="/save")
    @ResponseBody
    public Result saveAddReport(@ModelAttribute Report report) {
        Result result = new Result();
        try {
            if (report.getId() != null)
            {
                reportService.update(report);
                result.setMsg("成功");
                result.setSuccessful(true);
            }
            else
            {
                reportService.save(report);
                result.setMsg("成功");
                result.setSuccessful(true);
            }
        }
        catch (Exception e)
        {
            result.setMsg("失败"+e.getMessage());
            result.setSuccessful(false);
        }
        return result;
    }

    /**
     * 查询单个积分统计
     * @param id
     * @return
     */
    @RequestMapping(value="/get/{id}")
    @ResponseBody
    public Report getInfo(@PathVariable Long id) {
        return  reportService.get(id);
    }

    /**
     * 删除积分统计
     * @param id
     * @return
     */
    @RequestMapping(value="/delete/{id}")
    @ResponseBody
    public Result deleteInfo(@PathVariable Long id) {
        Result result = new Result();
        reportService.delete(id);
        result.setSuccessful(true);
        result.setMsg("删除成功");
        return result;
    }
}

