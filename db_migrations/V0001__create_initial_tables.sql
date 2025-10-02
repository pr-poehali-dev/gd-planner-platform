-- Create responsible_persons table
CREATE TABLE IF NOT EXISTS responsible_persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schedule_events table
CREATE TABLE IF NOT EXISTS schedule_events (
    id SERIAL PRIMARY KEY,
    date VARCHAR(10) NOT NULL,
    time_start VARCHAR(5) NOT NULL,
    time_end VARCHAR(5) NOT NULL,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('session', 'committee', 'meeting', 'visit', 'vcs', 'regional-trip', 'other')),
    location VARCHAR(500),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    reminder BOOLEAN DEFAULT FALSE,
    reminder_minutes INTEGER,
    archived BOOLEAN DEFAULT FALSE,
    vcs_link VARCHAR(1000),
    region_name VARCHAR(255),
    responsible_person_id INTEGER REFERENCES responsible_persons(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_date ON schedule_events(date);
CREATE INDEX IF NOT EXISTS idx_schedule_events_status ON schedule_events(status);
CREATE INDEX IF NOT EXISTS idx_schedule_events_archived ON schedule_events(archived);
CREATE INDEX IF NOT EXISTS idx_schedule_events_responsible ON schedule_events(responsible_person_id);

-- Insert default responsible person
INSERT INTO responsible_persons (name, position, phone, email) 
VALUES ('Иванов Иван Иванович', 'Помощник депутата', '+7 (495) 123-45-67', 'ivanov@duma.gov.ru');
