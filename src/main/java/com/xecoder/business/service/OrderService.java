package com.xecoder.business.service;

import com.xecoder.business.entity.Order;
import com.xecoder.common.mybatis.Page;
import com.xecoder.exception.ServiceException;

import java.util.List;

/**
 * Created by V on Sun Aug 21 15:24:09 CST 2016.
 */

public interface OrderService {

    Page findByPage(Page page, Order order);

    List<Order> findAll(Page page, Order order, int flag);

    int countByExample(Page page,Order order);

    void save(Order order);

    Order get(String id);

    void update(Order order);

    void delete(String id);

}

