exports.up = (pgm) => {
  pgm.createTable("contacts", {
    contact_id: { type: "varchar(50)", primaryKey: true },

    customer_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"customers"(customer_id)',
      onDelete: "CASCADE"
    },

    created_by: {
      type: "varchar(50)",  
      references: '"users"(user_id)',
      onDelete: "SET NULL"
    },

    last_contacted: { type: "timestamptz" },
    contact_date: { type: "timestamptz", default: pgm.func("now()") },
    duration_sec: "int",
    outcome: "varchar(20)",
    notes: "text",

    created_at: { type: "timestamptz", default: pgm.func("now()") }
  });

  pgm.createIndex("contacts", "customer_id");
  pgm.createIndex("contacts", "contact_date");
  pgm.createIndex("contacts", "created_by");

  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_customer_last_contact()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE customers
      SET last_contacted = NEW.contact_date
      WHERE customer_id = NEW.customer_id;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER trg_update_last_contacted
    AFTER INSERT ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_last_contact();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER IF EXISTS trg_update_last_contacted ON contacts;`);
  pgm.sql(`DROP FUNCTION IF EXISTS update_customer_last_contact();`);
  pgm.dropTable("contacts");
};
