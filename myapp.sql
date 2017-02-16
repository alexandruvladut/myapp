/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : PostgreSQL
 Source Server Version : 90506
 Source Host           : localhost
 Source Database       : myapp
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90000
 File Encoding         : utf-8

 Date: 02/15/2017 14:51:08 PM
*/

DROP DATABASE IF EXISTS myapp;
CREATE DATABASE myapp;

-- ----------------------------
--  Sequence structure for projects_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "projects_id_seq";
CREATE SEQUENCE "projects_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;

-- ----------------------------
--  Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "users_id_seq";
CREATE SEQUENCE "users_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;

-- ----------------------------
--  Sequence structure for users_projects_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "users_projects_id_seq";
CREATE SEQUENCE "users_projects_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;

-- ----------------------------
--  Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
	"id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
	"username" varchar(50) COLLATE "default",
	"password" varchar(50) COLLATE "default",
	"first_name" varchar(150) COLLATE "default",
	"last_name" varchar(150) COLLATE "default",
	"phone" varchar(20) COLLATE "default",
	"email" varchar(100) COLLATE "default",
	"created" date,
	"updated" date
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for projects
-- ----------------------------
DROP TABLE IF EXISTS "projects";
CREATE TABLE "projects" (
	"id" int4 NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
	"name" varchar(150) COLLATE "default",
	"description" varchar(255) COLLATE "default",
	"status" varchar(20) COLLATE "default",
	"created" date,
	"updated" date
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for users_projects
-- ----------------------------
DROP TABLE IF EXISTS "users_projects";
CREATE TABLE "users_projects" (
	"id" int4 NOT NULL DEFAULT nextval('users_projects_id_seq'::regclass),
	"fk_users" int4,
	"fk_projects" int4
)
WITH (OIDS=FALSE);


-- ----------------------------
--  Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "projects_id_seq" RESTART 2 OWNED BY "projects"."id";
ALTER SEQUENCE "users_id_seq" RESTART 2 OWNED BY "users"."id";
ALTER SEQUENCE "users_projects_id_seq" RESTART 2 OWNED BY "users_projects"."id";
-- ----------------------------
--  Primary key structure for table users
-- ----------------------------
ALTER TABLE "users" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX  "users_id_key" ON "users" USING btree("id" "pg_catalog"."int4_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table projects
-- ----------------------------
ALTER TABLE "projects" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Indexes structure for table projects
-- ----------------------------
CREATE UNIQUE INDEX  "projects_id_key" ON "projects" USING btree("id" "pg_catalog"."int4_ops" ASC NULLS LAST);

-- ----------------------------
--  Primary key structure for table users_projects
-- ----------------------------
ALTER TABLE "users_projects" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table users_projects
-- ----------------------------
ALTER TABLE "users_projects" ADD CONSTRAINT "fk_users" FOREIGN KEY ("fk_users") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "users_projects" ADD CONSTRAINT "fk_projects" FOREIGN KEY ("fk_projects") REFERENCES "projects" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

