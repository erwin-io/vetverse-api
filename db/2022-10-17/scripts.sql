USE [master]
GO
/****** Object:  Database [vetversedb]    Script Date: 17/10/2022 12:49:06 am ******/
CREATE DATABASE [vetversedb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'vetversedb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\vetversedb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'vetversedb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL13.SQLEXPRESS\MSSQL\DATA\vetversedb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [vetversedb] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [vetversedb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [vetversedb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [vetversedb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [vetversedb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [vetversedb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [vetversedb] SET ARITHABORT OFF 
GO
ALTER DATABASE [vetversedb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [vetversedb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [vetversedb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [vetversedb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [vetversedb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [vetversedb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [vetversedb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [vetversedb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [vetversedb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [vetversedb] SET  DISABLE_BROKER 
GO
ALTER DATABASE [vetversedb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [vetversedb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [vetversedb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [vetversedb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [vetversedb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [vetversedb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [vetversedb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [vetversedb] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [vetversedb] SET  MULTI_USER 
GO
ALTER DATABASE [vetversedb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [vetversedb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [vetversedb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [vetversedb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [vetversedb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [vetversedb] SET QUERY_STORE = OFF
GO
USE [vetversedb]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [vetversedb]
GO
/****** Object:  Table [dbo].[Appointment]    Script Date: 17/10/2022 12:49:06 am ******/
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
	[IsPaid] [bit] NOT NULL,
	[IsWalkIn] [bit] NOT NULL,
	[WalkInAppointmentNotes] [text] NULL,
	[AppointmentStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppointmentStatus]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[ClientAppointment]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Clients]    Script Date: 17/10/2022 12:49:06 am ******/
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
 CONSTRAINT [PK_Clients] PRIMARY KEY CLUSTERED 
(
	[ClientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConsultaionType]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Diagnosis]    Script Date: 17/10/2022 12:49:06 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Diagnosis](
	[DiagnosisId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
	[DescOfDiagnosis] [nvarchar](max) NULL,
	[DescOfTreatment] [nvarchar](max) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_Diagnosis] PRIMARY KEY CLUSTERED 
(
	[DiagnosisId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityStatus]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Gender]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[migrations]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Payment]    Script Date: 17/10/2022 12:49:06 am ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[PaymentId] [bigint] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [bigint] NOT NULL,
	[PaymentTypeId] [bigint] NOT NULL,
	[PaymentDate] [date] NOT NULL,
	[IsVoid] [bit] NOT NULL,
 CONSTRAINT [PK_Payment] PRIMARY KEY CLUSTERED 
(
	[PaymentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentType]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Pet]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[PetAppointment]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[PetCategory]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[PetType]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Roles]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[ServiceType]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Staff]    Script Date: 17/10/2022 12:49:06 am ******/
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
/****** Object:  Table [dbo].[Users]    Script Date: 17/10/2022 12:49:06 am ******/
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
	[IsAdminApproved] [bit] NOT NULL,
	[RoleId] [bigint] NOT NULL,
	[Enable] [bit] NOT NULL,
	[EntityStatusId] [bigint] NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserType]    Script Date: 17/10/2022 12:49:06 am ******/
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
SET IDENTITY_INSERT [dbo].[Appointment] ON 
GO
INSERT [dbo].[Appointment] ([AppointmentId], [Staffid], [ServiceTypeId], [ConsultaionTypeId], [AppointmentDate], [Comments], [TimeStart], [TimeEnd], [IsPaid], [IsWalkIn], [WalkInAppointmentNotes], [AppointmentStatusId]) VALUES (1, 2, 1, 1, CAST(N'2022-10-12' AS Date), N'', N'12:10:00 am', N'1:10:00 am', 0, 0, NULL, 1)
GO
INSERT [dbo].[Appointment] ([AppointmentId], [Staffid], [ServiceTypeId], [ConsultaionTypeId], [AppointmentDate], [Comments], [TimeStart], [TimeEnd], [IsPaid], [IsWalkIn], [WalkInAppointmentNotes], [AppointmentStatusId]) VALUES (2, 2, 1, 1, CAST(N'2022-10-16' AS Date), N'', N'4:10:00 am', N'5:10:00 am', 0, 0, NULL, 1)
GO
SET IDENTITY_INSERT [dbo].[Appointment] OFF
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (1, N'Pending')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (2, N'Approved')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (3, N'Completed')
GO
INSERT [dbo].[AppointmentStatus] ([AppointmentStatusId], [Name]) VALUES (4, N'Cancelled')
GO
INSERT [dbo].[ClientAppointment] ([AppointmentId], [ClientId]) VALUES (1, 1)
GO
INSERT [dbo].[ClientAppointment] ([AppointmentId], [ClientId]) VALUES (2, 1)
GO
SET IDENTITY_INSERT [dbo].[Clients] ON 
GO
INSERT [dbo].[Clients] ([ClientId], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [BirthDate], [Age], [GenderId]) VALUES (1, 4, N'Client1', NULL, N'Client1', N'client@gmail.com', N'09950431207', N'CEBU', CAST(N'2022-10-12' AS Date), 0, 1)
GO
SET IDENTITY_INSERT [dbo].[Clients] OFF
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
SET IDENTITY_INSERT [dbo].[Pet] ON 
GO
INSERT [dbo].[Pet] ([PetId], [ClientId], [Name], [PetCategoryId], [GenderId], [BirthDate], [Weight], [EntityStatusId]) VALUES (1, 1, N'Star', 1, 1, CAST(N'2020-10-12' AS Date), 10, 1)
GO
SET IDENTITY_INSERT [dbo].[Pet] OFF
GO
INSERT [dbo].[PetAppointment] ([AppointmentId], [PetId]) VALUES (1, 1)
GO
INSERT [dbo].[PetAppointment] ([AppointmentId], [PetId]) VALUES (2, 1)
GO
SET IDENTITY_INSERT [dbo].[PetCategory] ON 
GO
INSERT [dbo].[PetCategory] ([PetCategoryId], [PetTypeId], [Name], [EntityStatusId]) VALUES (1, 1, N'Husky', 1)
GO
SET IDENTITY_INSERT [dbo].[PetCategory] OFF
GO
SET IDENTITY_INSERT [dbo].[PetType] ON 
GO
INSERT [dbo].[PetType] ([PetTypeId], [Name], [EntityStatusId]) VALUES (1, N'Dog', 1)
GO
SET IDENTITY_INSERT [dbo].[PetType] OFF
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (1, N'Admin', N'Appointments,Health Records,Users,Roles,Service Type,Pet Type,Pet Category')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (2, N'Manager', N'Appointments,Health Records,Service,Users,Roles')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (3, N'Veterinarian', N'Appointments,Health Records')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (4, N'Front desk', N'Health Records,Appointments')
GO
INSERT [dbo].[Roles] ([RoleId], [Name], [Access]) VALUES (5, N'Guest', NULL)
GO
SET IDENTITY_INSERT [dbo].[ServiceType] ON 
GO
INSERT [dbo].[ServiceType] ([ServiceTypeId], [Name], [Description], [Price], [DurationInHours], [IsMedicalServiceType], [EntityStatusId]) VALUES (1, N'Consultation', N'', CAST(1000.00 AS Decimal(18, 2)), 1, 0, 1)
GO
SET IDENTITY_INSERT [dbo].[ServiceType] OFF
GO
SET IDENTITY_INSERT [dbo].[Staff] ON 
GO
INSERT [dbo].[Staff] ([Staffid], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [GenderId]) VALUES (1, 1, N'Admin', N'', N'Admin', N'admin@admin.com', N'09950431207', N'CEBU', 1)
GO
INSERT [dbo].[Staff] ([Staffid], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [GenderId]) VALUES (2, 2, N'Irene Shyñin O. Arong', N'Irene Shyñin O. Arong', N'Irene Shyñin O. Arong', N'vet@gmail.com', N'09950431207', N'CEBU', 1)
GO
INSERT [dbo].[Staff] ([Staffid], [UserId], [FirstName], [MiddleName], [LastName], [Email], [MobileNumber], [Address], [GenderId]) VALUES (3, 3, N'Staff1', N'', N'Staff1', N'staff@gmail.com', N'09950431207', N'CEBY', 1)
GO
SET IDENTITY_INSERT [dbo].[Staff] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 
GO
INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId]) VALUES (1, 1, N'admin', N'$2b$10$qaO2Gr3j4vQY4aaR879.QOX68pCNuPDG0JjIK9KGuD589G9jgugFe', N'$2b$10$VElNvde.2L3Bw5VSVUX4YeON5k/J.CAY1.Yx/8NX4tcK34WxzcUem', 0, 1, 1, 1)
GO
INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId]) VALUES (2, 1, N'vet2', N'$2b$10$yih/m6OOS.YGYorK76qsmu4B5PKqQzTI7bRe0PaBUTTiob6bzFXmm', NULL, 1, 3, 1, 1)
GO
INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId]) VALUES (3, 1, N'staff1', N'$2b$10$DpxUKuNs9Nvne10/voiLuebnoTaUVw.CMD9rYhceZ5WFhcWIKNv8W', NULL, 1, 4, 1, 1)
GO
INSERT [dbo].[Users] ([UserId], [UserTypeId], [Username], [Password], [currentHashedRefreshToken], [IsAdminApproved], [RoleId], [Enable], [EntityStatusId]) VALUES (4, 2, N'client1', N'$2b$10$CiKJp3X9Um/x.mecVAHywumkVVB7VegwiN6YlIv7RG3anhFMMBPSy', N'$2b$10$v0ilEx7KA/knB/Ca5pidr.z/0049YYHwIt.G/NEb7GhGi45ioYYd.', 0, 5, 1, 1)
GO
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
INSERT [dbo].[UserType] ([UserTypeId], [Name]) VALUES (1, N'Staff')
GO
INSERT [dbo].[UserType] ([UserTypeId], [Name]) VALUES (2, N'Client')
GO
/****** Object:  Index [IX_ClientAppointment]    Script Date: 17/10/2022 12:49:07 am ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_ClientAppointment] ON [dbo].[ClientAppointment]
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PaymentType]    Script Date: 17/10/2022 12:49:07 am ******/
ALTER TABLE [dbo].[PaymentType] ADD  CONSTRAINT [U_PaymentType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PetCategory]    Script Date: 17/10/2022 12:49:07 am ******/
ALTER TABLE [dbo].[PetCategory] ADD  CONSTRAINT [U_PetCategory] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_PetType]    Script Date: 17/10/2022 12:49:07 am ******/
ALTER TABLE [dbo].[PetType] ADD  CONSTRAINT [U_PetType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_Roles]    Script Date: 17/10/2022 12:49:07 am ******/
ALTER TABLE [dbo].[Roles] ADD  CONSTRAINT [U_Roles] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_ServiceType]    Script Date: 17/10/2022 12:49:07 am ******/
ALTER TABLE [dbo].[ServiceType] ADD  CONSTRAINT [U_ServiceType] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_IsPaid]  DEFAULT ((0)) FOR [IsPaid]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_IsWalkIn]  DEFAULT ((0)) FOR [IsWalkIn]
GO
ALTER TABLE [dbo].[Appointment] ADD  CONSTRAINT [DF_Appointment_AppointmentStatusId]  DEFAULT ((1)) FOR [AppointmentStatusId]
GO
ALTER TABLE [dbo].[Diagnosis] ADD  CONSTRAINT [DF_Diagnosis_IsActive]  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Diagnosis] ADD  CONSTRAINT [DF_Diagnosis_EntityStatusId]  DEFAULT ((1)) FOR [EntityStatusId]
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
/****** Object:  StoredProcedure [dbo].[usp_Reset]    Script Date: 17/10/2022 12:49:07 am ******/
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
		
		DELETE FROM [dbo].[PetAppointment];
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
		DELETE FROM [dbo].[Staff];
		DBCC CHECKIDENT ('Staff', RESEED, 0)
		DELETE FROM [dbo].[Users];
		DBCC CHECKIDENT ('Users', RESEED, 0)
		DELETE FROM [dbo].[ServiceType];
		DBCC CHECKIDENT ('ServiceType', RESEED, 0)
		DELETE FROM [dbo].[Diagnosis];
		DBCC CHECKIDENT ('Diagnosis', RESEED, 0)
		DELETE FROM [dbo].[Payment];
		DBCC CHECKIDENT ('Payment', RESEED, 0)
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
USE [master]
GO
ALTER DATABASE [vetversedb] SET  READ_WRITE 
GO
