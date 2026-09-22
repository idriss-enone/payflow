SET NAMES utf8;

--DROP DATABASE IF EXISTS payflow;

CREATE DATABASE IF NOT EXISTS payflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE payflow;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS wallets;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  pin_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL UNIQUE,
  balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_wallet_balance CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS transactions (
  id CHAR(36) PRIMARY KEY,
  wallet_id CHAR(36) NOT NULL,
  kind ENUM('TRANSFER', 'BILL_PAYMENT', 'TOP_UP') NOT NULL,
  status ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'SUCCESS',
  amount DECIMAL(14,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  INDEX idx_transactions_wallet_date (wallet_id, created_at DESC)
);

CREATE TABLE IF NOT EXISTS transfers (
  id CHAR(36) PRIMARY KEY,
  sender_wallet_id CHAR(36) NOT NULL,
  recipient_wallet_id CHAR(36) NOT NULL,
  debit_transaction_id CHAR(36) NOT NULL UNIQUE,
  credit_transaction_id CHAR(36) NOT NULL UNIQUE,
  amount DECIMAL(14,2) NOT NULL,
  note VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transfers_sender FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfers_recipient FOREIGN KEY (recipient_wallet_id) REFERENCES wallets(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfers_debit_tx FOREIGN KEY (debit_transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transfers_credit_tx FOREIGN KEY (credit_transaction_id) REFERENCES transactions(id) ON DELETE RESTRICT,
  INDEX idx_transfers_sender_date (sender_wallet_id,created_at DESC),
  INDEX idx_transfers_recipient_date (recipient_wallet_id,created_at DESC)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user (user_id),
  INDEX idx_refresh_tokens_expires (expires_at)
);