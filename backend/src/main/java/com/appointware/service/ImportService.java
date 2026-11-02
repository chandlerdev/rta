package com.appointware.service;

import com.appointware.common.ApiException;
import com.appointware.entity.AccountsAppointment;
import com.appointware.entity.AccountsPatient;
import com.appointware.repository.AccountsAppointmentRepository;
import com.appointware.repository.AccountsDoctorRepository;
import com.appointware.repository.AccountsPatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Mirrors import_file_patient_new_temp / _dynamic in PHP.
 * Expects columns: firstName, lastName, region, phone, email, date, fromTime, todTime, doctorId
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImportService {

    private final AccountsPatientRepository patientRepo;
    private final AccountsAppointmentRepository appointmentRepo;
    private final AccountsDoctorRepository doctorRepo;

    private static final Pattern DATE_DASH = Pattern.compile("^\\d{2}-\\d{2}-\\d{4}$");
    private static final Pattern TIME_HMS = Pattern.compile("^\\d{2}:\\d{2}(:\\d{2})?$");

    @Transactional
    public Map<String, Object> importStatic(MultipartFile file) {
        return importInternal(file, false);
    }

    @Transactional
    public Map<String, Object> importDynamic(MultipartFile file) {
        return importInternal(file, true);
    }

    private Map<String, Object> importInternal(MultipartFile file, boolean dynamic) {
        if (file == null || file.isEmpty()) throw ApiException.badRequest("Please give file");

        Map<String, Object> result = new HashMap<>();
        List<Integer> dateIssueLine = new ArrayList<>();
        List<Integer> timeIssueLine = new ArrayList<>();
        List<Integer> doctorIssueLine = new ArrayList<>();
        List<String> issuesTimes = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook wb = new XSSFWorkbook(is)) {
            Sheet sheet = wb.getSheetAt(0);
            int row = 1; // skip header
            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row line = sheet.getRow(r);
                if (line == null) continue;
                String firstName = str(line.getCell(0));
                if (firstName == null || firstName.isBlank()) continue;
                int currentRow = r + 1;

                String lastName = str(line.getCell(1));
                String region = str(line.getCell(2));
                String phoneRaw = str(line.getCell(3));
                String email = str(line.getCell(4));
                String date = strReplaceSlashDot(str(line.getCell(5)));
                String fromTime = str(line.getCell(6));
                String todTime = str(line.getCell(7));
                String doctorIdStr = str(line.getCell(8));

                if (date == null || !DATE_DASH.matcher(date).matches()) dateIssueLine.add(currentRow);
                if (fromTime == null || !TIME_HMS.matcher(fromTime).matches()) timeIssueLine.add(currentRow);
                Integer doctorId = null;
                try {
                    doctorId = Integer.valueOf(doctorIdStr);
                    if (doctorRepo.findById(doctorId).isEmpty()) doctorIssueLine.add(currentRow);
                } catch (Exception e) {
                    doctorIssueLine.add(currentRow);
                }
            }

            if (!dateIssueLine.isEmpty() || !timeIssueLine.isEmpty() || !doctorIssueLine.isEmpty()) {
                result.put("msg", "Issues in date and time");
                result.put("date_issue_line", dateIssueLine);
                result.put("time_issue_line", timeIssueLine);
                result.put("doctor_id_issue_line", doctorIssueLine);
                return result;
            }

            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row line = sheet.getRow(r);
                if (line == null) continue;
                String firstName = str(line.getCell(0));
                if (firstName == null || firstName.isBlank()) continue;
                String lastName = str(line.getCell(1));
                String region = str(line.getCell(2));
                String phoneRaw = str(line.getCell(3));
                String email = str(line.getCell(4));
                String date = strReplaceSlashDot(str(line.getCell(5)));
                String fromTime = str(line.getCell(6));
                String todTime = str(line.getCell(7));
                Integer doctorId = Integer.valueOf(str(line.getCell(8)));
                String phone = "+" + region + phoneRaw;

                if (!appointmentRepo.findByDocIdIdAndDateAndFromTime(doctorId, date, fromTime).isEmpty()
                        || !appointmentRepo.findOverlapping(doctorId, date, fromTime).isEmpty()) {
                    issuesTimes.add(fromTime);
                    continue;
                }
                AccountsPatient p = AccountsPatient.builder()
                        .firstName(firstName).lastName(lastName).phone(phone).email(email)
                        .age("").gender("").purpose("").build();
                p = patientRepo.save(p);
                AccountsAppointment a = AccountsAppointment.builder()
                        .date(date).fromTime(fromTime).todTime(todTime).toTime("")
                        .isCompleted(0).delay(dynamic ? "00:00:00" : "00:10:00")
                        .docIdId(doctorId).patientIdId(p.getId()).cusDate(toCusDate(date))
                        .appointmentType(dynamic ? "Dynamic" : "Static")
                        .build();
                appointmentRepo.save(a);
            }
            result.put("msg", "Successfully Imported");
            result.put("time_issues", issuesTimes);
            return result;
        } catch (Exception e) {
            log.error("Import failed", e);
            throw ApiException.badRequest("Import failed: " + e.getMessage());
        }
    }

    private static String str(Cell c) {
        if (c == null) return null;
        try {
            return switch (c.getCellType()) {
                case STRING -> c.getStringCellValue().trim();
                case NUMERIC -> {
                    double v = c.getNumericCellValue();
                    if (v == Math.floor(v)) yield String.valueOf((long) v);
                    yield String.valueOf(v);
                }
                case BOOLEAN -> String.valueOf(c.getBooleanCellValue());
                default -> c.toString().trim();
            };
        } catch (Exception e) {
            return null;
        }
    }

    private static String strReplaceSlashDot(String s) {
        return s == null ? null : s.replace("/", "-").replace(".", "-");
    }

    private static String toCusDate(String mmddyyyy) {
        String[] parts = mmddyyyy.split("-");
        return parts[2] + "-" + parts[0] + "-" + parts[1];
    }
}
