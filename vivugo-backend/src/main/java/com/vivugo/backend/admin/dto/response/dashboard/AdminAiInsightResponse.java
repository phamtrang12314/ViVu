package com.vivugo.backend.admin.dto.response.dashboard;

import java.time.LocalDateTime;
import java.util.List;

public class AdminAiInsightResponse {
    private String aiReport;
    private List<String> highlights;
    private List<String> risks;
    private List<String> recommendations;
    private LocalDateTime generatedAt;

    public AdminAiInsightResponse() {
    }

    public AdminAiInsightResponse(
            String aiReport,
            List<String> highlights,
            List<String> risks,
            List<String> recommendations,
            LocalDateTime generatedAt
    ) {
        this.aiReport = aiReport;
        this.highlights = highlights;
        this.risks = risks;
        this.recommendations = recommendations;
        this.generatedAt = generatedAt;
    }

    public String getAiReport() {
        return aiReport;
    }

    public void setAiReport(String aiReport) {
        this.aiReport = aiReport;
    }

    public List<String> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<String> highlights) {
        this.highlights = highlights;
    }

    public List<String> getRisks() {
        return risks;
    }

    public void setRisks(List<String> risks) {
        this.risks = risks;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }
}
