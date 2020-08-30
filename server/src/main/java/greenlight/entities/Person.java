package greenlight.entities;


import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "person")
public class Person {

    @NotBlank
    @NotNull
    @Column(name = "name")
    public String name;

    @Id
    @Column(name = "id", unique = true)
    @Email
    public String id;

    @NotBlank
    @NotNull
    @Column(name = "zipcode")
    public String zipCode;

    @Column(name = "auth_token")
    @GeneratedValue(strategy = GenerationType.TABLE)
    public String auth;

    public Person() {
    }

    public Person(@NotBlank @NotNull String name, @Email String id, @NotBlank @NotNull String zipCode, String auth) {
        this.name = name;
        this.id = id;
        this.zipCode = zipCode;
        this.auth = auth;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getAuth() {
        return auth;
    }

    public void setAuth(String auth) {
        this.auth = auth;
    }
}
