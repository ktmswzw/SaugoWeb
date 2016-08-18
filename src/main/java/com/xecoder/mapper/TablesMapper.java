package com.xecoder.mapper;

import com.xecoder.entity.DataBase;
import com.xecoder.entity.Tables;
import com.xecoder.entity.TablesCriteria;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TablesMapper {
    int countByExample(TablesCriteria example);

    int deleteByExample(TablesCriteria example);

    int insert(Tables record);

    int insertSelective(Tables record);

    List<Tables> selectByExample(TablesCriteria example);

    int updateByExampleSelective(@Param("record") Tables record, @Param("example") TablesCriteria example);

    int updateByExample(@Param("record") Tables record, @Param("example") TablesCriteria example);

    List<DataBase> dataBase();
}