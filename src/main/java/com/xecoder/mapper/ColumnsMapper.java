package com.xecoder.mapper;

import com.xecoder.entity.Columns;
import com.xecoder.entity.ColumnsCriteria;
import com.xecoder.entity.ColumnsWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ColumnsMapper {
    int countByExample(ColumnsCriteria example);

    int deleteByExample(ColumnsCriteria example);

    int insert(ColumnsWithBLOBs record);

    int insertSelective(ColumnsWithBLOBs record);

    List<ColumnsWithBLOBs> selectByExampleWithBLOBs(ColumnsCriteria example);

    List<Columns> selectByExample(ColumnsCriteria example);

    int updateByExampleSelective(@Param("record") ColumnsWithBLOBs record, @Param("example") ColumnsCriteria example);

    int updateByExampleWithBLOBs(@Param("record") ColumnsWithBLOBs record, @Param("example") ColumnsCriteria example);

    int updateByExample(@Param("record") Columns record, @Param("example") ColumnsCriteria example);
}