package greenlight.models.entities;


import greenlight.etc.validators.ValidPhone;
import io.micronaut.core.annotation.Introspected;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;


@Introspected @Entity @Table(name = "USERS") public class User {
  
  public User() {
  }
  
  public User(final UUID id, @NotBlank final String firstName, @NotBlank final String lastName, @Email final String email, @NotNull final String mobileNumber) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobileNumber = mobileNumber;
  }
  
  //region basic
  @Id public UUID id;
  @NotBlank public String firstName;
  @NotBlank public String lastName;
  //endregion
  
  //region email
  @Email public String email;
  // todo index
  public String emailConfirmationToken;
  public Instant emailConfirmationSentAt;
  public Instant emailConfirmedAt;
  public String emailUnconfirmed;
  //endregion
  
  @NaturalId(mutable = true) @NotNull @ValidPhone public String mobileNumber;
  
  public String mobileCarrier;
  public boolean smsGatewayEmailable = false;
  public Instant mobileConfirmationSentAt;
  public Instant mobileNumberConfirmedAt;
  public boolean isDefault = true;
  
  public String zipCode;
  
  public Integer gender;
  
  public Integer ethnicity;
  
  public Instant birthDate;
  
  public String physicianName;
  public String physicianPhoneNumber;
  
  public Instant reviewedAt;
  
  public Instant lastSeenAt;
  
  public Integer signInCount;
  
  public Instant currentSignInAt;
  public Instant lastSignInAt;
  
  public String currentSignInIp; // todo ip address validation regex?
  
  public String lastSignInIp;
  public String lastUserAgent;
  
  
  public String currentUserAgent;
  
  //        @OneToMany
  //        public children: MutableSet<User>? = mutableSetOf(),
  
  
  public UUID reviewedBy;
  public UUID createdByUserId;
  public UUID deletedByUserId;
  public UUID updatedByUserId;
  
  public Instant deletedAt;
  @Column(name = "created_at", updatable = false) public Instant createdAt;
  @Column(name = "updated_at") public Instant updatedAt;
  
  @PrePersist void onPersist() {
    createdAt = updatedAt = Instant.now();
  }
  
  @PreUpdate void onUpdate() {
    updatedAt = Instant.now();
  }
  
  public UUID getId() {
    return id;
  }
  
  public void setId(final UUID id) {
    this.id = id;
  }
  
  public String getFirstName() {
    return firstName;
  }
  
  public void setFirstName(final String firstName) {
    this.firstName = firstName;
  }
  
  public String getLastName() {
    return lastName;
  }
  
  public void setLastName(final String lastName) {
    this.lastName = lastName;
  }
  
  public String getEmail() {
    return email;
  }
  
  public void setEmail(final String email) {
    this.email = email;
  }
  
  public String getEmailConfirmationToken() {
    return emailConfirmationToken;
  }
  
  public void setEmailConfirmationToken(final String emailConfirmationToken) {
    this.emailConfirmationToken = emailConfirmationToken;
  }
  
  public Instant getEmailConfirmationSentAt() {
    return emailConfirmationSentAt;
  }
  
  public void setEmailConfirmationSentAt(final Instant emailConfirmationSentAt) {
    this.emailConfirmationSentAt = emailConfirmationSentAt;
  }
  
  public Instant getEmailConfirmedAt() {
    return emailConfirmedAt;
  }
  
  public void setEmailConfirmedAt(final Instant emailConfirmedAt) {
    this.emailConfirmedAt = emailConfirmedAt;
  }
  
  public String getEmailUnconfirmed() {
    return emailUnconfirmed;
  }
  
  public void setEmailUnconfirmed(final String emailUnconfirmed) {
    this.emailUnconfirmed = emailUnconfirmed;
  }
  
  public String getMobileNumber() {
    return mobileNumber;
  }
  
  public void setMobileNumber(final String mobileNumber) {
    this.mobileNumber = mobileNumber;
  }
  
  public String getMobileCarrier() {
    return mobileCarrier;
  }
  
  public void setMobileCarrier(final String mobileCarrier) {
    this.mobileCarrier = mobileCarrier;
  }
  
  public boolean isSmsGatewayEmailable() {
    return smsGatewayEmailable;
  }
  
  public void setSmsGatewayEmailable(final boolean smsGatewayEmailable) {
    this.smsGatewayEmailable = smsGatewayEmailable;
  }
  
  public Instant getMobileConfirmationSentAt() {
    return mobileConfirmationSentAt;
  }
  
  public void setMobileConfirmationSentAt(final Instant mobileConfirmationSentAt) {
    this.mobileConfirmationSentAt = mobileConfirmationSentAt;
  }
  
  public Instant getMobileNumberConfirmedAt() {
    return mobileNumberConfirmedAt;
  }
  
  public void setMobileNumberConfirmedAt(final Instant mobileNumberConfirmedAt) {
    this.mobileNumberConfirmedAt = mobileNumberConfirmedAt;
  }
  
  public boolean isDefault() {
    return isDefault;
  }
  
  public void setDefault(final boolean aDefault) {
    isDefault = aDefault;
  }
  
  public String getZipCode() {
    return zipCode;
  }
  
  public void setZipCode(final String zipCode) {
    this.zipCode = zipCode;
  }
  
  public Integer getGender() {
    return gender;
  }
  
  public void setGender(final Integer gender) {
    this.gender = gender;
  }
  
  public Integer getEthnicity() {
    return ethnicity;
  }
  
  public void setEthnicity(final Integer ethnicity) {
    this.ethnicity = ethnicity;
  }
  
  public Instant getBirthDate() {
    return birthDate;
  }
  
  public void setBirthDate(final Instant birthDate) {
    this.birthDate = birthDate;
  }
  
  public String getPhysicianName() {
    return physicianName;
  }
  
  public void setPhysicianName(final String physicianName) {
    this.physicianName = physicianName;
  }
  
  public String getPhysicianPhoneNumber() {
    return physicianPhoneNumber;
  }
  
  public void setPhysicianPhoneNumber(final String physicianPhoneNumber) {
    this.physicianPhoneNumber = physicianPhoneNumber;
  }
  
  public Instant getReviewedAt() {
    return reviewedAt;
  }
  
  public void setReviewedAt(final Instant reviewedAt) {
    this.reviewedAt = reviewedAt;
  }
  
  public Instant getLastSeenAt() {
    return lastSeenAt;
  }
  
  public void setLastSeenAt(final Instant lastSeenAt) {
    this.lastSeenAt = lastSeenAt;
  }
  
  public Integer getSignInCount() {
    return signInCount;
  }
  
  public void setSignInCount(final Integer signInCount) {
    this.signInCount = signInCount;
  }
  
  public Instant getCurrentSignInAt() {
    return currentSignInAt;
  }
  
  public void setCurrentSignInAt(final Instant currentSignInAt) {
    this.currentSignInAt = currentSignInAt;
  }
  
  public Instant getLastSignInAt() {
    return lastSignInAt;
  }
  
  public void setLastSignInAt(final Instant lastSignInAt) {
    this.lastSignInAt = lastSignInAt;
  }
  
  public String getCurrentSignInIp() {
    return currentSignInIp;
  }
  
  public void setCurrentSignInIp(final String currentSignInIp) {
    this.currentSignInIp = currentSignInIp;
  }
  
  public String getLastSignInIp() {
    return lastSignInIp;
  }
  
  public void setLastSignInIp(final String lastSignInIp) {
    this.lastSignInIp = lastSignInIp;
  }
  
  public String getLastUserAgent() {
    return lastUserAgent;
  }
  
  public void setLastUserAgent(final String lastUserAgent) {
    this.lastUserAgent = lastUserAgent;
  }
  
  public String getCurrentUserAgent() {
    return currentUserAgent;
  }
  
  public void setCurrentUserAgent(final String currentUserAgent) {
    this.currentUserAgent = currentUserAgent;
  }
  
  public UUID getReviewedBy() {
    return reviewedBy;
  }
  
  public void setReviewedBy(final UUID reviewedBy) {
    this.reviewedBy = reviewedBy;
  }
  
  public UUID getCreatedByUserId() {
    return createdByUserId;
  }
  
  public void setCreatedByUserId(final UUID createdByUserId) {
    this.createdByUserId = createdByUserId;
  }
  
  public UUID getDeletedByUserId() {
    return deletedByUserId;
  }
  
  public void setDeletedByUserId(final UUID deletedByUserId) {
    this.deletedByUserId = deletedByUserId;
  }
  
  public UUID getUpdatedByUserId() {
    return updatedByUserId;
  }
  
  public void setUpdatedByUserId(final UUID updatedByUserId) {
    this.updatedByUserId = updatedByUserId;
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
}


