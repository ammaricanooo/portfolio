-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "tech" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '#',
    "year" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "img" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "year" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "desc" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "educationId" TEXT NOT NULL,
    CONSTRAINT "Branch_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "Education" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
