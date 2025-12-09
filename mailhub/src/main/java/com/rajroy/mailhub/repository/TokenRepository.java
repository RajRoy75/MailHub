package com.rajroy.mailhub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.rajroy.mailhub.entity.Token;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

  @Query("""
      select t from Token t inner join User u on t.user.id = u.id
      where u.id = :userId and (t.expired = false and t.revoked = false)
      """)
  List<Token> findAllValidTokenByUserId(long userId);

  Optional<Token> findByToken(String token);
}
