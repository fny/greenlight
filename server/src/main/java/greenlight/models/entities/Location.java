package greenlight.models.entities;


import greenlight.etc.validators.ValidPhone;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.Instant;


@Entity
public class Location {
  
  @Id @GeneratedValue(strategy = GenerationType.AUTO) public Integer id;
  @NotBlank public String name;
  
  // todo index
  @NotBlank public String permalink;
  
  @NotBlank public String registrationCode;
  
  public String website;
  
  @ValidPhone
  public String phoneNumber;
  
  @NotBlank @Email public String email;
  
  //todo validate
  public String zipCode;
  
  @NotNull
  public Boolean hidden = false;
  
  public String category;
  
  @CreationTimestamp public Instant createdAt;
  @UpdateTimestamp public Instant updatedAt;
  public Instant deletedAt;
  
  @ManyToOne public User createdBy = User.DEFAULT_USER;
  @ManyToOne public User updatedBy = User.DEFAULT_USER;
  @ManyToOne public User deletedBy = User.DEFAULT_USER;
  
  
  public Location() {
  }
  
  public Integer getId() {
    return id;
  }
  
  public void setId(final Integer id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(final String name) {
    this.name = name;
  }
  
  public String getPermalink() {
    return permalink;
  }
  
  public void setPermalink(final String permalink) {
    this.permalink = permalink;
  }
  
  public String getRegistrationCode() {
    return registrationCode;
  }
  
  public void setRegistrationCode(final String registrationCode) {
    this.registrationCode = registrationCode;
  }
  
  public String getWebsite() {
    return website;
  }
  
  public void setWebsite(final String website) {
    this.website = website;
  }
  
  public String getPhoneNumber() {
    return phoneNumber;
  }
  
  public void setPhoneNumber(final String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }
  
  public String getEmail() {
    return email;
  }
  
  public void setEmail(final String email) {
    this.email = email;
  }
  
  public String getZipCode() {
    return zipCode;
  }
  
  public void setZipCode(final String zipCode) {
    this.zipCode = zipCode;
  }
  
  public Boolean getHidden() {
    return hidden;
  }
  
  public void setHidden(final Boolean hidden) {
    this.hidden = hidden;
  }
  
  public String getCategory() {
    return category;
  }
  
  public void setCategory(final String category) {
    this.category = category;
  }
  
  public Instant getDeletedAt() {
    return deletedAt;
  }
  
  public void setDeletedAt(final Instant deletedAt) {
    this.deletedAt = deletedAt;
  }
  
  public Instant getCreatedAt() {
    return createdAt;
  }
  
  public void setCreatedAt(final Instant createdAt) {
    this.createdAt = createdAt;
  }
  
  public Instant getUpdatedAt() {
    return updatedAt;
  }
  
  public void setUpdatedAt(final Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
  
  public User getCreatedBy() {
    return createdBy;
  }
  
  public void setCreatedBy(final User createdBy) {
    this.createdBy = createdBy;
  }
  
  public User getUpdatedBy() {
    return updatedBy;
  }
  
  public void setUpdatedBy(final User updatedBy) {
    this.updatedBy = updatedBy;
  }
  
  public User getDeletedBy() {
    return deletedBy;
  }
  
  public void setDeletedBy(final User deletedBy) {
    this.deletedBy = deletedBy;
  }
}
