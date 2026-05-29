package com.vivugo.backend.admin.dto.request;

import lombok.Data;

@Data
public class UserLockRequest {
    private boolean lock;

    public boolean isLock() {
        return lock;
    }

    public void setLock(boolean lock) {
        this.lock = lock;
    }
}