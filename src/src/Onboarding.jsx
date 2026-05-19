import React, { useState } from "react";
import { supabase } from "./auth";

const ROSE = "#B08B8C";
const GOLD = "#CCA968";

const ESPECIALIDADES = [
  { value: "psiquiatria", label: "Psiquiatria", icon: "🧠" },
  { value: "cardiologia", label: "Cardiologia", icon: "❤️" },
  { value: "endocrinologia", label: "Endocrinologia", icon: "⚗️" },
  { value: "neurologia", label: "Neurologia", icon: "🔬" },
  { value: "ginecologia", label: "Ginecologia", icon: "🌸" },
  { value: "pediatria", label: "Pediatria", icon: "👶" },
  { value: "dermatologia", label: "Dermatologia", icon: "🩺" },
  { value: "clinica_geral", label: "Clínica Geral", icon: "🏥" },
  { value: "ortopedia", label: "Ortopedia", icon: "🦴" },
  { value: "urologia", label: "Urologia", icon: "💊" },
  { value: "oftalmologia", label: "Oftalmologia", icon: "👁️" },
  { value: "outra", label: "Outra", icon: "⚕️" },
];

const ESTADOS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const TIPOS = [
  { value: "consultorio", label: "Consultório próprio" },
  { value: "clinica", label: "Clínica" },
  { value: "hospital", label: "Hospital" },
  { value: "telemedicina", label: "Telemedicina" },
];

export default function Onboarding({ user, onComplete }) {
  const [passo, setPasso] = useState(1);
  const [nome, setNome] = useState(user?.user_metadata?.nome || "");
  const [crm, setCrm] = useState(user?.user_metadata?.crm || "");
  const [especialidade, setEspecialidade] = useState("");
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    setLoading(true);
    await supabase.from("medicos").upsert({
      id: user.id,
      email: user.email,
      nome,
      crm,
      especialidade,
      status: "active"
    });
    onComplete({ nome, crm, especialidade, estado, tipo });
    setLoading(false);
  };

  const s = {
    wrap: { minHeight:"100vh", background:"linear-gradient(135deg,#2c1f1f,#3d2929)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Montserrat',sans-serif" },
    card: { background:"#fff", borderRadius:12, maxWidth:560, width:"100%", overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.5)" },
    header: { background:ROSE, padding:"24px 32px" },
    progress: { display:"flex", gap:8, marginBottom:8 },
    progBar: (ativo, done) => ({ flex:1, height:3, borderRadius:2, background: done ? GOLD : ativo ? "#fff" : "rgba(255,255,255,0.3)" }),
    body: { padding:32 },
    label: { fontSize:11, fontWeight:600, color:"#888", letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6 },
    input: { width:"100%", border:"1px solid #e8e0e0", borderRadius:4, padding:"12px 14px", fontFamily:"'Montserrat',sans-serif", fontSize:13, outline:"none", marginBottom:16, boxSizing:"border-box", color:"#333" },
    btn: { width:"100%", background:ROSE, color:"#fff", border:"none", borderRadius:4, padding:13, fontFamily:"'Montserrat',sans-serif", fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", marginTop:8 },
    btnGold: { width:"100%", background:GOLD, color:"#2c1f1f", border:"none", borderRadius:4, padding:13, fontFamily:"'Montserrat',sans-serif", fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", cursor:"pointer", marginTop:8 },
    specGrid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 },
    specCard: (sel) => ({ border:`2px solid ${sel?ROSE:"#e8e0e0"}`, borderRadius:8, padding:"12px 8px", textAlign:"center", cursor:"pointer", background:sel?"#fdf6f6":"#fff", transition:"all 0.2s" }),
    tipoGrid: { display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10, marginBottom:16 },
    tipoCard: (sel) => ({ border:`2px solid ${sel?ROSE:"#e8e0e0"}`, borderRadius:8, padding:"16px", cursor:"pointer", background:sel?"#fdf6f6":"#fff" }),
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.header}>
          <div style={s.progress}>
            {[1,2,3].map(n => <div key={n} style={s.progBar(passo===n, passo>n)}/>)}
          </div>
          <div style={{fontSize:18,fontWeight:300,color:"#fff",letterSpacing:3,textTransform:"uppercase"}}>
            {passo===1 && "Seus dados"}
            {passo===2 && "Especialidade"}
            {passo===3 && "Sua prática"}
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",letterSpacing:2,marginTop:2}}>
            PASSO {passo} DE 3
          </div>
        </div>

        <div style={s.body}>
          {passo===1 && (
            <>
              <p style={{fontSize:15,fontWeight:300,color:"#333",marginBottom:24,lineHeight:1.6}}>
                Bem-vindo ao <strong style={{color:ROSE}}>Medicina IA</strong>! Vamos configurar seu assistente em 3 passos rápidos.
              </p>
              <label style={s.label}>Nome completo</label>
              <input style={s.input} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Dra. Maria Silva"/>
              <label style={s.label}>CRM</label>
              <input style={s.input} value={crm} onChange={e=>setCrm(e.target.value)} placeholder="CRM-ES 12345"/>
              <label style={s.label}>Estado</label>
              <select style={{...s.input, marginBottom:24}} value={estado} onChange={e=>setEstado(e.target.value)}>
                <option value="">Selecione seu estado</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              <button style={s.btn} onClick={()=>nome&&crm&&estado&&setPasso(2)} disabled={!nome||!crm||!estado}>
                Continuar →
              </button>
            </>
          )}

          {passo===2 && (
            <>
              <p style={{fontSize:14,color:"#888",marginBottom:20,lineHeight:1.6}}>Selecione sua especialidade principal.</p>
              <div style={s.specGrid}>
                {ESPECIALIDADES.map(e=>(
                  <div key={e.value} style={s.specCard(especialidade===e.value)} onClick={()=>setEspecialidade(e.value)}>
                    <div style={{fontSize:22,marginBottom:4}}>{e.icon}</div>
                    <div style={{fontSize:11,fontWeight:600,color:especialidade===e.value?ROSE:"#555"}}>{e.label}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10}}>
                <button style={{...s.btn,background:"transparent",color:ROSE,border:`1px solid ${ROSE}`,width:"auto",padding:"13px 24px"}} onClick={()=>setPasso(1)}>← Voltar</button>
                <button style={{...s.btn,flex:1}} onClick={()=>especialidade&&setPasso(3)} disabled={!especialidade}>Continuar →</button>
              </div>
            </>
          )}

          {passo===3 && (
            <>
              <p style={{fontSize:14,color:"#888",marginBottom:20,lineHeight:1.6}}>Como você pratica medicina?</p>
              <div style={s.tipoGrid}>
                {TIPOS.map(t=>(
                  <div key={t.value} style={s.tipoCard(tipo===t.value)} onClick={()=>setTipo(t.value)}>
                    <div style={{fontSize:13,fontWeight:600,color:tipo===t.value?ROSE:"#333"}}>{t.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#fdf6f6",border:`1px solid ${ROSE}20`,borderRadius:8,padding:16,marginBottom:20}}>
                <p style={{fontSize:12,color:"#888",marginBottom:8}}>Resumo do seu perfil:</p>
                <p style={{fontSize:13,color:"#333",fontWeight:500}}>{nome}</p>
                <p style={{fontSize:12,color:"#888"}}>{crm} · {estado}</p>
                <p style={{fontSize:12,color:ROSE,fontWeight:600,marginTop:4}}>
                  {ESPECIALIDADES.find(e=>e.value===especialidade)?.icon} {ESPECIALIDADES.find(e=>e.value===especialidade)?.label}
                </p>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button style={{...s.btn,background:"transparent",color:ROSE,border:`1px solid ${ROSE}`,width:"auto",padding:"13px 24px"}} onClick={()=>setPasso(2)}>← Voltar</button>
                <button style={{...s.btnGold,flex:1}} onClick={salvar} disabled={!tipo||loading}>
                  {loading?"Configurando...":"Acessar o Assistente ✓"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
