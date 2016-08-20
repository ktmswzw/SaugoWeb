package com.xecoder.business.mapper;

import com.xecoder.business.entity.Remuneration;
import com.xecoder.business.entity.RemunerationCriteria;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface RemunerationMapper {
    int countByExample(RemunerationCriteria example);

    int deleteByExample(RemunerationCriteria example);

    int deleteByPrimaryKey(Long id);

    int insert(Remuneration record);

    int insertSelective(Remuneration record);

    List<Remuneration> selectByExample(RemunerationCriteria example);

    Remuneration selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Remuneration record, @Param("example") RemunerationCriteria example);

    int updateByExample(@Param("record") Remuneration record, @Param("example") RemunerationCriteria example);

    int updateByPrimaryKeySelective(Remuneration record);

    int updateByPrimaryKey(Remuneration record);
}