package com.xecoder.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Transient;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

public class User implements Serializable {

    private static final long serialVersionUID = -5588204054182161257L;

    private Long id;

    @DateTimeFormat(pattern="yyyy-MM-dd")
    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    private Date createTime;

    private String email;

    private String password;

    private String phone;

    private String realname;

    private String salt;

    private String status;

    private String username;

    private Long orgId;

    private Long parentId;

    private String address;

    private String identityCards;

    private String cardsFront;

    private String cardsBack;

    private String bank;

    private String bankAccount;

    private String bankName;

    private String bak;

    @Transient
    private String plainPassword;


    private Organization organization;
    private List<UserRole> userRoles;
    private String theme;

    private String roles;

    @Transient
    private String rolesName;

    @Transient
    private String parentName;

    private int nodes;

    public int getNodes() {
        return nodes;
    }

    public void setNodes(int nodes) {
        this.nodes = nodes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname == null ? null : realname.trim();
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt == null ? null : salt.trim();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address == null ? null : address.trim();
    }

    public String getIdentityCards() {
        return identityCards;
    }

    public void setIdentityCards(String identityCards) {
        this.identityCards = identityCards == null ? null : identityCards.trim();
    }

    public String getCardsFront() {
        return cardsFront;
    }

    public void setCardsFront(String cardsFront) {
        this.cardsFront = cardsFront == null ? null : cardsFront.trim();
    }

    public String getCardsBack() {
        return cardsBack;
    }

    public void setCardsBack(String cardsBack) {
        this.cardsBack = cardsBack == null ? null : cardsBack.trim();
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank == null ? null : bank.trim();
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount == null ? null : bankAccount.trim();
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName == null ? null : bankName.trim();
    }

    public String getPlainPassword() {
        return plainPassword;
    }

    public void setPlainPassword(String plainPassword) {
        this.plainPassword = plainPassword;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public List<UserRole> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<UserRole> userRoles) {
        this.userRoles = userRoles;
        String role_s = "";
        String role_string = "";
        int i=0;
        for(UserRole userRole:userRoles)
        {
            if(i<userRoles.size()-1) {
                role_s += userRole.getRoleId().toString() + ",";
                role_string += userRole.getRole().getDescription() + ",";
            }
            else {
                role_s += userRole.getRoleId().toString();
                role_string += userRole.getRole().getDescription();
            }
            i++;
        }
        this.setRolesName(role_string);
        this.setRoles(role_s);
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }

    public String getRolesName() {
        return rolesName;
    }

    public void setRolesName(String rolesName) {
        this.rolesName = rolesName;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public String getBak() {
        return bak;
    }

    public void setBak(String bak) {
        this.bak = bak;
    }
}