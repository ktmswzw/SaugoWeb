package com.xecoder.service.core;

import com.xecoder.common.mybatis.Page;
import com.xecoder.entity.SecurityPortal;
import com.xecoder.entity.SecurityPortalReport;

import java.util.List;

/**
 * Created by imanon.net on 2014/9/14.
 */
public interface PortalService {
    Page findByPage(Page page, SecurityPortal securityPortal);

    int countByExample(Page page,SecurityPortal securityPortal);

    SecurityPortal get(int id);

    List<SecurityPortalReport> customTypeSum(int state);

    List<SecurityPortalReport> customMonthSum(int state);

    List<SecurityPortalReport> serverRoom(int serverRoomId);

    List<SecurityPortalReport> investMonth();

    List<SecurityPortalReport> orderMonth();

    List<SecurityPortalReport> complaintMonth();

}
