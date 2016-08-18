package com.xecoder.service.core;

import java.util.List;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.DataControl;


public interface DataControlService {

	DataControl get(Long id);
	
	DataControl getByName(String name);

	void saveOrUpdate(DataControl dataControl);

	void delete(Long id);
	
	List<DataControl> findAll(Page page);
	
	List<DataControl> findByExample(DataControl dataControl, Page page);
}
