package greenlight.models.entities;


import org.hibernate.annotations.ManyToAny;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;


public class UserLocations {
  @Id @GeneratedValue public Integer id;
  
  @ManyToOne public User user;
  
  
}
