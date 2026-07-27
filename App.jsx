import { useState, useEffect, useMemo } from "react";
import {
  Hammer, Users, Package, FileText, ClipboardList, Wallet,
  LogOut, Plus, Trash2, Ruler, LayoutDashboard, X, Check,
  AlertTriangle, TrendingUp, TrendingDown, Pencil, Inbox,
  ArrowRight, Phone, Tag, CreditCard, Banknote, Smartphone, MessageCircle,
  ShoppingCart, UserCog, ImagePlus, Minus, ShieldCheck
} from "lucide-react";
import { loadKey, saveKey } from "./supabase";

// ---------- helpers ----------
const uid = () => Math.random().toString(36).slice(2, 10);
const brl = (n) =>
  `${(Number(n) || 0).toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT`;
const todayISO = () => new Date().toISOString().slice(0, 10);
const gerarCodigo = () => String(Math.floor(100000 + Math.random() * 900000));

function resizeImageFile(file, maxWidth = 700) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const PAGAMENTO = {
  emola: { label: "E-Mola", numero: "87 905 5089" },
  mpesa: { label: "M-Pesa", numero: "84 605 5089" },
  dinheiro: { label: "Dinheiro (na oficina)", numero: "" },
};
const NOME_CONFIRMACAO = "Anifo Carlos";
const TELEFONE_CONTATO = "846055089"; // Anifo Carlos — sem +258, formato local
const TELEFONE_WHATSAPP = `258${TELEFONE_CONTATO}`;



// Tick-mark ruler divider — the signature motif
function RulerDivider({ className = "" }) {
  return (
    <div className={`relative h-3 overflow-hidden ${className}`} aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <pattern id="ticks" width="14" height="12" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#B87333" strokeWidth="1.5" />
          <line x1="7" y1="0" x2="7" y2="3" stroke="#B87333" strokeWidth="1" opacity="0.5" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#ticks)" />
      </svg>
    </div>
  );
}

const NAV = [
  { key: "dashboard", label: "Painel", icon: LayoutDashboard },
  { key: "pedidos", label: "Pedidos", icon: ShoppingCart },
  { key: "solicitacoes", label: "Solicitações", icon: Inbox },
  { key: "servicos", label: "Serviços", icon: Tag },
  { key: "orcamentos", label: "Orçamentos", icon: FileText },
  { key: "ordens", label: "Ordens de Serviço", icon: ClipboardList },
  { key: "clientes", label: "Clientes", icon: Users },
  { key: "estoque", label: "Estoque", icon: Package },
  { key: "financeiro", label: "Financeiro", icon: Wallet },
  { key: "equipe", label: "Equipe", icon: UserCog, adminOnly: true },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [users, setUsers] = useState([]);
  const [session, setSession] = useState(null);
  const [view, setView] = useState("dashboard");

  const [clientes, setClientes] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [clientesCadastro, setClientesCadastro] = useState([]);
  const [clientSession, setClientSession] = useState(null);
  const [entryMode, setEntryMode] = useState("escolha"); // escolha | cliente | equipe

  useEffect(() => {
    (async () => {
      setUsers(await loadKey("marcenaria:usuarios", []));
      setClientes(await loadKey("marcenaria:clientes", []));
      setEstoque(await loadKey("marcenaria:estoque", []));
      setOrcamentos(await loadKey("marcenaria:orcamentos", []));
      setOrdens(await loadKey("marcenaria:ordens", []));
      setFinanceiro(await loadKey("marcenaria:financeiro", []));
      setSolicitacoes(await loadKey("marcenaria:solicitacoes", []));
      setServicos(await loadKey("marcenaria:servicos", []));
      setPedidos(await loadKey("marcenaria:pedidos", []));
      setClientesCadastro(await loadKey("marcenaria:clientes_cadastro", []));
      setBooted(true);
    })();
  }, []);

  useEffect(() => { if (booted) saveKey("marcenaria:usuarios", users); }, [users, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:clientes", clientes); }, [clientes, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:estoque", estoque); }, [estoque, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:orcamentos", orcamentos); }, [orcamentos, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:ordens", ordens); }, [ordens, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:financeiro", financeiro); }, [financeiro, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:solicitacoes", solicitacoes); }, [solicitacoes, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:servicos", servicos); }, [servicos, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:pedidos", pedidos); }, [pedidos, booted]);
  useEffect(() => { if (booted) saveKey("marcenaria:clientes_cadastro", clientesCadastro); }, [clientesCadastro, booted]);

  if (!booted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2B1B12] text-[#F5EDE1] font-sans">
        <div className="flex items-center gap-3">
          <Hammer className="animate-pulse" size={22} />
          <span>Abrindo a oficina…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    if (entryMode === "cliente") {
      if (!clientSession) {
        return (
          <ClientAuthScreen
            clientesCadastro={clientesCadastro}
            onBack={() => setEntryMode("escolha")}
            onRegister={(dados) => {
              const codigo = gerarCodigo();
              const novo = { id: uid(), ...dados, codigo, criadoEm: todayISO() };
              setClientesCadastro([...clientesCadastro, novo]);
              return novo;
            }}
            onLogin={(cliente) => setClientSession(cliente)}
          />
        );
      }
      return (
        <ClientPortal
          servicos={servicos}
          clientSession={clientSession}
          onBack={() => { setClientSession(null); setEntryMode("escolha"); }}
          onSubmit={(dados) =>
            setSolicitacoes([{ id: uid(), ...dados, status: "nova", criadoEm: todayISO() }, ...solicitacoes])
          }
          onCheckout={(pedido) =>
            setPedidos([{ id: uid(), ...pedido, status: "novo", criadoEm: todayISO() }, ...pedidos])
          }
        />
      );
    }
    if (entryMode === "equipe") {
      return (
        <LoginScreen
          users={users}
          setUsers={setUsers}
          onBack={() => setEntryMode("escolha")}
          onLogin={(u) => { setSession(u); setView("dashboard"); }}
        />
      );
    }
    return (
      <EntryChoice
        onCliente={() => setEntryMode("cliente")}
        onEquipe={() => setEntryMode("equipe")}
      />
    );
  }

  return (
    <Shell
      session={session}
      onLogout={() => setSession(null)}
      view={view}
      setView={setView}
      data={{ clientes, estoque, orcamentos, ordens, financeiro, solicitacoes, servicos, pedidos, users }}
      setters={{ setClientes, setEstoque, setOrcamentos, setOrdens, setFinanceiro, setSolicitacoes, setServicos, setPedidos, setUsers }}
    />
  );
}

// ---------------- Escolha inicial ----------------
// ---------------- Cadastro / entrada do cliente (com código) ----------------
function ClientAuthScreen({ clientesCadastro, onBack, onRegister, onLogin }) {
  const [modo, setModo] = useState("cadastro"); // cadastro | login
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [loginForm, setLoginForm] = useState({ telefone: "", codigo: "" });
  const [erro, setErro] = useState("");
  const [codigoGerado, setCodigoGerado] = useState(null);
  const [clienteRegistrado, setClienteRegistrado] = useState(null);

  const registrar = (e) => {
    e.preventDefault();
    setErro("");
    if (!form.nome.trim() || !form.telefone.trim()) {
      setErro("Preencha nome e telefone.");
      return;
    }
    const novo = onRegister({ nome: form.nome.trim(), telefone: form.telefone.trim(), email: form.email.trim() });
    setCodigoGerado(novo.codigo);
    setClienteRegistrado(novo);
  };

  const entrar = (e) => {
    e.preventDefault();
    setErro("");
    const found = clientesCadastro.find(
      (c) => c.telefone === loginForm.telefone.trim() && c.codigo === loginForm.codigo.trim()
    );
    if (!found) { setErro("Telefone ou código incorretos."); return; }
    onLogin(found);
  };

  if (codigoGerado) {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#DCE6CB] text-[#4C5E2E] flex items-center justify-center mx-auto mb-4">
            <Check size={22} />
          </div>
          <h1 className="font-serif text-2xl text-[#2B1B12] mb-2">Cadastro confirmado!</h1>
          <p className="text-[#6B4226] mb-4">Guarde este código — ele é a sua senha para entrar da próxima vez.</p>
          <div className="bg-white border-2 border-[#C94C36] rounded-md py-4 mb-6">
            <span className="font-mono text-3xl tracking-widest text-[#C94C36] font-semibold">{codigoGerado}</span>
          </div>
          <p className="text-xs text-[#8A7A68] mb-6">Tire um print desta tela ou anote em algum lugar seguro.</p>
          <button onClick={() => onLogin(clienteRegistrado)}
            className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors">
            Continuar para o catálogo
          </button>
        </div>
        <style>{FONT_CSS + INPUT_CSS}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="text-sm text-[#8A7A68] mb-4">← Voltar</button>
        <h1 className="font-serif text-2xl text-[#2B1B12] mb-1">Área do cliente</h1>
        <p className="text-[#8A7A68] text-sm mb-6">Cadastre-se uma vez, ou entre com seu código.</p>

        <div className="flex mb-5 rounded-sm overflow-hidden border border-[#D9C7B2]">
          <button type="button" onClick={() => setModo("cadastro")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${modo === "cadastro" ? "bg-[#2B1B12] text-[#F5EDE1]" : "bg-white text-[#6B4226]"}`}>
            Criar cadastro
          </button>
          <button type="button" onClick={() => setModo("login")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${modo === "login" ? "bg-[#2B1B12] text-[#F5EDE1]" : "bg-white text-[#6B4226]"}`}>
            Já tenho código
          </button>
        </div>

        {modo === "cadastro" ? (
          <form onSubmit={registrar} className="bg-white border border-[#E4D5C2] rounded-md p-5 relative">
            <RulerDivider className="absolute -top-3 left-3 right-3" />
            <Field label="Seu nome *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
            <Field label="Telefone / WhatsApp *"><input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="8X XXX XXXX" /></Field>
            <Field label="E-mail"><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            {erro && <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3"><AlertTriangle size={14} /> {erro}</p>}
            <button type="submit" className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors">
              Criar cadastro
            </button>
          </form>
        ) : (
          <form onSubmit={entrar} className="bg-white border border-[#E4D5C2] rounded-md p-5 relative">
            <RulerDivider className="absolute -top-3 left-3 right-3" />
            <Field label="Telefone *"><input className="input" value={loginForm.telefone} onChange={(e) => setLoginForm({ ...loginForm, telefone: e.target.value })} placeholder="8X XXX XXXX" /></Field>
            <Field label="Código de 6 dígitos *"><input className="input font-mono tracking-widest" maxLength={6} value={loginForm.codigo} onChange={(e) => setLoginForm({ ...loginForm, codigo: e.target.value })} placeholder="000000" /></Field>
            {erro && <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3"><AlertTriangle size={14} /> {erro}</p>}
            <button type="submit" className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors">
              Entrar
            </button>
          </form>
        )}
      </div>
      <style>{FONT_CSS + INPUT_CSS}</style>
    </div>
  );
}

function EntryChoice({ onCliente, onEquipe }) {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans"
      style={{
        background:
          "repeating-linear-gradient(115deg, #2B1B12 0px, #2B1B12 26px, #33210F 26px, #33210F 52px)",
      }}>
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm mb-4"
          style={{ background: "linear-gradient(180deg,#C98A46,#9C6A2E)", boxShadow: "0 2px 0 #6B4226" }}>
          <Hammer size={18} className="text-[#2B1B12]" />
          <span className="font-serif tracking-wide text-[#2B1B12] font-semibold">ZAINIFO</span>
        </div>
        <h1 className="text-2xl font-serif text-[#F5EDE1] mb-1">Bem-vindo</h1>
        <p className="text-[#C9B8A6] text-sm mb-8">Como você quer entrar?</p>

        <div className="grid gap-3">
          <button onClick={onCliente}
            className="bg-[#F5EDE1] rounded-md p-5 text-left hover:-translate-y-0.5 transition-transform relative">
            <RulerDivider className="absolute -top-3 left-3 right-3" />
            <p className="font-serif text-lg text-[#2B1B12]">Sou cliente</p>
            <p className="text-sm text-[#8A7A68] mt-1">Quero pedir um orçamento ou serviço, à distância.</p>
            <span className="inline-flex items-center gap-1 text-sm text-[#C94C36] mt-3 font-medium">
              Fazer um pedido <ArrowRight size={14} />
            </span>
          </button>

          <button onClick={onEquipe}
            className="bg-transparent border border-[#4A3020] rounded-md p-5 text-left hover:bg-[#33210F] transition-colors">
            <p className="font-serif text-lg text-[#F5EDE1]">Sou da equipe</p>
            <p className="text-sm text-[#8A7A68] mt-1">Entrar no sistema de gestão da oficina.</p>
            <span className="inline-flex items-center gap-1 text-sm text-[#C98A46] mt-3 font-medium">
              Fazer login <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </div>
      <style>{FONT_CSS + INPUT_CSS}</style>
    </div>
  );
}

// ---------------- Portal do cliente (público, sem login) ----------------
function ClientPortal({ onBack, onSubmit, onCheckout, servicos = [], clientSession }) {
  const [tela, setTela] = useState("catalogo"); // catalogo | carrinho | checkout | personalizado | sucesso | sucesso-pedido
  const [cart, setCart] = useState({}); // { servicoId: quantidade }

  const [form, setForm] = useState({
    nome: clientSession?.nome || "", telefone: clientSession?.telefone || "", email: clientSession?.email || "",
    descricao: "", servicoId: "", formaPagamento: "dinheiro",
  });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const [checkoutForm, setCheckoutForm] = useState({
    nome: clientSession?.nome || "", telefone: clientSession?.telefone || "", email: clientSession?.email || "",
    formaPagamento: "dinheiro",
  });
  const [pedidoFinal, setPedidoFinal] = useState(null);

  const addToCart = (servicoId) => setCart((c) => ({ ...c, [servicoId]: (c[servicoId] || 0) + 1 }));
  const removeFromCart = (servicoId) => setCart((c) => {
    const next = { ...c, [servicoId]: (c[servicoId] || 0) - 1 };
    if (next[servicoId] <= 0) delete next[servicoId];
    return next;
  });

  const itensCarrinho = Object.entries(cart)
    .map(([servicoId, quantidade]) => ({ servico: servicos.find((s) => s.id === servicoId), quantidade }))
    .filter((i) => i.servico && i.quantidade > 0);
  const totalCarrinho = itensCarrinho.reduce((s, i) => s + i.servico.preco * i.quantidade, 0);
  const qtdCarrinho = itensCarrinho.reduce((s, i) => s + i.quantidade, 0);

  const escolherServico = (s) => {
    setForm((f) => ({ ...f, servicoId: s.id, descricao: f.descricao ? f.descricao : s.nome }));
  };

  const submitPersonalizado = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (enviando) return;
    setErro("");
    if (!form.nome.trim() || !form.telefone.trim() || !form.descricao.trim()) {
      setErro("Preencha nome, telefone e a descrição do que você precisa.");
      return;
    }
    setEnviando(true);
    try {
      onSubmit(form);
    } catch (err) {
      console.error("Falha ao registrar solicitação:", err);
    } finally {
      setEnviando(false);
      setTela("sucesso");
    }
  };

  const submitCheckout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (enviando) return;
    setErro("");
    if (!checkoutForm.nome.trim() || !checkoutForm.telefone.trim()) {
      setErro("Preencha nome e telefone para finalizar o pedido.");
      return;
    }
    setEnviando(true);
    const pedido = {
      cliente: { nome: checkoutForm.nome, telefone: checkoutForm.telefone, email: checkoutForm.email },
      itens: itensCarrinho.map((i) => ({ servicoId: i.servico.id, nome: i.servico.nome, preco: i.servico.preco, quantidade: i.quantidade })),
      total: totalCarrinho,
      formaPagamento: checkoutForm.formaPagamento,
    };
    try {
      onCheckout(pedido);
    } catch (err) {
      console.error("Falha ao registrar pedido:", err);
    } finally {
      setEnviando(false);
      setPedidoFinal(pedido);
      setCart({});
      setTela("sucesso-pedido");
    }
  };

  // ---- Telas de sucesso ----
  if (tela === "sucesso" || tela === "sucesso-pedido") {
    const metodo = tela === "sucesso" ? form.formaPagamento : checkoutForm.formaPagamento;
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#DCE6CB] text-[#4C5E2E] flex items-center justify-center mx-auto mb-4">
            <Check size={22} />
          </div>
          <h1 className="font-serif text-2xl text-[#2B1B12] mb-2">
            {tela === "sucesso" ? "Pedido enviado!" : "Compra confirmada!"}
          </h1>
          <p className="text-[#6B4226]">
            {tela === "sucesso"
              ? "Recebemos sua solicitação. A ZAINIFO vai entrar em contato pelo telefone informado em breve."
              : "Recebemos o seu pedido. A ZAINIFO vai confirmar com você em breve."}
          </p>
          {metodo !== "dinheiro" && (
            <div className="mt-5 text-left">
              <PaymentInfoBox metodo={metodo} />
            </div>
          )}
          <button onClick={onBack} className="mt-6 text-sm text-[#8A7A68] underline">Voltar ao início</button>
        </div>
        <style>{FONT_CSS + INPUT_CSS}</style>
      </div>
    );
  }

  // ---- Tela: pedido personalizado (texto livre) ----
  if (tela === "personalizado") {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
        <div className="w-full max-w-sm">
          <button onClick={() => setTela("catalogo")} className="text-sm text-[#8A7A68] mb-4">← Voltar ao catálogo</button>
          <h1 className="font-serif text-2xl text-[#2B1B12] mb-1">Peça algo sob medida</h1>
          <p className="text-[#8A7A68] text-sm mb-6">Conte o que você precisa, a ZAINIFO entra em contato.</p>

          <form onSubmit={submitPersonalizado} className="bg-white border border-[#E4D5C2] rounded-md p-5 relative">
            <RulerDivider className="absolute -top-3 left-3 right-3" />
            <Field label="Seu nome *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
            <Field label="Telefone / WhatsApp *"><input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="8X XXX XXXX" /></Field>
            <Field label="E-mail"><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="O que você precisa? *">
              <textarea className="input" rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Ex: mesa de jantar para 6 pessoas, em madeira maciça" />
            </Field>

            <Field label="Forma de pagamento">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PAGAMENTO).map(([key, p]) => (
                  <button type="button" key={key} onClick={() => setForm({ ...form, formaPagamento: key })}
                    className={`py-2 rounded-sm text-xs border flex flex-col items-center gap-1 ${
                      form.formaPagamento === key ? "bg-[#2B1B12] text-[#F5EDE1] border-[#2B1B12]" : "border-[#D9C7B2] text-[#6B4226]"
                    }`}>
                    {key === "dinheiro" ? <Banknote size={14} /> : <Smartphone size={14} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>

            {form.formaPagamento !== "dinheiro" && <PaymentInfoBox metodo={form.formaPagamento} />}

            {erro && <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3 mt-3"><AlertTriangle size={14} /> {erro}</p>}
            <button type="submit" onClick={submitPersonalizado} disabled={enviando}
              className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors disabled:opacity-60 mt-3">
              {enviando ? "Enviando…" : "Enviar pedido"}
            </button>
          </form>
        </div>
        <style>{FONT_CSS + INPUT_CSS}</style>
      </div>
    );
  }

  // ---- Tela: checkout (dados do cliente + pagamento) ----
  if (tela === "checkout") {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
        <div className="w-full max-w-sm">
          <button onClick={() => setTela("carrinho")} className="text-sm text-[#8A7A68] mb-4">← Voltar ao carrinho</button>
          <h1 className="font-serif text-2xl text-[#2B1B12] mb-1">Finalizar pedido</h1>
          <p className="text-[#8A7A68] text-sm mb-6">Total do pedido: <span className="font-mono font-medium">{brl(totalCarrinho)}</span></p>

          <form onSubmit={submitCheckout} className="bg-white border border-[#E4D5C2] rounded-md p-5 relative">
            <RulerDivider className="absolute -top-3 left-3 right-3" />
            <Field label="Seu nome *"><input className="input" value={checkoutForm.nome} onChange={(e) => setCheckoutForm({ ...checkoutForm, nome: e.target.value })} /></Field>
            <Field label="Telefone / WhatsApp *"><input className="input" value={checkoutForm.telefone} onChange={(e) => setCheckoutForm({ ...checkoutForm, telefone: e.target.value })} placeholder="8X XXX XXXX" /></Field>
            <Field label="E-mail"><input className="input" value={checkoutForm.email} onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })} /></Field>

            <Field label="Forma de pagamento">
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PAGAMENTO).map(([key, p]) => (
                  <button type="button" key={key} onClick={() => setCheckoutForm({ ...checkoutForm, formaPagamento: key })}
                    className={`py-2 rounded-sm text-xs border flex flex-col items-center gap-1 ${
                      checkoutForm.formaPagamento === key ? "bg-[#2B1B12] text-[#F5EDE1] border-[#2B1B12]" : "border-[#D9C7B2] text-[#6B4226]"
                    }`}>
                    {key === "dinheiro" ? <Banknote size={14} /> : <Smartphone size={14} />}
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>

            {checkoutForm.formaPagamento !== "dinheiro" && <PaymentInfoBox metodo={checkoutForm.formaPagamento} />}

            {erro && <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3 mt-3"><AlertTriangle size={14} /> {erro}</p>}
            <button type="submit" onClick={submitCheckout} disabled={enviando}
              className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors disabled:opacity-60 mt-3">
              {enviando ? "Enviando…" : `Confirmar pedido — ${brl(totalCarrinho)}`}
            </button>
          </form>
        </div>
        <style>{FONT_CSS + INPUT_CSS}</style>
      </div>
    );
  }

  // ---- Tela: carrinho ----
  if (tela === "carrinho") {
    return (
      <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1]">
        <div className="w-full max-w-sm">
          <button onClick={() => setTela("catalogo")} className="text-sm text-[#8A7A68] mb-4">← Voltar ao catálogo</button>
          <h1 className="font-serif text-2xl text-[#2B1B12] mb-4">Seu carrinho</h1>

          {itensCarrinho.length === 0 ? (
            <EmptyState text="Seu carrinho está vazio." />
          ) : (
            <div className="grid gap-3 mb-6">
              {itensCarrinho.map(({ servico, quantidade }) => (
                <div key={servico.id} className="bg-white border border-[#E4D5C2] rounded-md p-3 flex items-center gap-3">
                  {servico.imagem ? (
                    <img src={servico.imagem} alt={servico.nome} className="w-12 h-12 object-cover rounded-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-sm bg-[#F0E4D4] flex items-center justify-center text-[#C9A896]"><ImagePlus size={16} /></div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#2B1B12]">{servico.nome}</p>
                    <p className="text-xs text-[#8A7A68] font-mono">{brl(servico.preco)} cada</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => removeFromCart(servico.id)} className="w-6 h-6 rounded-sm border border-[#D9C7B2] flex items-center justify-center"><Minus size={12} /></button>
                    <span className="text-sm w-4 text-center">{quantidade}</span>
                    <button onClick={() => addToCart(servico.id)} className="w-6 h-6 rounded-sm border border-[#D9C7B2] flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {itensCarrinho.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4 text-lg">
                <span className="font-serif">Total</span>
                <span className="font-mono font-medium">{brl(totalCarrinho)}</span>
              </div>
              <button onClick={() => setTela("checkout")}
                className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors">
                Finalizar pedido
              </button>
            </>
          )}
        </div>
        <style>{FONT_CSS + INPUT_CSS}</style>
      </div>
    );
  }

  // ---- Tela: catálogo (padrão) ----
  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans bg-[#F5EDE1] pb-24">
      <div className="w-full max-w-sm">
        <button onClick={onBack} className="text-sm text-[#8A7A68] mb-4">← Voltar</button>
        <h1 className="font-serif text-2xl text-[#2B1B12] mb-1">Nossos produtos e serviços</h1>
        <p className="text-[#8A7A68] text-sm mb-6">Adicione ao carrinho ou fale direto conosco.</p>

        <div className="mb-6">
          <p className="text-xs font-medium text-[#6B4226] mb-2 uppercase tracking-wide">Prefere falar direto?</p>
          <div className="grid grid-cols-2 gap-2">
            <a href={`https://wa.me/${TELEFONE_WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-sm bg-[#4C5E2E] text-[#F5EDE1] text-sm font-medium">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`tel:+${TELEFONE_WHATSAPP}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-sm border border-[#6B4226] text-[#6B4226] text-sm font-medium">
              <Phone size={16} /> Ligar
            </a>
          </div>
        </div>

        {servicos.length === 0 ? (
          <EmptyState text="Nenhum produto cadastrado ainda." />
        ) : (
          <div className="grid gap-3 mb-6">
            {servicos.map((s) => (
              <div key={s.id} className="bg-white border border-[#E4D5C2] rounded-md p-3 flex items-center gap-3">
                {s.imagem ? (
                  <img src={s.imagem} alt={s.nome} className="w-16 h-16 object-cover rounded-sm shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-sm bg-[#F0E4D4] flex items-center justify-center text-[#C9A896] shrink-0"><ImagePlus size={20} /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2B1B12] truncate">{s.nome}</p>
                  {s.descricao && <p className="text-xs text-[#8A7A68] line-clamp-2">{s.descricao}</p>}
                  <p className="text-sm font-mono text-[#6B4226] mt-1">{brl(s.preco)}</p>
                </div>
                {cart[s.id] ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeFromCart(s.id)} className="w-7 h-7 rounded-sm border border-[#D9C7B2] flex items-center justify-center"><Minus size={13} /></button>
                    <span className="text-sm w-4 text-center">{cart[s.id]}</span>
                    <button onClick={() => addToCart(s.id)} className="w-7 h-7 rounded-sm border border-[#D9C7B2] flex items-center justify-center"><Plus size={13} /></button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(s.id)}
                    className="shrink-0 px-3 py-2 rounded-sm bg-[#2B1B12] text-[#F5EDE1] text-xs font-medium flex items-center gap-1">
                    <ShoppingCart size={13} /> Adicionar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => setTela("personalizado")}
          className="w-full py-2.5 rounded-sm border border-[#6B4226] text-[#6B4226] text-sm font-medium mb-3">
          Precisa de algo sob medida? Peça um orçamento
        </button>
      </div>

      {qtdCarrinho > 0 && (
        <button onClick={() => setTela("carrinho")}
          className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto py-3 rounded-md bg-[#C94C36] text-[#F5EDE1] font-medium shadow-lg flex items-center justify-center gap-2">
          <ShoppingCart size={16} /> Ver carrinho ({qtdCarrinho}) — {brl(totalCarrinho)}
        </button>
      )}
      <style>{FONT_CSS + INPUT_CSS}</style>
    </div>
  );
}

function PaymentInfoBox({ metodo }) {
  const p = PAGAMENTO[metodo];
  if (!p || !p.numero) return null;
  return (
    <div className="bg-[#F3E9DA] border border-[#E4D5C2] rounded-md p-3 mb-3 text-sm">
      <div className="flex items-center gap-1.5 text-[#6B4226] font-medium mb-1">
        <CreditCard size={14} /> Pagar por {p.label}
      </div>
      <p className="text-[#2B1B12] font-mono">{p.numero}</p>
      <p className="text-xs text-[#8A7A68] mt-1">Confirmar em nome de {NOME_CONFIRMACAO}.</p>
    </div>
  );
}

// ---------------- Login / registro ----------------
function LoginScreen({ users, setUsers, onLogin, onBack }) {
  const primeiraVez = users.length === 0;
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (enviando) return;
    setErro("");
    if (primeiraVez) {
      if (!nome.trim() || !usuario.trim() || senha.length < 4) {
        setErro("Preencha nome, usuário e uma senha com 4+ caracteres.");
        return;
      }
      setEnviando(true);
      const novo = { id: uid(), nome: nome.trim(), usuario: usuario.trim().toLowerCase(), senha, papel: "admin" };
      setUsers([...users, novo]);
      onLogin(novo);
      return;
    }
    const found = users.find(
      (u) => u.usuario === usuario.trim().toLowerCase() && u.senha === senha
    );
    if (!found) { setErro("Usuário ou senha incorretos."); return; }
    setEnviando(true);
    onLogin(found);
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-10 overflow-y-auto font-sans"
      style={{
        background:
          "repeating-linear-gradient(115deg, #2B1B12 0px, #2B1B12 26px, #33210F 26px, #33210F 52px)",
      }}>
      <div className="w-full max-w-sm">
        {onBack && (
          <button onClick={onBack} className="text-sm text-[#C9B8A6] mb-4">← Voltar</button>
        )}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm"
            style={{ background: "linear-gradient(180deg,#C98A46,#9C6A2E)", boxShadow: "0 2px 0 #6B4226" }}>
            <Hammer size={18} className="text-[#2B1B12]" />
            <span className="font-serif tracking-wide text-[#2B1B12] font-semibold">ZAINIFO</span>
          </div>
          <h1 className="mt-4 text-2xl font-serif text-[#F5EDE1]">Sistema de Gestão</h1>
          <p className="text-[#C9B8A6] text-sm mt-1">Orçamentos, ordens, clientes, estoque e caixa.</p>
        </div>

        <form onSubmit={submit} autoComplete="off" className="bg-[#F5EDE1] rounded-md p-6 shadow-xl relative">
          <RulerDivider className="absolute -top-3 left-3 right-3" />

          <p className="text-center text-sm font-medium text-[#6B4226] mb-4">
            {primeiraVez ? "Criar conta de administrador" : "Entrar"}
          </p>

          {primeiraVez && (
            <Field label="Seu nome">
              <input value={nome} onChange={(e) => setNome(e.target.value)}
                className="input" placeholder="Ex: Marcos" />
            </Field>
          )}
          <Field label="Usuário">
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)}
              className="input" placeholder="ex: marcos" autoCapitalize="none" />
          </Field>
          <Field label="Senha">
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
              autoComplete="off" name="zainifo-acesso-gestor"
              className="input" placeholder="••••••" />
          </Field>

          {erro && (
            <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3">
              <AlertTriangle size={14} /> {erro}
            </p>
          )}

          <button type="submit" onClick={submit} disabled={enviando}
            className="w-full py-2.5 rounded-sm bg-[#C94C36] text-[#F5EDE1] font-medium hover:bg-[#B03F2B] transition-colors disabled:opacity-60">
            {enviando ? "Entrando…" : primeiraVez ? "Criar conta e entrar" : "Entrar"}
          </button>

          {primeiraVez && (
            <p className="text-xs text-[#8A7A68] mt-3 text-center">
              Primeira vez aqui — essa conta será a administradora principal do sistema. Só ela poderá adicionar outros membros da equipe depois.
            </p>
          )}
          {!primeiraVez && (
            <p className="text-xs text-[#8A7A68] mt-3 text-center">
              Não tem uma conta? Peça ao administrador principal para te cadastrar em "Equipe", dentro do painel.
            </p>
          )}
        </form>
      </div>
      <style>{FONT_CSS + INPUT_CSS}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-[#6B4226] mb-1">{label}</span>
      {children}
    </label>
  );
}

// ---------------- Shell (nav + content) ----------------
function Shell({ session, onLogout, view, setView, data, setters }) {
  return (
    <div className="min-h-screen flex font-sans bg-[#F5EDE1] text-[#2B1B12]">
      <style>{FONT_CSS + INPUT_CSS}</style>
      <aside className="w-60 shrink-0 bg-[#2B1B12] text-[#F5EDE1] flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2 border-b border-[#4A3020]">
          <Hammer size={20} className="text-[#C98A46]" />
          <span className="font-serif text-lg">Zainifo</span>
        </div>
        <nav className="flex-1 py-3">
          {NAV.filter((item) => !item.adminOnly || session.papel !== "funcionario").map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setView(key)}
              className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${
                view === key
                  ? "bg-[#3A2417] border-[#C98A46] text-[#F5EDE1]"
                  : "border-transparent text-[#C9B8A6] hover:bg-[#33210F]"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-[#4A3020]">
          <p className="text-xs text-[#8A7A68]">Conectado como</p>
          <p className="text-sm mb-3">{session.nome}{session.papel !== "funcionario" ? " · Admin" : ""}</p>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-sm text-[#C9B8A6] hover:text-[#F5EDE1] transition-colors">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col">
        <RulerDivider />
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {view === "dashboard" && <Dashboard data={data} setView={setView} />}
          {view === "pedidos" && (
            <PedidosView pedidos={data.pedidos} setPedidos={setters.setPedidos} />
          )}
          {view === "solicitacoes" && (
            <SolicitacoesView
              solicitacoes={data.solicitacoes} setSolicitacoes={setters.setSolicitacoes}
              clientes={data.clientes} setClientes={setters.setClientes}
              setOrcamentos={setters.setOrcamentos} orcamentos={data.orcamentos}
              setView={setView}
            />
          )}
          {view === "servicos" && <ServicosView servicos={data.servicos} setServicos={setters.setServicos} />}
          {view === "clientes" && <ClientesView clientes={data.clientes} setClientes={setters.setClientes} />}
          {view === "estoque" && <EstoqueView estoque={data.estoque} setEstoque={setters.setEstoque} />}
          {view === "orcamentos" && (
            <OrcamentosView
              orcamentos={data.orcamentos} setOrcamentos={setters.setOrcamentos}
              clientes={data.clientes} ordens={data.ordens} setOrdens={setters.setOrdens}
            />
          )}
          {view === "ordens" && (
            <OrdensView ordens={data.ordens} setOrdens={setters.setOrdens} clientes={data.clientes} />
          )}
          {view === "financeiro" && (
            <FinanceiroView financeiro={data.financeiro} setFinanceiro={setters.setFinanceiro} />
          )}
          {view === "equipe" && session.papel !== "funcionario" && (
            <EquipeView users={data.users} setUsers={setters.setUsers} sessionId={session.id} />
          )}
        </div>
      </main>
    </div>
  );
}

// ---------------- Dashboard ----------------
function Dashboard({ data, setView }) {
  const { clientes, estoque, orcamentos, ordens, financeiro, solicitacoes = [], pedidos = [] } = data;
  const saldo = financeiro.reduce((s, f) => s + (f.tipo === "entrada" ? f.valor : -f.valor), 0);
  const orcPendentes = orcamentos.filter((o) => o.status === "pendente").length;
  const ordensAtivas = ordens.filter((o) => o.status !== "entregue").length;
  const estoqueBaixo = estoque.filter((e) => Number(e.quantidade) <= Number(e.minimo));
  const solicitacoesNovas = solicitacoes.filter((s) => s.status === "nova").length;
  const pedidosNovos = pedidos.filter((p) => p.status === "novo").length;

  const cards = [
    { label: "Pedidos do carrinho", value: pedidosNovos, icon: ShoppingCart, onClick: () => setView("pedidos"),
      tone: pedidosNovos > 0 ? "text-[#C94C36]" : "" },
    { label: "Solicitações sob medida", value: solicitacoesNovas, icon: Inbox, onClick: () => setView("solicitacoes"),
      tone: solicitacoesNovas > 0 ? "text-[#C94C36]" : "" },
    { label: "Clientes", value: clientes.length, icon: Users, onClick: () => setView("clientes") },
    { label: "Orçamentos pendentes", value: orcPendentes, icon: FileText, onClick: () => setView("orcamentos") },
    { label: "Ordens em andamento", value: ordensAtivas, icon: ClipboardList, onClick: () => setView("ordens") },
    { label: "Saldo em caixa", value: brl(saldo), icon: Wallet, onClick: () => setView("financeiro"), mono: true,
      tone: saldo >= 0 ? "text-[#5B6E3A]" : "text-[#C94C36]" },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl mb-1">Painel</h1>
      <p className="text-[#8A7A68] text-sm mb-6">Visão geral da oficina hoje.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, onClick, mono, tone }) => (
          <button key={label} onClick={onClick}
            className="text-left bg-white/60 border border-[#E4D5C2] rounded-md p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Icon size={16} className="text-[#B87333] mb-2" />
            <div className={`text-xl ${mono ? "font-mono" : "font-serif"} ${tone || ""}`}>{value}</div>
            <div className="text-xs text-[#8A7A68] mt-1">{label}</div>
          </button>
        ))}
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="bg-[#FBEFE9] border border-[#E9C4B4] rounded-md p-4">
          <div className="flex items-center gap-2 text-[#C94C36] font-medium text-sm mb-2">
            <AlertTriangle size={16} /> Estoque baixo
          </div>
          <ul className="text-sm text-[#6B4226] space-y-1">
            {estoqueBaixo.map((e) => (
              <li key={e.id}>{e.nome} — {e.quantidade} {e.unidade} (mínimo {e.minimo})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------- Solicitações (pedidos de clientes à distância) ----------------
const STATUS_SOLIC = { nova: "Nova", em_analise: "Em análise", respondida: "Respondida" };
const STATUS_SOLIC_COLOR = {
  nova: "bg-[#F4D6CD] text-[#A8402C]",
  em_analise: "bg-[#F3E3C6] text-[#8A6A1E]",
  respondida: "bg-[#DCE6CB] text-[#4C5E2E]",
};

function SolicitacoesView({ solicitacoes, setSolicitacoes, clientes, setClientes, orcamentos, setOrcamentos, setView }) {
  const setStatus = (id, status) =>
    setSolicitacoes(solicitacoes.map((s) => (s.id === id ? { ...s, status } : s)));
  const remove = (id) => setSolicitacoes(solicitacoes.filter((s) => s.id !== id));

  const transformarEmOrcamento = (s) => {
    let cliente = clientes.find(
      (c) => c.telefone === s.telefone || (s.email && c.email === s.email)
    );
    if (!cliente) {
      cliente = { id: uid(), nome: s.nome, telefone: s.telefone, email: s.email, endereco: "", obs: "Cadastrado a partir de um pedido do site.", criadoEm: todayISO() };
      setClientes([...clientes, cliente]);
    }
    setOrcamentos([...orcamentos, {
      id: uid(), clienteId: cliente.id, descricao: s.descricao, valorTotal: 0, status: "pendente", criadoEm: todayISO(),
    }]);
    setStatus(s.id, "respondida");
    setView("orcamentos");
  };

  return (
    <ViewShell title="Solicitações" subtitle="Pedidos enviados por clientes à distância." onAdd={null}>
      {solicitacoes.length === 0 ? (
        <EmptyState text="Nenhuma solicitação recebida ainda. Compartilhe o link do portal do cliente para começar a receber pedidos." />
      ) : (
        <div className="grid gap-3">
          {solicitacoes.map((s) => (
            <div key={s.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium">{s.nome}</p>
                  <p className="text-sm text-[#8A7A68] flex items-center gap-1.5">
                    <Phone size={12} /> {s.telefone} {s.email ? `· ${s.email}` : ""}
                  </p>
                  <p className="text-sm text-[#6B4226] mt-1.5">{s.descricao}</p>
                  <p className="text-xs text-[#8A7A68] mt-1">
                    {s.criadoEm}{s.formaPagamento ? ` · Pagamento: ${PAGAMENTO[s.formaPagamento]?.label || s.formaPagamento}` : ""}
                  </p>
                </div>
                <button onClick={() => remove(s.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2 py-1 rounded-sm ${STATUS_SOLIC_COLOR[s.status]}`}>{STATUS_SOLIC[s.status]}</span>
                <div className="flex items-center gap-2">
                  {s.status === "nova" && (
                    <button onClick={() => setStatus(s.id, "em_analise")} className="text-xs px-2 py-1 rounded-sm border border-[#D9C7B2] hover:bg-[#F0E4D4]">
                      Marcar em análise
                    </button>
                  )}
                  <button onClick={() => transformarEmOrcamento(s)} className="text-xs px-2 py-1 rounded-sm bg-[#2B1B12] text-[#F5EDE1] hover:bg-[#3A2417] flex items-center gap-1">
                    Criar orçamento <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Equipe (apenas administrador principal) ----------------
function EquipeView({ users, setUsers, sessionId }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", usuario: "", senha: "", papel: "funcionario" });
  const [erro, setErro] = useState("");

  const add = (e) => {
    e.preventDefault();
    setErro("");
    if (!form.nome.trim() || !form.usuario.trim() || form.senha.length < 4) {
      setErro("Preencha nome, usuário e uma senha com 4+ caracteres.");
      return;
    }
    if (users.some((u) => u.usuario === form.usuario.trim().toLowerCase())) {
      setErro("Esse nome de usuário já existe.");
      return;
    }
    setUsers([...users, { id: uid(), nome: form.nome.trim(), usuario: form.usuario.trim().toLowerCase(), senha: form.senha, papel: form.papel }]);
    setForm({ nome: "", usuario: "", senha: "", papel: "funcionario" });
    setShowForm(false);
  };
  const remove = (id) => {
    if (id === sessionId) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <ViewShell title="Equipe" subtitle="Só o administrador principal pode adicionar ou remover membros." onAdd={() => setShowForm(true)} addLabel="Novo membro">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo membro da equipe">
          <Field label="Nome *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
          <Field label="Usuário *"><input className="input" autoCapitalize="none" value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} /></Field>
          <Field label="Senha *"><input type="password" className="input" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} /></Field>
          <Field label="Função">
            <div className="flex gap-2">
              {[["funcionario", "Funcionário"], ["admin", "Administrador"]].map(([val, label]) => (
                <button type="button" key={val} onClick={() => setForm({ ...form, papel: val })}
                  className={`flex-1 py-2 rounded-sm text-sm border ${form.papel === val ? "bg-[#2B1B12] text-[#F5EDE1] border-[#2B1B12]" : "border-[#D9C7B2] text-[#6B4226]"}`}>
                  {label}
                </button>
              ))}
            </div>
          </Field>
          {erro && <p className="text-[#C94C36] text-sm flex items-center gap-1.5 mb-3 mt-2"><AlertTriangle size={14} /> {erro}</p>}
        </FormPanel>
      )}

      <div className="grid gap-3">
        {users.map((u) => (
          <div key={u.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4 flex justify-between items-center">
            <div>
              <p className="font-medium flex items-center gap-2">
                {u.nome}
                {u.papel !== "funcionario" && (
                  <span className="text-xs px-2 py-0.5 rounded-sm bg-[#DCE6CB] text-[#4C5E2E] flex items-center gap-1">
                    <ShieldCheck size={12} /> Admin
                  </span>
                )}
              </p>
              <p className="text-sm text-[#8A7A68]">@{u.usuario}</p>
            </div>
            {u.id !== sessionId && (
              <button onClick={() => remove(u.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
            )}
          </div>
        ))}
      </div>
    </ViewShell>
  );
}

// ---------------- Pedidos (compras feitas pelo carrinho do cliente) ----------------
const STATUS_PEDIDO = { novo: "Novo", confirmado: "Confirmado", entregue: "Entregue" };
const STATUS_PEDIDO_COLOR = {
  novo: "bg-[#F4D6CD] text-[#A8402C]",
  confirmado: "bg-[#F3E3C6] text-[#8A6A1E]",
  entregue: "bg-[#DCE6CB] text-[#4C5E2E]",
};
const PEDIDO_SEQ = ["novo", "confirmado", "entregue"];

function PedidosView({ pedidos, setPedidos }) {
  const remove = (id) => setPedidos(pedidos.filter((p) => p.id !== id));
  const avancar = (p) => {
    const idx = PEDIDO_SEQ.indexOf(p.status);
    if (idx < PEDIDO_SEQ.length - 1) {
      setPedidos(pedidos.map((x) => (x.id === p.id ? { ...x, status: PEDIDO_SEQ[idx + 1] } : x)));
    }
  };

  return (
    <ViewShell title="Pedidos" subtitle="Compras feitas pelos clientes através do catálogo.">
      {pedidos.length === 0 ? (
        <EmptyState text="Nenhum pedido recebido ainda." />
      ) : (
        <div className="grid gap-3">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium">{p.cliente?.nome}</p>
                  <p className="text-sm text-[#8A7A68] flex items-center gap-1.5"><Phone size={12} /> {p.cliente?.telefone}</p>
                  <p className="text-xs text-[#8A7A68] mt-1">{p.criadoEm} · Pagamento: {PAGAMENTO[p.formaPagamento]?.label || p.formaPagamento}</p>
                </div>
                <button onClick={() => remove(p.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
              </div>
              <div className="mt-3 border-t border-[#EEE2D3] pt-3">
                {(p.itens || []).map((it, i) => (
                  <div key={i} className="flex justify-between text-sm text-[#6B4226] mb-1">
                    <span>{it.quantidade}× {it.nome}</span>
                    <span className="font-mono">{brl(it.preco * it.quantidade)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-lg">{brl(p.total)}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-sm ${STATUS_PEDIDO_COLOR[p.status]}`}>{STATUS_PEDIDO[p.status]}</span>
                  {p.status !== "entregue" && (
                    <button onClick={() => avancar(p)} className="text-xs px-2 py-1 rounded-sm border border-[#D9C7B2] hover:bg-[#F0E4D4]">
                      Avançar →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Serviços (catálogo visível aos clientes) ----------------
function ServicosView({ servicos, setServicos }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", preco: 0, descricao: "", imagem: "" });
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  const onImagem = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCarregandoImagem(true);
    try {
      const dataUrl = await resizeImageFile(file);
      setForm((f) => ({ ...f, imagem: dataUrl }));
    } catch (err) {
      console.error("Erro ao processar imagem", err);
    } finally {
      setCarregandoImagem(false);
    }
  };

  const add = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    setServicos([...servicos, { id: uid(), ...form, preco: Number(form.preco) }]);
    setForm({ nome: "", preco: 0, descricao: "", imagem: "" });
    setShowForm(false);
  };
  const remove = (id) => setServicos(servicos.filter((s) => s.id !== id));

  return (
    <ViewShell title="Serviços" subtitle="Catálogo visível para os clientes no pedido à distância." onAdd={() => setShowForm(true)} addLabel="Novo serviço">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo serviço">
          <Field label="Foto do produto">
            <div className="flex items-center gap-3">
              {form.imagem ? (
                <img src={form.imagem} alt="Pré-visualização" className="w-16 h-16 object-cover rounded-sm border border-[#D9C7B2]" />
              ) : (
                <div className="w-16 h-16 rounded-sm border border-dashed border-[#D9C7B2] flex items-center justify-center text-[#C9A896]">
                  <ImagePlus size={20} />
                </div>
              )}
              <label className="text-sm px-3 py-2 rounded-sm border border-[#D9C7B2] text-[#6B4226] cursor-pointer">
                {carregandoImagem ? "Carregando…" : form.imagem ? "Trocar foto" : "Escolher foto"}
                <input type="file" accept="image/*" className="hidden" onChange={onImagem} />
              </label>
            </div>
          </Field>
          <Field label="Nome do serviço/produto *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Mesa de jantar 6 lugares" /></Field>
          <Field label="Preço (MT)"><input type="number" step="0.01" className="input" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} /></Field>
          <Field label="Descrição"><textarea className="input" rows={2} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></Field>
        </FormPanel>
      )}

      {servicos.length === 0 ? (
        <EmptyState text="Nenhum serviço cadastrado ainda. Cadastre para que os clientes vejam no pedido à distância." />
      ) : (
        <div className="grid gap-3">
          {servicos.map((s) => (
            <div key={s.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4 flex justify-between items-start gap-3">
              <div className="flex items-start gap-3">
                {s.imagem ? (
                  <img src={s.imagem} alt={s.nome} className="w-14 h-14 object-cover rounded-sm border border-[#E4D5C2]" />
                ) : (
                  <div className="w-14 h-14 rounded-sm border border-[#E4D5C2] flex items-center justify-center text-[#C9A896] shrink-0">
                    <ImagePlus size={18} />
                  </div>
                )}
                <div>
                  <p className="font-medium">{s.nome}</p>
                  {s.descricao && <p className="text-sm text-[#8A7A68] mt-0.5">{s.descricao}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[#6B4226]">{brl(s.preco)}</span>
                <button onClick={() => remove(s.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Clientes ----------------
function ClientesView({ clientes, setClientes }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", endereco: "", obs: "" });

  const add = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    setClientes([...clientes, { id: uid(), ...form, criadoEm: todayISO() }]);
    setForm({ nome: "", telefone: "", email: "", endereco: "", obs: "" });
    setShowForm(false);
  };
  const remove = (id) => setClientes(clientes.filter((c) => c.id !== id));

  return (
    <ViewShell title="Clientes" subtitle="Cadastro e contato." onAdd={() => setShowForm(true)} addLabel="Novo cliente">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo cliente">
          <Field label="Nome *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
          <Field label="Telefone"><input className="input" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></Field>
          <Field label="E-mail"><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Endereço"><input className="input" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></Field>
          <Field label="Observações"><textarea className="input" rows={2} value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} /></Field>
        </FormPanel>
      )}

      {clientes.length === 0 ? (
        <EmptyState text="Nenhum cliente cadastrado ainda." />
      ) : (
        <div className="grid gap-3">
          {clientes.map((c) => (
            <div key={c.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4 flex justify-between items-start">
              <div>
                <p className="font-medium">{c.nome}</p>
                <p className="text-sm text-[#8A7A68]">{[c.telefone, c.email].filter(Boolean).join(" · ")}</p>
                {c.endereco && <p className="text-sm text-[#8A7A68]">{c.endereco}</p>}
                {c.obs && <p className="text-sm text-[#6B4226] mt-1 italic">{c.obs}</p>}
              </div>
              <button onClick={() => remove(c.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Estoque ----------------
function EstoqueView({ estoque, setEstoque }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: "", unidade: "un", quantidade: 0, minimo: 0, precoUnit: 0 });

  const add = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) return;
    setEstoque([...estoque, { id: uid(), ...form, quantidade: Number(form.quantidade), minimo: Number(form.minimo), precoUnit: Number(form.precoUnit) }]);
    setForm({ nome: "", unidade: "un", quantidade: 0, minimo: 0, precoUnit: 0 });
    setShowForm(false);
  };
  const remove = (id) => setEstoque(estoque.filter((i) => i.id !== id));
  const ajustar = (id, delta) =>
    setEstoque(estoque.map((i) => (i.id === id ? { ...i, quantidade: Math.max(0, Number(i.quantidade) + delta) } : i)));

  return (
    <ViewShell title="Estoque" subtitle="Materiais e ferragens." onAdd={() => setShowForm(true)} addLabel="Novo material">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo material">
          <Field label="Nome *"><input className="input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Unidade"><input className="input" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} placeholder="m², un, kg…" /></Field>
            <Field label="Preço unit. (R$)"><input type="number" step="0.01" className="input" value={form.precoUnit} onChange={(e) => setForm({ ...form, precoUnit: e.target.value })} /></Field>
            <Field label="Quantidade"><input type="number" className="input" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} /></Field>
            <Field label="Estoque mínimo"><input type="number" className="input" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} /></Field>
          </div>
        </FormPanel>
      )}

      {estoque.length === 0 ? (
        <EmptyState text="Nenhum material cadastrado ainda." />
      ) : (
        <div className="overflow-x-auto rounded-md border border-[#E4D5C2] bg-white/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#8A7A68] border-b border-[#E4D5C2]">
                <th className="p-3 font-medium">Material</th>
                <th className="p-3 font-medium">Qtd.</th>
                <th className="p-3 font-medium">Mínimo</th>
                <th className="p-3 font-medium">Preço unit.</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {estoque.map((i) => {
                const baixo = Number(i.quantidade) <= Number(i.minimo);
                return (
                  <tr key={i.id} className="border-b border-[#EEE2D3] last:border-0">
                    <td className="p-3">{i.nome}</td>
                    <td className={`p-3 font-mono ${baixo ? "text-[#C94C36]" : ""}`}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => ajustar(i.id, -1)} className="w-5 h-5 rounded-sm border border-[#D9C7B2] hover:bg-[#F0E4D4]">–</button>
                        {i.quantidade} {i.unidade}
                        <button onClick={() => ajustar(i.id, 1)} className="w-5 h-5 rounded-sm border border-[#D9C7B2] hover:bg-[#F0E4D4]">+</button>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[#8A7A68]">{i.minimo} {i.unidade}</td>
                    <td className="p-3 font-mono">{brl(i.precoUnit)}</td>
                    <td className="p-3 text-right"><button onClick={() => remove(i.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={15} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Orçamentos ----------------
const STATUS_ORC = { pendente: "Pendente", aprovado: "Aprovado", recusado: "Recusado" };
const STATUS_COLOR = {
  pendente: "bg-[#F3E3C6] text-[#8A6A1E]",
  aprovado: "bg-[#DCE6CB] text-[#4C5E2E]",
  recusado: "bg-[#F4D6CD] text-[#A8402C]",
};

function OrcamentosView({ orcamentos, setOrcamentos, clientes, ordens, setOrdens }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clienteId: "", descricao: "", valorTotal: 0 });

  const add = (e) => {
    e.preventDefault();
    if (!form.descricao.trim()) return;
    setOrcamentos([...orcamentos, { id: uid(), ...form, valorTotal: Number(form.valorTotal), status: "pendente", criadoEm: todayISO() }]);
    setForm({ clienteId: "", descricao: "", valorTotal: 0 });
    setShowForm(false);
  };
  const remove = (id) => setOrcamentos(orcamentos.filter((o) => o.id !== id));
  const setStatus = (id, status) => {
    setOrcamentos(orcamentos.map((o) => (o.id === id ? { ...o, status } : o)));
    if (status === "aprovado") {
      const orc = orcamentos.find((o) => o.id === id);
      const jaTemOrdem = ordens.some((od) => od.orcamentoId === id);
      if (orc && !jaTemOrdem) {
        setOrdens([...ordens, {
          id: uid(), orcamentoId: id, clienteId: orc.clienteId, titulo: orc.descricao,
          descricao: "", status: "fila", prazo: "", criadoEm: todayISO(),
        }]);
      }
    }
  };
  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome || "Sem cliente";

  return (
    <ViewShell title="Orçamentos" subtitle="Propostas enviadas aos clientes." onAdd={() => setShowForm(true)} addLabel="Novo orçamento">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo orçamento">
          <Field label="Cliente">
            <select className="input" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">— selecionar —</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
          <Field label="Descrição do projeto *"><textarea className="input" rows={2} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></Field>
          <Field label="Valor total (R$)"><input type="number" step="0.01" className="input" value={form.valorTotal} onChange={(e) => setForm({ ...form, valorTotal: e.target.value })} /></Field>
        </FormPanel>
      )}

      {orcamentos.length === 0 ? (
        <EmptyState text="Nenhum orçamento criado ainda." />
      ) : (
        <div className="grid gap-3">
          {orcamentos.map((o) => (
            <div key={o.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium">{o.descricao}</p>
                  <p className="text-sm text-[#8A7A68]">{nomeCliente(o.clienteId)} · {o.criadoEm}</p>
                </div>
                <button onClick={() => remove(o.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-lg">{brl(o.valorTotal)}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-sm ${STATUS_COLOR[o.status]}`}>{STATUS_ORC[o.status]}</span>
                  {o.status === "pendente" && (
                    <>
                      <button onClick={() => setStatus(o.id, "aprovado")} className="text-xs px-2 py-1 rounded-sm border border-[#B9C79A] text-[#4C5E2E] hover:bg-[#DCE6CB] flex items-center gap-1"><Check size={12} /> Aprovar</button>
                      <button onClick={() => setStatus(o.id, "recusado")} className="text-xs px-2 py-1 rounded-sm border border-[#E3B3A6] text-[#A8402C] hover:bg-[#F4D6CD] flex items-center gap-1"><X size={12} /> Recusar</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Ordens de Serviço ----------------
const STATUS_ORDEM = { fila: "Na fila", producao: "Em produção", acabamento: "Acabamento", concluido: "Concluído", entregue: "Entregue" };
const ORDEM_SEQ = ["fila", "producao", "acabamento", "concluido", "entregue"];

function OrdensView({ ordens, setOrdens, clientes }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clienteId: "", titulo: "", descricao: "", prazo: "" });

  const add = (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setOrdens([...ordens, { id: uid(), ...form, status: "fila", criadoEm: todayISO() }]);
    setForm({ clienteId: "", titulo: "", descricao: "", prazo: "" });
    setShowForm(false);
  };
  const remove = (id) => setOrdens(ordens.filter((o) => o.id !== id));
  const avancar = (o) => {
    const idx = ORDEM_SEQ.indexOf(o.status);
    if (idx < ORDEM_SEQ.length - 1) {
      setOrdens(ordens.map((x) => (x.id === o.id ? { ...x, status: ORDEM_SEQ[idx + 1] } : x)));
    }
  };
  const nomeCliente = (id) => clientes.find((c) => c.id === id)?.nome || "Sem cliente";

  return (
    <ViewShell title="Ordens de Serviço" subtitle="Projetos em produção." onAdd={() => setShowForm(true)} addLabel="Nova ordem">
      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Nova ordem de serviço">
          <Field label="Título *"><input className="input" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex: Mesa de jantar 6 lugares" /></Field>
          <Field label="Cliente">
            <select className="input" value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })}>
              <option value="">— selecionar —</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
          <Field label="Detalhes"><textarea className="input" rows={2} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></Field>
          <Field label="Prazo"><input type="date" className="input" value={form.prazo} onChange={(e) => setForm({ ...form, prazo: e.target.value })} /></Field>
        </FormPanel>
      )}

      {ordens.length === 0 ? (
        <EmptyState text="Nenhuma ordem de serviço ainda." />
      ) : (
        <div className="grid gap-3">
          {ordens.map((o) => (
            <div key={o.id} className="bg-white/60 border border-[#E4D5C2] rounded-md p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-medium">{o.titulo}</p>
                  <p className="text-sm text-[#8A7A68]">{nomeCliente(o.clienteId)}{o.prazo ? ` · prazo ${o.prazo}` : ""}</p>
                  {o.descricao && <p className="text-sm text-[#6B4226] mt-1">{o.descricao}</p>}
                </div>
                <button onClick={() => remove(o.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={16} /></button>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {ORDEM_SEQ.map((s, i) => {
                  const currentIdx = ORDEM_SEQ.indexOf(o.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={s} className={`flex-1 h-1.5 rounded-full ${done ? "bg-[#C98A46]" : "bg-[#E4D5C2]"}`} title={STATUS_ORDEM[s]} />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#6B4226]">{STATUS_ORDEM[o.status]}</span>
                {o.status !== "entregue" && (
                  <button onClick={() => avancar(o)} className="text-xs px-2 py-1 rounded-sm border border-[#D9C7B2] hover:bg-[#F0E4D4]">
                    Avançar etapa →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

// ---------------- Financeiro ----------------
function FinanceiroView({ financeiro, setFinanceiro }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tipo: "entrada", descricao: "", valor: 0, data: todayISO() });

  const add = (e) => {
    e.preventDefault();
    if (!form.descricao.trim()) return;
    setFinanceiro([{ id: uid(), ...form, valor: Number(form.valor) }, ...financeiro]);
    setForm({ tipo: "entrada", descricao: "", valor: 0, data: todayISO() });
    setShowForm(false);
  };
  const remove = (id) => setFinanceiro(financeiro.filter((f) => f.id !== id));

  const totalEntradas = financeiro.filter((f) => f.tipo === "entrada").reduce((s, f) => s + f.valor, 0);
  const totalSaidas = financeiro.filter((f) => f.tipo === "saida").reduce((s, f) => s + f.valor, 0);
  const saldo = totalEntradas - totalSaidas;

  return (
    <ViewShell title="Financeiro" subtitle="Entradas e saídas do caixa." onAdd={() => setShowForm(true)} addLabel="Novo lançamento">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Entradas" value={brl(totalEntradas)} icon={TrendingUp} tone="text-[#5B6E3A]" />
        <SummaryCard label="Saídas" value={brl(totalSaidas)} icon={TrendingDown} tone="text-[#C94C36]" />
        <SummaryCard label="Saldo" value={brl(saldo)} icon={Wallet} tone={saldo >= 0 ? "text-[#5B6E3A]" : "text-[#C94C36]"} />
      </div>

      {showForm && (
        <FormPanel onClose={() => setShowForm(false)} onSubmit={add} title="Novo lançamento">
          <div className="flex gap-2 mb-3">
            {["entrada", "saida"].map((t) => (
              <button type="button" key={t} onClick={() => setForm({ ...form, tipo: t })}
                className={`flex-1 py-2 rounded-sm text-sm border ${form.tipo === t ? "bg-[#2B1B12] text-[#F5EDE1] border-[#2B1B12]" : "border-[#D9C7B2] text-[#6B4226]"}`}>
                {t === "entrada" ? "Entrada" : "Saída"}
              </button>
            ))}
          </div>
          <Field label="Descrição *"><input className="input" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor (R$)"><input type="number" step="0.01" className="input" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} /></Field>
            <Field label="Data"><input type="date" className="input" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} /></Field>
          </div>
        </FormPanel>
      )}

      {financeiro.length === 0 ? (
        <EmptyState text="Nenhum lançamento registrado ainda." />
      ) : (
        <div className="rounded-md border border-[#E4D5C2] bg-white/60 divide-y divide-[#EEE2D3]">
          {financeiro.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                {f.tipo === "entrada" ? <TrendingUp size={15} className="text-[#5B6E3A]" /> : <TrendingDown size={15} className="text-[#C94C36]" />}
                <div>
                  <p className="text-sm">{f.descricao}</p>
                  <p className="text-xs text-[#8A7A68]">{f.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm ${f.tipo === "entrada" ? "text-[#5B6E3A]" : "text-[#C94C36]"}`}>
                  {f.tipo === "entrada" ? "+" : "–"} {brl(f.valor)}
                </span>
                <button onClick={() => remove(f.id)} className="text-[#C9A896] hover:text-[#C94C36]"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

function SummaryCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="bg-white/60 border border-[#E4D5C2] rounded-md p-4">
      <Icon size={16} className={`mb-2 ${tone}`} />
      <div className={`text-xl font-mono ${tone}`}>{value}</div>
      <div className="text-xs text-[#8A7A68] mt-1">{label}</div>
    </div>
  );
}

// ---------------- Shared UI ----------------
function ViewShell({ title, subtitle, onAdd, addLabel, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl">{title}</h1>
          <p className="text-[#8A7A68] text-sm">{subtitle}</p>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1.5 bg-[#C94C36] text-[#F5EDE1] text-sm px-3.5 py-2 rounded-sm hover:bg-[#B03F2B] transition-colors">
            <Plus size={15} /> {addLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function FormPanel({ title, onClose, onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E4D5C2] rounded-md p-5 mb-6 relative animate-[fadein_.15s_ease]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-lg">{title}</h2>
        <button type="button" onClick={onClose} className="text-[#8A7A68] hover:text-[#2B1B12]"><X size={18} /></button>
      </div>
      {children}
      <div className="flex justify-end gap-2 mt-2">
        <button type="button" onClick={onClose} className="text-sm px-3 py-2 text-[#6B4226]">Cancelar</button>
        <button type="submit" className="text-sm px-4 py-2 rounded-sm bg-[#2B1B12] text-[#F5EDE1] hover:bg-[#3A2417]">Salvar</button>
      </div>
    </form>
  );
}

function EmptyState({ text }) {
  return (
    <div className="border border-dashed border-[#D9C7B2] rounded-md p-10 text-center text-[#8A7A68]">
      <Ruler size={20} className="mx-auto mb-2 opacity-60" />
      {text}
    </div>
  );
}

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
.font-serif { font-family: 'Fraunces', serif; }
.font-sans { font-family: 'IBM Plex Sans', sans-serif; }
.font-mono { font-family: 'IBM Plex Mono', monospace; }
@keyframes fadein { from { opacity: 0; transform: translateY(-4px);} to { opacity: 1; transform: translateY(0);} }
`;
const INPUT_CSS = `
.input {
  width: 100%;
  background: #FBF7F0;
  border: 1px solid #D9C7B2;
  border-radius: 3px;
  padding: 8px 10px;
  font-size: 14px;
  color: #2B1B12;
  outline: none;
}
.input:focus { border-color: #B87333; box-shadow: 0 0 0 2px rgba(184,115,51,0.15); }
`;
