package com.appointware.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Mirrors the PHP envelope {code, status, data} used everywhere in
 * dynamicapi.php so frontend clients keep parsing the same shape.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int code;
    private int status;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(1, 200, data);
    }

    public static <T> ApiResponse<List<T>> successList(List<T> data) {
        return new ApiResponse<>(1, 200, data);
    }

    public static <T> ApiResponse<T> error(int httpStatus, T data) {
        return new ApiResponse<>(0, httpStatus, data);
    }

    public static ApiResponse<List<Message>> message(int code, int status, String msg) {
        return new ApiResponse<>(code, status, List.of(new Message(msg)));
    }

    public static ApiResponse<List<Message>> errMessage(int status, String errmsg) {
        return new ApiResponse<>(0, status, List.of(Message.err(errmsg)));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Message {
        private String msg;
        private String errmsg;

        public Message(String msg) { this.msg = msg; }
        public static Message err(String errmsg) {
            Message m = new Message();
            m.errmsg = errmsg;
            return m;
        }
    }
}
