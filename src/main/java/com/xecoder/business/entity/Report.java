package com.xecoder.business.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Transient;
import java.util.Date;

public class Report {
    private Integer id;

    private Long agentId;

    private Long agentSum;

    private String agentName;

    private Long levelOneSum;

    private Long levelTwoSum;

    private Long integral;

    private Integer produceId;

    private Integer reportDate;

    @Transient
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date beginDate;

    @Transient
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date endDate;

    boolean superReport;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public Long getAgentSum() {
        return agentSum;
    }

    public void setAgentSum(Long agentSum) {
        this.agentSum = agentSum;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName == null ? null : agentName.trim();
    }

    public Long getLevelOneSum() {
        return levelOneSum;
    }

    public void setLevelOneSum(Long levelOneSum) {
        this.levelOneSum = levelOneSum;
    }

    public Long getLevelTwoSum() {
        return levelTwoSum;
    }

    public void setLevelTwoSum(Long levelTwoSum) {
        this.levelTwoSum = levelTwoSum;
    }

    public Long getIntegral() {
        return integral;
    }

    public void setIntegral(Long integral) {
        this.integral = integral;
    }

    public Integer getProduceId() {
        return produceId;
    }

    public void setProduceId(Integer produceId) {
        this.produceId = produceId;
    }

    public Integer getReportDate() {
        return reportDate;
    }

    public void setReportDate(Integer reportDate) {
        this.reportDate = reportDate;
    }

    public Date getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(Date beginDate) {
        this.beginDate = beginDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public boolean isSuperReport() {
        return superReport;
    }

    public void setSuperReport(boolean superReport) {
        this.superReport = superReport;
    }
}