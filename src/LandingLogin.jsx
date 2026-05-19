import React, { useState } from "react";
import { supabase } from "./auth";
import DemoAnimada from "./DemoAnimada";

const ROSE = "#B08B8C";
const GOLD = "#CCA968";

export default function LandingLogin({ onLogin }) {
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");

  const entrar = async () => {
    setLoading(true);
    setErro("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) { setErro("Email ou senha incorretos."); setLoading(false); return; }
    onLogin(data.user);
    setLoading(false);
  };

  const cadastrar = async () => {
    setLoading(true);
    setErro("");
    const { data, error } = await supabase.auth.signUp({ email, password: senha, options: { data: { nome, crm } } });
    if (error) { setErro(error.message); setLoading(false); return; }
    if (data.user) await supabase.from("medicos").update({ nome, crm }).eq("id", data.user.id);
    setMsg("Conta criada! Verifique seu email para confirmar.");
    setLoading(false);
  };

  const assinar = () => {
    window.open(`https://buy.stripe.com/test/price_1TWloLD5mev9NQlD0IWdDP0w?prefilled_email=${encodeURIComponent(email)}`, "_blank");
  };

  return (
    <div style={{fontFamily:"'Montserrat',sans-serif",color:"#333"}}>
      <nav style={{background:"#fff",padding:"16px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #f0eded",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontSize:13,fontWeight:600,letterSpacing:3,textTransform:"uppercase",color:ROSE}}>Medicina IA</div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <button onClick={()=>{setModo("login");setShowModal(true);}} style={{background:"transparent",border:"none",fontSize:13,color:"#888",cursor:"pointer",fontFamily:"'Montserrat',sans-serif",fontWeight:500}}>Entrar</button>
          <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{background:ROSE,color:"#fff",border:"none",padding:"10px 24px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1,cursor:"pointer",textTransform:"uppercase"}}>Assinar agora</button>
        </div>
      </nav>

      <section style={{background:"linear-gradient(135deg,#2c1f1f 0%,#3d2929 50%,#2c1f1f 100%)",padding:"100px 40px",textAlign:"center"}}>
        <h1 style={{fontSize:52,fontWeight:300,color:"#fff",letterSpacing:6,textTransform:"uppercase",lineHeight:1.2,marginBottom:8}}>DRA.<span style={{color:GOLD}}>FERNANDA</span><br/>JUDICE</h1>
        <p style={{fontSize:17,color:"rgba(255,255,255,0.75)",maxWidth:580,margin:"0 auto 40px",lineHeight:1.8,fontWeight:300}}>Da transcrição da consulta aos documentos clínicos prontos para assinar.</p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setModo("cadastro");setShowModal(true);}} style={{background:GOLD,color:"#2c1f1f",border:"none",padding:"16px 40px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Assinar — R$ 5.000/mês</button>
          <button onClick={()=>{setModo("login");setShowModal(true);}} style={{background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,0.3)",padding:"16px 40px",borderRadius:4,fontFamily:"'Montserrat',sans-serif",fontSize:13,fontWeight:500,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Já tenho conta</button>
        </div>
      </section>

      <section style={{padding:"80px 40px",background:"#faf8f7"}}>
        <DemoAnimada onAssinar={()=>{setModo("cadastro");setShowModal(true);}}/>
      </section>

      <footer style={{padding:"32px 40px",background:"#1a1a1a",textAlign:"center"}}>
        <p style={{fontSize:12,color:"#555",letterSpacing:1}}>© 2026 <span style={{color:GOLD}}>Medicina IA</span> · Dra. Fernanda Judice · CRM-ES 20169</p>
      </footer>

      {showModal && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div style={{background:"#fff",borderRadius:12,maxWidth:420,width:"100%",overflow:"hidden"}}>
            <div style={{background:ROSE,padding:"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:16,fontWeight:300,color:"#fff",letterSpacing:4,textTransform:"uppercase"}}>DRA. FERNANDA JUDICE</div>
              <button onClick={()=>setShowModal(false)} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.7)",fontSize:20,cursor:"pointer"}}>✕</button>
            </div>
            <div style={{padding:32}}>
              <div style={{display:"flex",marginBottom:24,borderBottom:"1px solid #f0eded"}}>
                <button onClick={()=>setModo("login")} style={{flex:1,padding:10,border:"none",background:"transparent",fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:modo==="login"?700:400,color:modo==="login"?ROSE:"#aaa",cursor:"pointer",borderBottom:modo==="login"?`2px solid ${ROSE}`:"2px solid transparent",textTransform:"uppercase"}}>Entrar</button>
                <button onClick={()=>setModo("cadastro")} style={{flex:1,padding:10,border:"none",background:"transparent",fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:modo==="cadastro"?700:400,color:modo==="cadastro"?ROSE:"#aaa",cursor:"pointer",borderBottom:modo==="cadastro"?`2px solid ${ROSE}`:"2px solid transparent",textTransform:"uppercase"}}>Criar conta</button>
              </div>
              {erro && <div style={{background:"#fdecea",border:"1px solid #e74c3c",borderRadius:4,padding:"10px 14px",color:"#c0392b",fontSize:12,marginBottom:12}}>{erro}</div>}
              {msg && <div style={{background:"#eafaf1",border:"1px solid #27ae60",borderRadius:4,padding:"10px 14px",color:"#1e8449",fontSize:12,marginBottom:12}}>{msg}</div>}
              {modo==="cadastro" && (
                <>
                  <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Nome completo</label>
                  <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} value={nome} onChange={e=>setNome(e.target.value)} placeholder="Dra. Maria Silva"/>
                  <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>CRM</label>
                  <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} value={crm} onChange={e=>setCrm(e.target.value)} placeholder="CRM-ES 12345"/>
                </>
              )}
              <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Email</label>
              <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com"/>
              <label style={{fontSize:11,fontWeight:600,color:"#888",letterSpacing:1,textTransform:"uppercase",display:"block",marginBottom:6}}>Senha</label>
              <input style={{width:"100%",border:"1px solid #e8e0e0",borderRadius:4,padding:"12px 14px",fontFamily:"'Montserrat',sans-serif",fontSize:13,outline:"none",marginBottom:16,boxSizing:"border-box",color:"#333"}} type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="••••••••"/>
              {modo==="login" && (
                <button onClick={entrar} disabled={loading} style={{width:"100%",background:ROSE,color:"#fff",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
                  {loading?"Entrando...":"Entrar"}
                </button>
              )}
              {modo==="cadastro" && (
                <>
                  <button onClick={assinar} style={{width:"100%",background:GOLD,color:"#2c1f1f",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",marginBottom:12}}>
                    ✓ Assinar — R$ 5.000/mês
                  </button>
                  <div style={{textAlign:"center",fontSize:11,color:"#ccc",margin:"8px 0"}}>JÁ PAGOU? CRIE SUA CONTA</div>
                  <button onClick={cadastrar} disabled={loading} style={{width:"100%",background:ROSE,color:"#fff",border:"none",borderRadius:4,padding:13,fontFamily:"'Montserrat',sans-serif",fontSize:12,fontWeight:700,letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>
                    {loading?"Criando conta...":"Criar conta"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
