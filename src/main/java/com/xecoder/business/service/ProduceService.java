package com.xecoder.business.service;

import com.xecoder.business.entity.Produce;
import com.xecoder.common.mybatis.Page;
import com.xecoder.exception.ServiceException;

import java.util.List;

/**
 * Created by V on Sat Aug 20 17:41:38 CST 2016.
 */

public interface ProduceService {

    Page findByPage(Page page, Produce produce);

    List<Produce> findAll(Page page, Produce produce);

    int countByExample(Page page,Produce produce);

    void save(Produce produce);

    Produce get(Long id);

    void update(Produce produce);

    void delete(Long id);

}

