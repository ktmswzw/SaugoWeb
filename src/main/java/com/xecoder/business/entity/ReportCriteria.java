package com.xecoder.business.entity;

import java.util.ArrayList;
import java.util.List;

public class ReportCriteria {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public ReportCriteria() {
        oredCriteria = new ArrayList<Criteria>();
    }

    public void setOrderByClause(String orderByClause) {
        this.orderByClause = orderByClause;
    }

    public String getOrderByClause() {
        return orderByClause;
    }

    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }

    public boolean isDistinct() {
        return distinct;
    }

    public List<Criteria> getOredCriteria() {
        return oredCriteria;
    }

    public void or(Criteria criteria) {
        oredCriteria.add(criteria);
    }

    public Criteria or() {
        Criteria criteria = createCriteriaInternal();
        oredCriteria.add(criteria);
        return criteria;
    }

    public Criteria createCriteria() {
        Criteria criteria = createCriteriaInternal();
        if (oredCriteria.size() == 0) {
            oredCriteria.add(criteria);
        }
        return criteria;
    }

    protected Criteria createCriteriaInternal() {
        Criteria criteria = new Criteria();
        return criteria;
    }

    public void clear() {
        oredCriteria.clear();
        orderByClause = null;
        distinct = false;
    }

    protected abstract static class GeneratedCriteria {
        protected List<Criterion> criteria;

        protected GeneratedCriteria() {
            super();
            criteria = new ArrayList<Criterion>();
        }

        public boolean isValid() {
            return criteria.size() > 0;
        }

        public List<Criterion> getAllCriteria() {
            return criteria;
        }

        public List<Criterion> getCriteria() {
            return criteria;
        }

        public void addCriterion(String condition) {
            if (condition == null) {
                throw new RuntimeException("Value for condition cannot be null");
            }
            criteria.add(new Criterion(condition));
        }

        public void addCriterion(String condition, Object value, String property) {
            if (value == null) {
                throw new RuntimeException("Value for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value));
        }

        protected void addCriterion(String condition, Object value1, Object value2, String property) {
            if (value1 == null || value2 == null) {
                throw new RuntimeException("Between values for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value1, value2));
        }

        public Criteria andIdIsNull() {
            addCriterion("id is null");
            return (Criteria) this;
        }

        public Criteria andIdIsNotNull() {
            addCriterion("id is not null");
            return (Criteria) this;
        }

        public Criteria andIdEqualTo(Integer value) {
            addCriterion("id =", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotEqualTo(Integer value) {
            addCriterion("id <>", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdGreaterThan(Integer value) {
            addCriterion("id >", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("id >=", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdLessThan(Integer value) {
            addCriterion("id <", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdLessThanOrEqualTo(Integer value) {
            addCriterion("id <=", value, "id");
            return (Criteria) this;
        }

        public Criteria andIdIn(List<Integer> values) {
            addCriterion("id in", values, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotIn(List<Integer> values) {
            addCriterion("id not in", values, "id");
            return (Criteria) this;
        }

        public Criteria andIdBetween(Integer value1, Integer value2) {
            addCriterion("id between", value1, value2, "id");
            return (Criteria) this;
        }

        public Criteria andIdNotBetween(Integer value1, Integer value2) {
            addCriterion("id not between", value1, value2, "id");
            return (Criteria) this;
        }

        public Criteria andAgentIdIsNull() {
            addCriterion("agent_id is null");
            return (Criteria) this;
        }

        public Criteria andAgentIdIsNotNull() {
            addCriterion("agent_id is not null");
            return (Criteria) this;
        }

        public Criteria andAgentIdEqualTo(Long value) {
            addCriterion("agent_id =", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdNotEqualTo(Long value) {
            addCriterion("agent_id <>", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdGreaterThan(Long value) {
            addCriterion("agent_id >", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdGreaterThanOrEqualTo(Long value) {
            addCriterion("agent_id >=", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdLessThan(Long value) {
            addCriterion("agent_id <", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdLessThanOrEqualTo(Long value) {
            addCriterion("agent_id <=", value, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdIn(List<Long> values) {
            addCriterion("agent_id in", values, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdNotIn(List<Long> values) {
            addCriterion("agent_id not in", values, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdBetween(Long value1, Long value2) {
            addCriterion("agent_id between", value1, value2, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentIdNotBetween(Long value1, Long value2) {
            addCriterion("agent_id not between", value1, value2, "agentId");
            return (Criteria) this;
        }

        public Criteria andAgentSumIsNull() {
            addCriterion("agent_sum is null");
            return (Criteria) this;
        }

        public Criteria andAgentSumIsNotNull() {
            addCriterion("agent_sum is not null");
            return (Criteria) this;
        }

        public Criteria andAgentSumEqualTo(Long value) {
            addCriterion("agent_sum =", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumNotEqualTo(Long value) {
            addCriterion("agent_sum <>", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumGreaterThan(Long value) {
            addCriterion("agent_sum >", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumGreaterThanOrEqualTo(Long value) {
            addCriterion("agent_sum >=", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumLessThan(Long value) {
            addCriterion("agent_sum <", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumLessThanOrEqualTo(Long value) {
            addCriterion("agent_sum <=", value, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumIn(List<Long> values) {
            addCriterion("agent_sum in", values, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumNotIn(List<Long> values) {
            addCriterion("agent_sum not in", values, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumBetween(Long value1, Long value2) {
            addCriterion("agent_sum between", value1, value2, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentSumNotBetween(Long value1, Long value2) {
            addCriterion("agent_sum not between", value1, value2, "agentSum");
            return (Criteria) this;
        }

        public Criteria andAgentNameIsNull() {
            addCriterion("agent_name is null");
            return (Criteria) this;
        }

        public Criteria andAgentNameIsNotNull() {
            addCriterion("agent_name is not null");
            return (Criteria) this;
        }

        public Criteria andAgentNameEqualTo(String value) {
            addCriterion("agent_name =", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameNotEqualTo(String value) {
            addCriterion("agent_name <>", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameGreaterThan(String value) {
            addCriterion("agent_name >", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameGreaterThanOrEqualTo(String value) {
            addCriterion("agent_name >=", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameLessThan(String value) {
            addCriterion("agent_name <", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameLessThanOrEqualTo(String value) {
            addCriterion("agent_name <=", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameLike(String value) {
            addCriterion("agent_name like", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameNotLike(String value) {
            addCriterion("agent_name not like", value, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameIn(List<String> values) {
            addCriterion("agent_name in", values, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameNotIn(List<String> values) {
            addCriterion("agent_name not in", values, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameBetween(String value1, String value2) {
            addCriterion("agent_name between", value1, value2, "agentName");
            return (Criteria) this;
        }

        public Criteria andAgentNameNotBetween(String value1, String value2) {
            addCriterion("agent_name not between", value1, value2, "agentName");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumIsNull() {
            addCriterion("level_one_sum is null");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumIsNotNull() {
            addCriterion("level_one_sum is not null");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumEqualTo(Long value) {
            addCriterion("level_one_sum =", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumNotEqualTo(Long value) {
            addCriterion("level_one_sum <>", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumGreaterThan(Long value) {
            addCriterion("level_one_sum >", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumGreaterThanOrEqualTo(Long value) {
            addCriterion("level_one_sum >=", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumLessThan(Long value) {
            addCriterion("level_one_sum <", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumLessThanOrEqualTo(Long value) {
            addCriterion("level_one_sum <=", value, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumIn(List<Long> values) {
            addCriterion("level_one_sum in", values, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumNotIn(List<Long> values) {
            addCriterion("level_one_sum not in", values, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumBetween(Long value1, Long value2) {
            addCriterion("level_one_sum between", value1, value2, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelOneSumNotBetween(Long value1, Long value2) {
            addCriterion("level_one_sum not between", value1, value2, "levelOneSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumIsNull() {
            addCriterion("level_two_sum is null");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumIsNotNull() {
            addCriterion("level_two_sum is not null");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumEqualTo(Long value) {
            addCriterion("level_two_sum =", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumNotEqualTo(Long value) {
            addCriterion("level_two_sum <>", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumGreaterThan(Long value) {
            addCriterion("level_two_sum >", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumGreaterThanOrEqualTo(Long value) {
            addCriterion("level_two_sum >=", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumLessThan(Long value) {
            addCriterion("level_two_sum <", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumLessThanOrEqualTo(Long value) {
            addCriterion("level_two_sum <=", value, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumIn(List<Long> values) {
            addCriterion("level_two_sum in", values, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumNotIn(List<Long> values) {
            addCriterion("level_two_sum not in", values, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumBetween(Long value1, Long value2) {
            addCriterion("level_two_sum between", value1, value2, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andLevelTwoSumNotBetween(Long value1, Long value2) {
            addCriterion("level_two_sum not between", value1, value2, "levelTwoSum");
            return (Criteria) this;
        }

        public Criteria andIntegralIsNull() {
            addCriterion("integral is null");
            return (Criteria) this;
        }

        public Criteria andIntegralIsNotNull() {
            addCriterion("integral is not null");
            return (Criteria) this;
        }

        public Criteria andIntegralEqualTo(Long value) {
            addCriterion("integral =", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralNotEqualTo(Long value) {
            addCriterion("integral <>", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralGreaterThan(Long value) {
            addCriterion("integral >", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralGreaterThanOrEqualTo(Long value) {
            addCriterion("integral >=", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralLessThan(Long value) {
            addCriterion("integral <", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralLessThanOrEqualTo(Long value) {
            addCriterion("integral <=", value, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralIn(List<Long> values) {
            addCriterion("integral in", values, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralNotIn(List<Long> values) {
            addCriterion("integral not in", values, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralBetween(Long value1, Long value2) {
            addCriterion("integral between", value1, value2, "integral");
            return (Criteria) this;
        }

        public Criteria andIntegralNotBetween(Long value1, Long value2) {
            addCriterion("integral not between", value1, value2, "integral");
            return (Criteria) this;
        }

        public Criteria andProduceIdIsNull() {
            addCriterion("produce_id is null");
            return (Criteria) this;
        }

        public Criteria andProduceIdIsNotNull() {
            addCriterion("produce_id is not null");
            return (Criteria) this;
        }

        public Criteria andProduceIdEqualTo(Integer value) {
            addCriterion("produce_id =", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdNotEqualTo(Integer value) {
            addCriterion("produce_id <>", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdGreaterThan(Integer value) {
            addCriterion("produce_id >", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdGreaterThanOrEqualTo(Integer value) {
            addCriterion("produce_id >=", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdLessThan(Integer value) {
            addCriterion("produce_id <", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdLessThanOrEqualTo(Integer value) {
            addCriterion("produce_id <=", value, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdIn(List<Integer> values) {
            addCriterion("produce_id in", values, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdNotIn(List<Integer> values) {
            addCriterion("produce_id not in", values, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdBetween(Integer value1, Integer value2) {
            addCriterion("produce_id between", value1, value2, "produceId");
            return (Criteria) this;
        }

        public Criteria andProduceIdNotBetween(Integer value1, Integer value2) {
            addCriterion("produce_id not between", value1, value2, "produceId");
            return (Criteria) this;
        }

        public Criteria andReportDateIsNull() {
            addCriterion("report_date is null");
            return (Criteria) this;
        }

        public Criteria andReportDateIsNotNull() {
            addCriterion("report_date is not null");
            return (Criteria) this;
        }

        public Criteria andReportDateEqualTo(Integer value) {
            addCriterion("report_date =", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateNotEqualTo(Integer value) {
            addCriterion("report_date <>", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateGreaterThan(Integer value) {
            addCriterion("report_date >", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateGreaterThanOrEqualTo(Integer value) {
            addCriterion("report_date >=", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateLessThan(Integer value) {
            addCriterion("report_date <", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateLessThanOrEqualTo(Integer value) {
            addCriterion("report_date <=", value, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateIn(List<Integer> values) {
            addCriterion("report_date in", values, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateNotIn(List<Integer> values) {
            addCriterion("report_date not in", values, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateBetween(Integer value1, Integer value2) {
            addCriterion("report_date between", value1, value2, "reportDate");
            return (Criteria) this;
        }

        public Criteria andReportDateNotBetween(Integer value1, Integer value2) {
            addCriterion("report_date not between", value1, value2, "reportDate");
            return (Criteria) this;
        }
    }

    public static class Criteria extends GeneratedCriteria {

        protected Criteria() {
            super();
        }
    }

    public static class Criterion {
        private String condition;

        private Object value;

        private Object secondValue;

        private boolean noValue;

        private boolean singleValue;

        private boolean betweenValue;

        private boolean listValue;

        private String typeHandler;

        public String getCondition() {
            return condition;
        }

        public Object getValue() {
            return value;
        }

        public Object getSecondValue() {
            return secondValue;
        }

        public boolean isNoValue() {
            return noValue;
        }

        public boolean isSingleValue() {
            return singleValue;
        }

        public boolean isBetweenValue() {
            return betweenValue;
        }

        public boolean isListValue() {
            return listValue;
        }

        public String getTypeHandler() {
            return typeHandler;
        }

        protected Criterion(String condition) {
            super();
            this.condition = condition;
            this.typeHandler = null;
            this.noValue = true;
        }

        protected Criterion(String condition, Object value, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.typeHandler = typeHandler;
            if (value instanceof List<?>) {
                this.listValue = true;
            } else {
                this.singleValue = true;
            }
        }

        protected Criterion(String condition, Object value) {
            this(condition, value, null);
        }

        protected Criterion(String condition, Object value, Object secondValue, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.secondValue = secondValue;
            this.typeHandler = typeHandler;
            this.betweenValue = true;
        }

        protected Criterion(String condition, Object value, Object secondValue) {
            this(condition, value, secondValue, null);
        }
    }
}