package com.rajroy.mailhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rajroy.mailhub.entity.ImapConfig;

@Repository
public interface ImapConfigRepository extends JpaRepository<ImapConfig, Long> {
  List<ImapConfig> findByUser_Id(Long userId);
}
