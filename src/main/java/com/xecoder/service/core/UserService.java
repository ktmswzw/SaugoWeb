package com.xecoder.service.core;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.User;
import com.xecoder.exception.ExistedException;
import com.xecoder.exception.ServiceException;

import java.util.List;


/** 
 * @description: 用户管理
 * @version 1.0
 * @author IMANON
 * @createDate 2014-1-11;下午01:14:07
 */
public interface UserService {

	User get(String username);
	
	List<User> find(User user);

	void update(User user);
	
	void updatePwd(User user, String newPwd) throws ServiceException;
	
	void resetPwd(User user, String newPwd);

	void save(User user) throws ExistedException;

	User get(Long id);

	/**
	 * @param id 删除
	 * @throws ServiceException
	 */
	void delete(Long id) throws ServiceException;

    void delete(User user) throws ServiceException;

	Page findByPage(Page page,User user);
	
	/**
	 * 按用户名
	 * @param username
	 * @return
	 */
	User getByUsername(String username);

	User getByBankAccount(String account);

	User getByIdentityCards(String identityCards);
	/**
	 * 按邮箱
	 * @param email
	 * @return
	 */
	User getByEmail(String email);

	List<User> findByParentId(Long parentId);
}
