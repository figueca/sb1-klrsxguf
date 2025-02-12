/*
  # Adiciona tabelas para transações financeiras

  1. Nova Tabela
    - `financial_transactions`
      - `id` (uuid, primary key)
      - `professional_id` (uuid)
      - `type` (text)
      - `category` (text)
      - `amount` (decimal)
      - `date` (date)
      - `description` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES profiles(id),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date date NOT NULL,
  description text,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own transactions"
  ON financial_transactions
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

CREATE POLICY "Users can create transactions"
  ON financial_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Users can update their own transactions"
  ON financial_transactions
  FOR UPDATE
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Users can delete their own transactions"
  ON financial_transactions
  FOR DELETE
  TO authenticated
  USING (professional_id = auth.uid());