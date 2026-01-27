-- Enable UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
