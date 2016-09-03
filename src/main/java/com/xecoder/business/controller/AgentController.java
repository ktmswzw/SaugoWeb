package com.xecoder.business.controller;

import com.xecoder.common.baseaction.BaseAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by vincent on 16/9/3.
 * Duser.name = 224911261@qq.com
 * SaugoWeb
 */
@Controller
@RequestMapping(value = "/agent")
public class AgentController  extends BaseAction {
    protected Logger logger = LoggerFactory.getLogger(getClass());


    private static final String HOME = "/business/agent/home";

    @RequestMapping(value = "/home")
    public String index() {
        return HOME;
    }
}
