-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: crm_bruna_calheira_adv
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `crm_bruna_calheira_adv_documentos_gerados`
--

DROP TABLE IF EXISTS `crm_bruna_calheira_adv_documentos_gerados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crm_bruna_calheira_adv_documentos_gerados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome_cliente` varchar(255) DEFAULT NULL,
  `caminho_arquivo` text DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_bruna_calheira_adv_documentos_gerados`
--

LOCK TABLES `crm_bruna_calheira_adv_documentos_gerados` WRITE;
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_documentos_gerados` DISABLE KEYS */;
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_documentos_gerados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_bruna_calheira_adv_tokens_invalidos`
--

DROP TABLE IF EXISTS `crm_bruna_calheira_adv_tokens_invalidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crm_bruna_calheira_adv_tokens_invalidos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_bruna_calheira_adv_tokens_invalidos`
--

LOCK TABLES `crm_bruna_calheira_adv_tokens_invalidos` WRITE;
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_tokens_invalidos` DISABLE KEYS */;
INSERT INTO `crm_bruna_calheira_adv_tokens_invalidos` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5hQGV4ZW1wbG8uY29tIiwiZXhwIjoxNzYxODQyMTk5fQ.1LDmUXL3Jva_e1KeawqfpQyBHxRk58z0-m6XW52FFso','2025-10-30 12:40:08'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvYnNvbkBza2lsbGJhc2UuY29tIiwiZXhwIjoxNzYxODQ1NzA4fQ.fDcjnScKhQclsbQHT3i2YMTiQ78lHBIkBz9GljWgnU4','2025-10-30 13:39:30');
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_tokens_invalidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm_bruna_calheira_adv_usuarios`
--

DROP TABLE IF EXISTS `crm_bruna_calheira_adv_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crm_bruna_calheira_adv_usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `permissoes` varchar(255) DEFAULT 'usuario',
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` datetime DEFAULT current_timestamp(),
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm_bruna_calheira_adv_usuarios`
--

LOCK TABLES `crm_bruna_calheira_adv_usuarios` WRITE;
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_usuarios` DISABLE KEYS */;
INSERT INTO `crm_bruna_calheira_adv_usuarios` VALUES (1,'Bruna Calheira','bruna@exemplo.com','123456','usuario',1,'2025-10-30 12:31:11','2025-10-30 12:31:11'),(2,'Robson Calheira','robson@skillbase.com','Bruna@1410','adv',1,'2025-10-30 13:34:42','2025-10-30 13:34:42');
/*!40000 ALTER TABLE `crm_bruna_calheira_adv_usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-30 17:29:57
