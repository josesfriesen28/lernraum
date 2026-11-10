CREATE TRIGGER commands_revision_guard BEFORE INSERT ON commands BEGIN
 SELECT CASE WHEN (SELECT revision FROM workspaces WHERE owner = NEW.owner) != NEW.expected THEN RAISE(ABORT, 'REVISION_CONFLICT') END;
 UPDATE workspaces SET revision = revision + 1 WHERE owner = NEW.owner;
END;
