package com.xecoder.business.entity;

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
}