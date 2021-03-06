package com.xecoder.controller.core;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.xecoder.common.baseaction.BaseAction;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.*;
import com.xecoder.entity.*;
import com.xecoder.service.core.RoleService;
import com.xecoder.service.core.UserRoleService;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.SecurityUtils;
import com.xecoder.shiro.ShiroUser;
import com.xecoder.viewModel.GridModel;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Controller
@RequestMapping("/console/security/user")
public class UserController extends BaseAction {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private static final String LIST = "console/security/user/list";
    private static final String ADDEDIT = "console/security/user/edit";
    private static final String AGENTLIST = "console/security/user/agentList";
    private static final String AGENTADDEDIT = "console/security/user/agentEdit";
    private static final String AGENTCHECK = "console/security/user/agentCheck";
    private static final String PASSWORD = "console/security/user/password";

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserRoleService userRoleService;

    @RequiresPermissions("User:show")
    @RequestMapping(value = "/list")
    public String list() {
        return LIST;
    }


    @RequestMapping(value = "/password")
    public String password() {
        return PASSWORD;
    }


    @RequiresPermissions("Agent:show")
    @RequestMapping(value = "/agentList")
    public String agentList() {
        return AGENTLIST;
    }

    @RequestMapping(value = "/userList")
    @ResponseBody
    public GridModel userList() {

//        System.out.println("new SimpleDate(new Date) 1= " +SimpleDate.formatDateTime(new java.util.Date()));
        User user = form(User.class);
        user.setEmail("1");
        Page info = userService.findByPage(page(), user);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());

//        System.out.println("new SimpleDate(new Date) 2= " +SimpleDate.formatDateTime(new java.util.Date()));
        return m;
    }

    @RequestMapping(value = "/agentUserList")
    @ResponseBody
    public GridModel agentUserList() {
        User user = form(User.class);
        Page info = userService.findByPage(page(), user);
        GridModel m = new GridModel();
        m.setRows(info.getRows());
        m.setTotal(info.getCount());
        return m;
    }

    @RequestMapping(value = "/alterAgentCheck")
    @ResponseBody
    public int alterAgentCheck() {
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser.isPermitted("Agent:save")) {
            User user = new User();
            user.setStatus("check");
            List<User> list = userService.find(user);
            return list != null ? list.size() : 0;
        }
        return 0;
    }

    /**
     * 表格产品管理
     *
     * @return GridModel
     */
    @RequestMapping(value = "/chooseList")
    @ResponseBody
    public List<User> chooseList(@RequestParam String name) {
        User user = new User();
        user.setRealname(name);
        user.setStatus("enabled");
        List<User> list = userService.find(user);
        list.stream().filter(u -> u.getParentId() != null).forEach(u -> {
            u.setRealname(u.getRealname() + "-上级" + "[" + u.getParentName() + "]");
        });
        return list;
    }

    /**
     * 表格产品管理
     *
     * @return GridModel
     */
    @RequestMapping(value = "/reportChar")
    @ResponseBody
    public List<User> reportChar() {
        User user = new User();
        user.setStatus("enabled");
        user.setCreateTime(SimpleDate.getDayStart(new Date(),-360));
        List<User> list = userService.reportChar(user);
        list.stream().filter(u -> u.getParentId() != null).forEach(u -> {
            u.setRealname(u.getRealname() + "-上级" + "[" + u.getParentName() + "]");
        });
        return list;
    }

    @RequestMapping(value = "/chooseListThree")
    @ResponseBody
    public List<User> chooseListThree(@RequestParam String name) {
        User user = new User();
        user.setRealname(name);
        user.setStatus("enabled");
        user.setParentId(SecurityUtils.getLoginUser().getId());
        List<User> list = userService.find(user);
        list.stream().filter(u -> u.getParentId() != null).forEach(u -> {
            u.setRealname(u.getRealname() + "-上级" + "[" + u.getParentName() + "]");
        });
        return list;
    }

    @RequestMapping(value = "/userAdd")
    @ResponseBody
    public ModelAndView userAdd() {
        return getView(ADDEDIT, "user", new User());
    }


    @RequiresPermissions("Agent:save")
    @RequestMapping(value = "/agentUserEdit")
    @ResponseBody
    public ModelAndView agentUserEdit() {
        return getView(AGENTADDEDIT, "user", new User());
    }


    @RequestMapping(value = "/saveUser")
    @ResponseBody
    public Result saveUser(@ModelAttribute User user) {
        Result result = new Result();
        try {
            if (user.getId() == null) {

                User user1 = new User();
                user1.setUsername(user.getUsername());
                if (userService.getByXXX(user1) != null) {
                    result.setSuccessful(false);
                    result.setMsg("用户  添加失败，登录名：" + user.getUsername() + "已存在。");
                    return result;
                }
                userService.save(user);
            } else {
                User user2 = new User();
                user2.setUsername(user.getUsername());
                User user1 = userService.getByXXX(user2);
                if (user1 != null && !user1.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("用户  添加失败，登录名：" + user.getUsername() + "已存在。");
                    return result;
                }
                user.setCreateTime(new Date());
                userService.update(user);
            }
            result.setSuccessful(true);
            result.setMsg("保存成功");
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/saveAgentUser")
    @ResponseBody
    public Result saveAgentUser(@ModelAttribute User user) {
        Result result = new Result();
        try {
            user.setIdentityCards(user.getIdentityCards().replaceAll("\\*", "X"));
            result = checkData(result, user);
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    @RequestMapping(value = "/check")
    @ResponseBody
    public Result checkUser(@ModelAttribute User user) {
        Result result = new Result();
        try {
            User user1 = userService.get(user.getId());
            user1.setCreateTime(new Date());
            user1.setStatus("enabled");
            result.setSuccessful(true);
            result.setMsg("帐号已可使用");
            if (user1.getPassword()==null||user1.getPassword().equals("")) {//新用户
                user1.setPlainPassword(String.valueOf(RadomUtils.nextSixInt()));
                LogEntity log = new LogEntity();
                log.setUsername(user.getUsername());
                log.setCreateTime(new Date());
                log.setSuperid(String.valueOf(user.getId()));
                log.setIpAddress(request.getRemoteAddr());
                JSONObject object = new JSONObject();
                object.put("realname", user1.getRealname());
                object.put("username", user1.getUsername());
                object.put("password", user1.getPlainPassword());
                log.setLogLevel("2");
                this.sendFill(user1.getPhone(), "SMS_14726055", object.toJSONString(), log,result);
                if(!result.isSuccessful()){
                    return result;
                }
                if(user1.getParentId()!=null) {
                    User user2 = userService.get(user1.getParentId());
                    LogEntity log2 = new LogEntity();
                    log2.setUsername(user.getUsername());
                    log2.setCreateTime(new Date());
                    log2.setSuperid(String.valueOf(user.getId()));
                    log2.setIpAddress(request.getRemoteAddr());
                    JSONObject object2 = new JSONObject();
                    object2.put("subAgent", user2.getRealname());
                    object2.put("agent", user1.getRealname());
                    log2.setLogLevel("10");
                    this.sendFill(user2.getPhone(), "SMS_27415122", object2.toJSONString(), log2, result);
                    if (!result.isSuccessful()) {
                        return result;
                    }
                }
            }
            userService.update(user1);
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("错误");
            e.printStackTrace();
        }
        return result;
    }

    private void updateUserInfo(User user, User user1) {
        user.setCardsFront(user.getCardsFront());
        user.setCardsBack(user.getCardsBack());
        user1.setRealname(user.getRealname());
        user1.setPhone(user.getPhone());
        user1.setUsername(user.getPhone());
        user1.setBak(user.getBak());
        user1.setBankAccount(user.getBankAccount());
        user1.setBank(user.getBank());
        user1.setAddress(user.getAddress());
        user1.setBankName(user.getBankName());
    }

    @RequestMapping(value = "/saveAgentWexinUser")
    @ResponseBody
    public Result saveAgentWexinUser(@ModelAttribute User user) {
        Result result = new Result();
        try {
            User user1 = SecurityUtils.getLoginUser();
            updateUserInfo(user, user1);
            result = checkData(result, user1);
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 保存修改和新增用户照片的数据
     *
     * @param user
     * @return Result
     */
    @RequestMapping(value = "/saveWexin")
    @ResponseBody
    public Result saveWexin(@ModelAttribute User user,
                            @RequestParam("file1") MultipartFile file1,
                            @RequestParam("file2") MultipartFile file2) {
        Result result = new Result();
        try {
            if (!file1.isEmpty()) {
                user.setCardsFront(UploadUtils.upload(file1, request));
                user.setCardsBack(UploadUtils.upload(file2, request));
            }
            if (user.getId() == null) {
                User user1 = SecurityUtils.getLoginUser();
                user.setParentId(user1.getId());
                user.setPlainPassword("");
                user.setRoles("");
                user.setEmail("");
                user.setUsername(user.getPhone());
                user.setIdentityCards(user.getIdentityCards().replaceAll("\\*", "X").replaceAll(" ",""));
                result = checkData(result, user);
                if(!result.isSuccessful()){
                    return result;

                }
                UserRole userRole = new UserRole();
                userRole.setRoleId(99L);
                List<UserRole> list = userRoleService.find(userRole);
                if (list != null && list.size() > 0) {
                    for (UserRole userRole1 : list) {
                        User user2 = userService.get(userRole1.getUserId());
                        if (user2 != null) {
                            LogEntity log = new LogEntity();
                            log.setUsername(user2.getUsername());
                            log.setCreateTime(new Date());
                            log.setSuperid(String.valueOf(user2.getId()));
                            log.setIpAddress(request.getRemoteAddr());
                            JSONObject object = new JSONObject();
                            object.put("subAgent", user1.getRealname());
                            object.put("agent", user.getRealname());
                            log.setLogLevel("9");
                            this.sendFill(user2.getPhone(), "SMS_14771654", object.toJSONString(), log, result);
                        }
                    }
                    if (!result.isSuccessful()) {
                        return result;
                    }
                }
            } else {
                User user1 = SecurityUtils.getLoginUser();
                updateUserInfo(user, user1);
                result = checkData(result, user1);
            }
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 保存修改和新增用户照片的数据
     *
     * @param user
     * @return Result
     */
    @RequestMapping(value = "/save")
    @ResponseBody
    public Result save(@ModelAttribute User user,
                       @RequestParam("file1") MultipartFile file1,
                       @RequestParam("file2") MultipartFile file2) {
        Result result = new Result();
        try {
            user.setIdentityCards(user.getIdentityCards().replaceAll("\\*", "X").replaceAll(" ",""));
            if (!file1.isEmpty()) {
                user.setCardsFront(UploadUtils.upload(file1, request));
                user.setCardsBack(UploadUtils.upload(file2, request));
            }
            result = checkData(result, user);
            if(!result.isSuccessful()){
                return result;
            }
        } catch (Exception e) {
            result.setSuccessful(false);
            result.setMsg("error");
            e.printStackTrace();
        }
        return result;
    }

    private Result checkData(Result result, User user) {

        user.setCreateTime(new Date());
        user.setStatus("check");
        result.setMsg("修改信息完成,需要确认后才可登录");

        if (user.isSuperAgent()) {
            user.setRoles("2");//超级代理
        } else {
            user.setRoles("3");//总代
        }
        if (user.getId() == null) {
            User user2;
            if (user.getUsername() != null && !user.getUsername().equals("")) {
                user2 = new User();
                user2.setUsername(user.getUsername());
                User user3 = userService.getByXXX(user2);
                if (user3 != null) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，手机号码：" + user3.getUsername() + "_" + user3.getRealname() + "已存在。");
                    return result;
                }
            }

            if (user.getBankAccount() != null && !user.getBankAccount().equals("")) {
                user2 = new User();
                user2.setBankAccount(user.getBankAccount());
                User user3 = userService.getByXXX(user2);
                if (user3 != null) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，银行帐号：" + user3.getBankAccount() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getIdentityCards() != null && !user.getIdentityCards().equals("")) {
                user2 = new User();
                user2.setIdentityCards(user.getIdentityCards());
                User user3 = userService.getByXXX(user2);
                if (user3 != null) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，身份证号码：" + user3.getIdentityCards() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getAlipayAccount() != null && !user.getAlipayAccount().equals("")) {
                user2 = new User();
                user2.setAlipayAccount(user.getAlipayAccount());
                User user3 = userService.getByXXX(user2);
                if (user3 != null) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，支付宝帐号：" + user3.getAlipayAccount() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getAlipayName() != null && !user.getAlipayName().equals("")) {
                user2 = new User();
                user2.setAlipayName(user.getAlipayName());
                User user3 = userService.getByXXX(user2);
                if (user3 != null) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，支付宝名称：" + user3.getAlipayName() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            userService.save(user);
        } else {

            User user2;
            if (user.getUsername() != null && !user.getUsername().equals("")) {
                user2 = new User();
                user2.setUsername(user.getUsername());
                User user3 = userService.getByXXX(user2);
                if (user3 != null && !user3.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，手机号码：" + user3.getUsername() + "_" + user3.getRealname() + "已存在。");
                    return result;
                }
            }

            if (user.getBankAccount() != null && !user.getBankAccount().equals("")) {

                user2 = new User();
                user2.setBankAccount(user.getBankAccount());
                User user3 = userService.getByXXX(user2);
                if (user3 != null && !user3.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，银行帐号：" + user3.getBankAccount() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getIdentityCards() != null && !user.getIdentityCards().equals("")) {
                user2 = new User();
                user2.setIdentityCards(user.getIdentityCards());
                User user3 = userService.getByXXX(user2);
                if (user3 != null && !user3.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，身份证号码：" + user3.getIdentityCards() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getAlipayAccount() != null && !user.getAlipayAccount().equals("")) {
                user2 = new User();
                user2.setAlipayAccount(user.getAlipayAccount());
                User user3 = userService.getByXXX(user2);
                if (user3 != null && !user3.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，支付宝帐号：" + user3.getAlipayAccount() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            if (user.getAlipayName() != null && !user.getAlipayName().equals("")) {
                user2 = new User();
                user2.setAlipayName(user.getAlipayName());
                User user3 = userService.getByXXX(user2);
                if (user3 != null && !user3.getId().equals(user.getId())) {
                    result.setSuccessful(false);
                    result.setMsg("添加失败，支付宝名称：" + user3.getAlipayName() + "_" + user3.getRealname() + "已经使用。");
                    return result;
                }
            }
            userService.update(user);
        }
        result.setSuccessful(true);
        return result;
    }

    @RequestMapping(value = "/editUser/{id}")
    @ResponseBody
    public ModelAndView editUser(@PathVariable Integer id) {
        User user = userService.get(Long.parseLong(id + ""));
        return getView(ADDEDIT, "user", user);
    }


    @RequestMapping(value = "/passwordUpdate")
    @ResponseBody
    public Result passwordUpdate(@RequestParam String plainPassword, @RequestParam String newPlainPassword) {
        ShiroUser shiroUser = com.xecoder.shiro.SecurityUtils.getShiroUser();
        User user = userService.get(shiroUser.getUser().getId());
        Result result = new Result();
        user.setPlainPassword(plainPassword);
        if (!userService.newPwd(user, newPlainPassword)) {
            result.setMsg("操作失败,原密码不正确");
            result.setSuccessful(false);
            return result;
        }
        result.setMsg("操作成功,请重新登录");
        result.setSuccessful(true);
        return result;
    }


    @RequestMapping(value = "/editAgentUser/{id}")
    @ResponseBody
    public ModelAndView ededitAgentUseritUser(@PathVariable Integer id) {
        User user = userService.get(Long.parseLong(id + ""));
        return getView(AGENTADDEDIT, "user", user);
    }


    @RequestMapping(value = "/agentCheck/{id}")
    @ResponseBody
    public ModelAndView agentCheck(@PathVariable Integer id) {
        User user = userService.get(Long.parseLong(id + ""));
//        if(user!=null&& user.getParentId()!=null)
//        {
//            User par = userService.get(user.getParentId());
//            user.setParentName(par.getRealname());
//        }
        return getView(AGENTCHECK, "user", user);
    }


    @RequestMapping(value = "/deleteInfo/{id}", method = RequestMethod.POST)
    @ResponseBody
    public Result deleteInfo(@PathVariable Long id) {
        logger.debug("id = " + id);
        Result result = new Result();
        User user = userService.get(id);
        if (id == 1 || id == 2) {
            result.setMsg("操作失败,此帐号特殊,不可删除");
            result.setSuccessful(false);
            return result;
        }
        user.setStatus("disabled");
        user.setUsername("DEL-" + user.getUsername());
        user.setRealname("DEL-" + user.getRealname());
        user.setIdentityCards("DEL-" + user.getIdentityCards());
        user.setBankAccount("DEL-" + user.getBankAccount());
        userService.delete(user);
        result.setMsg("操作成功");
        updateParentId(user);
        result.setSuccessful(true);
        return result;
    }

    /**
     * 更新注销的本级的下级的上级为注销的上级
     *
     * @param userDel
     */
    private void updateParentId(User userDel) {
        List<User> list = userService.findByParentId(userDel.getId());
        for (User user : list) {
            user.setParentId(userDel.getParentId());
            userService.update(user);
        }
    }

    @RequestMapping(value = "/findAllRole/{id}")
    @ResponseBody
    public List<Role> findAllRole(@PathVariable Long id) {
        logger.debug("id = " + id);
        return roleService.findAll();
    }


    @RequestMapping(value = "/findRole")
    @ResponseBody
    public List<Role> findAllRole(@RequestParam String description) {
        Role role = new Role();
        role.setDescription(description);
        return roleService.find(null, role);
    }


    @RequestMapping(value = "/findJsonById/{id}", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject findJsonById(@PathVariable Long id) {
        List<User> list = userService.findByParentIdAll(id);
        JSONObject jsonobject = new JSONObject();
        JSONArray jarray = new JSONArray();
        for (User o : list) {
            FuelueTree fuelueTree = new FuelueTree();
            fuelueTree.setText(o.getRealname());
            fuelueTree.setType(o.getNodes() > 0 ? "folder" : "item");
            DataAttributes dataAttributes = new DataAttributes();
            dataAttributes.setId(o.getId().toString());
            fuelueTree.setAttr(dataAttributes);
            jarray.add(fuelueTree);
        }
        jsonobject.put("data", jarray);
        return jsonobject;
    }

    @RequestMapping(value = "/findAllRoleSelect/{id}/{roles}")
    @ResponseBody
    public List<RoleSelect> findAllRoleSelect(@PathVariable Long id, @PathVariable String roles) {
        logger.debug("id = " + id);
        List<RoleSelect> roleSelects = new ArrayList<RoleSelect>();
        List<Role> list = roleService.findAll();

        for (Role role : list) {
            RoleSelect roleSelect = new RoleSelect();
            roleSelect.setId(role.getId());
            roleSelect.setDescription(role.getDescription());
            for (String roleId : StringUtils.split(roles, ",")) {
                if (StringUtils.equals(role.getId().toString(), roleId)) {
                    roleSelect.setSelected(true);
                    break;
                }
            }
            roleSelects.add(roleSelect);
        }
        return roleSelects;
    }
}
