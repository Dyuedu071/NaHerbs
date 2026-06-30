-- Align chatbot_messages with JPA entity (content field -> message_text column)
-- Run once in Supabase SQL Editor if inserts fail with message_text NOT NULL.

-- Copy data from Hibernate-added "content" column if present
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'naherb'
          AND table_name = 'chatbot_messages'
          AND column_name = 'content'
    ) THEN
        EXECUTE '
            UPDATE naherb.chatbot_messages
            SET message_text = content
            WHERE message_text IS NULL AND content IS NOT NULL
        ';
        ALTER TABLE naherb.chatbot_messages DROP COLUMN content;
    END IF;
END $$;

-- Ensure message_text exists and is required
ALTER TABLE naherb.chatbot_messages
    ALTER COLUMN message_text SET NOT NULL;
