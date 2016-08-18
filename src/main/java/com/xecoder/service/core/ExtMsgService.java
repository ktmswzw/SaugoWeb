package com.xecoder.service.core;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.ExtMsg;

import java.util.List;

/**
 * Created by admin on 2014/7/11.
 */
public interface ExtMsgService {

    Page find(Page page, ExtMsg extMsg);

    List<ExtMsg> findList(Page page, ExtMsg extMsg);

    List<ExtMsg> findAll();

    void save(ExtMsg extMsg);

    ExtMsg get(int id);

    void update(ExtMsg extMsg);

    void delete(int id);

}
