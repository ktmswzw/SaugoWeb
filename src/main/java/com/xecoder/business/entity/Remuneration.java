package com.xecoder.business.entity;

public class Remuneration {
    private Long id;

    private Long produceId;

    private Integer level;

    private Long remuneration;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProduceId() {
        return produceId;
    }

    public void setProduceId(Long produceId) {
        this.produceId = produceId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Long getRemuneration() {
        return remuneration;
    }

    public void setRemuneration(Long remuneration) {
        this.remuneration = remuneration;
    }
}