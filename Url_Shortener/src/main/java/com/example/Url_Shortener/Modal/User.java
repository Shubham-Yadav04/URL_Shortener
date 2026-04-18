package com.example.Url_Shortener.Modal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Customers")
public class User {
@Id
@GeneratedValue(strategy = GenerationType.UUID)
    private String userId;
    private String username;
    private String email;
    @Nullable
    private String password;
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL ,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<UrlMapping> mappedUrl= new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> providers= new HashSet<>();
}
