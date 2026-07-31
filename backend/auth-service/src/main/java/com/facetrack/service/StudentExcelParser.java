package com.facetrack.service;

import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.facetrack.dto.StudentImportDTO;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentExcelParser {

    public List<StudentImportDTO> parse(MultipartFile file) throws IOException {

        List<StudentImportDTO> students = new ArrayList<>();

        Workbook workbook = WorkbookFactory.create(file.getInputStream());

        Sheet sheet = workbook.getSheetAt(0);

        // Skip header row
        for (int rowIndex = 1; rowIndex <= sheet.getLastRowNum(); rowIndex++) {

            Row row = sheet.getRow(rowIndex);

            if (row == null) {
                continue;
            }

            StudentImportDTO dto = new StudentImportDTO(
            	    getCellValue(row.getCell(0)),
            	    getCellValue(row.getCell(1)),
            	    getCellValue(row.getCell(2)),
            	    getCellValue(row.getCell(3)),
            	    getCellValue(row.getCell(4)),
            	    Long.parseLong(getCellValue(row.getCell(5))),
            	    getCellValue(row.getCell(6)),
            	    getCellValue(row.getCell(7)),
            	    getCellValue(row.getCell(8)),
            	    getCellValue(row.getCell(9)),
            	    Long.parseLong(getCellValue(row.getCell(10)))
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

        return switch (cell.getCellType()) {

            case STRING -> cell.getStringCellValue().trim();

            case NUMERIC -> {

                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                }

                double value = cell.getNumericCellValue();

                if (value == (long) value) {
                    yield String.valueOf((long) value);
                }

                yield String.valueOf(value);
            }

            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());

            case FORMULA -> cell.getCellFormula();

            case BLANK -> "";

            default -> "";
        };
    }
}