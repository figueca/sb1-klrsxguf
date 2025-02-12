/*
  # Atualização do Schema Financeiro

  1. Alterações
    - Adicionado campos para controle de recorrência e pagamento
    - Adicionado suporte a anexos
    - Adicionado campos de relacionamento
  
  2. Segurança
    - Mantidas as políticas RLS existentes
    - Adicionadas políticas para anexos
*/

-- Adiciona novas colunas à tabela existente
ALTER TABLE financial_transactions
  ADD COLUMN IF NOT EXISTS reference_number text,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS recurrence jsonb,
  ADD COLUMN IF NOT EXISTS patient_id uuid REFERENCES patients(id),
  ADD COLUMN IF NOT EXISTS appointment_id uuid REFERENCES appointments(id),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Cria tabela de anexos
CREATE TABLE IF NOT EXISTS transaction_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES financial_transactions(id) ON DELETE CASCADE,
  name text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS para anexos
ALTER TABLE transaction_attachments ENABLE ROW LEVEL SECURITY;

-- Políticas para anexos
CREATE POLICY "Users can read their own transaction attachments"
  ON transaction_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM financial_transactions
      WHERE id = transaction_attachments.transaction_id
      AND professional_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transaction attachments"
  ON transaction_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM financial_transactions
      WHERE id = transaction_attachments.transaction_id
      AND professional_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own transaction attachments"
  ON transaction_attachments
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM financial_transactions
      WHERE id = transaction_attachments.transaction_id
      AND professional_id = auth.uid()
    )
  );

-- Funções auxiliares
CREATE OR REPLACE FUNCTION update_transaction_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualização automática de updated_at
DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_updated_at();

-- Função para gerar relatório financeiro
CREATE OR REPLACE FUNCTION get_financial_summary(
  p_start_date date,
  p_end_date date,
  p_professional_id uuid DEFAULT auth.uid()
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_income', COALESCE(SUM(CASE WHEN type = 'income' AND status = 'completed' THEN amount ELSE 0 END), 0),
    'total_expenses', COALESCE(SUM(CASE WHEN type = 'expense' AND status = 'completed' THEN amount ELSE 0 END), 0),
    'net_income', COALESCE(SUM(CASE WHEN type = 'income' AND status = 'completed' THEN amount ELSE -amount END), 0),
    'pending_income', COALESCE(SUM(CASE WHEN type = 'income' AND status = 'pending' THEN amount ELSE 0 END), 0),
    'pending_expenses', COALESCE(SUM(CASE WHEN type = 'expense' AND status = 'pending' THEN amount ELSE 0 END), 0),
    'income_by_category', (
      SELECT jsonb_object_agg(category, total)
      FROM (
        SELECT category, SUM(amount) as total
        FROM financial_transactions
        WHERE type = 'income'
          AND status = 'completed'
          AND date BETWEEN p_start_date AND p_end_date
          AND professional_id = p_professional_id
        GROUP BY category
      ) t
    ),
    'expenses_by_category', (
      SELECT jsonb_object_agg(category, total)
      FROM (
        SELECT category, SUM(amount) as total
        FROM financial_transactions
        WHERE type = 'expense'
          AND status = 'completed'
          AND date BETWEEN p_start_date AND p_end_date
          AND professional_id = p_professional_id
        GROUP BY category
      ) t
    ),
    'monthly_comparison', (
      SELECT jsonb_agg(monthly)
      FROM (
        SELECT
          to_char(date_trunc('month', date), 'YYYY-MM') as month,
          SUM(CASE WHEN type = 'income' AND status = 'completed' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'expense' AND status = 'completed' THEN amount ELSE 0 END) as expenses,
          SUM(CASE WHEN type = 'income' AND status = 'completed' THEN amount ELSE -amount END) as net
        FROM financial_transactions
        WHERE date BETWEEN p_start_date AND p_end_date
          AND professional_id = p_professional_id
        GROUP BY date_trunc('month', date)
        ORDER BY date_trunc('month', date)
      ) monthly
    )
  ) INTO v_result
  FROM financial_transactions
  WHERE date BETWEEN p_start_date AND p_end_date
    AND professional_id = p_professional_id;

  RETURN v_result;
END;
$$;