package com.facetrack.service;

import com.facetrack.dto.StudentImportDTO;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentExcelParser {

    private final DataFormatter formatter = new DataFormatter();

    public List<StudentImportDTO> parse(MultipartFile file) throws IOException {

        List<StudentImportDTO> students = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        // Skip Header Row (Row 0)
        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {

            Row row = sheet.getRow(rowIndex);

            // Skip null or empty rows
            if (row == null || isRowEmpty(row)) {
                continue;
            }

            String rollNumber = getCellValue(row.getCell(0));

            // Skip rows where Roll Number is empty
            if (rollNumber.isBlank()) {
                continue;
            }

            String instituteCode = getCellValue(row.getCell(5));
            String courseCode = getCellValue(row.getCell(6));

            // Validate mandatory numeric columns
            if (instituteCode.isBlank() || courseCode.isBlank()) {
                System.out.println("Skipping row " + (rowIndex + 1)
                        + " because Institute Code or Course Code is empty.");
                continue;
            }

            StudentImportDTO dto = new StudentImportDTO(
                    rollNumber,                         // Roll Number
                    getCellValue(row.getCell(1)),       // First Name
                    getCellValue(row.getCell(2)),       // Last Name
                    getCellValue(row.getCell(3)),       // Email
                    getCellValue(row.getCell(4)),       // Batch
                    Long.parseLong(courseCode),         // Course Code
                    getCellValue(row.getCell(7)),       // Section
                    getCellValue(row.getCell(8)),       // Parent Name
                    getCellValue(row.getCell(9)),       // Parent Mobile
                    getCellValue(row.getCell(10)),      // Parent Email
                    Long.parseLong(instituteCode)       // Institute Code
            );

            students.add(dto);
        }

        workbook.close();

        return students;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        return formatter.formatCellValue(cell).trim();
    }

    private boolean isRowEmpty(Row row) {

        for (int i = 0; i < row.getLastCellNum(); i++) {

            Cell cell = row.getCell(i);

            if (cell != null) {
                String value = formatter.formatCellValue(cell).trim();

                if (!value.isEmpty()) {
                    return false;
                }
            }
        }

        return true;
    }
}