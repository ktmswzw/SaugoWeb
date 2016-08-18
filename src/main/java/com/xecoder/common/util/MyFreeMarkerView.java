package com.xecoder.common.util;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.xecoder.shiro.ShiroUser;
import org.apache.shiro.subject.Subject;
import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

import static com.xecoder.shiro.SecurityUtils.getSubject;

public class MyFreeMarkerView extends FreeMarkerView{

	 private static final String CONTEXT_PATH = "base";

	 protected void exposeHelpers(Map<String, Object> model,HttpServletRequest request) throws Exception {
	     model.put(CONTEXT_PATH, request.getContextPath());
	     super.exposeHelpers(model, request);
	 }

}
