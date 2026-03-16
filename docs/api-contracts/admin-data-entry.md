# Admin Data Entry Contract

This contract is defined up front so the Phase 0 admin interface can be built against a stable backend expectation later.

## Primary Resources

- `banks`
- `reporting_periods`
- `financial_statement_line_items`
- `camel_ratio_inputs`
- `data_vintages`

## Expected Endpoints

### `GET /api/admin/banks`

Returns the available bank records for data entry selection.

### `POST /api/admin/banks/:bankId/reporting-periods`

Creates or updates a reporting period entry for a selected bank.

Request shape:

```json
{
  "periodEnd": "2025-12-31",
  "periodType": "annual",
  "auditStatus": "audited",
  "sourceLabel": "2025 Annual Report",
  "sourceUrl": "https://example.com/report.pdf"
}
```

### `POST /api/admin/banks/:bankId/financial-statements`

Accepts normalized statement rows for balance sheet, income statement, and cash flow data.

### `POST /api/admin/banks/:bankId/camel-inputs`

Accepts raw values used to compute CAMEL ratios, not just the finished ratios.

### `GET /api/admin/banks/:bankId/vintages`

Returns all historical vintages for a bank and reporting period.

## Frontend Expectations

- Every write response returns the persisted record and its vintage metadata.
- Every financial row includes `sourceLabel`, `reportingPeriod`, and `auditStatus`.
- Validation errors are field-specific and machine-readable.

## Error Cases

- `400 Bad Request`: missing required fields or invalid period/audit values
- `409 Conflict`: duplicate vintage or conflicting reporting period
- `422 Unprocessable Entity`: financial statement rows fail business validation
- `500 Internal Server Error`: unexpected persistence failure
