package vn.io.naherb;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(InMemoryTokenStoreTestConfig.class)
class NaherbApplicationTests {

	@Test
	void contextLoads() {
	}

}
