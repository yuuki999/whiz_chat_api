-- Enable realtime for the messages table
ALTER TABLE messages REPLICA IDENTITY FULL;

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow insert for authenticated users" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow select for all users" 
ON messages FOR SELECT 
TO authenticated 
USING (true);
