package com.example.authserver.Domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.*;
import org.springframework.data.web.HateoasPageableHandlerMethodArgumentResolver;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;


@Entity // a row in a table
@Table(name = "User") // table name in db
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable, UserDetails {
    // Class 'User' must either be declared abstract or implement abstract method
    // getAuthorities() isAccountNonExpired() isAccountNonLocked() isCredentialsNonExpired() isEnabled()
    // in 'UserDetails'
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;
    @Column(name = "profile_id")
    private String profile_id;
    @Column(name = "role")
    private String role;

    @Transient
    private final Set<GrantedAuthority> authorities = new HashSet<>();

    @Transient
    private List<String> roles = new ArrayList<>();

    @JsonCreator
    public User(String username, String password, String profile_id, String role) {
        this.username = username;
        this.password = password;
        this.profile_id = profile_id;
        this.role = role;

        authorities.add(new SimpleGrantedAuthority(role));
        roles.add(role);
        // ... add further roles if required. e.g. MANAGER
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
