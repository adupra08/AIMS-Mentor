import sys
import re

def escape_sql_string(s):
    """Escape single quotes for SQL"""
    if s is None or s == '\\N':
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

# Read the SQL file
with open('CLEAN-RENDER-BACKUP.sql', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all COPY statements and convert to INSERT
lines = content.split('\n')
output_lines = []
i = 0

while i < len(lines):
    line = lines[i]
    
    # Check if this is a COPY statement for one of our problematic tables
    if line.startswith('COPY public.') and any(table in line for table in [
        'academic_pathways', 'achievements', 'graduation_requirements', 
        'opportunities', 'student_profiles', 'todos'
    ]):
        
        # Extract table name and columns
        match = re.match(r'COPY public\.(\w+) \((.*?)\) FROM stdin;', line)
        if match:
            table_name = match.group(1)
            columns = match.group(2)
            
            print(f"Converting {table_name}...", file=sys.stderr)
            
            # Skip the COPY line, we'll add comment instead
            output_lines.append(f"-- Data for {table_name} (converted from COPY to INSERT)")
            
            # Read data lines until \. 
            i += 1
            data_lines = []
            while i < len(lines) and lines[i] != '\\.':
                if lines[i].strip():  # Skip empty lines
                    data_lines.append(lines[i])
                i += 1
            
            # Convert each data line to INSERT
            for data_line in data_lines:
                output_lines.append(f"INSERT INTO {table_name} ({columns}) VALUES ({data_line});")
            
            # Skip the \. line
            if i < len(lines) and lines[i] == '\\.':
                i += 1
            continue
    
    output_lines.append(line)
    i += 1

# Write output
with open('FIXED-RENDER-BACKUP.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print("Conversion complete!", file=sys.stderr)
