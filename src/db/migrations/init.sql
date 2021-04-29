-- Migrations
CREATE TABLE IF NOT EXISTS migrations (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	hash TEXT NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Images 
CREATE TABLE IF NOT EXISTS images (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	data TEXT NOT NULL,
	metadata TEXT NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL
);

CREATE TRIGGER image_updated
AFTER UPDATE ON images
BEGIN
	UPDATE images SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Operations
CREATE TABLE IF NOT EXISTS operations (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	data TEXT NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL
);

CREATE TRIGGER operation_updated
AFTER UPDATE ON operations
BEGIN
	UPDATE operations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Blueprints
CREATE TABLE IF NOT EXISTS blueprints (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	data TEXT NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL
);

CREATE TRIGGER blueprint_updated
AFTER UPDATE ON blueprints
BEGIN
	UPDATE blueprints SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Image operations
CREATE TABLE IF NOT EXISTS image_operations (
	id INTEGER PRIMARY KEY,
	operation_id INTEGER NOT NULL,
	image_id INTEGER NOT NULL,
	blueprint_id INTEGER,
	input_data TEXT NOT NULL,
	output_data TEXT NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL,

	FOREIGN KEY (operation_id) REFERENCES operations(id),
	FOREIGN KEY (image_id) REFERENCES images(id),
	FOREIGN KEY (blueprint_id) REFERENCES blueprints(id)
);

CREATE TRIGGER image_operation_updated
AFTER UPDATE ON image_operations
BEGIN
	UPDATE image_operations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;