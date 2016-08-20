package com.xecoder.business.mapper;

import com.xecoder.business.entity.Produce;
import com.xecoder.business.entity.ProduceCriteria;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ProduceMapper {
    int countByExample(ProduceCriteria example);

    int deleteByExample(ProduceCriteria example);

    int deleteByPrimaryKey(Long id);

    int insert(Produce record);

    int insertSelective(Produce record);

    List<Produce> selectByExample(ProduceCriteria example);

    Produce selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Produce record, @Param("example") ProduceCriteria example);

    int updateByExample(@Param("record") Produce record, @Param("example") ProduceCriteria example);

    int updateByPrimaryKeySelective(Produce record);

    int updateByPrimaryKey(Produce record);
}