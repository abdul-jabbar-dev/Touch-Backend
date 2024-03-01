-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userInfos" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profileImg" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "bio" TEXT,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "userInfos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "userInfos_profileImg_key" ON "userInfos"("profileImg");

-- CreateIndex
CREATE UNIQUE INDEX "userInfos_coverImg_key" ON "userInfos"("coverImg");

-- CreateIndex
CREATE UNIQUE INDEX "userInfos_phoneNumber_key" ON "userInfos"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "userInfos_usersId_key" ON "userInfos"("usersId");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_usersId_key" ON "credentials"("usersId");

-- AddForeignKey
ALTER TABLE "userInfos" ADD CONSTRAINT "userInfos_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
