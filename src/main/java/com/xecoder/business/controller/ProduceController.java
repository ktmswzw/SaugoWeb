package com.xecoder.business.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonEncoding;
import com.xecoder.business.entity.Produce;
import com.xecoder.business.service.ProduceService;
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
 * Created by xecoder on Sat Aug 20 17:41:38 CST 2016.
 */
@Controller
@SuppressWarnings("unchecked")
@RequestMapping(value = "/business/produce")
public class ProduceController extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    ProduceService produceService;

    private static final String INDEX = "/business/produce/list";
    private static final String EDIT = "/business/produce/edit";

    @RequestMapping(value="/index")
    public String index() {
        return INDEX;
    }


    /**
     * 表格产品管理
     * @return GridModel
     */
    @RequestMapping(value="/list")
    @ResponseBody
    public GridModel list() {
        Produce produce = SearchForm(Produce.class);
        Page info = produceService.findByPage(page(), produce);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }

    /**
     * 表格产品管理
     * @return GridModel
     */
    @RequestMapping(value="/chooseList")
    @ResponseBody
    public List<Produce> chooseList(@RequestParam String name) {
        Produce produce = new Produce();
        produce.setName(name);
        List<Produce> list = produceService.findAll(page(), produce);
        for(Produce p:list){
            p.setName(p.getName()+"||"+p.getNumber());
        }
        return list;
    }


    /**
     * 添加产品管理
     * @return ModelAndView
     */
    @RequestMapping(value="/add")
    @ResponseBody
    public ModelAndView add() {
        return getView(EDIT,"produce", new Produce());
    }

    /**
     * 编辑产品管理
     * @return ModelAndView
     */
    @RequestMapping(value="/edit/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView edit(@PathVariable Long id) {
        Produce produce = produceService.get(Long.parseLong(id + ""));
        return getView(EDIT,"produce",produce);
    }



    /**
     * 保存产品管理
     * @param produce
     * @return Result
     */
    @RequestMapping(value="/save")
    @ResponseBody
    public Result saveAddProduce(@ModelAttribute Produce produce) {
        Result result = new Result();
        try {
            if (produce.getId() != null)
            {
                produceService.update(produce);
                result.setMsg("成功");
                result.setSuccessful(true);
            }
            else
            {
                produceService.save(produce);
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
     * 查询单个产品管理
     * @param id
     * @return
     */
    @RequestMapping(value="/get/{id}")
    @ResponseBody
    public Produce getInfo(@PathVariable Long id) {
        return  produceService.get(id);
    }

    /**
     * 删除产品管理
     * @param id
     * @return
     */
    @RequestMapping(value="/delete/{id}")
    @ResponseBody
    public Result deleteInfo(@PathVariable Long id) {
        Result result = new Result();
        produceService.delete(id);
        result.setSuccessful(true);
        result.setMsg("删除成功");
        return result;
    }
}

