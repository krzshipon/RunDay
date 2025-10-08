# Database Backup and Monitoring Guide

## 🛡️ Supabase Database Management

This guide covers essential database management tasks for the RunDay platform.

## 📊 Monitoring Setup

### Database Health Monitoring

**Key Metrics to Monitor:**
- Database connection count
- Query performance and slow queries
- Storage usage and growth
- Table row counts and sizes
- Authentication activity

### Supabase Dashboard Monitoring

1. **Go to Supabase Dashboard** → Your Project
2. **Database Section**:
   - **Overview**: Database size, connections
   - **Tables**: Row counts, sizes
   - **Functions**: Custom functions performance
   - **Extensions**: Active extensions

3. **Auth Section**:
   - **Users**: Total registered users
   - **Logs**: Authentication attempts and errors
   - **Settings**: Auth configuration

4. **Storage Section**:
   - **Buckets**: Certificate storage usage
   - **Files**: Total files and sizes
   - **Policies**: Access control policies

### Performance Monitoring

**Query Performance:**
```sql
-- Check slow queries (run in SQL Editor)
SELECT 
    query,
    calls,
    mean_time,
    max_time,
    total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Database Size Monitoring:**
```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

## 💾 Database Backup Strategy

### Automated Backups

**Supabase Pro Features:**
- Automatic daily backups (Pro plan)
- Point-in-time recovery
- Backup retention policies
- Cross-region backup replication

**Manual Backup Process:**
1. **Database Dump**: Use pg_dump for full backup
2. **Schema Export**: Backup table structures
3. **Data Export**: Export specific table data
4. **Configuration Backup**: Save RLS policies and functions

### Critical Data Tables

**Priority Backup Tables:**
```sql
-- Core application tables (backup priority: HIGH)
- auth.users (User accounts and authentication)
- public.events (All event data)  
- public.registrations (User event registrations)
- public.certificates (Generated certificates)

-- Supporting tables (backup priority: MEDIUM)
- public.user_profiles (Extended user information)
- storage.objects (File storage references)
- storage.buckets (Storage bucket configuration)

-- System tables (backup priority: LOW)  
- Audit logs and analytics data
- Temporary or cache tables
```

### Backup Verification

**Regular Backup Tests:**
1. **Test Restore Process**: Monthly test restores
2. **Data Integrity Check**: Verify backup completeness
3. **Performance Test**: Measure restore times
4. **Documentation Update**: Keep backup procedures current

## 🔒 Security Monitoring

### Database Security

**Access Control:**
- Monitor admin database access
- Review RLS policy effectiveness
- Track suspicious query patterns
- Monitor failed authentication attempts

**Security Checklist:**
```sql
-- Review RLS policies (run monthly)
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check user permissions
SELECT usename, usesuper, usecreatedb, usebypassrls
FROM pg_user;

-- Monitor connection attempts
SELECT * FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY backend_start DESC;
```

### Data Protection

**Compliance Monitoring:**
- User data access logging
- GDPR/privacy compliance
- Data retention policies
- Secure data deletion procedures

## 📈 Growth Planning

### Capacity Planning

**Growth Metrics:**
- User registration rate
- Event creation frequency  
- Certificate generation volume
- Storage usage growth

**Scaling Indicators:**
```sql
-- Monitor growth trends
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as new_users
FROM auth.users
GROUP BY month
ORDER BY month DESC;

SELECT 
    DATE_TRUNC('month', event_date) as month,
    COUNT(*) as events_created
FROM events  
GROUP BY month
ORDER BY month DESC;
```

### Performance Optimization

**Database Optimization:**
- Index performance review
- Query optimization
- Table partitioning (if needed)
- Connection pooling optimization

**Recommended Indexes:**
```sql
-- Ensure these indexes exist for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_date 
ON events(event_date) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_user 
ON registrations(user_id, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_certificates_user_event
ON certificates(user_id, event_id);
```

## 🚨 Incident Response

### Database Issues

**Common Problems:**
1. **Connection Limits**: Monitor concurrent connections
2. **Slow Queries**: Identify and optimize problematic queries
3. **Storage Full**: Monitor disk usage and cleanup
4. **Authentication Issues**: Review auth configuration

**Emergency Procedures:**
1. **Immediate Assessment**: Identify scope of issue
2. **User Communication**: Notify users if needed
3. **Rollback Plan**: Prepare rollback procedures
4. **Recovery Process**: Execute recovery steps
5. **Post-Incident Review**: Document lessons learned

### Monitoring Alerts

**Set up alerts for:**
- Database connection threshold (>80% capacity)
- Slow query detection (>5 second queries)
- Storage usage (>80% capacity)
- Failed authentication spike (>10 failures/minute)
- Certificate generation errors

## 📋 Maintenance Schedule

### Daily Tasks
- Review dashboard metrics
- Check error logs
- Monitor user activity patterns

### Weekly Tasks  
- Analyze query performance
- Review storage usage
- Check backup status
- Update security monitoring

### Monthly Tasks
- Full backup verification
- Security policy review
- Performance optimization
- Capacity planning review

### Quarterly Tasks
- Disaster recovery test
- Security audit
- Documentation update
- Growth planning assessment

---

## 🎯 Quick Reference Commands

### Essential SQL Queries

**User Statistics:**
```sql
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as active_events FROM events WHERE status = 'active';
SELECT COUNT(*) as total_registrations FROM registrations;
```

**Storage Usage:**
```sql
SELECT 
    bucket_id,
    COUNT(*) as file_count,
    SUM(metadata->>'size')::bigint as total_size
FROM storage.objects
GROUP BY bucket_id;
```

**Recent Activity:**
```sql
-- Recent registrations
SELECT * FROM registrations 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Recent certificates  
SELECT * FROM certificates
WHERE generated_at > NOW() - INTERVAL '7 days'
ORDER BY generated_at DESC;
```

---

*Keep your RunDay platform running smoothly! 🚀📊*