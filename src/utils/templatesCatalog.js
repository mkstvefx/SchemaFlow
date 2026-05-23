/* --- SchemaFlow Templates Catalog Database --- */
/* A massive compilation of realistic, complex industry database schemas */

export const TEMPLATES_CATALOG = {
  saas: [
    {
      id: "tbl-users",
      name: "users",
      x: 80,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "password_hash", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "first_name", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "last_name", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "updated_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-workspaces",
      name: "workspaces",
      x: 360,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "slug", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "owner_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-users.id" },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-members",
      name: "workspace_members",
      x: 360,
      y: 320,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "workspace_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-workspaces.id" },
        { name: "user_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-users.id" },
        { name: "role", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "joined_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-subscriptions",
      name: "subscriptions",
      x: 640,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "workspace_id", type: "uuid", pk: false, nn: true, uq: true, fkTarget: "tbl-workspaces.id" },
        { name: "plan_tier", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "stripe_subscription_id", type: "varchar", pk: false, nn: false, uq: true, fkTarget: null },
        { name: "ends_at", type: "timestamp", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "tbl-invoices",
      name: "invoices",
      x: 920,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "subscription_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "tbl-subscriptions.id" },
        { name: "amount", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "currency", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "is_paid", type: "boolean", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "billing_date", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  airbnb: [
    {
      id: "ab-users",
      name: "users",
      x: 80,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "password_hash", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "first_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "last_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "avatar_url", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "phone_number", type: "varchar", pk: false, nn: false, uq: true, fkTarget: null },
        { name: "is_host", type: "boolean", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ab-listings",
      name: "listings",
      x: 360,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "host_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-users.id" },
        { name: "title", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "description", type: "text", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "property_type", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "room_type", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "max_guests", type: "integer", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "bathrooms", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "price_per_night", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "latitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "longitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ab-listing-images",
      name: "listing_images",
      x: 360,
      y: 420,
      columns: [
        { name: "id", type: "serial", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "listing_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-listings.id" },
        { name: "image_url", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "display_order", type: "integer", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ab-bookings",
      name: "bookings",
      x: 640,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "listing_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-listings.id" },
        { name: "guest_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-users.id" },
        { name: "check_in", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "check_out", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "total_price", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ab-reviews",
      name: "reviews",
      x: 920,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "listing_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-listings.id" },
        { name: "reviewer_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ab-users.id" },
        { name: "rating", type: "integer", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "comments", type: "text", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  uber: [
    {
      id: "ub-riders",
      name: "riders",
      x: 80,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "first_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "last_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "phone", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "rating", type: "decimal", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ub-drivers",
      name: "drivers",
      x: 80,
      y: 320,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "first_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "last_name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "phone", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "license_number", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "rating", type: "decimal", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ub-trips",
      name: "trips",
      x: 400,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "rider_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "ub-riders.id" },
        { name: "driver_id", type: "uuid", pk: false, nn: false, uq: false, fkTarget: "ub-drivers.id" },
        { name: "pickup_latitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "pickup_longitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "dropoff_latitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "dropoff_longitude", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "price", type: "decimal", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "started_at", type: "timestamp", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "ended_at", type: "timestamp", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "ub-payments",
      name: "payments",
      x: 720,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "trip_id", type: "uuid", pk: false, nn: true, uq: true, fkTarget: "ub-trips.id" },
        { name: "amount", type: "decimal", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "payment_method", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "completed_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  jira: [
    {
      id: "jr-users",
      name: "users",
      x: 60,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "username", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null }
      ]
    },
    {
      id: "jr-projects",
      name: "projects",
      x: 340,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "key", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "lead_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "jr-users.id" }
      ]
    },
    {
      id: "jr-issues",
      name: "issues",
      x: 620,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "project_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "jr-projects.id" },
        { name: "key", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "summary", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "description", type: "text", pk: false, nn: false, uq: false, fkTarget: null },
        { name: "status", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "priority", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "reporter_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "jr-users.id" },
        { name: "assignee_id", type: "uuid", pk: false, nn: false, uq: false, fkTarget: "jr-users.id" },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "jr-comments",
      name: "comments",
      x: 900,
      y: 120,
      columns: [
        { name: "id", type: "serial", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "issue_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "jr-issues.id" },
        { name: "author_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "jr-users.id" },
        { name: "body", type: "text", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ],
  discord: [
    {
      id: "dc-users",
      name: "users",
      x: 80,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "username", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "discriminator", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "email", type: "varchar", pk: false, nn: true, uq: true, fkTarget: null },
        { name: "avatar_hash", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "dc-guilds",
      name: "guilds",
      x: 360,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "owner_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "dc-users.id" },
        { name: "icon_hash", type: "varchar", pk: false, nn: false, uq: false, fkTarget: null }
      ]
    },
    {
      id: "dc-channels",
      name: "channels",
      x: 640,
      y: 60,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "guild_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "dc-guilds.id" },
        { name: "name", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "type", type: "varchar", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    },
    {
      id: "dc-messages",
      name: "messages",
      x: 920,
      y: 120,
      columns: [
        { name: "id", type: "uuid", pk: true, nn: true, uq: true, fkTarget: null },
        { name: "channel_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "dc-channels.id" },
        { name: "author_id", type: "uuid", pk: false, nn: true, uq: false, fkTarget: "dc-users.id" },
        { name: "content", type: "text", pk: false, nn: true, uq: false, fkTarget: null },
        { name: "created_at", type: "timestamp", pk: false, nn: true, uq: false, fkTarget: null }
      ]
    }
  ]
};
