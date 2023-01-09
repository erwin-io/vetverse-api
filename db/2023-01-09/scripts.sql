USE [vetversedb]
GO
/****** Object:  Table [dbo].[Appointment]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointment](
	[AppointmentId] [bigint] IDENTITY(1,1) NOT NULL,
	[Staffid] [bigint] NOT NULL,
	[ServiceTypeId] [bigint] NOT NULL,
	[ConsultaionTypeId] [bigint] NOT NULL,
	[AppointmentDate] [date] NOT NULL,
	[Comments] [text] NULL,
	[TimeStart] [nvarchar](50) NOT NULL,
	[TimeEnd] [nvarchar](50) NOT NULL,
	[ServiceRate] [decimal](18, 2) NOT NULL,
	[IsPaid] [bit] NOT NULL,
	[IsWalkIn] [bit] NOT NULL,
	[WalkInAppointmentNotes] [text] NULL,
	[AppointmentStatusId] [bigint] NOT NULL,
	[ConferencePeerId] [nvarchar](max) NULL,
	[DiagnosisAndTreatment] [nvarchar](max) NULL,
 CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppointmentAttachments]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppointmentAttachments](
	[AppointmentAttachmentId] [bigint] IDENTITY(1,1) NOT NULL,
	[FileId] [bigint] NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
 CONSTRAINT [PK_AppointmentAttachments] PRIMARY KEY CLUSTERED 
(
	[AppointmentAttachmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppointmentStatus]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppointmentStatus](
	[AppointmentStatusId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NULL,
 CONSTRAINT [PK_AppointmentStatus] PRIMARY KEY CLUSTERED 
(
	[AppointmentStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ClientAppointment]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ClientAppointment](
	[AppointmentId] [bigint] NOT NULL,
	[ClientId] [bigint] NOT NULL,
 CONSTRAINT [PK_ClientAppointment] PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Clients]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Clients](
	[ClientId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[FirstName] [nvarchar](250) NOT NULL,
	[MiddleName] [nvarchar](250) NULL,
	[LastName] [nvarchar](250) NOT NULL,
	[Email] [nvarchar](250) NOT NULL,
	[MobileNumber] [nvarchar](250) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[BirthDate] [date] NOT NULL,
	[Age] [bigint] NOT NULL,
	[GenderId] [bigint] NOT NULL,
	[LastCancelledDate] [datetime] NULL,
	[NumberOfCancelledAttempt] [bigint] NOT NULL,
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[ClientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConsultaionType]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConsultaionType](
	[ConsultaionTypeId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_ConsultaionType] PRIMARY KEY CLUSTERED 
(
	[ConsultaionTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DiagnosisAttachments]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DiagnosisAttachments](
	[DiagnosisAttachmentsId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
	[FileId] [bigint] NOT NULL,
 CONSTRAINT [PK_DiagnosisAttachments_1] PRIMARY KEY CLUSTERED 
(
	[DiagnosisAttachmentsId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityStatus]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityStatus](
	[EntityStatusId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_EntityStatus] PRIMARY KEY CLUSTERED 
(
	[EntityStatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Files]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Files](
	[FileId] [bigint] IDENTITY(1,1) NOT NULL,
	[FileName] [nvarchar](max) NOT NULL,
	[Url] [varchar](max) NULL,
 CONSTRAINT [PK_Files] PRIMARY KEY CLUSTERED 
(
	[FileId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GatewayConnectedUsers]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GatewayConnectedUsers](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[SocketId] [nvarchar](100) NOT NULL,
	[UserId] [bigint] NOT NULL,
 CONSTRAINT [PK_GatewayConnectedUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gender]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gender](
	[GenderId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_Gender] PRIMARY KEY CLUSTERED 
(
	[GenderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[MessageId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
	[Message] [text] NOT NULL,
	[FromUserId] [bigint] NOT NULL,
	[ToUserId] [bigint] NOT NULL,
	[DateTime] [datetime] NOT NULL,
	[IsClient] [bit] NOT NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[MessageId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[migrations]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[migrations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[timestamp] [bigint] NOT NULL,
	[name] [varchar](255) NOT NULL,
 CONSTRAINT [PK_8c82d7f526340ab734260ea46be] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Notifications]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notifications](
	[NotificationId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NULL,
	[Date] [datetime] NOT NULL,
	[ClientId] [bigint] NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[IsReminder] [bit] NOT NULL,
	[IsRead] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_Notifications] PRIMARY KEY CLUSTERED 
(
	[NotificationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[PaymentId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
	[PaymentTypeId] [bigint] NOT NULL,
	[PaymentDate] [date] NOT NULL,
	[ReferenceNo] [nvarchar](max) NULL,
	[IsVoid] [bit] NOT NULL,
 CONSTRAINT [PK_Payment] PRIMARY KEY CLUSTERED 
(
	[PaymentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentType]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentType](
	[PaymentTypeId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_PaymentType] PRIMARY KEY CLUSTERED 
(
	[PaymentTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pet]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pet](
	[PetId] [bigint] IDENTITY(1,1) NOT NULL,
	[ClientId] [bigint] NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[PetCategoryId] [bigint] NOT NULL,
	[GenderId] [bigint] NOT NULL,
	[BirthDate] [date] NULL,
	[Weight] [int] NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_Pet] PRIMARY KEY CLUSTERED 
(
	[PetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PetAppointment]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PetAppointment](
	[AppointmentId] [bigint] NOT NULL,
	[PetId] [bigint] NOT NULL,
 CONSTRAINT [PK_PetAppointment] PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PetCategory]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PetCategory](
	[PetCategoryId] [bigint] IDENTITY(1,1) NOT NULL,
	[PetTypeId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_PetCategory] PRIMARY KEY CLUSTERED 
(
	[PetCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PetProfilePic]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PetProfilePic](
	[PetId] [bigint] NOT NULL,
	[FileId] [bigint] NOT NULL,
 CONSTRAINT [PK_PetProfilePic] PRIMARY KEY CLUSTERED 
(
	[PetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PetType]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PetType](
	[PetTypeId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_PetType] PRIMARY KEY CLUSTERED 
(
	[PetTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reminder]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reminder](
	[ReminderId] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](250) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[IsAppointment] [bit] NOT NULL,
	[AppointmentId] [bigint] NULL,
	[DueDate] [datetime] NOT NULL,
	[Delivered] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_ReminderI] PRIMARY KEY CLUSTERED 
(
	[ReminderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Access] [text] NULL,
 CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ServiceType]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ServiceType](
	[ServiceTypeId] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](250) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[DurationInHours] [bigint] NOT NULL,
	[IsMedicalServiceType] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_ServiceType] PRIMARY KEY CLUSTERED 
(
	[ServiceTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Staff]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Staff](
	[Staffid] [bigint] IDENTITY(1,1) NOT NULL,
	[UserId] [bigint] NOT NULL,
	[FirstName] [nvarchar](250) NOT NULL,
	[MiddleName] [nvarchar](250) NULL,
	[LastName] [nvarchar](250) NOT NULL,
	[Email] [nvarchar](250) NOT NULL,
	[MobileNumber] [nvarchar](250) NOT NULL,
	[Address] [nvarchar](max) NOT NULL,
	[GenderId] [bigint] NOT NULL,
 CONSTRAINT [PK_Staff] PRIMARY KEY CLUSTERED 
(
	[Staffid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserProfilePic]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfilePic](
	[UserId] [bigint] NOT NULL,
	[FileId] [bigint] NOT NULL,
 CONSTRAINT [PK_UserProfilePic_1] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [bigint] IDENTITY(1,1) NOT NULL,
	[UserTypeId] [bigint] NOT NULL,
	[Username] [nvarchar](250) NOT NULL,
	[Password] [nvarchar](250) NOT NULL,
	[currentHashedRefreshToken] [nvarchar](max) NULL,
	[FirebaseToken] [nvarchar](max) NULL,
	[IsAdminApproved] [bit] NOT NULL,
	[RoleId] [bigint] NOT NULL,
	[Enable] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
	[Otp] [bigint] NOT NULL,
	[IsVerified] [bit] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserType]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserType](
	[UserTypeId] [bigint] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_UserType] PRIMARY KEY CLUSTERED 
(
	[UserTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (1, N'Pending')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (2, N'Approved')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (3, N'Completed')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (4, N'Cancelled')
GO
INSERT [dbo].[ConsultaionType] ([ConsultaionTypeId], [Name]) VALUES (1, N'Onsite')
GO
INSERT [dbo].[ConsultaionType] ([ConsultaionTypeId], [Name]) VALUES (2, N'Video')
GO
INSERT [dbo].[EntityStatus] ([EntityStatusId], [Name]) VALUES (1, N'Active')
GO
INSERT [dbo].[EntityStatus] ([EntityStatusId], [Name]) VALUES (2, N'Deleted')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (1, N'Male')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (2, N'Female')
GO
INSERT [dbo].[Gender] ([GenderId], [Name]) VALUES (3, N'Rather not say')
GO
INSERT [dbo].[PaymentType] ([PaymentTypeId], [Name]) VALUES (1, N'Cash')
GO
INSERT [dbo].[PaymentType] ([PaymentTypeId], [Name]) VALUES (2, N'G-Cash')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (1, N'Admin', N'Appointments,Health Records,Users,Roles,Service Type,Pet Type,Pet Category,Reminders,Reports')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (2, N'Manager', N'Appointments,Health Records,Service,Users,Roles')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (3, N'Veterinarian', N'Appointments,Health Records')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (4, N'Front desk', N'Health Records,Appointments')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (5, N'Guest', NULL)
GO
SET IDENTITY_INSERT [dbo].[Staff] ON 
GO
INSERT [dbo].[Staff] ([Staffid], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [GenderId]) VALUES (1, 1, N'Admin', N'', N'Admin', N'admin@gmail.com', N'000', N'MANILA', 1)
GO
SET IDENTITY_INSERT [dbo].[Staff] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [FirebaseToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId], [Otp], [IsVerified]) VALUES (1, 1, N'admin', N'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a', NULL, NULL, 1, 1, 1, 1, 123456, 1)
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
INSERT [dbo].[UserType] ([UserTypeId], [Name]) VALUES (1, N'Staff')
GO
INSERT [dbo].[UserType] ([UserTypeId], [Name]) VALUES (2, N'Client')
GO
/****** Object:  Index [IX_Appointment]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [IX_Appointment] UNIQUE NONCLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PaymentType]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[PaymentType] ADD  CONSTRAINT [U_PaymentType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PetCategory]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[PetCategory] ADD  CONSTRAINT [U_PetCategory] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PetType]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[PetType] ADD  CONSTRAINT [U_PetType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_Roles]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [U_Roles] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_ServiceType]    Script Date: 1/9/2023 1:25:08 PM ******/
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [U_ServiceType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_TotalAmountToPay]  DEFAULT ((0)) FOR [ServiceRate]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_IsPaid]  DEFAULT ((0)) FOR [IsPaid]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_IsWalkIn]  DEFAULT ((0)) FOR [IsWalkIn]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_AppointmentStatusId]  DEFAULT ((1)) FOR [AppointmentStatusId]
GO
ALTER TABLE [dbo].[Clients] ADD  CONSTRAINT [DF_Clients_NumberOfCancelledAttempt]  DEFAULT ((0)) FOR [NumberOfCancelledAttempt]
GO
ALTER TABLE [dbo].[Messages] ADD  CONSTRAINT [DF_Messages_IsClient]  DEFAULT ((0)) FOR [IsClient]
GO
ALTER TABLE [dbo].[Notifications] ADD  CONSTRAINT [DF_Notifications_IsReminder]  DEFAULT ((0)) FOR [IsReminder]
GO
ALTER TABLE [dbo].[Notifications] ADD  CONSTRAINT [DF_Notifications_IsRead]  DEFAULT ((0)) FOR [IsRead]
GO
ALTER TABLE [dbo].[Notifications] ADD  CONSTRAINT [DF_Notifications_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[Payment] ADD  CONSTRAINT [DF_Payment_IsVoid]  DEFAULT ((0)) FOR [IsVoid]
GO
ALTER TABLE [dbo].[Pet] ADD  CONSTRAINT [DF_Pet_Weight]  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Pet] ADD  CONSTRAINT [DF_Pet_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[PetCategory] ADD  CONSTRAINT [DF_PetCategory_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[PetType] ADD  CONSTRAINT [DF_PetType_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[Reminder] ADD  CONSTRAINT [DF_ReminderI_IsAppointment]  DEFAULT ((0)) FOR [IsAppointment]
GO
ALTER TABLE [dbo].[Reminder] ADD  CONSTRAINT [DF_ReminderI_Delivered]  DEFAULT ((0)) FOR [Delivered]
GO
ALTER TABLE [dbo].[Reminder] ADD  CONSTRAINT [DF_Reminder_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [DF_ServiceType_Price]  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [DF_ServiceType_DurationInHours]  DEFAULT ((0)) FOR [DurationInHours]
GO
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [DF_ServiceType_IsMedicalServiceType]  DEFAULT ((0)) FOR [IsMedicalServiceType]
GO
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [DF_ServiceType_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsAdminApproved]  DEFAULT ((0)) FOR [IsAdminApproved]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_Enable]  DEFAULT ((1)) FOR [Enable]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsVerified]  DEFAULT ((0)) FOR [IsVerified]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_AppointmentStatus] FOREIGN KEY([AppointmentStatusId])
REFERENCES [dbo].[AppointmentStatus] ([AppointmentStatusId])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_AppointmentStatus]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_ConsultaionType] FOREIGN KEY([ConsultaionTypeId])
REFERENCES [dbo].[ConsultaionType] ([ConsultaionTypeId])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_ConsultaionType]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_ServiceType] FOREIGN KEY([ServiceTypeId])
REFERENCES [dbo].[ServiceType] ([ServiceTypeId])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_ServiceType]
GO
ALTER TABLE [dbo].[Appointment]  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Staff] FOREIGN KEY([Staffid])
REFERENCES [dbo].[Staff] ([Staffid])
GO
ALTER TABLE [dbo].[Appointment] CHECK CONSTRAINT [FK_Appointment_Staff]
GO
ALTER TABLE [dbo].[AppointmentAttachments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentAttachments_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[AppointmentAttachments] CHECK CONSTRAINT [FK_AppointmentAttachments_Appointment]
GO
ALTER TABLE [dbo].[AppointmentAttachments]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentAttachments_Files] FOREIGN KEY([FileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[AppointmentAttachments] CHECK CONSTRAINT [FK_AppointmentAttachments_Files]
GO
ALTER TABLE [dbo].[ClientAppointment]  WITH CHECK ADD  CONSTRAINT [FK_ClientAppointment_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[ClientAppointment] CHECK CONSTRAINT [FK_ClientAppointment_Appointment]
GO
ALTER TABLE [dbo].[ClientAppointment]  WITH CHECK ADD  CONSTRAINT [FK_ClientAppointment_Clients] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Clients] ([ClientId])
GO
ALTER TABLE [dbo].[ClientAppointment] CHECK CONSTRAINT [FK_ClientAppointment_Clients]
GO
ALTER TABLE [dbo].[Clients]  WITH CHECK ADD  CONSTRAINT [FK_Clients_Gender] FOREIGN KEY([GenderId])
REFERENCES [dbo].[Gender] ([GenderId])
GO
ALTER TABLE [dbo].[Clients] CHECK CONSTRAINT [FK_Clients_Gender]
GO
ALTER TABLE [dbo].[Clients]  WITH CHECK ADD  CONSTRAINT [FK_Clients_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Clients] CHECK CONSTRAINT [FK_Clients_Users]
GO
ALTER TABLE [dbo].[DiagnosisAttachments]  WITH CHECK ADD  CONSTRAINT [FK_DiagnosisAttachments_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[DiagnosisAttachments] CHECK CONSTRAINT [FK_DiagnosisAttachments_Appointment]
GO
ALTER TABLE [dbo].[DiagnosisAttachments]  WITH CHECK ADD  CONSTRAINT [FK_DiagnosisAttachments_Files] FOREIGN KEY([FileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[DiagnosisAttachments] CHECK CONSTRAINT [FK_DiagnosisAttachments_Files]
GO
ALTER TABLE [dbo].[GatewayConnectedUsers]  WITH CHECK ADD  CONSTRAINT [FK_GatewayConnectedUsers_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[GatewayConnectedUsers] CHECK CONSTRAINT [FK_GatewayConnectedUsers_Users]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Appointment]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Users] FOREIGN KEY([FromUserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Users]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Users1] FOREIGN KEY([ToUserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Users1]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notifications_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notifications_Appointment]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notifications_Clients] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Clients] ([ClientId])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notifications_Clients]
GO
ALTER TABLE [dbo].[Notifications]  WITH CHECK ADD  CONSTRAINT [FK_Notifications_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Notifications] CHECK CONSTRAINT [FK_Notifications_EntityStatus]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_Appointment]
GO
ALTER TABLE [dbo].[Payment]  WITH CHECK ADD  CONSTRAINT [FK_Payment_PetType] FOREIGN KEY([PaymentTypeId])
REFERENCES [dbo].[PaymentType] ([PaymentTypeId])
GO
ALTER TABLE [dbo].[Payment] CHECK CONSTRAINT [FK_Payment_PetType]
GO
ALTER TABLE [dbo].[Pet]  WITH CHECK ADD  CONSTRAINT [FK_Pet_Clients] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Clients] ([ClientId])
GO
ALTER TABLE [dbo].[Pet] CHECK CONSTRAINT [FK_Pet_Clients]
GO
ALTER TABLE [dbo].[Pet]  WITH CHECK ADD  CONSTRAINT [FK_Pet_Gender] FOREIGN KEY([GenderId])
REFERENCES [dbo].[Gender] ([GenderId])
GO
ALTER TABLE [dbo].[Pet] CHECK CONSTRAINT [FK_Pet_Gender]
GO
ALTER TABLE [dbo].[Pet]  WITH CHECK ADD  CONSTRAINT [FK_Pet_PetCategory] FOREIGN KEY([PetCategoryId])
REFERENCES [dbo].[PetCategory] ([PetCategoryId])
GO
ALTER TABLE [dbo].[Pet] CHECK CONSTRAINT [FK_Pet_PetCategory]
GO
ALTER TABLE [dbo].[PetAppointment]  WITH CHECK ADD  CONSTRAINT [FK_PetAppointment_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[PetAppointment] CHECK CONSTRAINT [FK_PetAppointment_Appointment]
GO
ALTER TABLE [dbo].[PetAppointment]  WITH CHECK ADD  CONSTRAINT [FK_PetAppointment_Pet] FOREIGN KEY([PetId])
REFERENCES [dbo].[Pet] ([PetId])
GO
ALTER TABLE [dbo].[PetAppointment] CHECK CONSTRAINT [FK_PetAppointment_Pet]
GO
ALTER TABLE [dbo].[PetCategory]  WITH CHECK ADD  CONSTRAINT [FK_PetCategory_PetType] FOREIGN KEY([PetTypeId])
REFERENCES [dbo].[PetType] ([PetTypeId])
GO
ALTER TABLE [dbo].[PetCategory] CHECK CONSTRAINT [FK_PetCategory_PetType]
GO
ALTER TABLE [dbo].[PetProfilePic]  WITH CHECK ADD  CONSTRAINT [FK_PetProfilePic_Files] FOREIGN KEY([FileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[PetProfilePic] CHECK CONSTRAINT [FK_PetProfilePic_Files]
GO
ALTER TABLE [dbo].[PetProfilePic]  WITH CHECK ADD  CONSTRAINT [FK_PetProfilePic_PetProfilePic] FOREIGN KEY([PetId])
REFERENCES [dbo].[Pet] ([PetId])
GO
ALTER TABLE [dbo].[PetProfilePic] CHECK CONSTRAINT [FK_PetProfilePic_PetProfilePic]
GO
ALTER TABLE [dbo].[Reminder]  WITH CHECK ADD  CONSTRAINT [FK_Reminder_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointment] ([AppointmentId])
GO
ALTER TABLE [dbo].[Reminder] CHECK CONSTRAINT [FK_Reminder_Appointment]
GO
ALTER TABLE [dbo].[Reminder]  WITH CHECK ADD  CONSTRAINT [FK_Reminder_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Reminder] CHECK CONSTRAINT [FK_Reminder_EntityStatus]
GO
ALTER TABLE [dbo].[Staff]  WITH CHECK ADD  CONSTRAINT [FK_Staff_Gender] FOREIGN KEY([GenderId])
REFERENCES [dbo].[Gender] ([GenderId])
GO
ALTER TABLE [dbo].[Staff] CHECK CONSTRAINT [FK_Staff_Gender]
GO
ALTER TABLE [dbo].[Staff]  WITH CHECK ADD  CONSTRAINT [FK_Staff_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Staff] CHECK CONSTRAINT [FK_Staff_Users]
GO
ALTER TABLE [dbo].[UserProfilePic]  WITH CHECK ADD  CONSTRAINT [FK_UserProfilePic_Files] FOREIGN KEY([FileId])
REFERENCES [dbo].[Files] ([FileId])
GO
ALTER TABLE [dbo].[UserProfilePic] CHECK CONSTRAINT [FK_UserProfilePic_Files]
GO
ALTER TABLE [dbo].[UserProfilePic]  WITH CHECK ADD  CONSTRAINT [FK_UserProfilePic_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[UserProfilePic] CHECK CONSTRAINT [FK_UserProfilePic_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_EntityStatus] FOREIGN KEY([EntityStatusId])
REFERENCES [dbo].[EntityStatus] ([EntityStatusId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_EntityStatus]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_UserType] FOREIGN KEY([UserTypeId])
REFERENCES [dbo].[UserType] ([UserTypeId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_UserType]
GO
/****** Object:  StoredProcedure [dbo].[usp_Reset]    Script Date: 1/9/2023 1:25:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ====================================================================
-- Created date: Sept 25, 2020
-- Author: 
-- ====================================================================
CREATE PROCEDURE [dbo].[usp_Reset]
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
		SET NOCOUNT ON;
		
		DELETE FROM [dbo].[DiagnosisAttachments];
		DBCC CHECKIDENT ('DiagnosisAttachments', RESEED, 0)
		DELETE FROM [dbo].[AppointmentAttachments];
		DBCC CHECKIDENT ('AppointmentAttachments', RESEED, 0)
		DELETE FROM [dbo].[Reminder];
		DBCC CHECKIDENT ('Reminder', RESEED, 0)
		DELETE FROM [dbo].[Messages];
		DBCC CHECKIDENT ('Messages', RESEED, 0)
		DELETE FROM [dbo].[Notifications];
		DBCC CHECKIDENT ('Notifications', RESEED, 0)
		DELETE FROM [dbo].[PetAppointment];
		DELETE FROM [dbo].[PetProfilePic];
		DELETE FROM [dbo].[Pet];
		DBCC CHECKIDENT ('Pet', RESEED, 0)
		DELETE FROM [dbo].[PetCategory];
		DBCC CHECKIDENT ('PetCategory', RESEED, 0)
		DELETE FROM [dbo].[PetType];
		DBCC CHECKIDENT ('PetType', RESEED, 0)
		DELETE FROM [dbo].[Payment];
		DBCC CHECKIDENT ('Payment', RESEED, 0)
		DELETE FROM [dbo].[ClientAppointment];
		DELETE FROM [dbo].[Appointment];
		DBCC CHECKIDENT ('Appointment', RESEED, 0)
		DELETE FROM [dbo].[Clients];
		DBCC CHECKIDENT ('Clients', RESEED, 0)
		DELETE FROM [dbo].[GatewayConnectedUsers];
		DBCC CHECKIDENT ('GatewayConnectedUsers', RESEED, 0)
		DELETE FROM [dbo].[Staff];
		DBCC CHECKIDENT ('Staff', RESEED, 0)
		DELETE FROM [dbo].[UserProfilePic];
		DELETE FROM [dbo].[Users];
		DBCC CHECKIDENT ('Users', RESEED, 0)
		DELETE FROM [dbo].[UserProfilePic];
		DELETE FROM [dbo].[ServiceType];
		DBCC CHECKIDENT ('ServiceType', RESEED, 0)
		DELETE FROM [dbo].[Files];
		DBCC CHECKIDENT ('Files', RESEED, 0)

		SET IDENTITY_INSERT [dbo].[Users] ON 
		INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [FirebaseToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId], [Otp], [IsVerified]) VALUES (1, 1, N'admin', N'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a', NULL, NULL, 1, 1, 1, 1, 123456, 1)
		SET IDENTITY_INSERT [dbo].[Users] OFF
		SET IDENTITY_INSERT [dbo].[Staff] ON 
		INSERT [dbo].[Staff] ([Staffid], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [GenderId]) VALUES (1, 1, N'Admin', N'', N'Admin', N'admin@gmail.com', N'000', N'MANILA', 1)
		SET IDENTITY_INSERT [dbo].[Staff] OFF
    END TRY
    BEGIN CATCH

        SELECT
            'Error'           AS Status,
            ERROR_NUMBER()    AS ErrorNumber,
            ERROR_SEVERITY()  AS ErrorSeverity,
            ERROR_STATE()     AS ErrorState,
            ERROR_PROCEDURE() AS ErrorProcedure,
            ERROR_LINE()      AS ErrorLine,
            ERROR_MESSAGE()   AS ErrorMessage;

    END CATCH

END
GO
