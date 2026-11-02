package com.appointware.dto.request;

import lombok.Data;

@Data
public class OperationCompleteRequest {
    private Integer id;
    private String completedTime;
    private String attenderContent;
    private String phone;
}
