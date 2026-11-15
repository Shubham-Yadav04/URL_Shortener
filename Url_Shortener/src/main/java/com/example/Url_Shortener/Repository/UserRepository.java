package com.example.Url_Shortener.Repository;


import com.example.Url_Shortener.Modal.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, String > {
    Optional<User> findFirstByEmailIgnoreCaseOrderByUserIdAsc(String email);

    Optional<User> findFirstByEmailIgnoreCaseAndPasswordIsNotNullOrderByUserIdAsc(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndUserIdNot(String email, String userId);

    default Optional<User> findCanonicalByEmail(String email) {
        return findFirstByEmailIgnoreCaseAndPasswordIsNotNullOrderByUserIdAsc(email)
                .or(() -> findFirstByEmailIgnoreCaseOrderByUserIdAsc(email));
    }
}
