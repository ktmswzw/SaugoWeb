package com.xecoder.business.service.impl;

import com.xecoder.business.entity.Report;
import com.xecoder.business.entity.ReportCriteria;
import com.xecoder.business.mapper.ReportMapper;
import com.xecoder.business.service.ReportService;
import com.xecoder.common.basedao.BaseDao;
import com.xecoder.common.baseservice.BaseService;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.SimpleDate;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by V on Thu Sep 01 23:24:45 CST 2016.
 */
@Service("ReportService")
@Transactional
@SuppressWarnings("unchecked")
public class ReportServiceImpl  extends BaseService implements ReportService {


    @Override
    public Page findByPage(Page page, Report report) {
        page.setCount(countByExample(page,report));
        List<Report> list= baseDao.selectByPage("com.xecoder.business.mapper.ReportMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,report),page);
        if(list!=null)
            return page.setRows(list);
        else
            return null;
    }
    
    @Override
    public List<Report> findAll(Page page, Report report) {
        return baseDao.selectList("com.xecoder.business.mapper.ReportMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,report));
    }

    @Override
    public List<Report> reportChar(Report report) {
        return baseDao.getMapper(ReportMapper.class).reportChar(getCriteria(null,report));
    }

    @Override
    public int countByExample(Page page, Report report) {
        return baseDao.getMapper(ReportMapper.class).countByExample(getCriteria(page,report));
    }

    public ReportCriteria getCriteria(Page page,Report report)
    {
        ReportCriteria criteria = new ReportCriteria();
        ReportCriteria.Criteria cri = criteria.createCriteria();
        if (report != null) {
            if(report.getProduceId()!=null)
                cri.andProduceIdEqualTo(report.getProduceId());
            if(report.getAgentId()!=null) {
                if (!report.isSuperReport())
                    cri.addCriterion(" agent_id in (select id from security_user where status = 'enabled' and parent_id = " + report.getAgentId() + ")");
                else
                    cri.addCriterion(" FIND_IN_SET(agent_id, AGENT_TREE(" + report.getAgentId() + "))");
            }

            if(report.getBeginDate()!=null) {
                String temp = SimpleDate.format(report.getBeginDate()).replace("-","");
                cri.andReportDateGreaterThanOrEqualTo(Integer.valueOf(temp));
            }
            if(report.getEndDate()!=null) {
                String temp = SimpleDate.format(report.getEndDate()).replace("-","");
                cri.andReportDateLessThanOrEqualTo(Integer.valueOf(temp));
            }
        }
        if(page != null && page.getSort() != null && page.getOrder() != null){
            criteria.setOrderByClause(page.getSort() + " " + page.getOrder());
        }
        return criteria;
    }

    @Override
    public void save(Report report) {
        baseDao.getMapper(ReportMapper.class).insertSelective(report);
    }

    @Override
    public Report get(Long id) {
        return baseDao.getMapper(ReportMapper.class).selectByPrimaryKey(Math.toIntExact(id));
    }

    @Override
    public void update(Report report) {
        baseDao.getMapper(ReportMapper.class).updateByPrimaryKeySelective(report);
    }

    @Override
    public void delete(Long id) {
        baseDao.getMapper(ReportMapper.class).deleteByPrimaryKey(Math.toIntExact(id));
    }

    @Override
    public Page reportTree(Page page, Report report){
        page.setCount(countByExample(page,report));
        List<Report> list= baseDao.getMapper(ReportMapper.class).reportTree(getCriteria(page,report));
        if(list!=null)
            return page.setRows(list);
        else
            return null;
    }
}

