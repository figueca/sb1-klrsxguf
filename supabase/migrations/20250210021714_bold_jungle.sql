/*
  # Schema do Módulo de Pacientes

  1. Novas Tabelas
    - `patients`
      - Informações básicas do paciente
      - Dados de contato
      - Informações demográficas
    - `medical_records`
      - Prontuário eletrônico
      - Histórico médico
    - `appointments`
      - Consultas e agendamentos
      - Status e tipo de consulta

  2. Security
    - RLS habilitado em todas as tabelas
    - Políticas de acesso baseadas no profissional responsável
*/

-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES profiles(id),
  full_name text NOT NULL,
  email text,
  phone text,
  birth_date date,
  gender text,
  address text,
  city text,
  state text,
  emergency_contact text,
  emergency_phone text,
  health_insurance text,
  insurance_number text,
  notes text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de prontuários
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id),
  date timestamptz DEFAULT now(),
  record_type text NOT NULL,
  description text NOT NULL,
  diagnosis text,
  prescription text,
  attachments jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de consultas
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES profiles(id),
  date date NOT NULL,
  time time NOT NULL,
  duration interval DEFAULT '50 minutes',
  type text NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  online boolean DEFAULT false,
  meeting_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para pacientes
CREATE POLICY "Profissionais podem ver seus pacientes"
  ON patients
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

CREATE POLICY "Profissionais podem adicionar pacientes"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Profissionais podem atualizar seus pacientes"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Profissionais podem deletar seus pacientes"
  ON patients
  FOR DELETE
  TO authenticated
  USING (professional_id = auth.uid());

-- Políticas de segurança para prontuários
CREATE POLICY "Profissionais podem ver prontuários de seus pacientes"
  ON medical_records
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

CREATE POLICY "Profissionais podem adicionar prontuários"
  ON medical_records
  FOR INSERT
  TO authenticated
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Profissionais podem atualizar prontuários"
  ON medical_records
  FOR UPDATE
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Políticas de segurança para consultas
CREATE POLICY "Profissionais podem ver suas consultas"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

CREATE POLICY "Profissionais podem agendar consultas"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Profissionais podem atualizar consultas"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Profissionais podem cancelar consultas"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (professional_id = auth.uid());

-- Funções auxiliares
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática de updated_at
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_medical_records_updated_at
  BEFORE UPDATE ON medical_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();