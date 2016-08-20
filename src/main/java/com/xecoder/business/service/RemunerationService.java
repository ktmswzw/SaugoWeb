package com.xecoder.business.service;

import com.xecoder.business.entity.Remuneration;
import com.xecoder.common.mybatis.Page;
import com.xecoder.exception.ServiceException;

import java.util.List;

/**
 * Created by V on Sat Aug 20 23:09:18 CST 2016.
 */

public interface RemunerationService {

    Page findByPage(Page page, Remuneration remuneration);

    List<Remuneration> findAll(Page page, Remuneration remuneration);

    int countByExample(Page page,Remuneration remuneration);

    void save(Remuneration remuneration);

    Remuneration get(Long id);

    void update(Remuneration remuneration);

    void delete(Long id);

}

