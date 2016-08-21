package com.xecoder.controller.core;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Strings;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.DataAttributes;
import com.xecoder.common.util.FuelueTree;
import com.xecoder.common.util.JacksonMapper;
import com.xecoder.common.util.Result;
import com.xecoder.entity.Role;
import com.xecoder.entity.RoleSelect;
import com.xecoder.entity.User;
import com.xecoder.entity.UserRole;
import com.xecoder.service.core.RoleService;
import com.xecoder.service.core.UserRoleService;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.ShiroUser;
import com.xecoder.viewModel.GridModel;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.ehcache.EhCacheCache;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;


@Controller
@RequestMapping("/console/security/user")
public class UserController extends BaseAction{

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private static final String LIST = "console/security/user/list";
    private static final String ADDEDIT = "console/security/user/edit";
    private static final String AGENTLIST = "console/security/user/agentList";
    private static final String AGENTADDEDIT = "console/security/user/agentEdit";

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserRoleService userRoleService;

    @Autowired
    private EhCacheCacheManager ehCacheCacheManager;

    @RequiresPermissions("User:show")
    @RequestMapping(value="/list")
    public String list(HttpServletRequest request) {
        return LIST;
    }


    @RequiresPermissions("Agent:show")
    @RequestMapping(value="/agentList")
    public String agentList(HttpServletRequest request) {
        return AGENTLIST;
    }

    @RequestMapping(value="/userList")
    @ResponseBody
    public GridModel userList(){
        User user = form(User.class);
        user.setEmail("1");
        Page info = userService.findByPage(page(), user);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }

    @RequestMapping(value="/agentUserList")
    @ResponseBody
    public GridModel agentUserList(){
        User user = form(User.class);
        Page info = userService.findByPage(page(), user);
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
    public List<User> chooseList(@RequestParam String name) {
        User user = new User();
        user.setRealname(name);
        List<User> list = userService.find(user);
        list.stream().filter(u -> u.getParentId() != null).forEach(u -> {
            User in = userService.get(u.getParentId());
            u.setRealname(u.getRealname() + "-上级" + "[" + in.getRealname() + "]");
        });
        return list;
    }

    @RequestMapping(value="/userEdit")
    @ResponseBody
    public ModelAndView userEdit() {
        return getView(ADDEDIT,"user", new User());
    }


    @RequestMapping(value="/agentUserEdit")
    @ResponseBody
    public ModelAndView agentUserEdit() {
        return getView(AGENTADDEDIT,"user", new User());
    }

    @RequestMapping(value="/saveUser")
    @ResponseBody
    public Result saveUser(@ModelAttribute User user) {
        Result result = new Result();
        try {
            if(user.getId()==null) {
                if (userService.getByUsername(user.getUsername()) != null) {
                    result.setSuccessful(false);
                    result.setMsg("用户添加失败，登录名：" + user.getUsername() + "已存在。");
                    return result;
                }
                userService.save(user);
            }
            else
            {
                userService.update(user);
            }
            result.setSuccessful(true);
            result.setMsg("保存成功");
        }
        catch (Exception e)
        {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value="/editUser/{id}")
    @ResponseBody
    public ModelAndView editUser(@PathVariable Integer id) {
        User user = userService.get(Long.parseLong(id + ""));
        return getView(ADDEDIT,"user",user);
    }


    @RequestMapping(value="/editAgentUser/{id}")
    @ResponseBody
    public ModelAndView ededitAgentUseritUser(@PathVariable Integer id) {
        User user = userService.get(Long.parseLong(id + ""));
        return getView(AGENTADDEDIT,"user",user);
    }



    @RequestMapping(value="/deleteInfo/{id}", method=RequestMethod.POST)
    @ResponseBody
    public Result deleteInfo(@ModelAttribute User user, @PathVariable Integer id) {
        logger.debug("id = " + id);
        Result result = new Result();
        if(id==1)
        {
            result.setMsg("操作失败,此帐号未超级管理员,不可删除");
            result.setSuccessful(false);
            return result;
        }
        user.setStatus("disabled");
        user.setUsername("");
        userService.delete(user);
        result.setMsg("操作成功");
        result.setSuccessful(true);
        return result;
    }

    @RequestMapping(value="/userinfo")
    @ResponseBody
    public User userInfo(HttpServletRequest request) throws AuthenticationException {
        ShiroUser shiroUser = com.xecoder.shiro.SecurityUtils.getShiroUser();
        User user = userService.get(shiroUser.getUser().getId());
        return user;
    }
    @RequestMapping(value="/findAllRole/{id}")
    @ResponseBody
    public List<Role> findAllRole(@PathVariable Long id) {
        logger.debug("id = " + id);
        List<Role> list = roleService.findAll();
        return list;
    }


    @RequestMapping(value="/findRole")
    @ResponseBody
    public List<Role> findAllRole(@RequestParam String description) {
        Role role = new Role();
        role.setDescription(description);
        List<Role> list = roleService.find(null,role);
        return list;
    }


    @RequestMapping(value = "/findJsonById/{id}", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject findJsonById(@PathVariable Long id) {
        System.out.println("id = " + id);
        List<User> list = userService.findByParentId(id);
        String json = "";
        JSONObject jsonobject = new JSONObject();
        JSONArray jarray = new JSONArray();
        for (User o : list) {
            FuelueTree fuelueTree = new FuelueTree();
            fuelueTree.setText(o.getRealname());
            fuelueTree.setType(o.getNodes() > 0 ? "folder" : "item");
            DataAttributes dataAttributes =  new DataAttributes();
            dataAttributes.setId(o.getId().toString());
            fuelueTree.setAttr(dataAttributes);
            jarray.add(fuelueTree);
        }
        jsonobject.put("data", jarray);
        return jsonobject;
    }

    @RequestMapping(value="/findAllRoleSelect/{id}/{roles}")
    @ResponseBody
    public List<RoleSelect> findAllRoleSelect(@PathVariable Long id,@PathVariable String roles) {
        logger.debug("id = " + id);
        List<RoleSelect> roleSelects = new ArrayList<RoleSelect>();
        List<Role> list = roleService.findAll();

        for(Role role: list)
        {
            RoleSelect roleSelect = new RoleSelect();
                roleSelect.setId(role.getId());
                roleSelect.setDescription(role.getDescription());
                for (String roleId : StringUtils.split(roles, ",")) {
                    if(StringUtils.equals(role.getId().toString(),roleId)) {
                        roleSelect.setSelected(true);
                        break;
                    }
                }
                roleSelects.add(roleSelect);
        }
        return roleSelects;
    }
}
