package com.xecoder.service.core;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.DataBase;
import com.xecoder.entity.Tables;

import java.util.List;

/**
 * Created by imanon.net on 2014/10/13.
 */
public interface TablesService {
    int countByExample(Page page, Tables tables);
    List<Tables> selectByExample(Page page, Tables tables);
    Page findByPage(Page page, Tables tables);
    List<DataBase> dataBaseGenerator();
}
