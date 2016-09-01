package com.xecoder.business.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonEncoding;
import com.xecoder.business.entity.Report;
import com.xecoder.business.service.ReportService;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.common.util.Result;
import com.xecoder.viewModel.GridModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
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

    private static final String INDEX = "/business/report/list";
    private static final String EDIT = "/business/report/edit";

    @RequestMapping(value="/index")
    public String index() {
        return INDEX;
    }


    /**
     * 表格积分统计
     * @return GridModel
     */
    @RequestMapping(value="/list")
    @ResponseBody
    public GridModel list() {
        Report report = SearchForm(Report.class);
        Page info = reportService.findByPage(page(), report);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
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

