package com.xecoder.business.service.impl;

import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.OrderCriteria;
import com.xecoder.business.mapper.OrderMapper;
import com.xecoder.business.service.OrderService;
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
 * Created by V on Sun Aug 21 15:24:09 CST 2016.
 */
@Service("OrderService")
@Transactional
@SuppressWarnings("unchecked")
public class OrderServiceImpl  extends BaseService implements OrderService {


    @Override
    public Page findByPage(Page page, Order order) {
        page.setCount(countByExample(page,order));
        List<Order> list= baseDao.selectByPage("com.xecoder.business.mapper.OrderMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,order),page);
        if(list!=null)
            return page.setRows(list);
        else
            return null;
    }
    
    @Override
    public List<Order> findAll(Page page, Order order) {
        return baseDao.selectList("com.xecoder.business.mapper.OrderMapper."+BaseDao.SELECT_BY_EXAMPLE, getCriteria(page,order));
    }

    @Override
    public int countByExample(Page page, Order order) {
        return baseDao.getMapper(OrderMapper.class).countByExample(getCriteria(page,order));
    }

    public OrderCriteria getCriteria(Page page,Order order)
    {
        OrderCriteria criteria = new OrderCriteria();
        OrderCriteria.Criteria cri = criteria.createCriteria();
        if (order != null) {
                               if(StringUtils.isNotBlank(order.getAgentName())) {
                cri.andAgentNameEqualTo(order.getAgentName());
               }


        }
        if(page != null && page.getSort() != null && page.getOrder() != null){
            criteria.setOrderByClause(page.getSort() + " " + page.getOrder());
        }
        return criteria;
    }

    @Override
    public void save(Order order) {
        baseDao.getMapper(OrderMapper.class).insertSelective(order);
    }

    @Override
    public Order get(Long id) {
        return baseDao.getMapper(OrderMapper.class).selectByPrimaryKey(id);
    }

    @Override
    public void update(Order order) {
        baseDao.getMapper(OrderMapper.class).updateByPrimaryKeySelective(order);
    }

    @Override
    public void delete(Long id) {
        baseDao.getMapper(OrderMapper.class).deleteByPrimaryKey(id);
    }
}

