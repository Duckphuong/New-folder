CREATE DATABASE SE_Assignment
GO
USE SE_Assignment
GO

-- USERS
CREATE TABLE Users (
    id       INT IDENTITY(1,1)       NOT NULL,
    name     NVARCHAR(100)           NOT NULL,
    email    NVARCHAR(100)           NOT NULL UNIQUE,
    password NVARCHAR(255)           NOT NULL,
    role     NVARCHAR(50)            NOT NULL,
    CCCD     CHAR(12)                PRIMARY KEY,
    FName    VARCHAR(15)             NOT NULL,
    LName    VARCHAR(15)             NOT NULL,
    BDate    DATE                    NOT NULL
);

-- NGUOI MUON
CREATE TABLE NGUOI_MUON (
    CCCD            CHAR(12)        PRIMARY KEY,
	Major           VARCHAR(30)     NOT NULL,
	StartYear       INT             NOT NULL,
    Graduate_year   INT             NOT NULL,
    CONSTRAINT FK_cccd_sv FOREIGN KEY(CCCD) REFERENCES Users(CCCD)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- NGUOI QUAN LY
CREATE TABLE NGUOI_QUAN_LY (
    CCCD            CHAR(12)        PRIMARY KEY,
    CONSTRAINT FK_cccd_ql FOREIGN KEY(CCCD) REFERENCES Users(CCCD)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- PHONG HOC
CREATE TABLE PHONG_HOC (
    RoomIDNum           INT         IDENTITY(1,1),
    RoomID              AS ('ROOM' + RIGHT('0000' + CAST(RoomIDNum AS VARCHAR(4)), 4)) PERSISTED,
    CCCD                CHAR(12),
    CONSTRAINT PK_RoomID PRIMARY KEY (RoomID),
	CONSTRAINT FK_Room_CCCD FOREIGN KEY (CCCD) REFERENCES NGUOI_QUAN_LY(CCCD)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);

CREATE TABLE PHONG_HOC_NHOM (
    RoomID              VARCHAR(8)     PRIMARY KEY,  
    RoomName            VARCHAR(6)     UNIQUE NOT NULL, 
	TimeLimit           INT             NOT NULL CHECK (TimeLimit > 0),
    RoomCapacity        INT            NOT NULL CHECK (RoomCapacity > 0 AND RoomCapacity <= 10),
    CONSTRAINT FK_Group_RoomID FOREIGN KEY (RoomID) REFERENCES PHONG_HOC(RoomID)
    ON UPDATE CASCADE
    ON DELETE CASCADE 
);

CREATE TABLE PHONG_THUYET_TRINH (
    RoomID              VARCHAR(8)     PRIMARY KEY,  
    RoomName            VARCHAR(6)     UNIQUE NOT NULL,  
	TimeLimit           INT             NOT NULL CHECK (TimeLimit > 0),
    RoomCapacity        INT            NOT NULL CHECK (RoomCapacity > 0 AND RoomCapacity <= 50),
    CONSTRAINT FK_Presentation_RoomID FOREIGN KEY (RoomID) REFERENCES PHONG_HOC(RoomID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE PHONG_HOC_CA_NHAN (
    RoomID              VARCHAR(8)      PRIMARY KEY,   
    RoomName            VARCHAR(6)      UNIQUE NOT NULL,  
    TimeLimit           INT             NOT NULL CHECK (TimeLimit > 0),
    CONSTRAINT FK_Private_RoomID FOREIGN KEY (RoomID) REFERENCES PHONG_HOC(RoomID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);


-------------PHIEU MUON--------------------------------
CREATE TABLE PHIEU_MUON (
    TicketIDNum             INT             IDENTITY(1,1),
    TicketID                AS ('TICKET' + RIGHT('0000' + CAST(TicketIDNum AS VARCHAR(4)), 4)) PERSISTED,
    RoomID                  VARCHAR(8),
    Borrowed_Date           DATE            NOT NULL,
    Borrowed_Time           TIME            NOT NULL,
    Duration                INT             NOT NULL CHECK (Duration <= 300), 
    Expected_Return_Time AS DATEADD(MINUTE, Duration, Borrowed_Time) PERSISTED,
    Actual_Return_Time      TIME,
    TicketStatus VARCHAR(15) CHECK (TicketStatus IN ('CANCEL', 'LATE', 'PENDING','PAID')) NOT NULL,
    CCCD                    CHAR(12)		NOT NULL,      
    CONSTRAINT PK_TicketID       PRIMARY KEY (TicketID),
	CONSTRAINT FK_Ticket_CCCD FOREIGN KEY (CCCD) REFERENCES Users(CCCD),
    CONSTRAINT FK_Roomid         FOREIGN KEY (RoomID) REFERENCES PHONG_HOC(RoomID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);



--------------------------------------------------------------------------------------------------------------
GO

CREATE TRIGGER trg_InsertNguoiMuon
ON Users
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -----------------------
    -- XÓA VAI TRÒ CŨ NẾU ĐỔI ROLE
    -----------------------
    DELETE FROM dbo.NGUOI_MUON
    WHERE CCCD IN (
        SELECT i.CCCD
        FROM inserted i
        JOIN deleted d ON i.CCCD = d.CCCD
        WHERE d.Role = 'Student' AND i.Role <> 'Student'
    );

    DELETE FROM dbo.NGUOI_QUAN_LY
    WHERE CCCD IN (
        SELECT i.CCCD
        FROM inserted i
        JOIN deleted d ON i.CCCD = d.CCCD
        WHERE d.Role = 'Admin' AND i.Role <> 'Admin'
    );

    -----------------------
    -- THÊM VAI TRÒ MỚI
    -----------------------
    -- Nếu là Student -> thêm vào NGUOI_MUON
    INSERT INTO dbo.NGUOI_MUON (CCCD, Major, StartYear, Graduate_year)
    SELECT i.CCCD, 'KHMT', 2023, 2027
    FROM inserted i
    WHERE i.Role = 'Student'
          AND NOT EXISTS (SELECT 1 FROM dbo.NGUOI_MUON WHERE CCCD = i.CCCD);

    -- Nếu là Admin -> thêm vào NGUOI_QUAN_LY
    INSERT INTO dbo.NGUOI_QUAN_LY (CCCD)
    SELECT i.CCCD
    FROM inserted i
    WHERE i.Role = 'Admin'
          AND NOT EXISTS (SELECT 1 FROM dbo.NGUOI_QUAN_LY WHERE CCCD = i.CCCD);
END;
-----------------------------------------------------------------------------------------------------------
GO

CREATE PROCEDURE sp_ThongTinChiTietPhongHoc10
    @RoomID VARCHAR(8) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Thông tin tổng quan phòng học
    SELECT 
    ph.RoomID,
    COALESCE(pn.RoomName, pt.RoomName, pc.RoomName) AS RoomName,
    CASE 
        WHEN pn.RoomID IS NOT NULL THEN pn.RoomCapacity
        WHEN pt.RoomID IS NOT NULL THEN pt.RoomCapacity
        ELSE 1
    END AS RoomCapacity,
    CASE 
        WHEN pn.RoomID IS NOT NULL THEN pn.TimeLimit
        WHEN pt.RoomID IS NOT NULL THEN pt.TimeLimit
        WHEN pc.RoomID IS NOT NULL THEN pc.TimeLimit
        ELSE NULL
    END AS TimeLimit,
    CASE 
        WHEN pn.RoomID IS NOT NULL THEN N'Phòng học nhóm'
        WHEN pt.RoomID IS NOT NULL THEN N'Phòng thuyết trình'
        WHEN pc.RoomID IS NOT NULL THEN N'Phòng học cá nhân'
        ELSE N'Không xác định'
    END AS RoomType,
    u.FName + ' ' + u.LName AS QuanLyFullName,
    u.Email AS QuanLyEmail,
    ql.CCCD AS QuanLyCCCD
FROM PHONG_HOC ph
LEFT JOIN PHONG_HOC_NHOM pn ON ph.RoomID = pn.RoomID
LEFT JOIN PHONG_THUYET_TRINH pt ON ph.RoomID = pt.RoomID
LEFT JOIN PHONG_HOC_CA_NHAN pc ON ph.RoomID = pc.RoomID
JOIN NGUOI_QUAN_LY ql ON ph.CCCD = ql.CCCD
JOIN Users u ON ql.CCCD = u.CCCD


    WHERE @RoomID IS NULL OR ph.RoomID = @RoomID;

    -- 2. Phiếu mượn + thiết bị di động
    SELECT 
        pm.RoomID,
        pm.TicketID,
        pm.Borrowed_Date,
        pm.Borrowed_Time,
        pm.Duration,
        pm.Expected_Return_Time,
        pm.Actual_Return_Time,
        pm.TicketStatus,
        u2.FName + ' ' + u2.LName AS NguoiMuon
    
    FROM PHIEU_MUON pm
    LEFT JOIN NGUOI_MUON nm ON pm.CCCD = nm.CCCD
    LEFT JOIN Users u2 ON nm.CCCD = u2.CCCD
    WHERE @RoomID IS NULL OR pm.RoomID = @RoomID;
END;
-----------------------------------------------------------------------------------------------------------
GO

CREATE   PROCEDURE INSERT_TICKET_TONG_QUAT10
    @RoomID                  VARCHAR(8)     = NULL,
    @Borrowed_Date           DATE,
    @Borrowed_Time           TIME,
    @Duration                INT,
    @Actual_Return_Time      TIME           = NULL,
    @TicketStatus            VARCHAR(15)    = NULL,
    @CCCD                    CHAR(12)
AS
BEGIN
    -- Kiểm tra CCCD hợp lệ
    IF LEN(@CCCD) != 12
    BEGIN
        RAISERROR('SSN phải có 12 chữ số.', 16, 2);
        RETURN;
    END

    -- Kiểm tra người mượn tồn tại
    IF NOT EXISTS (SELECT 1 FROM NGUOI_MUON WHERE CCCD = @CCCD)
    BEGIN
        RAISERROR('Người mượn không tồn tại.', 16, 2);
        RETURN;
    END

    -- Kiểm tra ít nhất một trong RoomID hoặc DeviceID được cung cấp
    IF @RoomID IS NULL 
    BEGIN
        RAISERROR('Phải cung cấp ít nhất RoomID.', 16, 2);
        RETURN;
    END

    -- Kiểm tra RoomID hợp lệ (nếu có)
    IF @RoomID IS NOT NULL AND NOT EXISTS (SELECT 1 FROM PHONG_HOC WHERE RoomID = @RoomID)
    BEGIN
        RAISERROR('Phòng không tồn tại.', 16, 2);
        RETURN;
    END


    -- Kiểm tra thời gian hợp lệ
    IF @Borrowed_Time < '06:00:00' OR @Borrowed_Time > '18:00:00' OR 
       @Duration > 300 OR DATEADD(MINUTE, @Duration, @Borrowed_Time) > '18:00:00'
    BEGIN
        RAISERROR('Thời gian mượn không hợp lệ.', 16, 2);
        RETURN;
    END

    -- Chèn phiếu mượn
    INSERT INTO PHIEU_MUON (
        RoomID, Borrowed_Date, Borrowed_Time, 
        Duration, Actual_Return_Time, TicketStatus, CCCD
    )
    VALUES (
        @RoomID, @Borrowed_Date, @Borrowed_Time, 
        @Duration, @Actual_Return_Time, @TicketStatus, @CCCD
    );
END;
-----------------------------------------------------------------------------------------------------------
GO

INSERT INTO Users(name,email,password,role,CCCD,FName,LName,BDate) VALUES 
('admin','admin@hcmut.edu.vn','$2b$10$V9cuz6OLZCA/CO0tbd2xQulEKjCMJ83vRYaLNJ5tsi/TWPKauI/8i','admin','079201791244','admin','admin','1975-01-01'),
('s','s@hcmut.edu.vn','$2b$10$kSQ1T41SYzCQF54Rarxjt.VlKowosePbPk4x3cC2Bc9pC4wtKtQyW','student','111111111110','s','s','2000-01-01');


INSERT INTO PHONG_HOC (CCCD) VALUES
('079201791244'), ('079201791244'), ('079201791244'), ('079201791244'), ('079201791244'), ('079201791244'),
('079201791244'), ('079201791244'), ('079201791244'), ('079201791244'), ('079201791244'), ('079201791244');


INSERT INTO PHONG_HOC_NHOM (RoomID, RoomName, RoomCapacity, TimeLimit) VALUES
('ROOM0001', 'H6-101', 10,180),
('ROOM0002', 'H6-102', 10,180),
('ROOM0003', 'H3-231', 10,180),
('ROOM0004', 'H6-201', 10,180);

INSERT INTO PHONG_THUYET_TRINH (RoomID, RoomName, RoomCapacity, TimeLimit) VALUES
('ROOM0005', 'H6-602', 45,180),
('ROOM0006', 'H3-411', 50,180),
('ROOM0007', 'H3-412', 50,180),
('ROOM0008', 'H3-416', 50,180);

INSERT INTO PHONG_HOC_CA_NHAN (RoomID, RoomName, TimeLimit) VALUES 
('ROOM0009', 'H6-104', 120),
('ROOM0010', 'H1-101', 120),
('ROOM0011', 'H6-412', 120),
('ROOM0012', 'H3-416', 120);
