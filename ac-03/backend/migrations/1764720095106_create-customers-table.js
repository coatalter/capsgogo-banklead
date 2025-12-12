exports.up = (pgm) => {
  pgm.createTable("customers", {
    customer_id: {
      type: "varchar(50)",
      notNull: true,
      primaryKey: true
    },
    name: { type: "varchar(200)", notNull: true },
    phone: { type: "varchar(30)" },
    age: { type: "int" },
    job: { type: "varchar(100)" },
    marital: { type: "varchar(50)" },
    education: { type: "varchar(100)" },
    housing: { type: "text" },
    loan: { type: "boolean" },
    status: { type: "text", notNull: true, default: "new" },

    notes: { type: "text" },
    created_at: { type: "timestamptz", default: pgm.func("now()") },
    updated_at: { type: "timestamptz" } 
  });

  pgm.addConstraint("customers", "customers_status_check", {
    check: "status IN ('new','closing','failed')"
  });

  pgm.createIndex("customers", "phone", { unique: true });

  pgm.createIndex("customers", "name");
  pgm.createIndex("customers", "status");
  pgm.createIndex("customers", "last_contacted");

  // Trigger untuk tabel customers
  pgm.sql(`
    CREATE TRIGGER update_customers_timestamp
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER IF EXISTS update_customers_timestamp ON customers;`);
  pgm.dropTable("customers");
};
