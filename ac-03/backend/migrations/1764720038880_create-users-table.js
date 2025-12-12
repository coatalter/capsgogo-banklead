exports.up = (pgm) => {
  pgm.createTable("users", {
    user_id: {
      type: "varchar(50)",
      notNull: true,
      primaryKey: true
    },
    name: { type: "varchar(150)", notNull: true },
    email: { type: "varchar(255)", notNull: true, unique: true },
    password_hash: { type: "text", notNull: true },
    role: { type: "varchar(20)", notNull: true },
    deleted_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", default: pgm.func("now()") },
    updated_at: { type: "timestamptz" }   
  });

  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('superadmin','sales')"
  });

  pgm.createIndex("users", "email", { unique: true });

  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER IF EXISTS update_users_timestamp ON users;`);
  pgm.dropTable("users");
};
