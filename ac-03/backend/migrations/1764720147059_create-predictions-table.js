exports.up = (pgm) => {
  pgm.createTable("predictions", {
    prediction_id: { type: "varchar(50)", primaryKey: true },

    customer_id: {
      type: "varchar(50)",
      references: '"customers"(customer_id)',
      onDelete: "CASCADE"
    },

    probability: { type: "numeric(5,4)", notNull: true },

    created_at: { type: "timestamptz", default: pgm.func("now()") }
  });

  pgm.createIndex("predictions", "customer_id");
};

exports.down = (pgm) => {
  pgm.dropTable("predictions");
};
