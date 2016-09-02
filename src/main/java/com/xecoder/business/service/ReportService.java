package com.xecoder.business.service;

import com.xecoder.business.entity.Report;
import com.xecoder.common.mybatis.Page;

import java.util.List;

/**
 * Created by V on Thu Sep 01 23:24:45 CST 2016.
 */

public interface ReportService {

    Page findByPage(Page page, Report report);

    List<Report> findAll(Page page, Report report);

    int countByExample(Page page,Report report);

    void save(Report report);

    Report get(Long id);

    void update(Report report);

    void delete(Long id);

    Page reportTree(Page page, Report report);

}

