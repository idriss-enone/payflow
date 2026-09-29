DROP DATABASE IF EXISTS payflow;

CREATE DATABASE IF NOT EXISTS payflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE payflow;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  pin_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE wallets (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL UNIQUE,
  balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_wallets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_wallet_balance CHECK (balance >= 0)
);

CREATE TABLE refresh_tokens (
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

CREATE TABLE transfers (
  id CHAR(36) PRIMARY KEY,
  sender_wallet_id CHAR(36) NOT NULL,
  receiver_wallet_id CHAR(36) NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  note VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_transfers_sender FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id),
  CONSTRAINT fk_transfers_receiver FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id),
  CONSTRAINT chk_transfer_amount CHECK (amount > 0),
  CONSTRAINT chk_transfer_different_wallets CHECK (sender_wallet_id <> receiver_wallet_id),
  INDEX idx_transfers_sender (sender_wallet_id),
  INDEX idx_transfers_receiver (receiver_wallet_id)
);

CREATE TABLE transactions (
  id CHAR(36) PRIMARY KEY,
  wallet_id CHAR(36) NOT NULL,
  transfer_id CHAR(36) NULL,
  kind VARCHAR(20) NOT NULL,
  direction VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
  amount DECIMAL(14,2) NOT NULL,
  reference VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transactions_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  CONSTRAINT fk_transactions_transfer FOREIGN KEY (transfer_id) REFERENCES transfers(id) ON DELETE SET NULL,
  CONSTRAINT chk_transaction_amount CHECK (amount > 0),
  INDEX idx_transactions_wallet_date (wallet_id, created_at DESC),
  INDEX idx_transactions_transfer (transfer_id)
);

CREATE TABLE topups (
  id CHAR(36) PRIMARY KEY,
  transaction_id CHAR(36) NOT NULL UNIQUE,
  channel_name VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_topups_tx FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE withdrawals (
  id CHAR(36) PRIMARY KEY,
  transaction_id CHAR(36) NOT NULL UNIQUE,
  channel_name VARCHAR(60) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_withdrawals_tx FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE bill_payments (
  id CHAR(36) PRIMARY KEY,
  transaction_id CHAR(36) NOT NULL UNIQUE,
  biller_name VARCHAR(120) NOT NULL,
  customer_reference VARCHAR(160) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bill_payments_tx FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE idempotency_keys (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  idempotency_key VARCHAR(100) NOT NULL,
  endpoint VARCHAR(60) NOT NULL,
  response_body JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_idempotency_user_key UNIQUE (user_id, idempotency_key),
  CONSTRAINT fk_idempotency_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);