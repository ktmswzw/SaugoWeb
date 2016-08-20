package com.xecoder.business.service.impl;

import com.xecoder.business.entity.Remuneration;
import com.xecoder.business.entity.RemunerationCriteria;
import com.xecoder.business.mapper.RemunerationMapper;
import com.xecoder.business.service.RemunerationService;
import com.xecoder.common.basedao.BaseDao;
import com.xecoder.common.baseservice.BaseService;
import com.xecoder.common.mybatis.Page;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by V on Sat Aug 20 23:09:18 CST 2016.
 */
@Service("RemunerationService")
@Transactional
@SuppressWarnings("unchecked")
public class RemunerationServiceImpl  extends BaseService implements RemunerationService {


    @Override
    public Page findByPage(Page page, Remuneration remuneration) {
        page.setCount(countByExample(page,remuneration));
        List<Remuneration> list= baseDao.selectByPage("com.xecoder.business.mapper.RemunerationMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,remuneration),page);
        if(list!=null)
            return page.setRows(list);
        else
            return null;
    }
    
    @Override
    public List<Remuneration> findAll(Page page, Remuneration remuneration) {
        return baseDao.selectList("com.xecoder.business.mapper.RemunerationMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,remuneration));
    }

    @Override
    public int countByExample(Page page, Remuneration remuneration) {
        return baseDao.getMapper(RemunerationMapper.class).countByExample(getCriteria(page,remuneration));
    }

    public RemunerationCriteria getCriteria(Page page,Remuneration remuneration)
    {
        RemunerationCriteria criteria = new RemunerationCriteria();
        RemunerationCriteria.Criteria cri = criteria.createCriteria();
        if (remuneration != null) {

            if (remuneration.getProduceId()!=null) {
                cri.andProduceIdEqualTo(remuneration.getProduceId());
            }
        }
        if(page != null && page.getSort() != null && page.getOrder() != null){
            criteria.setOrderByClause(page.getSort() + " " + page.getOrder());
        }
        return criteria;
    }

    @Override
    public void save(Remuneration remuneration) {
        baseDao.getMapper(RemunerationMapper.class).insertSelective(remuneration);
    }

    @Override
    public Remuneration get(Long id) {
        return baseDao.getMapper(RemunerationMapper.class).selectByPrimaryKey(id);
    }

    @Override
    public void update(Remuneration remuneration) {
        baseDao.getMapper(RemunerationMapper.class).updateByPrimaryKeySelective(remuneration);
    }

    @Override
    public void delete(Long id) {
        baseDao.getMapper(RemunerationMapper.class).deleteByPrimaryKey(id);
    }
}

