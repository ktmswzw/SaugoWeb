package com.xecoder.business.service.impl;

import com.xecoder.business.entity.Order;
import com.xecoder.business.entity.OrderCriteria;
import com.xecoder.business.mapper.OrderMapper;
import com.xecoder.business.service.OrderService;
import com.xecoder.common.basedao.BaseDao;
import com.xecoder.common.baseservice.BaseService;
import com.xecoder.common.mybatis.Page;
import com.xecoder.common.util.SimpleDate;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by V on Sun Aug 21 15:24:09 CST 2016.
 */
@Service("OrderService")
@Transactional
@SuppressWarnings("unchecked")
public class OrderServiceImpl extends BaseService implements OrderService {


    @Override
    public Page findByPage(Page page, Order order) {
        page.setCount(countByExample(page, order));
        List<Order> list = baseDao.selectByPage("com.xecoder.business.mapper.OrderMapper." + BaseDao.SELECT_BY_EXAMPLE, getCriteria(page, order, 0), page);
        if (list != null)
            return page.setRows(list);
        else
            return null;
    }

    @Override
    public List<Order> findAll(Page page, Order order, int flag) {
        return baseDao.selectList("com.xecoder.business.mapper.OrderMapper." + BaseDao.SELECT_BY_EXAMPLE, getCriteria(page, order, flag));
    }

    @Override
    public int countByExample(Page page, Order order) {
        return baseDao.getMapper(OrderMapper.class).countByExample(getCriteria(page, order, 0));
    }

    public OrderCriteria getCriteria(Page page, Order order, int flag) {
        OrderCriteria criteria = new OrderCriteria();
        OrderCriteria.Criteria cri = criteria.createCriteria();
        if (order != null) {
            if (order.getAgentId()!=null && flag == 0) {
                cri.andAgentIdEqualTo(order.getAgentId());
            }
            if (order.getAgentId()!=null && flag == 1) {
                cri.addCriterion(" agent_id in ( " +
                        "SELECT id FROM SECURITY_USER WHERE " +
                        "STATUS = 'enabled' " +
                        "AND email = '' " +
                        "AND (parent_id IN (SELECT  id FROM SECURITY_USER  WHERE parent_Id = "+order.getAgentId()+") OR id IN (SELECT  id FROM  SECURITY_USER WHERE parent_Id = "+order.getAgentId()+") OR id = "+order.getAgentId()+") " +
                        ")");
            }
            if (order.getAgentId()!=null && flag == 2) {
                cri.addCriterion(" FIND_IN_SET(agent_id, AGENT_TREE(" + order.getAgentId() + "))");
            }
            if (StringUtils.isNotBlank(order.getAgentName())) {
                cri.addCriterion(" agent_name LIKE  '%"+order.getAgentName()+ "%' ");
            }
            if (order.getProduceId()!=null&&order.getProduceId()!=0) {
                cri.andProduceIdEqualTo(order.getProduceId());
            }
            if (order.getStatus()!=null) {
                cri.andStatusEqualTo(order.getStatus());
            }
            if(order.getBeginDate()!=null)
                cri.addCriterion(" Date(input_time) >=  '"+ SimpleDate.format(order.getBeginDate())+ "' ");
            if(order.getEndDate()!=null)
                cri.addCriterion(" Date(input_time) <=  '"+ SimpleDate.format(order.getEndDate())+ "' ");
        }
        if (page != null && page.getSort() != null && page.getOrder() != null) {
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
        order.setCheckTime(new Date());
        baseDao.getMapper(OrderMapper.class).updateByPrimaryKeySelective(order);
        if(order.getStatus()!=1){
            try {
                baseDao.execute("call report_day_all("+order.getAgentId()+", "+order.getProduceId()+", '"+SimpleDate.format(order.getCheckTime())+"');");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void delete(Long id) {
        baseDao.getMapper(OrderMapper.class).deleteByPrimaryKey(id);
    }
}

