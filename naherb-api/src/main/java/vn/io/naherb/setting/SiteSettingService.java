package vn.io.naherb.setting;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteSettingService {

    private final SiteSettingRepository siteSettingRepository;

    /** Lấy tất cả settings, trả về dạng map key -> value */
    @Transactional(readOnly = true)
    public Map<String, String> getAllSettings() {
        return siteSettingRepository.findAll().stream()
                .collect(Collectors.toMap(
                        s -> s.getSettingKey(),
                        s -> s.getSettingValue() != null ? s.getSettingValue() : ""));
    }

    /** Lấy một tập hợp keys cụ thể */
    @Transactional(readOnly = true)
    public Map<String, String> getSettingsByKeys(List<String> keys) {
        return siteSettingRepository.findBySettingKeyIn(keys).stream()
                .collect(Collectors.toMap(
                        s -> s.getSettingKey(),
                        s -> s.getSettingValue() != null ? s.getSettingValue() : ""));
    }

    /** Upsert nhiều settings cùng lúc */
    @Transactional
    public void saveSettings(Map<String, String> updates) {
        List<String> keys = List.copyOf(updates.keySet());
        Map<String, SiteSetting> existing = siteSettingRepository.findBySettingKeyIn(keys)
                .stream()
                .collect(Collectors.toMap(s -> s.getSettingKey(), s -> s));

        for (Map.Entry<String, String> entry : updates.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if (existing.containsKey(key)) {
                existing.get(key).setSettingValue(value);
            } else {
                SiteSetting newSetting = new SiteSetting();
                newSetting.setSettingKey(key);
                newSetting.setSettingValue(value);
                newSetting.setValueType("TEXT");
                siteSettingRepository.save(newSetting);
            }
        }
        // Save updated entities
        siteSettingRepository.saveAll(existing.values());
    }
}
