package greenlight.models.entities;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class GreenlightStatus {
  
  @Id @GeneratedValue public Integer id;
}
