package com.xecoder.business.mapper;

import com.xecoder.business.entity.Report;
import com.xecoder.business.entity.ReportCriteria;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ReportMapper {
    int countByExample(ReportCriteria example);

    int deleteByExample(ReportCriteria example);

    int deleteByPrimaryKey(Integer id);

    int insert(Report record);

    int insertSelective(Report record);

    List<Report> selectByExample(ReportCriteria example);

    Report selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Report record, @Param("example") ReportCriteria example);

    int updateByExample(@Param("record") Report record, @Param("example") ReportCriteria example);

    int updateByPrimaryKeySelective(Report record);

    int updateByPrimaryKey(Report record);

    List<Report> reportTree(ReportCriteria example);
}