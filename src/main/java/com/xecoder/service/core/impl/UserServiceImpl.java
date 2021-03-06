package com.xecoder.service.core.impl;

import com.xecoder.common.basedao.BaseDao;
import com.xecoder.common.baseservice.BaseService;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.SimpleDate;
import com.xecoder.entity.ExtMsg;
import com.xecoder.entity.User;
import com.xecoder.entity.UserCriteria;
import com.xecoder.entity.UserRole;
import com.xecoder.exception.ExistedException;
import com.xecoder.exception.ServiceException;
import com.xecoder.mapper.OrganizationMapper;
import com.xecoder.mapper.UserMapper;
import com.xecoder.service.core.ExtMsgService;
import com.xecoder.service.core.UserRoleService;
import com.xecoder.service.core.UserService;
import com.xecoder.shiro.ShiroDbRealm;
import com.xecoder.shiro.ShiroDbRealm.HashPassword;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service("userService")
@Transactional
@SuppressWarnings("unchecked")
public class UserServiceImpl extends BaseService implements UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
	
	@Autowired
	private ShiroDbRealm shiroRealm;
	
	@Autowired
	private UserRoleService userRoleService;

    @Autowired
    private ExtMsgService extMsgService;
	
	@Override
	public void delete(Long id) throws ServiceException {
		if (isSupervisor(id)) {
			logger.warn("操作员{}，尝试删除超级管理员用户", SecurityUtils.getSubject()
					.getPrincipal() + "。");
			throw new ServiceException("不能删除超级管理员用户。");
		}
		
		User user = baseDao.getMapper(UserMapper.class).selectByPrimaryKey(id);
		baseDao.getMapper(UserMapper.class).deleteByPrimaryKey(user.getId());
		
		shiroRealm.clearCachedAuthorizationInfo(user.getUsername());

	}

    @Override
    public void delete(User user) throws ServiceException {
        baseDao.getMapper(UserMapper.class).updateByPrimaryKeySelective(user);
        shiroRealm.clearCachedAuthorizationInfo(user.getUsername());
    }

    @Override
	public List<User> find(User user) {

        List<User> list =baseDao.getMapper(UserMapper.class).selectByExample(getCriteria(null,user));
//        if(list != null && list.size() > 0){
//            for(User u:list){
//                u.setUserRoles(userRoleService.find(u.getId()));
//            }
//        }
//
		return list;
	}

    private UserCriteria getCriteria(Page page,User user)
    {
        UserCriteria criteria = new UserCriteria();
        UserCriteria.Criteria cri = criteria.createCriteria();

        if(user != null){


            if (StringUtils.isNotBlank(user.getUsername())) {
                cri.andUsernameLike(user.getUsername());
            }
            if (StringUtils.isNotBlank(user.getRealname())) {
                cri.addCriterion(" realname LIKE  '%"+user.getRealname()+"%' ");
            }
            if (StringUtils.isNotBlank(user.getEmail())) {
                cri.addCriterion(" email LIKE  '%"+user.getEmail()+ "%' ");
            }

            if (StringUtils.isNotBlank(user.getBankAccount())) {
                cri.andBankAccountEqualTo(user.getBankAccount());
            }
            if (user.getCreateTime()!=null) {
                cri.andCreateTimeGreaterThan(user.getCreateTime());
            }
            if(StringUtils.isNotBlank(user.getStatus())){
                cri.andStatusEqualTo(user.getStatus());
            }
//            else
//            {
//                cri.andStatusEqualTo("enabled");
//            }
            if(user.getOrgId() != null){
                cri.andOrgIdEqualTo(user.getOrgId());
            }

            if(StringUtils.isNotBlank(user.getPhone())){
                cri.andPhoneEqualTo(user.getPhone());
            }

            if (user.getParentId()!=null) {
                cri.addCriterion(" nn.id in ( " +
                        "SELECT ss.id FROM security_user ss WHERE " +
                        "ss.STATUS = 'enabled' " +
                        "AND ss.email = '' " +
                        "AND (ss.parent_id IN (SELECT  id FROM security_user  WHERE parent_Id = "+user.getParentId()+") OR ss.id IN (SELECT  id FROM  security_user WHERE parent_Id = "+user.getParentId()+") OR ss.id = "+user.getParentId()+") " +
                        ")");
            }

            if(StringUtils.isNotBlank(user.getEmail())){
                cri.andEmailEqualTo(user.getEmail());
            }
            else
                cri.andEmailEqualTo("");
        }

        if(page != null && page.getSort() != null && page.getOrder() != null){
            criteria.setOrderByClause(page.getSort() + " " + page.getOrder());
        }
        else
        {
            criteria.setOrderByClause("create_time" + " " + "desc");
        }

        return criteria;
    }

	@Override
	public Page findByPage(Page page,User user) {
        UserCriteria criteria = getCriteria(page,user);
		
		List<User> list = new ArrayList<User>();
		if(page == null){
			list = baseDao.getMapper(UserMapper.class).selectByExample(criteria);
		}
        list = baseDao.selectByPage("com.xecoder.mapper.UserMapper."+BaseDao.SELECT_BY_EXAMPLE, criteria, page);
		if(list != null && list.size() > 0){
			for(User u:list){
				setUserOrganization(u);
				u.setUserRoles(userRoleService.find(u.getId()));
			}
		}
		page.setCount(baseDao.getMapper(UserMapper.class).countByExample(criteria));
		return page.setRows(list);
	}

    @Override
	public int findAgentCount(User user){
        UserCriteria criteria = getCriteria(null,user);
        return baseDao.getMapper(UserMapper.class).countByExample(criteria);
    }


    @Override
    public List<User> findByParentId(Long parentId) {
        UserCriteria criteria = new UserCriteria();
        UserCriteria.Criteria cri = criteria.createCriteria();
        if(parentId != null){
            cri.andParentIdEqualTo(parentId);
        }
        cri.andStatusEqualTo("enabled");
        List<User> list =   baseDao.getMapper(UserMapper.class).selectByExample(criteria);
        return list;
    }

    @Override
    public List<User> findByParentIdAll(Long parentId) {
        UserCriteria criteria = new UserCriteria();
        UserCriteria.Criteria cri = criteria.createCriteria();
        if(parentId != null){
            cri.andParentIdEqualTo(parentId);
        }
        List<User> list =   baseDao.getMapper(UserMapper.class).selectByExample(criteria);
        return list;
    }

	@Override
	public User get(String username) {
		UserCriteria criteria = new UserCriteria();
		UserCriteria.Criteria cri = criteria.createCriteria();
		if(StringUtils.isNotBlank(username)){
			cri.andUsernameEqualTo(username);
		}

		List<User> list = baseDao.getMapper(UserMapper.class).selectByExample(criteria);
		if(list != null && list.size() > 0){
			User user = list.get(0);
			setUserOrganization(user);
            user.setUserRoles(userRoleService.find(user.getId()));
			return user;
		}
		return null;
	}
	
	public void setUserOrganization(User user){
		if(user != null && user.getOrgId() != null){
			user.setOrganization(baseDao.getMapper(OrganizationMapper.class).selectByPrimaryKey(user.getOrgId()));
		}
        //setTheme(user);
        //setParentName(user);
	}

//	public void setParentName(User user)
//    {
//        if(user != null && user.getParentId() != null){
//            User pUser = baseDao.getMapper(UserMapper.class).selectByPrimaryKey(user.getParentId());
//            if(pUser!=null)
//            user.setParentName(pUser.getRealname());
//        }
//    }

    public  void setTheme(User user)
    {
        if(user !=null)
        {
            ExtMsg extMsg = new ExtMsg();
            extMsg.setType("theme");
            extMsg.setName(user.getUsername());
            String theme_this="";
            List<ExtMsg> list  = extMsgService.findList(null,extMsg);

            if (list.size() > 0) {
                for (ExtMsg extMsg1 : list) {
                    theme_this = extMsg1.getValue();
                }
            }
            user.setTheme(theme_this);
        }
    }
	

	
	/**
	 * 按用户名
	 * @param user
	 * @return
	 */
	public User getByXXX(User user) {
        List<User> list = baseDao.selectList("com.xecoder.mapper.UserMapper."+BaseDao.SELECT_BY_EXAMPLE, setCriteria(user));
        if(list!=null&&list.size()>0)
            return list.get(0);
        else
            return null;
	}


    private UserCriteria setCriteria(User user) {
        UserCriteria criteria = new UserCriteria();
        UserCriteria.Criteria cri = criteria.createCriteria();

        if (user != null) {
            if(StringUtils.isNotBlank(user.getIdentityCards())){
                cri.andIdentityCardsEqualTo(user.getIdentityCards());
            }
            if(StringUtils.isNotBlank(user.getBankAccount())){
                cri.andBankAccountEqualTo(user.getBankAccount());
            }
            if(StringUtils.isNotBlank(user.getUsername())){
                cri.andUsernameEqualTo(user.getUsername());
            }
            if(StringUtils.isNotBlank(user.getEmail())){
                cri.andEmailEqualTo(user.getEmail());
            }
            if(StringUtils.isNotBlank(user.getAlipayAccount())){
                cri.andAlipayAccountEqualTo(user.getAlipayAccount());
            }
            if(StringUtils.isNotBlank(user.getAlipayName())){
                cri.andAlipayNameEqualTo(user.getAlipayName());
            }
        }
        return criteria;
    }

	@Override
	public User get(Long id) {
		User user = baseDao.getMapper(UserMapper.class).selectByPrimaryKey(id);
        if(user!=null) {
            setUserOrganization(user);
            if(user.getId()!=null)
                user.setUserRoles(userRoleService.find(user.getId()));
        }
		return user;
	}

	@Override
	public void resetPwd(User user, String newPwd) {
		if (newPwd == null) {
			newPwd = "123456";
		}
		HashPassword hashPassword = ShiroDbRealm.encryptPassword(newPwd);
		user.setSalt(hashPassword.salt);
		user.setPassword(hashPassword.password);
		
		baseDao.getMapper(UserMapper.class).updateByPrimaryKeySelective(user);
	}

	@Override
    @Transactional
	public void save(User user) throws ExistedException {
		//设定安全的密码，使用passwordService提供的salt并经过1024次 sha-1 hash
		if (StringUtils.isNotBlank(user.getPlainPassword()) && shiroRealm != null) {
			HashPassword hashPassword = ShiroDbRealm.encryptPassword(user.getPlainPassword());
			user.setSalt(hashPassword.salt);
			user.setPassword(hashPassword.password);
		}
		user.setCreateTime(SimpleDate.getDateTime());
		baseDao.getMapper(UserMapper.class).insert(user);

        String roles = user.getRoles();
        User user1 = new User();
        user1.setUsername(user.getUsername());
        user1 = getByXXX(user1);
        if(user1!=null){
            user1.setRoles(roles);
            addNewRoles(user1);
        }
		shiroRealm.clearCachedAuthorizationInfo(user.getUsername());
	}

	private void deleteOldRoles(User user){
	    List<UserRole> list = userRoleService.find(user.getId());
        for(UserRole userRole:list){
            userRoleService.delete(userRole.getId());
        }
    }

    private void addNewRoles(User user){
        String roles = user.getRoles();
        if(StringUtils.isNotBlank(roles)){
            deleteOldRoles(user);
            if(StringUtils.indexOfAny(roles,",")>0) {
                for (String roleId : StringUtils.split(roles,",")) {
                    addRole(user.getId(),Long.parseLong(roleId));
                }
            }
            else{
                addRole(user.getId(),Long.parseLong(roles));
            }
        }
    }

    private void addRole(Long userId,Long roleId){
        UserRole userRole = new UserRole();
        userRole.setRoleId(roleId);
        userRole.setUserId(userId);
        userRole.setPriority(99);
        if (userRoleService.find(userRole).size()==0) {
            userRoleService.save(userRole);
        }
    }


	@Override
	public void update(User user) {
        addNewRoles(user);
        if (StringUtils.isNotBlank(user.getPlainPassword()) && shiroRealm != null) {
            HashPassword hashPassword = ShiroDbRealm.encryptPassword(user.getPlainPassword());
            user.setSalt(hashPassword.salt);
            user.setPassword(hashPassword.password);
            updatePwd(user,user.getPlainPassword());
        }
		baseDao.getMapper(UserMapper.class).updateByPrimaryKeySelective(user);
		shiroRealm.clearCachedAuthorizationInfo(user.getUsername());
	}

	public boolean newPwd(User user,String newPwd){
	    try{
            updatePwd(user,newPwd);
            return true;
	    }catch (Exception e) {
            return false;
        }
    }


	@Override
	public void updatePwd(User user, String newPwd) throws ServiceException {
		//if (isSupervisor(user.getId())) {
		//	logger.warn("操作员{},尝试修改超级管理员用户", SecurityUtils.getSubject().getPrincipal());
		//	throw new ServiceException("不能修改超级管理员用户");
		//}
		//设定安全的密码，使用passwordService提供的salt并经过1024次 sha-1 hash
		boolean isMatch = ShiroDbRealm.validatePassword(user.getPlainPassword(), user.getPassword(), user.getSalt());
		if (isMatch) {
			HashPassword hashPassword = ShiroDbRealm.encryptPassword(newPwd);
			user.setSalt(hashPassword.salt);
			user.setPassword(hashPassword.password);
			
			baseDao.getMapper(UserMapper.class).updateByPrimaryKeySelective(user);
			shiroRealm.clearCachedAuthorizationInfo(user.getUsername());
			
			return; 
		}
		
		throw new ServiceException("用户密码错误！");

	}

	/**
	 * 判断是否超级管理员.
	 */
	private boolean isSupervisor(Long id) {
		return id == 1;
	}

    @Override
    public List<User> selectTreeById(Long id) {
        List<User> list =   baseDao.getMapper(UserMapper.class).selectTreeById(id);
        return list;
    }

    @Override
    public List<User> reportChar(User user) {
        return baseDao.getMapper(UserMapper.class).reportChar(getCriteria(null,user));
    }
}
