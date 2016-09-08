package com.xecoder.service.core;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.Columns;

import java.util.List;

/**
 * Created by imanon.net on 2014/10/13.
 */
public interface ColumnsService {
    int countByExample(Page page, Columns columns);
    List<Columns> selectByExample(Page page, Columns columns);
    Page findByPage(Page page, Columns columns);
}
