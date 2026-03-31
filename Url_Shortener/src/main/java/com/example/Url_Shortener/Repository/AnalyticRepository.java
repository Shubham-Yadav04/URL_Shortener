package com.example.Url_Shortener.Repository;

import com.example.Url_Shortener.DTO.RedirectAnalyticDTO;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class AnalyticRepository  {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void batchUpsert(Map<RedirectAnalyticDTO, Long> data) {

        if (data == null || data.isEmpty()) {
            return;
        }

        String sql = """
    INSERT INTO analytic
    (mapping_id, date, country, device, platform, count)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT (mapping_id, date, country, device, platform)
    DO UPDATE SET
   count = analytic.count + EXCLUDED.count
""";

        jdbcTemplate.batchUpdate(
                sql,
                data.entrySet(),
                data.size(),
                (ps, entry) -> {

                    RedirectAnalyticDTO key = entry.getKey();

                    System.out.println(key.getDate());
                    System.out.println(key.getDate().getClass());
                    Long count = entry.getValue();

                    ps.setLong(1, key.getMappingId());
                    ps.setObject(2, key.getDate()); // or use Date.valueOf()
                    ps.setString(3, key.getCountry());
                    ps.setString(4, key.getDevice());
                    ps.setString(5, key.getPlatform());
                    ps.setLong(6, count);
                }
        );
    }
}
