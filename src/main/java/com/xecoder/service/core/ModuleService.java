package com.xecoder.service.core;

import java.util.List;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.Module;
import com.xecoder.exception.ExistedException;
import com.xecoder.exception.ServiceException;


public interface ModuleService {

	void save(Module module) throws ExistedException;


    Page findByPage(Page page,Module module);
	
	Module get(Long id);

    List<Module> getBySn(String sn);
	
	void update(Module module);
	
	void delete(Long id) throws ServiceException;
	
	Module getTree();
	
	List<Module> findAll(String orderByClause);


    List<Module> find(Module module);
	
	List<Module> find(Long parentId,String name, Page page);
	
	/**
	 * @param parentId 根据父类查询
	 * @return
	 */
	List<Module> getModuleByParentId(Long parentId);

    int countByExample(Page page, Module module);
	
}
