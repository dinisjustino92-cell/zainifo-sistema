import { createClient } from "@supabase/supabase-js";

// ⚠️ Preencha com os dados do SEU projeto Supabase (Project Settings → API).
// A "anon key" é pública por natureza — segura para ficar no código do site.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://mqjbbynlespzvsbpfbgn.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_WZ9h3aN1pp_nKP5PGNw8tw_BZuaD542";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Camada de armazenamento (mesmo formato chave/valor do sistema original) ----
export async function loadKey(key, fallback) {
  try {
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return fallback;
    return data.value ?? fallback;
  } catch (e) {
    console.error("Erro ao carregar", key, e);
    return fallback;
  }
}

export async function saveKey(key, value) {
  try {
    const { error } = await supabase
      .from("kv_store")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) console.error("Erro ao salvar", key, error);
  } catch (e) {
    console.error("Erro ao salvar", key, e);
  }
}
