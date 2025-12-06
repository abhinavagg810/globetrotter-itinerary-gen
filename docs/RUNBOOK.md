# Travel App Operations Runbook

## Overview

This runbook provides operational guidance for the Travel App backend infrastructure.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Lovable Cloud   │────▶│   PostgreSQL    │
│   (Frontend)    │     │  (Supabase)      │     │   Database      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │  Edge Functions  │
                        │  - generate-     │
                        │    itinerary     │
                        │  - process-      │
                        │    document-ocr  │
                        └──────────────────┘
                               │
                               ▼
                        ┌──────────────────┐
                        │   Lovable AI     │
                        │   Gateway        │
                        └──────────────────┘
```

## Quick Reference

| Service | Access |
|---------|--------|
| Database | Lovable Cloud Dashboard |
| Edge Functions | Automatically deployed |
| Storage | Lovable Cloud Dashboard |
| Logs | Lovable Cloud Dashboard |

## Common Operations

### 1. Deploying Changes

Edge functions are automatically deployed when code changes are pushed. No manual deployment required.

### 2. Monitoring

#### Check Edge Function Logs

Access via Lovable Cloud Dashboard → Functions → Logs

Common log patterns:
```
[INFO] Processing document {documentId} of type {documentType}
[INFO] Successfully generated itinerary: {tripName}
[ERROR] AI gateway error: {status}
```

#### Database Monitoring

Check Postgres logs for:
- Slow queries
- Connection issues
- RLS policy violations

### 3. Database Operations

#### Viewing Data

Use the Lovable Cloud Dashboard SQL editor or connect via client.

#### Common Queries

```sql
-- Count trips per user
SELECT user_id, COUNT(*) as trip_count 
FROM itineraries 
GROUP BY user_id;

-- Find documents with OCR failures
SELECT * FROM documents 
WHERE ocr_status = 'failed' 
ORDER BY created_at DESC;

-- Calculate expense totals per trip
SELECT 
  i.name,
  SUM(e.amount) as total_expenses,
  COUNT(DISTINCT tp.id) as participant_count
FROM itineraries i
LEFT JOIN expenses e ON e.itinerary_id = i.id
LEFT JOIN trip_participants tp ON tp.itinerary_id = i.id
GROUP BY i.id, i.name;
```

#### Backup/Restore

Lovable Cloud handles automatic backups. For manual exports:

```sql
-- Export itinerary with all related data
SELECT jsonb_build_object(
  'itinerary', row_to_json(i),
  'days', (SELECT jsonb_agg(row_to_json(d)) FROM itinerary_days d WHERE d.itinerary_id = i.id),
  'participants', (SELECT jsonb_agg(row_to_json(p)) FROM trip_participants p WHERE p.itinerary_id = i.id)
) FROM itineraries i WHERE i.id = 'your-itinerary-id';
```

### 4. Troubleshooting

#### Issue: Edge Function Returns 500

1. Check function logs for error details
2. Verify LOVABLE_API_KEY is configured
3. Check if AI gateway is reachable
4. Verify request payload format

**Resolution:**
```typescript
// Add better error logging
console.error("Error details:", {
  message: error.message,
  stack: error.stack,
  payload: requestBody
});
```

#### Issue: OCR Processing Stuck

1. Check document status in database
2. Verify file URL is accessible
3. Check AI gateway rate limits

**Resolution:**
```sql
-- Reset stuck documents
UPDATE documents 
SET ocr_status = 'pending' 
WHERE ocr_status = 'processing' 
AND updated_at < NOW() - INTERVAL '10 minutes';
```

#### Issue: RLS Policy Blocking Access

1. Verify user is authenticated
2. Check if user has proper relationship to resource
3. Review policy conditions

**Debug Query:**
```sql
-- Check user's access
SELECT 
  auth.uid() as current_user,
  i.user_id as owner,
  EXISTS(
    SELECT 1 FROM trip_participants tp 
    WHERE tp.itinerary_id = i.id 
    AND tp.user_id = auth.uid()
  ) as is_participant
FROM itineraries i
WHERE i.id = 'your-itinerary-id';
```

#### Issue: Storage Upload Fails

1. Check file size (max 10MB)
2. Verify MIME type is allowed
3. Check storage bucket RLS policies

**Resolution:**
```sql
-- Verify bucket exists
SELECT * FROM storage.buckets WHERE id = 'trip-documents';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

### 5. Performance Optimization

#### Slow Queries

Add indexes for common query patterns:

```sql
-- Already created in migration, verify:
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('documents', 'expenses', 'activities');
```

#### Edge Function Cold Starts

- Keep functions warm with periodic pings
- Minimize dependencies in edge functions
- Use efficient data structures

### 6. Security Checklist

- [ ] All tables have RLS enabled
- [ ] No sensitive data in client-side code
- [ ] API keys stored as secrets
- [ ] File uploads validated for type/size
- [ ] SQL injection prevented via prepared statements
- [ ] CORS properly configured

### 7. Incident Response

#### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Complete outage | Immediate |
| P2 | Major feature broken | < 1 hour |
| P3 | Minor issue | < 24 hours |
| P4 | Enhancement | Next sprint |

#### Incident Steps

1. **Identify** - What's broken?
2. **Assess** - Impact and severity
3. **Communicate** - Notify stakeholders
4. **Mitigate** - Temporary fix
5. **Resolve** - Permanent fix
6. **Review** - Post-mortem

### 8. Maintenance Windows

- Database maintenance: Handled by Lovable Cloud
- Edge function updates: Automatic on deploy
- Storage cleanup: Weekly automated job recommended

### 9. Capacity Planning

#### Database Size Estimates

| Table | Rows/Trip | Growth Rate |
|-------|-----------|-------------|
| itinerary_days | 5-10 | Linear |
| activities | 20-50 | Linear |
| documents | 5-15 | Linear |
| expenses | 10-30 | Linear |

#### Storage Usage

- Average document: 500KB-2MB
- Estimate 5-10 documents per trip
- Plan for 10-20MB storage per active trip

## Contacts

- **Lovable Support:** support@lovable.dev
- **Documentation:** https://docs.lovable.dev

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-06 | Initial runbook created | System |
