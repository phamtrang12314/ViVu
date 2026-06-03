package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChatMessage;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AiProviderClient {

    private static final int MAX_ATTEMPTS = 3;

    private final String apiKey;
    private final String chatModel;
    private final String adminModel;
    private final String apiUrl;
    private final RestTemplate restTemplate;

    public AiProviderClient(
            @Value("${ai.api.key:}") String apiKey,
            @Value("${ai.model:openai/gpt-5.4-mini}") String chatModel,
            @Value("${ai.admin.model:openai/gpt-5.5}") String adminModel,
            @Value("${ai.api.url:https://openrouter.ai/api/v1/chat/completions}") String apiUrl
    ) {
        this.apiKey = apiKey;
        this.chatModel = chatModel;
        this.adminModel = adminModel;
        this.apiUrl = apiUrl;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(9000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String callCustomerChat(String systemInstruction, List<ChatMessage> messages, String fallback) {
        return call(chatModel, systemInstruction, messages, 0.35, fallback);
    }

    public String callAdminAnalysis(String systemInstruction, String prompt, String fallback) {
        return call(adminModel, systemInstruction, List.of(new ChatMessage("user", prompt)), 0.2, fallback);
    }

    private String call(String model, String systemInstruction, List<ChatMessage> messages, double temperature, String fallback) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("your_openrouter_api_key")) {
            return fallback;
        }

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(apiKey);

                List<Map<String, String>> finalMessages = new ArrayList<>();
                finalMessages.add(Map.of("role", "system", "content", systemInstruction));

                int start = Math.max(0, messages.size() - 10);
                for (ChatMessage msg : messages.subList(start, messages.size())) {
                    if (msg.getContent() == null || msg.getContent().isBlank()) {
                        continue;
                    }
                    String role = "assistant".equals(msg.getRole()) ? "assistant" : "user";
                    finalMessages.add(Map.of("role", role, "content", msg.getContent()));
                }

                Map<String, Object> body = new HashMap<>();
                body.put("model", model);
                body.put("messages", finalMessages);
                body.put("temperature", temperature);

                ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, new HttpEntity<>(body, headers), Map.class);
                if (response.getBody() == null || !response.getBody().containsKey("choices")) {
                    return fallback;
                }

                Object choicesObject = response.getBody().get("choices");
                if (!(choicesObject instanceof List<?> choices) || choices.isEmpty()) {
                    return fallback;
                }

                Object firstChoice = choices.get(0);
                if (!(firstChoice instanceof Map<?, ?> choiceMap)) {
                    return fallback;
                }

                Object messageObject = choiceMap.get("message");
                if (!(messageObject instanceof Map<?, ?> messageMap)) {
                    return fallback;
                }

                Object content = messageMap.get("content");
                return content instanceof String text && !text.isBlank() ? text : fallback;
            } catch (Exception e) {
                if (attempt >= MAX_ATTEMPTS) {
                    System.err.println("AI provider call failed after retries: " + e.getMessage());
                    return fallback;
                }
                sleepBeforeRetry(attempt);
            }
        }
        return fallback;
    }

    private void sleepBeforeRetry(int attempt) {
        long delayMs = 1000L + (attempt - 1) * 1000L;
        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException interruptedException) {
            Thread.currentThread().interrupt();
        }
    }
}
