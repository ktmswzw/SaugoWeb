package com.xecoder.mapper;

import com.xecoder.entity.User;
import com.xecoder.entity.UserCriteria;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface UserMapper {
    int countByExample(UserCriteria example);

    int deleteByExample(UserCriteria example);

    int deleteByPrimaryKey(Long id);

    int insert(User record);

    int insertSelective(User record);

    List<User> selectByExample(UserCriteria example);

    List<User> reportChar(UserCriteria example);

    User selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") User record, @Param("example") UserCriteria example);

    int updateByExample(@Param("record") User record, @Param("example") UserCriteria example);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

    List<User> selectTreeById(Long id);
}