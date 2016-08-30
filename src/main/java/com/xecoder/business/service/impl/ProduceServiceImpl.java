package com.xecoder.business.service.impl;

import com.xecoder.business.entity.Produce;
import com.xecoder.business.entity.ProduceCriteria;
import com.xecoder.business.mapper.ProduceMapper;
import com.xecoder.business.service.ProduceService;
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
 * Created by V on Sat Aug 20 17:41:38 CST 2016.
 */
@Service("ProduceService")
@Transactional
@SuppressWarnings("unchecked")
public class ProduceServiceImpl  extends BaseService implements ProduceService {


    @Override
    public Page findByPage(Page page, Produce produce) {
        page.setCount(countByExample(page, produce));
        List<Produce> list = baseDao.selectByPage("com.xecoder.business.mapper.ProduceMapper." + BaseDao.SELECT_BY_EXAMPLE, getCriteria(page, produce), page);
        if (list != null)
            return page.setRows(list);
        else
            return null;
    }

    @Override
    public List<Produce> findAll(Page page, Produce produce) {
        return baseDao.selectList("com.xecoder.business.mapper.ProduceMapper." + BaseDao.SELECT_BY_EXAMPLE, getCriteria(page, produce));
    }

    @Override
    public int countByExample(Page page, Produce produce) {
        return baseDao.getMapper(ProduceMapper.class).countByExample(getCriteria(page, produce));
    }

    public ProduceCriteria getCriteria(Page page, Produce produce) {
        ProduceCriteria criteria = new ProduceCriteria();
        ProduceCriteria.Criteria cri = criteria.createCriteria();
        if (produce != null) {
            if (StringUtils.isNotBlank(produce.getName())) {
                cri.andNameLike("%"+produce.getName()+"%");
            }
        }
        if (page != null && page.getSort() != null && page.getOrder() != null) {
            criteria.setOrderByClause(page.getSort() + " " + page.getOrder());
        }

        cri.andStatusEqualTo("enabled");
        return criteria;
    }

    @Override
    public void save(Produce produce) {
        baseDao.getMapper(ProduceMapper.class).insertSelective(produce);
    }

    @Override
    public Produce get(Long id) {
        return baseDao.getMapper(ProduceMapper.class).selectByPrimaryKey(id);
    }

    @Override
    public void update(Produce produce) {
        baseDao.getMapper(ProduceMapper.class).updateByPrimaryKeySelective(produce);
    }

    @Override
    public void delete(Long id) {
        Produce produce = baseDao.getMapper(ProduceMapper.class).selectByPrimaryKey(id);
        produce.setStatus("disabled");
        this.update(produce);
    }
}

