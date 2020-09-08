package greenlight.models.entities;


import greenlight.etc.validators.ValidPhone;
import io.micronaut.core.annotation.Introspected;
import io.micronaut.validation.Validated;
import org.hibernate.annotations.NaturalId;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.Instant;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;


@Introspected @Entity @Table(name = "USERS") @Validated public class User {
  
  public static final User DEFAULT_USER = new User(UUID.fromString("-1"), "GREENLIGHT", "GREENLIGHT", "admin@greenlighted.org",
                                                   "+12265000405");
  
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
  
  //region password
  public String passwordDigest;
  public Instant passwordSetAt;
  public Instant rememberMeSetAt;
  
  // todo index, unique
  public String passwordResetToken;
  public Instant passwordResetSentAt;
  // todo index, unique
  public String authToken;
  public Instant authTokenSetAt;
  public String magicSignInToken;
  //endregion
  
  //region email
  @Email public String email;
  // todo index
  public String emailConfirmationToken;
  public Instant emailConfirmationSentAt;
  @Nullable public Instant emailConfirmedAt;
  @Nullable public String emailUnconfirmed;
  //endregion
  
  //region mobile
  @NaturalId(mutable = true) @NotNull @ValidPhone public String mobileNumber;
  public String mobileCarrier;
  public boolean smsGatewayEmailable = false;
  public Instant mobileConfirmationSentAt;
  public Instant mobileNumberConfirmedAt;
  @NaturalId(mutable = true) @Nullable @ValidPhone public String mobileNumberUnconfirmed;
  //endregion
  
  //region user details
  public String zipCode;
  
  @Min(0) @Max(2) public Integer gender;
  
  @Nullable public String ethnicity;
  
  @Nullable public Instant birthDate;
  
  @Nullable public String physicianName;
  
  @Nullable @ValidPhone public String physicianPhoneNumber;
  //endregion
  
  //region timestamps
  @Nullable public Instant acceptedTermsAt;
  public Instant reviewedAt;
  public Instant deletedAt;
  @Column(updatable = false) public Instant createdAt;
  public Instant updatedAt;
  public Instant currentSignInAt;
  public Instant lastSignInAt;
  public Instant lastSeenAt;
  //endregion
  
  //region tracking
  @Min(0) public Integer signInCount;
  public String currentSignInIp; // todo ip address validation regex?
  public String currentUserAgent;
  public String lastSignInIp;
  public String lastUserAgent;
  //endregion
  
  @ManyToOne public User createdBy = DEFAULT_USER;
  @ManyToOne public User deletedBy = DEFAULT_USER;
  @ManyToOne public User updatedBy = DEFAULT_USER;
  @ManyToOne public User reviewedBy = DEFAULT_USER;
  
  @Nullable @OneToMany public Set<User> children;
  @Nullable @OneToMany public Set<User> parents;
  
//  @Nullable @OneToMany
//  @JoinTable(name = "USERS_LOCATIONS", joinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "ID"),
//             inverseJoinColumns = @JoinColumn(name = "LOCATION_ID", referencedColumnName = "ID"))
//  public Set<Location> locations;
  
  @Nullable @OneToMany public Set<GreenlightStatus> statuses;
  
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
  
  public String getPasswordDigest() {
    return passwordDigest;
  }
  
  public void setPasswordDigest(final String passwordDigest) {
    this.passwordDigest = passwordDigest;
  }
  
  public Instant getPasswordSetAt() {
    return passwordSetAt;
  }
  
  public void setPasswordSetAt(final Instant passwordSetAt) {
    this.passwordSetAt = passwordSetAt;
  }
  
  public Instant getRememberMeSetAt() {
    return rememberMeSetAt;
  }
  
  public void setRememberMeSetAt(final Instant rememberMeSetAt) {
    this.rememberMeSetAt = rememberMeSetAt;
  }
  
  public String getPasswordResetToken() {
    return passwordResetToken;
  }
  
  public void setPasswordResetToken(final String passwordResetToken) {
    this.passwordResetToken = passwordResetToken;
  }
  
  public Instant getPasswordResetSentAt() {
    return passwordResetSentAt;
  }
  
  public void setPasswordResetSentAt(final Instant passwordResetSentAt) {
    this.passwordResetSentAt = passwordResetSentAt;
  }
  
  public String getAuthToken() {
    return authToken;
  }
  
  public void setAuthToken(final String authToken) {
    this.authToken = authToken;
  }
  
  public Instant getAuthTokenSetAt() {
    return authTokenSetAt;
  }
  
  public void setAuthTokenSetAt(final Instant authTokenSetAt) {
    this.authTokenSetAt = authTokenSetAt;
  }
  
  public String getMagicSignInToken() {
    return magicSignInToken;
  }
  
  public void setMagicSignInToken(final String magicSignInToken) {
    this.magicSignInToken = magicSignInToken;
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
  
  @Nullable public Instant getEmailConfirmedAt() {
    return emailConfirmedAt;
  }
  
  public void setEmailConfirmedAt(@Nullable final Instant emailConfirmedAt) {
    this.emailConfirmedAt = emailConfirmedAt;
  }
  
  @Nullable public String getEmailUnconfirmed() {
    return emailUnconfirmed;
  }
  
  public void setEmailUnconfirmed(@Nullable final String emailUnconfirmed) {
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
  
  @Nullable public String getMobileNumberUnconfirmed() {
    return mobileNumberUnconfirmed;
  }
  
  public void setMobileNumberUnconfirmed(@Nullable final String mobileNumberUnconfirmed) {
    this.mobileNumberUnconfirmed = mobileNumberUnconfirmed;
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
  
  @Nullable public String getEthnicity() {
    return ethnicity;
  }
  
  public void setEthnicity(@Nullable final String ethnicity) {
    this.ethnicity = ethnicity;
  }
  
  @Nullable public Instant getBirthDate() {
    return birthDate;
  }
  
  public void setBirthDate(@Nullable final Instant birthDate) {
    this.birthDate = birthDate;
  }
  
  @Nullable public String getPhysicianName() {
    return physicianName;
  }
  
  public void setPhysicianName(@Nullable final String physicianName) {
    this.physicianName = physicianName;
  }
  
  @Nullable public String getPhysicianPhoneNumber() {
    return physicianPhoneNumber;
  }
  
  public void setPhysicianPhoneNumber(@Nullable final String physicianPhoneNumber) {
    this.physicianPhoneNumber = physicianPhoneNumber;
  }
  
  @Nullable public Instant getAcceptedTermsAt() {
    return acceptedTermsAt;
  }
  
  public void setAcceptedTermsAt(@Nullable final Instant acceptedTermsAt) {
    this.acceptedTermsAt = acceptedTermsAt;
  }
  
  public Instant getReviewedAt() {
    return reviewedAt;
  }
  
  public void setReviewedAt(final Instant reviewedAt) {
    this.reviewedAt = reviewedAt;
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
  
  public String getCurrentSignInIp() {
    return currentSignInIp;
  }
  
  public void setCurrentSignInIp(final String currentSignInIp) {
    this.currentSignInIp = currentSignInIp;
  }
  
  public String getCurrentUserAgent() {
    return currentUserAgent;
  }
  
  public void setCurrentUserAgent(final String currentUserAgent) {
    this.currentUserAgent = currentUserAgent;
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
  
  public User getCreatedBy() {
    return createdBy;
  }
  
  public void setCreatedBy(final User createdBy) {
    this.createdBy = createdBy;
  }
  
  public User getDeletedBy() {
    return deletedBy;
  }
  
  public void setDeletedBy(final User deletedBy) {
    this.deletedBy = deletedBy;
  }
  
  public User getUpdatedBy() {
    return updatedBy;
  }
  
  public void setUpdatedBy(final User updatedBy) {
    this.updatedBy = updatedBy;
  }
  
  public User getReviewedBy() {
    return reviewedBy;
  }
  
  public void setReviewedBy(final User reviewedBy) {
    this.reviewedBy = reviewedBy;
  }
  
  @Nullable public Set<User> getChildren() {
    return children;
  }
  
  public void setChildren(@Nullable final Set<User> children) {
    this.children = children;
    // todo sync parents to children
  }
  
  @Nullable public Set<User> getParents() {
    return parents;
  }
  
  public void setParents(@Nullable final Set<User> parents) {
    this.parents = parents;
    // todo sync children to parents
  }
  
  @Nullable public Set<GreenlightStatus> getStatuses() {
    return statuses;
  }
  
  public void setStatuses(@Nullable final Set<GreenlightStatus> statuses) {
    this.statuses = statuses;
  }
  
  @Override public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final User user = (User) o;
    return getId().equals(user.getId());
  }
  
  @Override public int hashCode() {
    return Objects.hash(getId());
  }
}


