// Extended Supabase client with beneficios tables type support
import { supabase } from "./client";
// Type-safe wrapper for beneficios tables
export const supabaseExt = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beneficios: () => supabase.from("beneficios_empresa"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beneficiosAudit: () => supabase.from("beneficios_empresa_audit"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    colaboradorBeneficiosAudit: () => supabase.from("colaborador_beneficios_audit"),
};
export default supabase;
