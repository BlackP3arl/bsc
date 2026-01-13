# Database Backup and Restore Instructions

## Backup Files

This directory contains backups of the BSC PostgreSQL database:

1. **bsc_backup_YYYYMMDD_HHMMSS.dump** - Custom format backup (compressed, recommended)
2. **bsc_backup_YYYYMMDD_HHMMSS.sql** - Plain SQL format backup (human-readable)

## Restoring to Production

### Option 1: Using Custom Format Backup (Recommended)

The `.dump` file is in PostgreSQL custom format, which is compressed and allows for flexible restoration.

```bash
# Restore the entire database
pg_restore -h <production-host> -U <username> -d <database-name> -c -v bsc_backup_YYYYMMDD_HHMMSS.dump
```

**Flags explained:**
- `-h <production-host>`: Database host (e.g., localhost, db.example.com)
- `-U <username>`: Database username
- `-d <database-name>`: Target database name
- `-c`: Clean (drop) database objects before recreating
- `-v`: Verbose mode

### Option 2: Using SQL Format Backup

The `.sql` file contains plain SQL statements that can be executed directly.

```bash
# Restore using psql
psql -h <production-host> -U <username> -d <database-name> -f bsc_backup_YYYYMMDD_HHMMSS.sql
```

### Option 3: Create Fresh Database and Restore

If you want to create a completely new database:

```bash
# Create new database
psql -h <production-host> -U <username> -c "CREATE DATABASE bsc_production;"

# Restore using custom format
pg_restore -h <production-host> -U <username> -d bsc_production -v bsc_backup_YYYYMMDD_HHMMSS.dump

# OR restore using SQL format
psql -h <production-host> -U <username> -d bsc_production -f bsc_backup_YYYYMMDD_HHMMSS.sql
```

## Production Setup Steps

### 1. Prepare Production Environment

Ensure PostgreSQL is installed on your production server:

```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# For RHEL/CentOS
sudo yum install postgresql-server postgresql-contrib
```

### 2. Upload Backup File

Transfer the backup file to your production server:

```bash
# Using scp
scp bsc_backup_YYYYMMDD_HHMMSS.dump user@production-server:/path/to/backups/

# Or using rsync
rsync -avz bsc_backup_YYYYMMDD_HHMMSS.dump user@production-server:/path/to/backups/
```

### 3. Configure Production Database

Update your production `.env` file with the production database credentials:

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
```

### 4. Restore Database

Choose one of the restore options above based on your needs.

### 5. Run Prisma Migrations (if needed)

After restoring, ensure Prisma schema is in sync:

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

## Verify Restoration

After restoration, verify the data:

```bash
# Connect to database
psql -h <production-host> -U <username> -d <database-name>

# Check tables
\dt

# Check row counts
SELECT 'perspectives' as table_name, COUNT(*) as rows FROM perspectives
UNION ALL
SELECT 'teams', COUNT(*) FROM teams
UNION ALL
SELECT 'initiatives', COUNT(*) FROM initiatives
UNION ALL
SELECT 'initiative_teams', COUNT(*) FROM initiative_teams
UNION ALL
SELECT 'schedules', COUNT(*) FROM schedules;

# Exit
\q
```

## Database Schema

The database contains the following tables:
- **perspectives** - BSC perspectives (Financial, Customer, Internal Process, Learning & Growth)
- **teams** - Teams working on initiatives
- **initiatives** - Strategic initiatives
- **initiative_teams** - Many-to-many relationship between initiatives and teams
- **schedules** - Timeline information for initiatives

## Backup Schedule Recommendation

For production, set up automated backups:

```bash
# Daily backup cron job (add to crontab)
0 2 * * * pg_dump -h localhost -U username -d bsc_production -F c -f /backups/bsc_backup_$(date +\%Y\%m\%d).dump

# Keep backups for 30 days
0 3 * * * find /backups -name "bsc_backup_*.dump" -mtime +30 -delete
```

## Troubleshooting

### Permission Denied
If you get permission errors, ensure the PostgreSQL user has proper privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE bsc_production TO username;
```

### Connection Issues
Check PostgreSQL is accepting connections:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL configuration
sudo nano /etc/postgresql/*/main/postgresql.conf
# Ensure: listen_addresses = '*'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5
```

### Database Already Exists
If restoring to an existing database with data:
```bash
# Option 1: Drop and recreate
psql -h <host> -U <user> -c "DROP DATABASE IF EXISTS bsc_production;"
psql -h <host> -U <user> -c "CREATE DATABASE bsc_production;"

# Option 2: Use -c flag with pg_restore to clean first
pg_restore -h <host> -U <user> -d bsc_production -c bsc_backup_YYYYMMDD_HHMMSS.dump
```

## Support

For issues or questions, refer to:
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Prisma documentation: https://www.prisma.io/docs/
