export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      acjef_relatorios: {
        Row: {
          ano: number;
          created_at: string;
          criado_por: string | null;
          dados: Json;
          empresa_id: string;
          id: string;
          mes: number;
          observacoes: string | null;
          status: Database["public"]["Enums"]["acjef_status"];
          updated_at: string;
          validado_em: string | null;
          validado_por: string | null;
        };
        Insert: {
          ano: number;
          created_at?: string;
          criado_por?: string | null;
          dados?: Json;
          empresa_id: string;
          id?: string;
          mes: number;
          observacoes?: string | null;
          status?: Database["public"]["Enums"]["acjef_status"];
          updated_at?: string;
          validado_em?: string | null;
          validado_por?: string | null;
        };
        Update: {
          ano?: number;
          created_at?: string;
          criado_por?: string | null;
          dados?: Json;
          empresa_id?: string;
          id?: string;
          mes?: number;
          observacoes?: string | null;
          status?: Database["public"]["Enums"]["acjef_status"];
          updated_at?: string;
          validado_em?: string | null;
          validado_por?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "acjef_relatorios_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      acjef_trabalhadores: {
        Row: {
          cargo: string | null;
          cpf: string;
          created_at: string;
          desvios_mes: Json;
          id: string;
          jornada_contratual: string;
          nome: string;
          observacoes: string | null;
          relatorio_id: string;
          tipo_compensacao: Database["public"]["Enums"]["acjef_tipo_compensacao"];
          user_id: string;
        };
        Insert: {
          cargo?: string | null;
          cpf: string;
          created_at?: string;
          desvios_mes?: Json;
          id?: string;
          jornada_contratual: string;
          nome: string;
          observacoes?: string | null;
          relatorio_id: string;
          tipo_compensacao: Database["public"]["Enums"]["acjef_tipo_compensacao"];
          user_id: string;
        };
        Update: {
          cargo?: string | null;
          cpf?: string;
          created_at?: string;
          desvios_mes?: Json;
          id?: string;
          jornada_contratual?: string;
          nome?: string;
          observacoes?: string | null;
          relatorio_id?: string;
          tipo_compensacao?: Database["public"]["Enums"]["acjef_tipo_compensacao"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "acjef_trabalhadores_relatorio_id_fkey";
            columns: ["relatorio_id"];
            isOneToOne: false;
            referencedRelation: "acjef_relatorios";
            referencedColumns: ["id"];
          },
        ];
      };
      acoes_obrigatorias: {
        Row: {
          ativo: boolean | null;
          base_legal: string;
          categoria: string;
          created_at: string;
          empresa_id: string | null;
          id: string;
          nome: string;
          orgao: string;
          penalidade: string;
          prazo: string;
          recorrencia: string;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean | null;
          base_legal: string;
          categoria: string;
          created_at?: string;
          empresa_id?: string | null;
          id: string;
          nome: string;
          orgao: string;
          penalidade: string;
          prazo: string;
          recorrencia: string;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean | null;
          base_legal?: string;
          categoria?: string;
          created_at?: string;
          empresa_id?: string | null;
          id?: string;
          nome?: string;
          orgao?: string;
          penalidade?: string;
          prazo?: string;
          recorrencia?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "acoes_obrigatorias_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      admissao_documentos: {
        Row: {
          admissao_id: string;
          arquivo_path: string;
          categoria: Database["public"]["Enums"]["admissao_doc_categoria"];
          created_at: string;
          enviado_por_publico: boolean;
          fase: string;
          id: string;
          mime_type: string | null;
          nome_arquivo: string;
          observacao_revisao: string | null;
          ocr_erro: string | null;
          ocr_metadata: Json;
          ocr_redigido_em: string | null;
          ocr_redigido_por: string | null;
          ocr_resultado: Json | null;
          ocr_status: string;
          revisado_em: string | null;
          revisado_por: string | null;
          status_revisao: Database["public"]["Enums"]["admissao_doc_status_revisao"];
          tamanho_bytes: number | null;
          uploaded_by: string | null;
        };
        Insert: {
          admissao_id: string;
          arquivo_path: string;
          categoria: Database["public"]["Enums"]["admissao_doc_categoria"];
          created_at?: string;
          enviado_por_publico?: boolean;
          fase?: string;
          id?: string;
          mime_type?: string | null;
          nome_arquivo: string;
          observacao_revisao?: string | null;
          ocr_erro?: string | null;
          ocr_metadata?: Json;
          ocr_redigido_em?: string | null;
          ocr_redigido_por?: string | null;
          ocr_resultado?: Json | null;
          ocr_status?: string;
          revisado_em?: string | null;
          revisado_por?: string | null;
          status_revisao?: Database["public"]["Enums"]["admissao_doc_status_revisao"];
          tamanho_bytes?: number | null;
          uploaded_by?: string | null;
        };
        Update: {
          admissao_id?: string;
          arquivo_path?: string;
          categoria?: Database["public"]["Enums"]["admissao_doc_categoria"];
          created_at?: string;
          enviado_por_publico?: boolean;
          fase?: string;
          id?: string;
          mime_type?: string | null;
          nome_arquivo?: string;
          observacao_revisao?: string | null;
          ocr_erro?: string | null;
          ocr_metadata?: Json;
          ocr_redigido_em?: string | null;
          ocr_redigido_por?: string | null;
          ocr_resultado?: Json | null;
          ocr_status?: string;
          revisado_em?: string | null;
          revisado_por?: string | null;
          status_revisao?: Database["public"]["Enums"]["admissao_doc_status_revisao"];
          tamanho_bytes?: number | null;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admissao_documentos_admissao_id_fkey";
            columns: ["admissao_id"];
            isOneToOne: false;
            referencedRelation: "admissoes";
            referencedColumns: ["id"];
          },
        ];
      };
      admissao_links_coleta: {
        Row: {
          admissao_id: string;
          ativo: boolean;
          created_at: string;
          criado_por: string;
          docs_opcionais: string[];
          email_destino: string | null;
          empresa_id: string;
          expira_em: string;
          id: string;
          token: string;
          ultima_visita_em: string | null;
          usado_em: string | null;
          visitas: number;
          whatsapp_destino: string | null;
        };
        Insert: {
          admissao_id: string;
          ativo?: boolean;
          created_at?: string;
          criado_por: string;
          docs_opcionais?: string[];
          email_destino?: string | null;
          empresa_id: string;
          expira_em: string;
          id?: string;
          token: string;
          ultima_visita_em?: string | null;
          usado_em?: string | null;
          visitas?: number;
          whatsapp_destino?: string | null;
        };
        Update: {
          admissao_id?: string;
          ativo?: boolean;
          created_at?: string;
          criado_por?: string;
          docs_opcionais?: string[];
          email_destino?: string | null;
          empresa_id?: string;
          expira_em?: string;
          id?: string;
          token?: string;
          ultima_visita_em?: string | null;
          usado_em?: string | null;
          visitas?: number;
          whatsapp_destino?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "admissao_links_coleta_admissao_id_fkey";
            columns: ["admissao_id"];
            isOneToOne: false;
            referencedRelation: "admissoes";
            referencedColumns: ["id"];
          },
        ];
      };
      admissoes: {
        Row: {
          created_at: string;
          criado_por: string;
          dados: Json;
          empresa_id: string;
          esocial_enviado_em: string | null;
          esocial_evento_id: string | null;
          esocial_status: string;
          id: string;
          observacoes: string | null;
          status: Database["public"]["Enums"]["admissao_status"];
          unidade_id: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          criado_por: string;
          dados?: Json;
          empresa_id: string;
          esocial_enviado_em?: string | null;
          esocial_evento_id?: string | null;
          esocial_status?: string;
          id?: string;
          observacoes?: string | null;
          status?: Database["public"]["Enums"]["admissao_status"];
          unidade_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          criado_por?: string;
          dados?: Json;
          empresa_id?: string;
          esocial_enviado_em?: string | null;
          esocial_evento_id?: string | null;
          esocial_status?: string;
          id?: string;
          observacoes?: string | null;
          status?: Database["public"]["Enums"]["admissao_status"];
          unidade_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      afastamentos: {
        Row: {
          cid_informado: string | null;
          created_at: string | null;
          data_fim_prevista: string | null;
          data_fim_real: string | null;
          data_inicio: string;
          dias_total: number | null;
          empresa_id: string;
          esocial_recibo: string | null;
          esocial_status: string;
          id: string;
          status: string;
          tipo: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cid_informado?: string | null;
          created_at?: string | null;
          data_fim_prevista?: string | null;
          data_fim_real?: string | null;
          data_inicio: string;
          dias_total?: number | null;
          empresa_id: string;
          esocial_recibo?: string | null;
          esocial_status?: string;
          id?: string;
          status?: string;
          tipo: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cid_informado?: string | null;
          created_at?: string | null;
          data_fim_prevista?: string | null;
          data_fim_real?: string | null;
          data_inicio?: string;
          dias_total?: number | null;
          empresa_id?: string;
          esocial_recibo?: string | null;
          esocial_status?: string;
          id?: string;
          status?: string;
          tipo?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "afastamentos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      afd_exports: {
        Row: {
          empresa_id: string;
          formato: string;
          gerado_em: string;
          gerado_por: string | null;
          hash_arquivo: string | null;
          id: string;
          nsr_fim: number | null;
          nsr_inicio: number | null;
          periodo_fim: string;
          periodo_inicio: string;
          ponto_origem_id: string;
          qtd_marcacoes: number | null;
          storage_path: string | null;
        };
        Insert: {
          empresa_id: string;
          formato: string;
          gerado_em?: string;
          gerado_por?: string | null;
          hash_arquivo?: string | null;
          id?: string;
          nsr_fim?: number | null;
          nsr_inicio?: number | null;
          periodo_fim: string;
          periodo_inicio: string;
          ponto_origem_id: string;
          qtd_marcacoes?: number | null;
          storage_path?: string | null;
        };
        Update: {
          empresa_id?: string;
          formato?: string;
          gerado_em?: string;
          gerado_por?: string | null;
          hash_arquivo?: string | null;
          id?: string;
          nsr_fim?: number | null;
          nsr_inicio?: number | null;
          periodo_fim?: string;
          periodo_inicio?: string;
          ponto_origem_id?: string;
          qtd_marcacoes?: number | null;
          storage_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "afd_exports_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "afd_exports_ponto_origem_id_fkey";
            columns: ["ponto_origem_id"];
            isOneToOne: false;
            referencedRelation: "ponto_origens";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_tokens: {
        Row: {
          ativo: boolean;
          created_at: string;
          empresa_id: string;
          escopo: string[];
          id: string;
          nome: string;
          revogado_em: string | null;
          revogado_por: string | null;
          token_hash: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          empresa_id: string;
          escopo?: string[];
          id?: string;
          nome: string;
          revogado_em?: string | null;
          revogado_por?: string | null;
          token_hash: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          empresa_id?: string;
          escopo?: string[];
          id?: string;
          nome?: string;
          revogado_em?: string | null;
          revogado_por?: string | null;
          token_hash?: string;
        };
        Relationships: [
          {
            foreignKeyName: "agent_tokens_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_interaction_logs: {
        Row: {
          created_at: string;
          custo_usd: number;
          duracao_ms: number | null;
          empresa_id: string | null;
          erro_mensagem: string | null;
          feature: string;
          id: string;
          modelo: string;
          modulo: string | null;
          prompt_resumo: string | null;
          resposta_resumo: string | null;
          status: string;
          tela: string | null;
          tokens_input: number;
          tokens_output: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          custo_usd?: number;
          duracao_ms?: number | null;
          empresa_id?: string | null;
          erro_mensagem?: string | null;
          feature: string;
          id?: string;
          modelo: string;
          modulo?: string | null;
          prompt_resumo?: string | null;
          resposta_resumo?: string | null;
          status?: string;
          tela?: string | null;
          tokens_input?: number;
          tokens_output?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          custo_usd?: number;
          duracao_ms?: number | null;
          empresa_id?: string | null;
          erro_mensagem?: string | null;
          feature?: string;
          id?: string;
          modelo?: string;
          modulo?: string | null;
          prompt_resumo?: string | null;
          resposta_resumo?: string | null;
          status?: string;
          tela?: string | null;
          tokens_input?: number;
          tokens_output?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      ai_prompt_versions: {
        Row: {
          alterado_por: string;
          created_at: string;
          empresa_id: string;
          id: string;
          motivo: string | null;
          prompt_anterior: string | null;
          prompt_novo: string;
        };
        Insert: {
          alterado_por: string;
          created_at?: string;
          empresa_id: string;
          id?: string;
          motivo?: string | null;
          prompt_anterior?: string | null;
          prompt_novo: string;
        };
        Update: {
          alterado_por?: string;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          motivo?: string | null;
          prompt_anterior?: string | null;
          prompt_novo?: string;
        };
        Relationships: [];
      };
      ai_provider_credentials: {
        Row: {
          api_key_ciphertext: string;
          created_at: string;
          empresa_id: string;
          id: string;
          key_id: string | null;
          provider: string;
          rotated_at: string | null;
        };
        Insert: {
          api_key_ciphertext: string;
          created_at?: string;
          empresa_id: string;
          id?: string;
          key_id?: string | null;
          provider: string;
          rotated_at?: string | null;
        };
        Update: {
          api_key_ciphertext?: string;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          key_id?: string | null;
          provider?: string;
          rotated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ai_provider_credentials_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_settings: {
        Row: {
          anonimizar_dados: boolean;
          api_key_last4: string | null;
          api_key_plaintext: string | null;
          api_key_vault_id: string | null;
          bloquear_dados_financeiros: boolean;
          created_at: string;
          custo_estimado_usd_mes: number;
          empresa_id: string;
          enable_busca: boolean;
          enable_chat: boolean;
          enable_form_sugestoes: boolean;
          enable_geracao_texto: boolean;
          enable_insights: boolean;
          enable_rag: boolean | null;
          enable_relatorios_nl: boolean;
          id: string;
          idioma: string;
          max_tokens: number;
          mes_referencia: string | null;
          model: string;
          provider: string;
          system_prompt: string;
          temperatura: string;
          tokens_mes: number;
          updated_at: string;
        };
        Insert: {
          anonimizar_dados?: boolean;
          api_key_last4?: string | null;
          api_key_plaintext?: string | null;
          api_key_vault_id?: string | null;
          bloquear_dados_financeiros?: boolean;
          created_at?: string;
          custo_estimado_usd_mes?: number;
          empresa_id: string;
          enable_busca?: boolean;
          enable_chat?: boolean;
          enable_form_sugestoes?: boolean;
          enable_geracao_texto?: boolean;
          enable_insights?: boolean;
          enable_rag?: boolean | null;
          enable_relatorios_nl?: boolean;
          id?: string;
          idioma?: string;
          max_tokens?: number;
          mes_referencia?: string | null;
          model?: string;
          provider?: string;
          system_prompt?: string;
          temperatura?: string;
          tokens_mes?: number;
          updated_at?: string;
        };
        Update: {
          anonimizar_dados?: boolean;
          api_key_last4?: string | null;
          api_key_plaintext?: string | null;
          api_key_vault_id?: string | null;
          bloquear_dados_financeiros?: boolean;
          created_at?: string;
          custo_estimado_usd_mes?: number;
          empresa_id?: string;
          enable_busca?: boolean;
          enable_chat?: boolean;
          enable_form_sugestoes?: boolean;
          enable_geracao_texto?: boolean;
          enable_insights?: boolean;
          enable_rag?: boolean | null;
          enable_relatorios_nl?: boolean;
          id?: string;
          idioma?: string;
          max_tokens?: number;
          mes_referencia?: string | null;
          model?: string;
          provider?: string;
          system_prompt?: string;
          temperatura?: string;
          tokens_mes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      apuracoes_mes: {
        Row: {
          ano: number;
          avisos: Json | null;
          created_at: string;
          dias: Json | null;
          empresa_id: string;
          fechado_em: string | null;
          fechado_por: string | null;
          hash_sha256: string | null;
          id: string;
          mes: number;
          motivo_reabertura: string | null;
          periodo_fim: string;
          periodo_inicio: string;
          politica_id: string | null;
          reaberto_em: string | null;
          reaberto_por: string | null;
          sig_b64: string | null;
          sig_key_id: string | null;
          status: Database["public"]["Enums"]["apuracao_mes_status"];
          totais: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          ano: number;
          avisos?: Json | null;
          created_at?: string;
          dias?: Json | null;
          empresa_id: string;
          fechado_em?: string | null;
          fechado_por?: string | null;
          hash_sha256?: string | null;
          id?: string;
          mes: number;
          motivo_reabertura?: string | null;
          periodo_fim: string;
          periodo_inicio: string;
          politica_id?: string | null;
          reaberto_em?: string | null;
          reaberto_por?: string | null;
          sig_b64?: string | null;
          sig_key_id?: string | null;
          status?: Database["public"]["Enums"]["apuracao_mes_status"];
          totais: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          ano?: number;
          avisos?: Json | null;
          created_at?: string;
          dias?: Json | null;
          empresa_id?: string;
          fechado_em?: string | null;
          fechado_por?: string | null;
          hash_sha256?: string | null;
          id?: string;
          mes?: number;
          motivo_reabertura?: string | null;
          periodo_fim?: string;
          periodo_inicio?: string;
          politica_id?: string | null;
          reaberto_em?: string | null;
          reaberto_por?: string | null;
          sig_b64?: string | null;
          sig_key_id?: string | null;
          status?: Database["public"]["Enums"]["apuracao_mes_status"];
          totais?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "apuracoes_mes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "apuracoes_mes_politica_id_fkey";
            columns: ["politica_id"];
            isOneToOne: false;
            referencedRelation: "politicas_trabalhistas";
            referencedColumns: ["id"];
          },
        ];
      };
      apuracoes_mes_snapshots: {
        Row: {
          ano: number;
          apuracao_mes_id: string;
          empresa_id: string;
          gerado_em: string;
          gerado_por: string | null;
          id: string;
          mes: number;
          motivo: string | null;
          snapshot_hash: string;
          snapshot_json: Json;
          user_id: string;
          versao: number;
        };
        Insert: {
          ano: number;
          apuracao_mes_id: string;
          empresa_id: string;
          gerado_em?: string;
          gerado_por?: string | null;
          id?: string;
          mes: number;
          motivo?: string | null;
          snapshot_hash: string;
          snapshot_json: Json;
          user_id: string;
          versao?: number;
        };
        Update: {
          ano?: number;
          apuracao_mes_id?: string;
          empresa_id?: string;
          gerado_em?: string;
          gerado_por?: string | null;
          id?: string;
          mes?: number;
          motivo?: string | null;
          snapshot_hash?: string;
          snapshot_json?: Json;
          user_id?: string;
          versao?: number;
        };
        Relationships: [
          {
            foreignKeyName: "apuracoes_mes_snapshots_apuracao_mes_id_fkey";
            columns: ["apuracao_mes_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "apuracoes_mes_snapshots_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          action: string;
          admissao_id: string | null;
          cpf_hash: string | null;
          created_at: string | null;
          dados_antes: Json | null;
          dados_depois: Json | null;
          empresa_id: string | null;
          erro_code: string | null;
          executed_at: string | null;
          executor_email: string | null;
          executor_id: string;
          id: number;
          ip_address: string | null;
          profile_id: string | null;
          profile_mode: string | null;
          status: string | null;
          user_agent: string | null;
        };
        Insert: {
          action: string;
          admissao_id?: string | null;
          cpf_hash?: string | null;
          created_at?: string | null;
          dados_antes?: Json | null;
          dados_depois?: Json | null;
          empresa_id?: string | null;
          erro_code?: string | null;
          executed_at?: string | null;
          executor_email?: string | null;
          executor_id: string;
          id?: number;
          ip_address?: string | null;
          profile_id?: string | null;
          profile_mode?: string | null;
          status?: string | null;
          user_agent?: string | null;
        };
        Update: {
          action?: string;
          admissao_id?: string | null;
          cpf_hash?: string | null;
          created_at?: string | null;
          dados_antes?: Json | null;
          dados_depois?: Json | null;
          empresa_id?: string | null;
          erro_code?: string | null;
          executed_at?: string | null;
          executor_email?: string | null;
          executor_id?: string;
          id?: number;
          ip_address?: string | null;
          profile_id?: string | null;
          profile_mode?: string | null;
          status?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_admissao_id_fkey";
            columns: ["admissao_id"];
            isOneToOne: false;
            referencedRelation: "admissoes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_log_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_log_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_log_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      auditoria: {
        Row: {
          acao: string;
          autor_id: string;
          created_at: string;
          detalhes: Json | null;
          empresa_id: string | null;
          entidade: string | null;
          entidade_id: string | null;
          id: string;
          ip: string | null;
          user_agent: string | null;
        };
        Insert: {
          acao: string;
          autor_id: string;
          created_at?: string;
          detalhes?: Json | null;
          empresa_id?: string | null;
          entidade?: string | null;
          entidade_id?: string | null;
          id?: string;
          ip?: string | null;
          user_agent?: string | null;
        };
        Update: {
          acao?: string;
          autor_id?: string;
          created_at?: string;
          detalhes?: Json | null;
          empresa_id?: string | null;
          entidade?: string | null;
          entidade_id?: string | null;
          id?: string;
          ip?: string | null;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      ausencias: {
        Row: {
          created_at: string;
          data: string;
          empresa_id: string;
          horas: number | null;
          id: string;
          justificativa: string | null;
          solicitacao_id: string | null;
          status: string;
          tipo: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data: string;
          empresa_id: string;
          horas?: number | null;
          id?: string;
          justificativa?: string | null;
          solicitacao_id?: string | null;
          status?: string;
          tipo?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: string;
          empresa_id?: string;
          horas?: number | null;
          id?: string;
          justificativa?: string | null;
          solicitacao_id?: string | null;
          status?: string;
          tipo?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      automation_alert_states: {
        Row: {
          created_at: string;
          empresa_id: string;
          fingerprint: string;
          first_seen_at: string;
          id: string;
          last_notified_at: string | null;
          last_seen_at: string;
          metadata: Json;
          nivel: string;
          referencia_id: string;
          referencia_tipo: string;
          resolved_at: string | null;
          status: string;
          tipo: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          empresa_id: string;
          fingerprint: string;
          first_seen_at?: string;
          id?: string;
          last_notified_at?: string | null;
          last_seen_at?: string;
          metadata?: Json;
          nivel?: string;
          referencia_id: string;
          referencia_tipo: string;
          resolved_at?: string | null;
          status?: string;
          tipo: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          empresa_id?: string;
          fingerprint?: string;
          first_seen_at?: string;
          id?: string;
          last_notified_at?: string | null;
          last_seen_at?: string;
          metadata?: Json;
          nivel?: string;
          referencia_id?: string;
          referencia_tipo?: string;
          resolved_at?: string | null;
          status?: string;
          tipo?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "automation_alert_states_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      automation_executions: {
        Row: {
          automation_id: string;
          empresa_id: string;
          executado_em: string;
          id: string;
          resultado: Json | null;
          status: string;
        };
        Insert: {
          automation_id: string;
          empresa_id: string;
          executado_em?: string;
          id?: string;
          resultado?: Json | null;
          status?: string;
        };
        Update: {
          automation_id?: string;
          empresa_id?: string;
          executado_em?: string;
          id?: string;
          resultado?: Json | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_executions_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      automation_policies: {
        Row: {
          acao: Json;
          ativo: boolean;
          codigo: string;
          condicoes: Json;
          created_at: string;
          descricao: string | null;
          empresa_id: string;
          id: string;
          nome: string;
          prioridade: number;
          tabela_alvo: string;
          tipo: string;
          updated_at: string;
        };
        Insert: {
          acao?: Json;
          ativo?: boolean;
          codigo: string;
          condicoes?: Json;
          created_at?: string;
          descricao?: string | null;
          empresa_id: string;
          id?: string;
          nome: string;
          prioridade?: number;
          tabela_alvo: string;
          tipo: string;
          updated_at?: string;
        };
        Update: {
          acao?: Json;
          ativo?: boolean;
          codigo?: string;
          condicoes?: Json;
          created_at?: string;
          descricao?: string | null;
          empresa_id?: string;
          id?: string;
          nome?: string;
          prioridade?: number;
          tabela_alvo?: string;
          tipo?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "automation_policies_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      banco_horas_lancamentos: {
        Row: {
          anotacao: string | null;
          apuracao_mes_id: string | null;
          base_legal_vencimento: string | null;
          competencia_ano: number | null;
          competencia_mes: number | null;
          consolidado_em: string | null;
          created_at: string;
          criado_por: string | null;
          data_referencia: string;
          definitivo: boolean;
          descricao: string | null;
          empresa_id: string | null;
          id: string;
          marcacao_id: string | null;
          minutos: number;
          origem: Database["public"]["Enums"]["banco_origem"];
          percentual_tipo: number | null;
          politica_bh_id: string | null;
          saldo_apos: number | null;
          solicitacao_id: string | null;
          substituido_por_id: string | null;
          tipo: Database["public"]["Enums"]["banco_tipo"];
          tipo_dia: string | null;
          user_id: string;
          vencimento: string | null;
          vencimento_calculado_em: string | null;
          vencimento_meses_aplicado: number | null;
        };
        Insert: {
          anotacao?: string | null;
          apuracao_mes_id?: string | null;
          base_legal_vencimento?: string | null;
          competencia_ano?: number | null;
          competencia_mes?: number | null;
          consolidado_em?: string | null;
          created_at?: string;
          criado_por?: string | null;
          data_referencia?: string;
          definitivo?: boolean;
          descricao?: string | null;
          empresa_id?: string | null;
          id?: string;
          marcacao_id?: string | null;
          minutos: number;
          origem?: Database["public"]["Enums"]["banco_origem"];
          percentual_tipo?: number | null;
          politica_bh_id?: string | null;
          saldo_apos?: number | null;
          solicitacao_id?: string | null;
          substituido_por_id?: string | null;
          tipo: Database["public"]["Enums"]["banco_tipo"];
          tipo_dia?: string | null;
          user_id: string;
          vencimento?: string | null;
          vencimento_calculado_em?: string | null;
          vencimento_meses_aplicado?: number | null;
        };
        Update: {
          anotacao?: string | null;
          apuracao_mes_id?: string | null;
          base_legal_vencimento?: string | null;
          competencia_ano?: number | null;
          competencia_mes?: number | null;
          consolidado_em?: string | null;
          created_at?: string;
          criado_por?: string | null;
          data_referencia?: string;
          definitivo?: boolean;
          descricao?: string | null;
          empresa_id?: string | null;
          id?: string;
          marcacao_id?: string | null;
          minutos?: number;
          origem?: Database["public"]["Enums"]["banco_origem"];
          percentual_tipo?: number | null;
          politica_bh_id?: string | null;
          saldo_apos?: number | null;
          solicitacao_id?: string | null;
          substituido_por_id?: string | null;
          tipo?: Database["public"]["Enums"]["banco_tipo"];
          tipo_dia?: string | null;
          user_id?: string;
          vencimento?: string | null;
          vencimento_calculado_em?: string | null;
          vencimento_meses_aplicado?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "banco_horas_lancamentos_apuracao_mes_id_fkey";
            columns: ["apuracao_mes_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "banco_horas_lancamentos_politica_bh_id_fkey";
            columns: ["politica_bh_id"];
            isOneToOne: false;
            referencedRelation: "politicas_bh";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "banco_horas_lancamentos_substituido_por_id_fkey";
            columns: ["substituido_por_id"];
            isOneToOne: false;
            referencedRelation: "banco_horas_lancamentos";
            referencedColumns: ["id"];
          },
        ];
      };
      beneficios_empresa: {
        Row: {
          ativo: boolean | null;
          created_at: string | null;
          desconto_colaborador: number | null;
          elegibilidade: Json | null;
          empresa_id: string;
          id: string;
          nome: string;
          tipo: string;
          updated_at: string | null;
          valor_padrao: number | null;
        };
        Insert: {
          ativo?: boolean | null;
          created_at?: string | null;
          desconto_colaborador?: number | null;
          elegibilidade?: Json | null;
          empresa_id: string;
          id?: string;
          nome: string;
          tipo: string;
          updated_at?: string | null;
          valor_padrao?: number | null;
        };
        Update: {
          ativo?: boolean | null;
          created_at?: string | null;
          desconto_colaborador?: number | null;
          elegibilidade?: Json | null;
          empresa_id?: string;
          id?: string;
          nome?: string;
          tipo?: string;
          updated_at?: string | null;
          valor_padrao?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "beneficios_empresa_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      beneficios_empresa_audit: {
        Row: {
          acao: string;
          beneficio_id: string | null;
          created_at: string | null;
          empresa_id: string;
          id: string;
          ip_address: string | null;
          mudancas: Json | null;
          user_agent: string | null;
          usuario_id: string | null;
        };
        Insert: {
          acao: string;
          beneficio_id?: string | null;
          created_at?: string | null;
          empresa_id: string;
          id?: string;
          ip_address?: string | null;
          mudancas?: Json | null;
          user_agent?: string | null;
          usuario_id?: string | null;
        };
        Update: {
          acao?: string;
          beneficio_id?: string | null;
          created_at?: string | null;
          empresa_id?: string;
          id?: string;
          ip_address?: string | null;
          mudancas?: Json | null;
          user_agent?: string | null;
          usuario_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "beneficios_empresa_audit_beneficio_id_fkey";
            columns: ["beneficio_id"];
            isOneToOne: false;
            referencedRelation: "beneficios_empresa";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "beneficios_empresa_audit_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      cargos_funcoes: {
        Row: {
          ativo: boolean;
          cbo: string;
          cnh: boolean;
          codigo: string;
          created_at: string;
          empresa_id: string;
          id: string;
          nivel: string;
          nome: string;
          piso: number;
          teto: number;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          cbo?: string;
          cnh?: boolean;
          codigo?: string;
          created_at?: string;
          empresa_id: string;
          id?: string;
          nivel?: string;
          nome: string;
          piso?: number;
          teto?: number;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          cbo?: string;
          cnh?: boolean;
          codigo?: string;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          nivel?: string;
          nome?: string;
          piso?: number;
          teto?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cargos_funcoes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      cat_comunicacoes: {
        Row: {
          afastamento_id: string | null;
          created_at: string | null;
          data_acidente: string;
          documento_id: string | null;
          empresa_id: string;
          esocial_recibo: string | null;
          esocial_status: string;
          hora_acidente: string | null;
          houve_afastamento: boolean;
          id: string;
          local_acidente: string | null;
          protocolo_cat: string | null;
          status: string;
          tipo_acidente: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          afastamento_id?: string | null;
          created_at?: string | null;
          data_acidente: string;
          documento_id?: string | null;
          empresa_id: string;
          esocial_recibo?: string | null;
          esocial_status?: string;
          hora_acidente?: string | null;
          houve_afastamento?: boolean;
          id?: string;
          local_acidente?: string | null;
          protocolo_cat?: string | null;
          status?: string;
          tipo_acidente: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          afastamento_id?: string | null;
          created_at?: string | null;
          data_acidente?: string;
          documento_id?: string | null;
          empresa_id?: string;
          esocial_recibo?: string | null;
          esocial_status?: string;
          hora_acidente?: string | null;
          houve_afastamento?: boolean;
          id?: string;
          local_acidente?: string | null;
          protocolo_cat?: string | null;
          status?: string;
          tipo_acidente?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cat_comunicacoes_afastamento_id_fkey";
            columns: ["afastamento_id"];
            isOneToOne: false;
            referencedRelation: "afastamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cat_comunicacoes_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cat_comunicacoes_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cat_comunicacoes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      centros_custo: {
        Row: {
          ativo: boolean;
          codigo: string;
          created_at: string;
          descricao: string;
          empresa_id: string;
          id: string;
          nome: string;
          orcamento: number;
          percentual_rateio: number;
          responsavel: string;
          tipo: string;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          codigo: string;
          created_at?: string;
          descricao?: string;
          empresa_id: string;
          id?: string;
          nome: string;
          orcamento?: number;
          percentual_rateio?: number;
          responsavel?: string;
          tipo?: string;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          codigo?: string;
          created_at?: string;
          descricao?: string;
          empresa_id?: string;
          id?: string;
          nome?: string;
          orcamento?: number;
          percentual_rateio?: number;
          responsavel?: string;
          tipo?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "centros_custo_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      colaborador_beneficios_audit: {
        Row: {
          acao: string;
          beneficio_id: string;
          colaborador_id: string;
          created_at: string | null;
          id: string;
          usuario_id: string | null;
          valor_anterior: string | null;
          valor_novo: string | null;
        };
        Insert: {
          acao: string;
          beneficio_id: string;
          colaborador_id: string;
          created_at?: string | null;
          id?: string;
          usuario_id?: string | null;
          valor_anterior?: string | null;
          valor_novo?: string | null;
        };
        Update: {
          acao?: string;
          beneficio_id?: string;
          colaborador_id?: string;
          created_at?: string | null;
          id?: string;
          usuario_id?: string | null;
          valor_anterior?: string | null;
          valor_novo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "colaborador_beneficios_audit_beneficio_id_fkey";
            columns: ["beneficio_id"];
            isOneToOne: false;
            referencedRelation: "beneficios_empresa";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "colaborador_beneficios_audit_colaborador_id_fkey";
            columns: ["colaborador_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "colaborador_beneficios_audit_colaborador_id_fkey";
            columns: ["colaborador_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      colaborador_dados_bancarios: {
        Row: {
          agencia: string | null;
          banco_nome: string | null;
          conta: string | null;
          created_at: string;
          empresa_id: string;
          id: string;
          pix: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          agencia?: string | null;
          banco_nome?: string | null;
          conta?: string | null;
          created_at?: string;
          empresa_id: string;
          id?: string;
          pix?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          agencia?: string | null;
          banco_nome?: string | null;
          conta?: string | null;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          pix?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "colaborador_dados_bancarios_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      comp_pontuais_colaboradores: {
        Row: {
          aceite_em: string | null;
          aprovado_em: string | null;
          aprovado_por: string | null;
          created_at: string;
          evento_id: string;
          horas_compensadas_min: number;
          horas_devidas_min: number;
          id: string;
          obs: string | null;
          prazo_individual: string | null;
          status: Database["public"]["Enums"]["comp_pontual_status_colab"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          aceite_em?: string | null;
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          created_at?: string;
          evento_id: string;
          horas_compensadas_min?: number;
          horas_devidas_min: number;
          id?: string;
          obs?: string | null;
          prazo_individual?: string | null;
          status?: Database["public"]["Enums"]["comp_pontual_status_colab"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          aceite_em?: string | null;
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          created_at?: string;
          evento_id?: string;
          horas_compensadas_min?: number;
          horas_devidas_min?: number;
          id?: string;
          obs?: string | null;
          prazo_individual?: string | null;
          status?: Database["public"]["Enums"]["comp_pontual_status_colab"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comp_pontuais_colaboradores_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "comp_pontuais_eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      comp_pontuais_eventos: {
        Row: {
          created_at: string;
          criado_por: string | null;
          data_fim: string;
          data_inicio: string;
          documento_url: string | null;
          empresa_id: string | null;
          exige_aceite: boolean;
          exige_aprovacao: boolean;
          feriado_referencia: string | null;
          forma_compensacao: Database["public"]["Enums"]["comp_pontual_forma"];
          horas_devidas_min: number;
          id: string;
          nome: string;
          obs: string | null;
          prazo_compensacao: string;
          status: Database["public"]["Enums"]["comp_pontual_status_evento"];
          tipo: Database["public"]["Enums"]["comp_pontual_tipo"];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          criado_por?: string | null;
          data_fim: string;
          data_inicio: string;
          documento_url?: string | null;
          empresa_id?: string | null;
          exige_aceite?: boolean;
          exige_aprovacao?: boolean;
          feriado_referencia?: string | null;
          forma_compensacao?: Database["public"]["Enums"]["comp_pontual_forma"];
          horas_devidas_min?: number;
          id?: string;
          nome: string;
          obs?: string | null;
          prazo_compensacao: string;
          status?: Database["public"]["Enums"]["comp_pontual_status_evento"];
          tipo: Database["public"]["Enums"]["comp_pontual_tipo"];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          criado_por?: string | null;
          data_fim?: string;
          data_inicio?: string;
          documento_url?: string | null;
          empresa_id?: string | null;
          exige_aceite?: boolean;
          exige_aprovacao?: boolean;
          feriado_referencia?: string | null;
          forma_compensacao?: Database["public"]["Enums"]["comp_pontual_forma"];
          horas_devidas_min?: number;
          id?: string;
          nome?: string;
          obs?: string | null;
          prazo_compensacao?: string;
          status?: Database["public"]["Enums"]["comp_pontual_status_evento"];
          tipo?: Database["public"]["Enums"]["comp_pontual_tipo"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comp_pontuais_eventos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      comp_pontuais_lancamentos: {
        Row: {
          banco_horas_lancamento_id: string | null;
          colaborador_comp_id: string;
          created_at: string;
          data_compensacao: string;
          empresa_id: string;
          estornado_em: string | null;
          estornado_por: string | null;
          evento_id: string;
          id: string;
          minutos: number;
          motivo_estorno: string | null;
          obs: string | null;
          origem: string;
          registrado_em: string;
          registrado_por: string;
          tipo: string;
          user_id: string;
        };
        Insert: {
          banco_horas_lancamento_id?: string | null;
          colaborador_comp_id: string;
          created_at?: string;
          data_compensacao: string;
          empresa_id: string;
          estornado_em?: string | null;
          estornado_por?: string | null;
          evento_id: string;
          id?: string;
          minutos: number;
          motivo_estorno?: string | null;
          obs?: string | null;
          origem?: string;
          registrado_em?: string;
          registrado_por: string;
          tipo: string;
          user_id: string;
        };
        Update: {
          banco_horas_lancamento_id?: string | null;
          colaborador_comp_id?: string;
          created_at?: string;
          data_compensacao?: string;
          empresa_id?: string;
          estornado_em?: string | null;
          estornado_por?: string | null;
          evento_id?: string;
          id?: string;
          minutos?: number;
          motivo_estorno?: string | null;
          obs?: string | null;
          origem?: string;
          registrado_em?: string;
          registrado_por?: string;
          tipo?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comp_pontuais_lancamentos_banco_horas_lancamento_id_fkey";
            columns: ["banco_horas_lancamento_id"];
            isOneToOne: false;
            referencedRelation: "banco_horas_lancamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comp_pontuais_lancamentos_colaborador_comp_id_fkey";
            columns: ["colaborador_comp_id"];
            isOneToOne: false;
            referencedRelation: "comp_pontuais_colaboradores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comp_pontuais_lancamentos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comp_pontuais_lancamentos_evento_id_fkey";
            columns: ["evento_id"];
            isOneToOne: false;
            referencedRelation: "comp_pontuais_eventos";
            referencedColumns: ["id"];
          },
        ];
      };
      competencia_pendencias: {
        Row: {
          colaboradores_afetados: number;
          competencia_id: string;
          created_at: string;
          criticidade: string;
          descricao: string | null;
          id: string;
          resolvida: boolean;
          resolvida_em: string | null;
          resolvida_por: string | null;
          titulo: string;
        };
        Insert: {
          colaboradores_afetados?: number;
          competencia_id: string;
          created_at?: string;
          criticidade?: string;
          descricao?: string | null;
          id?: string;
          resolvida?: boolean;
          resolvida_em?: string | null;
          resolvida_por?: string | null;
          titulo: string;
        };
        Update: {
          colaboradores_afetados?: number;
          competencia_id?: string;
          created_at?: string;
          criticidade?: string;
          descricao?: string | null;
          id?: string;
          resolvida?: boolean;
          resolvida_em?: string | null;
          resolvida_por?: string | null;
          titulo?: string;
        };
        Relationships: [
          {
            foreignKeyName: "competencia_pendencias_competencia_id_fkey";
            columns: ["competencia_id"];
            isOneToOne: false;
            referencedRelation: "competencias";
            referencedColumns: ["id"];
          },
        ];
      };
      competencias: {
        Row: {
          ano: number;
          created_at: string;
          empresa_id: string;
          fechada_em: string | null;
          fechada_por: string | null;
          id: string;
          integrada_em: string | null;
          mes: number;
          observacao: string | null;
          responsavel_id: string | null;
          status: Database["public"]["Enums"]["competencia_status"];
          updated_at: string;
        };
        Insert: {
          ano: number;
          created_at?: string;
          empresa_id: string;
          fechada_em?: string | null;
          fechada_por?: string | null;
          id?: string;
          integrada_em?: string | null;
          mes: number;
          observacao?: string | null;
          responsavel_id?: string | null;
          status?: Database["public"]["Enums"]["competencia_status"];
          updated_at?: string;
        };
        Update: {
          ano?: number;
          created_at?: string;
          empresa_id?: string;
          fechada_em?: string | null;
          fechada_por?: string | null;
          id?: string;
          integrada_em?: string | null;
          mes?: number;
          observacao?: string | null;
          responsavel_id?: string | null;
          status?: Database["public"]["Enums"]["competencia_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      comunicado_leituras: {
        Row: {
          comunicado_id: string;
          confirmado: boolean;
          confirmado_em: string | null;
          id: string;
          lido_em: string;
          user_id: string;
        };
        Insert: {
          comunicado_id: string;
          confirmado?: boolean;
          confirmado_em?: string | null;
          id?: string;
          lido_em?: string;
          user_id: string;
        };
        Update: {
          comunicado_id?: string;
          confirmado?: boolean;
          confirmado_em?: string | null;
          id?: string;
          lido_em?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comunicado_leituras_comunicado_id_fkey";
            columns: ["comunicado_id"];
            isOneToOne: false;
            referencedRelation: "comunicados";
            referencedColumns: ["id"];
          },
        ];
      };
      comunicados: {
        Row: {
          anexo_path: string | null;
          autor_id: string;
          cargo: string | null;
          corpo: string;
          created_at: string;
          empresa_id: string;
          exige_confirmacao: boolean;
          expira_em: string | null;
          fixado: boolean;
          id: string;
          prioridade: Database["public"]["Enums"]["comunicado_prioridade"];
          publicado_em: string;
          publico: Database["public"]["Enums"]["comunicado_publico"];
          tipo: Database["public"]["Enums"]["comunicado_tipo"];
          titulo: string;
          unidade_id: string | null;
          updated_at: string;
        };
        Insert: {
          anexo_path?: string | null;
          autor_id: string;
          cargo?: string | null;
          corpo: string;
          created_at?: string;
          empresa_id: string;
          exige_confirmacao?: boolean;
          expira_em?: string | null;
          fixado?: boolean;
          id?: string;
          prioridade?: Database["public"]["Enums"]["comunicado_prioridade"];
          publicado_em?: string;
          publico?: Database["public"]["Enums"]["comunicado_publico"];
          tipo?: Database["public"]["Enums"]["comunicado_tipo"];
          titulo: string;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Update: {
          anexo_path?: string | null;
          autor_id?: string;
          cargo?: string | null;
          corpo?: string;
          created_at?: string;
          empresa_id?: string;
          exige_confirmacao?: boolean;
          expira_em?: string | null;
          fixado?: boolean;
          id?: string;
          prioridade?: Database["public"]["Enums"]["comunicado_prioridade"];
          publicado_em?: string;
          publico?: Database["public"]["Enums"]["comunicado_publico"];
          tipo?: Database["public"]["Enums"]["comunicado_tipo"];
          titulo?: string;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      demissoes: {
        Row: {
          baixa_ctps: boolean;
          colab_cargo: string;
          colab_matricula: string;
          colab_nome: string;
          created_at: string;
          data_aviso: string;
          data_desligamento: string;
          empresa_id: string;
          esocial_s2299: boolean;
          exame_demissional: boolean;
          fgts_ok: boolean;
          fin_concluido_em: string | null;
          fin_concluido_por: string | null;
          fin_status: string;
          id: string;
          jur_concluido_em: string | null;
          jur_concluido_por: string | null;
          jur_status: string;
          motivo: Database["public"]["Enums"]["demissao_motivo"];
          obs: string | null;
          rh_concluido_em: string | null;
          rh_concluido_por: string | null;
          rh_status: string;
          status: Database["public"]["Enums"]["demissao_status"];
          ti_concluido_em: string | null;
          ti_concluido_por: string | null;
          ti_status: string;
          trct_pronto: boolean;
          user_id: string;
        };
        Insert: {
          baixa_ctps?: boolean;
          colab_cargo: string;
          colab_matricula: string;
          colab_nome: string;
          created_at?: string;
          data_aviso: string;
          data_desligamento: string;
          empresa_id: string;
          esocial_s2299?: boolean;
          exame_demissional?: boolean;
          fgts_ok?: boolean;
          fin_concluido_em?: string | null;
          fin_concluido_por?: string | null;
          fin_status?: string;
          id?: string;
          jur_concluido_em?: string | null;
          jur_concluido_por?: string | null;
          jur_status?: string;
          motivo: Database["public"]["Enums"]["demissao_motivo"];
          obs?: string | null;
          rh_concluido_em?: string | null;
          rh_concluido_por?: string | null;
          rh_status?: string;
          status?: Database["public"]["Enums"]["demissao_status"];
          ti_concluido_em?: string | null;
          ti_concluido_por?: string | null;
          ti_status?: string;
          trct_pronto?: boolean;
          user_id: string;
        };
        Update: {
          baixa_ctps?: boolean;
          colab_cargo?: string;
          colab_matricula?: string;
          colab_nome?: string;
          created_at?: string;
          data_aviso?: string;
          data_desligamento?: string;
          empresa_id?: string;
          esocial_s2299?: boolean;
          exame_demissional?: boolean;
          fgts_ok?: boolean;
          fin_concluido_em?: string | null;
          fin_concluido_por?: string | null;
          fin_status?: string;
          id?: string;
          jur_concluido_em?: string | null;
          jur_concluido_por?: string | null;
          jur_status?: string;
          motivo?: Database["public"]["Enums"]["demissao_motivo"];
          obs?: string | null;
          rh_concluido_em?: string | null;
          rh_concluido_por?: string | null;
          rh_status?: string;
          status?: Database["public"]["Enums"]["demissao_status"];
          ti_concluido_em?: string | null;
          ti_concluido_por?: string | null;
          ti_status?: string;
          trct_pronto?: boolean;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "demissoes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demissoes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "demissoes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      departamentos: {
        Row: {
          ativo: boolean;
          codigo: string | null;
          created_at: string;
          empresa_id: string;
          id: string;
          nome: string;
          pai_id: string | null;
          responsavel_id: string | null;
          unidade_id: string | null;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          codigo?: string | null;
          created_at?: string;
          empresa_id: string;
          id?: string;
          nome: string;
          pai_id?: string | null;
          responsavel_id?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          codigo?: string | null;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          nome?: string;
          pai_id?: string | null;
          responsavel_id?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "departamentos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "departamentos_pai_id_fkey";
            columns: ["pai_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "departamentos_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      document_access_logs: {
        Row: {
          created_at: string;
          document_version_id: string;
          event: Database["public"]["Enums"]["sign_audit_event"];
          id: string;
          ip: unknown;
          profile_id: string;
          user_agent: string | null;
          viewed_duration_ms: number | null;
        };
        Insert: {
          created_at?: string;
          document_version_id: string;
          event: Database["public"]["Enums"]["sign_audit_event"];
          id?: string;
          ip?: unknown;
          profile_id: string;
          user_agent?: string | null;
          viewed_duration_ms?: number | null;
        };
        Update: {
          created_at?: string;
          document_version_id?: string;
          event?: Database["public"]["Enums"]["sign_audit_event"];
          id?: string;
          ip?: unknown;
          profile_id?: string;
          user_agent?: string | null;
          viewed_duration_ms?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "document_access_logs_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_access_logs_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      document_signers: {
        Row: {
          document_id: string;
          document_version_id: string;
          id: string;
          profile_id: string;
          required: boolean;
          role: string;
          signed_at: string | null;
          status: string;
        };
        Insert: {
          document_id: string;
          document_version_id: string;
          id?: string;
          profile_id: string;
          required?: boolean;
          role: string;
          signed_at?: string | null;
          status?: string;
        };
        Update: {
          document_id?: string;
          document_version_id?: string;
          id?: string;
          profile_id?: string;
          required?: boolean;
          role?: string;
          signed_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "document_signers_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "document_signers_document_version_id_fkey";
            columns: ["document_version_id"];
            isOneToOne: false;
            referencedRelation: "document_versions";
            referencedColumns: ["id"];
          },
        ];
      };
      document_versions: {
        Row: {
          content_sha256: string;
          created_at: string | null;
          created_by: string | null;
          document_id: string;
          id: string;
          storage_path: string;
          version_number: number;
        };
        Insert: {
          content_sha256: string;
          created_at?: string | null;
          created_by?: string | null;
          document_id: string;
          id?: string;
          storage_path: string;
          version_number?: number;
        };
        Update: {
          content_sha256?: string;
          created_at?: string | null;
          created_by?: string | null;
          document_id?: string;
          id?: string;
          storage_path?: string;
          version_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
        ];
      };
      documento_assinantes: {
        Row: {
          assinado_em: string | null;
          created_at: string;
          documento_id: string;
          id: string;
          ip_address: string | null;
          status: Database["public"]["Enums"]["documento_status"];
          user_id: string;
        };
        Insert: {
          assinado_em?: string | null;
          created_at?: string;
          documento_id: string;
          id?: string;
          ip_address?: string | null;
          status?: Database["public"]["Enums"]["documento_status"];
          user_id: string;
        };
        Update: {
          assinado_em?: string | null;
          created_at?: string;
          documento_id?: string;
          id?: string;
          ip_address?: string | null;
          status?: Database["public"]["Enums"]["documento_status"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documento_assinantes_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documento_assinantes_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documento_assinantes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documento_assinantes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      documentos: {
        Row: {
          aguardando_acao: boolean;
          apuracao_mes_id: string | null;
          apuracao_mes_snapshot_id: string | null;
          arquivo_path: string | null;
          assinado_em: string | null;
          bucket: string;
          competencia_id: string | null;
          created_at: string;
          criado_por: string | null;
          descricao: string | null;
          empresa_id: string | null;
          id: string;
          invalidado_em: string | null;
          invalidado_por: string | null;
          motivo_invalidacao: string | null;
          origem_snapshot_hash: string | null;
          rag_chunks_count: number | null;
          rag_erro: string | null;
          rag_indexado_em: string | null;
          rag_text_hash: string | null;
          secure_document_id: string | null;
          secure_version_id: string | null;
          signed_payload_v: number | null;
          status: Database["public"]["Enums"]["documento_status"];
          status_rag: string;
          substitui_documento_id: string | null;
          substituido_por_id: string | null;
          tipo: Database["public"]["Enums"]["documento_tipo"];
          titulo: string;
          updated_at: string;
          user_id: string | null;
          vencimento: string | null;
          versao_documento: number;
        };
        Insert: {
          aguardando_acao?: boolean;
          apuracao_mes_id?: string | null;
          apuracao_mes_snapshot_id?: string | null;
          arquivo_path?: string | null;
          assinado_em?: string | null;
          bucket?: string;
          competencia_id?: string | null;
          created_at?: string;
          criado_por?: string | null;
          descricao?: string | null;
          empresa_id?: string | null;
          id?: string;
          invalidado_em?: string | null;
          invalidado_por?: string | null;
          motivo_invalidacao?: string | null;
          origem_snapshot_hash?: string | null;
          rag_chunks_count?: number | null;
          rag_erro?: string | null;
          rag_indexado_em?: string | null;
          rag_text_hash?: string | null;
          secure_document_id?: string | null;
          secure_version_id?: string | null;
          signed_payload_v?: number | null;
          status?: Database["public"]["Enums"]["documento_status"];
          status_rag?: string;
          substitui_documento_id?: string | null;
          substituido_por_id?: string | null;
          tipo?: Database["public"]["Enums"]["documento_tipo"];
          titulo: string;
          updated_at?: string;
          user_id?: string | null;
          vencimento?: string | null;
          versao_documento?: number;
        };
        Update: {
          aguardando_acao?: boolean;
          apuracao_mes_id?: string | null;
          apuracao_mes_snapshot_id?: string | null;
          arquivo_path?: string | null;
          assinado_em?: string | null;
          bucket?: string;
          competencia_id?: string | null;
          created_at?: string;
          criado_por?: string | null;
          descricao?: string | null;
          empresa_id?: string | null;
          id?: string;
          invalidado_em?: string | null;
          invalidado_por?: string | null;
          motivo_invalidacao?: string | null;
          origem_snapshot_hash?: string | null;
          rag_chunks_count?: number | null;
          rag_erro?: string | null;
          rag_indexado_em?: string | null;
          rag_text_hash?: string | null;
          secure_document_id?: string | null;
          secure_version_id?: string | null;
          signed_payload_v?: number | null;
          status?: Database["public"]["Enums"]["documento_status"];
          status_rag?: string;
          substitui_documento_id?: string | null;
          substituido_por_id?: string | null;
          tipo?: Database["public"]["Enums"]["documento_tipo"];
          titulo?: string;
          updated_at?: string;
          user_id?: string | null;
          vencimento?: string | null;
          versao_documento?: number;
        };
        Relationships: [
          {
            foreignKeyName: "documentos_apuracao_mes_id_fkey";
            columns: ["apuracao_mes_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_apuracao_mes_snapshot_id_fkey";
            columns: ["apuracao_mes_snapshot_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes_snapshots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_competencia_id_fkey";
            columns: ["competencia_id"];
            isOneToOne: false;
            referencedRelation: "competencias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_substitui_documento_id_fkey";
            columns: ["substitui_documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_substitui_documento_id_fkey";
            columns: ["substitui_documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_substituido_por_id_fkey";
            columns: ["substituido_por_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_substituido_por_id_fkey";
            columns: ["substituido_por_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
        ];
      };
      documentos_embeddings: {
        Row: {
          chunk_index: number;
          chunk_texto: string;
          created_at: string | null;
          documento_id: string | null;
          documento_tipo: string | null;
          embedding: string | null;
          empresa_id: string;
          id: string;
          metadata: Json | null;
        };
        Insert: {
          chunk_index: number;
          chunk_texto: string;
          created_at?: string | null;
          documento_id?: string | null;
          documento_tipo?: string | null;
          embedding?: string | null;
          empresa_id: string;
          id?: string;
          metadata?: Json | null;
        };
        Update: {
          chunk_index?: number;
          chunk_texto?: string;
          created_at?: string | null;
          documento_id?: string | null;
          documento_tipo?: string | null;
          embedding?: string | null;
          empresa_id?: string;
          id?: string;
          metadata?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "documentos_embeddings_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_embeddings_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documentos_embeddings_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          apuracao_mes_snapshot_id: string | null;
          created_at: string | null;
          empresa_id: string;
          id: string;
          kind: string;
          owner_profile_id: string;
          source_bucket: string | null;
          source_content_sha256: string | null;
          source_storage_path: string | null;
          status: string;
          updated_at: string | null;
        };
        Insert: {
          apuracao_mes_snapshot_id?: string | null;
          created_at?: string | null;
          empresa_id: string;
          id?: string;
          kind: string;
          owner_profile_id: string;
          source_bucket?: string | null;
          source_content_sha256?: string | null;
          source_storage_path?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Update: {
          apuracao_mes_snapshot_id?: string | null;
          created_at?: string | null;
          empresa_id?: string;
          id?: string;
          kind?: string;
          owner_profile_id?: string;
          source_bucket?: string | null;
          source_content_sha256?: string | null;
          source_storage_path?: string | null;
          status?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "documents_apuracao_mes_snapshot_id_fkey";
            columns: ["apuracao_mes_snapshot_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes_snapshots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      empresa_setup_checklist: {
        Row: {
          concluida_em: string | null;
          concluida_por: string | null;
          empresa_id: string;
          etapa: string;
          id: string;
          obrigatoria: boolean;
          pendencias: Json;
          status: string;
        };
        Insert: {
          concluida_em?: string | null;
          concluida_por?: string | null;
          empresa_id: string;
          etapa: string;
          id?: string;
          obrigatoria?: boolean;
          pendencias?: Json;
          status?: string;
        };
        Update: {
          concluida_em?: string | null;
          concluida_por?: string | null;
          empresa_id?: string;
          etapa?: string;
          id?: string;
          obrigatoria?: boolean;
          pendencias?: Json;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "empresa_setup_checklist_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      empresas: {
        Row: {
          ativo: boolean;
          bairro: string | null;
          banco_horas_acordo_assinado_em: string | null;
          banco_horas_acordo_doc_id: string | null;
          banco_horas_acordo_modalidade: string | null;
          banco_horas_acordo_validade_em: string | null;
          cep: string | null;
          cidade: string | null;
          cnpj: string | null;
          complemento: string | null;
          configuracoes_alertas: Json;
          configuracoes_app: Json;
          configuracoes_trabalhistas: Json;
          created_at: string;
          email_contato: string | null;
          grupo_id: string | null;
          id: string;
          inscricao_estadual: string | null;
          inscricao_municipal: string | null;
          logo_path: string | null;
          logo_url: string | null;
          logradouro: string | null;
          modulos_habilitados: Json | null;
          nome: string;
          nome_fantasia: string | null;
          numero: string | null;
          pais: string;
          razao_social: string | null;
          site: string | null;
          telefone: string | null;
          uf: string | null;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          bairro?: string | null;
          banco_horas_acordo_assinado_em?: string | null;
          banco_horas_acordo_doc_id?: string | null;
          banco_horas_acordo_modalidade?: string | null;
          banco_horas_acordo_validade_em?: string | null;
          cep?: string | null;
          cidade?: string | null;
          cnpj?: string | null;
          complemento?: string | null;
          configuracoes_alertas?: Json;
          configuracoes_app?: Json;
          configuracoes_trabalhistas?: Json;
          created_at?: string;
          email_contato?: string | null;
          grupo_id?: string | null;
          id?: string;
          inscricao_estadual?: string | null;
          inscricao_municipal?: string | null;
          logo_path?: string | null;
          logo_url?: string | null;
          logradouro?: string | null;
          modulos_habilitados?: Json | null;
          nome: string;
          nome_fantasia?: string | null;
          numero?: string | null;
          pais?: string;
          razao_social?: string | null;
          site?: string | null;
          telefone?: string | null;
          uf?: string | null;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          bairro?: string | null;
          banco_horas_acordo_assinado_em?: string | null;
          banco_horas_acordo_doc_id?: string | null;
          banco_horas_acordo_modalidade?: string | null;
          banco_horas_acordo_validade_em?: string | null;
          cep?: string | null;
          cidade?: string | null;
          cnpj?: string | null;
          complemento?: string | null;
          configuracoes_alertas?: Json;
          configuracoes_app?: Json;
          configuracoes_trabalhistas?: Json;
          created_at?: string;
          email_contato?: string | null;
          grupo_id?: string | null;
          id?: string;
          inscricao_estadual?: string | null;
          inscricao_municipal?: string | null;
          logo_path?: string | null;
          logo_url?: string | null;
          logradouro?: string | null;
          modulos_habilitados?: Json | null;
          nome?: string;
          nome_fantasia?: string | null;
          numero?: string | null;
          pais?: string;
          razao_social?: string | null;
          site?: string | null;
          telefone?: string | null;
          uf?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "empresas_grupo_id_fkey";
            columns: ["grupo_id"];
            isOneToOne: false;
            referencedRelation: "grupos";
            referencedColumns: ["id"];
          },
        ];
      };
      equipes: {
        Row: {
          ativo: boolean;
          created_at: string;
          departamento_id: string | null;
          empresa_id: string;
          id: string;
          nome: string;
          responsavel_id: string | null;
          setor_id: string | null;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          departamento_id?: string | null;
          empresa_id: string;
          id?: string;
          nome: string;
          responsavel_id?: string | null;
          setor_id?: string | null;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          departamento_id?: string | null;
          empresa_id?: string;
          id?: string;
          nome?: string;
          responsavel_id?: string | null;
          setor_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "equipes_departamento_id_fkey";
            columns: ["departamento_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "equipes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "equipes_setor_id_fkey";
            columns: ["setor_id"];
            isOneToOne: false;
            referencedRelation: "setores";
            referencedColumns: ["id"];
          },
        ];
      };
      escalas: {
        Row: {
          ciclo_folga_h: number | null;
          ciclo_trabalho_h: number | null;
          created_at: string;
          data_base_ciclo: string | null;
          dias_semana: number[];
          empresa_id: string;
          horario_id: string;
          id: string;
          jornada_id: string | null;
          observacao: string | null;
          regime_compensacao: string | null;
          turno_id: string | null;
          updated_at: string;
          user_id: string;
          vigencia_fim: string | null;
          vigencia_inicio: string;
        };
        Insert: {
          ciclo_folga_h?: number | null;
          ciclo_trabalho_h?: number | null;
          created_at?: string;
          data_base_ciclo?: string | null;
          dias_semana?: number[];
          empresa_id: string;
          horario_id: string;
          id?: string;
          jornada_id?: string | null;
          observacao?: string | null;
          regime_compensacao?: string | null;
          turno_id?: string | null;
          updated_at?: string;
          user_id: string;
          vigencia_fim?: string | null;
          vigencia_inicio?: string;
        };
        Update: {
          ciclo_folga_h?: number | null;
          ciclo_trabalho_h?: number | null;
          created_at?: string;
          data_base_ciclo?: string | null;
          dias_semana?: number[];
          empresa_id?: string;
          horario_id?: string;
          id?: string;
          jornada_id?: string | null;
          observacao?: string | null;
          regime_compensacao?: string | null;
          turno_id?: string | null;
          updated_at?: string;
          user_id?: string;
          vigencia_fim?: string | null;
          vigencia_inicio?: string;
        };
        Relationships: [
          {
            foreignKeyName: "escalas_horario_id_fkey";
            columns: ["horario_id"];
            isOneToOne: false;
            referencedRelation: "horarios_padrao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "escalas_jornada_id_fkey";
            columns: ["jornada_id"];
            isOneToOne: false;
            referencedRelation: "jornadas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "escalas_turno_id_fkey";
            columns: ["turno_id"];
            isOneToOne: false;
            referencedRelation: "turnos";
            referencedColumns: ["id"];
          },
        ];
      };
      esocial_configuracoes: {
        Row: {
          ambiente: Database["public"]["Enums"]["esocial_ambiente"];
          created_at: string;
          empresa_id: string;
          id: string;
          updated_at: string;
        };
        Insert: {
          ambiente?: Database["public"]["Enums"]["esocial_ambiente"];
          created_at?: string;
          empresa_id: string;
          id?: string;
          updated_at?: string;
        };
        Update: {
          ambiente?: Database["public"]["Enums"]["esocial_ambiente"];
          created_at?: string;
          empresa_id?: string;
          id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "esocial_configuracoes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: true;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      esocial_eventos: {
        Row: {
          categoria: Database["public"]["Enums"]["esocial_categoria"];
          codigo: string;
          competencia_id: string | null;
          created_at: string;
          criado_por: string | null;
          descricao: string;
          empresa_id: string;
          enviado_em: string | null;
          erro_codigo: string | null;
          erro_mensagem: string | null;
          id: string;
          lote_id: string | null;
          nsu: string | null;
          payload: Json;
          processado_em: string | null;
          recibo: string | null;
          referencia_id: string | null;
          referencia_tipo: string | null;
          status: Database["public"]["Enums"]["esocial_status"];
          tentativas: number;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          categoria: Database["public"]["Enums"]["esocial_categoria"];
          codigo: string;
          competencia_id?: string | null;
          created_at?: string;
          criado_por?: string | null;
          descricao: string;
          empresa_id: string;
          enviado_em?: string | null;
          erro_codigo?: string | null;
          erro_mensagem?: string | null;
          id?: string;
          lote_id?: string | null;
          nsu?: string | null;
          payload?: Json;
          processado_em?: string | null;
          recibo?: string | null;
          referencia_id?: string | null;
          referencia_tipo?: string | null;
          status?: Database["public"]["Enums"]["esocial_status"];
          tentativas?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          categoria?: Database["public"]["Enums"]["esocial_categoria"];
          codigo?: string;
          competencia_id?: string | null;
          created_at?: string;
          criado_por?: string | null;
          descricao?: string;
          empresa_id?: string;
          enviado_em?: string | null;
          erro_codigo?: string | null;
          erro_mensagem?: string | null;
          id?: string;
          lote_id?: string | null;
          nsu?: string | null;
          payload?: Json;
          processado_em?: string | null;
          recibo?: string | null;
          referencia_id?: string | null;
          referencia_tipo?: string | null;
          status?: Database["public"]["Enums"]["esocial_status"];
          tentativas?: number;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "esocial_eventos_lote_id_fkey";
            columns: ["lote_id"];
            isOneToOne: false;
            referencedRelation: "esocial_lotes";
            referencedColumns: ["id"];
          },
        ];
      };
      esocial_lotes: {
        Row: {
          ambiente: Database["public"]["Enums"]["esocial_ambiente"];
          created_at: string;
          criado_por: string;
          empresa_id: string;
          enviado_em: string | null;
          id: string;
          observacao: string | null;
          processado_em: string | null;
          protocolo: string | null;
          status: Database["public"]["Enums"]["esocial_status"];
          total_eventos: number;
          updated_at: string;
        };
        Insert: {
          ambiente?: Database["public"]["Enums"]["esocial_ambiente"];
          created_at?: string;
          criado_por: string;
          empresa_id: string;
          enviado_em?: string | null;
          id?: string;
          observacao?: string | null;
          processado_em?: string | null;
          protocolo?: string | null;
          status?: Database["public"]["Enums"]["esocial_status"];
          total_eventos?: number;
          updated_at?: string;
        };
        Update: {
          ambiente?: Database["public"]["Enums"]["esocial_ambiente"];
          created_at?: string;
          criado_por?: string;
          empresa_id?: string;
          enviado_em?: string | null;
          id?: string;
          observacao?: string | null;
          processado_em?: string | null;
          protocolo?: string | null;
          status?: Database["public"]["Enums"]["esocial_status"];
          total_eventos?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      feriados: {
        Row: {
          created_at: string;
          data: string;
          empresa_id: string;
          id: string;
          nome: string;
          tipo: string;
          unidade_id: string | null;
        };
        Insert: {
          created_at?: string;
          data: string;
          empresa_id: string;
          id?: string;
          nome: string;
          tipo?: string;
          unidade_id?: string | null;
        };
        Update: {
          created_at?: string;
          data?: string;
          empresa_id?: string;
          id?: string;
          nome?: string;
          tipo?: string;
          unidade_id?: string | null;
        };
        Relationships: [];
      };
      ferias_fracoes: {
        Row: {
          abono_pecuniario: boolean;
          aprovado_em: string | null;
          aprovado_por: string | null;
          created_at: string | null;
          criada_pelo_rh: boolean | null;
          dias: number;
          dias_abono: number;
          empresa_id: string;
          fim: string;
          id: string;
          inicio: string;
          motivo_rejeicao: string | null;
          origem: string;
          periodo_id: string;
          respondida_em: string | null;
          respondida_por: string | null;
          solicitada_em: string | null;
          solicitada_por: string | null;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          abono_pecuniario?: boolean;
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          created_at?: string | null;
          criada_pelo_rh?: boolean | null;
          dias: number;
          dias_abono?: number;
          empresa_id: string;
          fim: string;
          id?: string;
          inicio: string;
          motivo_rejeicao?: string | null;
          origem?: string;
          periodo_id: string;
          respondida_em?: string | null;
          respondida_por?: string | null;
          solicitada_em?: string | null;
          solicitada_por?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          abono_pecuniario?: boolean;
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          created_at?: string | null;
          criada_pelo_rh?: boolean | null;
          dias?: number;
          dias_abono?: number;
          empresa_id?: string;
          fim?: string;
          id?: string;
          inicio?: string;
          motivo_rejeicao?: string | null;
          origem?: string;
          periodo_id?: string;
          respondida_em?: string | null;
          respondida_por?: string | null;
          solicitada_em?: string | null;
          solicitada_por?: string | null;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ferias_fracoes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ferias_fracoes_periodo_id_fkey";
            columns: ["periodo_id"];
            isOneToOne: false;
            referencedRelation: "ferias_periodos";
            referencedColumns: ["id"];
          },
        ];
      };
      ferias_periodos: {
        Row: {
          aquisitivo_fim: string;
          aquisitivo_inicio: string;
          concessivo_fim: string | null;
          concessivo_inicio: string | null;
          created_at: string | null;
          dias_abonados: number;
          dias_direito: number;
          dias_gozados: number;
          dias_saldo: number | null;
          empresa_id: string;
          faltas_injustificadas: number;
          id: string;
          observacao: string | null;
          origem: string;
          status: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          aquisitivo_fim: string;
          aquisitivo_inicio: string;
          concessivo_fim?: string | null;
          concessivo_inicio?: string | null;
          created_at?: string | null;
          dias_abonados?: number;
          dias_direito?: number;
          dias_gozados?: number;
          dias_saldo?: number | null;
          empresa_id: string;
          faltas_injustificadas?: number;
          id?: string;
          observacao?: string | null;
          origem?: string;
          status?: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          aquisitivo_fim?: string;
          aquisitivo_inicio?: string;
          concessivo_fim?: string | null;
          concessivo_inicio?: string | null;
          created_at?: string | null;
          dias_abonados?: number;
          dias_direito?: number;
          dias_gozados?: number;
          dias_saldo?: number | null;
          empresa_id?: string;
          faltas_injustificadas?: number;
          id?: string;
          observacao?: string | null;
          origem?: string;
          status?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ferias_periodos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      folhas_mes: {
        Row: {
          ano: number;
          apuracao_mes_id: string | null;
          base_fgts: number | null;
          base_inss: number | null;
          base_irrf: number | null;
          bruto: number | null;
          created_at: string | null;
          empresa_id: string;
          id: string;
          liquido: number | null;
          mes: number;
          parametros_legais: Json | null;
          salario_base: number;
          status: string;
          total_descontos: number | null;
          total_proventos: number | null;
          updated_at: string | null;
          user_id: string;
          valor_fgts: number | null;
          valor_inss: number | null;
          valor_irrf: number | null;
          versao_motor_calculo: string | null;
        };
        Insert: {
          ano: number;
          apuracao_mes_id?: string | null;
          base_fgts?: number | null;
          base_inss?: number | null;
          base_irrf?: number | null;
          bruto?: number | null;
          created_at?: string | null;
          empresa_id: string;
          id?: string;
          liquido?: number | null;
          mes: number;
          parametros_legais?: Json | null;
          salario_base?: number;
          status?: string;
          total_descontos?: number | null;
          total_proventos?: number | null;
          updated_at?: string | null;
          user_id: string;
          valor_fgts?: number | null;
          valor_inss?: number | null;
          valor_irrf?: number | null;
          versao_motor_calculo?: string | null;
        };
        Update: {
          ano?: number;
          apuracao_mes_id?: string | null;
          base_fgts?: number | null;
          base_inss?: number | null;
          base_irrf?: number | null;
          bruto?: number | null;
          created_at?: string | null;
          empresa_id?: string;
          id?: string;
          liquido?: number | null;
          mes?: number;
          parametros_legais?: Json | null;
          salario_base?: number;
          status?: string;
          total_descontos?: number | null;
          total_proventos?: number | null;
          updated_at?: string | null;
          user_id?: string;
          valor_fgts?: number | null;
          valor_inss?: number | null;
          valor_irrf?: number | null;
          versao_motor_calculo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "folhas_mes_apuracao_mes_id_fkey";
            columns: ["apuracao_mes_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "folhas_mes_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      gestor_escopos: {
        Row: {
          created_at: string;
          criado_por: string | null;
          departamento_id: string | null;
          empresa_id: string | null;
          equipe_id: string | null;
          gestor_id: string;
          id: string;
          pode_aprovar: boolean;
          pode_configurar: boolean;
          pode_editar: boolean;
          pode_visualizar: boolean;
          setor_id: string | null;
          unidade_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          criado_por?: string | null;
          departamento_id?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          gestor_id: string;
          id?: string;
          pode_aprovar?: boolean;
          pode_configurar?: boolean;
          pode_editar?: boolean;
          pode_visualizar?: boolean;
          setor_id?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          criado_por?: string | null;
          departamento_id?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          gestor_id?: string;
          id?: string;
          pode_aprovar?: boolean;
          pode_configurar?: boolean;
          pode_editar?: boolean;
          pode_visualizar?: boolean;
          setor_id?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "gestor_escopos_departamento_id_fkey";
            columns: ["departamento_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gestor_escopos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gestor_escopos_equipe_id_fkey";
            columns: ["equipe_id"];
            isOneToOne: false;
            referencedRelation: "equipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gestor_escopos_setor_id_fkey";
            columns: ["setor_id"];
            isOneToOne: false;
            referencedRelation: "setores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "gestor_escopos_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      grupos: {
        Row: {
          ativo: boolean;
          cnpj: string | null;
          created_at: string;
          id: string;
          nome: string;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          cnpj?: string | null;
          created_at?: string;
          id?: string;
          nome: string;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          cnpj?: string | null;
          created_at?: string;
          id?: string;
          nome?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      horarios_padrao: {
        Row: {
          ativo: boolean;
          created_at: string;
          empresa_id: string;
          hora_entrada: string;
          hora_saida: string;
          id: string;
          intervalo_minutos: number;
          jornada_diaria_minutos: number;
          nome: string;
          politica_he: string | null;
          tolerancia_minutos: number;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          empresa_id: string;
          hora_entrada?: string;
          hora_saida?: string;
          id?: string;
          intervalo_minutos?: number;
          jornada_diaria_minutos?: number;
          nome: string;
          politica_he?: string | null;
          tolerancia_minutos?: number;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          empresa_id?: string;
          hora_entrada?: string;
          hora_saida?: string;
          id?: string;
          intervalo_minutos?: number;
          jornada_diaria_minutos?: number;
          nome?: string;
          politica_he?: string | null;
          tolerancia_minutos?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      jornadas: {
        Row: {
          adic_noturno: boolean;
          ativo: boolean;
          banco: boolean;
          carga_mensal: number;
          carga_semanal: number;
          created_at: string;
          dias_ativos: number[];
          empresa_id: string | null;
          empresas_ids: string[];
          escopo: string;
          feriados: string;
          id: string;
          inter: number;
          intra: number;
          limite_he: number;
          nome: string;
          tipo: string;
          updated_at: string;
        };
        Insert: {
          adic_noturno?: boolean;
          ativo?: boolean;
          banco?: boolean;
          carga_mensal?: number;
          carga_semanal?: number;
          created_at?: string;
          dias_ativos?: number[];
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          feriados?: string;
          id?: string;
          inter?: number;
          intra?: number;
          limite_he?: number;
          nome: string;
          tipo?: string;
          updated_at?: string;
        };
        Update: {
          adic_noturno?: boolean;
          ativo?: boolean;
          banco?: boolean;
          carga_mensal?: number;
          carga_semanal?: number;
          created_at?: string;
          dias_ativos?: number[];
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          feriados?: string;
          id?: string;
          inter?: number;
          intra?: number;
          limite_he?: number;
          nome?: string;
          tipo?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      legal_terms_versions: {
        Row: {
          body: string;
          body_sha256: string;
          created_at: string;
          created_by: string | null;
          effective_from: string;
          effective_to: string | null;
          id: string;
          kind: Database["public"]["Enums"]["legal_term_kind"];
          version: string;
        };
        Insert: {
          body: string;
          body_sha256: string;
          created_at?: string;
          created_by?: string | null;
          effective_from?: string;
          effective_to?: string | null;
          id?: string;
          kind: Database["public"]["Enums"]["legal_term_kind"];
          version: string;
        };
        Update: {
          body?: string;
          body_sha256?: string;
          created_at?: string;
          created_by?: string | null;
          effective_from?: string;
          effective_to?: string | null;
          id?: string;
          kind?: Database["public"]["Enums"]["legal_term_kind"];
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "legal_terms_versions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "legal_terms_versions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      lgpd_consentimentos: {
        Row: {
          acao: string;
          created_at: string;
          empresa_id: string | null;
          id: string;
          ip: string | null;
          tipo: string;
          user_agent: string | null;
          user_id: string;
          versao_termo: string | null;
        };
        Insert: {
          acao: string;
          created_at?: string;
          empresa_id?: string | null;
          id?: string;
          ip?: string | null;
          tipo: string;
          user_agent?: string | null;
          user_id: string;
          versao_termo?: string | null;
        };
        Update: {
          acao?: string;
          created_at?: string;
          empresa_id?: string | null;
          id?: string;
          ip?: string | null;
          tipo?: string;
          user_agent?: string | null;
          user_id?: string;
          versao_termo?: string | null;
        };
        Relationships: [];
      };
      lgpd_erasure_jobs: {
        Row: {
          aprovado_por: string | null;
          created_at: string | null;
          empresa_id: string;
          executado_em: string | null;
          executado_por: string | null;
          hash_resultado: string | null;
          id: string;
          plano_json: Json | null;
          resultado_json: Json | null;
          solicitacao_id: string;
          status: string;
          titular_user_id: string;
          updated_at: string | null;
        };
        Insert: {
          aprovado_por?: string | null;
          created_at?: string | null;
          empresa_id: string;
          executado_em?: string | null;
          executado_por?: string | null;
          hash_resultado?: string | null;
          id?: string;
          plano_json?: Json | null;
          resultado_json?: Json | null;
          solicitacao_id: string;
          status?: string;
          titular_user_id: string;
          updated_at?: string | null;
        };
        Update: {
          aprovado_por?: string | null;
          created_at?: string | null;
          empresa_id?: string;
          executado_em?: string | null;
          executado_por?: string | null;
          hash_resultado?: string | null;
          id?: string;
          plano_json?: Json | null;
          resultado_json?: Json | null;
          solicitacao_id?: string;
          status?: string;
          titular_user_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lgpd_erasure_jobs_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lgpd_erasure_jobs_solicitacao_id_fkey";
            columns: ["solicitacao_id"];
            isOneToOne: false;
            referencedRelation: "solicitacoes_titulares";
            referencedColumns: ["id"];
          },
        ];
      };
      lgpd_export_jobs: {
        Row: {
          aprovado_por: string | null;
          arquivo_path: string | null;
          created_at: string | null;
          empresa_id: string;
          formato: string;
          id: string;
          inclui_dados_sensiveis: boolean;
          solicitacao_id: string;
          solicitado_por: string;
          status: string;
          titular_user_id: string;
          updated_at: string | null;
        };
        Insert: {
          aprovado_por?: string | null;
          arquivo_path?: string | null;
          created_at?: string | null;
          empresa_id: string;
          formato?: string;
          id?: string;
          inclui_dados_sensiveis?: boolean;
          solicitacao_id: string;
          solicitado_por: string;
          status?: string;
          titular_user_id: string;
          updated_at?: string | null;
        };
        Update: {
          aprovado_por?: string | null;
          arquivo_path?: string | null;
          created_at?: string | null;
          empresa_id?: string;
          formato?: string;
          id?: string;
          inclui_dados_sensiveis?: boolean;
          solicitacao_id?: string;
          solicitado_por?: string;
          status?: string;
          titular_user_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lgpd_export_jobs_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lgpd_export_jobs_solicitacao_id_fkey";
            columns: ["solicitacao_id"];
            isOneToOne: false;
            referencedRelation: "solicitacoes_titulares";
            referencedColumns: ["id"];
          },
        ];
      };
      lgpd_retention_candidates: {
        Row: {
          acao_recomendada: string;
          aprovado_por: string | null;
          categoria_dado: string;
          created_at: string;
          empresa_id: string;
          executado_em: string | null;
          id: string;
          registro_id: string | null;
          status: string;
          tabela: string;
          titular_user_id: string | null;
          updated_at: string;
          venceu_em: string;
        };
        Insert: {
          acao_recomendada: string;
          aprovado_por?: string | null;
          categoria_dado: string;
          created_at?: string;
          empresa_id: string;
          executado_em?: string | null;
          id?: string;
          registro_id?: string | null;
          status?: string;
          tabela: string;
          titular_user_id?: string | null;
          updated_at?: string;
          venceu_em: string;
        };
        Update: {
          acao_recomendada?: string;
          aprovado_por?: string | null;
          categoria_dado?: string;
          created_at?: string;
          empresa_id?: string;
          executado_em?: string | null;
          id?: string;
          registro_id?: string | null;
          status?: string;
          tabela?: string;
          titular_user_id?: string | null;
          updated_at?: string;
          venceu_em?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lgpd_retention_candidates_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      lgpd_retention_policies: {
        Row: {
          acao_apos_retencao: string;
          base_legal: string;
          campo: string | null;
          categoria_dado: string;
          created_at: string | null;
          empresa_id: string | null;
          id: string;
          retencao_meses: number;
          tabela: string;
          updated_at: string | null;
        };
        Insert: {
          acao_apos_retencao: string;
          base_legal: string;
          campo?: string | null;
          categoria_dado: string;
          created_at?: string | null;
          empresa_id?: string | null;
          id?: string;
          retencao_meses: number;
          tabela: string;
          updated_at?: string | null;
        };
        Update: {
          acao_apos_retencao?: string;
          base_legal?: string;
          campo?: string | null;
          categoria_dado?: string;
          created_at?: string | null;
          empresa_id?: string | null;
          id?: string;
          retencao_meses?: number;
          tabela?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lgpd_retention_policies_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      lgpd_ripd_reports: {
        Row: {
          aprovado_em: string | null;
          aprovado_por: string | null;
          arquivo_path: string | null;
          bases_legais_json: Json;
          created_at: string;
          dpo_responsavel_id: string | null;
          empresa_id: string;
          hash_pdf: string | null;
          id: string;
          medidas_mitigacao_json: Json;
          riscos_json: Json;
          status: string;
          updated_at: string;
          versao: number;
        };
        Insert: {
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          arquivo_path?: string | null;
          bases_legais_json?: Json;
          created_at?: string;
          dpo_responsavel_id?: string | null;
          empresa_id: string;
          hash_pdf?: string | null;
          id?: string;
          medidas_mitigacao_json?: Json;
          riscos_json?: Json;
          status?: string;
          updated_at?: string;
          versao?: number;
        };
        Update: {
          aprovado_em?: string | null;
          aprovado_por?: string | null;
          arquivo_path?: string | null;
          bases_legais_json?: Json;
          created_at?: string;
          dpo_responsavel_id?: string | null;
          empresa_id?: string;
          hash_pdf?: string | null;
          id?: string;
          medidas_mitigacao_json?: Json;
          riscos_json?: Json;
          status?: string;
          updated_at?: string;
          versao?: number;
        };
        Relationships: [
          {
            foreignKeyName: "lgpd_ripd_reports_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      marcacoes: {
        Row: {
          afd_linha_original: string | null;
          alterada_em: string | null;
          alterada_por: string | null;
          anulada_em: string | null;
          anulada_por: string | null;
          biometria_ok: boolean | null;
          created_at: string;
          dentro_cerca: boolean | null;
          dispositivo: string | null;
          empresa_id: string | null;
          endereco: string | null;
          hash_integridade: string | null;
          hash_registro: string | null;
          id: string;
          latitude: number | null;
          local_tipo: string | null;
          longitude: number | null;
          marcada_em: string;
          motivo_alteracao: string | null;
          motivo_anulacao: string | null;
          nsr_numero: number | null;
          nsr_origem: string | null;
          nsr_sequence_id: string | null;
          observacao: string | null;
          offline: boolean;
          origem: Database["public"]["Enums"]["marcacao_origem"];
          ponto_origem_id: string | null;
          precisao_metros: number | null;
          rep_nsr: string | null;
          rep_nsr_original: number | null;
          rep_serial_original: string | null;
          selfie_path: string | null;
          solicitacao_id: string | null;
          tipo: Database["public"]["Enums"]["marcacao_tipo"];
          unidade_id: string | null;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          afd_linha_original?: string | null;
          alterada_em?: string | null;
          alterada_por?: string | null;
          anulada_em?: string | null;
          anulada_por?: string | null;
          biometria_ok?: boolean | null;
          created_at?: string;
          dentro_cerca?: boolean | null;
          dispositivo?: string | null;
          empresa_id?: string | null;
          endereco?: string | null;
          hash_integridade?: string | null;
          hash_registro?: string | null;
          id?: string;
          latitude?: number | null;
          local_tipo?: string | null;
          longitude?: number | null;
          marcada_em?: string;
          motivo_alteracao?: string | null;
          motivo_anulacao?: string | null;
          nsr_numero?: number | null;
          nsr_origem?: string | null;
          nsr_sequence_id?: string | null;
          observacao?: string | null;
          offline?: boolean;
          origem?: Database["public"]["Enums"]["marcacao_origem"];
          ponto_origem_id?: string | null;
          precisao_metros?: number | null;
          rep_nsr?: string | null;
          rep_nsr_original?: number | null;
          rep_serial_original?: string | null;
          selfie_path?: string | null;
          solicitacao_id?: string | null;
          tipo: Database["public"]["Enums"]["marcacao_tipo"];
          unidade_id?: string | null;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          afd_linha_original?: string | null;
          alterada_em?: string | null;
          alterada_por?: string | null;
          anulada_em?: string | null;
          anulada_por?: string | null;
          biometria_ok?: boolean | null;
          created_at?: string;
          dentro_cerca?: boolean | null;
          dispositivo?: string | null;
          empresa_id?: string | null;
          endereco?: string | null;
          hash_integridade?: string | null;
          hash_registro?: string | null;
          id?: string;
          latitude?: number | null;
          local_tipo?: string | null;
          longitude?: number | null;
          marcada_em?: string;
          motivo_alteracao?: string | null;
          motivo_anulacao?: string | null;
          nsr_numero?: number | null;
          nsr_origem?: string | null;
          nsr_sequence_id?: string | null;
          observacao?: string | null;
          offline?: boolean;
          origem?: Database["public"]["Enums"]["marcacao_origem"];
          ponto_origem_id?: string | null;
          precisao_metros?: number | null;
          rep_nsr?: string | null;
          rep_nsr_original?: number | null;
          rep_serial_original?: string | null;
          selfie_path?: string | null;
          solicitacao_id?: string | null;
          tipo?: Database["public"]["Enums"]["marcacao_tipo"];
          unidade_id?: string | null;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "marcacoes_nsr_sequence_id_fkey";
            columns: ["nsr_sequence_id"];
            isOneToOne: false;
            referencedRelation: "nsr_sequences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marcacoes_ponto_origem_id_fkey";
            columns: ["ponto_origem_id"];
            isOneToOne: false;
            referencedRelation: "ponto_origens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "marcacoes_solicitacao_id_fkey";
            columns: ["solicitacao_id"];
            isOneToOne: false;
            referencedRelation: "solicitacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      marcacoes_log: {
        Row: {
          data_referencia: string;
          empresa_id: string;
          feito_em: string;
          feito_por: string;
          id: string;
          justificativa: string;
          marcacao_id: string | null;
          tipo_acao: string;
          tipo_marcacao: string | null;
          user_id: string;
          valor_novo: string | null;
          valor_original: string | null;
        };
        Insert: {
          data_referencia: string;
          empresa_id: string;
          feito_em?: string;
          feito_por: string;
          id?: string;
          justificativa: string;
          marcacao_id?: string | null;
          tipo_acao: string;
          tipo_marcacao?: string | null;
          user_id: string;
          valor_novo?: string | null;
          valor_original?: string | null;
        };
        Update: {
          data_referencia?: string;
          empresa_id?: string;
          feito_em?: string;
          feito_por?: string;
          id?: string;
          justificativa?: string;
          marcacao_id?: string | null;
          tipo_acao?: string;
          tipo_marcacao?: string | null;
          user_id?: string;
          valor_novo?: string | null;
          valor_original?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "marcacoes_log_marcacao_id_fkey";
            columns: ["marcacao_id"];
            isOneToOne: false;
            referencedRelation: "marcacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      mfa_email_codes: {
        Row: {
          attempts: number;
          code_hash: string;
          created_at: string;
          expires_at: string;
          id: string;
          ip: string | null;
          used: boolean;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          attempts?: number;
          code_hash: string;
          created_at?: string;
          expires_at: string;
          id?: string;
          ip?: string | null;
          used?: boolean;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          attempts?: number;
          code_hash?: string;
          created_at?: string;
          expires_at?: string;
          id?: string;
          ip?: string | null;
          used?: boolean;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      mfa_email_verifications: {
        Row: {
          expires_at: string;
          id: string;
          ip: string | null;
          user_agent: string | null;
          user_id: string;
          verified_at: string;
        };
        Insert: {
          expires_at?: string;
          id?: string;
          ip?: string | null;
          user_agent?: string | null;
          user_id: string;
          verified_at?: string;
        };
        Update: {
          expires_at?: string;
          id?: string;
          ip?: string | null;
          user_agent?: string | null;
          user_id?: string;
          verified_at?: string;
        };
        Relationships: [];
      };
      notificacoes_colaborador: {
        Row: {
          created_at: string;
          created_by: string | null;
          empresa_id: string | null;
          id: string;
          lida_em: string | null;
          link: string | null;
          mensagem: string;
          metadata: Json | null;
          tipo: string;
          titulo: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          empresa_id?: string | null;
          id?: string;
          lida_em?: string | null;
          link?: string | null;
          mensagem: string;
          metadata?: Json | null;
          tipo: string;
          titulo: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          empresa_id?: string | null;
          id?: string;
          lida_em?: string | null;
          link?: string | null;
          mensagem?: string;
          metadata?: Json | null;
          tipo?: string;
          titulo?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      nsr_sequences: {
        Row: {
          created_at: string;
          empresa_id: string;
          id: string;
          ponto_origem_id: string;
          ultimo_nsr: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          empresa_id: string;
          id?: string;
          ponto_origem_id: string;
          ultimo_nsr?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          empresa_id?: string;
          id?: string;
          ponto_origem_id?: string;
          ultimo_nsr?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nsr_sequences_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "nsr_sequences_ponto_origem_id_fkey";
            columns: ["ponto_origem_id"];
            isOneToOne: false;
            referencedRelation: "ponto_origens";
            referencedColumns: ["id"];
          },
        ];
      };
      painel_kpis_mensais: {
        Row: {
          absenteismo_pct: number | null;
          admissoes: number;
          afastamentos_ativos: number;
          ano: number;
          banco_horas_credito_min: number;
          banco_horas_saldo_min: number;
          created_at: string | null;
          desligamentos: number;
          empresa_id: string;
          faltas_total: number;
          he_banco_min: number;
          he_por_percentual: Json;
          he_total_min: number;
          headcount_medio: number;
          id: string;
          mes: number;
          setor_id: string | null;
          turnover_pct: number | null;
          unidade_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          absenteismo_pct?: number | null;
          admissoes?: number;
          afastamentos_ativos?: number;
          ano: number;
          banco_horas_credito_min?: number;
          banco_horas_saldo_min?: number;
          created_at?: string | null;
          desligamentos?: number;
          empresa_id: string;
          faltas_total?: number;
          he_banco_min?: number;
          he_por_percentual?: Json;
          he_total_min?: number;
          headcount_medio?: number;
          id?: string;
          mes: number;
          setor_id?: string | null;
          turnover_pct?: number | null;
          unidade_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          absenteismo_pct?: number | null;
          admissoes?: number;
          afastamentos_ativos?: number;
          ano?: number;
          banco_horas_credito_min?: number;
          banco_horas_saldo_min?: number;
          created_at?: string | null;
          desligamentos?: number;
          empresa_id?: string;
          faltas_total?: number;
          he_banco_min?: number;
          he_por_percentual?: Json;
          he_total_min?: number;
          headcount_medio?: number;
          id?: string;
          mes?: number;
          setor_id?: string | null;
          turnover_pct?: number | null;
          unidade_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "painel_kpis_mensais_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "painel_kpis_mensais_setor_id_fkey";
            columns: ["setor_id"];
            isOneToOne: false;
            referencedRelation: "setores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "painel_kpis_mensais_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      painel_kpis_snapshot: {
        Row: {
          calculado_em: string;
          empresa_id: string;
          id: string;
          origem: string;
          payload: Json;
          periodo_fim: string;
          periodo_inicio: string;
          user_id: string;
          versao_calculo: string | null;
        };
        Insert: {
          calculado_em?: string;
          empresa_id: string;
          id?: string;
          origem: string;
          payload: Json;
          periodo_fim: string;
          periodo_inicio: string;
          user_id: string;
          versao_calculo?: string | null;
        };
        Update: {
          calculado_em?: string;
          empresa_id?: string;
          id?: string;
          origem?: string;
          payload?: Json;
          periodo_fim?: string;
          periodo_inicio?: string;
          user_id?: string;
          versao_calculo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "painel_kpis_snapshot_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      politicas_aplicacao: {
        Row: {
          categoria: string | null;
          created_at: string;
          id: string;
          politica_id: string;
          user_id: string | null;
        };
        Insert: {
          categoria?: string | null;
          created_at?: string;
          id?: string;
          politica_id: string;
          user_id?: string | null;
        };
        Update: {
          categoria?: string | null;
          created_at?: string;
          id?: string;
          politica_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "politicas_aplicacao_politica_id_fkey";
            columns: ["politica_id"];
            isOneToOne: false;
            referencedRelation: "politicas_trabalhistas";
            referencedColumns: ["id"];
          },
        ];
      };
      politicas_bh: {
        Row: {
          ativa: boolean;
          base_legal: string;
          converte_he_100: boolean;
          converte_he_50: boolean;
          created_at: string;
          dias_compensacao: number;
          empresa_id: string | null;
          empresas_ids: string[];
          escopo: string;
          id: string;
          limite_credito_horas: number;
          limite_debito_horas: number;
          nome: string;
          observacao: string | null;
          reflexo_dsr: boolean;
          updated_at: string;
          vencimento_meses: number;
        };
        Insert: {
          ativa?: boolean;
          base_legal?: string;
          converte_he_100?: boolean;
          converte_he_50?: boolean;
          created_at?: string;
          dias_compensacao?: number;
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          id?: string;
          limite_credito_horas?: number;
          limite_debito_horas?: number;
          nome: string;
          observacao?: string | null;
          reflexo_dsr?: boolean;
          updated_at?: string;
          vencimento_meses?: number;
        };
        Update: {
          ativa?: boolean;
          base_legal?: string;
          converte_he_100?: boolean;
          converte_he_50?: boolean;
          created_at?: string;
          dias_compensacao?: number;
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          id?: string;
          limite_credito_horas?: number;
          limite_debito_horas?: number;
          nome?: string;
          observacao?: string | null;
          reflexo_dsr?: boolean;
          updated_at?: string;
          vencimento_meses?: number;
        };
        Relationships: [];
      };
      politicas_he_faixas: {
        Row: {
          ate_minutos: number | null;
          destino: string;
          id: string;
          ordem: number;
          percentual: number;
          politica_id: string;
          tipos_dia: string[];
        };
        Insert: {
          ate_minutos?: number | null;
          destino?: string;
          id?: string;
          ordem: number;
          percentual: number;
          politica_id: string;
          tipos_dia?: string[];
        };
        Update: {
          ate_minutos?: number | null;
          destino?: string;
          id?: string;
          ordem?: number;
          percentual?: number;
          politica_id?: string;
          tipos_dia?: string[];
        };
        Relationships: [
          {
            foreignKeyName: "politicas_he_faixas_politica_id_fkey";
            columns: ["politica_id"];
            isOneToOne: false;
            referencedRelation: "politicas_trabalhistas";
            referencedColumns: ["id"];
          },
        ];
      };
      politicas_historico: {
        Row: {
          alterado_em: string;
          alterado_por: string | null;
          id: string;
          motivo: string | null;
          politica_id: string;
          snapshot: Json;
        };
        Insert: {
          alterado_em?: string;
          alterado_por?: string | null;
          id?: string;
          motivo?: string | null;
          politica_id: string;
          snapshot: Json;
        };
        Update: {
          alterado_em?: string;
          alterado_por?: string | null;
          id?: string;
          motivo?: string | null;
          politica_id?: string;
          snapshot?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "politicas_historico_politica_id_fkey";
            columns: ["politica_id"];
            isOneToOne: false;
            referencedRelation: "politicas_trabalhistas";
            referencedColumns: ["id"];
          },
        ];
      };
      politicas_trabalhistas: {
        Row: {
          ativo: boolean;
          banco_ativo: boolean;
          banco_multiplicador_entrada: number;
          banco_multiplicador_saida: number;
          banco_prazo_meses: number;
          banco_saldo_vencido: string;
          base_adic_noturno_na_he_oj97: boolean;
          base_insalubridade_na_he_sumula132: boolean;
          base_periculosidade_na_he: boolean;
          categoria: string | null;
          comp_mensal_ativo: boolean;
          comp_mensal_saldo_acao: string;
          comp_pontual_ativo: boolean;
          created_at: string;
          created_by: string | null;
          documento_url: string | null;
          domingo_tipo: string;
          dsr_dia_preferencial: number;
          dsr_incluir_he_habitual_sumula172: boolean;
          dsr_perde_por_falta_lei605: boolean;
          empresa_id: string | null;
          empresas_ids: string[];
          escopo: string;
          excedentes_modo: string;
          feriado_percentual: number;
          id: string;
          interjornada_bloqueia_marcacao: boolean;
          interjornada_minimo_minutos: number;
          intrajornada_aplica_acima_de_minutos: number;
          intrajornada_descumprimento_total_sumula437: boolean;
          intrajornada_minimo_minutos: number;
          limite_he_diaria_minutos: number;
          limite_he_mensal_minutos: number | null;
          limite_he_semanal_minutos: number | null;
          limite_jornada_semanal_minutos: number;
          motivo_alteracao: string | null;
          nome: string;
          noturno_fator_reducao: number;
          noturno_fim: string;
          noturno_hora_reduzida: boolean;
          noturno_inicio: string;
          noturno_percentual: number;
          noturno_prorrogacao_sumula60: boolean;
          prioridade: number;
          sabado_tipo: string;
          sobreaviso_ativo: boolean;
          sobreaviso_fator: number;
          tolerancia_diaria_minutos: number;
          tolerancia_entrada_minutos: number;
          tolerancia_saida_minutos: number;
          unidade_id: string | null;
          updated_at: string;
          updated_by: string | null;
          vigencia_fim: string | null;
          vigencia_inicio: string;
        };
        Insert: {
          ativo?: boolean;
          banco_ativo?: boolean;
          banco_multiplicador_entrada?: number;
          banco_multiplicador_saida?: number;
          banco_prazo_meses?: number;
          banco_saldo_vencido?: string;
          base_adic_noturno_na_he_oj97?: boolean;
          base_insalubridade_na_he_sumula132?: boolean;
          base_periculosidade_na_he?: boolean;
          categoria?: string | null;
          comp_mensal_ativo?: boolean;
          comp_mensal_saldo_acao?: string;
          comp_pontual_ativo?: boolean;
          created_at?: string;
          created_by?: string | null;
          documento_url?: string | null;
          domingo_tipo?: string;
          dsr_dia_preferencial?: number;
          dsr_incluir_he_habitual_sumula172?: boolean;
          dsr_perde_por_falta_lei605?: boolean;
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          excedentes_modo?: string;
          feriado_percentual?: number;
          id?: string;
          interjornada_bloqueia_marcacao?: boolean;
          interjornada_minimo_minutos?: number;
          intrajornada_aplica_acima_de_minutos?: number;
          intrajornada_descumprimento_total_sumula437?: boolean;
          intrajornada_minimo_minutos?: number;
          limite_he_diaria_minutos?: number;
          limite_he_mensal_minutos?: number | null;
          limite_he_semanal_minutos?: number | null;
          limite_jornada_semanal_minutos?: number;
          motivo_alteracao?: string | null;
          nome: string;
          noturno_fator_reducao?: number;
          noturno_fim?: string;
          noturno_hora_reduzida?: boolean;
          noturno_inicio?: string;
          noturno_percentual?: number;
          noturno_prorrogacao_sumula60?: boolean;
          prioridade?: number;
          sabado_tipo?: string;
          sobreaviso_ativo?: boolean;
          sobreaviso_fator?: number;
          tolerancia_diaria_minutos?: number;
          tolerancia_entrada_minutos?: number;
          tolerancia_saida_minutos?: number;
          unidade_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          vigencia_fim?: string | null;
          vigencia_inicio: string;
        };
        Update: {
          ativo?: boolean;
          banco_ativo?: boolean;
          banco_multiplicador_entrada?: number;
          banco_multiplicador_saida?: number;
          banco_prazo_meses?: number;
          banco_saldo_vencido?: string;
          base_adic_noturno_na_he_oj97?: boolean;
          base_insalubridade_na_he_sumula132?: boolean;
          base_periculosidade_na_he?: boolean;
          categoria?: string | null;
          comp_mensal_ativo?: boolean;
          comp_mensal_saldo_acao?: string;
          comp_pontual_ativo?: boolean;
          created_at?: string;
          created_by?: string | null;
          documento_url?: string | null;
          domingo_tipo?: string;
          dsr_dia_preferencial?: number;
          dsr_incluir_he_habitual_sumula172?: boolean;
          dsr_perde_por_falta_lei605?: boolean;
          empresa_id?: string | null;
          empresas_ids?: string[];
          escopo?: string;
          excedentes_modo?: string;
          feriado_percentual?: number;
          id?: string;
          interjornada_bloqueia_marcacao?: boolean;
          interjornada_minimo_minutos?: number;
          intrajornada_aplica_acima_de_minutos?: number;
          intrajornada_descumprimento_total_sumula437?: boolean;
          intrajornada_minimo_minutos?: number;
          limite_he_diaria_minutos?: number;
          limite_he_mensal_minutos?: number | null;
          limite_he_semanal_minutos?: number | null;
          limite_jornada_semanal_minutos?: number;
          motivo_alteracao?: string | null;
          nome?: string;
          noturno_fator_reducao?: number;
          noturno_fim?: string;
          noturno_hora_reduzida?: boolean;
          noturno_inicio?: string;
          noturno_percentual?: number;
          noturno_prorrogacao_sumula60?: boolean;
          prioridade?: number;
          sabado_tipo?: string;
          sobreaviso_ativo?: boolean;
          sobreaviso_fator?: number;
          tolerancia_diaria_minutos?: number;
          tolerancia_entrada_minutos?: number;
          tolerancia_saida_minutos?: number;
          unidade_id?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          vigencia_fim?: string | null;
          vigencia_inicio?: string;
        };
        Relationships: [
          {
            foreignKeyName: "politicas_trabalhistas_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "politicas_trabalhistas_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      ponto_origens: {
        Row: {
          ativo: boolean;
          created_at: string;
          empresa_id: string;
          fabricante: string | null;
          gera_afd: boolean;
          gera_nsr: boolean;
          id: string;
          identificador: string | null;
          nome: string;
          serial: string | null;
          tipo: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          empresa_id: string;
          fabricante?: string | null;
          gera_afd?: boolean;
          gera_nsr?: boolean;
          id?: string;
          identificador?: string | null;
          nome: string;
          serial?: string | null;
          tipo: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          empresa_id?: string;
          fabricante?: string | null;
          gera_afd?: boolean;
          gera_nsr?: boolean;
          id?: string;
          identificador?: string | null;
          nome?: string;
          serial?: string | null;
          tipo?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ponto_origens_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          aceite_gps_em: string | null;
          aceite_selfie_em: string | null;
          aceite_versao_termos: string | null;
          ativo: boolean;
          cargo: string | null;
          cbo: string | null;
          convite_enviado_em: string | null;
          cpf: string | null;
          cpf_encrypted: string | null;
          cpf_hash: string | null;
          created_at: string;
          dados_complementares: Json;
          data_admissao: string | null;
          data_nascimento: string | null;
          departamento_id: string | null;
          email_2fa: string | null;
          email_pessoal: string | null;
          empresa_id: string | null;
          equipe_id: string | null;
          foto_url: string | null;
          horario_id: string | null;
          id: string;
          matricula: string | null;
          mfa_email_enabled: boolean;
          mfa_last_verified_at: string | null;
          nome: string;
          pis: string | null;
          politica_bh_id: string | null;
          primeiro_acesso_em: string | null;
          regime: string | null;
          salario_base: number | null;
          setor_id: string | null;
          telefone: string | null;
          unidade_id: string | null;
          updated_at: string;
          vinculo: string | null;
        };
        Insert: {
          aceite_gps_em?: string | null;
          aceite_selfie_em?: string | null;
          aceite_versao_termos?: string | null;
          ativo?: boolean;
          cargo?: string | null;
          cbo?: string | null;
          convite_enviado_em?: string | null;
          cpf?: string | null;
          cpf_encrypted?: string | null;
          cpf_hash?: string | null;
          created_at?: string;
          dados_complementares?: Json;
          data_admissao?: string | null;
          data_nascimento?: string | null;
          departamento_id?: string | null;
          email_2fa?: string | null;
          email_pessoal?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          foto_url?: string | null;
          horario_id?: string | null;
          id: string;
          matricula?: string | null;
          mfa_email_enabled?: boolean;
          mfa_last_verified_at?: string | null;
          nome: string;
          pis?: string | null;
          politica_bh_id?: string | null;
          primeiro_acesso_em?: string | null;
          regime?: string | null;
          salario_base?: number | null;
          setor_id?: string | null;
          telefone?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
          vinculo?: string | null;
        };
        Update: {
          aceite_gps_em?: string | null;
          aceite_selfie_em?: string | null;
          aceite_versao_termos?: string | null;
          ativo?: boolean;
          cargo?: string | null;
          cbo?: string | null;
          convite_enviado_em?: string | null;
          cpf?: string | null;
          cpf_encrypted?: string | null;
          cpf_hash?: string | null;
          created_at?: string;
          dados_complementares?: Json;
          data_admissao?: string | null;
          data_nascimento?: string | null;
          departamento_id?: string | null;
          email_2fa?: string | null;
          email_pessoal?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          foto_url?: string | null;
          horario_id?: string | null;
          id?: string;
          matricula?: string | null;
          mfa_email_enabled?: boolean;
          mfa_last_verified_at?: string | null;
          nome?: string;
          pis?: string | null;
          politica_bh_id?: string | null;
          primeiro_acesso_em?: string | null;
          regime?: string | null;
          salario_base?: number | null;
          setor_id?: string | null;
          telefone?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
          vinculo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_departamento_id_fkey";
            columns: ["departamento_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_equipe_id_fkey";
            columns: ["equipe_id"];
            isOneToOne: false;
            referencedRelation: "equipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_horario_id_fkey";
            columns: ["horario_id"];
            isOneToOne: false;
            referencedRelation: "horarios_padrao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_politica_bh_id_fkey";
            columns: ["politica_bh_id"];
            isOneToOne: false;
            referencedRelation: "politicas_bh";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_setor_id_fkey";
            columns: ["setor_id"];
            isOneToOne: false;
            referencedRelation: "setores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limits: {
        Row: {
          action: string | null;
          blocked: boolean | null;
          created_at: string;
          empresa_id: string | null;
          endpoint: string;
          fingerprint: string | null;
          id: string;
          ip_address: unknown;
          metadata: Json | null;
          method: string | null;
          retry_after_seconds: number | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action?: string | null;
          blocked?: boolean | null;
          created_at?: string;
          empresa_id?: string | null;
          endpoint: string;
          fingerprint?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          method?: string | null;
          retry_after_seconds?: number | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string | null;
          blocked?: boolean | null;
          created_at?: string;
          empresa_id?: string | null;
          endpoint?: string;
          fingerprint?: string | null;
          id?: string;
          ip_address?: unknown;
          metadata?: Json | null;
          method?: string | null;
          retry_after_seconds?: number | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rate_limits_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      rep_devices: {
        Row: {
          ativo: boolean;
          created_at: string;
          data_fim_uso: string | null;
          data_inicio_uso: string;
          empresa_id: string;
          fabricante: string | null;
          id: string;
          identificador: string;
          ingest_enabled: boolean;
          ingest_id: string;
          ip_local: unknown;
          last_ingest_ip: unknown;
          last_ingest_user_agent: string | null;
          last_seen_at: string | null;
          last_seen_ip: unknown;
          modelo: string | null;
          nr_id_estab: string;
          nr_registro_rep: string | null;
          numero_serie: string | null;
          tipo_id_estab: number;
          tipo_rep: string;
          token_rotated_at: string | null;
          ultimo_ping_em: string | null;
          ultimo_uso_em: string | null;
          unidade_id: string | null;
          updated_at: string;
          versao_firmware: string | null;
          webhook_token_hash: string | null;
          webhook_token_last4: string | null;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          data_fim_uso?: string | null;
          data_inicio_uso?: string;
          empresa_id: string;
          fabricante?: string | null;
          id?: string;
          identificador: string;
          ingest_enabled?: boolean;
          ingest_id?: string;
          ip_local?: unknown;
          last_ingest_ip?: unknown;
          last_ingest_user_agent?: string | null;
          last_seen_at?: string | null;
          last_seen_ip?: unknown;
          modelo?: string | null;
          nr_id_estab: string;
          nr_registro_rep?: string | null;
          numero_serie?: string | null;
          tipo_id_estab?: number;
          tipo_rep: string;
          token_rotated_at?: string | null;
          ultimo_ping_em?: string | null;
          ultimo_uso_em?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
          versao_firmware?: string | null;
          webhook_token_hash?: string | null;
          webhook_token_last4?: string | null;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          data_fim_uso?: string | null;
          data_inicio_uso?: string;
          empresa_id?: string;
          fabricante?: string | null;
          id?: string;
          identificador?: string;
          ingest_enabled?: boolean;
          ingest_id?: string;
          ip_local?: unknown;
          last_ingest_ip?: unknown;
          last_ingest_user_agent?: string | null;
          last_seen_at?: string | null;
          last_seen_ip?: unknown;
          modelo?: string | null;
          nr_id_estab?: string;
          nr_registro_rep?: string | null;
          numero_serie?: string | null;
          tipo_id_estab?: number;
          tipo_rep?: string;
          token_rotated_at?: string | null;
          ultimo_ping_em?: string | null;
          ultimo_uso_em?: string | null;
          unidade_id?: string | null;
          updated_at?: string;
          versao_firmware?: string | null;
          webhook_token_hash?: string | null;
          webhook_token_last4?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rep_devices_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rep_devices_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      rep_ingestion_errors: {
        Row: {
          empresa_id: string | null;
          id: string;
          motivo: string;
          nsr: string | null;
          payload_json: Json | null;
          pin: string | null;
          received_at: string;
          rep_device_id: string | null;
          rep_id_payload: string | null;
        };
        Insert: {
          empresa_id?: string | null;
          id?: string;
          motivo: string;
          nsr?: string | null;
          payload_json?: Json | null;
          pin?: string | null;
          received_at?: string;
          rep_device_id?: string | null;
          rep_id_payload?: string | null;
        };
        Update: {
          empresa_id?: string | null;
          id?: string;
          motivo?: string;
          nsr?: string | null;
          payload_json?: Json | null;
          pin?: string | null;
          received_at?: string;
          rep_device_id?: string | null;
          rep_id_payload?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rep_ingestion_errors_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rep_ingestion_errors_rep_device_id_fkey";
            columns: ["rep_device_id"];
            isOneToOne: false;
            referencedRelation: "rep_devices";
            referencedColumns: ["id"];
          },
        ];
      };
      rep_ingestor_events: {
        Row: {
          created_at: string;
          empresa_id: string | null;
          id: string;
          metadata: Json | null;
          nsr: string | null;
          pin_hash: string | null;
          rep_id: string | null;
          tipo: string;
        };
        Insert: {
          created_at?: string;
          empresa_id?: string | null;
          id?: string;
          metadata?: Json | null;
          nsr?: string | null;
          pin_hash?: string | null;
          rep_id?: string | null;
          tipo: string;
        };
        Update: {
          created_at?: string;
          empresa_id?: string | null;
          id?: string;
          metadata?: Json | null;
          nsr?: string | null;
          pin_hash?: string | null;
          rep_id?: string | null;
          tipo?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rep_ingestor_events_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rep_ingestor_events_rep_id_fkey";
            columns: ["rep_id"];
            isOneToOne: false;
            referencedRelation: "rep_devices";
            referencedColumns: ["id"];
          },
        ];
      };
      role_permissions: {
        Row: {
          acao: string;
          empresa_id: string;
          id: string;
          modulo: string;
          permitido: boolean;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          acao: string;
          empresa_id: string;
          id?: string;
          modulo: string;
          permitido?: boolean;
          role: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          acao?: string;
          empresa_id?: string;
          id?: string;
          modulo?: string;
          permitido?: boolean;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      saude_ocupacional_asos: {
        Row: {
          admissao_id: string | null;
          colaborador_id: string;
          created_at: string | null;
          data_exame: string;
          documento_id: string | null;
          empresa_id: string;
          id: string;
          medico_crm: string | null;
          medico_nome: string | null;
          resultado: string;
          tipo_exame: string;
          updated_at: string | null;
        };
        Insert: {
          admissao_id?: string | null;
          colaborador_id: string;
          created_at?: string | null;
          data_exame: string;
          documento_id?: string | null;
          empresa_id: string;
          id?: string;
          medico_crm?: string | null;
          medico_nome?: string | null;
          resultado: string;
          tipo_exame: string;
          updated_at?: string | null;
        };
        Update: {
          admissao_id?: string | null;
          colaborador_id?: string;
          created_at?: string | null;
          data_exame?: string;
          documento_id?: string | null;
          empresa_id?: string;
          id?: string;
          medico_crm?: string | null;
          medico_nome?: string | null;
          resultado?: string;
          tipo_exame?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "saude_ocupacional_asos_admissao_id_fkey";
            columns: ["admissao_id"];
            isOneToOne: false;
            referencedRelation: "admissoes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saude_ocupacional_asos_colaborador_id_fkey";
            columns: ["colaborador_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saude_ocupacional_asos_colaborador_id_fkey";
            columns: ["colaborador_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saude_ocupacional_asos_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saude_ocupacional_asos_documento_id_fkey";
            columns: ["documento_id"];
            isOneToOne: false;
            referencedRelation: "documentos_aguardando_acao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "saude_ocupacional_asos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      setores: {
        Row: {
          ativo: boolean;
          codigo: string | null;
          created_at: string;
          departamento_id: string | null;
          empresa_id: string;
          id: string;
          nome: string;
          responsavel_id: string | null;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          codigo?: string | null;
          created_at?: string;
          departamento_id?: string | null;
          empresa_id: string;
          id?: string;
          nome: string;
          responsavel_id?: string | null;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          codigo?: string | null;
          created_at?: string;
          departamento_id?: string | null;
          empresa_id?: string;
          id?: string;
          nome?: string;
          responsavel_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "setores_departamento_id_fkey";
            columns: ["departamento_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "setores_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      signature_audit_events: {
        Row: {
          actor_profile_id: string | null;
          created_at: string;
          document_id: string | null;
          document_version_id: string | null;
          event: Database["public"]["Enums"]["sign_audit_event"];
          event_hash: string;
          id: string;
          payload: Json;
          prev_hash: string | null;
          signature_id: string | null;
        };
        Insert: {
          actor_profile_id?: string | null;
          created_at?: string;
          document_id?: string | null;
          document_version_id?: string | null;
          event: Database["public"]["Enums"]["sign_audit_event"];
          event_hash?: string;
          id?: string;
          payload?: Json;
          prev_hash?: string | null;
          signature_id?: string | null;
        };
        Update: {
          actor_profile_id?: string | null;
          created_at?: string;
          document_id?: string | null;
          document_version_id?: string | null;
          event?: Database["public"]["Enums"]["sign_audit_event"];
          event_hash?: string;
          id?: string;
          payload?: Json;
          prev_hash?: string | null;
          signature_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "signature_audit_events_actor_profile_id_fkey";
            columns: ["actor_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "signature_audit_events_actor_profile_id_fkey";
            columns: ["actor_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      signature_evidence: {
        Row: {
          accepted_at_utc: string;
          accepted_text_sha256: string;
          created_at: string;
          device_fingerprint: string | null;
          document_view_count: number;
          ip: unknown;
          mfa_method: string | null;
          mfa_verified_at: string | null;
          signature_id: string;
          timezone: string | null;
          user_agent: string;
          viewed_duration_ms: number | null;
        };
        Insert: {
          accepted_at_utc: string;
          accepted_text_sha256: string;
          created_at?: string;
          device_fingerprint?: string | null;
          document_view_count?: number;
          ip: unknown;
          mfa_method?: string | null;
          mfa_verified_at?: string | null;
          signature_id: string;
          timezone?: string | null;
          user_agent: string;
          viewed_duration_ms?: number | null;
        };
        Update: {
          accepted_at_utc?: string;
          accepted_text_sha256?: string;
          created_at?: string;
          device_fingerprint?: string | null;
          document_view_count?: number;
          ip?: unknown;
          mfa_method?: string | null;
          mfa_verified_at?: string | null;
          signature_id?: string;
          timezone?: string | null;
          user_agent?: string;
          viewed_duration_ms?: number | null;
        };
        Relationships: [];
      };
      signatures: {
        Row: {
          created_at: string | null;
          document_signer_id: string;
          id: string;
          manifest_key_id: string;
          manifest_sha256: string;
          manifest_signature_b64: string;
          otp_hash: string | null;
          signer_cpf: string;
        };
        Insert: {
          created_at?: string | null;
          document_signer_id: string;
          id?: string;
          manifest_key_id: string;
          manifest_sha256: string;
          manifest_signature_b64: string;
          otp_hash?: string | null;
          signer_cpf: string;
        };
        Update: {
          created_at?: string | null;
          document_signer_id?: string;
          id?: string;
          manifest_key_id?: string;
          manifest_sha256?: string;
          manifest_signature_b64?: string;
          otp_hash?: string | null;
          signer_cpf?: string;
        };
        Relationships: [
          {
            foreignKeyName: "signatures_document_signer_id_fkey";
            columns: ["document_signer_id"];
            isOneToOne: false;
            referencedRelation: "document_signers";
            referencedColumns: ["id"];
          },
        ];
      };
      solicitacao_eventos: {
        Row: {
          autor_id: string;
          comentario: string | null;
          created_at: string;
          id: string;
          metadata: Json | null;
          solicitacao_id: string;
          tipo: Database["public"]["Enums"]["solic_evento_tipo"];
        };
        Insert: {
          autor_id: string;
          comentario?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          solicitacao_id: string;
          tipo: Database["public"]["Enums"]["solic_evento_tipo"];
        };
        Update: {
          autor_id?: string;
          comentario?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          solicitacao_id?: string;
          tipo?: Database["public"]["Enums"]["solic_evento_tipo"];
        };
        Relationships: [
          {
            foreignKeyName: "solicitacao_eventos_solicitacao_id_fkey";
            columns: ["solicitacao_id"];
            isOneToOne: false;
            referencedRelation: "solicitacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      solicitacoes: {
        Row: {
          anexo_path: string | null;
          created_at: string;
          dados_extraidos: Json | null;
          data_referencia: string | null;
          decidida_em: string | null;
          decidida_por: string | null;
          decisao_comentario: string | null;
          descricao: string | null;
          descricao_sanitizada_ai: string | null;
          empresa_id: string | null;
          extracao_em: string | null;
          extracao_modelo: string | null;
          extracao_redacoes_count: number | null;
          extracao_sanitizada: boolean | null;
          hora_referencia: string | null;
          id: string;
          marcacao_id: string | null;
          prioridade: Database["public"]["Enums"]["solicitacao_prioridade"];
          status: Database["public"]["Enums"]["solicitacao_status"];
          tipo: Database["public"]["Enums"]["solicitacao_tipo"];
          titulo: string;
          unidade_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          anexo_path?: string | null;
          created_at?: string;
          dados_extraidos?: Json | null;
          data_referencia?: string | null;
          decidida_em?: string | null;
          decidida_por?: string | null;
          decisao_comentario?: string | null;
          descricao?: string | null;
          descricao_sanitizada_ai?: string | null;
          empresa_id?: string | null;
          extracao_em?: string | null;
          extracao_modelo?: string | null;
          extracao_redacoes_count?: number | null;
          extracao_sanitizada?: boolean | null;
          hora_referencia?: string | null;
          id?: string;
          marcacao_id?: string | null;
          prioridade?: Database["public"]["Enums"]["solicitacao_prioridade"];
          status?: Database["public"]["Enums"]["solicitacao_status"];
          tipo: Database["public"]["Enums"]["solicitacao_tipo"];
          titulo: string;
          unidade_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          anexo_path?: string | null;
          created_at?: string;
          dados_extraidos?: Json | null;
          data_referencia?: string | null;
          decidida_em?: string | null;
          decidida_por?: string | null;
          decisao_comentario?: string | null;
          descricao?: string | null;
          descricao_sanitizada_ai?: string | null;
          empresa_id?: string | null;
          extracao_em?: string | null;
          extracao_modelo?: string | null;
          extracao_redacoes_count?: number | null;
          extracao_sanitizada?: boolean | null;
          hora_referencia?: string | null;
          id?: string;
          marcacao_id?: string | null;
          prioridade?: Database["public"]["Enums"]["solicitacao_prioridade"];
          status?: Database["public"]["Enums"]["solicitacao_status"];
          tipo?: Database["public"]["Enums"]["solicitacao_tipo"];
          titulo?: string;
          unidade_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "solicitacoes_marcacao_id_fkey";
            columns: ["marcacao_id"];
            isOneToOne: false;
            referencedRelation: "marcacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      solicitacoes_titulares: {
        Row: {
          cpf: string;
          created_at: string;
          empresa_id: string;
          id: string;
          nome: string;
          prazo_dias: number;
          solicitacao: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          cpf: string;
          created_at?: string;
          empresa_id: string;
          id?: string;
          nome: string;
          prazo_dias?: number;
          solicitacao: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          cpf?: string;
          created_at?: string;
          empresa_id?: string;
          id?: string;
          nome?: string;
          prazo_dias?: number;
          solicitacao?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "solicitacoes_titulares_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      super_admin_logs: {
        Row: {
          acao: string;
          created_at: string | null;
          id: string;
          payload: Json | null;
          target_empresa_id: string | null;
          user_id: string;
        };
        Insert: {
          acao: string;
          created_at?: string | null;
          id?: string;
          payload?: Json | null;
          target_empresa_id?: string | null;
          user_id: string;
        };
        Update: {
          acao?: string;
          created_at?: string | null;
          id?: string;
          payload?: Json | null;
          target_empresa_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "super_admin_logs_target_empresa_id_fkey";
            columns: ["target_empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      super_admins: {
        Row: {
          ativo: boolean;
          concedido_por: string | null;
          created_at: string | null;
          user_id: string;
        };
        Insert: {
          ativo?: boolean;
          concedido_por?: string | null;
          created_at?: string | null;
          user_id: string;
        };
        Update: {
          ativo?: boolean;
          concedido_por?: string | null;
          created_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      tipos_documentais: {
        Row: {
          assinar: boolean;
          ativo: boolean | null;
          base_legal: string;
          categoria: string;
          created_at: string;
          empresa_id: string | null;
          gera_esocial: string | null;
          id: string;
          modelo_personalizado: Json | null;
          nome: string;
          obrigatorio: string;
          observacao_esocial: string | null;
          prazo_emissao: string | null;
          prazo_guarda: string;
          updated_at: string;
        };
        Insert: {
          assinar?: boolean;
          ativo?: boolean | null;
          base_legal: string;
          categoria: string;
          created_at?: string;
          empresa_id?: string | null;
          gera_esocial?: string | null;
          id: string;
          modelo_personalizado?: Json | null;
          nome: string;
          obrigatorio: string;
          observacao_esocial?: string | null;
          prazo_emissao?: string | null;
          prazo_guarda: string;
          updated_at?: string;
        };
        Update: {
          assinar?: boolean;
          ativo?: boolean | null;
          base_legal?: string;
          categoria?: string;
          created_at?: string;
          empresa_id?: string | null;
          gera_esocial?: string | null;
          id?: string;
          modelo_personalizado?: Json | null;
          nome?: string;
          obrigatorio?: string;
          observacao_esocial?: string | null;
          prazo_emissao?: string | null;
          prazo_guarda?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tipos_documentais_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      tipos_ocorrencia_config: {
        Row: {
          ativo_overrides: Json;
          custom_items: Json;
          empresa_id: string;
          updated_at: string;
        };
        Insert: {
          ativo_overrides?: Json;
          custom_items?: Json;
          empresa_id: string;
          updated_at?: string;
        };
        Update: {
          ativo_overrides?: Json;
          custom_items?: Json;
          empresa_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tipos_ocorrencia_config_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: true;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      tipos_solicitacao_config: {
        Row: {
          ativo_overrides: Json;
          custom_items: Json;
          empresa_id: string;
          updated_at: string;
        };
        Insert: {
          ativo_overrides?: Json;
          custom_items?: Json;
          empresa_id: string;
          updated_at?: string;
        };
        Update: {
          ativo_overrides?: Json;
          custom_items?: Json;
          empresa_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tipos_solicitacao_config_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: true;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      transport_fares: {
        Row: {
          category: string;
          created_at: string;
          created_by: string | null;
          id: string;
          modal: string;
          notes: string | null;
          operator_id: string;
          source: string;
          source_ref: string | null;
          valid_from: string;
          valid_to: string | null;
          value_cents: number;
        };
        Insert: {
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          modal: string;
          notes?: string | null;
          operator_id: string;
          source: string;
          source_ref?: string | null;
          valid_from: string;
          valid_to?: string | null;
          value_cents: number;
        };
        Update: {
          category?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          modal?: string;
          notes?: string | null;
          operator_id?: string;
          source?: string;
          source_ref?: string | null;
          valid_from?: string;
          valid_to?: string | null;
          value_cents?: number;
        };
        Relationships: [
          {
            foreignKeyName: "transport_fares_operator_id_fkey";
            columns: ["operator_id"];
            isOneToOne: false;
            referencedRelation: "transport_operators";
            referencedColumns: ["id"];
          },
        ];
      };
      transport_lines: {
        Row: {
          active: boolean;
          external_code: string | null;
          id: string;
          last_synced_at: string | null;
          name: string | null;
          number: string;
          operator_id: string;
          payload_json: Json | null;
          sentido: number | null;
        };
        Insert: {
          active?: boolean;
          external_code?: string | null;
          id?: string;
          last_synced_at?: string | null;
          name?: string | null;
          number: string;
          operator_id: string;
          payload_json?: Json | null;
          sentido?: number | null;
        };
        Update: {
          active?: boolean;
          external_code?: string | null;
          id?: string;
          last_synced_at?: string | null;
          name?: string | null;
          number?: string;
          operator_id?: string;
          payload_json?: Json | null;
          sentido?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "transport_lines_operator_id_fkey";
            columns: ["operator_id"];
            isOneToOne: false;
            referencedRelation: "transport_operators";
            referencedColumns: ["id"];
          },
        ];
      };
      transport_operators: {
        Row: {
          active: boolean;
          api_kind: string | null;
          code: string;
          created_at: string;
          has_api: boolean;
          id: string;
          name: string;
          region: string | null;
          uf: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          api_kind?: string | null;
          code: string;
          created_at?: string;
          has_api?: boolean;
          id?: string;
          name: string;
          region?: string | null;
          uf?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          api_kind?: string | null;
          code?: string;
          created_at?: string;
          has_api?: boolean;
          id?: string;
          name?: string;
          region?: string | null;
          uf?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      turnos: {
        Row: {
          ativo: boolean;
          created_at: string;
          empresa_id: string;
          hora_fim: string;
          hora_inicio: string;
          id: string;
          nome: string;
          sequencia: string;
          tipo: string;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          empresa_id: string;
          hora_fim?: string;
          hora_inicio?: string;
          id?: string;
          nome: string;
          sequencia?: string;
          tipo?: string;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          empresa_id?: string;
          hora_fim?: string;
          hora_inicio?: string;
          id?: string;
          nome?: string;
          sequencia?: string;
          tipo?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      unidades: {
        Row: {
          ativo: boolean;
          cep: string | null;
          created_at: string;
          empresa_id: string;
          endereco: string | null;
          id: string;
          latitude: number | null;
          longitude: number | null;
          nome: string;
          raio_metros: number;
          regras_cerca: Json | null;
          updated_at: string;
        };
        Insert: {
          ativo?: boolean;
          cep?: string | null;
          created_at?: string;
          empresa_id: string;
          endereco?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          nome: string;
          raio_metros?: number;
          regras_cerca?: Json | null;
          updated_at?: string;
        };
        Update: {
          ativo?: boolean;
          cep?: string | null;
          created_at?: string;
          empresa_id?: string;
          endereco?: string | null;
          id?: string;
          latitude?: number | null;
          longitude?: number | null;
          nome?: string;
          raio_metros?: number;
          regras_cerca?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unidades_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      user_empresa_acessos: {
        Row: {
          ativo: boolean;
          created_at: string | null;
          empresa_id: string;
          escopo: Json;
          id: string;
          role: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          ativo?: boolean;
          created_at?: string | null;
          empresa_id: string;
          escopo?: Json;
          id?: string;
          role: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          ativo?: boolean;
          created_at?: string | null;
          empresa_id?: string;
          escopo?: Json;
          id?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_empresa_acessos_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      user_permissions: {
        Row: {
          acao: string;
          empresa_id: string;
          id: string;
          modulo: string;
          permitido: boolean;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          acao: string;
          empresa_id: string;
          id?: string;
          modulo: string;
          permitido?: boolean;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          acao?: string;
          empresa_id?: string;
          id?: string;
          modulo?: string;
          permitido?: boolean;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_permissions_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      vault_secrets: {
        Row: {
          created_at: string;
          created_by: string | null;
          description: string | null;
          id: string;
          name: string;
          secret: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          secret: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          secret?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vault_secrets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vault_secrets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_addresses: {
        Row: {
          bairro: string | null;
          cep: string | null;
          cidade: string | null;
          complemento: string | null;
          created_at: string;
          id: string;
          lat: number | null;
          lng: number | null;
          logradouro: string | null;
          numero: string | null;
          profile_id: string;
          uf: string | null;
          updated_at: string;
          validated_at: string | null;
          validated_by: string | null;
        };
        Insert: {
          bairro?: string | null;
          cep?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          logradouro?: string | null;
          numero?: string | null;
          profile_id: string;
          uf?: string | null;
          updated_at?: string;
          validated_at?: string | null;
          validated_by?: string | null;
        };
        Update: {
          bairro?: string | null;
          cep?: string | null;
          cidade?: string | null;
          complemento?: string | null;
          created_at?: string;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          logradouro?: string | null;
          numero?: string | null;
          profile_id?: string;
          uf?: string | null;
          updated_at?: string;
          validated_at?: string | null;
          validated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vt_addresses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_addresses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_alerts: {
        Row: {
          benefit_id: string;
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["vt_alert_kind"];
          message: string;
          resolved_at: string | null;
          resolved_by: string | null;
          severity: Database["public"]["Enums"]["vt_alert_severity"];
        };
        Insert: {
          benefit_id: string;
          created_at?: string;
          id?: string;
          kind: Database["public"]["Enums"]["vt_alert_kind"];
          message: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: Database["public"]["Enums"]["vt_alert_severity"];
        };
        Update: {
          benefit_id?: string;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["vt_alert_kind"];
          message?: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
          severity?: Database["public"]["Enums"]["vt_alert_severity"];
        };
        Relationships: [
          {
            foreignKeyName: "vt_alerts_benefit_id_fkey";
            columns: ["benefit_id"];
            isOneToOne: false;
            referencedRelation: "vt_benefits";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_audit_log: {
        Row: {
          action: string;
          actor_id: string | null;
          after_jsonb: Json | null;
          at: string;
          before_jsonb: Json | null;
          entity: string;
          entity_id: string;
          id: string;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          after_jsonb?: Json | null;
          at?: string;
          before_jsonb?: Json | null;
          entity: string;
          entity_id: string;
          id?: string;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          after_jsonb?: Json | null;
          at?: string;
          before_jsonb?: Json | null;
          entity?: string;
          entity_id?: string;
          id?: string;
        };
        Relationships: [];
      };
      vt_benefits: {
        Row: {
          address_id: string | null;
          created_at: string;
          created_by: string | null;
          current_calc_id: string | null;
          days_per_month: number;
          desconto_legal_pct: number;
          empresa_id: string | null;
          end_date: string | null;
          id: string;
          profile_id: string;
          salary_base_cents: number;
          start_date: string | null;
          status: Database["public"]["Enums"]["vt_status"];
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          address_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          current_calc_id?: string | null;
          days_per_month?: number;
          desconto_legal_pct?: number;
          empresa_id?: string | null;
          end_date?: string | null;
          id?: string;
          profile_id: string;
          salary_base_cents?: number;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["vt_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          address_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          current_calc_id?: string | null;
          days_per_month?: number;
          desconto_legal_pct?: number;
          empresa_id?: string | null;
          end_date?: string | null;
          id?: string;
          profile_id?: string;
          salary_base_cents?: number;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["vt_status"];
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vt_benefits_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "vt_addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_benefits_current_calc_fk";
            columns: ["current_calc_id"];
            isOneToOne: false;
            referencedRelation: "vt_calculations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_benefits_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_benefits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_benefits_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles_with_cpf";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_calculations: {
        Row: {
          ajuste_mes_anterior_cents: number;
          ano: number | null;
          apuracao_mes_id: string | null;
          benefit_id: string;
          calculated_at: string;
          calculated_by: string | null;
          custo_diario_cents: number;
          custo_empresa_cents: number;
          custo_mensal_bruto_cents: number;
          days_per_month: number;
          desconto_funcionario_cents: number;
          desconto_legal_pct: number;
          dias_excluidos_json: Json | null;
          dias_planejados: number | null;
          dias_vt_devidos: number | null;
          folha_id: string | null;
          hash_snapshot: string | null;
          id: string;
          mes: number | null;
          salary_base_cents: number;
          snapshot: Json;
          snapshot_json: Json | null;
          status: string | null;
          tipo_calculo: string | null;
          trigger: Database["public"]["Enums"]["vt_calc_trigger"];
        };
        Insert: {
          ajuste_mes_anterior_cents?: number;
          ano?: number | null;
          apuracao_mes_id?: string | null;
          benefit_id: string;
          calculated_at?: string;
          calculated_by?: string | null;
          custo_diario_cents: number;
          custo_empresa_cents: number;
          custo_mensal_bruto_cents: number;
          days_per_month: number;
          desconto_funcionario_cents: number;
          desconto_legal_pct: number;
          dias_excluidos_json?: Json | null;
          dias_planejados?: number | null;
          dias_vt_devidos?: number | null;
          folha_id?: string | null;
          hash_snapshot?: string | null;
          id?: string;
          mes?: number | null;
          salary_base_cents: number;
          snapshot: Json;
          snapshot_json?: Json | null;
          status?: string | null;
          tipo_calculo?: string | null;
          trigger?: Database["public"]["Enums"]["vt_calc_trigger"];
        };
        Update: {
          ajuste_mes_anterior_cents?: number;
          ano?: number | null;
          apuracao_mes_id?: string | null;
          benefit_id?: string;
          calculated_at?: string;
          calculated_by?: string | null;
          custo_diario_cents?: number;
          custo_empresa_cents?: number;
          custo_mensal_bruto_cents?: number;
          days_per_month?: number;
          desconto_funcionario_cents?: number;
          desconto_legal_pct?: number;
          dias_excluidos_json?: Json | null;
          dias_planejados?: number | null;
          dias_vt_devidos?: number | null;
          folha_id?: string | null;
          hash_snapshot?: string | null;
          id?: string;
          mes?: number | null;
          salary_base_cents?: number;
          snapshot?: Json;
          snapshot_json?: Json | null;
          status?: string | null;
          tipo_calculo?: string | null;
          trigger?: Database["public"]["Enums"]["vt_calc_trigger"];
        };
        Relationships: [
          {
            foreignKeyName: "vt_calculations_apuracao_mes_id_fkey";
            columns: ["apuracao_mes_id"];
            isOneToOne: false;
            referencedRelation: "apuracoes_mes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_calculations_benefit_id_fkey";
            columns: ["benefit_id"];
            isOneToOne: false;
            referencedRelation: "vt_benefits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_calculations_folha_id_fkey";
            columns: ["folha_id"];
            isOneToOne: false;
            referencedRelation: "folhas_mes";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_documents: {
        Row: {
          approved_at: string | null;
          approved_by: string | null;
          benefit_id: string;
          calc_id: string;
          cancelled_at: string | null;
          cancelled_reason: string | null;
          generated_at: string;
          generated_by: string | null;
          html_storage_path: string | null;
          id: string;
          pdf_storage_path: string | null;
          signature_provider: string | null;
          signature_provider_ref: string | null;
          signed_at: string | null;
          signed_pdf_storage_path: string | null;
          status: Database["public"]["Enums"]["vt_document_status"];
        };
        Insert: {
          approved_at?: string | null;
          approved_by?: string | null;
          benefit_id: string;
          calc_id: string;
          cancelled_at?: string | null;
          cancelled_reason?: string | null;
          generated_at?: string;
          generated_by?: string | null;
          html_storage_path?: string | null;
          id?: string;
          pdf_storage_path?: string | null;
          signature_provider?: string | null;
          signature_provider_ref?: string | null;
          signed_at?: string | null;
          signed_pdf_storage_path?: string | null;
          status?: Database["public"]["Enums"]["vt_document_status"];
        };
        Update: {
          approved_at?: string | null;
          approved_by?: string | null;
          benefit_id?: string;
          calc_id?: string;
          cancelled_at?: string | null;
          cancelled_reason?: string | null;
          generated_at?: string;
          generated_by?: string | null;
          html_storage_path?: string | null;
          id?: string;
          pdf_storage_path?: string | null;
          signature_provider?: string | null;
          signature_provider_ref?: string | null;
          signed_at?: string | null;
          signed_pdf_storage_path?: string | null;
          status?: Database["public"]["Enums"]["vt_document_status"];
        };
        Relationships: [
          {
            foreignKeyName: "vt_documents_benefit_id_fkey";
            columns: ["benefit_id"];
            isOneToOne: false;
            referencedRelation: "vt_benefits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_documents_calc_id_fkey";
            columns: ["calc_id"];
            isOneToOne: false;
            referencedRelation: "vt_calculations";
            referencedColumns: ["id"];
          },
        ];
      };
      vt_segments: {
        Row: {
          benefit_id: string;
          category: string;
          created_at: string;
          destino: string | null;
          fare_consulted_at: string | null;
          fare_consulted_by: string | null;
          fare_id: string | null;
          fare_source: Database["public"]["Enums"]["vt_fare_source"];
          fare_value_cents: number;
          id: string;
          justificativa_manual: string | null;
          line_id: string | null;
          line_name_text: string | null;
          line_number_text: string | null;
          modal: string;
          operator_id: string;
          ordem: number;
          origem: string | null;
          sentido: Database["public"]["Enums"]["vt_sentido"];
          trips_per_day: number;
          updated_at: string;
          validated_manually: boolean;
        };
        Insert: {
          benefit_id: string;
          category?: string;
          created_at?: string;
          destino?: string | null;
          fare_consulted_at?: string | null;
          fare_consulted_by?: string | null;
          fare_id?: string | null;
          fare_source?: Database["public"]["Enums"]["vt_fare_source"];
          fare_value_cents?: number;
          id?: string;
          justificativa_manual?: string | null;
          line_id?: string | null;
          line_name_text?: string | null;
          line_number_text?: string | null;
          modal?: string;
          operator_id: string;
          ordem?: number;
          origem?: string | null;
          sentido?: Database["public"]["Enums"]["vt_sentido"];
          trips_per_day?: number;
          updated_at?: string;
          validated_manually?: boolean;
        };
        Update: {
          benefit_id?: string;
          category?: string;
          created_at?: string;
          destino?: string | null;
          fare_consulted_at?: string | null;
          fare_consulted_by?: string | null;
          fare_id?: string | null;
          fare_source?: Database["public"]["Enums"]["vt_fare_source"];
          fare_value_cents?: number;
          id?: string;
          justificativa_manual?: string | null;
          line_id?: string | null;
          line_name_text?: string | null;
          line_number_text?: string | null;
          modal?: string;
          operator_id?: string;
          ordem?: number;
          origem?: string | null;
          sentido?: Database["public"]["Enums"]["vt_sentido"];
          trips_per_day?: number;
          updated_at?: string;
          validated_manually?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "vt_segments_benefit_id_fkey";
            columns: ["benefit_id"];
            isOneToOne: false;
            referencedRelation: "vt_benefits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_segments_fare_id_fkey";
            columns: ["fare_id"];
            isOneToOne: false;
            referencedRelation: "transport_fares";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_segments_line_id_fkey";
            columns: ["line_id"];
            isOneToOne: false;
            referencedRelation: "transport_lines";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "vt_segments_operator_id_fkey";
            columns: ["operator_id"];
            isOneToOne: false;
            referencedRelation: "transport_operators";
            referencedColumns: ["id"];
          },
        ];
      };
      webhook_deliveries: {
        Row: {
          attempts: number | null;
          created_at: string | null;
          erro: string | null;
          evento: string;
          id: string;
          last_attempt_at: string | null;
          locked_at: string | null;
          locked_by: string | null;
          next_attempt_at: string | null;
          payload: Json;
          response_body: string | null;
          response_status: number | null;
          status: string;
          subscription_id: string | null;
        };
        Insert: {
          attempts?: number | null;
          created_at?: string | null;
          erro?: string | null;
          evento: string;
          id?: string;
          last_attempt_at?: string | null;
          locked_at?: string | null;
          locked_by?: string | null;
          next_attempt_at?: string | null;
          payload: Json;
          response_body?: string | null;
          response_status?: number | null;
          status: string;
          subscription_id?: string | null;
        };
        Update: {
          attempts?: number | null;
          created_at?: string | null;
          erro?: string | null;
          evento?: string;
          id?: string;
          last_attempt_at?: string | null;
          locked_at?: string | null;
          locked_by?: string | null;
          next_attempt_at?: string | null;
          payload?: Json;
          response_body?: string | null;
          response_status?: number | null;
          status?: string;
          subscription_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "webhook_subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      webhook_subscriptions: {
        Row: {
          ativo: boolean | null;
          created_at: string | null;
          created_by: string | null;
          empresa_id: string;
          eventos: string[];
          headers: Json | null;
          id: string;
          nome: string;
          retry_config: Json | null;
          secret: string;
          updated_at: string | null;
          url: string;
        };
        Insert: {
          ativo?: boolean | null;
          created_at?: string | null;
          created_by?: string | null;
          empresa_id: string;
          eventos: string[];
          headers?: Json | null;
          id?: string;
          nome: string;
          retry_config?: Json | null;
          secret: string;
          updated_at?: string | null;
          url: string;
        };
        Update: {
          ativo?: boolean | null;
          created_at?: string | null;
          created_by?: string | null;
          empresa_id?: string;
          eventos?: string[];
          headers?: Json | null;
          id?: string;
          nome?: string;
          retry_config?: Json | null;
          secret?: string;
          updated_at?: string | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      banco_horas_saldo: {
        Row: {
          empresa_id: string | null;
          saldo_minutos: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      banco_horas_saldo_oficial: {
        Row: {
          empresa_id: string | null;
          saldo_minutos: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      banco_horas_saldo_projetado: {
        Row: {
          empresa_id: string | null;
          saldo_minutos: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      documentos_aguardando_acao: {
        Row: {
          aguardando_acao: boolean | null;
          created_at: string | null;
          criado_por: string | null;
          criado_por_nome: string | null;
          dias_vencido: number | null;
          empresa_id: string | null;
          id: string | null;
          status: Database["public"]["Enums"]["documento_status"] | null;
          tipo: Database["public"]["Enums"]["documento_tipo"] | null;
          vencimento: string | null;
        };
        Relationships: [];
      };
      profiles_with_cpf: {
        Row: {
          aceite_gps_em: string | null;
          aceite_selfie_em: string | null;
          aceite_versao_termos: string | null;
          ativo: boolean | null;
          cargo: string | null;
          cbo: string | null;
          convite_enviado_em: string | null;
          cpf: string | null;
          created_at: string | null;
          dados_complementares: Json | null;
          data_admissao: string | null;
          data_nascimento: string | null;
          departamento_id: string | null;
          email_2fa: string | null;
          email_pessoal: string | null;
          empresa_id: string | null;
          equipe_id: string | null;
          foto_url: string | null;
          horario_id: string | null;
          id: string | null;
          matricula: string | null;
          mfa_email_enabled: boolean | null;
          nome: string | null;
          pis: string | null;
          politica_bh_id: string | null;
          primeiro_acesso_em: string | null;
          regime: string | null;
          salario_base: number | null;
          setor_id: string | null;
          telefone: string | null;
          unidade_id: string | null;
          updated_at: string | null;
          vinculo: string | null;
        };
        Insert: {
          aceite_gps_em?: string | null;
          aceite_selfie_em?: string | null;
          aceite_versao_termos?: string | null;
          ativo?: boolean | null;
          cargo?: string | null;
          cbo?: string | null;
          convite_enviado_em?: string | null;
          cpf?: never;
          created_at?: string | null;
          dados_complementares?: Json | null;
          data_admissao?: string | null;
          data_nascimento?: string | null;
          departamento_id?: string | null;
          email_2fa?: string | null;
          email_pessoal?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          foto_url?: string | null;
          horario_id?: string | null;
          id?: string | null;
          matricula?: string | null;
          mfa_email_enabled?: boolean | null;
          nome?: string | null;
          pis?: string | null;
          politica_bh_id?: string | null;
          primeiro_acesso_em?: string | null;
          regime?: string | null;
          salario_base?: number | null;
          setor_id?: string | null;
          telefone?: string | null;
          unidade_id?: string | null;
          updated_at?: string | null;
          vinculo?: string | null;
        };
        Update: {
          aceite_gps_em?: string | null;
          aceite_selfie_em?: string | null;
          aceite_versao_termos?: string | null;
          ativo?: boolean | null;
          cargo?: string | null;
          cbo?: string | null;
          convite_enviado_em?: string | null;
          cpf?: never;
          created_at?: string | null;
          dados_complementares?: Json | null;
          data_admissao?: string | null;
          data_nascimento?: string | null;
          departamento_id?: string | null;
          email_2fa?: string | null;
          email_pessoal?: string | null;
          empresa_id?: string | null;
          equipe_id?: string | null;
          foto_url?: string | null;
          horario_id?: string | null;
          id?: string | null;
          matricula?: string | null;
          mfa_email_enabled?: boolean | null;
          nome?: string | null;
          pis?: string | null;
          politica_bh_id?: string | null;
          primeiro_acesso_em?: string | null;
          regime?: string | null;
          salario_base?: number | null;
          setor_id?: string | null;
          telefone?: string | null;
          unidade_id?: string | null;
          updated_at?: string | null;
          vinculo?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_departamento_id_fkey";
            columns: ["departamento_id"];
            isOneToOne: false;
            referencedRelation: "departamentos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_empresa_id_fkey";
            columns: ["empresa_id"];
            isOneToOne: false;
            referencedRelation: "empresas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_equipe_id_fkey";
            columns: ["equipe_id"];
            isOneToOne: false;
            referencedRelation: "equipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_horario_id_fkey";
            columns: ["horario_id"];
            isOneToOne: false;
            referencedRelation: "horarios_padrao";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_politica_bh_id_fkey";
            columns: ["politica_bh_id"];
            isOneToOne: false;
            referencedRelation: "politicas_bh";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_setor_id_fkey";
            columns: ["setor_id"];
            isOneToOne: false;
            referencedRelation: "setores";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_unidade_id_fkey";
            columns: ["unidade_id"];
            isOneToOne: false;
            referencedRelation: "unidades";
            referencedColumns: ["id"];
          },
        ];
      };
      rate_limit_abuse_monitor: {
        Row: {
          blocked_count: number | null;
          endpoint: string | null;
          identifier: string | null;
          ip_address: unknown;
          last_blocked_at: string | null;
          user_agents: string[] | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      rate_limit_stats: {
        Row: {
          block_rate_percent: number | null;
          blocked_requests: number | null;
          endpoint: string | null;
          first_request: string | null;
          last_request: string | null;
          total_requests: number | null;
          unique_ips: number | null;
          unique_users: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      avaliar_policy: {
        Args: { p_policy_id: string; p_registro: Json };
        Returns: boolean;
      };
      banco_horas_acordo_valido: {
        Args: { p_empresa_id: string };
        Returns: boolean;
      };
      buscar_contexto_rag: {
        Args: {
          limit_results?: number;
          p_empresa_id: string;
          query_embedding: string;
          threshold?: number;
        };
        Returns: {
          chunk_texto: string;
          id: string;
          metadata: Json;
          similarity: number;
        }[];
      };
      calcular_bh_dia: {
        Args: { _data: string; _user_id: string };
        Returns: number;
      };
      claim_webhook_deliveries: {
        Args: { p_limit: number; p_lock_timeout?: string; p_worker_id: string };
        Returns: {
          attempts: number | null;
          created_at: string | null;
          erro: string | null;
          evento: string;
          id: string;
          last_attempt_at: string | null;
          locked_at: string | null;
          locked_by: string | null;
          next_attempt_at: string | null;
          payload: Json;
          response_body: string | null;
          response_status: number | null;
          status: string;
          subscription_id: string | null;
        }[];
        SetofOptions: {
          from: "*";
          to: "webhook_deliveries";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      cleanup_rate_limits: { Args: never; Returns: number };
      clear_overdue_flag: { Args: { p_doc_id: string }; Returns: boolean };
      confirmar_assinatura_documento_tx: {
        Args: {
          p_accepted_text_sha256: string;
          p_actor_profile_id: string;
          p_audit_events: Json;
          p_completed_at: string;
          p_device_fingerprint: string;
          p_document_id: string;
          p_document_version_id: string;
          p_ip: string;
          p_manifest: Json;
          p_manifest_key_id: string;
          p_manifest_sha256: string;
          p_manifest_signature_b64: string;
          p_mfa_method: string;
          p_otp_attempts: number;
          p_signature_id: string;
          p_timezone: string;
          p_user_agent: string;
          p_viewed_duration_ms: number;
        };
        Returns: undefined;
      };
      confirmar_mfa_email_code_tx: {
        Args: {
          p_code_hash: string;
          p_ip: string;
          p_max_attempts: number;
          p_user_agent: string;
          p_user_id: string;
          p_verification_ttl_hours: number;
        };
        Returns: Json;
      };
      count_documento_chunks: {
        Args: { p_documento_id: string };
        Returns: number;
      };
      criar_vt_signature_pipeline_tx: {
        Args: {
          p_actor_id: string;
          p_cargo: string;
          p_content_sha256: string;
          p_empresa_id: string;
          p_expira_em: string;
          p_html_bytes: number;
          p_nome: string;
          p_profile_id: string;
          p_storage_path: string;
          p_vt_benefit_id: string;
          p_vt_document_id: string;
        };
        Returns: Json;
      };
      criarfracaopelorh: {
        Args: {
          p_abono: boolean;
          p_criado_por: string;
          p_dias: number;
          p_inicio: string;
          p_mensagem: string;
          p_periodo_id: string;
        };
        Returns: {
          error: string;
          id: string;
          ok: boolean;
        }[];
      };
      decrypt_cpf: { Args: { encrypted_cpf: string }; Returns: string };
      encrypt_cpf: { Args: { plain_cpf: string }; Returns: string };
      executar_automation: {
        Args: { p_registro_id: string; p_tabela: string };
        Returns: undefined;
      };
      expirar_bh_vencidos: { Args: { _empresa_id?: string }; Returns: number };
      expire_pending_docs: { Args: never; Returns: number };
      expire_pending_docs_all: { Args: never; Returns: number };
      fechar_apuracao_transacional: {
        Args: {
          p_ano: number;
          p_avisos: Json;
          p_dias: Json;
          p_empresa_id: string;
          p_fechado_por: string;
          p_hash_sha256: string;
          p_mes: number;
          p_politica_id: string;
          p_sig_b64: string;
          p_sig_key_id: string;
          p_totais: Json;
          p_user_id: string;
          p_versao_motor: string;
        };
        Returns: Json;
      };
      flag_overdue_docs_all: {
        Args: never;
        Returns: {
          message: string;
          total_flagged: number;
        }[];
      };
      freeze_document_version: {
        Args: {
          p_actor_id: string;
          p_document_id: string;
          p_mime_type: string;
          p_sha256: string;
          p_size_bytes: number;
          p_storage_path: string;
        };
        Returns: Json;
      };
      generate_webhook_secret: { Args: never; Returns: string };
      gestor_pode_aprovar_empresa: {
        Args: { _empresa_id: string; _user_id: string };
        Returns: boolean;
      };
      gestor_pode_editar_empresa: {
        Args: { _empresa_id: string; _user_id: string };
        Returns: boolean;
      };
      get_ai_api_key: { Args: { p_empresa_id: string }; Returns: string };
      get_ai_api_key_for_edge:
        | {
            Args: { p_actor_user_id: string; p_empresa_id: string };
            Returns: string;
          }
        | {
            Args: {
              p_actor_user_id: string;
              p_empresa_id: string;
              p_provider?: string;
            };
            Returns: string;
          };
      get_audit_stats: { Args: never; Returns: Json };
      get_auth_email_by_cpf: { Args: { p_cpf: string }; Returns: string };
      get_colaboradores_empresa: {
        Args: {
          p_busca?: string;
          p_cargo?: string;
          p_empresa_id: string;
          p_limit?: number;
          p_setor?: string;
          p_status?: boolean;
          p_unidade_id?: string;
        };
        Returns: {
          ativo: boolean;
          cargo: string;
          convite_enviado_em: string;
          cpf: string;
          created_at: string;
          empresa_id: string;
          foto_url: string;
          id: string;
          matricula: string;
          nome: string;
          primeiro_acesso_em: string;
          regime: string;
          setor_id: string;
          unidade_id: string;
          vinculo: string;
        }[];
      };
      get_gestor_empresa_ids: { Args: { _user_id: string }; Returns: string[] };
      get_user_empresa:
        | { Args: never; Returns: string }
        | { Args: { _user_id: string }; Returns: string };
      get_user_empresa_list: { Args: { p_user_id?: string }; Returns: string[] };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      increment_ai_usage: {
        Args: {
          p_custo: number;
          p_empresa_id: string;
          p_mes: string;
          p_tokens: number;
        };
        Returns: undefined;
      };
      is_mes_fechado_para_marcacao: {
        Args: { p_empresa_id: string; p_marcada_em: string; p_user_id: string };
        Returns: boolean;
      };
      is_super_admin: { Args: { p_user_id?: string }; Returns: boolean };
      log_audit: {
        Args: {
          p_acao: string;
          p_motivo?: string;
          p_registro_id: string;
          p_tabela: string;
          p_valores_antes?: Json;
          p_valores_depois?: Json;
        };
        Returns: string;
      };
      log_rate_limit_attempt: {
        Args: {
          p_blocked: boolean;
          p_empresa_id?: string;
          p_endpoint: string;
          p_ip_address: unknown;
          p_metadata?: Json;
          p_retry_after_seconds?: number;
          p_user_agent?: string;
          p_user_id: string;
        };
        Returns: string;
      };
      log_super_admin_action: {
        Args: {
          p_acao: string;
          p_alvo_empresa_id?: string;
          p_alvo_recurso?: string;
          p_alvo_user_id?: string;
          p_detalhes?: Json;
        };
        Returns: string;
      };
      next_nsr: {
        Args: { p_empresa_id: string; p_origem_id: string };
        Returns: number;
      };
      programarfracao: {
        Args: {
          p_abono?: boolean;
          p_criada_pelo_rh?: boolean;
          p_dias: number;
          p_inicio: string;
          p_periodo_id: string;
          p_solicitada_por?: string;
          p_status?: string;
        };
        Returns: {
          error: string;
          id: string;
        }[];
      };
      redigir_ocr_admissao: {
        Args: {
          p_admissao_id: string;
          p_motivo?: string;
          p_redigido_por: string;
        };
        Returns: number;
      };
      registrar_compensacao_pontual: {
        Args: {
          p_colaborador_comp_id: string;
          p_data_compensacao: string;
          p_minutos: number;
          p_obs?: string;
        };
        Returns: Json;
      };
      resolve_empresa_context: {
        Args: { p_empresa_solicitada?: string; p_user_id: string };
        Returns: string;
      };
      resolver_politica_trabalhista: {
        Args: { p_data?: string; p_user_id: string };
        Returns: {
          ativo: boolean;
          banco_ativo: boolean;
          banco_multiplicador_entrada: number;
          banco_multiplicador_saida: number;
          banco_prazo_meses: number;
          banco_saldo_vencido: string;
          base_adic_noturno_na_he_oj97: boolean;
          base_insalubridade_na_he_sumula132: boolean;
          base_periculosidade_na_he: boolean;
          categoria: string | null;
          comp_mensal_ativo: boolean;
          comp_mensal_saldo_acao: string;
          comp_pontual_ativo: boolean;
          created_at: string;
          created_by: string | null;
          documento_url: string | null;
          domingo_tipo: string;
          dsr_dia_preferencial: number;
          dsr_incluir_he_habitual_sumula172: boolean;
          dsr_perde_por_falta_lei605: boolean;
          empresa_id: string | null;
          empresas_ids: string[];
          escopo: string;
          excedentes_modo: string;
          feriado_percentual: number;
          id: string;
          interjornada_bloqueia_marcacao: boolean;
          interjornada_minimo_minutos: number;
          intrajornada_aplica_acima_de_minutos: number;
          intrajornada_descumprimento_total_sumula437: boolean;
          intrajornada_minimo_minutos: number;
          limite_he_diaria_minutos: number;
          limite_he_mensal_minutos: number | null;
          limite_he_semanal_minutos: number | null;
          limite_jornada_semanal_minutos: number;
          motivo_alteracao: string | null;
          nome: string;
          noturno_fator_reducao: number;
          noturno_fim: string;
          noturno_hora_reduzida: boolean;
          noturno_inicio: string;
          noturno_percentual: number;
          noturno_prorrogacao_sumula60: boolean;
          prioridade: number;
          sabado_tipo: string;
          sobreaviso_ativo: boolean;
          sobreaviso_fator: number;
          tolerancia_diaria_minutos: number;
          tolerancia_entrada_minutos: number;
          tolerancia_saida_minutos: number;
          unidade_id: string | null;
          updated_at: string;
          updated_by: string | null;
          vigencia_fim: string | null;
          vigencia_inicio: string;
        };
        SetofOptions: {
          from: "*";
          to: "politicas_trabalhistas";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      respondersolicitacao: {
        Args: {
          p_acao: string;
          p_fracao_id: string;
          p_motivo?: string;
          p_respondida_por: string;
        };
        Returns: {
          error: string;
          ok: boolean;
        }[];
      };
      search_profile_by_cpf: {
        Args: { search_cpf: string };
        Returns: {
          aceite_gps_em: string | null;
          aceite_selfie_em: string | null;
          aceite_versao_termos: string | null;
          ativo: boolean;
          cargo: string | null;
          cbo: string | null;
          convite_enviado_em: string | null;
          cpf: string | null;
          cpf_encrypted: string | null;
          cpf_hash: string | null;
          created_at: string;
          dados_complementares: Json;
          data_admissao: string | null;
          data_nascimento: string | null;
          departamento_id: string | null;
          email_2fa: string | null;
          email_pessoal: string | null;
          empresa_id: string | null;
          equipe_id: string | null;
          foto_url: string | null;
          horario_id: string | null;
          id: string;
          matricula: string | null;
          mfa_email_enabled: boolean;
          mfa_last_verified_at: string | null;
          nome: string;
          pis: string | null;
          politica_bh_id: string | null;
          primeiro_acesso_em: string | null;
          regime: string | null;
          salario_base: number | null;
          setor_id: string | null;
          telefone: string | null;
          unidade_id: string | null;
          updated_at: string;
          vinculo: string | null;
        }[];
        SetofOptions: {
          from: "*";
          to: "profiles";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      super_admin_list_empresas: {
        Args: { p_busca?: string; p_limit?: number };
        Returns: {
          ativo: boolean;
          cnpj: string;
          criado_em: string;
          id: string;
          marcacoes_30d: number;
          nome: string;
          total_trabalhadores: number;
          total_usuarios: number;
        }[];
      };
      super_admin_search_users: {
        Args: { p_busca: string; p_limit?: number };
        Returns: {
          ativo: boolean;
          cpf: string;
          empresa_id: string;
          empresa_nome: string;
          id: string;
          nome: string;
          roles: string[];
        }[];
      };
      super_admin_stats: { Args: never; Returns: Json };
      total_he_mes: { Args: { mes: number }; Returns: number };
      trigger_webhook: {
        Args: { p_evento: string; p_payload: Json };
        Returns: undefined;
      };
      usuario_tem_acesso_empresa: {
        Args: { _empresa_id: string; _user_id: string };
        Returns: boolean;
      };
      validar_token_admissao: {
        Args: { _token: string };
        Returns: {
          admissao_id: string;
          empresa_id: string;
          motivo: string;
          valido: boolean;
        }[];
      };
      vault_get_secret: { Args: { p_name: string }; Returns: string };
      vault_set_secret: {
        Args: { p_description?: string; p_name: string; p_secret: string };
        Returns: string;
      };
    };
    Enums: {
      acjef_status: "rascunho" | "validado" | "enviado" | "arquivado";
      acjef_tipo_compensacao: "banco_horas" | "12x36" | "outro";
      admissao_doc_categoria:
        | "identificacao"
        | "cpf"
        | "comprovante_endereco"
        | "ctps"
        | "titulo_eleitor"
        | "reservista"
        | "pis_pasep"
        | "foto_3x4"
        | "escolaridade"
        | "certidao_nascimento_casamento"
        | "certidao_dependente"
        | "aso_admissional"
        | "dados_bancarios"
        | "contrato_assinado"
        | "declaracao_dependentes_ir"
        | "termo_vt"
        | "outro";
      admissao_doc_status_revisao:
        | "pendente"
        | "enviado"
        | "em_analise"
        | "aprovado"
        | "reprovado"
        | "corrigir";
      admissao_status:
        | "rascunho"
        | "aguardando_colaborador"
        | "em_revisao"
        | "aprovada"
        | "integrada_esocial"
        | "cancelada";
      afastamento_esocial: "pendente" | "transmitido" | "rejeitado";
      afastamento_status:
        | "ativo"
        | "previsto_retorno"
        | "encerrado"
        | "prorrogado"
        | "convertido_inss"
        | "cancelado";
      app_role: "colaborador" | "analista" | "supervisor" | "gerente" | "admin";
      apuracao_mes_status: "aberto" | "fechado" | "reaberto";
      banco_origem:
        | "marcacao"
        | "manual"
        | "solicitacao"
        | "sistema"
        | "sistema_diario"
        | "fechamento_apuracao";
      banco_tipo:
        | "credito"
        | "debito"
        | "compensacao"
        | "pagamento"
        | "ajuste"
        | "expiracao"
        | "estorno"
        | "migracao_saldo";
      comp_pontual_forma: "folga_simples" | "extensao_jornada" | "banco_horas" | "pagamento";
      comp_pontual_status_colab: "pendente" | "parcial" | "concluido" | "dispensado" | "cancelado";
      comp_pontual_status_evento: "rascunho" | "ativo" | "concluido" | "cancelado";
      comp_pontual_tipo: "emenda_feriado" | "feriado_trabalhado" | "recesso" | "troca_jornada";
      competencia_status:
        | "aberta"
        | "em_tratamento"
        | "pronta"
        | "fechada"
        | "integrada"
        | "reaberta";
      comunicado_prioridade: "normal" | "alta" | "urgente";
      comunicado_publico: "todos" | "unidade" | "cargo";
      comunicado_tipo: "comunicado" | "politica" | "aviso_legal" | "treinamento";
      demissao_motivo:
        | "sem_justa_causa"
        | "com_justa_causa"
        | "pedido"
        | "acordo"
        | "termino_contrato";
      demissao_status:
        | "rascunho"
        | "aviso_em_curso"
        | "pronta_homologar"
        | "homologada"
        | "transmitida_esocial";
      doc_kind:
        | "holerite"
        | "recibo_ferias"
        | "declaracao"
        | "recibo_generico"
        | "termo_interno"
        | "vale_transporte"
        | "contrato_trabalho"
        | "ficha_registro"
        | "declaracao_dependentes_ir"
        | "aso_admissional"
        | "aso_periodico"
        | "aso_demissional"
        | "aso_retorno_trabalho"
        | "aso_mudanca_funcao"
        | "atestado_medico"
        | "cat_acidente"
        | "termo_epi"
        | "advertencia"
        | "suspensao_disciplinar"
        | "aviso_previo"
        | "trct"
        | "informe_rendimentos"
        | "recibo_13_salario"
        | "termo_quitacao_anual"
        | "aviso_ferias"
        | "acordo_banco_horas"
        | "acordo_compensacao_jornada"
        | "termo_recusa_vt"
        | "salario_familia"
        | "espelho_ponto"
        | "termo_lgpd"
        | "termo_confidencialidade"
        | "politica_interna"
        | "comunicado_interno";
      doc_status:
        | "rascunho"
        | "pronto_para_assinatura"
        | "parcialmente_assinado"
        | "assinado"
        | "cancelado"
        | "expirado";
      documento_status: "rascunho" | "pendente_assinatura" | "assinado" | "expirado" | "arquivado";
      documento_tipo:
        | "espelho"
        | "contrato"
        | "atestado"
        | "aviso"
        | "politica"
        | "outro"
        | "comunicado_interno"
        | "espelho_ponto"
        | "folha_pagamento"
        | "recibo_ferias"
        | "trct"
        | "contrato_trabalho"
        | "ficha_registro"
        | "declaracao_dependentes_ir"
        | "aso_admissional"
        | "aso_periodico"
        | "aso_demissional"
        | "aso_retorno_trabalho"
        | "aso_mudanca_funcao"
        | "atestado_medico"
        | "cat_acidente"
        | "termo_epi"
        | "advertencia"
        | "suspensao_disciplinar"
        | "aviso_previo"
        | "informe_rendimentos"
        | "recibo_13_salario"
        | "termo_quitacao_anual"
        | "aviso_ferias"
        | "acordo_banco_horas"
        | "acordo_compensacao_jornada"
        | "vale_transporte"
        | "termo_recusa_vt"
        | "salario_familia"
        | "holerite"
        | "ferias"
        | "abono_pecuniario"
        | "vt"
        | "termo_lgpd"
        | "termo_confidencialidade"
        | "politica_interna"
        | "aviso_legal";
      esocial_ambiente: "producao" | "homologacao_restrita" | "homologacao";
      esocial_categoria: "tabela" | "nao_periodico" | "periodico";
      esocial_status:
        | "pendente"
        | "enviando"
        | "aguardando_retorno"
        | "aceito"
        | "rejeitado"
        | "cancelado";
      ferias_status: "vigente" | "vencendo_60d" | "vencendo_30d" | "vencido" | "concluido";
      fracao_status: "solicitada" | "programada" | "em_curso" | "gozada" | "cancelada";
      legal_term_kind: "aceite_assinatura" | "politica_privacidade" | "termo_uso";
      marcacao_origem: "app_mobile" | "web" | "rep" | "manual";
      marcacao_tipo: "entrada" | "saida_intervalo" | "volta_intervalo" | "saida";
      sign_audit_event:
        | "document_created"
        | "version_frozen"
        | "viewed"
        | "downloaded"
        | "sign_initiated"
        | "mfa_sent"
        | "mfa_verified"
        | "mfa_failed"
        | "signature_completed"
        | "signature_failed"
        | "signature_cancelled"
        | "manifest_generated"
        | "document_reissued";
      signature_status: "pendente" | "iniciada" | "concluida" | "falhou" | "cancelada" | "expirada";
      solic_evento_tipo:
        | "criada"
        | "comentada"
        | "encaminhada"
        | "aprovada"
        | "rejeitada"
        | "cancelada"
        | "anexo"
        | "reaberta";
      solicitacao_prioridade: "baixa" | "media" | "alta" | "urgente";
      solicitacao_status:
        | "rascunho"
        | "aberta"
        | "em_analise"
        | "aprovada"
        | "rejeitada"
        | "cancelada";
      solicitacao_tipo:
        | "ajuste_ponto"
        | "abono"
        | "ferias"
        | "banco_horas"
        | "atestado"
        | "folga"
        | "troca_escala"
        | "outro";
      vt_alert_kind:
        | "endereco_incompleto"
        | "linha_nao_informada"
        | "tarifa_nao_encontrada"
        | "valor_sem_fonte"
        | "manual_sem_justificativa"
        | "sentido_indefinido"
        | "dias_nao_informados"
        | "calculo_pendente"
        | "documento_nao_gerado"
        | "assinatura_pendente"
        | "erro_api"
        | "cadastro_em_rascunho"
        | "tarifa_atualizada_recalcular";
      vt_alert_severity: "info" | "warning" | "error";
      vt_calc_trigger:
        | "criacao"
        | "recalculo_tarifa"
        | "recalculo_endereco"
        | "recalculo_jornada"
        | "manual";
      vt_document_status: "draft" | "aprovado" | "enviado_assinatura" | "assinado" | "cancelado";
      vt_fare_source: "api" | "tabela" | "manual";
      vt_sentido: "ida" | "volta" | "ida_volta";
      vt_status:
        | "nao_iniciado"
        | "cadastro_incompleto"
        | "pendente_validacao"
        | "validado_manualmente"
        | "validado_via_api"
        | "documento_gerado"
        | "enviado_assinatura"
        | "assinado"
        | "corrigir_dados"
        | "cancelado";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      acjef_status: ["rascunho", "validado", "enviado", "arquivado"],
      acjef_tipo_compensacao: ["banco_horas", "12x36", "outro"],
      admissao_doc_categoria: [
        "identificacao",
        "cpf",
        "comprovante_endereco",
        "ctps",
        "titulo_eleitor",
        "reservista",
        "pis_pasep",
        "foto_3x4",
        "escolaridade",
        "certidao_nascimento_casamento",
        "certidao_dependente",
        "aso_admissional",
        "dados_bancarios",
        "contrato_assinado",
        "declaracao_dependentes_ir",
        "termo_vt",
        "outro",
      ],
      admissao_doc_status_revisao: [
        "pendente",
        "enviado",
        "em_analise",
        "aprovado",
        "reprovado",
        "corrigir",
      ],
      admissao_status: [
        "rascunho",
        "aguardando_colaborador",
        "em_revisao",
        "aprovada",
        "integrada_esocial",
        "cancelada",
      ],
      afastamento_esocial: ["pendente", "transmitido", "rejeitado"],
      afastamento_status: [
        "ativo",
        "previsto_retorno",
        "encerrado",
        "prorrogado",
        "convertido_inss",
        "cancelado",
      ],
      app_role: ["colaborador", "analista", "supervisor", "gerente", "admin"],
      apuracao_mes_status: ["aberto", "fechado", "reaberto"],
      banco_origem: [
        "marcacao",
        "manual",
        "solicitacao",
        "sistema",
        "sistema_diario",
        "fechamento_apuracao",
      ],
      banco_tipo: [
        "credito",
        "debito",
        "compensacao",
        "pagamento",
        "ajuste",
        "expiracao",
        "estorno",
        "migracao_saldo",
      ],
      comp_pontual_forma: ["folga_simples", "extensao_jornada", "banco_horas", "pagamento"],
      comp_pontual_status_colab: ["pendente", "parcial", "concluido", "dispensado", "cancelado"],
      comp_pontual_status_evento: ["rascunho", "ativo", "concluido", "cancelado"],
      comp_pontual_tipo: ["emenda_feriado", "feriado_trabalhado", "recesso", "troca_jornada"],
      competencia_status: ["aberta", "em_tratamento", "pronta", "fechada", "integrada", "reaberta"],
      comunicado_prioridade: ["normal", "alta", "urgente"],
      comunicado_publico: ["todos", "unidade", "cargo"],
      comunicado_tipo: ["comunicado", "politica", "aviso_legal", "treinamento"],
      demissao_motivo: [
        "sem_justa_causa",
        "com_justa_causa",
        "pedido",
        "acordo",
        "termino_contrato",
      ],
      demissao_status: [
        "rascunho",
        "aviso_em_curso",
        "pronta_homologar",
        "homologada",
        "transmitida_esocial",
      ],
      doc_kind: [
        "holerite",
        "recibo_ferias",
        "declaracao",
        "recibo_generico",
        "termo_interno",
        "vale_transporte",
        "contrato_trabalho",
        "ficha_registro",
        "declaracao_dependentes_ir",
        "aso_admissional",
        "aso_periodico",
        "aso_demissional",
        "aso_retorno_trabalho",
        "aso_mudanca_funcao",
        "atestado_medico",
        "cat_acidente",
        "termo_epi",
        "advertencia",
        "suspensao_disciplinar",
        "aviso_previo",
        "trct",
        "informe_rendimentos",
        "recibo_13_salario",
        "termo_quitacao_anual",
        "aviso_ferias",
        "acordo_banco_horas",
        "acordo_compensacao_jornada",
        "termo_recusa_vt",
        "salario_familia",
        "espelho_ponto",
        "termo_lgpd",
        "termo_confidencialidade",
        "politica_interna",
        "comunicado_interno",
      ],
      doc_status: [
        "rascunho",
        "pronto_para_assinatura",
        "parcialmente_assinado",
        "assinado",
        "cancelado",
        "expirado",
      ],
      documento_status: ["rascunho", "pendente_assinatura", "assinado", "expirado", "arquivado"],
      documento_tipo: [
        "espelho",
        "contrato",
        "atestado",
        "aviso",
        "politica",
        "outro",
        "comunicado_interno",
        "espelho_ponto",
        "folha_pagamento",
        "recibo_ferias",
        "trct",
        "contrato_trabalho",
        "ficha_registro",
        "declaracao_dependentes_ir",
        "aso_admissional",
        "aso_periodico",
        "aso_demissional",
        "aso_retorno_trabalho",
        "aso_mudanca_funcao",
        "atestado_medico",
        "cat_acidente",
        "termo_epi",
        "advertencia",
        "suspensao_disciplinar",
        "aviso_previo",
        "informe_rendimentos",
        "recibo_13_salario",
        "termo_quitacao_anual",
        "aviso_ferias",
        "acordo_banco_horas",
        "acordo_compensacao_jornada",
        "vale_transporte",
        "termo_recusa_vt",
        "salario_familia",
        "holerite",
        "ferias",
        "abono_pecuniario",
        "vt",
        "termo_lgpd",
        "termo_confidencialidade",
        "politica_interna",
        "aviso_legal",
      ],
      esocial_ambiente: ["producao", "homologacao_restrita", "homologacao"],
      esocial_categoria: ["tabela", "nao_periodico", "periodico"],
      esocial_status: [
        "pendente",
        "enviando",
        "aguardando_retorno",
        "aceito",
        "rejeitado",
        "cancelado",
      ],
      ferias_status: ["vigente", "vencendo_60d", "vencendo_30d", "vencido", "concluido"],
      fracao_status: ["solicitada", "programada", "em_curso", "gozada", "cancelada"],
      legal_term_kind: ["aceite_assinatura", "politica_privacidade", "termo_uso"],
      marcacao_origem: ["app_mobile", "web", "rep", "manual"],
      marcacao_tipo: ["entrada", "saida_intervalo", "volta_intervalo", "saida"],
      sign_audit_event: [
        "document_created",
        "version_frozen",
        "viewed",
        "downloaded",
        "sign_initiated",
        "mfa_sent",
        "mfa_verified",
        "mfa_failed",
        "signature_completed",
        "signature_failed",
        "signature_cancelled",
        "manifest_generated",
        "document_reissued",
      ],
      signature_status: ["pendente", "iniciada", "concluida", "falhou", "cancelada", "expirada"],
      solic_evento_tipo: [
        "criada",
        "comentada",
        "encaminhada",
        "aprovada",
        "rejeitada",
        "cancelada",
        "anexo",
        "reaberta",
      ],
      solicitacao_prioridade: ["baixa", "media", "alta", "urgente"],
      solicitacao_status: [
        "rascunho",
        "aberta",
        "em_analise",
        "aprovada",
        "rejeitada",
        "cancelada",
      ],
      solicitacao_tipo: [
        "ajuste_ponto",
        "abono",
        "ferias",
        "banco_horas",
        "atestado",
        "folga",
        "troca_escala",
        "outro",
      ],
      vt_alert_kind: [
        "endereco_incompleto",
        "linha_nao_informada",
        "tarifa_nao_encontrada",
        "valor_sem_fonte",
        "manual_sem_justificativa",
        "sentido_indefinido",
        "dias_nao_informados",
        "calculo_pendente",
        "documento_nao_gerado",
        "assinatura_pendente",
        "erro_api",
        "cadastro_em_rascunho",
        "tarifa_atualizada_recalcular",
      ],
      vt_alert_severity: ["info", "warning", "error"],
      vt_calc_trigger: [
        "criacao",
        "recalculo_tarifa",
        "recalculo_endereco",
        "recalculo_jornada",
        "manual",
      ],
      vt_document_status: ["draft", "aprovado", "enviado_assinatura", "assinado", "cancelado"],
      vt_fare_source: ["api", "tabela", "manual"],
      vt_sentido: ["ida", "volta", "ida_volta"],
      vt_status: [
        "nao_iniciado",
        "cadastro_incompleto",
        "pendente_validacao",
        "validado_manualmente",
        "validado_via_api",
        "documento_gerado",
        "enviado_assinatura",
        "assinado",
        "corrigir_dados",
        "cancelado",
      ],
    },
  },
} as const;
