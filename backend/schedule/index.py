"""
Business: API для управления графиком работы депутата
Args: event - словарь с httpMethod, body, queryStringParameters, headers
      context - объект с атрибутами request_id, function_name
Returns: HTTP ответ с данными событий или ответственных лиц
"""

import json
import os
import psycopg2
from typing import Dict, Any, List, Optional

def get_db_connection():
    """Создание подключения к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        path = event.get('requestContext', {}).get('http', {}).get('path', '')
        
        # GET /schedule/events - получить все события
        if method == 'GET' and 'events' in path:
            cur.execute('''
                SELECT id, date, time_start, time_end, title, type, location, 
                       description, status, reminder, reminder_minutes, archived, 
                       vcs_link, region_name, responsible_person_id
                FROM schedule_events
                ORDER BY date DESC, time_start ASC
            ''')
            
            rows = cur.fetchall()
            events = []
            for row in rows:
                events.append({
                    'id': row[0],
                    'date': row[1],
                    'timeStart': row[2],
                    'timeEnd': row[3],
                    'title': row[4],
                    'type': row[5],
                    'location': row[6] or '',
                    'description': row[7] or '',
                    'status': row[8],
                    'reminder': row[9] or False,
                    'reminderMinutes': row[10],
                    'archived': row[11] or False,
                    'vcsLink': row[12] or '',
                    'regionName': row[13] or '',
                    'responsiblePersonId': row[14]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'events': events})
            }
        
        # GET /schedule/persons - получить всех ответственных
        elif method == 'GET' and 'persons' in path:
            cur.execute('''
                SELECT id, name, position, phone, email
                FROM responsible_persons
                ORDER BY name ASC
            ''')
            
            rows = cur.fetchall()
            persons = []
            for row in rows:
                persons.append({
                    'id': row[0],
                    'name': row[1],
                    'position': row[2],
                    'phone': row[3] or '',
                    'email': row[4] or ''
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'persons': persons})
            }
        
        # POST /schedule/events - создать событие
        elif method == 'POST' and 'events' in path:
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO schedule_events (
                    date, time_start, time_end, title, type, location, 
                    description, status, reminder, reminder_minutes, archived,
                    vcs_link, region_name, responsible_person_id
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body.get('date'),
                body.get('timeStart'),
                body.get('timeEnd'),
                body.get('title'),
                body.get('type'),
                body.get('location', ''),
                body.get('description', ''),
                body.get('status', 'scheduled'),
                body.get('reminder', False),
                body.get('reminderMinutes'),
                body.get('archived', False),
                body.get('vcsLink', ''),
                body.get('regionName', ''),
                body.get('responsiblePersonId')
            ))
            
            event_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'id': event_id, 'message': 'Event created'})
            }
        
        # PUT /schedule/events - обновить событие
        elif method == 'PUT' and 'events' in path:
            body = json.loads(event.get('body', '{}'))
            event_id = body.get('id')
            
            cur.execute('''
                UPDATE schedule_events SET
                    date = %s, time_start = %s, time_end = %s, title = %s,
                    type = %s, location = %s, description = %s, status = %s,
                    reminder = %s, reminder_minutes = %s, archived = %s,
                    vcs_link = %s, region_name = %s, responsible_person_id = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (
                body.get('date'),
                body.get('timeStart'),
                body.get('timeEnd'),
                body.get('title'),
                body.get('type'),
                body.get('location', ''),
                body.get('description', ''),
                body.get('status'),
                body.get('reminder', False),
                body.get('reminderMinutes'),
                body.get('archived', False),
                body.get('vcsLink', ''),
                body.get('regionName', ''),
                body.get('responsiblePersonId'),
                event_id
            ))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Event updated'})
            }
        
        # DELETE /schedule/events/{id} - удалить событие
        elif method == 'DELETE' and 'events' in path:
            params = event.get('queryStringParameters', {})
            event_id = params.get('id')
            
            cur.execute('DELETE FROM schedule_events WHERE id = %s', (event_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Event deleted'})
            }
        
        # POST /schedule/persons - создать ответственное лицо
        elif method == 'POST' and 'persons' in path:
            body = json.loads(event.get('body', '{}'))
            
            cur.execute('''
                INSERT INTO responsible_persons (name, position, phone, email)
                VALUES (%s, %s, %s, %s)
                RETURNING id
            ''', (
                body.get('name'),
                body.get('position'),
                body.get('phone', ''),
                body.get('email', '')
            ))
            
            person_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'id': person_id, 'message': 'Person created'})
            }
        
        # DELETE /schedule/persons/{id} - удалить ответственное лицо
        elif method == 'DELETE' and 'persons' in path:
            params = event.get('queryStringParameters', {})
            person_id = params.get('id')
            
            cur.execute('DELETE FROM responsible_persons WHERE id = %s', (person_id,))
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'Person deleted'})
            }
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': headers,
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
