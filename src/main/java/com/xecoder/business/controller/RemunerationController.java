package com.xecoder.business.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonEncoding;
import com.xecoder.business.entity.Remuneration;
import com.xecoder.business.service.RemunerationService;
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
 * Created by xecoder on Sat Aug 20 23:09:18 CST 2016.
 */
@Controller
@SuppressWarnings("unchecked")
@RequestMapping(value = "/business/remuneration")
public class RemunerationController extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    RemunerationService remunerationService;

    private static final String INDEX = "/business/remuneration/list";
    private static final String EDIT = "/business/remuneration/edit";

    @RequestMapping(value="/index/{produceId}")
    public ModelAndView index(@PathVariable Long produceId) {
        ModelAndView mav = new ModelAndView(INDEX);
        try {
            mav.addObject("produceId", produceId);
            return mav;
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return null;
        }
    }


    /**
     * 表格酬金配置
     * @return GridModel
     */
    @RequestMapping(value="/list/{produceId}")
    @ResponseBody
    public GridModel list(@PathVariable Long produceId) {
        Remuneration remuneration = SearchForm(Remuneration.class);
        remuneration.setProduceId(produceId);
        Page info = remunerationService.findByPage(page(), remuneration);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }


    /**
     * 添加酬金配置
     * @return ModelAndView
     */
    @RequestMapping(value="/add/{produceId}")
    @ResponseBody
    public ModelAndView add(@PathVariable Long produceId) {
        ModelAndView mav = new ModelAndView(EDIT);
        Remuneration remuneration = new Remuneration();
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            remuneration.setProduceId(produceId);
            String json =mapper.writeValueAsString(remuneration);
            mav.addObject("produceId", produceId);
            mav.addObject("remuneration",json);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return mav;
    }

    /**
     * 编辑酬金配置
     * @return ModelAndView
     */
    @RequestMapping(value="/edit/{id}")
    @ResponseBody
    public ModelAndView edit(@PathVariable Long id) {
        Remuneration remuneration = remunerationService.get(id);
        ModelAndView mav = new ModelAndView(EDIT);
        try {
            ObjectMapper mapper = JacksonMapper.getInstance();
            String json =mapper.writeValueAsString(remuneration);
            mav.addObject("produceId", remuneration.getProduceId());
            mav.addObject("remuneration",json);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return mav;
    }



    /**
     * 保存酬金配置
     * @param remuneration
     * @return Result
     */
    @RequestMapping(value="/save")
    @ResponseBody
    public Result saveAddRemuneration(@ModelAttribute Remuneration remuneration) {
        Result result = new Result();
        try {
            if (remuneration.getId() != null)
            {
                remunerationService.update(remuneration);
                result.setMsg("成功");
                result.setSuccessful(true);
            }
            else
            {
                remunerationService.save(remuneration);
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
     * 查询单个酬金配置
     * @param id
     * @return
     */
    @RequestMapping(value="/get/{id}")
    @ResponseBody
    public Remuneration getInfo(@PathVariable Long id) {
        return  remunerationService.get(id);
    }

    /**
     * 删除酬金配置
     * @param id
     * @return
     */
    @RequestMapping(value="/delete/{id}")
    @ResponseBody
    public Result deleteInfo(@PathVariable Long id) {
        Result result = new Result();
        remunerationService.delete(id);
        result.setSuccessful(true);
        result.setMsg("删除成功");
        return result;
    }
}

