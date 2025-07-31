CREATE TABLE "tree_nodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" integer NOT NULL,
	"left_id" uuid,
	"right_id" uuid,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traversal_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"node_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"traversal_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tree_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"operation" varchar(50) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tree_nodes" ADD CONSTRAINT "tree_nodes_left_id_tree_nodes_id_fk" FOREIGN KEY ("left_id") REFERENCES "public"."tree_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tree_nodes" ADD CONSTRAINT "tree_nodes_right_id_tree_nodes_id_fk" FOREIGN KEY ("right_id") REFERENCES "public"."tree_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tree_nodes" ADD CONSTRAINT "tree_nodes_parent_id_tree_nodes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tree_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traversal_steps" ADD CONSTRAINT "traversal_steps_node_id_tree_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."tree_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tree_snapshots" ADD CONSTRAINT "tree_snapshots_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trees" ADD CONSTRAINT "trees_root_id_tree_nodes_id_fk" FOREIGN KEY ("root_id") REFERENCES "public"."tree_nodes"("id") ON DELETE no action ON UPDATE no action;