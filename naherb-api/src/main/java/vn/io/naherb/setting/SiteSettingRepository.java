package vn.io.naherb.setting;

import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, java.util.UUID> {

    List<SiteSetting> findBySettingKeyIn(Collection<String> settingKeys);
}
