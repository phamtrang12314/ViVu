package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChatMessage;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AiProviderClientTest {

    @Test
    void returnsFallbackWhenApiKeyIsMissing() {
        AiProviderClient client = new AiProviderClient(
                "",
                "openai/gpt-5.4-mini",
                "openai/gpt-5.5",
                "https://openrouter.ai/api/v1/chat/completions"
        );

        String fallback = "fallback-message";
        String result = client.callCustomerChat(
                "system",
                List.of(new ChatMessage("user", "xin chao")),
                fallback
        );

        assertEquals(fallback, result);
    }
}
