package vn.io.naherb.chatbot.retrieval;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProductTextMatcherTest {

    @Test
    void containsTokenDoesNotMatchSubstringInsideWord() {
        assertThat(ProductTextMatcher.containsToken("ao choang chu u", "co")).isFalse();
    }

    @Test
    void containsTokenMatchesWholeWord() {
        assertThat(ProductTextMatcher.containsToken("ho tro vung co vai", "co")).isTrue();
    }
}
